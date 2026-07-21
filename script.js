/**
 * =========================================================================
 * GENIUS (Game Edukasi Nutri-Level Interaktif Untuk Hidup Sehat)
 * script.js - Logika Interaktif, Musik, Tab, dan Web Speech API
 * =========================================================================
 */

// =========================================================================
// DATA SOAL KUIS (UJI COBA)
// =========================================================================
// Anda bisa menambahkan soal baru dengan mengikuti pola objek di bawah ini.
// Cukup duplikasi objek dan pisahkan dengan koma di dalam array kuisSoal.
const kuisSoal = [
  {
    kasus: "Ibu Dina ngidam es teh manis kemasan. Di botolnya ada logo huruf C berwarna kuning. Apa arti logo tersebut, dan bolehkah bumil mengonsumsinya setiap hari?",
    jawaban: "Logo C kuning artinya kandungan gula cukup tinggi dan menggunakan tambahan pemanis buatan.",
    penjelasan: "Jika diminum tiap hari, asupan gula berlebih akan meningkatkan risiko diabetes selama kehamilan dan merusak gigi ibu hamil. Kesehatan mulut yang memburuk bisa berisiko bagi janin lho!"
  },
  /* Tambahkan soal baru di sini, contoh:
  {
    kasus: "Soal berikutnya...",
    jawaban: "Jawaban berikutnya...",
    penjelasan: "Penjelasan berikutnya..."
  }
  */
];

// =========================================================================
// DATA SLIDE MATERI EDUKASI
// =========================================================================
const slides = [
  {
    title: "Kenali Apa itu Nutri-Level",
    text: "Kenali Nutri-Level! Ini adalah panduan batas gula dan garam pada minuman kemasan untuk bantu Bumil pilih minuman sehat.",
    icon: "sparkles",
    bgIcon: "sparkles"
  },
  {
    title: "Pahami Tingkat Keamanannya (A - D)",
    text: "Level A (Hijau Tua) & B (Hijau Muda) adalah pilihan aman. Level C (Kuning) & D (Merah) berarti tinggi gula dan pemanis buatan yang harus dihindari ibu hamil!",
    icon: "alert-triangle",
    bgIcon: "alert-triangle"
  },
  {
    title: "Bahaya Mengonsumsi C & D Setiap Hari",
    text: "Konsumsi minuman berlabel C dan D tiap hari bisa memicu diabetes kehamilan dan merusak gigi Bumil. Yuk, batasi gulanya demi janin yang sehat!",
    icon: "heart-pulse",
    bgIcon: "heart-pulse"
  }
];

// =========================================================================
// STATE MANAGEMENT (VARIABEL AKTIF)
// =========================================================================
let currentSlideIndex = 0;
let currentQuestionIndex = 0;
let scoreGroupA = 0;
let scoreGroupB = 0;
let isMusicPlaying = false;
let currentBgmVolume = 0.45; // Default BGM Volume (matches HTML range input)

// =========================================================================
// DOM ELEMENTS (ELEMEN HTML) - Dideklarasikan secara global dan diinisialisasi pada DOMContentLoaded
// =========================================================================
let bgMusic = null;
let welcomeScreen = null;
let btnMulai = null;
let mainLayout = null;

let tabMateri = null;
let tabKuis = null;
let contentMateri = null;
let contentKuis = null;

let slideIndexText = null;
let slideTotalText = null;
let slideTitle = null;
let slideTextContent = null;
let slideIcon = null;
let slideBgIcon = null;
let btnPrev = null;
let btnNext = null;
let slideDots = [];

let scoreTextA = null;
let scoreTextB = null;
let btnPlusA = null;
let btnMinusA = null;
let btnPlusB = null;
let btnMinusB = null;
let btnResetScores = null;

let labelSoal = null;
let questionText = null;
let controlShowAnswerContainer = null;
let btnShowAnswer = null;
let jawabanPanel = null;
let answerText = null;
let explanationText = null;

let btnReadQuestion = null;
let btnReadExplanation = null;
let btnNextQuestion = null;
let btnBgm = null;
let bgmText = null;
let bgmMuteIcon = null;
let bgmBars = null;
let bgmVolume = null;

