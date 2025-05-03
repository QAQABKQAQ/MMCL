/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-04-24 14:29:00
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-05-02 16:43:43
 * @FilePath: \mmcl\src\main.tsx
 * @Description: Main Router
 */
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AnimatedRoutes from "./hook/animate-routes";
import { Toaster } from "./components/ui/sonner";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AnimatedRoutes />
      <Toaster richColors />
    </BrowserRouter>
  </React.StrictMode>
);
