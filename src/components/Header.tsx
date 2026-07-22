import { useState } from "react";
import { BookOpen, Trophy, Music, Volume1, Video, Sparkles, X } from "lucide-react";

interface HeaderProps {
  activeTab: "materi" | "video" | "kuis";
  setActiveTab: (tab: "materi" | "video" | "kuis") => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
  onGoHome: () => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  isMusicPlaying,
  onToggleMusic,
  volume,
  onVolumeChange,
  onGoHome,
}: HeaderProps) {
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);

  return (
    <header className="bg-transparent border-b border-transparent shadow-none sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo / Branding */}
        <div 
          onClick={onGoHome}
          className="flex items-center gap-3 cursor-pointer select-none hover:opacity-85 active:scale-[0.98] transition-all duration-200"
          title="Kembali ke Beranda Depan"
        >
          <div className="w-10 h-10 flex items-center justify-center shrink-0 rounded-xl overflow-hidden bg-white/80 p-1 shadow-md border border-white/40">
            <img
              src="/Logo GENIUS.png"
              alt="Logo GENIUS"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl tracking-tight text-slate-800 leading-none">GENIUS</h2>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
              Game Edukasi Nutri-Level
            </p>
          </div>
        </div>

        {/* Central Segmented Navigation Tabs */}
        <div className="relative">
          <nav className="flex bg-white/20 backdrop-blur-md p-0.5 rounded-xl border border-white/30 w-full md:w-auto shadow-inner">
            <button
              onClick={() => setActiveTab("materi")}
              id="tab-materi"
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-lg font-bold text-xs md:text-sm transition-all duration-300 cursor-pointer ${
                activeTab === "materi"
                  ? "bg-white/85 text-brand-800 shadow-sm"
                  : "text-slate-700 hover:text-slate-900 hover:bg-white/10"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Materi Edukasi</span>
            </button>
            <button
              onClick={() => setActiveTab("video")}
              id="tab-video"
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-lg font-bold text-xs md:text-sm transition-all duration-300 cursor-pointer ${
                activeTab === "video"
                  ? "bg-white/85 text-brand-800 shadow-sm"
                  : "text-slate-700 hover:text-slate-900 hover:bg-white/10"
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Video</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("kuis");
                setIsBannerDismissed(true);
              }}
              id="tab-kuis"
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-lg font-bold text-xs md:text-sm transition-all duration-300 cursor-pointer ${
                activeTab === "kuis"
                  ? "bg-white/85 text-brand-800 shadow-sm"
                  : "text-slate-700 hover:text-slate-900 hover:bg-white/10"
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span className="flex items-center gap-1.5">
                <span>Versus Kuis</span>
                {activeTab !== "kuis" && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
              </span>
            </button>
          </nav>

          {/* Kuis Reveal Banner - Floating Tooltip above Versus Kuis */}
          {activeTab !== "kuis" && !isBannerDismissed && (
            <div className="absolute -top-11 right-0 bg-brand-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2 animate-[bounce_2s_infinite] z-50 whitespace-nowrap border border-white/20 select-none">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Ayo uji pemahamanmu di Versus Kuis! 🏆</span>
              <button
                onClick={() => setIsBannerDismissed(true)}
                className="hover:text-amber-200 transition-colors cursor-pointer p-0.5 ml-1"
                title="Tutup petunjuk"
              >
                <X className="w-3 h-3" />
              </button>
              {/* Tooltip caret pointing down */}
              <div className="absolute top-full right-12 md:right-14 -translate-y-px w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-brand-600"></div>
            </div>
          )}
        </div>

        {/* Sound Controller & Fullscreen Control */}
        <div className="flex items-center gap-3">
          {/* Floating BGM Controller (Button + Volume Slider in row) */}
          <div className="flex flex-row items-center gap-2">
            <button
              onClick={onToggleMusic}
              id="btn-bgm"
              className={`flex items-center justify-center gap-1.5 border text-slate-800 font-bold px-3 py-1.5 rounded-lg transition-all duration-300 cursor-pointer text-xs ${
                isMusicPlaying
                  ? "bg-brand-50 border-brand-200 text-brand-700 shadow-sm"
                  : "bg-white/30 border-white/40 hover:bg-white/50"
              }`}
            >
              <div className="relative w-3.5 h-3.5 flex items-center justify-center shrink-0">
                {/* Simple animation bars when audio is active */}
                {isMusicPlaying ? (
                  <span id="bgm-bars" className="absolute inset-0 flex items-end justify-between">
                    <span className="w-[1.5px] bg-brand-500 h-2 animate-[pulse_0.8s_infinite]"></span>
                    <span className="w-[1.5px] bg-brand-500 h-3.5 animate-[pulse_1.2s_infinite]"></span>
                    <span className="w-[1.5px] bg-brand-500 h-1.5 animate-[pulse_0.6s_infinite]"></span>
                  </span>
                ) : (
                  <Music id="bgm-mute-icon" className="w-3.5 h-3.5" />
                )}
              </div>
              <span id="bgm-text" className="whitespace-nowrap">BGM: {isMusicPlaying ? "On" : "Off"}</span>
            </button>

            {/* Volume Slider Bar (aligned beside the button) */}
            <div className="flex items-center gap-1.5 bg-white/30 backdrop-blur-md px-2 py-1.5 rounded-lg border border-white/40 w-24 shrink-0">
              <Volume1 className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <input
                id="bgm-volume"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-200/50 rounded-lg appearance-none cursor-pointer accent-brand-500 hover:accent-brand-600 transition-all duration-300"
                title="Atur Volume BGM"
              />
            </div>
          </div>


        </div>
      </div>
    </header>
  );
}
