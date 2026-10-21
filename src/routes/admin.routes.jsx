import { AdminLayout } from "@/components/layout";
import {RequestHistory,Stats,TopEndpoints,ManageApiKeys,ManageClients } from "@/pages/admin";

export const adminRoutes = [
  {
    element: <AdminLayout />,
    children: [
      { path: "endpoints", element: <TopEndpoints /> },
      { path: "stats", element: <Stats /> },
      { path: "history", element: <RequestHistory /> },
      { path: "api-keys", element: <ManageApiKeys /> },
      { path: "clients", element: <ManageClients /> },
    ],
  },
];