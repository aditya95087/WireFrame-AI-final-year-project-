import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor = () => {
  const [isPointer, setIsPointer] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const dotSpringConfig = { damping: 40, stiffness: 400 };
  const dotXSpring = useSpring(cursorX, dotSpringConfig);
  const dotYSpring = useSpring(cursorY, dotSpringConfig);

  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Check if the device has a fine pointer (like a mouse)
    if (window.matchMedia("(pointer: fine)").matches) {
      setIsPointer(true);
    } else {
      return; // Do nothing for touch devices
    }

    const moveCursor = (e) => {
      cursorX.set(e.clientX - 16); 
      cursorY.set(e.clientY - 16);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a') ||
        target.tagName.toLowerCase() === 'input' ||
        target.tagName.toLowerCase() === 'textarea' ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    // Add CSS rule to hide default cursor globally
    const style = document.createElement('style');
    style.innerHTML = `
      * {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, [cursorX, cursorY]);

  if (!isPointer) return null;

  return (
    <>
      {/* Inner Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-highlight rounded-full pointer-events-none z-[9999]"
        style={{
          x: dotXSpring,
          y: dotYSpring,
          translateX: 12,
          translateY: 12,
          boxShadow: '0 0 10px #8A2BE2'
        }}
      />
      
      {/* Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border pointer-events-none z-[9998] flex items-center justify-center backdrop-blur-[1px]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          backgroundColor: isHovering ? 'rgba(138, 43, 226, 0.15)' : 'rgba(138, 43, 226, 0.05)',
          borderColor: isHovering ? 'rgba(138, 43, 226, 1)' : 'rgba(138, 43, 226, 0.4)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
          {/* Ping effect when hovering over interactive element */}
          {isHovering && (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="w-full h-full bg-highlight/30 rounded-full animate-ping absolute"
             />
          )}
      </motion.div>
    </>
  );
};

export default CustomCursor;
