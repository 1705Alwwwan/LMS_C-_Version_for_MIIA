import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  BookOpen,
  GraduationCap,
  Users,
  ShieldCheck,
  Award,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Clock,
  Layers,
  ChevronRight,
  Heart,
  FileText,
  MessageCircle,
  Download,
  ChevronDown,
  ChevronUp,
  Star,
  Check,
  Smartphone,
  Lock,
  Wallet,
} from 'lucide-react';
import { PWAInstallButton } from '../common/PWAInstallButton';

export const LandingPage: React.FC = () => {
  const { setCurrentView, announcements, academicCalendar } = useLMS();

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Interactive Checklist Demo in Mutaba'ah preview
  const [demoChecklist, setDemoChecklist] = useState({
    subuh: true,
    dzuhur: true,
    ashar: true,
    maghrib: false,
    isya: false,
    dhuha: true,
    tilawati: true,
    tahfidz: true,
  });

  const toggleCheck = (key: keyof typeof demoChecklist) => {
    setDemoChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const faqs = [
    {
      q: 'Berapa besaran iuran SPP bulanan di MI Assuyutiyah?',
      a: 'Iuran SPP di MI Assuyutiyah bersifat flat sebesar Rp 120.000 per bulan untuk seluruh jenjang pendidikan (Kelas 1 sampai Kelas 6) tanpa biaya katering makan siang. Iuran ini sudah mencakup kegiatan belajar mengajar, akses penuh LMS digital, ujian CBT, praktikum, dan rapor semester berstandar Kemenag RI.',
    },
    {
      q: 'Bagaimana cara orang tua/wali santri memantau ibadah harian santri?',
      a: 'Melalui Buku Penghubung & Mutaba\'ah Yaumiyah digital di LMS MI Assuyutiyah, wali santri dapat memantau checklist sholat 5 waktu, sholat dhuha, tadarus Al-Qur\'an, dan setoran tahfidz juz 30, yang kemudian diverifikasi dan diberi catatan akhlak secara berkala oleh Wali Kelas.',
    },
    {
      q: 'Apakah Rapor Semester yang dicetak sudah berstandar resmi Kemenag RI?',
      a: 'Ya, rapor kami telah menggunakan format resmi Kurikulum Merdeka Kemenag RI, mencakup kop surat resmi, logo Ikhlas Beramal Kemenag, deskripsi capaian pembelajaran rumpun PAI (Fikih, Al-Qur\'an Hadis, Akidah Akhlak, SKI, Bahasa Arab), nilai ekstrakurikuler, serta tanda tangan digital Kepala Madrasah dan Wali Kelas.',
    },
    {
      q: 'Bagaimana cara memasang (install) aplikasi LMS ini di smartphone (HP)?',
      a: 'LMS MI Assuyutiyah telah mendukung Progressive Web App (PWA). Cukup klik tombol "Pasang Aplikasi" di menu atau buka browser Chrome/Safari di HP, lalu pilih opsi "Add to Home Screen" / "Tambahkan ke Layar Utama" untuk akses cepat layaknya aplikasi native.',
    },
    {
      q: 'Bagaimana sistem pengingat tagihan SPP dan tugas santri dikirimkan?',
      a: 'Tata Usaha dapat mengirimkan notifikasi tagihan SPP bulanan resmi langsung ke WhatsApp wali santri via WhatsApp Gateway berisikan nama santri, NISN, nominal Rp 120.000, dan nomor rekening Bank Syariah Indonesia (BSI) Madrasah.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Bar Madrasah */}
      <div className="bg-emerald-950 text-emerald-100 text-[11px] py-2 px-4 sm:px-8 border-b border-emerald-900">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" /> Jl. Pesantren Assuyutiyah No. 15, Sukamaju
            </span>
            <span className="hidden md:flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-400" /> (021) 8765-4321
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="font-arabic text-amber-300 text-xs sm:text-sm font-semibold">
              مَدْرَسَةٌ اِبْتِدَائِيَّةٌ السُّيُوْطِيَّة
            </span>
            <span className="bg-emerald-800 text-amber-300 font-bold px-2 py-0.5 rounded text-[10px]">
              NPSN: 60728912 • Kemenag RI
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-950 flex items-center justify-center text-white shadow-md shadow-emerald-800/20">
              <BookOpen className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-slate-900 text-lg sm:text-xl tracking-tight">
                  MI ASSUYUTIYAH
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 rounded-md">
                  Akreditasi A
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Sistem Pembelajaran & Mutaba'ah Digital Terpadu
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <PWAInstallButton variant="compact" />
            <button
              onClick={() => setCurrentView('login')}
              className="px-4 sm:px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-700/20 flex items-center space-x-2 transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-amber-300" />
              <span>Masuk Portal LMS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-teal-950 text-white py-14 sm:py-20">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-700/60 border border-emerald-400/30 text-amber-300 text-xs font-semibold backdrop-blur-xs">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Portal Digital Madrasah Ibtidaiyah Berstandar Kemenag RI</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Membentuk Generasi Qur'ani, Berkarakter Sholeh, & Unggul Teknologi
              </h1>

              <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0">
                LMS Terpadu <strong>MI Assuyutiyah</strong> memadukan kurikulum nasional, penguatan karakter islami, 
                <strong> Buku Penghubung & Mutaba'ah Ibadah</strong>, cetak rapor resmi Kemenag, 
                serta layanan terpadu Asatidz, Santri, dan Orang Tua/Wali dalam satu sistem yang aman dan terproteksi.
              </p>

              {/* Secure Official Login CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => setCurrentView('login')}
                  className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 rounded-xl font-extrabold text-sm shadow-xl transition-all cursor-pointer flex items-center justify-center space-x-2.5 active:scale-95"
                >
                  <Lock className="w-4 h-4 text-amber-950" />
                  <span>Masuk ke Portal LMS Resmi</span>
                  <ArrowRight className="w-4 h-4 text-amber-950" />
                </button>
                <div className="flex items-center gap-2 text-xs text-emerald-200/90 bg-emerald-950/40 px-3.5 py-2 rounded-xl border border-emerald-500/20">
                  <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>Akses terproteksi kredensial resmi dari TU Madrasah</span>
                </div>
              </div>

              {/* Statistics Counters */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-emerald-700/60">
                <div>
                  <div className="text-2xl font-black text-amber-300">348+</div>
                  <div className="text-[11px] text-emerald-200">Santri Terdaftar</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-amber-300">24</div>
                  <div className="text-[11px] text-emerald-200">Asatidz & Asatidzah</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-amber-300">13</div>
                  <div className="text-[11px] text-emerald-200">Rombongan Belajar (1-6)</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-amber-300">100%</div>
                  <div className="text-[11px] text-emerald-200">Rapor Digital Kemenag</div>
                </div>
              </div>
            </div>

            {/* Interactive Feature Live Simulator */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900/95 border border-emerald-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      Live Preview: Mutaba'ah Yaumiyah
                    </span>
                  </div>
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2.5 py-0.5 rounded-full font-bold">
                    Coba Interaktif
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-3">
                  Klik checkbox di bawah ini untuk mensimulasikan catatan ibadah santri hari ini:
                </p>

                {/* Simulated Checklist */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => toggleCheck('subuh')}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                      demoChecklist.subuh
                        ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200'
                        : 'bg-slate-800/50 border-slate-700 text-slate-400'
                    }`}
                  >
                    <span>Sholat Subuh</span>
                    <Check className={`w-4 h-4 ${demoChecklist.subuh ? 'text-emerald-400' : 'text-slate-600'}`} />
                  </button>

                  <button
                    onClick={() => toggleCheck('dzuhur')}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                      demoChecklist.dzuhur
                        ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200'
                        : 'bg-slate-800/50 border-slate-700 text-slate-400'
                    }`}
                  >
                    <span>Sholat Dzuhur</span>
                    <Check className={`w-4 h-4 ${demoChecklist.dzuhur ? 'text-emerald-400' : 'text-slate-600'}`} />
                  </button>

                  <button
                    onClick={() => toggleCheck('ashar')}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                      demoChecklist.ashar
                        ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200'
                        : 'bg-slate-800/50 border-slate-700 text-slate-400'
                    }`}
                  >
                    <span>Sholat Ashar</span>
                    <Check className={`w-4 h-4 ${demoChecklist.ashar ? 'text-emerald-400' : 'text-slate-600'}`} />
                  </button>

                  <button
                    onClick={() => toggleCheck('maghrib')}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                      demoChecklist.maghrib
                        ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200'
                        : 'bg-slate-800/50 border-slate-700 text-slate-400'
                    }`}
                  >
                    <span>Sholat Maghrib</span>
                    <Check className={`w-4 h-4 ${demoChecklist.maghrib ? 'text-emerald-400' : 'text-slate-600'}`} />
                  </button>

                  <button
                    onClick={() => toggleCheck('isya')}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                      demoChecklist.isya
                        ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200'
                        : 'bg-slate-800/50 border-slate-700 text-slate-400'
                    }`}
                  >
                    <span>Sholat Isya</span>
                    <Check className={`w-4 h-4 ${demoChecklist.isya ? 'text-emerald-400' : 'text-slate-600'}`} />
                  </button>

                  <button
                    onClick={() => toggleCheck('dhuha')}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                      demoChecklist.dhuha
                        ? 'bg-amber-950/80 border-amber-500/60 text-amber-200'
                        : 'bg-slate-800/50 border-slate-700 text-slate-400'
                    }`}
                  >
                    <span>Sholat Dhuha</span>
                    <Check className={`w-4 h-4 ${demoChecklist.dhuha ? 'text-amber-400' : 'text-slate-600'}`} />
                  </button>

                  <button
                    onClick={() => toggleCheck('tilawati')}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                      demoChecklist.tilawati
                        ? 'bg-teal-950/80 border-teal-500/60 text-teal-200'
                        : 'bg-slate-800/50 border-slate-700 text-slate-400'
                    }`}
                  >
                    <span>Tadarus Al-Qur'an</span>
                    <Check className={`w-4 h-4 ${demoChecklist.tilawati ? 'text-teal-400' : 'text-slate-600'}`} />
                  </button>

                  <button
                    onClick={() => toggleCheck('tahfidz')}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                      demoChecklist.tahfidz
                        ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200'
                        : 'bg-slate-800/50 border-slate-700 text-slate-400'
                    }`}
                  >
                    <span>Setoran Juz 30</span>
                    <Check className={`w-4 h-4 ${demoChecklist.tahfidz ? 'text-emerald-400' : 'text-slate-600'}`} />
                  </button>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-[11px] text-slate-300">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-amber-300">Catatan Asatidz / Wali Kelas:</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">Tervalidasi ✓</span>
                  </div>
                  <p className="italic">
                    "Alhamdulillah ananda Ahmad Zaki istiqomah tahfidz surat An-Naba' dan sholat Dhuha berjamaah."
                  </p>
                </div>

                <button
                  onClick={() => setCurrentView('login')}
                  className="w-full mt-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md"
                >
                  <Lock className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Buka Portal Lengkap MI Assuyutiyah</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pilar Fitur Khas Madrasah */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
              Inovasi Khas Madrasah Ibtidaiyah
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
              Fitur Dirancang Khusus untuk Kebutuhan Pesantren & Madrasah
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Tidak hanya materi umum, LMS MI Assuyutiyah dilengkapi modul pembinaan akhlak santri, standar resmi Kemenag RI, serta integrasi wali murid.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Fitur 1: Mutaba'ah */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-400 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Buku Mutaba'ah Yaumiyah</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Pemantauan ibadah harian: Sholat 5 waktu, Dhuha, Tadarus Al-Qur'an, dan setoran tahfidz Juz 30 dengan dialog akhlak 2 arah bersama Wali Kelas.
              </p>
              <div className="mt-4 text-[11px] font-semibold text-rose-700 flex items-center gap-1">
                <span>Catatan Ibadah & Wali Santri</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Fitur 2: Cetak Rapor Kemenag */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-400 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Cetak Rapor Kemenag RI</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Format resmi Kurikulum Merdeka Kemenag dengan logo Ikhlas Beramal, deskripsi capaian mapel PAI (Fikih, Hadis, Akidah, SKI, Bhs Arab) & TTD sah.
              </p>
              <div className="mt-4 text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                <span>Standar Kemenag & PDF Siap Cetak</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Fitur 3: WA Gateway SPP */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-400 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Notifikasi WA Gateway</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Pengingat tagihan SPP bulanan otomatis ke WhatsApp wali santri berisikan format resmi: nama santri, NISN, nominal Rp 120.000, & nomor rekening BSI madrasah.
              </p>
              <div className="mt-4 text-[11px] font-semibold text-teal-700 flex items-center gap-1">
                <span>1-Klik Kirim Pesan wa.me</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Fitur 4: Kenaikan Kelas Massal & Kalender */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-400 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Promosi Massal & Kalender</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Alat promosi massal akhir tahun ajaran (1-klik naikkan seluruh rombel) serta kalender pendidikan yang otomatis ternotifikasi ke dewan guru dan santri.
              </p>
              <div className="mt-4 text-[11px] font-semibold text-amber-700 flex items-center gap-1">
                <span>Efisiensi Tata Usaha 100%</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Official SPP Flat Structure & PWA Showcase Section */}
      <section className="py-16 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Informasi SPP Flat Transparan */}
            <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Transparansi Keuangan
                    </span>
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                      Iuran SPP Flat MI Assuyutiyah
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-5">
                  MI Assuyutiyah menerapkan sistem pembiayaan pendidikan yang transparan, terjangkau, dan tanpa pungutan tersembunyi.
                </p>

                {/* Flat SPP Card Box */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-3 border-b border-emerald-200/80">
                    <div>
                      <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                        Tarif SPP Bulanan (Semua Jenjang):
                      </span>
                      <div className="text-3xl font-black text-emerald-950 mt-0.5">
                        Rp 120.000 <span className="text-sm font-bold text-emerald-700">/ bulan</span>
                      </div>
                    </div>
                    <span className="inline-block self-start sm:self-auto text-xs font-bold text-emerald-800 bg-white/80 px-3 py-1 rounded-full border border-emerald-300">
                      Kelas 1 s/d Kelas 6 Flat
                    </span>
                  </div>

                  <div className="mt-4 space-y-2.5 text-xs text-slate-700">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Bebas Biaya Katering:</strong> Tidak ada kewajiban katering (santri membawa bekal atau jajan sehat di kantin madrasah).</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Akses LMS Terpadu:</strong> Akses penuh modul digital, bank tugas, dan ujian CBT komputer.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Rapor Resmi Kemenag:</strong> Rapor digital berkala, mutaba'ah ibadah harian, dan pembinaan karakter.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Ekstrakurikuler Madrasah:</strong> Bimbingan kepanduan, tilawah, tahfidz, dan seni hadroh.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="text-slate-500 text-[11px]">
                  Pembayaran resmi via <strong>Bank BSI</strong> No. Rek: <span className="text-slate-800 font-bold">7123-456-789</span> atau Loket TU.
                </div>
                <button
                  onClick={() => setCurrentView('login')}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shrink-0"
                >
                  Cek Riwayat Tagihan
                </button>
              </div>
            </div>

            {/* PWA & Mobile Install Showcase */}
            <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 to-emerald-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl border border-emerald-500/20 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-4 border border-emerald-500/30">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Dukungan Progressive Web App (PWA)</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold leading-snug">
                  Pasang LMS MI Assuyutiyah di Smartphone Anda
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Akses cepat presensi dewan asatidz, mutaba'ah ibadah harian santri, materi pembelajaran, dan informasi SPP langsung dari layar utama HP Android atau iPhone layaknya aplikasi resmi tanpa mengetik alamat browser.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <PWAInstallButton variant="banner" />
                  <button
                    onClick={() => setCurrentView('login')}
                    className="px-4 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 text-white font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Masuk via Browser</span>
                  </button>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-slate-800 grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <div className="font-bold text-emerald-400 text-sm">⚡ Ringan</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">&lt; 2 MB memori</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <div className="font-bold text-emerald-400 text-sm">📴 Offline Cache</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Buka jadwal kapan pun</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <div className="font-bold text-emerald-400 text-sm">🔔 Real-time</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Pengingat tugas & rapat</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kalender Pendidikan & Agenda Terkini */}
      <section className="py-14 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-200 gap-3">
            <div>
              <span className="text-xs font-bold text-amber-700 tracking-wider uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Agenda & Kalender Madrasah
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                Kalender Pendidikan Semester Genap 2024/2025
              </h3>
            </div>
            <button
              onClick={() => setCurrentView('login')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Buka Kalender Lengkap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {academicCalendar.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-2">
                    <span className="font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                      {item.startDate} {item.endDate !== item.startDate ? `s/d ${item.endDate}` : ''}
                    </span>
                    <span className="text-slate-500 font-semibold text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">
                      {item.category}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Sasaran: {item.targetRole}</span>
                  <span className="font-semibold text-emerald-700">Tercatat di LMS ✓</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pengumuman Terkini */}
      <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" /> Warta & Pengumuman Resmi
              </h3>
              <p className="text-xs text-slate-500">Informasi terbaru dari civitas akademika MI Assuyutiyah</p>
            </div>
            <button
              onClick={() => setCurrentView('login')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
            >
              <span>Lihat Semua</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {announcements.slice(0, 3).map((ann) => (
              <div key={ann.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ann.priority === 'Mendesak'
                          ? 'bg-rose-100 text-rose-700'
                          : ann.priority === 'Penting'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {ann.priority}
                    </span>
                    <span className="text-[10px] text-slate-400">{ann.date}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-2">{ann.title}</h4>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">{ann.content}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Oleh: {ann.author}</span>
                  <span className="font-semibold text-emerald-700">Untuk {ann.targetRole}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-14 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Informasi teknis, pembiayaan flat Rp 120.000, dan panduan penggunaan LMS MI Assuyutiyah
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <span className="text-sm font-bold text-slate-900">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-emerald-700 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-10 mt-auto border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center space-x-2 text-white font-bold text-base">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <span>MADRASAH IBTIDAIYAH ASSUYUTIYAH</span>
              </div>
              <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                Lembaga pendidikan formal tingkat dasar berciri khas Islam di bawah naungan Kementerian Agama Republik Indonesia, berdedikasi membentuk generasi sholeh, berprestasi, dan berwawasan luas.
              </p>
              <p className="text-emerald-400 font-arabic text-sm">
                العِلْمُ نُوْرٌ وَالجَهْلُ ظَلَامٌ — "Ilmu adalah cahaya, kebodohan adalah kegelapan"
              </p>
            </div>

            <div>
              <h5 className="font-bold text-slate-200 mb-3 uppercase tracking-wider text-[11px]">
                Akses Portal LMS
              </h5>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => setCurrentView('login')} className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-emerald-500" />
                    <span>Portal Administrator & TU</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('login')} className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-emerald-500" />
                    <span>Portal Dewan Asatidz / Guru</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('login')} className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-emerald-500" />
                    <span>Portal Santri & Wali Siswa</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('login')} className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span>Bantuan Kredensial & Lupa Sandi</span>
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-slate-200 mb-3 uppercase tracking-wider text-[11px]">
                Sekretariat Madrasah
              </h5>
              <p className="text-slate-400 leading-relaxed">
                Gedung Utama MI Assuyutiyah<br />
                Jl. Pesantren Assuyutiyah No. 15<br />
                Kec. Sukamaju, Jawa Barat<br />
                Email: info@mi-assuyutiyah.sch.id<br />
                WhatsApp TU: 0812-3456-7890
              </p>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} LMS Madrasah Ibtidaiyah Assuyutiyah. Hak Cipta Dilindungi.</p>
            <p className="mt-2 sm:mt-0">Sistem Informasi Manajemen Pembelajaran & Akademik Terpadu Kemenag RI</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
