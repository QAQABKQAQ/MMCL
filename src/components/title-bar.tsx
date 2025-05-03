/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-04-24 19:39:04
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-05-02 17:04:18
 * @FilePath: \mmcl\src\components\title-bar.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState, useEffect, useTransition } from "react";
import { cn } from "@/lib/utils";
import { Minimize, Maximize, X, Minus, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { Window } from "@tauri-apps/api/window";
import ThemeToggle from "./theme/theme-toggle";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useViewTransitionState } from "react-router-dom";
export default function Titlebar({
  title,
  isMaximized,
  isTrashed,
  ...props
}: {
  title: string;
  isMaximized: boolean;
  isTrashed: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  const [fullscreenIcon, setFullscreenIcon] = useState(<Maximize />); // get fullscreen icon

  const router = useNavigate(); // get router
  const window = new Window("main"); // get window
  const location = useLocation(); // get current path
  async function handleMinimize() { // minimize window
    await window.minimize();
  }

  async function handleClose() { // close window
    await window.close();
  }

  async function toggleFullscreen() { // toggle fullscreen
    try {
      const isFullscreen = await window.isMaximized();
      if (isFullscreen) {
        await window.toggleMaximize();
        setFullscreenIcon(<Maximize />);
      } else {
        await window.toggleMaximize();
        setFullscreenIcon(<Minimize />);
      }
    } catch (error) {
      console.error("切换全屏失败:", error);
    }
  }

  useEffect(() => { // update icon
    async function updateIcon() {
      try {
        const isFullscreen = await window.isMaximized();

        // fix 全屏图标显示错误
        setFullscreenIcon(isFullscreen ? <Minimize /> : <Maximize />);
      } catch (error) {
        console.error("更新图标失败:", error);
      }
    }
    updateIcon();
  }, []);
  return (
    <div
      data-tauri-drag-region
      className={cn(
        props.className,
        "flex items-center justify-between select-none fixed top-0 left-0 right-0 h-16 z-50 p-4 gap-4 transition-colors",
        isTrashed ? "" : "bg-background border-b border-border"
      )}
    >
      <p className="px-2 font-['Minecraft-Title']">
        {title ? (
          <>
            <span className="text-orange-500">{title.slice(0, 1)}</span>
            {title.slice(1).toLowerCase()}
          </>
        ) : (
          <>
            <span className="text-orange-500">M</span>
            MCL
          </>
        )}
      </p>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <motion.div
          whileHover={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Button
            onClick={handleMinimize}
            variant={"ghost"}
            size={"icon"}
            className="flex items-center justify-center group "
          >
            <motion.div
              className="group-hover:scale-105 transition-transform duration-200"
            >
              <Minus className="h-5 w-5" />
            </motion.div>
          </Button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Button
            onClick={toggleFullscreen}
            variant={"ghost"}
            size={"icon"}
            className="flex items-center justify-center group "
          >
            <AnimatePresence>
              <motion.div
                initial={{ rotate: 0 }}
                className="group-hover:scale-105 transition-transform duration-200"
                transition={{ duration: 0.3 }}
                exit={{ rotate: 180 }}
              >
                {fullscreenIcon}
              </motion.div>
            </AnimatePresence>
          </Button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Button
            onClick={handleClose}
            variant={"ghost"}
            size={"icon"}
            className="flex items-center justify-center hover:text-red-500 group "
          >
            <motion.div
              className="group-hover:scale-105 transition-transform duration-200"
            >
              <X className="h-6 w-6" />
            </motion.div>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
