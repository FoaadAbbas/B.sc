export type ScanId = string;
export type AreaId = string;
export type RunId = string;

export type Scan = {
  id: ScanId;
  name: string;
  sizeBytes: number;
  capturedAtISO: string; // user-provided
  uploadedAtISO: string;
  notes?: string;
};

export type AreaNode = {
  id: AreaId;
  name: string;
  type: "site" | "floor" | "wing" | "zone";
  parentId?: AreaId;
  completionPct?: number; // 0..100 (mainly for zones)
};

export type AreaMetric = {
  areaId: AreaId;
  progressPct: number; // 0..100
  volumeChangeM3: number;
  areaChangeM2: number;
  workRatePerDay: number;
  deviationDays: number;
};

export type ComparisonRun = {
  id: RunId;
  createdAtISO: string;
  t1ScanId: ScanId;
  t2ScanId: ScanId;
  status?: "queued" | "processing" | "done" | "failed";
  error?: string;
  alignmentConfidence: "low" | "medium" | "high";
  forecastCompletionISO: string;
  overallProgressPct: number;
  volumeT1M3?: number;
  volumeT2M3?: number;
  volumeChangeM3?: number;
  metricsByArea: AreaMetric[];
};

export type AppData = {
  projectId?: string;
  scans: Scan[];
  selectedT1?: ScanId;
  selectedT2?: ScanId;
  areas: AreaNode[];
  runs: ComparisonRun[];
};
