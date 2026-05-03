import React, { useEffect } from 'react';
import gsap from 'gsap';

const ResumeModal = ({ isOpen, onClose, resumeUrl }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Fade in animation
      gsap.fromTo(".modal-overlay", { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" });
      gsap.fromTo(".modal-content", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, delay: 0.1, ease: "power3.out" });
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      {/* Background Click to Close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="modal-content relative w-full max-w-[1000px] h-[90vh] bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0d0d0d]">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
            <h3 className="text-white font-bold tracking-tight uppercase text-sm md:text-base">
              Resume Preview — Aenish Khullar
            </h3>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href={resumeUrl} 
              download="Aenish_Resume.pdf"
              className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full text-xs font-bold uppercase transition-transform hover:scale-105 active:scale-95"
            >
              Download PDF
            </a>
            <button 
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* PDF Content */}
        <div className="flex-1 w-full bg-[#151515] overflow-y-auto custom-scrollbar">
          <object
            data={`${resumeUrl}#toolbar=0&navpanes=0&scrollbar=1`}
            type="application/pdf"
            className="w-full h-full min-h-[800px]"
          >
            <div className="flex flex-col items-center justify-center h-full p-10 text-center">
                <p className="text-white/60 mb-4">It seems your browser doesn't support PDF previews.</p>
                <a 
                  href={resumeUrl} 
                  download 
                  className="px-6 py-3 bg-red-600 text-white rounded-lg font-bold uppercase"
                >
                  Download to View
                </a>
            </div>
          </object>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-[#0d0d0d] border-t border-white/5 text-[10px] text-white/30 uppercase tracking-[0.2em] text-center">
            Digital Portfolio &copy; 2024 — Secure Document Preview
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0d0d0d;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #444;
        }
      `}} />
    </div>
  );
};

export default ResumeModal;
