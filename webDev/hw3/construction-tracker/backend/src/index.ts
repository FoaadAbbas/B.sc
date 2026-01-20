import "dotenv/config";
import path from "path";
import fs from "fs";
import { spawn } from "child_process";
import express from "express";
import cors from "cors";
import multer from "multer";
import { WebSocketServer } from "ws";

import { connectDb } from "./db.js";
import { ProjectModel, ZoneModel, ScanModel, RunModel, ReportModel, type ZoneDoc } from "./models.js";
import { registerWs, publish } from "./realtime.js";
import { generatePdf, generateXlsx } from "./reports.js";

const PORT = Number(process.env.PORT || 4000);
const ROOT = path.resolve(process.cwd());
const UPLOAD_DIR = path.join(ROOT, "uploads");
const REPORTS_DIR = path.join(ROOT, "reports");

fs.mkdirSync(UPLOAD_DIR, { recursive: true });
fs.mkdirSync(REPORTS_DIR, { recursive: true });

import crypto from "crypto";

// keep only safe chars, prevent path traversal, keep extension
function sanitizeFilename(name: string) {
  const base = path.basename(name); // removes any folders
  return base.replace(/[^a-zA-Z0-9._-]+/g, "_");
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const safe = sanitizeFilename(file.originalname); // includes extension
    const uniq = crypto.randomBytes(6).toString("hex"); // short unique suffix
    cb(null, `${Date.now()}-${uniq}-${safe}`);
  },
});

const upload = multer({ storage });

function pickConfidence(volumeChange: number) {
  const mag = Math.abs(volumeChange);
  if (mag < 1) return "high" as const;
  if (mag < 10) return "medium" as const;
  return "low" as const;
}

function forecastDateISO(overallProgressPct: number) {
  const daysLeft = Math.round((100 - overallProgressPct) * 0.6);
  const d = new Date();
  d.setDate(d.getDate() + Math.max(0, daysLeft));
  return d.toISOString();
}

async function ensureDemoProject() {
  const existing = await ProjectModel.findOne().lean();
  if (existing) return String(existing._id);
  const p = await ProjectModel.create({ name: "Rothschild Towers", createdAtISO: new Date().toISOString() });
  const projectId = String(p._id);
  // root site
  await ZoneModel.create({
    projectId,
    name: "Rothschild Towers",
    type: "site",
    completionPct: 0,
    createdAtISO: new Date().toISOString(),
  });
  return projectId;
}

async function runPythonVolumeDiff(t1Path: string, t2Path: string, voxelSize: number) {
  const py = process.env.PYTHON_BIN || "python3";
  const script = path.join(ROOT, "python", "volume_diff.py");

  return await new Promise<{ volumeT1M3: number; volumeT2M3: number; volumeChangeM3: number }>((resolve, reject) => {
    const p = spawn(py, [script, "--t1", t1Path, "--t2", t2Path, "--voxel", String(voxelSize)], {
      stdio: ["ignore", "pipe", "pipe"],
    });

    let out = "";
    let err = "";
    p.stdout.on("data", (d) => (out += String(d)));
    p.stderr.on("data", (d) => (err += String(d)));
    p.on("close", (code) => {
      if (code !== 0 && code !== 2) {
        return reject(new Error(`Python process failed: code=${code} err=${err}`));
      }
      try {
        const parsed = JSON.parse(out.trim() || "{}");
        if (parsed.error) return reject(new Error(parsed.error));
        resolve({
          volumeT1M3: Number(parsed.volumeT1M3 || 0),
          volumeT2M3: Number(parsed.volumeT2M3 || 0),
          volumeChangeM3: Number(parsed.volumeChangeM3 || 0),
        });
      } catch (e) {
        reject(new Error(`Failed to parse python output. out=${out} err=${err}`));
      }
    });
  });
}

function calcOverallProgress(volumeT1: number, volumeT2: number) {
  if (volumeT1 <= 0 || volumeT2 <= 0) return 0;
  const delta = volumeT2 - volumeT1;
  const pct = (delta / Math.abs(volumeT1)) * 100;
  return Math.max(0, Math.min(100, pct));
}

async function getLeafZones(projectId: string): Promise<(ZoneDoc & { _id: unknown })[]> {
  const zones = await ZoneModel.find({ projectId }).lean();
  const zoneIds = new Set(zones.map((z) => String(z._id)));
  const hasChild = new Set<string>();
  for (const z of zones) {
    if (z.parentId && zoneIds.has(z.parentId)) hasChild.add(z.parentId);
  }
  return zones.filter((z) => !hasChild.has(String(z._id)));
}

