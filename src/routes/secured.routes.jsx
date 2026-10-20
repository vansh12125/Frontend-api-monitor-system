import { SecuredLayout } from "@/components/layout";
import { Dashboard } from "@/pages/dashboard";

export const securedRoutes = [
  {
    element: <SecuredLayout />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
    ],
  },
];