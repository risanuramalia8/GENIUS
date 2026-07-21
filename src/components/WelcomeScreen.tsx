import { ArrowRight } from "lucide-react";

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div
      id="welcome-screen"
      className="welcome-screen-bg fixed inset-0 z-50 flex flex-col items-center justify-end pb-12 text-white p-6 overflow-y-auto"
    >
      <div className="max-w-4xl text-center z-10 fade-in">
        {/* Start Button */}
        <div>
          <button
            onClick={onStart}
            id="btn-mulai"
            className="group relative inline-flex items-center justify-center gap-2.5 bg-white text-teal-950 font-bold text-sm md:text-base px-6 py-3 rounded-full shadow-xl hover:shadow-brand-300/20 hover:bg-teal-50 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
          >
            <span>Mulai Edukasi</span>
            <div className="bg-brand-600 group-hover:bg-brand-700 p-1.5 rounded-full text-white transition-colors duration-300">
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
