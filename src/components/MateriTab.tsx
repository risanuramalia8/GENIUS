import { Sparkles, AlertTriangle, HeartPulse, HelpCircle, ArrowLeft, ArrowRight, CheckCircle, Info, LucideIcon } from "lucide-react";
import { Slide } from "../types";

interface MateriTabProps {
  currentSlideIndex: number;
  setCurrentSlideIndex: (idx: number) => void;
  slides: Slide[];
  onComplete: () => void;
}

const iconMap: Record<string, LucideIcon> = {
  "sparkles": Sparkles,
  "alert-triangle": AlertTriangle,
  "heart-pulse": HeartPulse,
};

export default function MateriTab({
  currentSlideIndex,
  setCurrentSlideIndex,
  slides,
  onComplete,
}: MateriTabProps) {
  const currentSlide = slides[currentSlideIndex];
  
  if (!currentSlide) return null;

  const IconComponent = iconMap[currentSlide.icon] || Info;
  const BgIconComponent = iconMap[currentSlide.bgIcon] || Sparkles;

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else {
      onComplete();
    }
  };

  return (
    <section id="content-materi" className="fade-in max-w-4xl mx-auto w-full space-y-8">
      {/* Slide Container with modern glass shadow and elegant colors */}
      <div className="bg-white/35 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl overflow-hidden min-h-[420px] flex flex-col justify-between p-8 md:p-12 relative">
        
        {/* Beautiful background icon badge overlay */}
        <div className="absolute right-8 top-8 opacity-5 text-brand-600 pointer-events-none">
          <BgIconComponent className="w-48 h-48" />
        </div>

        {/* Header Slide Info */}
        <div className="flex items-center justify-between z-10 border-b border-white/30 pb-6">
          <span className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
            Nutri-Level Edu-Series
          </span>
          <div className="bg-white/50 backdrop-blur-sm text-brand-800 px-4 py-1 rounded-full text-xs font-bold border border-white/60">
            Materi <span id="slide-index">{currentSlideIndex + 1}</span> dari{" "}
            <span id="slide-total">{slides.length}</span>
          </div>
        </div>

        {/* Slide Content Center (Optimized for LCD with giant, elegant text) */}
        <div className="my-auto py-8 z-10 space-y-6">
          <div className="flex items-center gap-4">
            <div id="slide-badge-container" className="p-3 bg-brand-500/15 rounded-2xl text-brand-700">
              <IconComponent className="w-7 h-7" />
            </div>
            <h3 id="slide-title" className="font-display font-bold text-2xl md:text-3xl text-slate-800">
              {currentSlide.title}
            </h3>
          </div>
          <p id="slide-text" className="text-3xl md:text-4xl font-semibold leading-relaxed text-slate-800 tracking-wide">
            {currentSlide.text}
          </p>
        </div>

        {/* Slide Navigations (sleeker, more compact) */}
        <div className="flex items-center justify-between pt-6 border-t border-white/30 z-10">
          <button
            onClick={handlePrev}
            disabled={currentSlideIndex === 0}
            id="btn-prev"
            className="flex items-center gap-2 border border-slate-300 hover:border-brand-500 hover:text-brand-600 text-slate-600 font-bold px-5 py-2.5 rounded-xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Sebelumnya</span>
          </button>

          {/* Progress Dots */}
          <div className="flex gap-2.5 items-center">
            {slides.map((_, idx) => (
              <span
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`transition-all duration-300 cursor-pointer ${
                  idx === currentSlideIndex
                    ? "slide-dot w-6 h-3.5 rounded-full bg-brand-500"
                    : "slide-dot w-3.5 h-3.5 rounded-full bg-slate-200 hover:bg-slate-300"
                }`}
              ></span>
            ))}
          </div>

          <button
            onClick={handleNext}
            id="btn-next"
            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-brand-500/10 transition-all duration-300 cursor-pointer text-sm"
          >
            {currentSlideIndex === slides.length - 1 ? (
              <>
                <span>Selesai Belajar</span>
                <CheckCircle className="w-5 h-5" />
              </>
            ) : (
              <>
                <span>Selanjutnya</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>

      {/* Helper Tips */}
      <p className="text-center text-slate-400 font-medium text-sm flex items-center justify-center gap-1">
        <HelpCircle className="w-4 h-4 text-slate-400" />
        <span>Gunakan tombol di atas untuk membaca materi edukasi lainnya.</span>
      </p>
    </section>
  );
}
