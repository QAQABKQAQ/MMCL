import "@/App.css";
import { ThemeProvider } from "@/components/theme/theme-prov";
import Titlebar from "@/components/title-bar";
import { motion } from "motion/react";
import Background from "@/components/layout/background";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarToggle } from "@/components/layout/sidebar-toggle";
import { Outlet } from "react-router-dom";
function RootLayOut() {

  return (
    <ThemeProvider defaultTheme="dark">
      <Titlebar isTrashed={false} title="MMCL" isMaximized={false} />
      <main className="w-full h-screen">
        <motion.div className="w-full h-full">
          <Background asChild>
            <SidebarProvider className="pt-16">
              <AppSidebar />
              <div className="relative w-full">
                <SidebarToggle className="absolute top-1/2 -translate-y-1/2" />
                <div className="w-full h-full absolute inset-0">
                  <Outlet />
                </div>
              </div>
            </SidebarProvider>
          </Background>
        </motion.div>
      </main>
    </ThemeProvider>
  );
}

export default RootLayOut;
