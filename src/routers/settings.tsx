/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-04-27 21:38:21
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-05-03 11:26:14
 * @FilePath: \mmcl\src\routers\settings.tsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
import "@/App.css";
import { ThemeProvider } from "@/components/theme/theme-prov";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useRef } from "react";
import { CircleReveal } from "@/components/circle-reveal";

function SettingsLayout() {
  const iconRef = useRef<HTMLSpanElement>(null);
  const transitionContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  return (
    <motion.div
      className="w-full flex-1 h-full p-4">
        <div>
          <Button onClick={() => navigate(-1)} >Click Me</Button>
        </div>
    </motion.div>
  );  
}

export default SettingsLayout;
