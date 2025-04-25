/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-04-24 14:29:00
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-04-25 14:35:01
 * @FilePath: \mmcl\src\main.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
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
