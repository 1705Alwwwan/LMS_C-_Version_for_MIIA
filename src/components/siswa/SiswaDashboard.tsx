import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  Wallet,
  CalendarCheck,
  Clock,
  Megaphone,
  BookOpen,
  Award,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Calendar,
  TrendingUp,
  LineChart,
  Star,
  GraduationCap,
  Heart,
  BellRing,
} from 'lucide-react';

export const SiswaDashboard: React.FC = () => {
  const {
    currentUser,
    invoices,
    attendances,
    schedules,
    announcements,
    assignments,
    submissions,
    historicalGrades,
    setCurrentView,
  } = useLMS();

  const [activeChartTab, setActiveChartTab] = useState<number>(10); // default to semester 10
  const [metricMode, setMetricMode] = useState<'ALL' | 'KEMENAG' | 'UMUM'>('ALL');

  // Student specific invoices
  const studentInvoices = invoices.filter(
    (inv) => inv.studentId === currentUser?.id || inv.studentName.includes('Ahmad Zaki')
  );
  const pendingInvoices = studentInvoices.filter((inv) => inv.status === 'BELUM LUNAS');
  const latestInvoice = studentInvoices[0];

  // Student attendance records
  const myAttendances = attendances.filter(
    (att) => att.studentId === currentUser?.id || att.studentName.includes('Ahmad Zaki')
  );
  const totalDays = myAttendances.length;
  const hadirCount = myAttendances.filter((a) => a.status === 'Hadir').length;
  const sakitCount = myAttendances.filter((a) => a.status === 'Sakit').length;
  const izinCount = myAttendances.filter((a) => a.status === 'Izin').length;
  const percentAttendance = totalDays > 0 ? Math.round((hadirCount / totalDays) * 100) : 95;

  // Schedules for today / student class
  const classSchedules = schedules.filter(
    (sc) => sc.classId === currentUser?.classId || sc.className.includes('5A')
  );
  const todaySchedules = classSchedules.filter((sc) => sc.day === 'Senin' || sc.day === 'Selasa');

  // Active assignments
  const activeAssignments = assignments.slice(0, 3);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Banner Santri */}
      <div className="rounded-2xl bg-gradient-to-r from-teal-800 via-emerald-800 to-emerald-950 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold backdrop-blur-xs mb-3 border border-amber-400/30">
            <span>Portal Santri & Siswa Madrasah</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ahlan wa Sahlan, {currentUser?.name}!
          </h1>
          <p className="text-emerald-100/90 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            NISN: <strong>{currentUser?.nisn || '0098765432'}</strong> • {currentUser?.className || 'Kelas 5A'} • Wali Kelas: <strong>Usth. Siti Fatimah, S.Pd.I</strong>
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              onClick={() => setCurrentView('mutabaah-santri')}
              className="px-3.5 py-2 bg-rose-500 hover:bg-rose-400 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-sm cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 text-white fill-white" />
              <span>Buku Penghubung & Mutaba'ah</span>
            </button>
            <button
              onClick={() => setCurrentView('nilai-evaluasi')}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-sm cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-amber-200" />
              <span>Grafik Prestasi (Kelas 1 - 6)</span>
            </button>
            <button
              onClick={() => setCurrentView('materi-belajar')}
              className="px-3.5 py-2 bg-amber-400 text-amber-950 rounded-xl text-xs font-bold hover:bg-amber-300 transition-colors flex items-center space-x-1.5 shadow-sm cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Buka E-Modul Belajar</span>
            </button>
            <button
              onClick={() => setCurrentView('tugas-ujian')}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors border border-white/20 flex items-center space-x-1.5 cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span>Kerjakan Tugas & Ujian CBT</span>
            </button>
            <button
              onClick={() => setCurrentView('rapor-akademik')}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors border border-white/20 flex items-center space-x-1.5 cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>Lihat Rapor Digital</span>
            </button>
          </div>
        </div>
      </div>

      {/* Urgent Deadline Alert Banner (Notifikasi Interaktif Real-Time) */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-2xl p-4 sm:p-5 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 animate-pulse">
            <BellRing className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-xs mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-200 animate-ping" />
              Pengingat Deadline Tugas Mendekati Batas Akhir
            </div>
            <h3 className="text-sm sm:text-base font-extrabold leading-tight">
              Tugas Matematika: Operasi Hitung Pecahan (Batas Akhir: Hari Ini 20:00 WIB)
            </h3>
            <p className="text-xs text-amber-100 mt-0.5">
              Tersisa 1 tugas aktif di Kelas 5A yang belum dikirim. Segera unggah jawaban sebelum sistem mengunci otomatis.
            </p>
          </div>
        </div>
        <button
          onClick={() => setCurrentView('tugas-ujian')}
          className="shrink-0 px-4 py-2 bg-white text-orange-900 hover:bg-amber-50 active:scale-95 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span>Kerjakan Sekarang</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Info Tagihan & Absensi Cards matching Diagram Node */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Info Tagihan SPP */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Info Tagihan & SPP Madrasah
                  </h3>
                  <span className="text-sm font-bold text-slate-900">Iuran Rutin Santri</span>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  pendingInvoices.length === 0
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {pendingInvoices.length === 0 ? 'Semua Lunas' : `${pendingInvoices.length} Tagihan Aktif`}
              </span>
            </div>

            <div className="mt-4 space-y-2.5">
              {studentInvoices.slice(0, 2).map((inv) => (
                <div
                  key={inv.id}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">{inv.type}</div>
                    <div className="text-[11px] text-slate-500">Bulan {inv.month}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">{formatRupiah(inv.amount)}</div>
                    <span
                      className={`inline-block text-[10px] font-semibold px-2 py-0.2 rounded-full mt-0.5 ${
                        inv.status === 'LUNAS'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Pembayaran via Transfer BSI atau Kasir TU</span>
            <span className="font-bold text-emerald-700">Bank BSI: 7123-456-789</span>
          </div>
        </div>

        {/* Info Absensi Kehadiran Pribadi */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Info Rekap Absensi Santri
                  </h3>
                  <span className="text-sm font-bold text-slate-900">Kehadiran Semester Ini</span>
                </div>
              </div>
              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {percentAttendance}% Disiplin
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-[10px] font-bold text-emerald-700 uppercase">Hadir</span>
                <div className="text-xl font-extrabold text-emerald-900 mt-0.5">{hadirCount || 48} Hari</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                <span className="text-[10px] font-bold text-blue-700 uppercase">Sakit</span>
                <div className="text-xl font-extrabold text-blue-900 mt-0.5">{sakitCount || 1} Hari</div>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                <span className="text-[10px] font-bold text-amber-700 uppercase">Izin</span>
                <div className="text-xl font-extrabold text-amber-900 mt-0.5">{izinCount || 1} Hari</div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Tercatat presensi shalat dhuha & apel pagi</span>
            <span className="font-semibold text-emerald-700">Predikat Sikap: A (Sangat Baik)</span>
          </div>
        </div>
      </div>

      {/* GRAFIK INDEKS PENCAPAIAN & PENINGKATAN KEMAMPUAN (KELAS 1 SMT 1 - KELAS 6 SMT 2) */}
      {(() => {
        const historyData = historicalGrades;
        const activeSem = historyData.find((h) => h.semesterIndex === activeChartTab) || historyData[9];
        const cumulativeAvg = Math.round((historyData.reduce((acc, h) => acc + h.averageScore, 0) / historyData.length) * 10) / 10;
        const highestScore = Math.max(...historyData.map((h) => h.averageScore));
        const firstScore = historyData[0]?.averageScore || 88.5;
        const latestScore = historyData[historyData.length - 1]?.averageScore || 95.9;
        const totalImprovement = Math.round((latestScore - firstScore) * 10) / 10;

        // SVG Geometry
        const svgW = 700;
        const svgH = 200;
        const padX = 40;
        const padY = 25;
        const minS = 85;
        const maxS = 100;

        const getCoord = (idx: number, val: number) => {
          const x = padX + (idx / (historyData.length - 1)) * (svgW - padX * 2);
          const normY = (val - minS) / (maxS - minS);
          const y = svgH - padY - normY * (svgH - padY * 2);
          return { x, y };
        };

        const ptsOverall = historyData.map((h, i) => getCoord(i, h.averageScore));
        const ptsKemenag = historyData.map((h, i) => getCoord(i, h.kemenagAverage));
        const ptsUmum = historyData.map((h, i) => getCoord(i, h.umumAverage));

        const makePath = (pts: { x: number; y: number }[]) =>
          pts.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');

        const pathOverall = makePath(ptsOverall);
        const pathKemenag = makePath(ptsKemenag);
        const pathUmum = makePath(ptsUmum);
        const areaOverall = `${pathOverall} L ${ptsOverall[ptsOverall.length - 1].x} ${svgH - padY} L ${ptsOverall[0].x} ${svgH - padY} Z`;

        return (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-md shadow-emerald-700/20">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                      Grafik Indeks Pencapaian Santri
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Kelas 1 Smt 1 s/d Kelas 6 Smt 2
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Visualisasi dinamika peningkatan nilai keagamaan & akademik selama 12 semester
                  </p>
                </div>
              </div>

              {/* Metric filter buttons */}
              <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100 p-1 rounded-xl text-xs">
                <button
                  onClick={() => setMetricMode('ALL')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    metricMode === 'ALL'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Semua Nilai
                </button>
                <button
                  onClick={() => setMetricMode('KEMENAG')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    metricMode === 'KEMENAG'
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Mapel Kemenag
                </button>
                <button
                  onClick={() => setMetricMode('UMUM')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    metricMode === 'UMUM'
                      ? 'bg-sky-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Mapel Umum
                </button>
              </div>
            </div>

            {/* Quick summary stats pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Rata-Rata Kumulatif</p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl sm:text-2xl font-black text-emerald-700">{cumulativeAvg}</span>
                  <span className="text-xs text-slate-400">/ 100</span>
                </div>
                <p className="text-[10px] text-emerald-600 font-medium mt-0.5">Predikat: Mumtaz (A)</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Peningkatan</p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl sm:text-2xl font-black text-teal-700">+{totalImprovement}</span>
                  <span className="text-xs text-slate-400">poin</span>
                </div>
                <p className="text-[10px] text-teal-600 font-medium mt-0.5">Peningkatan konsisten</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Skor Tertinggi</p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl sm:text-2xl font-black text-amber-600">{highestScore}</span>
                  <span className="text-xs text-slate-400">di Kls 6</span>
                </div>
                <p className="text-[10px] text-amber-600 font-medium mt-0.5">Peringkat 1 Paralel</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Rata-rata Presensi</p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl sm:text-2xl font-black text-indigo-700">99.2%</span>
                </div>
                <p className="text-[10px] text-indigo-600 font-medium mt-0.5">Sangat disiplin & aktif</p>
              </div>
            </div>

            {/* SVG Chart Interactive View */}
            <div className="border border-slate-100 rounded-xl bg-gradient-to-b from-emerald-50/20 via-white to-slate-50/50 p-3 sm:p-4">
              <div className="overflow-x-auto">
                <div className="min-w-[620px]">
                  <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-48 select-none">
                    <defs>
                      <linearGradient id="dashAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Grid lines */}
                    {[85, 90, 95, 100].map((sc) => {
                      const y = svgH - padY - ((sc - minS) / (maxS - minS)) * (svgH - padY * 2);
                      return (
                        <g key={sc}>
                          <line
                            x1={padX}
                            y1={y}
                            x2={svgW - padX}
                            y2={y}
                            stroke="#e2e8f0"
                            strokeDasharray="4 4"
                            strokeWidth="1"
                          />
                          <text x={padX - 8} y={y + 3} textAnchor="end" className="text-[9px] fill-slate-400 font-medium">
                            {sc}
                          </text>
                        </g>
                      );
                    })}

                    {/* Area fill for overall */}
                    {(metricMode === 'ALL' || metricMode === 'KEMENAG') && (
                      <path d={areaOverall} fill="url(#dashAreaGrad)" />
                    )}

                    {/* Path Lines */}
                    {(metricMode === 'ALL' || metricMode === 'UMUM') && (
                      <path
                        d={pathUmum}
                        fill="none"
                        stroke="#0284c7"
                        strokeWidth={metricMode === 'UMUM' ? '3' : '2'}
                        strokeDasharray={metricMode === 'ALL' ? '4 3' : 'none'}
                        className="transition-all"
                      />
                    )}

                    {(metricMode === 'ALL' || metricMode === 'KEMENAG') && (
                      <path
                        d={pathKemenag}
                        fill="none"
                        stroke="#0d9488"
                        strokeWidth={metricMode === 'KEMENAG' ? '3' : '2'}
                        className="transition-all"
                      />
                    )}

                    {metricMode === 'ALL' && (
                      <path
                        d={pathOverall}
                        fill="none"
                        stroke="#059669"
                        strokeWidth="3.5"
                        className="transition-all"
                      />
                    )}

                    {/* Data Points and labels */}
                    {historyData.map((h, i) => {
                      const coord = getCoord(
                        i,
                        metricMode === 'KEMENAG' ? h.kemenagAverage : metricMode === 'UMUM' ? h.umumAverage : h.averageScore
                      );
                      const isSelected = h.semesterIndex === activeChartTab;
                      return (
                        <g
                          key={h.semesterIndex}
                          className="cursor-pointer group"
                          onClick={() => setActiveChartTab(h.semesterIndex)}
                        >
                          {isSelected && (
                            <line
                              x1={coord.x}
                              y1={padY}
                              x2={coord.x}
                              y2={svgH - padY}
                              stroke="#059669"
                              strokeWidth="1.5"
                              strokeDasharray="3 3"
                            />
                          )}
                          <circle
                            cx={coord.x}
                            cy={coord.y}
                            r={isSelected ? '6.5' : '4.5'}
                            fill={isSelected ? '#047857' : '#ffffff'}
                            stroke={isSelected ? '#ffffff' : '#059669'}
                            strokeWidth={isSelected ? '2.5' : '2'}
                            className="transition-all group-hover:scale-125"
                          />
                          <text
                            x={coord.x}
                            y={svgH - 6}
                            textAnchor="middle"
                            className={`text-[9px] font-bold ${
                              isSelected ? 'fill-emerald-800 font-extrabold' : 'fill-slate-500'
                            }`}
                          >
                            K{h.gradeLevel} S{h.semester === 'Ganjil' ? '1' : '2'}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Detail drawer for selected semester */}
              <div className="mt-3 pt-3 border-t border-slate-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs">
                    K{activeSem.gradeLevel}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Kelas {activeSem.gradeLevel} Semester {activeSem.semester} (TA {activeSem.academicYear})
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Rata-Rata: <strong className="text-emerald-700">{activeSem.averageScore}</strong> • Kemenag: <strong>{activeSem.kemenagAverage}</strong> • Umum: <strong>{activeSem.umumAverage}</strong> • Peringkat: <strong>#{activeSem.rank}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                  <button
                    onClick={() => setCurrentView('nilai-evaluasi')}
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1"
                  >
                    <span>Analisis Nilai Lengkap</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setCurrentView('rapor-akademik')}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                  >
                    <span>Cetak Rapor Digital</span>
                    <Award className="w-3.5 h-3.5 text-amber-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Jadwal & Pengumuman matching Diagram Node */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Jadwal Pelajaran Hari Ini */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Jadwal Pelajaran & Mengaji Hari Ini</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Kelas 5A
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {todaySchedules.map((sc) => (
              <div
                key={sc.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-center font-bold text-xs text-emerald-800 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                    {sc.startTime}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{sc.subjectName}</h4>
                    <p className="text-[11px] text-slate-500">{sc.teacherName} • {sc.room}</p>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentView('materi-belajar')}
                  className="px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 rounded-lg transition-colors"
                >
                  Buka Modul
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Pengumuman Madrasah Terbaru */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Megaphone className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">Pengumuman Madrasah</h3>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {announcements
                .filter((a) => a.targetRole === 'ALL' || a.targetRole === 'SISWA')
                .slice(0, 3)
                .map((ann) => (
                  <div key={ann.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-bold px-2 py-0.2 rounded-full bg-amber-100 text-amber-800">
                        {ann.priority}
                      </span>
                      <span className="text-[10px] text-slate-400">{ann.date}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">{ann.title}</h4>
                    <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {ann.content}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
