import { useMemo, useState } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { useAppData } from "../../app/data/useAppData";
import type { AreaId, AreaNode } from "../../app/data/types";

function buildTree(nodes: AreaNode[]) {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const children = new Map<AreaId, AreaNode[]>();
  for (const n of nodes) {
    if (!n.parentId) continue;
    const arr = children.get(n.parentId) ?? [];
    arr.push(n);
    children.set(n.parentId, arr);
  }
  // stable order
  for (const [k, arr] of children) {
    arr.sort((a, b) => a.name.localeCompare(b.name));
    children.set(k, arr);
  }
  return { byId, children };
}

export function AreasPage() {
  const { data, addArea, renameArea, removeArea, setAreaCompletion } = useAppData();
  const tree = useMemo(() => buildTree(data.areas), [data.areas]);

  const siteRoot = data.areas.find((a) => a.type === "site");
  const [createParentId, setCreateParentId] = useState<string>(siteRoot?.id ?? "");
  const [createType, setCreateType] = useState<AreaNode["type"]>("floor");
  const [createName, setCreateName] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const allParents = data.areas.filter((a) => a.type !== "zone");

  const canCreate = createName.trim().length >= 2 && !!createParentId;

  const renderNode = (node: AreaNode, depth: number) => {
    const kids = tree.children.get(node.id) ?? [];
    const isEditing = editingId === node.id;

    return (
      <div key={node.id}>
        <div
          className={[
            "flex items-center justify-between gap-3 rounded-xl border border-zinc-900 bg-zinc-950 px-3 py-2",
            depth === 0 ? "" : "mt-2",
          ].join(" ")}
          style={{ marginLeft: depth * 14 }}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full border border-zinc-800 text-zinc-300">
                {node.type}
              </span>
              {isEditing ? (
                <input
                  autoFocus
                  className="bg-transparent border-b border-zinc-700 outline-none text-sm w-64"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      renameArea(node.id, editingName.trim() || node.name);
                      setEditingId(null);
                    }
                    if (e.key === "Escape") setEditingId(null);
                  }}
                />
              ) : (
                <span className="font-medium truncate">{node.name}</span>
              )}
              {node.type === "zone" && (
                <span className="text-xs px-2 py-0.5 rounded-full border border-zinc-800 text-zinc-200">
                  {Math.round((node.completionPct ?? 0) * 10) / 10}%
                </span>
              )}
            </div>
            <div className="text-xs text-zinc-500">
              {kids.length ? `${kids.length} child nodes` : "Leaf"}
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            {isEditing ? (
              <>
                <Button
                  className="w-auto"
                  variant="secondary"
                  onClick={() => {
                    renameArea(node.id, editingName.trim() || node.name);
                    setEditingId(null);
                  }}
                >
                  Save
                </Button>
                <Button className="w-auto" variant="secondary" onClick={() => setEditingId(null)}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  className="w-auto"
                  variant="secondary"
                  onClick={() => {
                    setEditingId(node.id);
                    setEditingName(node.name);
                  }}
                >
                  Rename
                </Button>
                {node.type === "zone" && (
                  <Button
                    className="w-auto"
                    variant="secondary"
                    onClick={() => {
                      const cur = node.completionPct ?? 0;
                      const raw = window.prompt("Set completion percentage (0-100)", String(cur));
                      if (raw == null) return;
                      const v = Number(raw);
                      if (!Number.isFinite(v)) return;
                      setAreaCompletion(node.id, Math.max(0, Math.min(100, v)));
                    }}
                  >
                    Set %
                  </Button>
                )}
                {node.type !== "site" && (
                  <Button className="w-auto" variant="secondary" onClick={() => removeArea(node.id)}>
                    Delete
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {kids.map((k) => renderNode(k, depth + 1))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold">Zones & Site Map</div>
        <div className="text-sm text-zinc-400">
          Define your site hierarchy (floors, wings, zones). This enables progress KPIs even without a BIM model.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card title="Create node" subtitle="Fast setup for demo">
          <div className="space-y-3">
            <Select label="Parent" value={createParentId} onChange={(e) => setCreateParentId(e.target.value)}>
              {allParents.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.type})
                </option>
              ))}
            </Select>

            <Select label="Type" value={createType} onChange={(e) => setCreateType(e.target.value as AreaNode["type"])}>
              <option value="floor">floor</option>
              <option value="wing">wing</option>
              <option value="zone">zone</option>
            </Select>

            <Input label="Name" value={createName} onChange={(e) => setCreateName(e.target.value)} placeholder="e.g., Floor 2" />

            <Button
              disabled={!canCreate}
              onClick={() => {
                addArea(createName.trim(), createType, createParentId || undefined);
                setCreateName("");
              }}
            >
              Add
            </Button>

            <div className="text-xs text-zinc-500">
              Recommended: Site → Floor → Wing → Zone. Only leaf nodes (type: zone) get progress metrics.
            </div>
          </div>
        </Card>

        <Card title="Zone tree" subtitle={`${data.areas.length} nodes`} className="lg:col-span-2">
          {siteRoot ? (
            <div>{renderNode(siteRoot, 0)}</div>
          ) : (
            <div className="text-sm text-zinc-400">No site root found.</div>
          )}
        </Card>
      </div>
    </div>
  );
}
