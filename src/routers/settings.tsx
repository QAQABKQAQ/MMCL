/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-04-27 21:38:21
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-05-03 11:26:14
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
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useRef } from "react";
import { CircleReveal } from "@/components/circle-reveal";

function SettingsLayout() {
  const iconRef = useRef<HTMLSpanElement>(null);
  const transitionContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  return (
    <motion.div
      className="w-full flex-1 h-[calc(100%)] absolute z-50">
      {/* 创建过渡容器 */}
      <div ref={transitionContainerRef} className="home-transition-container"></div>
      <div className="w-full h-full bg-muted">
        <motion.div
          className="w-full h-full">
          <SidebarProvider className="pt-16">
            <div className="relative w-full">
              <div className="w-full h-full absolute inset-0">
                <div className="p-4">
                  <CircleReveal targetRoute="/">
                    <button
                      className="flex items-center gap-2 px-4 py-2 rounded-md bg-accent hover:bg-accent/80 transition-colors"
                    >
                      <span ref={iconRef} className="fade-icon">
                        <ChevronLeft className="w-4 h-4" />
                      </span>
                    </button>
                  </CircleReveal>
                </div>
                <Outlet />
              </div>
            </div>
          </SidebarProvider>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default SettingsLayout;
