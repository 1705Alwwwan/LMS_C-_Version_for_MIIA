import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  GraduationCap,
  BookOpen,
  Calendar,
  Clock,
  Plus,
  Trash2,
  X,
  CheckCircle,
  Lock,
  Layers,
  MapPin,
} from 'lucide-react';
import { Subject, ScheduleItem } from '../../types/lms';

export const ManajemenAkademik: React.FC = () => {
  const { subjects, schedules, classes, users, addSubject, updateSubject, addScheduleItem, deleteScheduleItem } = useLMS();

  const [activeSubTab, setActiveSubTab] = useState<'MAPEL' | 'TAHUN_AJARAN' | 'JADWAL'>('MAPEL');
  const [selectedClassFilter, setSelectedClassFilter] = useState('c-5a');
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('ALL');

  // Modal Add Subject
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [newSubject, setNewSubject] = useState({
    name: '',
    code: '',
    category: 'Keagamaan (Kemenag)' as Subject['category'],
    kkm: 75,
    teacherId: '',
  });

  // Modal Add Schedule
  const [isAddScheduleOpen, setIsAddScheduleOpen] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    day: 'Senin' as ScheduleItem['day'],
    startTime: '07:15',
    endTime: '08:35',
    classId: 'c-5a',
    subjectId: 'sb-1',
    teacherId: '',
    room: 'R. 301',
  });

  const teachers = users.filter((u) => u.role === 'GURU');
  const days: ScheduleItem['day'][] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  const filteredSchedules = schedules.filter((sc) => {
    const matchClass = sc.classId === selectedClassFilter;
    const matchDay = selectedDayFilter === 'ALL' || sc.day === selectedDayFilter;
    return matchClass && matchDay;
  });

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    const teacher = teachers.find((t) => t.id === newSubject.teacherId) || teachers[0];
    addSubject({
      name: newSubject.name,
      code: newSubject.code || `MP-${Date.now().toString().slice(-3)}`,
      category: newSubject.category,
      kkm: Number(newSubject.kkm) || 75,
      teacherId: teacher?.id || '',
      teacherName: teacher?.name || 'Belum Ditentukan',
    });
    setIsAddSubjectOpen(false);
    setNewSubject({
      name: '',
      code: '',
      category: 'Keagamaan (Kemenag)',
      kkm: 75,
      teacherId: '',
    });
  };

  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const c = classes.find((cl) => cl.id === newSchedule.classId) || classes[0];
    const s = subjects.find((sb) => sb.id === newSchedule.subjectId) || subjects[0];
    const t = teachers.find((tc) => tc.id === newSchedule.teacherId) || teachers.find((tc) => tc.id === s.teacherId) || teachers[0];

    addScheduleItem({
      day: newSchedule.day,
      startTime: newSchedule.startTime,
      endTime: newSchedule.endTime,
      classId: c.id,
      className: c.name,
      subjectId: s.id,
      subjectName: s.name,
      teacherId: t?.id || '',
      teacherName: t?.name || 'Asatidz',
      room: newSchedule.room || c.roomNumber,
    });

    setIsAddScheduleOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-emerald-700" />
          <span>Manajemen Akademik</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Diagram Alur: Mata Pelajaran & Kurikulum, Tahun Ajaran & Semester, Jadwal Pelajaran
        </p>
      </div>

      {/* Subtabs matching the 3 diagram child nodes */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveSubTab('MAPEL')}
          className={`pb-3 px-4 text-xs font-bold flex items-center space-x-2 border-b-2 transition-colors ${
            activeSubTab === 'MAPEL'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Mata Pelajaran & Kurikulum</span>
        </button>

        <button
          onClick={() => setActiveSubTab('TAHUN_AJARAN')}
          className={`pb-3 px-4 text-xs font-bold flex items-center space-x-2 border-b-2 transition-colors ${
            activeSubTab === 'TAHUN_AJARAN'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Tahun Ajaran & Semester</span>
        </button>

        <button
          onClick={() => setActiveSubTab('JADWAL')}
          className={`pb-3 px-4 text-xs font-bold flex items-center space-x-2 border-b-2 transition-colors ${
            activeSubTab === 'JADWAL'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Jadwal Pelajaran</span>
        </button>
      </div>

      {/* 1. Mata Pelajaran & Kurikulum */}
      {activeSubTab === 'MAPEL' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Kurikulum Merdeka Madrasah (Kemenag RI)</h3>
              <p className="text-xs text-slate-500">
                Mata pelajaran rumpun PAI (Qur'an Hadis, Akidah Akhlak, Fikih, SKI), Bahasa Arab, dan Mapel Umum
              </p>
            </div>
            <button
              onClick={() => setIsAddSubjectOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Mata Pelajaran</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase text-[10px] font-semibold">
                  <tr>
                    <th className="py-3 px-4">Kode</th>
                    <th className="py-3 px-4">Mata Pelajaran</th>
                    <th className="py-3 px-4">Kelompok / Kategori</th>
                    <th className="py-3 px-4">KKM / KKTP</th>
                    <th className="py-3 px-4">Guru Pengampu</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subjects.map((sb) => (
                    <tr key={sb.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-700">{sb.code}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{sb.name}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            sb.category.includes('Kemenag')
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-blue-50 text-blue-800 border border-blue-200'
                          }`}
                        >
                          {sb.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                          {sb.kkm}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">{sb.teacherName}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center text-[10px] text-emerald-700 bg-emerald-50 font-semibold px-2 py-0.5 rounded-full">
                          Aktif
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

      {/* 2. Tahun Ajaran & Semester */}
      {activeSubTab === 'TAHUN_AJARAN' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Tahun Ajaran Aktif</span>
              <div className="text-xl font-extrabold text-slate-900 mt-1">2024/2025</div>
              <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Sedang Berjalan
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Semester Aktif</span>
              <div className="text-xl font-extrabold text-slate-900 mt-1">Semester Genap</div>
              <p className="text-xs text-slate-500 mt-1">Periode: Januari - Juni 2025</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Portal Nilai Rapor</span>
              <div className="text-xl font-extrabold text-emerald-700 mt-1">DIBUKA</div>
              <p className="text-xs text-slate-500 mt-1">Guru dapat menginput nilai harian & UAS</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Pengaturan Kalender Akademik Semester</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-bold text-slate-800">Batas Pengisian Nilai Harian & Kuis</p>
                <p className="text-slate-500 mt-1">15 Mei 2025 (Pukul 23:59 WIB)</p>
                <span className="inline-block mt-2 text-[10px] font-semibold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                  Status Terbuka
                </span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-bold text-slate-800">Pelaksanaan Asesmen Sumatif Akhir Semester (ASAS)</p>
                <p className="text-slate-500 mt-1">26 Mei - 06 Juni 2025</p>
                <span className="inline-block mt-2 text-[10px] font-semibold text-amber-800 bg-amber-100/60 px-2 py-0.5 rounded">
                  Terjadwal
                </span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-bold text-slate-800">Rapat Pleno Kenaikan Kelas Dewan Asatidz</p>
                <p className="text-slate-500 mt-1">16 Juni 2025</p>
                <span className="inline-block mt-2 text-[10px] font-semibold text-blue-800 bg-blue-100/60 px-2 py-0.5 rounded">
                  Terjadwal
                </span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-bold text-slate-800">Pembagian Rapor Digital Madrasah (RDM)</p>
                <p className="text-slate-500 mt-1">20 Juni 2025</p>
                <span className="inline-block mt-2 text-[10px] font-semibold text-purple-800 bg-purple-100/60 px-2 py-0.5 rounded">
                  Terjadwal
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Jadwal Pelajaran */}
      {activeSubTab === 'JADWAL' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Pilih Kelas / Rombel:
                </label>
                <select
                  value={selectedClassFilter}
                  onChange={(e) => setSelectedClassFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 bg-slate-50 text-slate-800 outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Filter Hari:
                </label>
                <select
                  value={selectedDayFilter}
                  onChange={(e) => setSelectedDayFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 bg-slate-50 text-slate-800 outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="ALL">Semua Hari (Senin - Sabtu)</option>
                  {days.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => setIsAddScheduleOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Jam Jadwal</span>
            </button>
          </div>

          {/* Schedule Grid by Days */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(selectedDayFilter === 'ALL' ? days : [selectedDayFilter as ScheduleItem['day']]).map((day) => {
              const dayItems = filteredSchedules.filter((s) => s.day === day);
              return (
                <div key={day} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col">
                  <div className="bg-emerald-800 text-white px-4 py-2.5 flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-wider">{day}</span>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
                      {dayItems.length} Jam Pelajaran
                    </span>
                  </div>

                  <div className="p-3 divide-y divide-slate-100 flex-1">
                    {dayItems.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 text-xs">
                        Tidak ada jadwal untuk hari {day}.
                      </div>
                    ) : (
                      dayItems.map((sc) => (
                        <div key={sc.id} className="py-2.5 first:pt-1 last:pb-1 group">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {sc.startTime} - {sc.endTime}
                              </div>
                              <h4 className="text-xs font-bold text-slate-900 mt-0.5">{sc.subjectName}</h4>
                              <p className="text-[11px] text-slate-500">{sc.teacherName}</p>
                              <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                                <MapPin className="w-3 h-3 text-slate-400" /> {sc.room}
                              </div>
                            </div>
                            <button
                              onClick={() => deleteScheduleItem(sc.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition-opacity"
                              title="Hapus Jam Jadwal"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal Add Subject */}
      {isAddSubjectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Tambah Mata Pelajaran</h3>
              <button onClick={() => setIsAddSubjectOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateSubject} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Mata Pelajaran *</label>
                <input
                  type="text"
                  required
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                  placeholder="Contoh: Seni Budaya & Kaligrafi"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kode Mapel</label>
                  <input
                    type="text"
                    value={newSubject.code}
                    onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                    placeholder="SBK-05"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nilai KKM / KKTP</label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={newSubject.kkm}
                    onChange={(e) => setNewSubject({ ...newSubject, kkm: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori Kurikulum</label>
                <select
                  value={newSubject.category}
                  onChange={(e) => setNewSubject({ ...newSubject, category: e.target.value as Subject['category'] })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Keagamaan (Kemenag)">Keagamaan (Kemenag)</option>
                  <option value="Umum">Umum</option>
                  <option value="Muatan Lokal">Muatan Lokal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Guru Pengampu</label>
                <select
                  value={newSubject.teacherId}
                  onChange={(e) => setNewSubject({ ...newSubject, teacherId: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">-- Pilih Guru / Asatidz --</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddSubjectOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-colors"
                >
                  Simpan Mapel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Schedule */}
      {isAddScheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Tambah Jam Pelajaran Baru</h3>
              <button onClick={() => setIsAddScheduleOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSchedule} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hari</label>
                  <select
                    value={newSchedule.day}
                    onChange={(e) => setNewSchedule({ ...newSchedule, day: e.target.value as ScheduleItem['day'] })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    {days.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kelas</label>
                  <select
                    value={newSchedule.classId}
                    onChange={(e) => setNewSchedule({ ...newSchedule, classId: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jam Mulai</label>
                  <input
                    type="time"
                    value={newSchedule.startTime}
                    onChange={(e) => setNewSchedule({ ...newSchedule, startTime: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jam Selesai</label>
                  <input
                    type="time"
                    value={newSchedule.endTime}
                    onChange={(e) => setNewSchedule({ ...newSchedule, endTime: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
                <select
                  value={newSchedule.subjectId}
                  onChange={(e) => setNewSchedule({ ...newSchedule, subjectId: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.teacherName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ruangan</label>
                <input
                  type="text"
                  value={newSchedule.room}
                  onChange={(e) => setNewSchedule({ ...newSchedule, room: e.target.value })}
                  placeholder="R. 301 atau Lab Ibadah"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddScheduleOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-colors"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