// =========================================================================
// WEB SPEECH API INTEGRATION (FITUR SUARA INDONESIA)
// =========================================================================
/**
 * Fungsi untuk mengucapkan teks dalam bahasa Indonesia.
 * Otomatis meng-cancel suara sebelumnya untuk menghindari tabrakan suara.
 * @param {string} text - Teks yang akan diucapkan
 */
function speakIndonesian(text) {
  try {
    if ('speechSynthesis' in window) {
      // Selalu batalkan suara yang sedang berjalan terlebih dahulu
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 1.0;  // Kecepatan normal
      utterance.pitch = 1.0; // Nada suara normal

      // Cari suara spesifik Bahasa Indonesia jika tersedia di peranti pengguna
      const voices = window.speechSynthesis.getVoices();
      const indonesianVoice = voices.find(voice => voice.lang.includes('id') || voice.lang.includes('ID'));
      if (indonesianVoice) {
        utterance.voice = indonesianVoice;
      }

      // Mengurangi volume musik latar sementara saat asisten sedang berbicara agar suara terdengar jelas
      if (isMusicPlaying) {
        if (bgMusic) bgMusic.volume = currentBgmVolume * 0.3;
        updateSynthVolume(currentBgmVolume * 0.3);
      }

      utterance.onend = () => {
        // Kembalikan volume musik latar ke normal setelah asisten selesai berbicara
        if (isMusicPlaying) {
          if (bgMusic) bgMusic.volume = currentBgmVolume;
          updateSynthVolume(currentBgmVolume);
        }
      };

      utterance.onerror = (e) => {
        console.error("Kesalahan Web Speech API:", e);
        // Reset volume jika terjadi error
        if (isMusicPlaying) {
          if (bgMusic) bgMusic.volume = currentBgmVolume;
          updateSynthVolume(currentBgmVolume);
        }
      };

      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Browser ini tidak mendukung fitur pembaca suara (Web Speech API).");
    }
  } catch (error) {
    console.warn("Speech synthesis error (probably inside restricted sandbox environment):", error);
  }
}

// Event listener agar suara selalu siap dengan load voice terbaru
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    // Mengaktifkan pre-fetch suara sistem
    window.speechSynthesis.getVoices();
  };
}

// =========================================================================
// AUDIO BACKGROUND MUSIC (BGM) CONTROLLER & SYNTHESIZER FALLBACK
// =========================================================================
let synthContext = null;
let synthInterval = null;
let isSynthPlaying = false;
let synthGainNode = null;
let activeDrone = null;

/**
 * Memulai synthesizer ambient lembut berbasis Web Audio API sebagai cadangan jika file audio rusak atau kosong.
 */
function startSynthFallback() {
  if (isSynthPlaying) return;
  console.log("Memulai synthesizer ambient lembut (Web Audio API) sebagai cadangan...");
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    
    synthContext = new AudioContextClass();
    synthGainNode = synthContext.createGain();
    synthGainNode.connect(synthContext.destination);
    
    // Atur volume synthesizer lebih lembut (15% dari volume utama) agar nyaman didengar
    synthGainNode.gain.setValueAtTime(currentBgmVolume * 0.15, synthContext.currentTime);
    isSynthPlaying = true;
    isMusicPlaying = true;
    updateBgmUI();
    
    // Nada pentatonis C Mayor (frekuensi dalam Hz) untuk suara lonceng ambient yang santai
    const frequencies = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00];
    
    // Suara dengung dasar (drone) yang lembut untuk suasana spa
    const oscDrone1 = synthContext.createOscillator();
    const oscDrone2 = synthContext.createOscillator();
    const droneGain = synthContext.createGain();
    
    oscDrone1.type = 'sine';
    oscDrone1.frequency.setValueAtTime(130.81, synthContext.currentTime); // C3
    
    oscDrone2.type = 'sine';
    oscDrone2.frequency.setValueAtTime(196.00, synthContext.currentTime); // G3
    
    droneGain.gain.setValueAtTime(0.04, synthContext.currentTime);
    
    oscDrone1.connect(droneGain);
    oscDrone2.connect(droneGain);
    droneGain.connect(synthGainNode);
    
    oscDrone1.start();
    oscDrone2.start();
    
    activeDrone = { osc1: oscDrone1, osc2: oscDrone2, gain: droneGain };
    
    const playChime = () => {
      if (!isSynthPlaying || !synthContext) return;
      
      const freq = frequencies[Math.floor(Math.random() * frequencies.length)];
      const osc = synthContext.createOscillator();
      const gainNode = synthContext.createGain();
      const filter = synthContext.createBiquadFilter();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, synthContext.currentTime);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(700, synthContext.currentTime);
      
      const now = synthContext.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.2, now + 1.2); // Attack lambat
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 5.5); // Decay panjang
      
      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(synthGainNode);
      
      osc.start(now);
      osc.stop(now + 6.0);
      
      const nextTime = 1500 + Math.random() * 2500;
      synthInterval = setTimeout(playChime, nextTime);
    };
    
    playChime();
  } catch (err) {
    console.warn("Gagal membuat Web Audio API Synth:", err);
  }
}

