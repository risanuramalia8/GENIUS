import { BookOpen, Trophy, Music, Volume1 } from "lucide-react";

interface HeaderProps {
  activeTab: "materi" | "kuis";
  setActiveTab: (tab: "materi" | "kuis") => void;
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
  return (
    <header className="bg-white/40 backdrop-blur-md border-b border-white/40 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo / Branding */}
        <div 
          onClick={onGoHome}
          className="flex items-center gap-3 cursor-pointer select-none hover:opacity-85 active:scale-[0.98] transition-all duration-200"
          title="Kembali ke Beranda Depan"
        >
          <div className="w-12 h-12 flex items-center justify-center shrink-0 rounded-2xl overflow-hidden bg-white/80 p-1 shadow-md border border-white/40">
            <img
              src="/Logo GENIUS.png"
              alt="Logo GENIUS"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h2 className="font-display font-bold text-2xl tracking-tight text-slate-800">GENIUS</h2>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Game Edukasi Nutri-Level
            </p>
          </div>
        </div>

        {/* Central Segmented Navigation Tabs */}
        <nav className="flex bg-white/20 backdrop-blur-md p-1 rounded-2xl border border-white/30 w-full md:w-auto shadow-inner">
          <button
            onClick={() => setActiveTab("materi")}
            id="tab-materi"
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer ${
              activeTab === "materi"
                ? "bg-white/85 text-brand-800 shadow-sm"
                : "text-slate-700 hover:text-slate-900 hover:bg-white/10"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Materi Edukasi</span>
          </button>
          <button
            onClick={() => setActiveTab("kuis")}
            id="tab-kuis"
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer ${
              activeTab === "kuis"
                ? "bg-white/85 text-brand-800 shadow-sm"
                : "text-slate-700 hover:text-slate-900 hover:bg-white/10"
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Versus Kuis</span>
          </button>
        </nav>

        {/* Sound Controller & Fullscreen Control */}
        <div className="flex items-center gap-3">
          {/* Floating BGM Controller (Button + Volume Slider) */}
          <div className="flex flex-col items-stretch gap-1.5 min-w-[130px]">
            <button
              onClick={onToggleMusic}
              id="btn-bgm"
              className={`w-full flex items-center justify-center gap-2 border text-slate-800 font-bold px-3 py-1.5 rounded-xl transition-all duration-300 cursor-pointer text-xs ${
                isMusicPlaying
                  ? "bg-brand-50 border-brand-200 text-brand-700 shadow-sm"
                  : "bg-white/30 border-white/40 hover:bg-white/50"
              }`}
            >
              <div className="relative w-4 h-4 flex items-center justify-center">
                {/* Simple animation bars when audio is active */}
                {isMusicPlaying ? (
                  <span id="bgm-bars" className="absolute inset-0 flex items-end justify-between">
                    <span className="w-[2px] bg-brand-500 h-3 animate-[pulse_0.8s_infinite]"></span>
                    <span className="w-[2px] bg-brand-500 h-4 animate-[pulse_1.2s_infinite]"></span>
                    <span className="w-[2px] bg-brand-500 h-2 animate-[pulse_0.6s_infinite]"></span>
                  </span>
                ) : (
                  <Music id="bgm-mute-icon" className="w-4 h-4" />
                )}
              </div>
              <span id="bgm-text">BGM: {isMusicPlaying ? "On" : "Off"}</span>
            </button>

            {/* Volume Slider Bar */}
            <div className="flex items-center gap-1.5 bg-white/30 backdrop-blur-md px-2 py-1 rounded-lg border border-white/40">
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

          {/* Screen Indicator Helper for LCD projector */}
          <div className="hidden lg:flex items-center gap-2 text-xs bg-white/40 backdrop-blur-md text-brand-800 px-3.5 py-2 rounded-xl font-semibold border border-white/50">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Mode Proyektor LCD Aktif</span>
          </div>
        </div>
      </div>
    </header>
  );
}
