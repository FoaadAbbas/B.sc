export type ApiConfig = {
  projectId?: string;
};

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      ...(init?.headers || {}),
    },
  });
  const txt = await res.text();
  const json = txt ? JSON.parse(txt) : null;
  if (!res.ok) {
    const msg = json?.error || res.statusText || "Request failed";
    throw new Error(msg);
  }
  return json as T;
}

export async function fetchProjects() {
  return api<{ id: string; name: string; createdAtISO: string }[]>("/api/projects");
}

export async function fetchZones(projectId: string) {
  return api<
    { id: string; projectId: string; name: string; type: string; parentId?: string; completionPct: number }[]
  >(`/api/zones?projectId=${encodeURIComponent(projectId)}`);
}

export async function createZone(projectId: string, body: { name: string; type: string; parentId?: string }) {
  return api(`/api/zones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projectId, ...body }),
  });
}

export async function patchZone(id: string, body: { name?: string; completionPct?: number }) {
  return api(`/api/zones/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function deleteZone(id: string) {
  return api(`/api/zones/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function fetchScans(projectId: string) {
  return api<{ id: string; name: string; sizeBytes: number; capturedAtISO: string; uploadedAtISO: string; notes?: string }[]>(
    `/api/scans?projectId=${encodeURIComponent(projectId)}`
  );
}

export async function uploadScan(projectId: string, file: File, capturedAtISO: string, notes?: string) {
  const fd = new FormData();
  fd.append("projectId", projectId);
  fd.append("capturedAtISO", capturedAtISO);
  if (notes) fd.append("notes", notes);
  fd.append("file", file);

  const res = await fetch(`/api/scans/upload`, { method: "POST", body: fd });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || res.statusText);
  return json as { id: string; name: string; sizeBytes: number; capturedAtISO: string; uploadedAtISO: string; notes?: string };
}

export async function deleteScan(id: string) {
  return api(`/api/scans/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function fetchRuns(projectId: string) {
  return api<any[]>(`/api/runs?projectId=${encodeURIComponent(projectId)}`);
}

export async function createRun(projectId: string, t1ScanId: string, t2ScanId: string, voxelSize?: number) {
  return api<{ id: string; status: string }>(`/api/runs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projectId, t1ScanId, t2ScanId, voxelSize }),
  });
}

export async function fetchDashboard(projectId: string) {
  return api<{ overallProgressPct: number; volumeChangeM3: number; forecastCompletionISO: string; productivityIndex: number; series: { t: string; progressPct: number }[] }>(
    `/api/dashboard?projectId=${encodeURIComponent(projectId)}`
  );
}

export async function fetchReports(projectId: string) {
  return api<any[]>(`/api/reports?projectId=${encodeURIComponent(projectId)}`);
}

export async function createReport(projectId: string, runId: string) {
  return api<any>(`/api/reports`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projectId, runId }),
  });
}

export async function chat(prompt: string) {
  return api<{ reply: string }>(`/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
}
