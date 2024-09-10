import * as React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

function Root() {
  return (
    <div className="grid place-items-center w-full h-full">
      <h1 className="text-2xl text-center max-w-screen-md">
        Test any hooks/components in this playground or create your own
        components and load them in a route
      </h1>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
