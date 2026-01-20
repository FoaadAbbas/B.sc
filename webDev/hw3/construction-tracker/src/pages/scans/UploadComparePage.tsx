import { useMemo, useState } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { useAppData } from "../../app/data/useAppData";
import { formatBytes, formatDate } from "../../app/format";

export function UploadComparePage() {
  const { data, addScan, removeScan, setSelectedT1, setSelectedT2 } = useAppData();
  const [capturedAtISO, setCapturedAtISO] = useState(() => new Date().toISOString().slice(0, 16));
  const [notes, setNotes] = useState("");
  const [fileError, setFileError] = useState<string | null>(null);

  const canSelectT1 = useMemo(() => data.scans.some((s) => s.id === data.selectedT1), [data.scans, data.selectedT1]);
  const canSelectT2 = useMemo(() => data.scans.some((s) => s.id === data.selectedT2), [data.scans, data.selectedT2]);

  if (data.selectedT1 && !canSelectT1) setSelectedT1(undefined);
  if (data.selectedT2 && !canSelectT2) setSelectedT2(undefined);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold">Scans</div>
        <div className="text-sm text-zinc-400">
          Upload point clouds (t₁ and t₂) and select which scans to compare.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card title="Upload scan" subtitle="Metadata only (prototype)" className="lg:col-span-1">
          <div className="space-y-3">
            <Input
              label="Captured date/time"
              type="datetime-local"
              value={capturedAtISO}
              onChange={(e) => setCapturedAtISO(e.target.value)}
            />
            <Input
              label="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional"
            />

            <label className="block">
              <div className="mb-1 text-sm text-zinc-300">Point cloud file</div>
              <input
                className="block w-full text-sm text-zinc-300 file:mr-3 file:rounded-xl file:border file:border-zinc-800 file:bg-zinc-950 file:px-3 file:py-2 file:text-sm file:text-zinc-100 hover:file:bg-zinc-900"
                type="file"
                accept=".las,.laz,.ply,.e57,.pcd,.xyz,.txt,.csv"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setFileError(null);
                  try {
                    const iso = new Date(capturedAtISO).toISOString();
                    void addScan(f, iso, notes.trim() || undefined);
                    setNotes("");
                  } catch {
                    setFileError("Invalid captured date/time");
                  } finally {
                    e.target.value = "";
                  }
                }}
              />
              {fileError && <div className="mt-1 text-xs text-red-400">{fileError}</div>}
            </label>
          </div>
        </Card>

        <Card title="Active selection" subtitle="Choose scans for comparison" className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="t₁ scan"
              value={data.selectedT1 ?? ""}
              onChange={(e) => setSelectedT1(e.target.value || undefined)}
            >
              <option value="">Select…</option>
              {data.scans.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({new Date(s.capturedAtISO).toLocaleDateString()})
                </option>
              ))}
            </Select>

            <Select
              label="t₂ scan"
              value={data.selectedT2 ?? ""}
              onChange={(e) => setSelectedT2(e.target.value || undefined)}
            >
              <option value="">Select…</option>
              {data.scans.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({new Date(s.capturedAtISO).toLocaleDateString()})
                </option>
              ))}
            </Select>
          </div>

          <div className="mt-4 text-sm text-zinc-400">
            Tip: t₁ should be the earlier scan and t₂ the later scan.
          </div>
        </Card>
      </div>

      <Card title="Scan library" subtitle={`${data.scans.length} scans`}>
        {data.scans.length === 0 ? (
          <div className="text-sm text-zinc-400">No scans yet. Upload your first scan above.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-zinc-400">
                <tr className="border-b border-zinc-900">
                  <th className="text-left py-2 pr-3">Name</th>
                  <th className="text-left py-2 pr-3">Captured</th>
                  <th className="text-left py-2 pr-3">Size</th>
                  <th className="text-left py-2 pr-3">Notes</th>
                  <th className="text-left py-2 pr-3">Tags</th>
                  <th className="text-right py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.scans.map((s) => {
                  const isT1 = data.selectedT1 === s.id;
                  const isT2 = data.selectedT2 === s.id;
                  return (
                    <tr key={s.id} className="border-b border-zinc-900/70">
                      <td className="py-2 pr-3 font-medium">{s.name}</td>
                      <td className="py-2 pr-3 text-zinc-300">{formatDate(s.capturedAtISO)}</td>
                      <td className="py-2 pr-3 text-zinc-300">{formatBytes(s.sizeBytes)}</td>
                      <td className="py-2 pr-3 text-zinc-300">{s.notes ?? "—"}</td>
                      <td className="py-2 pr-3">
                        <div className="flex gap-2">
                          {isT1 && <span className="text-xs px-2 py-1 rounded-full bg-zinc-100 text-zinc-900">t₁</span>}
                          {isT2 && <span className="text-xs px-2 py-1 rounded-full bg-zinc-100 text-zinc-900">t₂</span>}
                        </div>
                      </td>
                      <td className="py-2 text-right">
                        <div className="flex gap-2 justify-end">
                          <Button className="w-auto" variant="secondary" onClick={() => setSelectedT1(s.id)}>
                            Set t₁
                          </Button>
                          <Button className="w-auto" variant="secondary" onClick={() => setSelectedT2(s.id)}>
                            Set t₂
                          </Button>
                          <Button className="w-auto" variant="secondary" onClick={() => void removeScan(s.id)}>
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
