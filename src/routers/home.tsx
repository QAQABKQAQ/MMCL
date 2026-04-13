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
import { PageLayOut, AnimateLayOut } from "@/components/layout/page-layout";

export default function Home() {
   const navigate = useNavigate();

   return (
      <PageLayOut>
         <AnimateLayOut>
            <iframe
               src="http://localhost:3001"
               className="flex-1 h-full w-full"
            ></iframe>
         </AnimateLayOut>
      </PageLayOut>
   );
}
