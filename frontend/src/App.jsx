import React, { useState, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ProjectsSection from './components/ProjectsSection';
import ServicesSection from './components/ServicesSection';
import TechStackSection from './components/TechStackSection';
import ContactSection from './components/ContactSection';
import MagneticButton from './components/MagneticButton';
import resumeFile from './assets/Aenish_Resume.pdf';

import ProjectsPage from './pages/ProjectsPage';
import ServicesPage from './pages/ServicesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import ScrollToHash from './components/ScrollToHash';

gsap.registerPlugin(ScrollTrigger);

function Home({ isLoading, setIsLoading, scrollDotRef }) {
  useGSAP(() => {
    if (!isLoading) {
      ScrollTrigger.create({
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          // Drive the dot's top position from 0% to 95%
          gsap.set(scrollDotRef.current, {
            top: `${self.progress * 95}%`
          });
        }
      });
    }
  }, [isLoading, scrollDotRef]);

  return (
    <>
      {isLoading && <Loader onComplete={() => setIsLoading(false)} />}
      
      {!isLoading && (
        <>
          <Navbar />
          
          {/* Scroll Progress Indicator */}
          <div className="scroll-progress-wrapper">
            <div ref={scrollDotRef} className="scroll-progress-dot"></div>
          </div>

          {/* Main Content */}
          <main className={`transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
            <HeroSection />
            <AboutSection resumeUrl={resumeFile} MagneticButton={MagneticButton} />
            <ProjectsSection MagneticButton={MagneticButton} />
            <ServicesSection />
            <TechStackSection />
            <ContactSection />
          </main>
        </>
      )}
    </>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const scrollDotRef = useRef(null);

  return (
    <div className="relative bg-black text-white selection:bg-red-500 selection:text-white">
      <BrowserRouter>
        <ScrollToHash />
        <Routes>
          <Route path="/" element={<Home isLoading={isLoading} setIsLoading={setIsLoading} scrollDotRef={scrollDotRef} />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Phase 2 — Admin dashboard */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App