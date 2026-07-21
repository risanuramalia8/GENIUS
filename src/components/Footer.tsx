import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-transparent border-t border-transparent py-6">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-slate-800 font-semibold drop-shadow-sm">
        <p>© 2026 GENIUS. Game Edukasi Nutri-Level Interaktif Untuk Hidup Sehat</p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> Untuk Ibu & Janin Sehat
          </span>
          <span className="text-slate-400">|</span>
          <span>PKM Mandiri 2026</span>
        </div>
      </div>
    </footer>
  );
}
