/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-04-24 19:39:04
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-04-25 14:19:58
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
        setFullscreenIcon(isFullscreen ? <Maximize /> : <Minimize />);
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
        "flex items-center justify-between select-none fixed top-0 left-0 right-0 h-10 z-50",
        isTrashed ? "bg-transparent" : "bg-muted border-b border-border"
      )}
    >
      <p className="px-4 text-sm">{title}</p>
      <div className="flex items-center">
        <ThemeToggle />
        <Button
          onClick={handleMinimize}
          variant={"ghost"}
          size={"icon"}
          className="w-10 h-10 flex items-center justify-center rounded-none hover:bg-muted-foreground/10"
        >
          <Minus className="h-4 w-4" />
        </Button>

        <Button
          onClick={toggleFullscreen}
          variant={"ghost"}
          size={"icon"}
          className="w-10 h-10 flex items-center justify-center rounded-none hover:bg-muted-foreground/10"
        >
          <AnimatePresence>
            <motion.div
              initial={{ rotate: 0 }}
              transition={{ duration: 0.3 }}
              exit={{ rotate: 180 }}
            >
              {fullscreenIcon}
            </motion.div>
          </AnimatePresence>
        </Button>
        <Button
          onClick={handleClose}
          variant={"ghost"}
          size={"icon"}
          className="w-10 h-10 flex items-center justify-center rounded-none hover:text-white hover:bg-red-500/90!"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
