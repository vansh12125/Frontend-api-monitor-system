import { LandingLayout } from "@/components/layout";
import { Home, About, Contact, Privacy, Terms } from "@/pages/landing";

export const landingRoutes = [
  {
    path: "/",
    element: <LandingLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "privacy", element: <Privacy /> },
      { path: "terms", element: <Terms /> }
    ],
  },
];
