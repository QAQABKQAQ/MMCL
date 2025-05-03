/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-04-27 21:38:21
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-05-02 01:05:52
 * @FilePath: \mmcl\src\routers\settings.tsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
import "@/App.css";
import { ThemeProvider } from "@/components/theme/theme-prov";
import Titlebar from "@/components/title-bar";
import { motion } from "motion/react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
function SettingsLayout() {
  const nav = useNavigate();
  return (
    <main className="w-full flex-1 h-[calc(100%)] absolute z-50">
      <motion.div className="w-full h-full">
        <div className="bg-muted">
          <motion.div className="w-full h-full" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{duration: 0.5}}>
            <SidebarProvider className="pt-16">
              <div className="relative w-full">
                <div className="w-full h-full absolute inset-0">
                  <div className="">
                    <Button variant="outline" onClick={() => nav("/", {state: {back: true}})}>返回首页</Button>
                  </div>
                  <Outlet />
                </div>
              </div>
            </SidebarProvider>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}

export default SettingsLayout;
