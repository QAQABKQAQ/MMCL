import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function CircleReveal({ 
  children, 
  targetRoute, 
  color = "var(--muted)"
}: {
  children: React.ReactNode;
  targetRoute: string;
  color?: string;
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    // 计算鼠标相对于点击元素的位置
    setPosition({
      x: e.clientX - 100,
      y: e.clientY - 100
    });

    console.log(e.clientX, e.clientY);
    setIsAnimating(true);
  };

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        navigate(targetRoute);
      }, 450); // 略短于动画时间
      return () => clearTimeout(timer);
    }
  }, [isAnimating, targetRoute, navigate]);

  return (
    <div className="relative" onClick={handleClick}>
      {children}
      
      {isAnimating && (
        <motion.div
          className="fixed rounded-full"
          style={{
            top: position.y,
            left: position.x,
            backgroundColor: color,
            zIndex: 9999,
            pointerEvents: "none"
          }}
          initial={{ width: 0, height: 0, x: 0, y: 0 }}
          animate={{ 
            width: "300vw", 
            height: "300vw",
            x: "-50%", 
            y: "-50%", 
          }}
          transition={{ 
            duration: 0.5,
            ease: "easeInOut"
          }}
        />
      )}
    </div>
  );
}