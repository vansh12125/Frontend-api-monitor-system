import { createBrowserRouter } from "react-router-dom";
import { authRoutes, landingRoutes, securedRoutes } from "@/routes";
import { NotFound } from "@/pages/error";
import { RootLayout } from "@/components/layout/RootLayout";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      ...authRoutes,
      ...landingRoutes,
      ...securedRoutes,
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);