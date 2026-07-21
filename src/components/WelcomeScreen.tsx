import { ArrowRight, Music, Volume1 } from "lucide-react";

interface WelcomeScreenProps {
  onStart: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  volume: number;
  onVolumeChange: (value: number) => void;
}

export default function WelcomeScreen({
  onStart,
  isMusicPlaying,
  onToggleMusic,
  volume,
  onVolumeChange,
}: WelcomeScreenProps) {
  return (
    <div
      id="welcome-screen"
      className="welcome-screen-bg fixed inset-0 z-50 flex flex-col items-center justify-end pb-6 md:pb-10 text-white p-6 overflow-y-auto"
    >
      {/* No blurry overlay to ensure the background image is perfectly crisp and vibrant */}
      <div className="absolute inset-0 bg-transparent pointer-events-none"></div>

      {/* Floating BGM Controls at the top-right corner, matching the position on the education pages */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50 flex flex-row items-center gap-2 bg-black/45 backdrop-blur-md border border-white/20 p-2 rounded-xl shadow-2xl animate-fade-in">
        {/* Music Toggle Button */}
        <button
          onClick={onToggleMusic}
          id="btn-bgm-welcome"
          className={`flex items-center justify-center gap-1.5 border font-bold px-3 py-1.5 rounded-lg transition-all duration-300 cursor-pointer text-xs ${
            isMusicPlaying
              ? "bg-white text-teal-950 border-white shadow-md hover:bg-teal-50"
              : "bg-white/10 border-white/20 text-white hover:bg-white/20"
          }`}
        >
          <div className="relative w-3.5 h-3.5 flex items-center justify-center shrink-0">
            {isMusicPlaying ? (
              <span className="absolute inset-0 flex items-end justify-between">
                <span className="w-[1.5px] bg-teal-950 h-2 animate-[pulse_0.8s_infinite]"></span>
                <span className="w-[1.5px] bg-teal-950 h-3 animate-[pulse_1.2s_infinite]"></span>
                <span className="w-[1.5px] bg-teal-950 h-1.5 animate-[pulse_0.6s_infinite]"></span>
              </span>
            ) : (
              <Music className="w-3.5 h-3.5" />
            )}
          </div>
          <span>BGM: {isMusicPlaying ? "On" : "Off"}</span>
        </button>

        {/* Volume Control Slider */}
        <div className="flex items-center gap-1.5 bg-white/10 border border-white/15 px-2 py-1.5 rounded-lg w-24 shrink-0">
          <Volume1 className="w-3.5 h-3.5 text-white/80 shrink-0" />
          <input
            id="bgm-volume-welcome"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-full h-1 bg-white/25 rounded-lg appearance-none cursor-pointer accent-white hover:accent-teal-200 transition-all duration-300"
          />
        </div>
      </div>

      <div className="max-w-xl w-full text-center z-10 flex flex-col items-center gap-6 md:gap-8 fade-in px-4">
        {/* Start Button */}
        <div className="w-full">
          <button
            onClick={onStart}
            id="btn-mulai"
            className="group relative inline-flex items-center justify-center gap-2.5 bg-white text-teal-950 font-bold text-sm md:text-base px-8 py-3 rounded-full shadow-2xl hover:shadow-teal-400/20 hover:bg-teal-50 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
          >
            <span>Mulai Edukasi</span>
            <div className="bg-brand-600 group-hover:bg-brand-700 p-1.5 rounded-full text-white transition-all duration-300 group-hover:translate-x-1">
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}


