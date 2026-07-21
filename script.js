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

// =========================================================================
// DOM ELEMENTS (ELEMEN HTML)
// =========================================================================
// Audio & Welcome Screen
const bgMusic = document.getElementById("bg-music");
const welcomeScreen = document.getElementById("welcome-screen");
const btnMulai = document.getElementById("btn-mulai");
const mainLayout = document.getElementById("main-layout");

// Navigation Tabs
const tabMateri = document.getElementById("tab-materi");
const tabKuis = document.getElementById("tab-kuis");
const contentMateri = document.getElementById("content-materi");
const contentKuis = document.getElementById("content-kuis");

// Slide Materi Elements
const slideIndexText = document.getElementById("slide-index");
const slideTotalText = document.getElementById("slide-total");
const slideTitle = document.getElementById("slide-title");
const slideTextContent = document.getElementById("slide-text");
const slideIcon = document.getElementById("slide-icon");
const slideBgIcon = document.getElementById("slide-bg-icon");
const btnPrev = document.getElementById("btn-prev");
const btnNext = document.getElementById("btn-next");
const slideDots = document.querySelectorAll(".slide-dot");

// Scoreboard Elements
const scoreTextA = document.getElementById("score-a");
const scoreTextB = document.getElementById("score-b");
const btnPlusA = document.getElementById("btn-plus-a");
const btnMinusA = document.getElementById("btn-minus-a");
const btnPlusB = document.getElementById("btn-plus-b");
const btnMinusB = document.getElementById("btn-minus-b");
const btnResetScores = document.getElementById("btn-reset-scores");

// Quiz Elements
const labelSoal = document.getElementById("label-soal");
const questionText = document.getElementById("question-text");
const controlShowAnswerContainer = document.getElementById("control-show-answer-container");
const btnShowAnswer = document.getElementById("btn-show-answer");
const jawabanPanel = document.getElementById("jawaban-panel");
const answerText = document.getElementById("answer-text");
const explanationText = document.getElementById("explanation-text");