/**
 * Menghentikan synthesizer ambient
 */
function stopSynthFallback() {
  isSynthPlaying = false;
  if (synthInterval) {
    clearTimeout(synthInterval);
    synthInterval = null;
  }
  if (activeDrone) {
    try {
      activeDrone.osc1.stop();
      activeDrone.osc2.stop();
    } catch (e) {}
    activeDrone = null;
  }
  if (synthContext) {
    try {
      synthContext.close();
    } catch (e) {}
    synthContext = null;
    synthGainNode = null;
  }
}

/**
 * Mengubah volume synthesizer ambient secara dinamis
 */
function updateSynthVolume(customVol = currentBgmVolume) {
  if (synthGainNode && synthContext) {
    synthGainNode.gain.setValueAtTime(customVol * 0.15, synthContext.currentTime);
  }
}

/**
 * Fungsi untuk memutar musik latar secara aman dengan penanganan exception (jika file belum ada).
 */
function playBackgroundMusic() {
  try {
    if (!bgMusic) return;
    
    // Atur volume normal
    bgMusic.volume = currentBgmVolume;
    
    bgMusic.play()
      .then(() => {
        isMusicPlaying = true;
        stopSynthFallback(); // Hentikan synthesizer jika musik asli berhasil diputar
        updateBgmUI();
      })
      .catch((error) => {
        console.warn("BGM Gagal diputar otomatis (mungkin file music.mp3 kosong):", error);
        
        // Jika fail saat memutar 'music.mp3' yang merupakan file 0-byte, 
        // ganti src ke stream musik piano komersial gratis yang tenang dan stabil
        if (bgMusic.getAttribute("src") === "music.mp3" || bgMusic.src.endsWith("music.mp3")) {
          console.log("Mencoba memuat cadangan musik piano tenang dari server online...");
          bgMusic.src = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3";
          bgMusic.load();
          bgMusic.play()
            .then(() => {
              isMusicPlaying = true;
              stopSynthFallback();
              updateBgmUI();
            })
            .catch((err2) => {
              console.warn("Koneksi lambat atau gagal memutar lagu online. Mengaktifkan synthesizer luring...", err2);
              startSynthFallback();
            });
        } else {
          startSynthFallback();
        }
      });
  } catch (error) {
    console.warn("BGM Gagal diputar secara sinkron, beralih ke synthesizer:", error);
    startSynthFallback();
  }
}

/**
 * Fungsi untuk menghentikan musik latar sementara
 */
function pauseBackgroundMusic() {
  try {
    if (bgMusic) {
      bgMusic.pause();
    }
  } catch (error) {
    console.warn("Gagal menghentikan BGM:", error);
  }
  stopSynthFallback();
  isMusicPlaying = false;
  updateBgmUI();
}

/**
 * Update tampilan tombol kontrol musik
 */
function updateBgmUI() {
  if (isMusicPlaying) {
    bgmText.textContent = "BGM: On";
    bgmBars.classList.remove("hidden");
    bgmMuteIcon.classList.add("hidden");
    btnBgm.classList.add("bg-brand-50", "border-brand-200", "text-brand-700");
    btnBgm.classList.remove("bg-slate-100", "border-slate-200", "text-slate-700");
  } else {
    bgmText.textContent = "BGM: Off";
    bgmBars.classList.add("hidden");
    bgmMuteIcon.classList.remove("hidden");
    btnBgm.classList.remove("bg-brand-50", "border-brand-200", "text-brand-700");
    btnBgm.classList.add("bg-slate-100", "border-slate-200", "text-slate-700");
  }
}

