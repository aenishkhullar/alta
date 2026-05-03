import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Loader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const loaderRef = useRef(null);
  const counterRef = useRef(null);
  const topHalfRef = useRef(null);
  const bottomHalfRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });

    const counterObj = { value: 0 };

    // 1. Counter Animation (approx 2.4s as requested)
    tl.to(counterObj, {
      value: 100,
      duration: 2.4,
      ease: "power2.inOut",
      onUpdate: () => {
        setProgress(Math.floor(counterObj.value));
      }
    });

    // 2. Exit Animation
    // Fade out the counter
    tl.to(counterRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.5,
      ease: "power2.inOut"
    });

    // Split screen horizontally (top half slides up, bottom slides down)
    tl.to(topHalfRef.current, {
      yPercent: -100,
      duration: 1.2,
      ease: "power4.inOut"
    }, "-=0.2");

    tl.to(bottomHalfRef.current, {
      yPercent: 100,
      duration: 1.2,
      ease: "power4.inOut"
    }, "<");

    // Finally remove interaction/display
    tl.set(loaderRef.current, { display: "none" });

  }, { scope: loaderRef });

  return (
    <div 
      ref={loaderRef} 
      className="fixed inset-0 z-[9999] flex flex-col pointer-events-none select-none overflow-hidden"
    >
      {/* Background Panels */}
      <div 
        ref={topHalfRef} 
        className="absolute top-0 left-0 w-full h-[51%] bg-black pointer-events-auto"
      />
      <div 
        ref={bottomHalfRef} 
        className="absolute bottom-0 left-0 w-full h-[51%] bg-black pointer-events-auto"
      />

      {/* Counter Content - Bottom Right */}
      <div 
        ref={counterRef}
        className="absolute bottom-8 right-8 md:bottom-16 md:right-16 text-white flex items-baseline z-10"
      >
        <span className="text-[10rem] md:text-[15rem] font-black leading-none tracking-tighter">
          {progress}
        </span>
        <span className="text-4xl md:text-6xl font-bold ml-2 md:ml-4 mb-2 md:mb-6">
          %
        </span>
      </div>
    </div>
  );
};

export default Loader;
