/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-04-24 19:39:04
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-05-02 01:00:48
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
import { useNavigate, useLocation } from "react-router-dom";
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
  const [isSettingsOpen, setIsSettingsOpen] = useState<number | null>(null); // 0 close 1 open 2 end 3 back
  const [isTransitioning, startTransition] = useTransition(); // get transition
  const [activePath, setActivePath] = useState<string | null>(null); // get active path

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
  useEffect(() => { // listen to settings open
    if (isSettingsOpen === 2) {
        router("/settings");
        setIsSettingsOpen(0);
    }
  }, [isSettingsOpen]);

  useEffect(() => { // listen to location change
    if (location.pathname === "/settings") {
      setActivePath("/settings");
    } else {
      setActivePath(null);
    }
    if (location.pathname === "/") {
      if (location.state?.back === true) {
        setIsSettingsOpen(3);
      }
    }
  }, [location]);
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
        <motion.div
          whileHover={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Button
            disabled={location.pathname === "/settings"}
            data-active={activePath === "/settings" ? "true" : "false"}
            onClick={() => {
              setIsSettingsOpen(1);
              setActivePath("/settings");
            }}
            variant={"ghost"}
            className="group data-[active=true]:bg-primary data-[active=true]:text-primary-foreground disabled:opacity-100 disabled:cursor-not-allowed"
          >
            <motion.div
              className="group-hover:scale-105 transition-transform duration-200 flex items-center gap-2"
            >
              <Settings className="h-5 w-5" /> <span>设置</span>
            </motion.div>
          </Button>
        </motion.div>
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

      {
        isSettingsOpen === 1 && (
          <motion.div
            onAnimationComplete={() => {
              // 确保动画完全完成后才设置状态
              requestAnimationFrame(() => {
                setIsSettingsOpen(2);
              });
            }}
            className="fixed top-16 left-0 w-full h-full z-50 bg-muted"
            initial={{ opacity: 0, y: "100vh" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        )
      }
      {
        isSettingsOpen === 3 && (
          <motion.div className="fixed top-16 left-0 w-full h-full z-50 bg-muted" initial={{ opacity: 1, y: 0 }} animate={{ opacity: 1, y: "100vh" }} exit={{ opacity: 0, y: 100 }} transition={{ duration: 0.3 }} />
        )
      }
    </div>
  );
}
