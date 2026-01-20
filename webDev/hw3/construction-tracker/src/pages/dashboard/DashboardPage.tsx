import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { useAppData } from "../../app/data/useAppData";
import { formatDate } from "../../app/format";

function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-4">
      <div className="text-sm text-zinc-400">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {hint && <div className="mt-1 text-xs text-zinc-500">{hint}</div>}
    </div>
  );
}

export function DashboardPage() {
  const nav = useNavigate();
  const { data, dashboard } = useAppData();
  const latest = data.runs[0];

  const overall = `${Math.round(dashboard.overallProgressPct)}%`;
  const volumeChange = `${dashboard.volumeChangeM3.toFixed(3)} m³`;
  const forecast = dashboard.forecastCompletionISO ? formatDate(dashboard.forecastCompletionISO) : "—";
  const productivity = dashboard.productivityIndex ? dashboard.productivityIndex.toFixed(2) : "1.00";

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-2xl font-semibold">Overview</div>
          <div className="text-sm text-zinc-400">
            Decision support summary based on the latest comparison run.
          </div>
        </div>

        <div className="flex gap-2">
          <Button className="w-auto" variant="secondary" onClick={() => nav("/scans")}>
            Upload scans
          </Button>
          <Button className="w-auto" onClick={() => nav("/compare")}>Run compare</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Kpi label="Overall progress" value={overall} hint="Completion percentage" />
        <Kpi label="Volume change" value={volumeChange} hint="Between baseline and latest scan" />
        <Kpi label="Forecast completion date" value={forecast} hint="Estimated project finish" />
        <Kpi label="Productivity index" value={productivity} hint="Higher is better" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card
          title="Latest run"
          subtitle={latest ? `Created: ${formatDate(latest.createdAtISO)}` : "No runs yet"}
          className="lg:col-span-2"
          right={
            <Button className="w-auto" variant="secondary" onClick={() => nav("/reports")}>
              View reports
            </Button>
          }
        >
          {!latest ? (
            <div className="text-sm text-zinc-400">
              To see KPIs, select two scans (t₁, t₂) and run a comparison.
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-zinc-400">t₁ scan</div>
                  <div className="font-medium">{data.scans.find((s) => s.id === latest.t1ScanId)?.name ?? "—"}</div>
                </div>
                <div>
                  <div className="text-zinc-400">t₂ scan</div>
                  <div className="font-medium">{data.scans.find((s) => s.id === latest.t2ScanId)?.name ?? "—"}</div>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-3">
                <div className="text-sm text-zinc-400 mb-2">Progress by zone (heat list)</div>
                <div className="space-y-2">
                  {latest.metricsByArea.slice(0, 6).map((m) => {
                    const areaName = data.areas.find((a) => a.id === m.areaId)?.name ?? `Zone ${m.areaId}`;
                    return (
                      <div key={m.areaId} className="flex items-center gap-3">
                        <div className="w-40 truncate text-sm">{areaName}</div>
                        <div className="flex-1 h-2 rounded bg-zinc-900 overflow-hidden">
                          <div className="h-2 bg-zinc-100" style={{ width: `${m.progressPct}%` }} />
                        </div>
                        <div className="w-12 text-right text-sm text-zinc-300">{m.progressPct}%</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </Card>

        <Card title="Setup checklist" subtitle="Finish these for a complete demo">
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-zinc-300">Upload scans</span>
              <span className={data.scans.length ? "text-emerald-400" : "text-zinc-500"}>
                {data.scans.length ? "Done" : "Missing"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-300">Select t₁ + t₂</span>
              <span className={data.selectedT1 && data.selectedT2 ? "text-emerald-400" : "text-zinc-500"}>
                {data.selectedT1 && data.selectedT2 ? "Done" : "Missing"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-300">Define zones</span>
              <span className={data.areas.some((a) => a.type === "zone") ? "text-emerald-400" : "text-zinc-500"}>
                {data.areas.some((a) => a.type === "zone") ? "Done" : "Optional"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-300">Run comparison</span>
              <span className={latest ? "text-emerald-400" : "text-zinc-500"}>{latest ? "Done" : "Missing"}</span>
            </div>

            <div className="pt-2">
              <Button className="w-full" onClick={() => nav("/compare")}>
                Go to Compare
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
