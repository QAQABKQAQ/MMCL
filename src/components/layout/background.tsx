import { Slot } from "@radix-ui/react-slot";
import { motion } from "motion/react";
import { ReactNode } from "react";

const Background = ({ asChild, children }: { asChild?: boolean, children?: ReactNode }) => {
  return (
    <motion.div className="w-full h-full relative overflow-hidden">
      {/* 内容区域 */}
      <div className="relative z-20 w-full h-full">
        {asChild ? <Slot>{children}</Slot> : children || <div>123</div>}
      </div>
    </motion.div>
  );
};

export default Background;
