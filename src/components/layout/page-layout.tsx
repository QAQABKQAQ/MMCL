import { HTMLAttributes, PropsWithChildren } from "react";
import { motion, HTMLMotionProps } from "motion/react";

export function PageLayOut({
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className="w-full h-full"
      {...props}
    >
      {children}
    </div>
  )
}

export default PageLayOut;

export function AnimateLayOut({
  children,
  needOverlay = false,
  ...props
}: PropsWithChildren<HTMLMotionProps<"div">> & { needOverlay?: boolean }) {
  return (
    <>
      <motion.div
        className="w-full h-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        {...props}
      >
        {children}
      </motion.div>
      {needOverlay && (
        <motion.div
          data-slot="overlay"
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{ duration: 0.3 }}
          className="absolute top-0 left-0 right-0 bottom-0 z-50 h-[calc(100vh-4rem-60px)] bg-white"
        />
      )}
    </>
  )
}