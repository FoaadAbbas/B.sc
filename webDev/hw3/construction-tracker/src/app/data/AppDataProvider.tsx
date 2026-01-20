import { createContext, useEffect, useMemo, useRef, useState } from "react";
import type { AppData, AreaId, AreaNode, ComparisonRun, Scan, ScanId } from "./types";
import {
  chat,
  createReport,
  createRun,
  createZone,
  deleteScan,
  deleteZone,
  fetchDashboard,
  fetchProjects,
  fetchReports,
  fetchRuns,
  fetchScans,
  fetchZones,
  patchZone,
  uploadScan,
} from "./api";

type AppDataContextValue = {
  data: AppData;
  isLoading: boolean;
  error?: string;

  // Scans
  addScan: (file: File, capturedAtISO: string, notes?: string) => Promise<void>;
  removeScan: (scanId: ScanId) => Promise<void>;
  setSelectedT1: (scanId?: ScanId) => void;
  setSelectedT2: (scanId?: ScanId) => void;

  // Zones
  addArea: (name: string, type: AreaNode["type"], parentId?: AreaId) => Promise<void>;
  renameArea: (id: AreaId, name: string) => Promise<void>;
  removeArea: (id: AreaId) => Promise<void>;
  setAreaCompletion: (id: AreaId, completionPct: number) => Promise<void>;

  // Comparison
  runComparison: () => Promise<void>;

  // Reports
  refreshReports: () => Promise<void>;
  generateReportForRun: (runId: string) => Promise<void>;

  // Chat
  sendChat: (prompt: string) => Promise<string>;

  // Dashboard
  refreshDashboard: () => Promise<void>;
  dashboard: {
    overallProgressPct: number;
    volumeChangeM3: number;
    forecastCompletionISO: string;
    productivityIndex: number;
    series: { t: string; progressPct: number }[];
  };
  reports: { id: string; createdAtISO: string; pdfUrl: string; xlsxUrl: string; runId: string }[];
};

