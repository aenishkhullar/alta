import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';


gsap.registerPlugin(ScrollTrigger);

import projects from '../data/projects';


const ProjectsSection = ({ MagneticButton }) => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const navigate = useNavigate();

  useGSAP(
    () => {
      const cards = cardsRef.current.filter(Boolean);
      if (cards.length === 0) return;

      cards.forEach((card, i) => {
        // ── 1. Entrance animation (skip first card — it's already in view)
        if (i > 0) {
          gsap.fromTo(
            card,
            { y: 120, scale: 0.96 },
            {
              y: 0,
              scale: 1,
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                end: "top 30%",
                scrub: 1.5,
              },
            }
          );
        }

        // ── 2. Scale-down when NEXT card arrives (skip last card)
        if (i < cards.length - 1) {
          const nextCard = cards[i + 1];
          gsap.to(card, {
            scale: 0.93,
            opacity: 0.6,
            scrollTrigger: {
              trigger: nextCard,
              start: "top 85%",
              end: "top 30%",
              scrub: 1.5,
            },
          });
        }
      });
    },
    { scope: sectionRef }
  );

  // Scroll container height = number of cards × 150vh for dwell time
  const scrollHeight = `${projects.length * 150}vh`;

  return (
    <section ref={sectionRef} className="relative bg-black" id="work">
      {/* ── Section heading — sits ABOVE the scroll container ── */}
      <div className="px-6 md:px-20 pt-28 pb-16">
        <span className="text-red-600 font-mono tracking-[0.3em] text-xs uppercase block mb-4">
          // Selected Works
        </span>
        <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
          Projects
        </h2>
        <div className="h-[2px] w-16 bg-red-600 mt-6" />
      </div>

      {/* ── Scroll container — gives each card 150vh of dwell time ── */}
      <div className="relative px-4 md:px-16" style={{ height: scrollHeight }}>
        {projects.map((project, index) => (
          <div
            key={project.id}
            ref={(el) => (cardsRef.current[index] = el)}
            className="sticky w-full max-w-6xl mx-auto will-change-transform"
            style={{
              top: `${project.stickyTop}px`,
              zIndex: index + 1,
              marginBottom: "60px",
            }}
          >
            <div
              style={{
                background: "#0d0d0d",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
                padding: "48px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "48px",
                minHeight: "70vh",
              }}
            >
              {/* ── Left Column ── */}
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  {/* Tech tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {project.tech.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: "11px",
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          padding: "6px 14px",
                          borderRadius: "999px",
                          border: "1px solid rgba(255,255,255,0.2)",
                          background: "transparent",
                          color: "#ffffff",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Project number */}
                  <div
                    style={{
                      color: "#cc3333",
                      fontSize: "14px",
                      marginTop: "32px",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {String(index + 1).padStart(2, "0")} /
                  </div>

                  {/* Project title */}
                  <h3
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: "clamp(40px, 4vw, 64px)",
                      fontWeight: 700,
                      color: "#ffffff",
                      lineHeight: 1.1,
                      marginTop: "8px",
                    }}
                  >
                    {project.name}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: "16px",
                      color: "rgba(255,255,255,0.55)",
                      lineHeight: 1.7,
                      maxWidth: "380px",
                      marginTop: "16px",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {project.description}
                  </p>
                </div>

                {/* VIEW PROJECT link */}
                <div style={{ marginTop: "40px" }}>
                  <MagneticButton 
                    label="VIEW PROJECT" 
                    icon="→" 
                    onClick={() => navigate('/projects')}
                  />
                </div>
              </div>

              {/* ── Right Column: Mockup Area ── */}
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "12px",
                  overflow: "hidden",
                  position: "relative",
                  minHeight: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "24px", // Padding to prevent image touching edges
                }}
              >
                <img 
                  src={project.mainImage} 
                  alt={project.name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    opacity: 0.9,
                    transition: 'transform 0.5s ease',
                  }}
                  className="project-card-image"
                />


                {/* Subtle accent glow */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "-40px",
                    right: "-40px",
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",
                    background: "rgba(204,51,51,0.1)",
                    filter: "blur(60px)",
                  }}
                />
              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
