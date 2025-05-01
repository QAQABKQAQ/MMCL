/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-04-24 14:29:00
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-04-28 17:41:06
 * @FilePath: \mmcl\src\main.tsx
 * @Description: Main Router
 */
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayOut from "./routers/root";
import { Toaster } from "./components/ui/sonner";
import ErrorPage from "./error-page";
import Home from "./routers/home";
import SettingsLayOut from "./routers/settings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayOut />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/settings",
        element: <SettingsLayOut />,
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
