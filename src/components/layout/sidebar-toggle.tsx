/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-04-26 19:54:35
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-04-26 20:35:22
 * @FilePath: \mmcl\src\components\layout\sidebar-toggle.tsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
import { useSidebar } from "../ui/sidebar";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function SidebarToggle(
  {
    className,
    ...props
  }: React.HTMLAttributes<HTMLButtonElement>
) {
  const { toggleSidebar, open, state } = useSidebar();
  
  // 按钮动画变体
  const buttonVariants = {
    expanded: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.3
      }
    },
    collapsed: {
      x: -3,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.3
      }
    }
  };
  
  return(
    <button 
      onClick={() => toggleSidebar()} 
      className={cn(
        className, 
        "hover:bg-sidebar/90",
        "group h-16 w-6 bg-sidebar border-y border-r border-sidebar-border",
        "[transform:perspective(1.2em)_rotateY(5deg)]",
        "rounded-r-sm overflow-hidden",
        "flex items-center justify-center",
        "relative z-10",
        "before:content-[''] before:absolute before:inset-0 before:bg-sidebar-accent/5",
        "before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
      )}
      {...props}
    >
      <motion.div
        animate={state}
        variants={buttonVariants}
        initial={false}
        whileTap={{ scale: 0.95 }}
        className="w-full h-full flex items-center justify-center"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div 
            key={open ? "expanded" : "collapsed"}
            className="flex items-center justify-center"
            initial={{ opacity: 0, rotateY: -30 }}
            animate={{ 
              opacity: 1, 
              rotateY: 0,
              transition: { duration: 0.2 }
            }}
            exit={{ 
              opacity: 0, 
              rotateY: 30,
              transition: { duration: 0.2 }
            }}
          >
            {open ? 
              <ChevronLeft className="w-4 h-4 text-sidebar-foreground/80" /> : 
              <ChevronRight className="w-4 h-4 text-sidebar-foreground/80" />
            }
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </button>
  )
}

