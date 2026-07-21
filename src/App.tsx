import { useState, useEffect, useRef } from "react";
import WelcomeScreen from "./components/WelcomeScreen";
import Header from "./components/Header";
import MateriTab from "./components/MateriTab";
import KuisTab from "./components/KuisTab";
import Footer from "./components/Footer";
import { SLIDES_DATA, KUIS_SOAL_DATA } from "./constants";

export default function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [activeTab, setActiveTab] = useState<"materi" | "kuis">("materi");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scoreGroupA, setScoreGroupA] = useState(0);
  const [scoreGroupB, setScoreGroupB] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [currentBgmVolume, setCurrentBgmVolume] = useState(0.45);
  const [isAnswerShown, setIsAnswerShown] = useState(false);

  // Audio ref to maintain sound state across renders without extra dependencies
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const isMusicPlayingRef = useRef<boolean>(false);

  // Keep ref up to date with state
  useEffect(() => {
    isMusicPlayingRef.current = isMusicPlaying;
  }, [isMusicPlaying]);

  // Handle music volume reactive update
  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = currentBgmVolume;
    }
  }, [currentBgmVolume]);

  // Initializing Audio Element & cleanup
  useEffect(() => {
    const audio = new Audio("/music.mp3");
    audio.loop = true;
    audio.volume = currentBgmVolume;
    bgMusicRef.current = audio;

    // Berusaha memutar musik latar sesegera mungkin saat masuk homepage
    playBackgroundMusic();

    // Web Speech API Voice Pre-fetch
    const handleVoicesChanged = () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.getVoices();
      }
    };

    if ("speechSynthesis" in window) {
      window.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);
      window.speechSynthesis.getVoices();
    }

    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
      }
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current = null;
      }
    };
  }, []);

  // Stop TTS voice on tab transition to avoid overlapping sounds
  useEffect(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, [activeTab]);

  // General music play controls
  const playBackgroundMusic = () => {
    try {
      if (!bgMusicRef.current) return;

      bgMusicRef.current.volume = currentBgmVolume;
      bgMusicRef.current
        .play()
        .then(() => {
          setIsMusicPlaying(true);
        })
        .catch((error) => {
          console.warn("BGM Gagal diputar otomatis (mungkin file music.mp3 kosong atau butuh interaksi pengguna):", error);
        });
    } catch (error) {
      console.warn("BGM Gagal diputar secara sinkron:", error);
    }
  };

  const pauseBackgroundMusic = () => {
    try {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
      }
    } catch (error) {
      console.warn("Gagal menghentikan BGM:", error);
    }
    setIsMusicPlaying(false);
  };

  // Web Speech API speak engine
  const speakIndonesian = (text: string) => {
    try {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "id-ID";
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        const voices = window.speechSynthesis.getVoices();
        const indonesianVoice = voices.find(
          (voice) => voice.lang.includes("id") || voice.lang.includes("ID")
        );
        if (indonesianVoice) {
          utterance.voice = indonesianVoice;
        }

        // Dip volume while TTS is speaking
        if (isMusicPlayingRef.current) {
          if (bgMusicRef.current) {
            bgMusicRef.current.volume = currentBgmVolume * 0.3;
          }
        }

        utterance.onend = () => {
          if (isMusicPlayingRef.current) {
            if (bgMusicRef.current) {
              bgMusicRef.current.volume = currentBgmVolume;
            }
          }
        };

        utterance.onerror = (e) => {
          console.error("Kesalahan Web Speech API:", e);
          if (isMusicPlayingRef.current) {
            if (bgMusicRef.current) {
              bgMusicRef.current.volume = currentBgmVolume;
            }
          }
        };

        window.speechSynthesis.speak(utterance);
      } else {
        console.warn("Browser ini tidak mendukung fitur pembaca suara (Web Speech API).");
      }
    } catch (error) {
      console.warn("Speech synthesis error:", error);
    }
  };

  // Autoplay/interaction trigger
  useEffect(() => {
    const playOnInteraction = () => {
      document.removeEventListener("click", playOnInteraction);
      document.removeEventListener("touchstart", playOnInteraction);
      document.removeEventListener("keydown", playOnInteraction);

      if (!isMusicPlayingRef.current) {
        try {
          playBackgroundMusic();
        } catch (err) {
          console.warn("Gagal memutar musik saat interaksi pertama:", err);
        }
      }
    };

    document.addEventListener("click", playOnInteraction);
    document.addEventListener("touchstart", playOnInteraction);
    document.addEventListener("keydown", playOnInteraction);

    return () => {
      document.removeEventListener("click", playOnInteraction);
      document.removeEventListener("touchstart", playOnInteraction);
      document.removeEventListener("keydown", playOnInteraction);
    };
  }, []);

  const handleStart = () => {
    setIsStarted(true);
    playBackgroundMusic();
    speakIndonesian("Selamat datang dalam edukasi Nutri Level untuk kesehatan ibu hamil.");
    setCurrentSlideIndex(0);
  };

  const handleGoHome = () => {
    setIsStarted(false);
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleToggleMusic = () => {
    if (isMusicPlaying) {
      pauseBackgroundMusic();
    } else {
      playBackgroundMusic();
    }
  };

  return (
    <div className="bg-mesh font-sans min-h-screen text-slate-800 selection:bg-brand-100 selection:text-brand-900 overflow-x-hidden flex flex-col">
      {/* 1. WELCOME SCREEN (LAYAR AWAL FULLSCREEN) */}
      {!isStarted && <WelcomeScreen onStart={handleStart} />}

      {/* 2. MAIN INTERACTIVE LAYOUT */}
      {isStarted && (
        <div id="main-layout" className="main-layout-bg min-h-screen flex flex-col justify-between">
          <Header
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isMusicPlaying={isMusicPlaying}
            onToggleMusic={handleToggleMusic}
            volume={currentBgmVolume}
            onVolumeChange={setCurrentBgmVolume}
            onGoHome={handleGoHome}
          />

          <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-8 flex flex-col justify-center">
            {activeTab === "materi" ? (
              <MateriTab
                currentSlideIndex={currentSlideIndex}
                setCurrentSlideIndex={setCurrentSlideIndex}
                slides={SLIDES_DATA}
                onComplete={() => setActiveTab("kuis")}
              />
            ) : (
              <KuisTab
                currentQuestionIndex={currentQuestionIndex}
                setCurrentQuestionIndex={setCurrentQuestionIndex}
                questions={KUIS_SOAL_DATA}
                scoreGroupA={scoreGroupA}
                setScoreGroupA={setScoreGroupA}
                scoreGroupB={scoreGroupB}
                setScoreGroupB={setScoreGroupB}
                isAnswerShown={isAnswerShown}
                setIsAnswerShown={setIsAnswerShown}
                onSpeak={speakIndonesian}
              />
            )}
          </main>

          <Footer />
        </div>
      )}
    </div>
  );
}
