import { ArrowRight } from "lucide-react";

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div
      id="welcome-screen"
      className="welcome-screen-bg fixed inset-0 z-50 flex flex-col items-center justify-end pb-6 md:pb-10 text-white p-6 overflow-y-auto"
    >
      {/* No blurry overlay to ensure the background image is perfectly crisp and vibrant */}
      <div className="absolute inset-0 bg-transparent pointer-events-none"></div>

      <div className="max-w-xl w-full text-center z-10 flex flex-col items-center gap-8 md:gap-10 fade-in px-4">
        {/* Start Button */}
        <div className="w-full">
          <button
            onClick={onStart}
            id="btn-mulai"
            className="group relative inline-flex items-center justify-center gap-2.5 bg-white text-teal-950 font-bold text-sm md:text-base px-6 py-2.5 rounded-full shadow-xl hover:shadow-teal-400/20 hover:bg-teal-50 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
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

