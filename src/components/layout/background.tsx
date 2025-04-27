/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-04-27 21:29:16
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-04-27 22:14:15
 * @FilePath: \mmcl\src\components\layout\background.tsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
import { Slot } from "@radix-ui/react-slot";
import { motion, AnimatePresence } from "motion/react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useTheme } from "../theme/theme-prov";
import { GridArrayBg, GridArrayBgOption } from "@/components/layout/GridArrayBg.module.js"

const Background = ({ asChild, children }: { asChild?: boolean, children?: ReactNode }) => {
  const bgRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const bgInstanceRef = useRef<GridArrayBg | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prevTheme, setPrevTheme] = useState(theme);
  
  // 单一背景容器ID
  const backgroundId = "background-container";
  
  // 颜色设置
  const getDarkColors = () => ["#000000","#1B1B1B","#2A1E36","#3A2152","#49236D","#582688"];
  const getLightColors = () => ["#ffffff","#8c00ff","#5c298e","#9320fe","#49236D","#582688"];
  
  // 初始化背景
  useEffect(() => {
    if (!bgRef.current || bgInstanceRef.current) return;
    
    try {
      const colors = theme === 'dark' ? getDarkColors() : getLightColors();
      bgInstanceRef.current = new GridArrayBg({
        dom: backgroundId,
        colors: colors,
        loop: true
      });
    } catch (error) {
      console.error("背景初始化失败:", error);
    }
  }, []);
  
  // 处理主题变化
  useEffect(() => {
    if (theme === prevTheme || !bgRef.current) return;
    
    setPrevTheme(theme);
    setIsTransitioning(true);
    
    // 延迟400ms后更新背景，确保过渡动画已经开始
    const updateTimer = setTimeout(() => {
      try {
        // 先清除现有实例
        if (bgInstanceRef.current) {
          bgInstanceRef.current = null;
        }
        
        // 等待DOM更新一帧后再创建新实例
        requestAnimationFrame(() => {
          try {
            const colors = theme === 'dark' ? getDarkColors() : getLightColors();
            bgInstanceRef.current = new GridArrayBg({
              dom: backgroundId,
              colors: colors,
              loop: true
            });
            
            // 延迟500ms后结束过渡
            setTimeout(() => {
              setIsTransitioning(false);
            }, 500);
          } catch (error) {
            console.error("背景更新失败:", error);
            setIsTransitioning(false);
          }
        });
      } catch (error) {
        console.error("背景清除失败:", error);
        setIsTransitioning(false);
      }
    }, 400);
    
    return () => clearTimeout(updateTimer);
  }, [theme]);
  
  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* 过渡效果 */}
      <AnimatePresence>
        {isTransitioning && (
          <>
            {/* 全屏过渡层 */}
            <motion.div
              className="fixed inset-0 z-[60] pointer-events-none backdrop-blur-[1px] top-16 h-[calc(100%-4rem)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            
            {/* 纯色背景层 */}
            <motion.div
              className="absolute inset-0 z-[55] pointer-events-none top-16 h-[calc(100%-4rem)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(0,0,0,1)' : 'rgba(255,255,255,1)'
              }}
            />
          </>
        )}
      </AnimatePresence>
      
      {/* 主体内容 */}
      <motion.div
        className="w-full h-full"
        ref={bgRef}
        transition={{ duration: 0.6 }}
      >
        {/* 背景容器 - 保持ID固定 */}
        <div 
          id={backgroundId}
          className="relative z-20 w-full h-full"
        >
          {asChild ? <Slot>{children}</Slot> : children || <div>123</div>}
        </div>
      </motion.div>
    </div>
  );
};

export default Background;