// =========================================================================
// TAB SWITCHER LOGIC (MATERI EDUKASI VS KUIS)
// =========================================================================
function switchTab(activeTab) {
  // Hentikan suara asisten saat pindah tab agar tidak tumpang tindih
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  if (activeTab === "materi") {
    // Tampilan Tab Materi Aktif
    if (contentMateri) contentMateri.classList.remove("hidden");
    if (contentKuis) contentKuis.classList.add("hidden");

    if (tabMateri) tabMateri.className = "flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer bg-white/85 text-brand-800 shadow-sm";
    if (tabKuis) tabKuis.className = "flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer text-slate-700 hover:text-slate-900 hover:bg-white/10";
  } else {
    // Tampilan Tab Kuis Aktif
    if (contentKuis) contentKuis.classList.remove("hidden");
    if (contentMateri) contentMateri.classList.add("hidden");

    if (tabKuis) tabKuis.className = "flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer bg-white/85 text-brand-800 shadow-sm";
    if (tabMateri) tabMateri.className = "flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer text-slate-700 hover:text-slate-900 hover:bg-white/10";
    
    // Inisialisasi pertanyaan pertama saat tab kuis dibuka
    loadQuizQuestion(currentQuestionIndex);
  }
}

// =========================================================================
// SLIDER / CAROUSEL MATERI EDUKASI
// =========================================================================
function renderSlide(index) {
  const currentSlide = slides[index];
  if (!currentSlide) return;
  
  // Set teks
  if (slideIndexText) slideIndexText.textContent = index + 1;
  if (slideTotalText) slideTotalText.textContent = slides.length;
  if (slideTitle) slideTitle.textContent = currentSlide.title;
  if (slideTextContent) slideTextContent.textContent = currentSlide.text;

  // Set icon dinamis dengan mengganti atribut data-lucide
  if (slideIcon) {
    slideIcon.setAttribute("data-lucide", currentSlide.icon);
  }
  if (slideBgIcon) {
    slideBgIcon.setAttribute("data-lucide", currentSlide.bgIcon);
  }

  // Re-render Lucide Icons agar SVG ter-update
  if (typeof lucide !== "undefined" && lucide.createIcons) {
    lucide.createIcons();
  }

  // Update indikator titik (dot)
  if (slideDots) {
    slideDots.forEach((dot, dotIdx) => {
      if (dotIdx === index) {
        dot.className = "slide-dot w-6 h-3.5 rounded-full bg-brand-500 transition-all duration-300";
      } else {
        dot.className = "slide-dot w-3.5 h-3.5 rounded-full bg-slate-200 hover:bg-slate-300 transition-all duration-300 cursor-pointer";
      }
    });
  }

  // Atur state keaktifan tombol navigasi slide
  if (btnPrev) btnPrev.disabled = index === 0;
  if (btnNext) {
    btnNext.innerHTML = index === slides.length - 1 
      ? '<span>Selesai Belajar</span> <i data-lucide="check-circle" class="w-5 h-5"></i>' 
      : '<span>Selanjutnya</span> <i data-lucide="arrow-right" class="w-5 h-5"></i>';
  }
  
  if (typeof lucide !== "undefined" && lucide.createIcons) {
    lucide.createIcons();
  }
}

// =========================================================================
// PAPAN SKOR KELOMPOK (SCOREBOARD LOGIC)
// =========================================================================
function updateScoreboard() {
  if (scoreTextA) scoreTextA.textContent = scoreGroupA;
  if (scoreTextB) scoreTextB.textContent = scoreGroupB;
}

// =========================================================================
// LOGIKA GAME VERSUS KUIS (CORE SYSTEM)
// =========================================================================
function loadQuizQuestion(index) {
  // Ambil soal berdasarkan indeks aktif
  const soalData = kuisSoal[index];

  if (!soalData) {
    if (questionText) questionText.textContent = "Kuis Selesai! Terima kasih telah berpartisipasi.";
    if (btnReadQuestion) btnReadQuestion.classList.add("hidden");
    if (controlShowAnswerContainer) controlShowAnswerContainer.classList.add("hidden");
    if (jawabanPanel) jawabanPanel.classList.add("hidden");
    return;
  }

  // Update label dinamis
  if (labelSoal) labelSoal.textContent = `Soal ${index + 1} dari ${kuisSoal.length}`;
  
  // Set teks soal, jawaban, dan penjelasan
  if (questionText) questionText.textContent = soalData.kasus;
  if (answerText) answerText.textContent = soalData.jawaban;
  if (explanationText) explanationText.textContent = soalData.penjelasan;

  // Sembunyikan panel jawaban terlebih dahulu (persiapan tampil soal baru)
  if (jawabanPanel) jawabanPanel.classList.add("hidden");
  if (controlShowAnswerContainer) controlShowAnswerContainer.classList.remove("hidden");
}

