/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-04-24 14:29:00
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-05-02 01:10:25
 * @FilePath: \mmcl\src\main.tsx
 * @Description: Main Router
 */
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayOut from "./routers/root";
import { Toaster } from "./components/ui/sonner";
import ErrorPage from "./error-page";
import Home from "./routers/home";
import SettingsLayOut from "./routers/settings";
import { lazy } from "react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayOut />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Suspense fallback={null}><Home /></Suspense>,
      },
      {
        path: "/settings",
        element: <Suspense fallback={null}><SettingsLayOut /></Suspense>,
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Toaster richColors />
  </React.StrictMode>
);
