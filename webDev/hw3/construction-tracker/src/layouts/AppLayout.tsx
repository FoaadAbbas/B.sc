import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/navigation/Sidebar";
import { Topbar } from "../components/navigation/Topbar";
import { ChatWidget } from "../features/chat/components/ChatWidget";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Topbar />

      {/* Drawer sidebar overlays the page */}
      <Sidebar />

      <main className="p-4 md:p-6 max-w-7xl mx-auto">
        <Outlet />
      </main>

      <ChatWidget />
    </div>
  );
}
