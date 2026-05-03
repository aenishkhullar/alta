import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Navbar = () => {
  const navRef = useRef(null);
  const containerRef = useRef(null);

  useGSAP(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      if (scrollY > 80) {
        gsap.to(navRef.current, {
          width: '60vw',
          padding: '12px 24px',
          borderRadius: '50px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          top: '20px',
          duration: 0.6,
          ease: 'power2.out',
        });
      } else {
        gsap.to(navRef.current, {
          width: '100vw',
          padding: '24px 48px',
          borderRadius: '0px',
          backgroundColor: 'transparent',
          backdropFilter: 'blur(0px)',
          border: '1px solid rgba(255, 255, 255, 0)',
          top: '0px',
          duration: 0.6,
          ease: 'power2.out',
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="fixed top-0 left-0 w-full z-[100] flex justify-center pointer-events-none">
      <nav
        ref={navRef}
        className="flex items-center justify-between w-full px-12 py-6 text-white transition-all pointer-events-auto"
      >
        <Link to="/" className="text-2xl font-bold tracking-tighter">
          Alta<span className="text-blue-500">.</span>
        </Link>

        <div className="hidden md:flex items-center gap-12 text-[11px] font-bold uppercase tracking-[0.3em] text-white/50">
          {['home', 'about', 'work', 'services', 'stack', 'contact'].map((item) => (
            <Link
              key={item}
              to={item === 'home' ? '/' : `/#${item}`}
              className="relative group transition-colors duration-300 hover:text-white"
            >
              {item}
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-600 rounded-full scale-0 transition-transform duration-300 group-hover:scale-100 shadow-[0_0_8px_rgba(220,38,38,0.8)]"></span>
            </Link>
          ))}
        </div>

        <div className="md:hidden">
          {/* Mobile Menu Icon could go here */}
          <button className="p-2">
            <div className="w-6 h-0.5 bg-white mb-1.5"></div>
            <div className="w-6 h-0.5 bg-white"></div>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
