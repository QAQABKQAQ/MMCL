/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-05-03 11:07:15
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-05-14 10:34:10
 * @FilePath: \mmcl\src\hook\animate-routes.tsx
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "@/routers/home";
import SettingsLayout from "@/routers/settings";
import ErrorPage from "@/error-page";
import RootLayOut from "@/routers/root";
import VersionLayOut from "@/routers/versions";
import { AnimatePresence } from "motion/react";
// 导入其他路由组件

export default function AnimatedRoutes() {
  const location = useLocation();
  // 删除 AnimatePresence
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {" "}
        <Route path="/" element={<RootLayOut />} errorElement={<ErrorPage />}>
          <Route index element={<Home />} />
          <Route path="/settings/*" element={<SettingsLayout />} />
          <Route path="/versions" element={<VersionLayOut />} />
        </Route>
        {/* 其他路由 */}
      </Routes>
    </AnimatePresence>
  );
}