async function main() {
  await connectDb();
  const demoProjectId = await ensureDemoProject();

  const app = express();
  app.use(cors());
  app.use(express.json({ limit: "2mb" }));

  // static downloads
  app.use("/downloads/reports", express.static(REPORTS_DIR));

  app.get("/api/health", (_req, res) => res.json({ ok: true }));

  // Projects
  app.get("/api/projects", async (_req, res) => {
    const projects = await ProjectModel.find().lean();
    res.json(
      projects.map((p) => ({
        id: String(p._id),
        name: p.name,
        createdAtISO: p.createdAtISO,
      }))
    );
  });

  app.post("/api/projects", async (req, res) => {
    const name = String(req.body?.name || "").trim();
    if (!name) return res.status(400).json({ error: "name is required" });
    const p = await ProjectModel.create({ name, createdAtISO: new Date().toISOString() });
    const projectId = String(p._id);
    await ZoneModel.create({
      projectId,
      name,
      type: "site",
      completionPct: 0,
      createdAtISO: new Date().toISOString(),
    });
    res.json({ id: projectId, name, createdAtISO: p.createdAtISO });
  });

  // Zones
  app.get("/api/zones", async (req, res) => {
    const projectId = String(req.query.projectId || demoProjectId);
    const zones = await ZoneModel.find({ projectId }).lean();
    res.json(
      zones.map((z) => ({
        id: String(z._id),
        projectId: z.projectId,
        name: z.name,
        type: z.type,
        parentId: z.parentId,
        completionPct: z.completionPct ?? 0,
      }))
    );
  });

  app.post("/api/zones", async (req, res) => {
    const projectId = String(req.body?.projectId || demoProjectId);
    const name = String(req.body?.name || "").trim();
    const type = String(req.body?.type || "").trim();
    const parentId = req.body?.parentId ? String(req.body.parentId) : undefined;
    if (!name) return res.status(400).json({ error: "name is required" });
    if (!type) return res.status(400).json({ error: "type is required" });

    const created = await ZoneModel.create({
      projectId,
      name,
      type,
      parentId,
      completionPct: 0,
      createdAtISO: new Date().toISOString(),
    });
    res.json({
      id: String(created._id),
      projectId,
      name,
      type,
      parentId,
      completionPct: 0,
    });
  });

  app.patch("/api/zones/:id", async (req, res) => {
    const id = String(req.params.id);
    const patch: Record<string, unknown> = {};
    if (typeof req.body?.name === "string") patch.name = req.body.name;
    if (typeof req.body?.completionPct === "number") patch.completionPct = req.body.completionPct;
    const z = await ZoneModel.findByIdAndUpdate(id, patch, { new: true }).lean();
    if (!z) return res.status(404).json({ error: "not found" });
    res.json({
      id: String(z._id),
      projectId: z.projectId,
      name: z.name,
      type: z.type,
      parentId: z.parentId,
      completionPct: z.completionPct ?? 0,
    });
  });

  app.delete("/api/zones/:id", async (req, res) => {
    const id = String(req.params.id);
    // remove node + descendants
    const zones = await ZoneModel.find().lean();
    const childrenByParent = new Map<string, string[]>();
    for (const z of zones) {
      const pid = z.parentId ? String(z.parentId) : "";
      if (!pid) continue;
      const arr = childrenByParent.get(pid) || [];
      arr.push(String(z._id));
      childrenByParent.set(pid, arr);
    }
    const toRemove = new Set<string>();
    const collect = (cur: string) => {
      toRemove.add(cur);
      for (const c of childrenByParent.get(cur) || []) collect(c);
    };
    collect(id);
    await ZoneModel.deleteMany({ _id: { $in: Array.from(toRemove) } });
    res.json({ ok: true, removed: Array.from(toRemove) });
  });

  // Scans
  app.get("/api/scans", async (req, res) => {
    const projectId = String(req.query.projectId || demoProjectId);
    const scans = await ScanModel.find({ projectId }).sort({ uploadedAtISO: -1 }).lean();
    res.json(
      scans.map((s) => ({
        id: String(s._id),
        projectId: s.projectId,
        name: s.name,
        sizeBytes: s.sizeBytes,
        capturedAtISO: s.capturedAtISO,
        uploadedAtISO: s.uploadedAtISO,
        notes: s.notes,
      }))
    );
  });

  app.post("/api/scans/upload", upload.single("file"), async (req, res) => {
    const projectId = String(req.body?.projectId || demoProjectId);
    const capturedAtISO = String(req.body?.capturedAtISO || new Date().toISOString());
    const notes = req.body?.notes ? String(req.body.notes) : undefined;
    if (!req.file) return res.status(400).json({ error: "file is required" });

    const doc = await ScanModel.create({
      projectId,
      name: req.file.originalname,
      sizeBytes: req.file.size,
      capturedAtISO,
      uploadedAtISO: new Date().toISOString(),
      notes,
      filePath: req.file.path,
    });

    res.json({
      id: String(doc._id),
      projectId,
      name: doc.name,
      sizeBytes: doc.sizeBytes,
      capturedAtISO: doc.capturedAtISO,
      uploadedAtISO: doc.uploadedAtISO,
      notes: doc.notes,
    });
  });

  app.delete("/api/scans/:id", async (req, res) => {
    const id = String(req.params.id);
    const scan = await ScanModel.findByIdAndDelete(id).lean();
    if (scan?.filePath) {
      try {
        fs.unlinkSync(scan.filePath);
      } catch {
        // ignore
      }
    }
    res.json({ ok: true });
  });

  // Runs (volume diff)
  app.get("/api/runs", async (req, res) => {
    const projectId = String(req.query.projectId || demoProjectId);
    const runs = await RunModel.find({ projectId }).sort({ createdAtISO: -1 }).lean();
    res.json(
      runs.map((r) => ({
        id: String(r._id),
        projectId: r.projectId,
        createdAtISO: r.createdAtISO,
        t1ScanId: r.t1ScanId,
        t2ScanId: r.t2ScanId,
        status: r.status,
        error: r.error,
        alignmentConfidence: r.alignmentConfidence,
        volumeT1M3: r.volumeT1M3,
        volumeT2M3: r.volumeT2M3,
        volumeChangeM3: r.volumeChangeM3,
        overallProgressPct: r.overallProgressPct,
        forecastCompletionISO: r.forecastCompletionISO,
        metricsByZone: r.metricsByZone,
      }))
    );
  });

  app.post("/api/runs", async (req, res) => {
    const projectId = String(req.body?.projectId || demoProjectId);
    const t1ScanId = String(req.body?.t1ScanId || "");
    const t2ScanId = String(req.body?.t2ScanId || "");
    const voxelSize = Number(req.body?.voxelSize || 0.05);

    if (!t1ScanId || !t2ScanId) return res.status(400).json({ error: "t1ScanId and t2ScanId are required" });
    if (t1ScanId === t2ScanId) return res.status(400).json({ error: "t1 and t2 must be different scans" });

    const created = await RunModel.create({
      projectId,
      createdAtISO: new Date().toISOString(),
      t1ScanId,
      t2ScanId,
      status: "queued",
      alignmentConfidence: "medium",
      volumeT1M3: 0,
      volumeT2M3: 0,
      volumeChangeM3: 0,
      overallProgressPct: 0,
      metricsByZone: [],
      forecastCompletionISO: undefined,
    });

    const runId = String(created._id);
    publish(projectId, { type: "run.created", runId, status: "queued" });

    // async processing (simple in-process)
    (async () => {
      try {
        await RunModel.findByIdAndUpdate(runId, { status: "processing" });
        publish(projectId, { type: "run.progress", runId, status: "processing", pct: 5 });

        const t1 = await ScanModel.findById(t1ScanId).lean();
        const t2 = await ScanModel.findById(t2ScanId).lean();
        if (!t1 || !t2) throw new Error("Missing scan files" );

        publish(projectId, { type: "run.progress", runId, status: "processing", pct: 20 });
        const volumes = await runPythonVolumeDiff(t1.filePath, t2.filePath, voxelSize);

        publish(projectId, { type: "run.progress", runId, status: "processing", pct: 75 });

        const overallProgressPct = calcOverallProgress(volumes.volumeT1M3, volumes.volumeT2M3);
        const leafZones = await getLeafZones(projectId);

        const perZoneProgress = leafZones.map((z, i) => {
          // simple heuristic: distribute overall progress
          const w = leafZones.length <= 1 ? 1 : (i + 1) / leafZones.length;
          const p = Math.max(0, Math.min(100, overallProgressPct * (0.7 + 0.6 * w)));
          return {
            zoneId: String(z._id),
            progressPct: Math.round(p * 10) / 10,
            volumeChangeM3: volumes.volumeChangeM3 / Math.max(1, leafZones.length),
          };
        });

        // update root site completionPct
        const root = await ZoneModel.findOne({ projectId, type: "site" }).lean();
        if (root) await ZoneModel.findByIdAndUpdate(String(root._id), { completionPct: overallProgressPct });

        const conf = pickConfidence(volumes.volumeChangeM3);
        const forecastCompletionISO = forecastDateISO(overallProgressPct);

        await RunModel.findByIdAndUpdate(runId, {
          status: "done",
          alignmentConfidence: conf,
          volumeT1M3: volumes.volumeT1M3,
          volumeT2M3: volumes.volumeT2M3,
          volumeChangeM3: volumes.volumeChangeM3,
          overallProgressPct,
          forecastCompletionISO,
          metricsByZone: perZoneProgress,
        });

        publish(projectId, { type: "run.done", runId, status: "done" });
      } catch (e: any) {
        await RunModel.findByIdAndUpdate(runId, { status: "failed", error: String(e?.message || e) });
        publish(projectId, { type: "run.done", runId, status: "failed", error: String(e?.message || e) });
      }
    })();

    res.json({ id: runId, status: "queued" });
  });

  // Dashboard
  app.get("/api/dashboard", async (req, res) => {
    const projectId = String(req.query.projectId || demoProjectId);
    const latest = await RunModel.findOne({ projectId, status: "done" }).sort({ createdAtISO: -1 }).lean();
    const overallProgressPct = latest?.overallProgressPct ?? 0;
    const volumeChangeM3 = latest?.volumeChangeM3 ?? 0;
    const forecastCompletionISO = latest?.forecastCompletionISO || "";

    // simple productivity index: progress per day since first run
    const firstRun = await RunModel.findOne({ projectId, status: "done" }).sort({ createdAtISO: 1 }).lean();
    let productivityIndex = 1.0;
    if (firstRun && latest) {
      const days = Math.max(1, (new Date(latest.createdAtISO).getTime() - new Date(firstRun.createdAtISO).getTime()) / (1000 * 60 * 60 * 24));
      const rate = overallProgressPct / days;
      productivityIndex = Math.round((rate / 5) * 100) / 100; // 5%/day baseline
      productivityIndex = Math.max(0, productivityIndex);
    }

    const runs = await RunModel.find({ projectId, status: "done" }).sort({ createdAtISO: 1 }).lean();
    const series = runs.map((r) => ({ t: r.createdAtISO, progressPct: r.overallProgressPct }));

    res.json({ overallProgressPct, volumeChangeM3, forecastCompletionISO, productivityIndex, series });
  });

  // Reports
  app.get("/api/reports", async (req, res) => {
    const projectId = String(req.query.projectId || demoProjectId);
    const reports = await ReportModel.find({ projectId }).sort({ createdAtISO: -1 }).lean();
    res.json(
      reports.map((r) => ({
        id: String(r._id),
        projectId: r.projectId,
        runId: r.runId,
        createdAtISO: r.createdAtISO,
        pdfUrl: `/downloads/reports/${path.basename(r.pdfPath)}`,
        xlsxUrl: `/downloads/reports/${path.basename(r.xlsxPath)}`,
      }))
    );
  });

  app.post("/api/reports", async (req, res) => {
    const projectId = String(req.body?.projectId || demoProjectId);
    const runId = String(req.body?.runId || "");
    if (!runId) return res.status(400).json({ error: "runId is required" });

    const run = await RunModel.findById(runId).lean();
    if (!run) return res.status(404).json({ error: "run not found" });
    if (run.status !== "done") return res.status(400).json({ error: "run is not done yet" });

    const zones = await ZoneModel.find({ projectId }).lean();
    const pdfPath = await generatePdf(REPORTS_DIR, run as any, zones as any);
    const xlsxPath = await generateXlsx(REPORTS_DIR, run as any, zones as any);

    const rep = await ReportModel.create({
      projectId,
      runId,
      createdAtISO: new Date().toISOString(),
      pdfPath,
      xlsxPath,
    });

    res.json({
      id: String(rep._id),
      pdfUrl: `/downloads/reports/${path.basename(pdfPath)}`,
      xlsxUrl: `/downloads/reports/${path.basename(xlsxPath)}`,
    });
  });

  // Gemini chatbot placeholder (you will plug Gemini API key later)
  app.post("/api/chat", async (req, res) => {
    const prompt = String(req.body?.prompt || "");
    if (!prompt) return res.status(400).json({ error: "prompt is required" });
    // TODO: call Gemini API here (kept as placeholder to avoid hardcoding keys)
    res.json({ reply: `Gemini integration placeholder. You said: ${prompt}` });
  });

  const server = app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
    console.log(`Demo projectId: ${demoProjectId}`);
  });

  const wss = new WebSocketServer({ server, path: "/ws" });
  registerWs(wss);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
