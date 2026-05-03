import React, { useRef, useState } from 'react';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import SplitType from 'split-type';
import ResumeModal from './ResumeModal';

gsap.registerPlugin(ScrollTrigger);

const AboutSection = ({ resumeUrl = "#", MagneticButton }) => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const paragraphRef = useRef(null);
  const statsRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);


  useGSAP(() => {
    // Top statement word-by-word reveal
    const splitText = new SplitType(headingRef.current, { types: 'words' });
    
    // Set initial state for words
    gsap.set(splitText.words, { opacity: 0.15, y: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
        end: "center 40%",
        scrub: 1,
        onComplete: () => {
          // Trigger the paragraph and stats animation when scrubbing completes
          gsap.to(paragraphRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
          });
          
          if (statsRef.current && statsRef.current.children) {
            gsap.to(statsRef.current.children, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.15,
              ease: "power2.out"
            });
          }
        }
      }
    });

    tl.to(splitText.words, {
      opacity: 1,
      y: 0,
      stagger: 0.04,
      ease: "none"
    });

    // We set paragraph and stats initial states
    gsap.set(paragraphRef.current, { opacity: 0, y: 30 });
    
    if (statsRef.current && statsRef.current.children) {
      gsap.set(statsRef.current.children, { opacity: 0, y: 20 });
    }

    // Secondary scroll trigger for paragraph/stats
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "center 50%", 
      onEnter: () => {
        gsap.to(paragraphRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out"
        });
        
        if (statsRef.current && statsRef.current.children) {
          gsap.to(statsRef.current.children, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out"
          });
        }
      },
      once: true
    });

    return () => {
      splitText.revert();
    };
  }, { scope: sectionRef });


  const handleResumeClick = () => {
    setIsModalOpen(true);
  };

  return (
    <section 
      ref={sectionRef} 
      id="about"
      className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden"
    >
      {/* Background Texture / Gradient */}
      <div 
        className="absolute inset-0 pointer-events-none z-0" 
        style={{
          background: 'radial-gradient(ellipse at 50% 60%, rgba(180, 30, 30, 0.08) 0%, transparent 70%)'
        }}
      />

      <div className="relative z-10 w-full max-w-[900px] mx-auto px-[40px] py-[120px] flex flex-col items-center">
        
        {/* Top Statement */}
        <h2 
          ref={headingRef}
          className="text-white text-center uppercase font-[800] leading-[1.15]"
          style={{ 
            fontSize: 'clamp(28px, 4vw, 52px)',
            letterSpacing: '0.02em',
          }}
        >
          WE BUILD DIGITAL EXPERIENCES THAT CONVERT, PERFORM, AND LEAVE AN IMPRESSION.
        </h2>

        {/* Paragraph */}
        <p 
          ref={paragraphRef}
          className="text-[rgba(255,255,255,0.55)] text-center text-[16px] leading-[1.8] max-w-[600px] mt-[40px] mx-auto"
        >
          I'm a MERN stack developer and creative technologist based in India.
          I focus on crafting smooth, animated front-end experiences backed by 
          modern tools. From minimal landing pages to immersive 3D product sites,
          I bring ideas to life. My work blends clean code with creative direction.
        </p>

        {/* Stats Row */}
        <div 
          ref={statsRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 mt-16 text-center w-full"
        >
          <div className="flex flex-col items-center">
            <span className="text-[48px] font-bold text-white leading-none">4+</span>
            <span className="text-[12px] text-white/50 uppercase tracking-wider mt-2">Projects Delivered</span>
          </div>
          
          <div className="hidden sm:block w-[1px] h-[50px] bg-white/10"></div>
          <div className="block sm:hidden w-[50px] h-[1px] bg-white/10"></div>
          
          <div className="flex flex-col items-center">
            <span className="text-[48px] font-bold text-white leading-none">1+</span>
            <span className="text-[12px] text-white/50 uppercase tracking-wider mt-2">Years Building</span>
          </div>
          
          <div className="hidden sm:block w-[1px] h-[50px] bg-white/10"></div>
          <div className="block sm:hidden w-[50px] h-[1px] bg-white/10"></div>
          
          <div className="flex flex-col items-center">
            <span className="text-[48px] font-bold text-white leading-none">100%</span>
            <span className="text-[12px] text-white/50 uppercase tracking-wider mt-2">Client Satisfaction</span>
          </div>
        </div>

        {/* Explore Resume Button */}
        <div className="mt-[56px]">
          <MagneticButton 
            label="EXPLORE RESUME" 
            icon="↗" 
            onClick={handleResumeClick} 
          />
        </div>

      </div>
      <ResumeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        resumeUrl={resumeUrl}
      />
    </section>
  );
};

export default AboutSection;