export const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>({ scans: [], areas: [], runs: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  const [dashboard, setDashboard] = useState<AppDataContextValue["dashboard"]>({
    overallProgressPct: 0,
    volumeChangeM3: 0,
    forecastCompletionISO: "",
    productivityIndex: 1.0,
    series: [],
  });
  const [reports, setReports] = useState<AppDataContextValue["reports"]>([]);

  const projectIdRef = useRef<string | undefined>(undefined);

  async function loadAll(projectId: string) {
    const [zones, scans, runs, dash, reps] = await Promise.all([
      fetchZones(projectId),
      fetchScans(projectId),
      fetchRuns(projectId),
      fetchDashboard(projectId),
      fetchReports(projectId),
    ]);

    setData((prev) => ({
      ...prev,
      projectId,
      areas: zones.map((z) => ({
        id: z.id,
        name: z.name,
        type: z.type as AreaNode["type"],
        parentId: z.parentId,
        completionPct: z.completionPct,
      })),
      scans: scans.map((s) => ({
        id: s.id,
        name: s.name,
        sizeBytes: s.sizeBytes,
        capturedAtISO: s.capturedAtISO,
        uploadedAtISO: s.uploadedAtISO,
        notes: s.notes,
      })),
      runs: (runs || []).map((r) => ({
        id: r.id,
        createdAtISO: r.createdAtISO,
        t1ScanId: r.t1ScanId,
        t2ScanId: r.t2ScanId,
        status: r.status,
        error: r.error,
        alignmentConfidence: r.alignmentConfidence || "medium",
        forecastCompletionISO: r.forecastCompletionISO || "",
        overallProgressPct: r.overallProgressPct || 0,
        volumeT1M3: r.volumeT1M3,
        volumeT2M3: r.volumeT2M3,
        volumeChangeM3: r.volumeChangeM3,
        metricsByArea: (r.metricsByZone || []).map((m: any) => ({
          areaId: m.zoneId,
          progressPct: m.progressPct,
          volumeChangeM3: m.volumeChangeM3,
          areaChangeM2: 0,
          workRatePerDay: 0,
          deviationDays: 0,
        })),
      })) as ComparisonRun[],
    }));

    setDashboard(dash);
    setReports(
      (reps || []).map((x) => ({
        id: x.id,
        createdAtISO: x.createdAtISO,
        pdfUrl: x.pdfUrl,
        xlsxUrl: x.xlsxUrl,
        runId: x.runId,
      }))
    );
  }

  useEffect(() => {
    let ws: WebSocket | null = null;
    (async () => {
      try {
        setIsLoading(true);
        setError(undefined);
        const projects = await fetchProjects();
        const projectId = projects[0]?.id;
        if (!projectId) throw new Error("No project found");
        projectIdRef.current = projectId;
        await loadAll(projectId);

        // WebSocket for realtime run updates
        ws = new WebSocket(`ws://localhost:4000/ws?projectId=${encodeURIComponent(projectId)}`);
        ws.onmessage = async (ev) => {
          try {
            const msg = JSON.parse(String(ev.data));
            if (msg?.type === "run.done" || msg?.type === "run.created") {
              await loadAll(projectId);
            }
          } catch {
            // ignore
          }
        };

      } catch (e: any) {
        setError(String(e?.message || e));
      } finally {
        setIsLoading(false);
      }
    })();

    return () => {
      try {
        ws?.close();
      } catch {
        // ignore
      }
    };
  }, []);

  const api = useMemo<AppDataContextValue>(() => {
    const getProjectId = () => {
      const pid = projectIdRef.current || data.projectId;
      if (!pid) throw new Error("projectId not loaded");
      return pid;
    };

    return {
      data,
      isLoading,
      error,
      dashboard,
      reports,

      addScan: async (file, capturedAtISO, notes) => {
        const projectId = getProjectId();
        await uploadScan(projectId, file, capturedAtISO, notes);
        await loadAll(projectId);
      },

      removeScan: async (scanId) => {
        const projectId = getProjectId();
        await deleteScan(scanId);
        setData((prev) => ({
          ...prev,
          selectedT1: prev.selectedT1 === scanId ? undefined : prev.selectedT1,
          selectedT2: prev.selectedT2 === scanId ? undefined : prev.selectedT2,
        }));
        await loadAll(projectId);
      },

      setSelectedT1: (scanId) => setData((p) => ({ ...p, selectedT1: scanId })),
      setSelectedT2: (scanId) => setData((p) => ({ ...p, selectedT2: scanId })),

      addArea: async (name, type, parentId) => {
        const projectId = getProjectId();
        await createZone(projectId, { name, type, parentId });
        await loadAll(projectId);
      },

      renameArea: async (id, name) => {
        const projectId = getProjectId();
        await patchZone(id, { name });
        await loadAll(projectId);
      },

      removeArea: async (id) => {
        const projectId = getProjectId();
        await deleteZone(id);
        await loadAll(projectId);
      },

      setAreaCompletion: async (id, completionPct) => {
        const projectId = getProjectId();
        await patchZone(id, { completionPct });
        await loadAll(projectId);
      },

      runComparison: async () => {
        const projectId = getProjectId();
        const t1 = data.selectedT1;
        const t2 = data.selectedT2;
        if (!t1 || !t2 || t1 === t2) throw new Error("Select two different scans");
        await createRun(projectId, t1, t2, 0.05);
        // results will arrive via websocket; refresh now anyway
        await loadAll(projectId);
      },

      refreshReports: async () => {
        const projectId = getProjectId();
        const reps = await fetchReports(projectId);
        setReports(
          (reps || []).map((x) => ({
            id: x.id,
            createdAtISO: x.createdAtISO,
            pdfUrl: x.pdfUrl,
            xlsxUrl: x.xlsxUrl,
            runId: x.runId,
          }))
        );
      },

      generateReportForRun: async (runId) => {
        const projectId = getProjectId();
        await createReport(projectId, runId);
        await loadAll(projectId);
      },

      sendChat: async (prompt) => {
        const r = await chat(prompt);
        return r.reply;
      },

      refreshDashboard: async () => {
        const projectId = getProjectId();
        setDashboard(await fetchDashboard(projectId));
      },
    };
  }, [data, isLoading, error, dashboard, reports]);

  return <AppDataContext.Provider value={api}>{children}</AppDataContext.Provider>;
}
