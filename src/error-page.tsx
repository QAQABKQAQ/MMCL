import { useRouteError } from "react-router-dom";
import { motion } from "motion/react";
export default function ErrorPage(){
  const error = useRouteError();
  console.log(error);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center h-screen"
      >
        <h1>Oops!</h1>
        <p>错误！你...是怎么找到这里的？</p>
      </motion.div>
    </>
  );
}
