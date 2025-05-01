/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-04-26 16:29:20
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-05-02 00:06:06
 * @FilePath: \mmcl\src\components\theme\theme-toggle.tsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
import { useTheme } from "./theme-prov";
import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleThemeToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    const transition = document.startViewTransition(() => {
      setTheme(theme === "dark" ? "light" : "dark");
    })
    
    const x = e.clientX;
    const y = e.clientY;
    const radius = Math.sqrt(Math.max(x, (window.innerWidth - x)) ** 2 + Math.max(y, (window.innerHeight - y)) ** 2)

    document.documentElement.style.setProperty('--transition-start', '0px');
    document.documentElement.style.setProperty('--transition-end', `${radius}px`);
    document.documentElement.style.setProperty('--transition-x', `${x}px`);
    document.documentElement.style.setProperty('--transition-y', `${y}px`);

    transition.ready.then(() => {
      document.documentElement.animate({
        clipPath: [
          `circle(var(--transition-start) at var(--transition-x) var(--transition-y))`,
          `circle(var(--transition-end) at var(--transition-x) var(--transition-y))`
        ]
      }, {
        duration: 800,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        pseudoElement: '::view-transition-new(root)',
      })

      // 设置背景色
      document.documentElement.style.setProperty('--view-transition-new-background', 'var(--background)');
    })

    transition.finished.finally(() => {
      setIsTransitioning(false);
    });
  }

  return (
    <motion.div
    >
      <Button
        variant={"ghost"}
        onClick={handleThemeToggle}
        className="group"
      >
        <div className="relative w-20 h-5 overflow-hidden flex items-center justify-center">
            {theme === "dark" ? (
              <motion.div
                key="sun"

                className="absolute inset-0 flex items-center justify-center"
              >
                <Sun className="h-5 w-5 text-yellow-400 drop-shadow-md" /> <span className="pl-2">白天模式</span>
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                className="absolute inset-0 flex items-center justify-center"
              >
                <Moon className="h-5 w-5 drop-shadow-md" /> <span className="pl-2">夜间模式</span>
              </motion.div>
            )}
        </div>
      </Button>
    </motion.div>
  )
}