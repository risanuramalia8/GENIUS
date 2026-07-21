import { Slide, Question } from "./types";

export const SLIDES_DATA: Slide[] = [
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

export const KUIS_SOAL_DATA: Question[] = [
  {
    kasus: "Ibu Dina ngidam es teh manis kemasan. Di botolnya ada logo huruf C berwarna kuning. Apa arti logo tersebut, dan bolehkah bumil mengonsumsinya setiap hari?",
    jawaban: "Logo C kuning artinya kandungan gula cukup tinggi dan menggunakan tambahan pemanis buatan.",
    penjelasan: "Jika diminum tiap hari, asupan gula berlebih akan meningkatkan risiko diabetes selama kehamilan dan merusak gigi ibu hamil. Kesehatan mulut yang memburuk bisa berisiko bagi janin lho!"
  }
];
