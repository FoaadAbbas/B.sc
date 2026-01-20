// src/components/navigation/Topbar.tsx
import { useUi } from "../../app/useUi";
import { useAuth } from "../../app/auth/AuthProvider";

export function Topbar() {
  const { toggleNav } = useUi();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur">
      <div className="px-4 md:px-6 h-14 flex items-center justify-between max-w-7xl mx-auto">
        {/* Left: Menu + title */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleNav}
            className="rounded-lg border border-zinc-800 px-3 py-2 text-sm hover:bg-zinc-900"
            aria-label="Open menu"
          >
            ☰
          </button>

          <div className="text-sm text-zinc-400">
            Construction tracking
          </div>
        </div>

        {/* Right: User + logout */}
        <div className="flex items-center gap-3">
          {user?.email && (
            <div className="text-xs text-zinc-400 hidden sm:block">
              {user.email}
            </div>
          )}

          <button
            onClick={logout}
            className="rounded-lg border border-zinc-800 px-3 py-2 text-sm hover:bg-zinc-900"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
