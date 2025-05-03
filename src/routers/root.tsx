/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-04-27 21:38:21
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-05-02 01:07:28
 * @FilePath: \mmcl\src\routers\root.tsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
import "@/App.css";
import { ThemeProvider } from "@/components/theme/theme-prov";
import Titlebar from "@/components/title-bar";
import { motion } from "motion/react";
import Background from "@/components/layout/background";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useOutlet } from "react-router-dom";
function RootLayOut() {
  const outlet = useOutlet();
  return (
    <ThemeProvider defaultTheme="dark">
      <Titlebar isTrashed={false} title="M M C L" isMaximized={false} />
      <main className="w-full h-screen">
        <motion.div className="w-full h-full">
          <Background asChild>
            <SidebarProvider className="pt-16">
              <div className="relative w-full">
                <div className="w-full h-full absolute inset-0">
                  {outlet}
                </div>
              </div>
            </SidebarProvider>
          </Background>
        </motion.div>
      </main>
    </ThemeProvider>
  );
}

export default RootLayOut;
