import React, { useRef, useState, useEffect, useMemo } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

const techData = {
  inner: [
    { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg' },
    { name: 'GSAP', text: 'GSAP' },
    { name: 'Three.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/threejs/threejs-original.svg', invert: true }
  ],
  middle: [
    { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg' },
    { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg' },
    { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg', invert: true },
    { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' }
  ],
  outer: [
    { name: 'Express', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg', invert: true },
    { name: 'Tailwind', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg' },
    { name: 'Figma', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg' },
    { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg' },
    { name: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg', invert: true }
  ]
};

const TechBadge = ({ tech, radius, angleOffset, armIndex }) => {
  const badgeRef = useRef(null);
  const tooltipRef = useRef(null);
  
  // Calculate position on the circle
  const x = Math.cos(angleOffset) * radius;
  const y = Math.sin(angleOffset) * radius;

  const handleMouseEnter = () => {
    // We will pause the arm from the parent, but we can animate the badge here
    gsap.to(badgeRef.current, {
      scale: 1.35,
      duration: 0.3,
      ease: "back.out(2)",
      borderColor: "rgba(180,30,30,0.8)",
      boxShadow: "0 0 16px rgba(180,30,30,0.5)"
    });
    
    gsap.to(tooltipRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.2,
      display: 'block'
    });
    
    // Dispatch custom event to pause parent arm
    window.dispatchEvent(new CustomEvent('pauseOrbit', { detail: { armIndex } }));
  };

  const handleMouseLeave = () => {
    gsap.to(badgeRef.current, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
      borderColor: "rgba(255,255,255,0.15)",
      boxShadow: "none"
    });
    
    gsap.to(tooltipRef.current, {
      y: 8,
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        if (tooltipRef.current) tooltipRef.current.style.display = 'none';
      }
    });

    // Dispatch custom event to resume parent arm
    window.dispatchEvent(new CustomEvent('resumeOrbit', { detail: { armIndex } }));
  };

  return (
    <div 
      className="tech-badge absolute pointer-events-auto"
      style={{
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        transform: 'translate(-50%, -50%)',
        zIndex: 20
      }}
    >
      <div 
        ref={badgeRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="w-[52px] h-[52px] rounded-full bg-[#1a1a1a] border border-white/15 flex items-center justify-center cursor-pointer relative"
      >
        {tech.icon ? (
          <img 
            src={tech.icon} 
            alt={tech.name} 
            width="26" 
            height="26" 
            className={tech.invert ? "invert opacity-90" : ""}
          />
        ) : (
          <span className="text-[9px] font-bold text-white tracking-widest">{tech.text}</span>
        )}
      </div>
      
      {/* Tooltip */}
      <div 
        ref={tooltipRef}
        className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 bg-black/80 px-3 py-1 rounded-full text-white text-xs whitespace-nowrap opacity-0 pointer-events-none hidden"
        style={{ transform: 'translate(-50%, 8px)' }}
      >
        {tech.name}
      </div>
    </div>
  );
};

const TechStackSection = () => {
  const containerRef = useRef(null);
  const headingRef = useRef(null);
  const centerDotRef = useRef(null);
  const arm1Ref = useRef(null);
  const arm2Ref = useRef(null);
  const arm3Ref = useRef(null);
  const ringRefs = useRef([]);
  
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // Init
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Generate stars
  const stars = useMemo(() => {
    return Array.from({ length: 120 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      duration: Math.random() * 2 + 1.5,
      delay: Math.random() * 2
    }));
  }, []);

  useGSAP(() => {
    if (isMobile) return;

    // Twinkling stars
    gsap.to('.star-dot', {
      opacity: 0.05,
      duration: "random(1.5, 3.5)",
      repeat: -1,
      yoyo: true,
      stagger: { each: 0.1, from: "random" }
    });

    // Center node pulsing
    gsap.to(centerDotRef.current, {
      scale: 1.4,
      opacity: 0.5,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Split text
    const splitHeading = new SplitType(headingRef.current, { types: 'chars' });
    
    // Create orbit tweens
    const arm1Tween = gsap.to(arm1Ref.current, { rotation: 360, duration: 20, repeat: -1, ease: "none", transformOrigin: "50% 50%", paused: true });
    const arm2Tween = gsap.to(arm2Ref.current, { rotation: 360, duration: 35, repeat: -1, ease: "none", transformOrigin: "50% 50%", paused: true });
    const arm3Tween = gsap.to(arm3Ref.current, { rotation: -360, duration: 50, repeat: -1, ease: "none", transformOrigin: "50% 50%", paused: true });
    
    const tweens = [arm1Tween, arm2Tween, arm3Tween];

    // Counter rotate badges to stay upright
    gsap.to('.orbit-arm-1 .tech-badge', { rotation: -360, duration: 20, repeat: -1, ease: "none", transformOrigin: "50% 50%" });
    gsap.to('.orbit-arm-2 .tech-badge', { rotation: -360, duration: 35, repeat: -1, ease: "none", transformOrigin: "50% 50%" });
    gsap.to('.orbit-arm-3 .tech-badge', { rotation: 360, duration: 50, repeat: -1, ease: "none", transformOrigin: "50% 50%" });

    // Hover Event Listeners to pause/resume
    const handlePause = (e) => tweens[e.detail.armIndex].pause();
    const handleResume = (e) => tweens[e.detail.armIndex].resume();
    
    window.addEventListener('pauseOrbit', handlePause);
    window.addEventListener('resumeOrbit', handleResume);

    // Entrance animation
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 60%",
      once: true,
      onEnter: () => {
        // Heading
        gsap.from(splitHeading.chars, {
          y: 80,
          opacity: 0,
          rotation: 5,
          stagger: 0.06,
          ease: "power4.out",
          duration: 1
        });

        // Rings scale in
        gsap.from(ringRefs.current, {
          scale: 0,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.2)",
          transformOrigin: "50% 50%"
        });

        // Badges pop in
        gsap.from('.tech-badge', {
          scale: 0,
          opacity: 0,
          duration: 0.5,
          stagger: { amount: 0.6, from: "random" },
          ease: "back.out(2)",
          delay: 0.6,
          onComplete: () => {
            // Start orbits after entrance
            arm1Tween.play();
            arm2Tween.play();
            arm3Tween.play();
          }
        });
      }
    });

    return () => {
      window.removeEventListener('pauseOrbit', handlePause);
      window.removeEventListener('resumeOrbit', handleResume);
      splitHeading.revert();
    };
  }, { scope: containerRef, dependencies: [isMobile] });

  // Mobile Grid Entrance Animation
  useGSAP(() => {
    if (!isMobile) return;

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 70%",
      once: true,
      onEnter: () => {
        gsap.from('.mobile-badge', {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.5)"
        });
        gsap.from('.mobile-heading', {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out"
        });
      }
    });
  }, { scope: containerRef, dependencies: [isMobile] });

  // Mobile view
  if (isMobile) {
    const allTechs = [...techData.inner, ...techData.middle, ...techData.outer];
    
    return (
      <section ref={containerRef} id="stack" className="relative w-full min-h-screen bg-black py-24 px-6 overflow-hidden flex flex-col">
        <h2 className="mobile-heading text-[12vw] font-black text-white leading-[0.9] tracking-tighter mb-16">
          STACK &<br />TOOLS
        </h2>
        
        <div className="grid grid-cols-3 gap-6 w-full max-w-sm mx-auto z-10">
          {allTechs.map((tech, i) => (
            <div key={i} className="mobile-badge flex flex-col items-center gap-3">
              <div className="w-[60px] h-[60px] rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center">
                {tech.icon ? (
                  <img src={tech.icon} alt={tech.name} width="30" height="30" className={tech.invert ? "invert opacity-90" : ""} />
                ) : (
                  <span className="text-[10px] font-bold text-white tracking-widest">{tech.text}</span>
                )}
              </div>
              <span className="text-white/50 text-[11px] uppercase tracking-wider">{tech.name}</span>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={containerRef} 
      id="stack"
      className="relative w-full h-screen bg-black overflow-hidden"
    >
      {/* Background Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="star-dot absolute rounded-full bg-white pointer-events-none"
          style={{
            left: `${star.x}vw`,
            top: `${star.y}vh`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
          }}
        />
      ))}

      {/* Sanskrit Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-5">
        <p className="text-white text-5xl md:text-8xl font-serif text-center leading-loose whitespace-pre-wrap">
          {"ॐ त्र्यम्बकं यजामहे\nसुगन्धिं पुष्टिवर्धनम्।"}
        </p>
      </div>

      {/* Header */}
      <div className="absolute top-[48px] left-[48px] z-10 pointer-events-none">
        <h2 
          ref={headingRef} 
          className="text-[clamp(52px,8vw,110px)] font-black text-white leading-[0.9] tracking-[-0.03em] uppercase"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' }}
        >
          STACK &<br />TOOLS
        </h2>
      </div>

      <div className="absolute top-[60px] right-[60px] z-10 hidden md:block">
        <p className="text-[13px] text-white/35 font-medium tracking-wide">
          Technologies I use to craft digital experiences.
        </p>
      </div>

      {/* Orbital System */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[640px] pointer-events-none z-10">
        
        {/* Ring 3 (Outer) */}
        <div 
          ref={el => ringRefs.current[2] = el}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[640px] rounded-full border border-white/10"
        />
        <div ref={arm3Ref} className="orbit-arm-3 absolute inset-0">
          {techData.outer.map((tech, i) => (
            <TechBadge 
              key={tech.name} 
              tech={tech} 
              radius={320} 
              angleOffset={(i / techData.outer.length) * 2 * Math.PI} 
              armIndex={2}
            />
          ))}
        </div>

        {/* Ring 2 (Middle) */}
        <div 
          ref={el => ringRefs.current[1] = el}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] h-[440px] rounded-full border border-white/10"
        />
        <div ref={arm2Ref} className="orbit-arm-2 absolute inset-0">
          {techData.middle.map((tech, i) => (
            <TechBadge 
              key={tech.name} 
              tech={tech} 
              radius={220} 
              angleOffset={(i / techData.middle.length) * 2 * Math.PI} 
              armIndex={1}
            />
          ))}
        </div>

        {/* Ring 1 (Inner) */}
        <div 
          ref={el => ringRefs.current[0] = el}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] rounded-full border border-white/10"
        />
        <div ref={arm1Ref} className="orbit-arm-1 absolute inset-0">
          {techData.inner.map((tech, i) => (
            <TechBadge 
              key={tech.name} 
              tech={tech} 
              radius={120} 
              angleOffset={(i / techData.inner.length) * 2 * Math.PI} 
              armIndex={0}
            />
          ))}
        </div>

        {/* Center Node (Sun) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[48px] h-[48px] rounded-full bg-[rgba(180,30,30,0.15)] border border-[rgba(180,30,30,0.4)] flex items-center justify-center z-10 pointer-events-auto">
          <div ref={centerDotRef} className="w-[8px] h-[8px] rounded-full bg-[#cc3333]" />
        </div>
        
      </div>
    </section>
  );
};

export default TechStackSection;
