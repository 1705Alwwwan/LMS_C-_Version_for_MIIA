import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { MutabaahEntry } from '../../types/lms';
import {
  Heart,
  CheckCircle2,
  Calendar,
  Search,
  Filter,
  Award,
  Sparkles,
  BookOpen,
  UserCheck,
  Clock,
  MessageSquare,
  ShieldAlert,
  Send,
  X,
  Star,
} from 'lucide-react';

export const MutabaahGuru: React.FC = () => {
  const { users, classes, mutabaahList, verifyMutabaahByTeacher, currentUser } = useLMS();

  const [selectedClassId, setSelectedClassId] = useState<string>('c-5a');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected entry for verify / note modal
  const [activeModalEntry, setActiveModalEntry] = useState<MutabaahEntry | null>(null);
  const [noteText, setNoteText] = useState<string>('');
  const [selectedBadge, setSelectedBadge] = useState<MutabaahEntry['characterBadge']>('Rajin Berjamaah');
  const [disciplineScore, setDisciplineScore] = useState<number>(95);

  // Students in selected class
  const classStudents = users.filter((u) => u.role === 'SISWA' && u.classId === selectedClassId);

  // Filtered mutabaah for selected class and date
  const filteredEntries = classStudents.map((student) => {
    const existing = mutabaahList.find(
      (m) => m.studentId === student.id && m.date === selectedDate
    );
    if (existing) return existing;

    // Default mock entry if student hasn't submitted yet today
    const fallback: MutabaahEntry = {
      id: `mut-auto-${student.id}-${selectedDate}`,
      date: selectedDate,
      studentId: student.id,
      studentName: student.name,
      classId: student.classId || selectedClassId,
      className: student.className || 'Kelas 5A',
      prayers: {
        subuh: 'Tepat Waktu',
        dzuhur: 'Berjamaah',
        ashar: 'Berjamaah',
        maghrib: 'Berjamaah',
        isya: 'Tepat Waktu',
        dhuha: true,
        tahajjud: false,
        rawatib: true,
      },
      tadarus: {
        type: "Al-Qur'an",
        surahOrVolume: 'Juz 30 (Al-A\'la)',
        startAyahOrPage: 'Ayat 1',
        endAyahOrPage: 'Ayat 19',
      },
      tahfidz: {
        surah: "An-Naba'",
        startAyat: 1,
        endAyat: 20,
        juz: 30,
        kelancaran: 'Mumtaz (Sangat Lancar)',
      },
      teacherVerified: false,
      parentVerified: false,
      disciplineScore: 90,
    };
    return fallback;
  }).filter((entry) =>
    entry.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats calculation
  const totalStudents = filteredEntries.length;
  const verifiedCount = filteredEntries.filter((e) => e.teacherVerified).length;
  const dhuhaCount = filteredEntries.filter((e) => e.prayers.dhuha).length;
  const jamaahSubuhCount = filteredEntries.filter((e) => e.prayers.subuh === 'Berjamaah').length;

  const handleOpenNoteModal = (entry: MutabaahEntry) => {
    setActiveModalEntry(entry);
    setNoteText(entry.teacherNote || '');
    setSelectedBadge(entry.characterBadge || 'Rajin Berjamaah');
    setDisciplineScore(entry.disciplineScore || 95);
  };

  const handleSaveVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalEntry) return;

    verifyMutabaahByTeacher(
      activeModalEntry.id,
      noteText || 'Alhamdulillah sangat baik dalam pembiasaan sholat berjamaah dan adab di madrasah.',
      selectedBadge,
      disciplineScore
    );
    setActiveModalEntry(null);
  };

  const badgeColors: Record<string, string> = {
    'Amanah': 'bg-blue-100 text-blue-800 border-blue-200',
    'Disiplin': 'bg-purple-100 text-purple-800 border-purple-200',
    'Rajin Berjamaah': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Hafidz Cilik': 'bg-amber-100 text-amber-800 border-amber-200',
    'Santun & Berbakti': 'bg-teal-100 text-teal-800 border-teal-200',
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-700/50 border border-emerald-500/30 text-amber-300 text-xs font-semibold mb-2">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
              <span>Buku Penghubung & Pembinaan Karakter Santri</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Mutaba'ah Yaumiyah & Ibadah Harian
            </h1>
            <p className="text-emerald-100/90 text-xs sm:text-sm mt-1 max-w-2xl">
              Pantau amalan sholat 5 waktu, sholat dhuha, tadarus Al-Qur'an, setoran tahfidz Juz 30, serta beri catatan akhlak dua arah kepada wali santri.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 text-center shrink-0">
            <span className="text-[11px] text-emerald-200 block">Wali Kelas Aktif</span>
            <span className="text-sm font-bold text-amber-300">{currentUser?.name || 'Usth. Siti Fatimah'}</span>
            <span className="text-[10px] text-white/80 block mt-0.5">MI Assuyutiyah</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Santri Rombel</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{totalStudents}</div>
          <div className="text-[11px] text-emerald-700 mt-0.5">Rombel Aktif</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Sholat Dhuha Hari Ini</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600 mt-2">
            {dhuhaCount} <span className="text-xs font-semibold text-slate-400">/ {totalStudents}</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {totalStudents > 0 ? Math.round((dhuhaCount / totalStudents) * 100) : 0}% Terlaksana
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Subuh Berjamaah</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-teal-700 mt-2">{jamaahSubuhCount}</div>
          <div className="text-[11px] text-teal-600 mt-0.5">Di Masjid / Musholla</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Paraf Wali Kelas</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-600 mt-2">
            {verifiedCount} <span className="text-xs font-semibold text-slate-400">/ {totalStudents}</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Sudah Diberi Catatan</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="w-4 h-4 text-emerald-600" />
            <span className="font-bold">Kelas:</span>
          </div>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-emerald-600"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.academicYear})
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 ml-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span className="font-bold">Tanggal:</span>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-slate-800 focus:outline-emerald-600"
          />
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama santri..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-emerald-600"
          />
        </div>
      </div>

      {/* Mutaba'ah Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Daftar Catatan Ibadah Santri • {selectedDate}
            </h3>
            <p className="text-xs text-slate-500">
              Evaluasi checklist harian dan komunikasi berkala dengan orang tua/wali santri
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Santri</th>
                <th className="py-3 px-4">Sholat 5 Waktu</th>
                <th className="py-3 px-3 text-center">Dhuha & Sunnah</th>
                <th className="py-3 px-4">Tadarus & Tilawati</th>
                <th className="py-3 px-4">Setoran Tahfidz (Juz 30)</th>
                <th className="py-3 px-3 text-center">Paraf Wali Murid</th>
                <th className="py-3 px-3 text-center">Paraf Wali Kelas</th>
                <th className="py-3 px-4 text-center">Aksi Pembinaan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{entry.studentName}</div>
                    <div className="text-[10px] text-slate-400">{entry.className}</div>
                    {entry.characterBadge && (
                      <span className={`inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${badgeColors[entry.characterBadge] || 'bg-slate-100 text-slate-700'}`}>
                        ★ {entry.characterBadge}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1 text-[10px]">
                      <span className={`px-1.5 py-0.5 rounded font-semibold ${entry.prayers.subuh === 'Berjamaah' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
                        Subuh: {entry.prayers.subuh}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded font-semibold ${entry.prayers.dzuhur === 'Berjamaah' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
                        Dzuhur: {entry.prayers.dzuhur}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded font-semibold ${entry.prayers.ashar === 'Berjamaah' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
                        Ashar: {entry.prayers.ashar}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded font-semibold ${entry.prayers.maghrib === 'Berjamaah' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
                        Maghrib: {entry.prayers.maghrib}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded font-semibold ${entry.prayers.isya === 'Berjamaah' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
                        Isya: {entry.prayers.isya}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <div className="space-y-0.5 text-[10px]">
                      <span className={`inline-block px-1.5 py-0.5 rounded font-bold ${entry.prayers.dhuha ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-400'}`}>
                        {entry.prayers.dhuha ? '✓ Dhuha' : '-'}
                      </span>
                      {entry.prayers.tahajjud && (
                        <span className="inline-block px-1.5 py-0.5 rounded font-bold bg-indigo-100 text-indigo-800 ml-1">
                          ✓ Tahajjud
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-[11px] font-bold text-slate-800">
                      {entry.tadarus.type}: {entry.tadarus.surahOrVolume}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {entry.tadarus.startAyahOrPage} s.d. {entry.tadarus.endAyahOrPage}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-[11px] font-bold text-emerald-800">
                      Surat {entry.tahfidz.surah}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Ayat {entry.tahfidz.startAyat}-{entry.tahfidz.endAyat} (Juz {entry.tahfidz.juz})
                    </div>
                    <span className="inline-block text-[9px] font-bold px-1.5 py-0.2 bg-emerald-50 text-emerald-700 rounded border border-emerald-200 mt-0.5">
                      {entry.tahfidz.kelancaran}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    {entry.parentVerified ? (
                      <div className="inline-flex flex-col items-center">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="text-[9px] font-bold text-emerald-700">Sudah Diparaf</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">Belum</span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    {entry.teacherVerified ? (
                      <div className="inline-flex flex-col items-center">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="text-[9px] font-bold text-emerald-700">Terverifikasi</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-amber-600 font-bold">Perlu Paraf</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleOpenNoteModal(entry)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 flex items-center justify-center gap-1 mx-auto cursor-pointer ${
                        entry.teacherVerified
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                          : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-800/20'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{entry.teacherVerified ? 'Edit Catatan' : 'Beri Paraf'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Catatan Akhlak & Paraf Wali Kelas */}
      {activeModalEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Catatan Akhlak & Paraf Wali Kelas</h3>
                  <p className="text-xs text-slate-500">
                    {activeModalEntry.studentName} • {activeModalEntry.className}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveModalEntry(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVerification} className="mt-4 space-y-4">
              {/* Parent Note (Read-only if present) */}
              {activeModalEntry.parentNote && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs">
                  <div className="font-bold text-amber-900 flex items-center gap-1 mb-1">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-700" />
                    Catatan dari Orang Tua / Wali Santri:
                  </div>
                  <p className="text-amber-950 italic">"{activeModalEntry.parentNote}"</p>
                  <p className="text-[10px] text-amber-700 mt-1">
                    Diparaf pada: {activeModalEntry.parentVerifiedAt || '-'}
                  </p>
                </div>
              )}

              {/* Input Catatan Wali Kelas */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Pembinaan Akhlak, Adab, & Motivasi Belajar:
                </label>
                <textarea
                  rows={3}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Tuliskan catatan apresiasi ibadah, kedisiplinan santri di kelas, atau saran pembiasaan di rumah..."
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-emerald-600 focus:bg-white leading-relaxed"
                  required
                />
              </div>

              {/* Lencana Karakter */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pemberian Lencana Karakter Santri:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['Rajin Berjamaah', 'Hafidz Cilik', 'Santun & Berbakti', 'Disiplin', 'Amanah'] as const).map(
                    (b) => (
                      <button
                        type="button"
                        key={b}
                        onClick={() => setSelectedBadge(b)}
                        className={`p-2 rounded-xl text-[11px] font-bold border flex items-center gap-1.5 transition-all ${
                          selectedBadge === b
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span className="truncate">{b}</span>
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Skor Kedisiplinan */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Skor Kedisiplinan Harian:</span>
                  <span className="text-emerald-700 text-sm">{disciplineScore} / 100</span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="100"
                  value={disciplineScore}
                  onChange={(e) => setDisciplineScore(Number(e.target.value))}
                  className="w-full accent-emerald-700 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveModalEntry(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-800/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Simpan & Beri Paraf Resmi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
