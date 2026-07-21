import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white/30 backdrop-blur-md border-t border-white/20 py-6">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-slate-500 font-medium">
        <p>© 2026 GENIUS. Game Edukasi Nutri-Level Interaktif.</p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" /> Untuk Ibu & Janin Sehat
          </span>
          <span className="text-slate-300">|</span>
          <span>Uji Coba Nutri-Level A-B-C-D</span>
        </div>
      </div>
    </footer>
  );
}
