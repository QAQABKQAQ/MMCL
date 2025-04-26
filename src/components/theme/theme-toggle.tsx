/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-04-26 16:29:20
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-04-26 20:35:35
 * @FilePath: \mmcl\src\components\theme\theme-toggle.tsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
import { useTheme } from "./theme-prov";
import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { AnimatePresence, motion } from "motion/react"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const handleThemeToggle = () => {
    // 添加转场效果
    document.body.classList.add("theme-transition");
    
    // 切换主题
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    
    // 移除过渡类，避免其他交互也有过渡
    setTimeout(() => {
      document.body.classList.remove("theme-transition");
    }, 700);
  }

  return (
    <motion.div
      whileTap={{ scale: 0.85 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Button 
        variant={"ghost"} 
        size={"icon"} 
        onClick={handleThemeToggle} 
        className=" group hover:bg-white/30! dark:hover:bg-black/10!"
      >
        <div className="relative w-5 h-5 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            {theme === "dark" ? (
              <motion.div
                key="sun"
                initial={{ y: 30, opacity: 0 }}
                animate={{ 
                  y: 0, 
                  opacity: 1,
                  transition: { 
                    type: "spring", 
                    stiffness: 200, 
                    damping: 12,
                    duration: 0.5
                  }
                }}
                exit={{ 
                  y: -30, 
                  opacity: 0,
                  transition: { duration: 0.2 } 
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Sun className="h-5 w-5 text-yellow-400 drop-shadow-md" />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ y: -30, opacity: 0 }}
                animate={{ 
                  y: 0, 
                  opacity: 1,
                  transition: { 
                    type: "spring", 
                    stiffness: 200, 
                    damping: 12,
                    duration: 0.5
                  } 
                }}
                exit={{ 
                  y: 30, 
                  opacity: 0,
                  transition: { duration: 0.2 } 
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Moon className="h-5 w-5 drop-shadow-md" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Button>
    </motion.div>
  )
}