// =========================================================================
// INITIALIZATION AND EVENT LISTENERS
// =========================================================================

function initializeApp() {
  try {
    // 1. Query all DOM Elements
    bgMusic = document.getElementById("bg-music");
    welcomeScreen = document.getElementById("welcome-screen");
    btnMulai = document.getElementById("btn-mulai");
    mainLayout = document.getElementById("main-layout");

    tabMateri = document.getElementById("tab-materi");
    tabKuis = document.getElementById("tab-kuis");
    contentMateri = document.getElementById("content-materi");
    contentKuis = document.getElementById("content-kuis");

    slideIndexText = document.getElementById("slide-index");
    slideTotalText = document.getElementById("slide-total");
    slideTitle = document.getElementById("slide-title");
    slideTextContent = document.getElementById("slide-text");
    slideIcon = document.getElementById("slide-icon");
    slideBgIcon = document.getElementById("slide-bg-icon");
    btnPrev = document.getElementById("btn-prev");
    btnNext = document.getElementById("btn-next");
    slideDots = document.querySelectorAll(".slide-dot");

    scoreTextA = document.getElementById("score-a");
    scoreTextB = document.getElementById("score-b");
    btnPlusA = document.getElementById("btn-plus-a");
    btnMinusA = document.getElementById("btn-minus-a");
    btnPlusB = document.getElementById("btn-plus-b");
    btnMinusB = document.getElementById("btn-minus-b");
    btnResetScores = document.getElementById("btn-reset-scores");

    labelSoal = document.getElementById("label-soal");
    questionText = document.getElementById("question-text");
    controlShowAnswerContainer = document.getElementById("control-show-answer-container");
    btnShowAnswer = document.getElementById("btn-show-answer");
    jawabanPanel = document.getElementById("jawaban-panel");
    answerText = document.getElementById("answer-text");
    explanationText = document.getElementById("explanation-text");

    btnReadQuestion = document.getElementById("btn-read-question");
    btnReadExplanation = document.getElementById("btn-read-explanation");
    btnNextQuestion = document.getElementById("btn-next-question");
    btnBgm = document.getElementById("btn-bgm");
    bgmText = document.getElementById("bgm-text");
    bgmMuteIcon = document.getElementById("bgm-mute-icon");
    bgmBars = document.getElementById("bgm-bars");
    bgmVolume = document.getElementById("bgm-volume");

    // 2. Attach Event Listeners safely (if elements exist)
    if (btnMulai) {
      btnMulai.addEventListener("click", () => {
        try {
          if (welcomeScreen) welcomeScreen.classList.add("hidden");
          if (mainLayout) mainLayout.classList.remove("hidden");
          try {
            playBackgroundMusic();
          } catch (err) {
            console.warn("BGM play failed inside click handler:", err);
          }
          try {
            const sambutan = "Selamat datang dalam edukasi Nutri Level untuk kesehatan ibu hamil.";
            speakIndonesian(sambutan);
          } catch (err) {
            console.warn("Speech Synthesis failed inside click handler:", err);
          }
          currentSlideIndex = 0;
          renderSlide(currentSlideIndex);
        } catch (globalErr) {
          console.error("Kesalahan umum saat memulai aplikasi:", globalErr);
        }
      });
    }

    if (btnBgm) {
      btnBgm.addEventListener("click", () => {
        if (isMusicPlaying) {
          pauseBackgroundMusic();
        } else {
          playBackgroundMusic();
        }
      });
    }

    if (bgmVolume) {
      bgmVolume.addEventListener("input", (e) => {
        currentBgmVolume = parseFloat(e.target.value);
        if (isMusicPlaying) {
          if (bgMusic) {
            bgMusic.volume = currentBgmVolume;
          }
          updateSynthVolume();
        }
      });
    }

    if (tabMateri) {
      tabMateri.addEventListener("click", () => switchTab("materi"));
    }
    if (tabKuis) {
      tabKuis.addEventListener("click", () => switchTab("kuis"));
    }

    if (btnPrev) {
      btnPrev.addEventListener("click", () => {
        if (currentSlideIndex > 0) {
          currentSlideIndex--;
          renderSlide(currentSlideIndex);
        }
      });
    }

    if (btnNext) {
      btnNext.addEventListener("click", () => {
        if (currentSlideIndex < slides.length - 1) {
          currentSlideIndex++;
          renderSlide(currentSlideIndex);
        } else {
          switchTab("kuis");
        }
      });
    }

    if (slideDots) {
      slideDots.forEach((dot, dotIdx) => {
        dot.addEventListener("click", () => {
          currentSlideIndex = dotIdx;
          renderSlide(currentSlideIndex);
        });
      });
    }

    if (btnPlusA) {
      btnPlusA.addEventListener("click", () => {
        scoreGroupA++;
        updateScoreboard();
      });
    }
    if (btnMinusA) {
      btnMinusA.addEventListener("click", () => {
        if (scoreGroupA > 0) {
          scoreGroupA--;
          updateScoreboard();
        }
      });
    }

    if (btnPlusB) {
      btnPlusB.addEventListener("click", () => {
        scoreGroupB++;
        updateScoreboard();
      });
    }
    if (btnMinusB) {
      btnMinusB.addEventListener("click", () => {
        if (scoreGroupB > 0) {
          scoreGroupB--;
          updateScoreboard();
        }
      });
    }

    if (btnResetScores) {
      btnResetScores.addEventListener("click", () => {
        const konfirmasi = confirm("Apakah Anda yakin ingin me-reset skor Kelompok A dan Kelompok B kembali ke 0?");
        if (konfirmasi) {
          scoreGroupA = 0;
          scoreGroupB = 0;
          updateScoreboard();
        }
      });
    }

    if (btnShowAnswer) {
      btnShowAnswer.addEventListener("click", () => {
        if (controlShowAnswerContainer) controlShowAnswerContainer.classList.add("hidden");
        if (jawabanPanel) jawabanPanel.classList.remove("hidden");
      });
    }

    if (btnReadQuestion) {
      btnReadQuestion.addEventListener("click", () => {
        const soalData = kuisSoal[currentQuestionIndex];
        if (soalData) {
          speakIndonesian(soalData.kasus);
        }
      });
    }

    if (btnReadExplanation) {
      btnReadExplanation.addEventListener("click", () => {
        const soalData = kuisSoal[currentQuestionIndex];
        if (soalData) {
          const teksBacakan = `Jawaban: ${soalData.jawaban}. Penjelasan: ${soalData.penjelasan}`;
          speakIndonesian(teksBacakan);
        }
      });
    }

    if (btnNextQuestion) {
      btnNextQuestion.addEventListener("click", () => {
        currentQuestionIndex++;
        if (currentQuestionIndex >= kuisSoal.length) {
          currentQuestionIndex = 0;
        }
        loadQuizQuestion(currentQuestionIndex);
      });
    }

    // Render Lucide Icons
    if (typeof lucide !== "undefined" && lucide.createIcons) {
      lucide.createIcons();
    }

    // Coba putar musik latar otomatis sesegera mungkin (bisa berhasil jika browser mengizinkan autoplay)
    try {
      playBackgroundMusic();
    } catch (e) {
      console.warn("Autoplay terhambat kebijakan browser:", e);
    }

    // Untuk memastikan musik mulai berputar di homepage (bahkan sebelum tombol Mulai diklik),
    // kita pasang listener sekali (once) di level document terhadap klik, touch, atau tombol keyboard apa pun.
    // Ini akan memicu putar musik segera setelah ada interaksi pertama dari pengguna di bagian mana pun dari halaman.
    const playOnInteraction = () => {
      // Hapus listener segera agar tidak dijalankan berulang
      document.removeEventListener("click", playOnInteraction);
      document.removeEventListener("touchstart", playOnInteraction);
      document.removeEventListener("keydown", playOnInteraction);
      
      if (!isMusicPlaying) {
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
  } catch (e) {
    console.error("Kesalahan saat inisialisasi aplikasi:", e);
  }
}

// Inisialisasi awal saat dokumen selesai dimuat secara tangguh (robust ready check)
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}
