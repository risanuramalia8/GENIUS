import { useState, useRef, useEffect } from "react";
import { ArrowRight, HelpCircle, Maximize2, Minimize2 } from "lucide-react";
import { Slide } from "../types";

interface MateriTabProps {
  currentSlideIndex: number;
  setCurrentSlideIndex: (idx: number) => void;
  slides: Slide[];
  onComplete: () => void;
}

export default function MateriTab({
  onComplete,
}: MateriTabProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        // Fallback to visual-only fullscreen overlay if native API is restricted by iframe sandbox
        setIsFullscreen(true);
        console.warn("Layar penuh standar dibatasi browser, menggunakan fallback visual:", err);
      });
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {
          setIsFullscreen(false);
        });
      } else {
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Escape key fallback for visual fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {
            setIsFullscreen(false);
          });
        } else {
          setIsFullscreen(false);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  return (
    <section id="content-materi" className="fade-in max-w-6xl mx-auto w-full space-y-8">
      
      {/* Presentasi Interaktif */}
      <div 
        ref={containerRef}
        className={`transition-all duration-300 ${
          isFullscreen 
            ? "fixed inset-0 z-50 w-screen h-screen bg-slate-950 p-6 md:p-10 flex flex-col justify-center items-center space-y-6 overflow-hidden" 
            : "bg-white/35 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl p-6 md:p-8 space-y-5"
        }`}
      >
        <div className={`w-full flex justify-end ${isFullscreen ? "max-w-[90vw] md:max-w-[85vw]" : ""}`}>
          <button
            onClick={toggleFullscreen}
            className={`flex items-center gap-2 font-bold px-4 py-2.5 rounded-xl transition-all duration-300 cursor-pointer text-sm shadow-sm ${
              isFullscreen 
                ? "bg-white/10 hover:bg-white/20 text-white border border-white/15" 
                : "bg-brand-500/10 hover:bg-brand-500/20 text-brand-700 border border-brand-500/15"
            }`}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-4 h-4" />
                <span>Kecilkan Layar</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4" />
                <span>Layar Penuh</span>
              </>
            )}
          </button>
        </div>

        <div className={`relative w-full overflow-hidden rounded-2xl shadow-md border mx-auto transition-all duration-300 ${
          isFullscreen 
            ? "max-w-[90vw] md:max-w-[85vw] border-slate-800/80 shadow-2xl shadow-black/50" 
            : "max-w-none border-slate-200/50"
        }`} style={{ paddingBottom: "56.25%" }}>
          <iframe
            src="https://www.canva.com/design/DAHQAYPURuo/neEpHAlSzONYWXs_85ErTQ/view?embed"
            allowFullScreen={true}
            allow="fullscreen"
            loading="lazy"
            className="absolute top-0 left-0 w-full h-full border-0 rounded-2xl"
            title="Presentasi Interaktif Canva - Nutri-Level"
          ></iframe>
        </div>
      </div>

      {/* Navigation button to proceed */}
      <div className="flex justify-center pt-2">
        <button
          onClick={onComplete}
          className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-all duration-300 cursor-pointer text-base transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <span>Selesai Belajar & Lanjut ke Video</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Helper Tips */}
      <p className="text-center text-slate-400 font-medium text-sm flex items-center justify-center gap-1">
        <HelpCircle className="w-4 h-4 text-slate-400" />
        <span>Gunakan kontrol di dalam presentasi Canva untuk melihat materi selengkapnya atau klik tombol Layar Penuh di atas.</span>
      </p>
    </section>
  );
}
