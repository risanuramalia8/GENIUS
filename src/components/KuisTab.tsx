import { Volume2, Eye, CheckCircle2, FileText, ArrowRight } from "lucide-react";
import { Question } from "../types";

interface KuisTabProps {
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (idx: number) => void;
  questions: Question[];
  isAnswerShown: boolean;
  setIsAnswerShown: (shown: boolean) => void;
  onSpeak: (text: string) => void;
}

export default function KuisTab({
  currentQuestionIndex,
  setCurrentQuestionIndex,
  questions,
  isAnswerShown,
  setIsAnswerShown,
  onSpeak,
}: KuisTabProps) {
  const currentQuestion = questions[currentQuestionIndex];

  const handleReadQuestion = () => {
    if (currentQuestion) {
      onSpeak(currentQuestion.kasus);
    }
  };

  const handleReadExplanation = () => {
    if (currentQuestion) {
      const textToSpeak = `Jawaban: ${currentQuestion.jawaban}. Penjelasan: ${currentQuestion.penjelasan}`;
      onSpeak(textToSpeak);
    }
  };

  const handleNextQuestion = () => {
    setIsAnswerShown(false);
    setCurrentQuestionIndex((currentQuestionIndex + 1) % questions.length);
  };

  return (
    <section id="content-kuis" className="fade-in w-full space-y-8">
      {/* Tampilan Soal & Jawaban Panel */}
      <div className="max-w-4xl mx-auto bg-white/35 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-8 md:p-12 relative space-y-8">
        {/* Badging and Voice Button Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-white/30 pb-6 gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span id="label-soal" className="text-sm font-bold uppercase tracking-wider text-slate-600">
              Pertanyaan Soal {currentQuestionIndex + 1} dari {questions.length}
            </span>
          </div>

          {/* Voice Speaker for Question (sleeker size) */}
          {currentQuestion && (
            <button
              onClick={handleReadQuestion}
              className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-800 border border-emerald-500/25 px-4 py-2 rounded-xl font-bold text-xs tracking-wide transition-all duration-300 cursor-pointer"
            >
              <Volume2 className="w-4 h-4 animate-[pulse_1.5s_infinite]" />
              <span>🔊 Bacakan Soal</span>
            </button>
          )}
        </div>

        {/* Teks Kasus / Soal (Extremely huge and clean for projection) */}
        <div className="py-4">
          <h3 className="font-display font-semibold text-3xl md:text-4xl lg:text-5xl text-slate-800 leading-relaxed tracking-wide text-center">
            {currentQuestion ? currentQuestion.kasus : "Kuis Selesai! Terima kasih telah berpartisipasi."}
          </h3>
        </div>

        {/* Primary Control: Tampilkan Jawaban (sleeker size) */}
        {!isAnswerShown && currentQuestion && (
          <div className="flex justify-center pt-4">
            <button
              onClick={() => setIsAnswerShown(true)}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg px-8 py-3.5 rounded-xl shadow-xl shadow-amber-500/15 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer flex items-center gap-3"
            >
              <Eye className="w-5 h-5" />
              <span>Tampilkan Jawaban</span>
            </button>
          </div>
        )}

        {/* Jawaban & Penjelasan Panel (Hidden initially) */}
        {isAnswerShown && currentQuestion && (
          <div className="space-y-8 pt-6 border-t-2 border-white/30 fade-in">
            {/* Section Jawaban (Teal / Green theme, transparent glass-styled) */}
            <div className="bg-emerald-500/10 backdrop-blur-md border-l-4 border-emerald-500 p-5 md:p-6 rounded-r-2xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-xs font-extrabold uppercase tracking-widest">Kunci Jawaban</span>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-emerald-950 leading-relaxed">
                {currentQuestion.jawaban}
              </p>
            </div>

            {/* Section Penjelasan (Slate / Neutral theme, transparent glass-styled) */}
            <div className="bg-slate-900/5 backdrop-blur-md border-l-4 border-slate-500 p-5 md:p-6 rounded-r-2xl space-y-2">
              <div className="flex items-center gap-2 text-slate-600">
                <FileText className="w-5 h-5" />
                <span className="text-xs font-extrabold uppercase tracking-widest">
                  Penjelasan Edukatif
                </span>
              </div>
              <p className="text-xl md:text-2xl text-slate-800 leading-relaxed">
                {currentQuestion.penjelasan}
              </p>
            </div>

            {/* Kontrol setelah Jawaban muncul (sleeker buttons) */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/30">
              {/* Voice Speaker for Explanation */}
              <button
                onClick={handleReadExplanation}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-800 border border-blue-500/25 px-5 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>🔊 Bacakan Penjelasan</span>
              </button>

              {/* Next Question Button */}
              <button
                onClick={handleNextQuestion}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-brand-500/10 transition-all duration-300 cursor-pointer"
              >
                <span>Soal Selanjutnya</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
