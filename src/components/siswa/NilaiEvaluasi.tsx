import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  Award,
  BookOpen,
  MessageSquare,
  CheckCircle2,
  Clock,
  TrendingUp,
  HelpCircle,
  FileText,
  LineChart,
  Sparkles,
  ChevronRight,
  GraduationCap,
  Star,
  Check,
} from 'lucide-react';
import { HistoricalSemesterGrade } from '../../types/lms';

export const NilaiEvaluasi: React.FC = () => {
  const { submissions, quizAttempts, currentUser, historicalGrades } = useLMS();

  const [activeMainTab, setActiveMainTab] = useState<'GRAFIK' | 'TUGAS' | 'KUIS' | 'ALL'>('GRAFIK');
  const [selectedSemesterIdx, setSelectedSemesterIdx] = useState<number>(10); // Default to Semester 10 (Kelas 5 Genap)
  const [chartMetric, setChartMetric] = useState<'ALL' | 'KEMENAG' | 'UMUM'>('ALL');

  // Student's graded submissions
  const mySubmissions = submissions.filter(
    (s) => s.studentId === currentUser?.id || s.studentName.includes('Ahmad Zaki')
  );

  // Student's quiz attempts
  const myQuizAttempts = quizAttempts.filter(
    (q) => q.studentId === currentUser?.id || q.studentName.includes('Ahmad Zaki')
  );

  // Average score calculation for submissions & quizzes
  const gradedSubs = mySubmissions.filter((s) => s.score !== undefined);
  const avgTugas =
    gradedSubs.length > 0
      ? Math.round(gradedSubs.reduce((acc, s) => acc + (s.score || 0), 0) / gradedSubs.length)
      : 94;

  const avgKuis =
    myQuizAttempts.length > 0
      ? Math.round(myQuizAttempts.reduce((acc, q) => acc + q.score, 0) / myQuizAttempts.length)
      : 100;

  // Historical grades across all 12 semesters (Kelas 1 Smt 1 s/d Kelas 6 Smt 2)
  const historyData: HistoricalSemesterGrade[] = historicalGrades;

  // Selected semester object
  const activeSemester =
    historyData.find((h) => h.semesterIndex === selectedSemesterIdx) || historyData[9];

  // Overall statistics from history
  const cumulativeAvg =
    Math.round(
      (historyData.reduce((acc, h) => acc + h.averageScore, 0) / historyData.length) * 10
    ) / 10;
  const highestScore = Math.max(...historyData.map((h) => h.averageScore));
  const avgAttendance = Math.round(
    historyData.reduce((acc, h) => acc + h.attendanceRate, 0) / historyData.length
  );

  // SVG Chart Geometry
  const chartWidth = 720;
  const chartHeight = 260;
  const paddingX = 45;
  const paddingY = 35;
  const minScore = 85;
  const maxScore = 100;

  const getCoordinates = (index: number, score: number) => {
    const x =
      paddingX +
      (index / (historyData.length - 1)) * (chartWidth - paddingX * 2);
    const normalizedY = (score - minScore) / (maxScore - minScore);
    const y = chartHeight - paddingY - normalizedY * (chartHeight - paddingY * 2);
    return { x, y };
  };

  // Generate SVG path points
  const pointsOverall = historyData.map((h, i) => getCoordinates(i, h.averageScore));
  const pointsKemenag = historyData.map((h, i) => getCoordinates(i, h.kemenagAverage));
  const pointsUmum = historyData.map((h, i) => getCoordinates(i, h.umumAverage));

  const makeSvgPath = (pts: { x: number; y: number }[]) => {
    return pts.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
    }, '');
  };

  const pathOverall = makeSvgPath(pointsOverall);
  const pathKemenag = makeSvgPath(pointsKemenag);
  const pathUmum = makeSvgPath(pointsUmum);

  // Area path for gradient background
  const areaPathOverall = `${pathOverall} L ${pointsOverall[pointsOverall.length - 1].x} ${
    chartHeight - paddingY
  } L ${pointsOverall[0].x} ${chartHeight - paddingY} Z`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-emerald-700" />
            <span>Nilai & Hasil Evaluasi Belajar</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Riwayat Penilaian Komprehensif & Grafik Perkembangan Prestasi Akademik
          </p>
        </div>

        {/* Student Badge */}
        <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          <GraduationCap className="w-4 h-4 text-emerald-800" />
          <span className="text-xs font-bold text-emerald-950">
            {currentUser?.name || 'Ahmad Zaki Ramadhan'}
          </span>
          <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100/70 px-1.5 py-0.5 rounded">
            Kelas 5A
          </span>
        </div>
      </div>

      {/* Main Feature Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveMainTab('GRAFIK')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeMainTab === 'GRAFIK'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Grafik Perkembangan (Kelas 1 - 6)</span>
        </button>

        <button
          onClick={() => setActiveMainTab('TUGAS')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeMainTab === 'TUGAS'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Nilai Tugas & Portofolio ({mySubmissions.length})</span>
        </button>

        <button
          onClick={() => setActiveMainTab('KUIS')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeMainTab === 'KUIS'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Ujian & CBT ({myQuizAttempts.length})</span>
        </button>

        <button
          onClick={() => setActiveMainTab('ALL')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeMainTab === 'ALL'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Semua Riwayat
        </button>
      </div>

      {/* TAB: GRAFIK PENILAIAN SISWA KELAS 1 S/D KELAS 6 */}
      {activeMainTab === 'GRAFIK' && (
        <div className="space-y-6">
          {/* Milestone KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Rata-Rata Kumulatif (1-6)
              </span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-900 mt-1">
                {cumulativeAvg}
              </div>
              <p className="text-[11px] text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Predikat Mumtaz (A)
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Rekor Nilai Tertinggi
              </span>
              <div className="text-2xl sm:text-3xl font-black text-teal-800 mt-1">
                {highestScore}
              </div>
              <p className="text-[11px] text-teal-700 font-semibold mt-0.5">
                Kelas 6 Semester 2
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Peringkat Terbaik
              </span>
              <div className="text-2xl sm:text-3xl font-black text-amber-900 mt-1 flex items-center gap-1">
                <Star className="w-6 h-6 text-amber-500 fill-amber-400" />
                <span>Juara #1</span>
              </div>
              <p className="text-[11px] text-amber-700 font-semibold mt-0.5">
                Sejak Kelas 2 Semester 2
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Kehadiran Kumulatif
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                {avgAttendance}%
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                12 Semester Pembelajaran
              </p>
            </div>
          </div>

          {/* Interactive Graphic Card */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-700" />
                  <span>Grafik Nilai Santri: Kelas 1 Smt 1 s/d Kelas 6 Smt 2</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Klik titik atau tombol semester di bawah untuk melihat rincian mata pelajaran
                </p>
              </div>

              {/* Chart Line Toggles */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => setChartMetric('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    chartMetric === 'ALL'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Nilai Gabungan
                </button>
                <button
                  onClick={() => setChartMetric('KEMENAG')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    chartMetric === 'KEMENAG'
                      ? 'bg-teal-700 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Rumpun Kemenag (PAI)
                </button>
                <button
                  onClick={() => setChartMetric('UMUM')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    chartMetric === 'UMUM'
                      ? 'bg-blue-700 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Mapel Umum
                </button>
              </div>
            </div>

            {/* SVG Chart Container */}
            <div className="w-full overflow-x-auto pb-2">
              <div className="min-w-[680px]">
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  className="w-full h-64 overflow-visible"
                >
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#059669" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  {[85, 90, 95, 100].map((level) => {
                    const normalizedY = (level - minScore) / (maxScore - minScore);
                    const y = chartHeight - paddingY - normalizedY * (chartHeight - paddingY * 2);
                    return (
                      <g key={level}>
                        <line
                          x1={paddingX}
                          y1={y}
                          x2={chartWidth - paddingX}
                          y2={y}
                          stroke="#e2e8f0"
                          strokeDasharray="4 4"
                          strokeWidth="1"
                        />
                        <text
                          x={paddingX - 10}
                          y={y + 3}
                          fontSize="10"
                          fill="#94a3b8"
                          textAnchor="end"
                          fontFamily="sans-serif"
                        >
                          {level}
                        </text>
                      </g>
                    );
                  })}

                  {/* Shaded Area under Curve (Only for ALL) */}
                  {chartMetric === 'ALL' && (
                    <path d={areaPathOverall} fill="url(#chartGradient)" />
                  )}

                  {/* Trend Lines */}
                  {(chartMetric === 'ALL' || chartMetric === 'KEMENAG') && (
                    <path
                      d={pathKemenag}
                      fill="none"
                      stroke="#0d9488"
                      strokeWidth={chartMetric === 'KEMENAG' ? '3' : '1.5'}
                      strokeDasharray={chartMetric === 'ALL' ? '4 3' : 'none'}
                    />
                  )}

                  {(chartMetric === 'ALL' || chartMetric === 'UMUM') && (
                    <path
                      d={pathUmum}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth={chartMetric === 'UMUM' ? '3' : '1.5'}
                      strokeDasharray={chartMetric === 'ALL' ? '4 3' : 'none'}
                    />
                  )}

                  {chartMetric === 'ALL' && (
                    <path
                      d={pathOverall}
                      fill="none"
                      stroke="#059669"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  )}

                  {/* Data Points / Interactive Circles */}
                  {historyData.map((h, i) => {
                    const targetScore =
                      chartMetric === 'KEMENAG'
                        ? h.kemenagAverage
                        : chartMetric === 'UMUM'
                        ? h.umumAverage
                        : h.averageScore;
                    const { x, y } = getCoordinates(i, targetScore);
                    const isSelected = h.semesterIndex === activeSemester.semesterIndex;

                    return (
                      <g
                        key={h.semesterIndex}
                        onClick={() => setSelectedSemesterIdx(h.semesterIndex)}
                        className="cursor-pointer group"
                      >
                        {/* Hover Halo */}
                        <circle
                          cx={x}
                          cy={y}
                          r={isSelected ? 10 : 7}
                          fill={isSelected ? '#059669' : '#10b981'}
                          fillOpacity={isSelected ? 0.3 : 0.15}
                          className="group-hover:fill-opacity-40 transition-all"
                        />
                        {/* Main Dot */}
                        <circle
                          cx={x}
                          cy={y}
                          r={isSelected ? 5.5 : 4}
                          fill={isSelected ? '#047857' : '#059669'}
                          stroke="#ffffff"
                          strokeWidth="2"
                        />
                        {/* Score Tag */}
                        <text
                          x={x}
                          y={y - 10}
                          fontSize="10"
                          fontWeight={isSelected ? 'bold' : 'normal'}
                          fill={isSelected ? '#047857' : '#475569'}
                          textAnchor="middle"
                          fontFamily="sans-serif"
                        >
                          {targetScore}
                        </text>
                        {/* Semester Label Bottom */}
                        <text
                          x={x}
                          y={chartHeight - paddingY + 18}
                          fontSize="9"
                          fontWeight={isSelected ? 'bold' : 'normal'}
                          fill={isSelected ? '#065f46' : '#64748b'}
                          textAnchor="middle"
                          fontFamily="sans-serif"
                        >
                          K{h.gradeLevel}-S{h.semester === 'Ganjil' ? 1 : 2}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 pt-2 text-xs border-t border-slate-100 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-1 bg-emerald-600 rounded"></span>
                <span className="text-slate-700 font-semibold">Nilai Akhir Rata-Rata</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-1 bg-teal-600 rounded border-dashed"></span>
                <span className="text-slate-600">Rumpun Kemenag (PAI)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-1 bg-blue-600 rounded border-dashed"></span>
                <span className="text-slate-600">Mapel Umum</span>
              </div>
            </div>
          </div>

          {/* Quick Semester Pill Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap mr-1">
              Pilih Semester:
            </span>
            {historyData.map((h) => {
              const isSelected = h.semesterIndex === activeSemester.semesterIndex;
              return (
                <button
                  key={h.semesterIndex}
                  onClick={() => setSelectedSemesterIdx(h.semesterIndex)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Kelas {h.gradeLevel} Smt {h.semester === 'Ganjil' ? '1' : '2'} ({h.averageScore})
                </button>
              );
            })}
          </div>

          {/* Detail Breakdown for Selected Semester */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                  Rincian Capaian Nilai
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">
                  Kelas {activeSemester.gradeLevel} — Semester {activeSemester.semester} (TA {activeSemester.academicYear})
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  <span>Peringkat #{activeSemester.rank} dari {activeSemester.totalStudents} Santri</span>
                </span>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold">
                  Kehadiran {activeSemester.attendanceRate}%
                </span>
              </div>
            </div>

            {/* Subject Score Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeSemester.subjects.map((sub) => (
                <div
                  key={sub.subjectName}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <div>
                    <div className="font-bold text-xs text-slate-900">{sub.subjectName}</div>
                    <div className="text-[10px] text-slate-400">{sub.category}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900">{sub.score}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        sub.predicate === 'A'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {sub.predicate}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Wali Kelas Remarks */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-xs">
              <span className="font-bold text-emerald-900 block mb-1">
                Catatan Evaluasi Wali Kelas:
              </span>
              <p className="text-slate-700 italic">"{activeSemester.notes}"</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB: TUGAS & PORTOFOLIO */}
      {activeMainTab === 'TUGAS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Rata-Rata Tugas</span>
              <div className="text-2xl font-black text-emerald-900 mt-1">{avgTugas}</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Tugas Terkoreksi</span>
              <div className="text-2xl font-black text-teal-800 mt-1">{gradedSubs.length} Tugas</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Predikat Portofolio</span>
              <div className="text-2xl font-black text-slate-900 mt-1">Mumtaz (A)</div>
            </div>
          </div>

          <div className="space-y-3">
            {mySubmissions.map((sub) => (
              <div
                key={sub.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{sub.assignmentTitle}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Dikirim: {sub.submittedAt}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-black">
                      Nilai: {sub.score || 95} / 100
                    </span>
                  </div>
                </div>
                {sub.feedback && (
                  <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <span className="font-bold text-slate-700 block mb-0.5">Catatan Guru Pengampu:</span>
                    <p className="text-slate-600">{sub.feedback}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: KUIS & UJIAN CBT */}
      {activeMainTab === 'KUIS' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Rata-Rata Ujian CBT</span>
              <div className="text-3xl font-black text-teal-900 mt-1">{avgKuis}</div>
              <p className="text-xs text-teal-700 font-semibold mt-0.5">
                Hasil Ujian Berbasis Komputer
              </p>
            </div>
            <Award className="w-12 h-12 text-teal-600 opacity-30" />
          </div>

          <div className="space-y-3">
            {myQuizAttempts.map((q) => (
              <div
                key={q.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900">{q.quizTitle}</h4>
                  <span className="text-base font-black text-emerald-800">{q.score} / {q.maxScore}</span>
                </div>
                <p className="text-xs text-slate-500">Selesai pada: {q.completedAt}</p>
                {q.feedback && (
                  <div className="p-2.5 bg-emerald-50 text-emerald-900 rounded-xl text-xs font-medium border border-emerald-100">
                    {q.feedback}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: SEMUA EVALUASI */}
      {activeMainTab === 'ALL' && (
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs text-xs space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">Ringkasan Riwayat Pembelajaran</h4>
            <p className="text-slate-600 leading-relaxed">
              Santri Ahmad Zaki Ramadhan telah menyelesaikan serangkaian asesmen formatif, sumatif tengah semester, portofolio karya, dan asesmen akhir madrasah dengan predikat sangat memuaskan (Mumtaz). Seluruh rekam jejak tersimpan aman dalam sistem LMS MI Assuyutiyah.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
