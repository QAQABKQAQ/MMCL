import "@/App.css";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ThemeProvider } from "@/components/theme/theme-prov";
import Titlebar from "@/components/title-bar";
import { BaseDirectory, readFile } from "@tauri-apps/plugin-fs";
import { motion } from "motion/react";
import { useEffect } from "react";
import { useState } from "react";
function RootLayOut() {

  return (
    <ThemeProvider defaultTheme="light">
      <Titlebar isTrashed={true} title="My Minecraft Client Launcher" isMaximized={false} />
      <main className="w-full h-screen">
        <motion.div className="w-full h-full">
          <div className="w-full h-full bg-purple-500"></div>
        </motion.div>
      </main>
    </ThemeProvider>
  );
}

export default RootLayOut;