// Speak & Action Buttons
const btnReadQuestion = document.getElementById("btn-read-question");
const btnReadExplanation = document.getElementById("btn-read-explanation");
const btnNextQuestion = document.getElementById("btn-next-question");
const btnBgm = document.getElementById("btn-bgm");
const bgmText = document.getElementById("bgm-text");
const bgmMuteIcon = document.getElementById("bgm-mute-icon");
const bgmBars = document.getElementById("bgm-bars");

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
      if (isMusicPlaying && bgMusic) {
        bgMusic.volume = 0.15;
      }

      utterance.onend = () => {
        // Kembalikan volume musik latar ke normal setelah asisten selesai berbicara
        if (isMusicPlaying && bgMusic) {
          bgMusic.volume = 0.45;
        }
      };

      utterance.onerror = (e) => {
        console.error("Kesalahan Web Speech API:", e);
        // Reset volume jika terjadi error
        if (isMusicPlaying && bgMusic) {
          bgMusic.volume = 0.45;
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
// AUDIO BACKGROUND MUSIC (BGM) CONTROLLER
// =========================================================================
/**
 * Fungsi untuk memutar musik latar secara aman dengan penanganan exception (jika file belum ada).
 */
function playBackgroundMusic() {
  try {
    if (!bgMusic) return;
    bgMusic.volume = 0.45; // Mengatur volume agar ramah di telinga
    
    bgMusic.play()
      .then(() => {
        isMusicPlaying = true;
        updateBgmUI();
      })
      .catch((error) => {
        console.warn("BGM Gagal diputar otomatis (mungkin file music.mp3 belum diunggah atau butuh interaksi pengguna):", error);
        isMusicPlaying = false;
        updateBgmUI();
      });
  } catch (error) {
    console.warn("BGM Gagal diputar secara sinkron:", error);
    isMusicPlaying = false;
    updateBgmUI();
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

// Handler klik tombol BGM
btnBgm.addEventListener("click", () => {
  if (isMusicPlaying) {
    pauseBackgroundMusic();
  } else {
    playBackgroundMusic();
  }
});


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
    contentMateri.classList.remove("hidden");
    contentKuis.classList.add("hidden");

    tabMateri.className = "flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer bg-white/85 text-brand-800 shadow-sm";
    tabKuis.className = "flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer text-slate-700 hover:text-slate-900 hover:bg-white/10";
  } else {
    // Tampilan Tab Kuis Aktif
    contentKuis.classList.remove("hidden");
    contentMateri.classList.add("hidden");

    tabKuis.className = "flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer bg-white/85 text-brand-800 shadow-sm";
    tabMateri.className = "flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer text-slate-700 hover:text-slate-900 hover:bg-white/10";
    
    // Inisialisasi pertanyaan pertama saat tab kuis dibuka
    loadQuizQuestion(currentQuestionIndex);
  }
}

tabMateri.addEventListener("click", () => switchTab("materi"));
tabKuis.addEventListener("click", () => switchTab("kuis"));


// =========================================================================
// SLIDER / CAROUSEL MATERI EDUKASI
// =========================================================================
function renderSlide(index) {
  const currentSlide = slides[index];
  
  // Set teks
  slideIndexText.textContent = index + 1;
  slideTotalText.textContent = slides.length;
  slideTitle.textContent = currentSlide.title;
  slideTextContent.textContent = currentSlide.text;

  // Set icon dinamis dengan mengganti atribut data-lucide
  slideIcon.setAttribute("data-lucide", currentSlide.icon);
  slideBgIcon.setAttribute("data-lucide", currentSlide.bgIcon);

  // Re-render Lucide Icons agar SVG ter-update
  lucide.createIcons();

  // Update indikator titik (dot)
  slideDots.forEach((dot, dotIdx) => {
    if (dotIdx === index) {
      dot.className = "slide-dot w-6 h-3.5 rounded-full bg-brand-500 transition-all duration-300";
    } else {
      dot.className = "slide-dot w-3.5 h-3.5 rounded-full bg-slate-200 hover:bg-slate-300 transition-all duration-300 cursor-pointer";
    }
  });

  // Atur state keaktifan tombol navigasi slide
  btnPrev.disabled = index === 0;
  btnNext.innerHTML = index === slides.length - 1 
    ? '<span>Selesai Belajar</span> <i data-lucide="check-circle" class="w-5 h-5"></i>' 
    : '<span>Selanjutnya</span> <i data-lucide="arrow-right" class="w-5 h-5"></i>';
  
  lucide.createIcons();
}

// Handler Navigasi Slider
btnPrev.addEventListener("click", () => {
  if (currentSlideIndex > 0) {
    currentSlideIndex--;
    renderSlide(currentSlideIndex);
  }
});

btnNext.addEventListener("click", () => {
  if (currentSlideIndex < slides.length - 1) {
    currentSlideIndex++;
    renderSlide(currentSlideIndex);
  } else {
    // Jika materi terakhir selesai dibaca, arahkan otomatis ke tab kuis
    switchTab("kuis");
  }
});

// Klik langsung pada titik indikator (dots) untuk berpindah materi
slideDots.forEach((dot, dotIdx) => {
  dot.addEventListener("click", () => {
    currentSlideIndex = dotIdx;
    renderSlide(currentSlideIndex);
  });
});


// =========================================================================
// PAPAN SKOR KELOMPOK (SCOREBOARD LOGIC)
// =========================================================================
function updateScoreboard() {
  scoreTextA.textContent = scoreGroupA;
  scoreTextB.textContent = scoreGroupB;
}

// Kelompok A
btnPlusA.addEventListener("click", () => {
  scoreGroupA++;
  updateScoreboard();
});
btnMinusA.addEventListener("click", () => {
  if (scoreGroupA > 0) {
    scoreGroupA--;
    updateScoreboard();
  }
});

// Kelompok B
btnPlusB.addEventListener("click", () => {
  scoreGroupB++;
  updateScoreboard();
});
btnMinusB.addEventListener("click", () => {
  if (scoreGroupB > 0) {
    scoreGroupB--;
    updateScoreboard();
  }
});

// Reset Skor Kembali ke Nol
btnResetScores.addEventListener("click", () => {
  const konfirmasi = confirm("Apakah Anda yakin ingin me-reset skor Kelompok A dan Kelompok B kembali ke 0?");
  if (konfirmasi) {
    scoreGroupA = 0;
    scoreGroupB = 0;
    updateScoreboard();
  }
});


// =========================================================================
// LOGIKA GAME VERSUS KUIS (CORE SYSTEM)
// =========================================================================
function loadQuizQuestion(index) {
  // Ambil soal berdasarkan indeks aktif
  const soalData = kuisSoal[index];

  if (!soalData) {
    questionText.textContent = "Kuis Selesai! Terima kasih telah berpartisipasi.";
    btnReadQuestion.classList.add("hidden");
    controlShowAnswerContainer.classList.add("hidden");
    jawabanPanel.classList.add("hidden");
    return;
  }

  // Update label dinamis
  labelSoal.textContent = `Soal ${index + 1} dari ${kuisSoal.length}`;
  
  // Set teks soal, jawaban, dan penjelasan
  questionText.textContent = soalData.kasus;
  answerText.textContent = soalData.jawaban;
  explanationText.textContent = soalData.penjelasan;

  // Sembunyikan panel jawaban terlebih dahulu (persiapan tampil soal baru)
  jawabanPanel.classList.add("hidden");
  controlShowAnswerContainer.classList.remove("hidden");
}

// Tombol Tampilkan Jawaban
btnShowAnswer.addEventListener("click", () => {
  // Sembunyikan tombol "Tampilkan Jawaban" sendiri
  controlShowAnswerContainer.classList.add("hidden");
  // Munculkan panel jawaban lengkap dengan animasi fade-in
  jawabanPanel.classList.remove("hidden");
});

// Tombol Bacakan Soal (Web Speech API)
btnReadQuestion.addEventListener("click", () => {
  const soalData = kuisSoal[currentQuestionIndex];
  if (soalData) {
    speakIndonesian(soalData.kasus);
  }
});

// Tombol Bacakan Penjelasan (Membacakan jawaban + penjelasan sekaligus)
btnReadExplanation.addEventListener("click", () => {
  const soalData = kuisSoal[currentQuestionIndex];
  if (soalData) {
    const teksBacakan = `Jawaban: ${soalData.jawaban}. Penjelasan: ${soalData.penjelasan}`;
    speakIndonesian(teksBacakan);
  }
});

// Tombol Soal Selanjutnya
btnNextQuestion.addEventListener("click", () => {
  // Increment indeks kuis
  currentQuestionIndex++;
  
  // Loop kembali ke indeks awal jika sudah melebihi jumlah soal (memungkinkan perulangan interaktif)
  if (currentQuestionIndex >= kuisSoal.length) {
    currentQuestionIndex = 0;
  }

  loadQuizQuestion(currentQuestionIndex);
});


// =========================================================================
// INITIAL WELCOME SCREEN BUTTON ACTION (MEMULAI APLIKASI)
// =========================================================================
if (btnMulai) {
  btnMulai.addEventListener("click", () => {
    try {
      // 1. Hilangkan Welcome Screen dengan animasi halus atau langsung
      if (welcomeScreen) {
        welcomeScreen.classList.add("hidden");
      }
      
      // 2. Munculkan layout utama
      if (mainLayout) {
        mainLayout.classList.remove("hidden");
      }

      // 3. Putar Musik Latar (BGM) loop
      try {
        playBackgroundMusic();
      } catch (err) {
        console.warn("BGM play failed inside click handler:", err);
      }

      // 4. Gunakan Web Speech API untuk mengucapkan kalimat sambutan hangat
      try {
        const sambutan = "Selamat datang dalam edukasi Nutri Level untuk kesehatan ibu hamil.";
        speakIndonesian(sambutan);
      } catch (err) {
        console.warn("Speech Synthesis failed inside click handler:", err);
      }

      // 5. Inisialisasi materi edukasi awal (slide ke-0)
      currentSlideIndex = 0;
      try {
        renderSlide(currentSlideIndex);
      } catch (err) {
        console.error("Gagal me-render slide pertama:", err);
      }
    } catch (globalErr) {
      console.error("Kesalahan umum saat memulai aplikasi:", globalErr);
    }
  });
}

// Inisialisasi awal saat dokumen selesai dimuat secara tangguh (robust ready check)
function initializeApp() {
  try {
    if (typeof lucide !== "undefined" && lucide.createIcons) {
      lucide.createIcons();
    }
  } catch (e) {
    console.warn("Gagal merender ikon lucide saat start:", e);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}
