/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-04-27 17:52:42
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-04-28 16:17:02
 * @FilePath: \mmcl\src\routers\home.tsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Rocket, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {

  return (
    <>
      <ScrollArea className="flex-1 h-[calc(100%)] absolute z-50">
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full p-6 flex flex-col flex-1">

          <div className="flex mb-4 items-center gap-4">
            <img src="../public/steve.png" alt="User Avatar" className="w-16 h-16 rounded-md" />
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold font-[Minecraft-Regular]">CRETEPER</h1>
              <p className="text-sm text-muted-foreground">欢迎来到MMCL</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full">

          </div>
          <Button className="group overflow-hidden border-none shadow-lg px-6 h-16 absolute bottom-6 right-6 z-10">
            <div className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10 flex items-center justify-center gap-4">
              <Rocket className="w-5 h-5" />
              <div className="flex flex-col items-start">
                <span className="text-lg font-bold leading-none mb-0.5">启动游戏</span>
                <span className="text-xs text-muted-foreground">Minecraft 1.12.1</span>
              </div>
              <ChevronRight className="w-5 h-5 opacity-70 group-hover:translate-x-1 transition-transform" />
            </div>
          </Button>
        </motion.div>
      </ScrollArea>
    </>
  )
}