import React from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  BookOpen,
  CalendarCheck,
  ClipboardList,
  Award,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Plus,
  Users,
  Heart,
  BellRing,
} from 'lucide-react';

export const GuruDashboard: React.FC = () => {
  const { currentUser, schedules, submissions, assignments, quizzes, setCurrentView, classes } = useLMS();

  // Find schedules for this teacher
  const teacherSchedules = schedules.filter(
    (s) => s.teacherId === currentUser?.id || s.teacherName.includes(currentUser?.name?.split(',')[0] || 'Fatimah')
  );

  // Submissions needing grading
  const pendingSubmissions = submissions.filter((s) => s.status === 'Menunggu Penilaian');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold backdrop-blur-xs mb-3 border border-amber-400/30">
            <span>Portal Pendidik / Asatidz MI Assuyutiyah</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Assalamu'alaikum, {currentUser?.name}
          </h1>
          <p className="text-emerald-100/90 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Selamat datang di panel ruang kerja dewan guru. Anda mengampu mata pelajaran <strong>{currentUser?.subjectsTaught?.join(', ') || 'Fikih & Al-Qur\'an Hadis'}</strong> untuk jenjang kelas 5 dan 6.
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              onClick={() => setCurrentView('mutabaah-guru')}
              className="px-3.5 py-2 bg-rose-500 hover:bg-rose-400 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-sm cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 text-white fill-white" />
              <span>Buku Penghubung & Mutaba'ah</span>
            </button>
            <button
              onClick={() => setCurrentView('absensi-siswa')}
              className="px-3.5 py-2 bg-amber-400 text-amber-950 rounded-xl text-xs font-bold hover:bg-amber-300 transition-colors flex items-center space-x-1.5 shadow-sm cursor-pointer"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Input & Rekap Absensi (Harian / Smt)</span>
            </button>
            <button
              onClick={() => setCurrentView('penilaian-rapor')}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-sm cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-amber-200" />
              <span>Input Nilai Rapor Semester</span>
            </button>
            <button
              onClick={() => setCurrentView('manajemen-materi')}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors border border-white/20 flex items-center space-x-1.5 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>Unggah Modul Baru</span>
            </button>
            <button
              onClick={() => setCurrentView('manajemen-tugas-kuis')}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors border border-white/20 flex items-center space-x-1.5 cursor-pointer"
            >
              <ClipboardList className="w-3.5 h-3.5 text-amber-300" />
              <span>Koreksi Tugas Masuk ({pendingSubmissions.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Teacher Interactive Alert: Pengingat Input Nilai Rapor & Presensi Harian */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 rounded-2xl p-4 sm:p-5 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-emerald-600/30">
        <div className="flex items-start sm:items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 animate-pulse">
            <BellRing className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-xs mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping" />
              Pengingat Asatidz: Batas Akhir Input Nilai Rapor Semester
            </div>
            <h3 className="text-sm sm:text-base font-extrabold leading-tight">
              Batas Akhir Sinkronisasi Nilai & Ledger Rapor: 28 Oktober 2026 (Tersisa 5 Hari)
            </h3>
            <p className="text-xs text-emerald-100 mt-0.5">
              Mohon pastikan nilai harian, UTS, UAS, absensi, serta catatan karakter & mutaba'ah santri telah lengkap sebelum dicetak resmi berstandar Kemenag RI.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setCurrentView('penilaian-rapor')}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <span>Buka Penilaian Rapor</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tugas Perlu Dikoreksi</span>
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <ClipboardList className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-rose-600">{pendingSubmissions.length} Berkas</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Jawaban santri menunggu dinilai</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Kelas Binaan / Diampu</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">Kelas 5A & 5B</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Wali Kelas 5A (30 Santri)</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Tugas & Kuis Aktif</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{assignments.length + quizzes.length} Materi Uji</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Tugas berkala & CBT interaktif</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Status Pengisian Rapor</span>
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-teal-800">85% Lengkap</div>
          <p className="text-[11px] text-teal-600 font-semibold mt-0.5">Nilai Tugas & UTS terinput</p>
        </div>
      </div>

      {/* Two Column Layout: Jadwal Mengajar & Tugas Pending */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Jadwal Mengajar & Info Kelas */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Jadwal Mengajar & Info Kelas Guru</h3>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              Semester Genap
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {teacherSchedules.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">Tidak ada jadwal tercatat.</p>
            ) : (
              teacherSchedules.slice(0, 6).map((sc) => (
                <div
                  key={sc.id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-16 text-center">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">{sc.day}</span>
                      <span className="text-xs font-bold text-emerald-800">{sc.startTime}</span>
                    </div>
                    <div className="border-l border-slate-200 pl-3">
                      <h4 className="text-xs font-bold text-slate-900">{sc.subjectName}</h4>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                        <span className="font-semibold text-slate-700">{sc.className}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" /> {sc.room}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setCurrentView('absensi-siswa')}
                    className="px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                  >
                    Buka Absensi
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Tugas Masuk yang Perlu Umpan Balik */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <ClipboardList className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-bold text-slate-900">Koreksi & Umpan Balik Cepat</h3>
            </div>
            <button
              onClick={() => setCurrentView('manajemen-tugas-kuis')}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1"
            >
              <span>Semua Tugas</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {pendingSubmissions.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                Alhamdulillah! Semua tugas santri telah dikoreksi.
              </div>
            ) : (
              pendingSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-3 rounded-xl border border-slate-100 bg-rose-50/30 flex flex-col justify-between space-y-2 hover:bg-rose-50/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-xs text-slate-900">{sub.studentName}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {sub.assignmentTitle}
                      </div>
                    </div>
                    <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                      Baru Masuk
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="text-slate-400 font-mono">{sub.submittedAt}</span>
                    <button
                      onClick={() => setCurrentView('manajemen-tugas-kuis')}
                      className="px-2 py-1 text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors"
                    >
                      Beri Nilai
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
