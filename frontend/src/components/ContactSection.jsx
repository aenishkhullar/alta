import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from './MagneticButton';
import trishulImage from '../assets/trishul_model.avif';

gsap.registerPlugin(ScrollTrigger);

const ContactSection = () => {
  const sectionRef = useRef(null);
  const rightColRef = useRef(null);
  const trishulRef = useRef(null);
  const trishulWrapperRef = useRef(null);
  const formRef = useRef(null);
  const [btnText, setBtnText] = useState("SEND MESSAGE");
  const [quotationChecked, setQuotationChecked] = useState(false);
  const [quotationNum, setQuotationNum] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [budget, setBudget] = useState("");
  const [projectDetails, setProjectDetails] = useState("");
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('alta_quotation')
    if (saved) setQuotationNum(saved)
  }, [])

  useGSAP(() => {
    // Entrance animation for right column
    gsap.from(rightColRef.current, {
      x: 60,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
      }
    });

    // Trishul continuous float
    gsap.to(trishulRef.current, {
      y: -20,
      duration: 3,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true
    });

    // Trishul slow rotation
    gsap.set(trishulWrapperRef.current, { rotation: -2 });
    gsap.to(trishulWrapperRef.current, {
      rotation: 2,
      duration: 6,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true
    });

  }, { scope: sectionRef });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quotationChecked) return;
    setBtnText("SENDING...");
    setSubmitStatus(null);

    try {
      await api.post('/enquiry/contact', {
        name,
        email,
        projectDetails,
        budget,
        quotationNumber: quotationNum
      });
      setSubmitStatus('success');
      setBtnText("SENT ✓");
      
      const btn = formRef.current.querySelector('.magnetic-btn');
      if (btn) {
        gsap.to(btn, {
          color: "#4ade80", 
          duration: 0.3,
          onComplete: () => {
            gsap.to(btn, {
              color: "#ffffff",
              duration: 0.3,
              delay: 2,
              onComplete: () => {
                setBtnText("SEND MESSAGE");
                // Clear form
                setName(''); 
                setEmail(''); 
                setProjectDetails('');
                setBudget(''); 
                setQuotationNum('');
                setQuotationChecked(false);
                localStorage.removeItem('alta_quotation');
                
                // Reset select color
                const selectEl = formRef.current.querySelector('select');
                if(selectEl) selectEl.style.color = 'rgba(255,255,255,0.3)';
              }
            });
          }
        });
      }
    } catch (err) {
      setSubmitStatus(
        err.response?.data?.message || 'Submission failed. Please try again.'
      );
      setBtnText("SEND MESSAGE");
    }
  };

  return (
    <section ref={sectionRef} className="relative min-h-screen w-full flex flex-col bg-black overflow-hidden" id="contact">


      <div className="flex-1 w-full flex flex-col lg:flex-row relative z-10 px-8 lg:px-16 max-w-[1600px] mx-auto pt-20 pb-10">
        {/* Left Column - 45% */}
        <div className="w-full lg:w-[45%] flex items-center justify-center relative min-h-[50vh] lg:min-h-[80vh]">
          {/* Radial Red Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-red-600 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
          
          <div ref={trishulWrapperRef} className="relative z-10 flex items-center justify-center w-full">
            <img 
              ref={trishulRef}
              src={trishulImage} 
              alt="Trishul" 
              className="w-[90%] max-w-[480px] object-contain drop-shadow-[0_0_80px_rgba(180,30,30,0.9)]"
            />
          </div>
        </div>

        {/* Right Column - 55% */}
        <div ref={rightColRef} className="w-full lg:w-[55%] flex flex-col justify-center px-4 lg:pl-12 lg:pr-8 xl:pr-16 z-10 mt-8 lg:mt-0">
          
          <h4 className="text-[#cc3333] text-[12px] tracking-[0.3em] uppercase mb-6 font-semibold">
            GET IN TOUCH
          </h4>
          
          <h2 className="text-[clamp(28px,3.5vw,48px)] font-[800] text-white leading-[1.2] mb-10">
            LET'S BUILD SOMETHING DIVINE.
          </h2>

          <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col w-full max-w-xl">
            {/* Form Fields */}
            <div className="group relative border-b border-white/15 focus-within:border-[#b41e1e]/80 transition-colors duration-300 py-4 mb-2">
              <input 
                type="text" 
                placeholder="Your Name" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent text-white text-[15px] outline-none border-none placeholder:text-white/30"
              />
            </div>

            <div className="group relative border-b border-white/15 focus-within:border-[#b41e1e]/80 transition-colors duration-300 py-4 mb-2">
              <input 
                type="email" 
                placeholder="Your Email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-white text-[15px] outline-none border-none placeholder:text-white/30"
              />
            </div>

            <div className="group relative border-b border-white/15 focus-within:border-[#b41e1e]/80 transition-colors duration-300 py-4 mb-2">
              <select 
                required
                value={budget}
                className="w-full bg-transparent text-white text-[15px] outline-none border-none cursor-pointer appearance-none"
                style={{ color: budget ? "white" : "rgba(255,255,255,0.3)" }}
                onChange={(e) => {
                  setBudget(e.target.value);
                  e.target.style.color = "white";
                }}
              >
                <option value="" disabled hidden>Project Budget</option>
                <option value="<5L" className="bg-zinc-900 text-white">&lt; 5L</option>
                <option value="5-15L" className="bg-zinc-900 text-white">5 - 15L</option>
                <option value="15L+" className="bg-zinc-900 text-white">15L+</option>
              </select>
              {/* Custom dropdown arrow */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-white/30 text-xs">
                ▼
              </div>
            </div>

            <div className="group relative border-b border-white/15 focus-within:border-[#b41e1e]/80 transition-colors duration-300 py-1 mb-1">
              <textarea 
                placeholder="Tell me about your project" 
                rows="2"
                required
                value={projectDetails}
                onChange={(e) => setProjectDetails(e.target.value)}
                className="w-full bg-transparent text-white text-[15px] outline-none border-none placeholder:text-white/30 resize-none"
              ></textarea>
            </div>

            <div style={{
              borderBottom: '1px solid rgba(255,255,255,0.15)',
              padding: '16px 0',
              marginBottom: '8px',
              transition: 'border-color 0.3s'
            }}>
              <input
                type="text"
                placeholder="Quotation Number"
                value={quotationNum}
                onChange={e => setQuotationNum(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: '15px',
                  width: '100%',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: '24px 0 20px',
              padding: '16px',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.02)'
            }}>
              <input
                type="checkbox"
                id="quotationCheck"
                checked={quotationChecked}
                onChange={e => setQuotationChecked(e.target.checked)}
                style={{
                  width: '16px',
                  height: '16px',
                  accentColor: '#cc3333',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              />
              <label htmlFor="quotationCheck" style={{
                fontSize: '13px',
                color: 'rgba(255,255,255,0.55)',
                cursor: 'pointer',
                lineHeight: 1.5
              }}>
                Have you got your quotation?{' '}
                <Link
                  to="/services"
                  style={{
                    color: '#cc3333',
                    textDecoration: 'none',
                    fontWeight: 700,
                    borderBottom: '1px solid rgba(180,30,30,0.4)',
                    paddingBottom: '1px',
                    transition: 'border-color 0.2s'
                  }}
                >
                  Get Quotation →
                </Link>
              </label>
            </div>

            {!quotationChecked && (
              <p style={{
                fontSize: '11px',
                color: 'rgba(255,255,255,0.25)',
                marginTop: '8px',
                letterSpacing: '0.05em'
              }}>
                Please confirm you have reviewed your quotation before sending.
              </p>
            )}

            <div className="mt-8 w-full">
              <MagneticButton 
                label={btnText} 
                icon="↗" 
                className="!w-full justify-center border-white/20 hover:border-white/40 py-4"
                disabled={!quotationChecked}
                style={{
                  opacity: quotationChecked ? 1 : 0.35,
                  pointerEvents: quotationChecked ? 'auto' : 'none',
                  cursor: quotationChecked ? 'pointer' : 'not-allowed',
                  transition: 'opacity 0.3s'
                }}
              />
            </div>
            
            {submitStatus === 'success' && (
              <div style={{
                marginTop: '16px',
                padding: '16px',
                borderRadius: '10px',
                background: 'rgba(30,180,80,0.08)',
                border: '1px solid rgba(30,180,80,0.2)',
                fontSize: '13px',
                color: '#4ade80',
                textAlign: 'center'
              }}>
                ✓ Enquiry submitted! We will get back to you within 24 hours.
              </div>
            )}
            {submitStatus && submitStatus !== 'success' && (
              <p style={{
                marginTop: '12px',
                fontSize: '12px',
                color: '#cc3333',
                textAlign: 'center'
              }}>
                ✗ {submitStatus}
              </p>
            )}
          </form>

          {/* Contact Details Row */}
          <div className="mt-12 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-white/40 font-medium">
            <a href="mailto:alta.webstudio@gmail.com" className="hover:text-white transition-colors duration-200">
              alta.webstudio@gmail.com
            </a>
            <span className="hidden sm:block w-[1px] h-3 bg-white/20"></span>
            <span className="hover:text-white transition-colors duration-200 cursor-default">
              Amritsar, Punjab, India
            </span>
            <span className="hidden sm:block w-[1px] h-3 bg-white/20"></span>
            <span className="hover:text-white transition-colors duration-200 cursor-default">
              Available for Projects
            </span>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="w-full border-t border-white/10 py-6 px-8 lg:px-16 flex flex-col sm:flex-row justify-between items-center gap-4 z-10 bg-black relative mt-auto">
        <p className="text-[12px] text-white/30 font-medium">
          © {new Date().getFullYear()} Altaweb Studio. All rights reserved.
        </p>
        <div className="flex items-center gap-6 text-[12px] text-white/30 font-medium">
          <a href="https://github.com/aenishkhullar" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-200">GitHub</a>
          <a href="https://www.linkedin.com/in/aenish-khullar-656024276?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-200">LinkedIn</a>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
