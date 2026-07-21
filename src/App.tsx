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

  // Audio & Synthesizer refs to maintain sound state across renders without extra dependencies
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const synthContextRef = useRef<AudioContext | null>(null);
  const synthIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const synthGainNodeRef = useRef<GainNode | null>(null);
  const activeDroneRef = useRef<{ osc1: OscillatorNode; osc2: OscillatorNode; gain: GainNode } | null>(null);
  const isSynthPlayingRef = useRef<boolean>(false);
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
    updateSynthVolume(currentBgmVolume);
  }, [currentBgmVolume]);

  // Initializing Audio Element & cleanup
  useEffect(() => {
    const audio = new Audio("/music.mp3");
    audio.loop = true;
    audio.volume = currentBgmVolume;
    bgMusicRef.current = audio;

    // Web Speech API Voice Pre-fetch
    if ("speechSynthesis" in window) {
      const handleVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);
      window.speechSynthesis.getVoices();

      return () => {
        window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
      };
    }

    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current = null;
      }
      stopSynthFallback();
    };
  }, []);

  // Stop TTS voice on tab transition to avoid overlapping sounds
  useEffect(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, [activeTab]);

  // Web Audio API Synthesizer fallback functions
  const startSynthFallback = () => {
    if (isSynthPlayingRef.current) return;
    console.log("Memulai synthesizer ambient lembut (Web Audio API) sebagai cadangan...");
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      const context = new AudioContextClass();
      synthContextRef.current = context;

      const gainNode = context.createGain();
      gainNode.connect(context.destination);
      gainNode.gain.setValueAtTime(currentBgmVolume * 0.15, context.currentTime);
      synthGainNodeRef.current = gainNode;

      isSynthPlayingRef.current = true;
      setIsMusicPlaying(true);

      const frequencies = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00];

      // Base drone waves
      const oscDrone1 = context.createOscillator();
      const oscDrone2 = context.createOscillator();
      const droneGain = context.createGain();

      oscDrone1.type = "sine";
      oscDrone1.frequency.setValueAtTime(130.81, context.currentTime); // C3

      oscDrone2.type = "sine";
      oscDrone2.frequency.setValueAtTime(196.00, context.currentTime); // G3

      droneGain.gain.setValueAtTime(0.04, context.currentTime);

      oscDrone1.connect(droneGain);
      oscDrone2.connect(droneGain);
      droneGain.connect(gainNode);

      oscDrone1.start();
      oscDrone2.start();

      activeDroneRef.current = { osc1: oscDrone1, osc2: oscDrone2, gain: droneGain };

      const playChime = () => {
        if (!isSynthPlayingRef.current || !synthContextRef.current) return;
        const ctx = synthContextRef.current;
        const gNode = synthGainNodeRef.current;
        if (!ctx || !gNode) return;

        const freq = frequencies[Math.floor(Math.random() * frequencies.length)];
        const osc = ctx.createOscillator();
        const cGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(700, ctx.currentTime);

        const now = ctx.currentTime;
        cGain.gain.setValueAtTime(0, now);
        cGain.gain.linearRampToValueAtTime(0.2, now + 1.2);
        cGain.gain.exponentialRampToValueAtTime(0.001, now + 5.5);

        osc.connect(filter);
        filter.connect(cGain);
        cGain.connect(gNode);

        osc.start(now);
        osc.stop(now + 6.0);

        const nextTime = 1500 + Math.random() * 2500;
        synthIntervalRef.current = setTimeout(playChime, nextTime);
      };

      playChime();
    } catch (err) {
      console.warn("Gagal membuat Web Audio API Synth:", err);
    }
  };

  const stopSynthFallback = () => {
    isSynthPlayingRef.current = false;
    if (synthIntervalRef.current) {
      clearTimeout(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    if (activeDroneRef.current) {
      try {
        activeDroneRef.current.osc1.stop();
        activeDroneRef.current.osc2.stop();
      } catch (e) {}
      activeDroneRef.current = null;
    }
    if (synthContextRef.current) {
      try {
        synthContextRef.current.close();
      } catch (e) {}
      synthContextRef.current = null;
      synthGainNodeRef.current = null;
    }
  };

  const updateSynthVolume = (vol: number) => {
    if (synthGainNodeRef.current && synthContextRef.current) {
      synthGainNodeRef.current.gain.setValueAtTime(vol * 0.15, synthContextRef.current.currentTime);
    }
  };

  // General music play controls
  const playBackgroundMusic = () => {
    try {
      if (!bgMusicRef.current) return;

      bgMusicRef.current.volume = currentBgmVolume;
      bgMusicRef.current
        .play()
        .then(() => {
          setIsMusicPlaying(true);
          stopSynthFallback();
        })
        .catch((error) => {
          console.warn("BGM Gagal diputar otomatis (mungkin file music.mp3 kosong):", error);

          if (bgMusicRef.current) {
            const currentSrc = bgMusicRef.current.src;
            if (currentSrc.includes("music.mp3")) {
              console.log("Mencoba memuat cadangan musik piano tenang dari server online...");
              bgMusicRef.current.src = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3";
              bgMusicRef.current.load();
              bgMusicRef.current
                .play()
                .then(() => {
                  setIsMusicPlaying(true);
                  stopSynthFallback();
                })
                .catch((err2) => {
                  console.warn("Koneksi lambat atau gagal memutar lagu online. Mengaktifkan synthesizer luring...", err2);
                  startSynthFallback();
                });
            } else {
              startSynthFallback();
            }
          }
        });
    } catch (error) {
      console.warn("BGM Gagal diputar secara sinkron, beralih ke synthesizer:", error);
      startSynthFallback();
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
    stopSynthFallback();
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
          updateSynthVolume(currentBgmVolume * 0.3);
        }

        utterance.onend = () => {
          if (isMusicPlayingRef.current) {
            if (bgMusicRef.current) {
              bgMusicRef.current.volume = currentBgmVolume;
            }
            updateSynthVolume(currentBgmVolume);
          }
        };

        utterance.onerror = (e) => {
          console.error("Kesalahan Web Speech API:", e);
          if (isMusicPlayingRef.current) {
            if (bgMusicRef.current) {
              bgMusicRef.current.volume = currentBgmVolume;
            }
            updateSynthVolume(currentBgmVolume);
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
