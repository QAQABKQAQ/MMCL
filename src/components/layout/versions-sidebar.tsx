import { motion } from "motion/react";

export default function VersionsSidebar() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.2 }}
        className="w-64 bg-sidebar h-full"
      >

      </motion.div>
    </>
  )
}