import { AuthLayout } from "@/components/layout";
import { Login, Register } from "@/pages/auth";

export const authRoutes = [
  {
    element: <AuthLayout />,
    children: [
      { path: "/signin", element: <Login /> },
      { path: "/signup", element: <Register /> },
    ],
  },
];
