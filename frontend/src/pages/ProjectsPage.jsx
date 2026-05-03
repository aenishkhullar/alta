import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ProjectsPage.module.css';
import Navbar from '../components/Navbar';

gsap.registerPlugin(ScrollTrigger);

import projects from '../data/projects';

const filters = [
  { key: 'all', label: 'All' },
  { key: 'webapp', label: 'Web Apps' },
  { key: 'website', label: 'Websites' },
  { key: 'landing', label: 'Landing Pages' }
];


const ProjectsPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = activeFilter === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  useEffect(() => {
    // Small delay to allow DOM to render the new filtered items before animation
    const ctx = gsap.context(() => {
      document.querySelectorAll('.' + styles.project).forEach((el, i) => {
        gsap.fromTo(el, 
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 82%',
              once: true
            }
          }
        );
      });
    });

    return () => ctx.revert();
  }, [filtered]);

  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.hero}>
          <p className={styles.label}>Selected Work</p>
          <h1 className={styles.title}>ALL<br/><span>PROJECTS</span></h1>
          <p className={styles.subtitle}>
            A collection of web experiences built with MERN, Three.js, GSAP and modern tooling.
          </p>
        </div>

        <div className={styles.filters}>
          {filters.map(f => (
            <button
              key={f.key}
              className={`${styles.filterBtn} ${activeFilter === f.key ? styles.active : ''}`}
              onClick={() => setActiveFilter(f.key)}
            >
              {f.label}
              {f.key === 'all' && (
                <span style={{fontSize:'10px',opacity:0.6,marginLeft:'4px'}}>
                  ({projects.length})
                </span>
              )}
            </button>
          ))}
        </div>

        <div>
          {filtered.map((p, i) => (
            <div key={p.id} className={styles.project}>
              
              {/* LEFT — info */}
              <div className={styles.projLeft}>
                <p className={styles.projNum}>PROJECT — {p.num} / 0{projects.length}</p>
                <span className={styles.projCat}>{p.categoryLabel}</span>
                <h2 className={styles.projName}>{p.name}</h2>
                <p className={styles.projDesc}>{p.description}</p>
                <div className={styles.stack}>
                  {p.tech.map((t, j) => (
                    <span key={j} className={styles.stackTag}>{t}</span>
                  ))}
                </div>

                
                <a
                  href={p.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.liveBtn}
                >
                  <span className={styles.liveBtnFill} />
                  <span className={styles.liveBtnText}>Live Preview</span>
                  <svg className={styles.liveBtnIcon} width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M3 13L13 3M13 3H6M13 3V10"/>
                  </svg>
                </a>
              </div>

              {/* RIGHT — screenshots */}
              <div className={styles.screenshots}>
                <div className={styles.ssMain}>
                  <div className={styles.ssBar}>
                    <span className={styles.dot} style={{background:'#ff5f56'}}/>
                    <span className={styles.dot} style={{background:'#febc2e'}}/>
                    <span className={styles.dot} style={{background:'#28c840'}}/>
                  </div>
                  {p.screenshots[0]
                    ? <img src={p.screenshots[0]} alt={p.name + ' screenshot'} />
                    : <div className={styles.ssFallback}>Screenshot coming soon</div>
                  }
                </div>
                <div className={styles.ssThumbs}>
                  {[p.screenshots[1], p.screenshots[2]].map((src, j) => (
                    <div key={j} className={styles.ssThumb}>
                      {src
                        ? <img src={src} alt="" />
                        : <div className={styles.ssThumbFallback}>View {j+1}</div>
                      }
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProjectsPage;
