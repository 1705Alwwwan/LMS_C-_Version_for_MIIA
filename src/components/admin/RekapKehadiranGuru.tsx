import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  CalendarCheck,
  Calendar,
  CheckCircle2,
  Clock,
  Printer,
  Search,
  Filter,
  UserCheck,
  AlertCircle,
  Check,
  Edit2,
  X,
  FileText,
  Building2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { TeacherAttendanceRecord, TeacherAttendanceStatus } from '../../types/lms';

export const RekapKehadiranGuru: React.FC = () => {
  const { users, teacherAttendances, saveTeacherAttendance, updateTeacherAttendance } = useLMS();

  // Selected date for attendance (defaults to '2026-10-17')
  const [selectedDate, setSelectedDate] = useState('2026-10-17');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | TeacherAttendanceStatus>('ALL');

  // Modal edit state
  const [editingRecord, setEditingRecord] = useState<TeacherAttendanceRecord | null>(null);
  const [editStatus, setEditStatus] = useState<TeacherAttendanceStatus>('Hadir');
  const [editCheckIn, setEditCheckIn] = useState('06:45');
  const [editCheckOut, setEditCheckOut] = useState('14:15');
  const [editNotes, setEditNotes] = useState('');

  // Print modal / sheet
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // List of all teachers
  const allTeachers = users.filter((u) => u.role === 'GURU');

  // Attendance for the selected date: merge existing with any missing teachers default
  const dateRecords: TeacherAttendanceRecord[] = allTeachers.map((teacher) => {
    const existing = teacherAttendances.find(
      (r) => r.teacherId === teacher.id && r.date === selectedDate
    );
    if (existing) return existing;
    return {
      id: `t-att-${teacher.id}-${selectedDate}`,
      date: selectedDate,
      teacherId: teacher.id,
      teacherName: teacher.name,
      nip: teacher.nip || '-',
      checkInTime: '06:45',
      checkOutTime: '14:15',
      status: 'Hadir' as TeacherAttendanceStatus,
      subjectSummary: teacher.subjectsTaught?.join(', ') || 'Guru Kelas',
      notes: 'Hadir mengajar sesuai jadwal KBM.',
    };
  });

  // Filter records
  const filteredRecords = dateRecords.filter((rec) => {
    const matchesSearch =
      rec.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rec.nip && rec.nip.includes(searchQuery)) ||
      (rec.subjectSummary && rec.subjectSummary.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || rec.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Statistics calculation
  const totalGuru = allTeachers.length;
  const countHadir = dateRecords.filter((r) => r.status === 'Hadir').length;
  const countIzin = dateRecords.filter((r) => r.status === 'Izin').length;
  const countSakit = dateRecords.filter((r) => r.status === 'Sakit').length;
  const countDinasLuar = dateRecords.filter((r) => r.status === 'Dinas Luar').length;
  const countAlpa = dateRecords.filter((r) => r.status === 'Alpa').length;
  const percentageHadir = totalGuru > 0 ? Math.round(((countHadir + countDinasLuar) / totalGuru) * 100) : 100;

  const handleMarkAllHadir = () => {
    const updated: TeacherAttendanceRecord[] = dateRecords.map((r) => ({
      ...r,
      status: 'Hadir',
      checkInTime: r.checkInTime === '-' ? '06:45' : r.checkInTime,
      checkOutTime: r.checkOutTime === '-' ? '14:15' : r.checkOutTime,
      notes: 'Hadir tepat waktu dan melaksanakan KBM.',
    }));
    saveTeacherAttendance(updated);
    setNotificationMsg('Semua asatidz / dewan guru berhasil ditandai HADIR hari ini.');
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  const handleOpenEdit = (rec: TeacherAttendanceRecord) => {
    setEditingRecord(rec);
    setEditStatus(rec.status);
    setEditCheckIn(rec.checkInTime || '06:45');
    setEditCheckOut(rec.checkOutTime || '14:15');
    setEditNotes(rec.notes || '');
  };

  const handleSaveEdit = () => {
    if (!editingRecord) return;
    const updated: TeacherAttendanceRecord = {
      ...editingRecord,
      status: editStatus,
      checkInTime: editStatus === 'Izin' || editStatus === 'Sakit' || editStatus === 'Alpa' ? '-' : editCheckIn,
      checkOutTime: editStatus === 'Izin' || editStatus === 'Sakit' || editStatus === 'Alpa' ? '-' : editCheckOut,
      notes: editNotes,
    };
    saveTeacherAttendance([updated]);
    setEditingRecord(null);
    setNotificationMsg(`Data presensi ${updated.teacherName} berhasil diperbarui.`);
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const statusBadge = (status: TeacherAttendanceStatus) => {
    switch (status) {
      case 'Hadir':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Hadir
          </span>
        );
      case 'Izin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" /> Izin
          </span>
        );
      case 'Sakit':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <AlertCircle className="w-3 h-3 text-blue-600" /> Sakit
          </span>
        );
      case 'Dinas Luar':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
            <Building2 className="w-3 h-3 text-indigo-600" /> Dinas Luar
          </span>
        );
      case 'Alpa':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <X className="w-3 h-3 text-rose-600" /> Alpa
          </span>
        );
      default:
        return null;
    }
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
      {/* Toast Notification */}
      {notificationMsg && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-800 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-emerald-600 text-xs animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <UserCheck className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Rekap Kehadiran Guru Harian
              </h2>
              <p className="text-xs text-slate-500">
                Pencatatan Presensi & Jurnal KBM Dewan Asatidz MI Assuyutiyah
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleMarkAllHadir}
            className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Tandai Semua Hadir</span>
          </button>
          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Rekap Harian</span>
          </button>
        </div>
      </div>

      {/* Date Filter & Quick Date Selector */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
          <span className="text-xs font-bold text-slate-700">Tanggal Rekap:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-400 font-medium mr-1">Pilihan Cepat:</span>
          <button
            onClick={() => setSelectedDate('2026-10-17')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
              selectedDate === '2026-10-17'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Hari Ini (17 Okt)
          </button>
          <button
            onClick={() => setSelectedDate('2026-10-16')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
              selectedDate === '2026-10-16'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Kemarin (16 Okt)
          </button>
          <button
            onClick={() => setSelectedDate('2026-10-15')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
              selectedDate === '2026-10-15'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            15 Okt
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Total Guru</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalGuru}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Terdaftar KBM</p>
        </div>
        <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200 shadow-2xs">
          <p className="text-[10px] font-bold text-emerald-800 uppercase">Hadir</p>
          <p className="text-2xl font-black text-emerald-900 mt-1">{countHadir}</p>
          <p className="text-[10px] text-emerald-700 mt-0.5">{percentageHadir}% Kehadiran</p>
        </div>
        <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200 shadow-2xs">
          <p className="text-[10px] font-bold text-amber-800 uppercase">Izin</p>
          <p className="text-2xl font-black text-amber-900 mt-1">{countIzin}</p>
          <p className="text-[10px] text-amber-700 mt-0.5">Surat Terlampir</p>
        </div>
        <div className="bg-blue-50/60 p-3.5 rounded-2xl border border-blue-200 shadow-2xs">
          <p className="text-[10px] font-bold text-blue-800 uppercase">Sakit</p>
          <p className="text-2xl font-black text-blue-900 mt-1">{countSakit}</p>
          <p className="text-[10px] text-blue-700 mt-0.5">Keterangan Medis</p>
        </div>
        <div className="bg-indigo-50/60 p-3.5 rounded-2xl border border-indigo-200 shadow-2xs">
          <p className="text-[10px] font-bold text-indigo-800 uppercase">Dinas Luar</p>
          <p className="text-2xl font-black text-indigo-900 mt-1">{countDinasLuar}</p>
          <p className="text-[10px] text-indigo-700 mt-0.5">Tugas Kemenag</p>
        </div>
        <div className="bg-rose-50/60 p-3.5 rounded-2xl border border-rose-200 shadow-2xs">
          <p className="text-[10px] font-bold text-rose-800 uppercase">Alpa</p>
          <p className="text-2xl font-black text-rose-900 mt-1">{countAlpa}</p>
          <p className="text-[10px] text-rose-700 mt-0.5">Tanpa Berita</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari nama guru, NIP, atau mata pelajaran..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-emerald-500 shadow-2xs"
          />
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {(['ALL', 'Hadir', 'Izin', 'Sakit', 'Dinas Luar', 'Alpa'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {st === 'ALL' ? 'Semua Status' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800">
            Daftar Presensi ({formatDateIndo(selectedDate)})
          </span>
          <span className="text-slate-500">
            Menampilkan {filteredRecords.length} dari {totalGuru} Guru
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/75 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-3.5 font-bold w-12 text-center">No</th>
                <th className="py-3 px-3.5 font-bold">Nama Guru / Asatidz</th>
                <th className="py-3 px-3.5 font-bold">Tugas & Mapel</th>
                <th className="py-3 px-3.5 font-bold">Jam Masuk</th>
                <th className="py-3 px-3.5 font-bold">Jam Pulang</th>
                <th className="py-3 px-3.5 font-bold text-center">Status</th>
                <th className="py-3 px-3.5 font-bold">Keterangan / Jurnal</th>
                <th className="py-3 px-3.5 font-bold text-center w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Tidak ada data presensi yang cocok dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec, index) => {
                  const teacherUser = allTeachers.find((t) => t.id === rec.teacherId);
                  return (
                    <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3.5 text-center font-medium text-slate-400">
                        {index + 1}
                      </td>
                      <td className="py-3 px-3.5">
                        <div className="flex items-center space-x-2.5">
                          <img
                            src={teacherUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                            alt={rec.teacherName}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{rec.teacherName}</div>
                            <div className="text-[10px] text-slate-400">NIP: {rec.nip || '-'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3.5">
                        <span className="text-slate-700 font-medium">
                          {rec.subjectSummary || 'Guru Kelas'}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 font-mono text-slate-700">
                        {rec.checkInTime || '-'}
                      </td>
                      <td className="py-3 px-3.5 font-mono text-slate-700">
                        {rec.checkOutTime || '-'}
                      </td>
                      <td className="py-3 px-3.5 text-center">
                        {statusBadge(rec.status)}
                      </td>
                      <td className="py-3 px-3.5 max-w-xs truncate text-slate-600">
                        {rec.notes || '-'}
                      </td>
                      <td className="py-3 px-3.5 text-center">
                        <button
                          onClick={() => handleOpenEdit(rec)}
                          className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors inline-flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Ubah</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Attendance Modal */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-emerald-600" />
                <span>Ubah Presensi Guru</span>
              </h3>
              <button
                onClick={() => setEditingRecord(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-bold text-slate-900">{editingRecord.teacherName}</p>
                <p className="text-[11px] text-slate-500">NIP: {editingRecord.nip || '-'}</p>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Tanggal: {formatDateIndo(editingRecord.date)}
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Status Kehadiran</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Hadir', 'Izin', 'Sakit', 'Dinas Luar', 'Alpa'] as TeacherAttendanceStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setEditStatus(st)}
                      className={`py-2 px-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                        editStatus === st
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {editStatus === 'Hadir' || editStatus === 'Dinas Luar' ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Jam Masuk</label>
                    <input
                      type="time"
                      value={editCheckIn}
                      onChange={(e) => setEditCheckIn(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Jam Pulang</label>
                    <input
                      type="time"
                      value={editCheckOut}
                      onChange={(e) => setEditCheckOut(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-emerald-500"
                    />
                  </div>
                </div>
              ) : null}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Keterangan / Jurnal Mengajar
                </label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Contoh: Mengajar Fikih kelas 5A, izin menghadiri rapat kemenag..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-500 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingRecord(null)}
                className="px-3.5 py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Preview Modal */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 my-auto text-slate-800">
            <div className="no-print flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Printer className="w-4 h-4 text-emerald-700" />
                <span>Pratinjau Cetak: Rekapitulasi Presensi Guru</span>
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Dokumen Sekarang</span>
                </button>
                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Content with Madrasah Official Letterhead */}
            <div className="print-area p-4 border border-slate-200 rounded-xl bg-white text-slate-900">
              {/* Kop Madrasah */}
              <div className="text-center pb-4 border-b-2 border-slate-900 mb-4">
                <p className="text-xs uppercase tracking-wider font-semibold text-slate-600">
                  KEMENTERIAN AGAMA REPUBLIK INDONESIA
                </p>
                <p className="text-xs uppercase tracking-wider font-semibold text-slate-600">
                  KANTOR KEMENTERIAN AGAMA KABUPATEN
                </p>
                <h1 className="text-lg font-black tracking-wide text-slate-900 uppercase mt-0.5">
                  MADRASAH IBTIDAIYAH ASSUYUTIYAH
                </h1>
                <p className="text-[11px] text-slate-500 italic">
                  Alamat: Jl. Pesantren Assuyutiyah No. 15, Telp: (021) 8899-7711 | Email: info@mi-assuyutiyah.sch.id
                </p>
              </div>

              {/* Title */}
              <div className="text-center my-3">
                <h2 className="text-sm font-bold uppercase tracking-wide underline">
                  DAFTAR REKAPITULASI KEHADIRAN DEWAN GURU & ASATIDZ
                </h2>
                <p className="text-xs text-slate-600 mt-1 font-medium">
                  Hari / Tanggal: {formatDateIndo(selectedDate)}
                </p>
              </div>

              {/* Table */}
              <table className="w-full text-xs border border-slate-400 mt-4 border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-800">
                    <th className="border border-slate-400 p-2 text-center w-8">No</th>
                    <th className="border border-slate-400 p-2 text-left">Nama Lengkap & NIP</th>
                    <th className="border border-slate-400 p-2 text-left">Mata Pelajaran</th>
                    <th className="border border-slate-400 p-2 text-center w-20">Masuk</th>
                    <th className="border border-slate-400 p-2 text-center w-20">Pulang</th>
                    <th className="border border-slate-400 p-2 text-center w-24">Status</th>
                    <th className="border border-slate-400 p-2 text-left">Catatan KBM</th>
                  </tr>
                </thead>
                <tbody>
                  {dateRecords.map((r, i) => (
                    <tr key={r.id}>
                      <td className="border border-slate-300 p-2 text-center">{i + 1}</td>
                      <td className="border border-slate-300 p-2">
                        <div className="font-bold">{r.teacherName}</div>
                        <div className="text-[10px] text-slate-500">NIP: {r.nip || '-'}</div>
                      </td>
                      <td className="border border-slate-300 p-2">{r.subjectSummary || '-'}</td>
                      <td className="border border-slate-300 p-2 text-center font-mono">{r.checkInTime || '-'}</td>
                      <td className="border border-slate-300 p-2 text-center font-mono">{r.checkOutTime || '-'}</td>
                      <td className="border border-slate-300 p-2 text-center font-semibold">{r.status}</td>
                      <td className="border border-slate-300 p-2 text-slate-600">{r.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Summary Stats Footer */}
              <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <p className="font-bold text-slate-800 mb-1">Ringkasan Statistik Kehadiran:</p>
                  <p>• Total Guru: <span className="font-semibold">{totalGuru} orang</span></p>
                  <p>• Hadir: <span className="font-semibold text-emerald-700">{countHadir} orang ({percentageHadir}%)</span></p>
                  <p>• Izin: <span className="font-semibold text-amber-700">{countIzin} orang</span> | Sakit: <span className="font-semibold text-blue-700">{countSakit} orang</span></p>
                  <p>• Dinas Luar: <span className="font-semibold text-indigo-700">{countDinasLuar} orang</span> | Alpa: <span className="font-semibold text-rose-700">{countAlpa} orang</span></p>
                </div>

                {/* Signatures */}
                <div className="flex justify-end text-center">
                  <div>
                    <p className="text-slate-600">Mengetahui,</p>
                    <p className="font-bold text-slate-900">Kepala MI Assuyutiyah</p>
                    <div className="h-16"></div>
                    <p className="font-bold underline text-slate-900">Ust. H. Muhammad Ilyas, S.Pd.I</p>
                    <p className="text-[11px] text-slate-500">NIP. 197904122005011004</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
