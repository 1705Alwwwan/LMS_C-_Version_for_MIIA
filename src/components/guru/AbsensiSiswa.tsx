import React, { useState, useEffect } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  CalendarCheck,
  Calendar,
  Check,
  Printer,
  Save,
  Users,
  CheckCircle2,
  AlertCircle,
  X,
  Clock,
  ChevronDown,
  Layers,
  FileSpreadsheet,
  BarChart3,
  CalendarDays,
  Sparkles,
} from 'lucide-react';
import { AttendanceRecord, AttendanceStatus, ClassRoom } from '../../types/lms';

type ActiveTab = 'input-harian' | 'rekap-harian' | 'rekap-bulanan' | 'rekap-semester';

export const AbsensiSiswa: React.FC = () => {
  const { classes, users, attendances, saveAttendance, currentUser } = useLMS();

  // Active Tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('input-harian');

  // Filters
  const [selectedClassId, setSelectedClassId] = useState('c-5a');
  const [selectedDate, setSelectedDate] = useState('2026-10-17');
  const [selectedMonth, setSelectedMonth] = useState('10'); // 01 - 12
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedSemester, setSelectedSemester] = useState<'Ganjil' | 'Genap'>('Genap');

  // States
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printDocumentType, setPrintDocumentType] = useState<'harian' | 'bulanan' | 'semester'>('harian');

  const selectedClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const students = users.filter(
    (u) =>
      u.role === 'SISWA' &&
      (u.classId === selectedClassId || (!u.classId && selectedClassId === 'c-5a'))
  );

  // Local state for attendance records of the selected class and date
  const [records, setRecords] = useState<Record<string, { status: AttendanceStatus; notes: string }>>({});

  useEffect(() => {
    const initialMap: Record<string, { status: AttendanceStatus; notes: string }> = {};
    students.forEach((s) => {
      const existing = attendances.find((a) => a.studentId === s.id && a.date === selectedDate);
      if (existing) {
        initialMap[s.id] = { status: existing.status, notes: existing.notes || '' };
      } else {
        initialMap[s.id] = { status: 'Hadir', notes: '' };
      }
    });
    setRecords(initialMap);
  }, [selectedClassId, selectedDate, students.length]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setRecords((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleNotesChange = (studentId: string, notes: string) => {
    setRecords((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        notes,
      },
    }));
  };

  const markAllHadir = () => {
    const updated: Record<string, { status: AttendanceStatus; notes: string }> = {};
    students.forEach((s) => {
      updated[s.id] = { status: 'Hadir', notes: '' };
    });
    setRecords(updated);
  };

  const handleSave = () => {
    const attendanceToSave: AttendanceRecord[] = students.map((s) => ({
      id: `att-${s.id}-${selectedDate}`,
      date: selectedDate,
      classId: selectedClassId,
      studentId: s.id,
      studentName: s.name,
      status: records[s.id]?.status || 'Hadir',
      notes: records[s.id]?.notes || '',
    }));

    saveAttendance(attendanceToSave);
    setIsSavedSuccess(true);
    setTimeout(() => setIsSavedSuccess(false), 3000);
  };

  // Stats calculation for selected date
  const totalStudents = students.length;
  const countHadir = Object.values(records).filter((r) => r.status === 'Hadir').length;
  const countSakit = Object.values(records).filter((r) => r.status === 'Sakit').length;
  const countIzin = Object.values(records).filter((r) => r.status === 'Izin').length;
  const countAlpa = Object.values(records).filter((r) => r.status === 'Alpa').length;
  const attendancePercentage = totalStudents > 0 ? Math.round((countHadir / totalStudents) * 100) : 100;

  // Monthly recap data synthesis (realistic numbers for the selected month)
  const monthNames: Record<string, string> = {
    '01': 'Januari',
    '02': 'Februari',
    '03': 'Maret',
    '04': 'April',
    '05': 'Mei',
    '06': 'Juni',
    '07': 'Juli',
    '08': 'Agustus',
    '09': 'September',
    '10': 'Oktober',
    '11': 'November',
    '12': 'Desember',
  };

  const monthlyRecapData = students.map((s) => {
    // Generate realistic seeded attendance data based on student id
    const seed = s.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const totalEffectiveDays = 24; // Hari efektif per bulan
    const sakit = seed % 7 === 0 ? 1 : seed % 13 === 0 ? 2 : 0;
    const izin = seed % 5 === 0 ? 1 : seed % 11 === 0 ? 2 : 0;
    const alpa = seed % 19 === 0 ? 1 : 0;
    const hadir = totalEffectiveDays - (sakit + izin + alpa);
    const percent = Math.round((hadir / totalEffectiveDays) * 100);

    return {
      student: s,
      hadir,
      sakit,
      izin,
      alpa,
      totalDays: totalEffectiveDays,
      percent,
      statusBadge: percent >= 90 ? 'Sangat Baik' : percent >= 80 ? 'Baik' : 'Perlu Perhatian',
    };
  });

  // Semester recap data synthesis (realistic numbers for the selected semester)
  const semesterRecapData = students.map((s) => {
    const seed = s.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const totalSemesterDays = 110; // Hari efektif semester
    const sakit = (seed % 4) + 1;
    const izin = seed % 3;
    const alpa = seed % 17 === 0 ? 1 : 0;
    const hadir = totalSemesterDays - (sakit + izin + alpa);
    const percent = Math.round((hadir / totalSemesterDays) * 100);
    const predicate = percent >= 95 ? 'A' : percent >= 85 ? 'B' : 'C';

    return {
      student: s,
      hadir,
      sakit,
      izin,
      alpa,
      totalDays: totalSemesterDays,
      percent,
      predicate,
      catatanRapor:
        percent >= 95
          ? 'Sangat rajin dan disiplin hadir dalam pembelajaran.'
          : percent >= 85
          ? 'Kehadiran baik, tingkatkan ketepatan waktu.'
          : 'Perlu bimbingan wali murid terkait kehadiran santri.',
    };
  });

  const triggerPrintModal = (type: 'harian' | 'bulanan' | 'semester') => {
    setPrintDocumentType(type);
    setIsPrintModalOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDateIndo = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Save Success */}
      {isSavedSuccess && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-800 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-emerald-600 text-xs animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>Data presensi berhasil disimpan ke dalam pangkalan data!</span>
        </div>
      )}

      {/* Header */}
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <CalendarCheck className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Absensi & Rekap Kehadiran Siswa
              </h2>
              <p className="text-xs text-slate-500">
                Layanan Presensi Harian, Rekap Bulanan, dan Rekapitulasi Rapor Per Semester
              </p>
            </div>
          </div>
        </div>

        {/* Global Print & Save Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => triggerPrintModal(activeTab === 'rekap-bulanan' ? 'bulanan' : activeTab === 'rekap-semester' ? 'semester' : 'harian')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors border border-slate-200 shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Cetak Rekap ({activeTab === 'rekap-bulanan' ? 'Bulan' : activeTab === 'rekap-semester' ? 'Semester' : 'Hari'})</span>
          </button>

          {activeTab === 'input-harian' && (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-700/20 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Presensi</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('input-harian')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'input-harian'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Input Presensi Harian</span>
        </button>

        <button
          onClick={() => setActiveTab('rekap-harian')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'rekap-harian'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <CalendarDays className="w-3.5 h-3.5" />
          <span>Rekap Harian</span>
        </button>

        <button
          onClick={() => setActiveTab('rekap-bulanan')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'rekap-bulanan'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Rekap Bulanan</span>
        </button>

        <button
          onClick={() => setActiveTab('rekap-semester')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'rekap-semester'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Rekap Per Semester</span>
        </button>
      </div>

      {/* Filter Bar (Class + Date / Month / Semester) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Class Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">
              Pilih Kelas & Rombel
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-emerald-500"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} — Wali: {cls.waliKelasName}
                </option>
              ))}
            </select>
          </div>

          {/* Conditional Date / Month / Semester Filter */}
          {activeTab === 'input-harian' || activeTab === 'rekap-harian' ? (
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">
                Tanggal Pembelajaran
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-emerald-500"
              />
            </div>
          ) : activeTab === 'rekap-bulanan' ? (
            <>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Bulan Rekap
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-emerald-500"
                >
                  {Object.entries(monthNames).map(([val, name]) => (
                    <option key={val} value={val}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Tahun Kalender
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-emerald-500"
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Semester
                </label>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value as 'Ganjil' | 'Genap')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-emerald-500"
                >
                  <option value="Ganjil">Semester 1 (Ganjil)</option>
                  <option value="Genap">Semester 2 (Genap)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Tahun Ajaran
                </label>
                <select
                  value="2024/2025"
                  disabled
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                >
                  <option value="2024/2025">2024/2025</option>
                </select>
              </div>
            </>
          )}

          {/* Wali Kelas Badge */}
          <div className="flex flex-col justify-end">
            <div className="px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
              <span className="text-[10px] text-emerald-800 font-bold uppercase block">Wali Kelas</span>
              <span className="font-semibold text-emerald-950 truncate block">{selectedClass.waliKelasName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* TAB 1: INPUT PRESENSI HARIAN */}
      {activeTab === 'input-harian' && (
        <div className="space-y-4">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Santri</span>
              <div className="text-xl font-bold text-slate-900 mt-0.5">{totalStudents}</div>
            </div>
            <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200 shadow-2xs">
              <span className="text-[10px] font-bold text-emerald-800 uppercase">Hadir</span>
              <div className="text-xl font-bold text-emerald-900 mt-0.5">
                {countHadir} ({attendancePercentage}%)
              </div>
            </div>
            <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200 shadow-2xs">
              <span className="text-[10px] font-bold text-amber-800 uppercase">Izin</span>
              <div className="text-xl font-bold text-amber-900 mt-0.5">{countIzin}</div>
            </div>
            <div className="bg-blue-50/60 p-3.5 rounded-2xl border border-blue-200 shadow-2xs">
              <span className="text-[10px] font-bold text-blue-800 uppercase">Sakit</span>
              <div className="text-xl font-bold text-blue-900 mt-0.5">{countSakit}</div>
            </div>
            <div className="bg-rose-50/60 p-3.5 rounded-2xl border border-rose-200 shadow-2xs">
              <span className="text-[10px] font-bold text-rose-800 uppercase">Alpa</span>
              <div className="text-xl font-bold text-rose-900 mt-0.5">{countAlpa}</div>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500 font-medium">
              Tanggal: <span className="font-semibold text-slate-800">{formatDateIndo(selectedDate)}</span>
            </span>
            <button
              onClick={markAllHadir}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Tandai Semua Hadir</span>
            </button>
          </div>

          {/* Input Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/75 text-slate-600 uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3.5 text-center w-10">No</th>
                    <th className="py-3 px-3.5">Nama Santri</th>
                    <th className="py-3 px-3.5">NISN</th>
                    <th className="py-3 px-3.5 text-center w-64">Status Presensi</th>
                    <th className="py-3 px-3.5">Keterangan / Alasan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((student, index) => {
                    const currentStatus = records[student.id]?.status || 'Hadir';
                    return (
                      <tr key={student.id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-3.5 text-center text-slate-400 font-medium">
                          {index + 1}
                        </td>
                        <td className="py-3 px-3.5 font-bold text-slate-900">
                          {student.name}
                        </td>
                        <td className="py-3 px-3.5 font-mono text-slate-500">
                          {student.nisn || '-'}
                        </td>
                        <td className="py-3 px-3.5">
                          <div className="flex items-center justify-center gap-1">
                            {(['Hadir', 'Izin', 'Sakit', 'Alpa'] as AttendanceStatus[]).map((st) => (
                              <button
                                key={st}
                                onClick={() => handleStatusChange(student.id, st)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                                  currentStatus === st
                                    ? st === 'Hadir'
                                      ? 'bg-emerald-600 text-white shadow-xs'
                                      : st === 'Izin'
                                      ? 'bg-amber-500 text-white shadow-xs'
                                      : st === 'Sakit'
                                      ? 'bg-blue-600 text-white shadow-xs'
                                      : 'bg-rose-600 text-white shadow-xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-3.5">
                          <input
                            type="text"
                            placeholder="Catatan izin/keterangan (opsional)..."
                            value={records[student.id]?.notes || ''}
                            onChange={(e) => handleNotesChange(student.id, e.target.value)}
                            className="w-full px-2.5 py-1 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-emerald-500"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REKAP HARIAN */}
      {activeTab === 'rekap-harian' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Laporan Kehadiran Harian Kelas {selectedClass.name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Hari / Tanggal: {formatDateIndo(selectedDate)} | Wali Kelas: {selectedClass.waliKelasName}
              </p>
            </div>
            <button
              onClick={() => triggerPrintModal('harian')}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Rekap Harian</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/75 text-slate-600 uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3.5 text-center w-12">No</th>
                    <th className="py-3 px-3.5">Nama Santri</th>
                    <th className="py-3 px-3.5">NISN</th>
                    <th className="py-3 px-3.5 text-center">Status</th>
                    <th className="py-3 px-3.5">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((student, idx) => {
                    const st = records[student.id]?.status || 'Hadir';
                    return (
                      <tr key={student.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3.5 text-center text-slate-400">{idx + 1}</td>
                        <td className="py-3 px-3.5 font-bold text-slate-900">{student.name}</td>
                        <td className="py-3 px-3.5 font-mono text-slate-500">{student.nisn || '-'}</td>
                        <td className="py-3 px-3.5 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              st === 'Hadir'
                                ? 'bg-emerald-100 text-emerald-800'
                                : st === 'Izin'
                                ? 'bg-amber-100 text-amber-800'
                                : st === 'Sakit'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {st}
                          </span>
                        </td>
                        <td className="py-3 px-3.5 text-slate-600">{records[student.id]?.notes || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REKAP BULANAN */}
      {activeTab === 'rekap-bulanan' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Rekapitulasi Presensi Bulanan: {monthNames[selectedMonth]} {selectedYear}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Kelas: {selectedClass.name} | Total 24 Hari Efektif Belajar
              </p>
            </div>
            <button
              onClick={() => triggerPrintModal('bulanan')}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Laporan Bulanan</span>
            </button>
          </div>

          {/* Monthly Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/75 text-slate-600 uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3.5 text-center w-10">No</th>
                    <th className="py-3 px-3.5">Nama Santri</th>
                    <th className="py-3 px-3.5">NISN</th>
                    <th className="py-3 px-3.5 text-center w-16">Hadir (H)</th>
                    <th className="py-3 px-3.5 text-center w-16">Sakit (S)</th>
                    <th className="py-3 px-3.5 text-center w-16">Izin (I)</th>
                    <th className="py-3 px-3.5 text-center w-16">Alpa (A)</th>
                    <th className="py-3 px-3.5 text-center w-24">% Kehadiran</th>
                    <th className="py-3 px-3.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {monthlyRecapData.map((item, idx) => (
                    <tr key={item.student.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3.5 text-center text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-3.5 font-bold text-slate-900">{item.student.name}</td>
                      <td className="py-3 px-3.5 font-mono text-slate-500">{item.student.nisn || '-'}</td>
                      <td className="py-3 px-3.5 text-center font-bold text-emerald-800">{item.hadir}</td>
                      <td className="py-3 px-3.5 text-center font-bold text-blue-800">{item.sakit}</td>
                      <td className="py-3 px-3.5 text-center font-bold text-amber-800">{item.izin}</td>
                      <td className="py-3 px-3.5 text-center font-bold text-rose-800">{item.alpa}</td>
                      <td className="py-3 px-3.5 text-center font-bold text-slate-900">{item.percent}%</td>
                      <td className="py-3 px-3.5 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            item.percent >= 90
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.percent >= 80
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {item.statusBadge}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: REKAP PER SEMESTER */}
      {activeTab === 'rekap-semester' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Rekapitulasi Presensi Semester {selectedSemester === 'Ganjil' ? '1 (Ganjil)' : '2 (Genap)'} — Tahun Pelajaran 2024/2025
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Kelas: {selectedClass.name} | Total 110 Hari Efektif Belajar Semester Ini
              </p>
            </div>
            <button
              onClick={() => triggerPrintModal('semester')}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Rekapitulasi Rapor</span>
            </button>
          </div>

          {/* Semester Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/75 text-slate-600 uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3.5 text-center w-10">No</th>
                    <th className="py-3 px-3.5">Nama Santri</th>
                    <th className="py-3 px-3.5">NISN</th>
                    <th className="py-3 px-3.5 text-center w-16">Hadir</th>
                    <th className="py-3 px-3.5 text-center w-16">Sakit</th>
                    <th className="py-3 px-3.5 text-center w-16">Izin</th>
                    <th className="py-3 px-3.5 text-center w-16">Alpa</th>
                    <th className="py-3 px-3.5 text-center w-20">% Total</th>
                    <th className="py-3 px-3.5 text-center w-16">Predikat</th>
                    <th className="py-3 px-3.5">Catatan Rapor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {semesterRecapData.map((item, idx) => (
                    <tr key={item.student.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3.5 text-center text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-3.5 font-bold text-slate-900">{item.student.name}</td>
                      <td className="py-3 px-3.5 font-mono text-slate-500">{item.student.nisn || '-'}</td>
                      <td className="py-3 px-3.5 text-center font-bold text-emerald-800">{item.hadir}</td>
                      <td className="py-3 px-3.5 text-center font-bold text-blue-800">{item.sakit}</td>
                      <td className="py-3 px-3.5 text-center font-bold text-amber-800">{item.izin}</td>
                      <td className="py-3 px-3.5 text-center font-bold text-rose-800">{item.alpa}</td>
                      <td className="py-3 px-3.5 text-center font-bold text-slate-900">{item.percent}%</td>
                      <td className="py-3 px-3.5 text-center">
                        <span className="px-2 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-900">
                          {item.predicate}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-slate-600 max-w-xs">{item.catatanRapor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Official Print Modal */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 my-auto text-slate-800">
            <div className="no-print flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Printer className="w-4 h-4 text-emerald-700" />
                  <span>
                    Pratinjau Cetak:{' '}
                    {printDocumentType === 'harian'
                      ? 'Rekap Kehadiran Harian'
                      : printDocumentType === 'bulanan'
                      ? 'Laporan Kehadiran Bulanan'
                      : 'Rekapitulasi Presensi Semester'}
                  </span>
                </h3>
                <p className="text-xs text-slate-500">Kelas: {selectedClass.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Dokumen</span>
                </button>
                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Print View Content */}
            <div className="print-area p-4 border border-slate-300 rounded-xl bg-white text-slate-900">
              {/* Kop Madrasah */}
              <div className="text-center pb-4 border-b-2 border-slate-900 mb-4">
                <p className="text-xs uppercase tracking-wider font-semibold text-slate-600">
                  KEMENTERIAN AGAMA REPUBLIK INDONESIA
                </p>
                <h1 className="text-base font-black tracking-wide text-slate-900 uppercase mt-0.5">
                  MADRASAH IBTIDAIYAH ASSUYUTIYAH
                </h1>
                <p className="text-[11px] text-slate-500 italic">
                  Jl. Pesantren Assuyutiyah No. 15, Telp: (021) 8899-7711 | Email: info@mi-assuyutiyah.sch.id
                </p>
              </div>

              {/* Title */}
              <div className="text-center my-3">
                <h2 className="text-sm font-bold uppercase tracking-wide underline">
                  {printDocumentType === 'harian'
                    ? `DAFTAR HADIR HARIAN SANTRI — KELAS ${selectedClass.name}`
                    : printDocumentType === 'bulanan'
                    ? `REKAPITULASI KEHADIRAN BULANAN SANTRI (${monthNames[selectedMonth]} ${selectedYear})`
                    : `REKAPITULASI KEHADIRAN SEMESTER ${selectedSemester.toUpperCase()} (RAPOR)`}
                </h2>
                <p className="text-xs text-slate-600 mt-1 font-medium">
                  {printDocumentType === 'harian'
                    ? `Tanggal: ${formatDateIndo(selectedDate)}`
                    : printDocumentType === 'bulanan'
                    ? `Kelas: ${selectedClass.name} | Wali Kelas: ${selectedClass.waliKelasName}`
                    : `Kelas: ${selectedClass.name} | Tahun Pelajaran 2024/2025`}
                </p>
              </div>

              {/* Table */}
              <table className="w-full text-xs border border-slate-400 mt-4 border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-800">
                    <th className="border border-slate-400 p-2 text-center w-8">No</th>
                    <th className="border border-slate-400 p-2 text-left">Nama Santri</th>
                    <th className="border border-slate-400 p-2 text-center">NISN</th>
                    {printDocumentType === 'harian' ? (
                      <>
                        <th className="border border-slate-400 p-2 text-center w-24">Status</th>
                        <th className="border border-slate-400 p-2 text-left">Keterangan</th>
                      </>
                    ) : (
                      <>
                        <th className="border border-slate-400 p-2 text-center w-14">H</th>
                        <th className="border border-slate-400 p-2 text-center w-14">S</th>
                        <th className="border border-slate-400 p-2 text-center w-14">I</th>
                        <th className="border border-slate-400 p-2 text-center w-14">A</th>
                        <th className="border border-slate-400 p-2 text-center w-20">% Hadir</th>
                        <th className="border border-slate-400 p-2 text-left">Keterangan Rapor</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {(printDocumentType === 'harian'
                    ? students.map((s, i) => ({
                        no: i + 1,
                        name: s.name,
                        nisn: s.nisn || '-',
                        col1: records[s.id]?.status || 'Hadir',
                        col2: records[s.id]?.notes || '-',
                      }))
                    : printDocumentType === 'bulanan'
                    ? monthlyRecapData.map((m, i) => ({
                        no: i + 1,
                        name: m.student.name,
                        nisn: m.student.nisn || '-',
                        h: m.hadir,
                        s: m.sakit,
                        i: m.izin,
                        a: m.alpa,
                        pct: `${m.percent}%`,
                        ket: m.statusBadge,
                      }))
                    : semesterRecapData.map((sm, i) => ({
                        no: i + 1,
                        name: sm.student.name,
                        nisn: sm.student.nisn || '-',
                        h: sm.hadir,
                        s: sm.sakit,
                        i: sm.izin,
                        a: sm.alpa,
                        pct: `${sm.percent}%`,
                        ket: sm.catatanRapor,
                      }))
                  ).map((row: any) => (
                    <tr key={row.no}>
                      <td className="border border-slate-300 p-2 text-center">{row.no}</td>
                      <td className="border border-slate-300 p-2 font-bold">{row.name}</td>
                      <td className="border border-slate-300 p-2 text-center font-mono">{row.nisn}</td>
                      {printDocumentType === 'harian' ? (
                        <>
                          <td className="border border-slate-300 p-2 text-center font-semibold">{row.col1}</td>
                          <td className="border border-slate-300 p-2">{row.col2}</td>
                        </>
                      ) : (
                        <>
                          <td className="border border-slate-300 p-2 text-center">{row.h}</td>
                          <td className="border border-slate-300 p-2 text-center">{row.s}</td>
                          <td className="border border-slate-300 p-2 text-center">{row.i}</td>
                          <td className="border border-slate-300 p-2 text-center">{row.a}</td>
                          <td className="border border-slate-300 p-2 text-center font-bold">{row.pct}</td>
                          <td className="border border-slate-300 p-2 text-slate-600">{row.ket}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Signatures */}
              <div className="mt-6 grid grid-cols-2 text-xs">
                <div>
                  <p className="text-slate-600">Mengetahui,</p>
                  <p className="font-bold text-slate-900">Kepala MI Assuyutiyah</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline text-slate-900">Ust. H. Muhammad Ilyas, S.Pd.I</p>
                  <p className="text-[11px] text-slate-500">NIP. 197904122005011004</p>
                </div>

                <div className="text-right">
                  <p className="text-slate-600">Dibuat oleh,</p>
                  <p className="font-bold text-slate-900">Wali Kelas {selectedClass.name}</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline text-slate-900">{selectedClass.waliKelasName}</p>
                  <p className="text-[11px] text-slate-500">NIP. 198506242010012008</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
