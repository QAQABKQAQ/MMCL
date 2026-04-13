/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-04-27 21:38:21
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-05-02 16:59:37
 * @FilePath: \mmcl\src\routers\root.tsx
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import "@/App.css";
import { ThemeProvider } from "@/components/theme/theme-prov";
import Titlebar from "@/components/title-bar";
import { AnimatePresence, motion } from "motion/react";
import Background from "@/components/layout/background";
import { SidebarProvider } from "@/components/layout/app-sidebar";
import { useLocation, useOutlet } from "react-router-dom";
import { AppSidebar } from "@/components/layout/app-sidebar";
import React from "react";

function RootLayOut() {
   const ele = useOutlet();
   const location = useLocation();
   return (
      <ThemeProvider defaultTheme="dark">
         <Titlebar
            isTrashed={false}
            title="Go Together visual phone"
            isMaximized={false}
         />
         <main className="w-full h-screen">
            <motion.div className="w-full h-full">
               <SidebarProvider>
                  <div
                     data-slot="background"
                     className="w-full h-full overflow-hidden"
                  >
                     <AnimatePresence mode="wait">
                        {ele &&
                           React.cloneElement(ele, { key: location.pathname })}
                     </AnimatePresence>
                  </div>
               </SidebarProvider>
               <AppSidebar />
            </motion.div>
         </main>
      </ThemeProvider>
   );
}

export default RootLayOut;
