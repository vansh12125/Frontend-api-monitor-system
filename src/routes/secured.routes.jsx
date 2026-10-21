import { SecuredLayout } from "@/components/layout";
import { Dashboard,Settings,IntegrationGuide } from "@/pages/dashboard";

export const securedRoutes = [
  {
    element: <SecuredLayout />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/settings", element: <Settings /> },
      {  path: "integration-guide", element:<IntegrationGuide/>}
    ],
  },
];