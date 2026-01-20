import { useState } from "react";

export function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-4 right-4 w-12 h-12 rounded-full bg-zinc-100 text-zinc-900 font-semibold shadow"
      >
        AI
      </button>

      {open && (
        <div className="fixed bottom-20 right-4 w-[92vw] max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 shadow-xl overflow-hidden">
          <div className="p-3 border-b border-zinc-900 flex items-center justify-between">
            <div className="text-sm font-medium">Assistant</div>
            <button onClick={() => setOpen(false)} className="text-zinc-400 hover:text-zinc-200 text-sm">
              Close
            </button>
          </div>
          <div className="p-3 h-72 overflow-auto text-sm text-zinc-200">
            <div className="text-zinc-400">Chat placeholder.</div>
          </div>
          <div className="p-3 border-t border-zinc-900">
            <input
              className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm outline-none"
              placeholder="Type a message..."
            />
          </div>
        </div>
      )}
    </>
  );
}
