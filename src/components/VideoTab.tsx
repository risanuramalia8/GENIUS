import { ExternalLink } from "lucide-react";

export default function VideoTab() {
  return (
    <div id="video-tab" className="w-full max-w-4xl mx-auto space-y-6 md:space-y-8 fade-in">
      {/* Main Video Frame with Fallback Link */}
      <div className="space-y-4">
        <div className="relative aspect-video w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 group">
          <iframe
            id="yt-player"
            className="absolute inset-0 w-full h-full"
            src="https://www.youtube.com/embed/mAepKBRvVSo?rel=0&modestbranding=1"
            title="Video Edukasi Nutrisi Ibu Hamil"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
        
        <div className="flex justify-center">
          <a
            href="https://www.youtube.com/watch?v=mAepKBRvVSo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-2xl shadow-lg transition-all duration-300 hover:scale-[1.03]"
          >
            <ExternalLink className="w-4.5 h-4.5" />
            <span>Tonton Langsung di YouTube</span>
          </a>
        </div>
      </div>
    </div>
  );
}
