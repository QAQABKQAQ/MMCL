/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-04-24 19:39:04
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-04-27 18:34:46
 * @FilePath: \mmcl\src\components\title-bar.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Minimize, Maximize, X, Minus } from "lucide-react";
import { Button } from "./ui/button";
import { Window } from "@tauri-apps/api/window";
import ThemeToggle from "./theme/theme-toggle";
import { AnimatePresence, motion } from "motion/react";
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
  const [fullscreenIcon, setFullscreenIcon] = useState(<Maximize />);
  const window = new Window("main");
  async function handleMinimize() {
    await window.minimize();
  }

  async function handleClose() {
    await window.close();
  }

  async function toggleFullscreen() {
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

  useEffect(() => {
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
        "flex items-center justify-between select-none fixed top-0 left-0 right-0 h-16 z-50 p-4 gap-4",
        isTrashed ? "" : "bg-muted border-b border-border"
      )}
    >
      <p className="px-2 font-['Minecraft-Title']">{title}</p>
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
            className="flex items-center justify-center group hover:bg-white/30! dark:hover:bg-black/10!"
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
            className="flex items-center justify-center group hover:bg-white/30! dark:hover:bg-black/10!"
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
            className="flex items-center justify-center hover:text-red-500 group hover:bg-white/30! dark:hover:bg-black/10!"
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
