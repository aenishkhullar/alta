import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './MagneticButton.css';

const MagneticButton = ({ 
  label, 
  icon, 
  onClick, 
  variant = "outline", 
  className = "",
  ...props
}) => {
  const buttonRef = useRef(null);
  const fillRef = useRef(null);
  const textRef = useRef(null);

  const { contextSafe } = useGSAP({ scope: buttonRef });

  const handleMouseEnter = contextSafe(() => {
    // Fill animation: grow from bottom
    gsap.to(fillRef.current, {
      height: "100%",
      duration: 0.4,
      ease: "power2.inOut"
    });
    // Text color transition
    gsap.to(buttonRef.current, {
      color: "#000000",
      duration: 0.4,
      ease: "power2.inOut"
    });
  });

  const handleMouseLeave = contextSafe(() => {
    // Fill animation: shrink back to bottom
    gsap.to(fillRef.current, {
      height: "0%",
      duration: 0.35,
      ease: "power2.inOut"
    });
    // Text color transition back
    gsap.to(buttonRef.current, {
      color: "#ffffff",
      duration: 0.35,
      ease: "power2.inOut"
    });

    // Reset magnetic position
    gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.5)"
    });
  });

  const handleMouseMove = contextSafe((e) => {
    const btn = buttonRef.current;
    const rect = btn.getBoundingClientRect();
    
    // Calculate distance from center
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Distance from center
    const distX = mouseX - centerX;
    const distY = mouseY - centerY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    // Magnetic effect if within range (approx 80px)
    if (distance < 120) { // Increased slightly for better feel, user said ~80px
      gsap.to(btn, {
        x: distX * 0.3,
        y: distY * 0.3,
        duration: 0.3,
        ease: "power2.out"
      });
    } else {
      // Return if outside range
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.5)"
      });
    }
  });

  return (
    <button
      ref={buttonRef}
      className={`magnetic-btn ${variant} ${className}`}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      {...props}
    >
      <span ref={fillRef} className="btn-fill" />
      <span ref={textRef} className="btn-text">{label}</span>
      {icon && <span className="btn-icon">{icon}</span>}
    </button>
  );
};

export default MagneticButton;

