/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-04-27 17:52:42
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-05-03 11:20:23
 * @FilePath: \mmcl\src\routers\home.tsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
import { motion } from "motion/react";
import { ChevronRight, Settings, Play, AlignJustify } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import StartGame from "@/components/start-game";
import { Link, useNavigate } from "react-router-dom";
import { CircleReveal } from "@/components/circle-reveal";


export default function Home() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="z-50 flex-1 h-[calc(100%)] absolute w-full">
      <ScrollArea className="flex-1 h-full w-full">
        <motion.div
          className="w-full h-full p-6 flex flex-col flex-1">

          <div className="flex mb-4 items-center gap-4 justify-center w-fit bg-background/40 dark:bg-blue-500/10 backdrop-blur-md px-4 py-3 rounded-md shadow-lg ">
            <img src="../public/steve.png" alt="User Avatar" className="w-12 h-12 rounded-md" />
            <div className="flex flex-col">
              <h1 className="text-xl font-bold font-[Minecraft-Regular]">CRETEPER</h1>
              <p className="text-sm text-muted-foreground">正版登录</p>
            </div>
            <div className="w-10 h-10 flex items-center justify-center hover:bg-blue-500/10 rounded-sm transition-colors">
              <AlignJustify className="w-5 h-5" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 w-fit mx-auto">

          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex items-center justify-center gap-4 absolute bottom-6 right-0 z-50"
          >
            <CircleReveal targetRoute="/settings" color="var(--muted)">
              <button
                className="rounded-full h-16 w-16 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 bg-muted text-foreground border-border border-1"
              >
                <span className="fade-icon">
                  <Settings className="w-4 h-4" />
                </span>
              </button>
            </CircleReveal>
            <StartGame />
          </motion.div>
        </motion.div>
      </ScrollArea>

    </motion.div>
  )
}