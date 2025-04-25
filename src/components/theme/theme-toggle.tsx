
import { useTheme } from "./theme-prov";
import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const handleThemeToggle = () => {
    theme === "dark" ? setTheme("light") : setTheme("dark");
  }

  return (
    <Button variant={"ghost"} size={"icon"} onClick={handleThemeToggle} className="rounded-none">
      {theme === "dark" ? 
      <AnimatePresence>
        <motion.div whileHover={{ rotate: 180 }} initial={{ rotate: 0 }} transition={{ duration: 0.3 }} exit={{ rotate: 180 }}>
          <Sun className={cn("h-4 w-4", theme === "dark" ? "transform-rotate-180 transition-all duration-300" : "")} />
        </motion.div>
      </AnimatePresence> : 
        <motion.div whileHover={{ rotate: 180 }} initial={{ rotate: 0 }} transition={{ duration: 0.3 }} exit={{ rotate: 180 }}>
          <Moon className={cn("h-4 w-4", theme === "light" ? "transform-rotate-180 transition-all duration-300" : "")} />
        </motion.div>
      }
    </Button>
  )
}