import { Outlet, Link } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100 px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <div className="mb-6">
          <h1 className="text-xl font-semibold">ConsTrack</h1>
          <p className="text-sm text-zinc-400">Sign in to continue</p>
        </div>

        <Outlet />

        <div className="mt-6 text-xs text-zinc-400 flex justify-between">
          <Link to="/login" className="hover:text-zinc-200">Login</Link>
          <Link to="/register" className="hover:text-zinc-200">Register</Link>
        </div>
      </div>
    </div>
  );
}
