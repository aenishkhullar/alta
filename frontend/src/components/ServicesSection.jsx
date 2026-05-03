import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useNavigate } from 'react-router-dom';

import './ServicesSection.css';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    num: '01', name: 'Full-Stack Web Development',
    tags: ['React', 'Node.js', 'MongoDB', 'REST APIs'],
    desc: 'End-to-end MERN applications, scalable REST APIs, and production-ready architectures built for performance.'
  },
  {
    num: '02', name: '3D & Motion Experiences',
    tags: ['Three.js', 'GSAP', 'WebGL', 'Anime.js'],
    desc: 'Immersive Three.js and GSAP-powered interfaces with scroll storytelling and motion that stops the scroll.'
  },
  {
    num: '03', name: 'AI-Driven Innovation',
    tags: ['OpenAI API', 'Chatbots', 'Automation'],
    desc: 'Smart AI integrations — chatbots, content generation, and workflow automation that make your product future-ready.'
  },
  {
    num: '04', name: 'UI/UX Design & Prototyping',
    tags: ['Figma', 'Tailwind', 'Design Systems'],
    desc: 'Pixel-perfect Figma-to-code interfaces designed for conversion, accessibility, and user delight.'
  },
  {
    num: '05', name: 'Performance & SEO Optimization',
    tags: ['Core Web Vitals', 'Lighthouse', 'SEO'],
    desc: 'Fast, responsive, accessible builds optimized for Core Web Vitals, search ranking, and every device.'
  }
];

const ServicesSection = () => {
  const sectionRef = useRef(null);
  const navigate = useNavigate();

  useGSAP(() => {
    gsap.from(['.svc-count', '.svc-subtitle'], {
      y: 60,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  }, { scope: sectionRef });


  return (
    <section className="svc-section" ref={sectionRef} id="services">
      <p className="svc-count">Our Services</p>
      <p className="svc-subtitle">
        Services crafted to elevate your<br/>brand to the next level.
      </p>
      {services.map((s, i) => (
        <div key={i} className="svc-row" onClick={() => navigate('/services')} style={{ cursor: 'pointer' }}>
          <span className="svc-num">{s.num}</span>
          <div className="svc-center">
            <div className="svc-name">{s.name}</div>
            <div className="svc-tags">
              {s.tags.map((t, j) => <span key={j} className="tag">{t}</span>)}
            </div>
            <div className="svc-desc">{s.desc}</div>
          </div>
          <div className="svc-arrow">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.8">
              <path d="M3 13L13 3M13 3H6M13 3V10"/>
            </svg>
          </div>
        </div>
      ))}
    </section>
  );
};

export default ServicesSection;
