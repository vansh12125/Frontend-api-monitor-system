import { SecuredLayout } from "@/components/layout";
import { Dashboard,Settings } from "@/pages/dashboard";

export const securedRoutes = [
  {
    element: <SecuredLayout />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/settings", element: <Settings /> },
    ],
  },
];