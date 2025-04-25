/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-04-24 14:29:00
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-04-25 17:18:48
 * @FilePath: \mmcl\src\main.tsx
 * @Description: Main Router
 */
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayOut from "./routers/root";
import { Toaster } from "./components/ui/sonner";
import ErrorPage from "./error-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayOut />,
    errorElement: <ErrorPage />,
  }
])

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Toaster richColors />
  </React.StrictMode>
);
