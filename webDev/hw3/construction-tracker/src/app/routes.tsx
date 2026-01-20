import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import { RequireAuth } from "./auth/RequireAuth";

import { LoginPage } from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";
import { DashboardPage } from "../pages/dashboard/DashboardPage";
import { UploadComparePage } from "../pages/scans/UploadComparePage";
import { AreasPage } from "../pages/areas/AreasPage";
import { ComparePage } from "../pages/compare/ComparePage";
import { ReportsPage } from "../pages/reports/ReportsPage";
import { ChatHistoryPage } from "../pages/chat/ChatHistoryPage";

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/", element: <DashboardPage /> },
          { path: "/scans", element: <UploadComparePage /> },
          { path: "/areas", element: <AreasPage /> },
          { path: "/compare", element: <ComparePage /> },
          { path: "/reports", element: <ReportsPage /> },
          { path: "/chat", element: <ChatHistoryPage /> },
        ],
      },
    ],
  },
]);
