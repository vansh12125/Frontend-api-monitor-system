import { RouterProvider } from "react-router-dom";
import { router } from "@/app";
import { useLenis } from "@/hooks";

export const App = () => {
  useLenis()
  
  return (
      <RouterProvider router={router} />
  );
};
