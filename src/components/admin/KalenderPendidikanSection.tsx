import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { AcademicCalendarEvent } from '../../types/lms';
import {
  Calendar,
  Plus,
  Bell,
  Sparkles,
  Tag,
  Clock,
  Users,
  CheckCircle2,
  Trash2,
  X,
  Send,
  AlertCircle,
  Bookmark,
} from 'lucide-react';

export const KalenderPendidikanSection: React.FC = () => {
  const { academicCalendar, addCalendarEvent, deleteCalendarEvent } = useLMS();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isAddEventOpen, setIsAddEventOpen] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string>('');

  const [newEvent, setNewEvent] = useState({
    title: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    category: 'Akademik' as AcademicCalendarEvent['category'],
    targetRole: 'ALL' as AcademicCalendarEvent['targetRole'],
    description: '',
    color: '#059669',
    broadcastToNotification: true,
  });

  const categories = [
    { id: 'ALL', label: 'Semua Kategori' },
    { id: 'Akademik', label: 'Akademik & KBM' },
    { id: 'Ujian ASTS/ASAS', label: 'Ujian / ASTS / ASAS' },
    { id: 'PHBI & Keagamaan', label: 'PHBI & Keagamaan' },
    { id: 'Libur Semester', label: 'Libur Semester / Ramadhan' },
    { id: 'Rapat Guru & Wali', label: 'Rapat Asatidz & Wali' },
  ];

  const filteredEvents = academicCalendar
    .filter((e) => selectedCategory === 'ALL' || e.category === selectedCategory)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title.trim()) return;

    addCalendarEvent(
      {
        title: newEvent.title,
        startDate: newEvent.startDate,
        endDate: newEvent.endDate,
        category: newEvent.category,
        targetRole: newEvent.targetRole,
        description: newEvent.description,
        color: newEvent.color,
      },
      newEvent.broadcastToNotification
    );

    setIsAddEventOpen(false);
    setNewEvent({
      title: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      category: 'Akademik',
      targetRole: 'ALL',
      description: '',
      color: '#059669',
      broadcastToNotification: true,
    });

    setSuccessToast(
      'Event Kalender Pendidikan berhasil ditambahkan dan otomatis disiarkan (broadcast) ke seluruh Guru dan Siswa!'
    );
    setTimeout(() => setSuccessToast(''), 4500);
  };

  const categoryColorMap: Record<string, { bg: string; text: string; border: string }> = {
    'Akademik': { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
    'Ujian ASTS/ASAS': { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200' },
    'PHBI & Keagamaan': { bg: 'bg-amber-50', text: 'text-amber-900', border: 'border-amber-200' },
    'Libur Semester': { bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-200' },
    'Rapat Guru & Wali': { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
  };

  return (
    <div className="space-y-6">
      {/* Header and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-slate-900">
              Kalender Pendidikan Madrasah Ibtidaiyah Assuyutiyah
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              Otomatis Terhubung Event & Notifikasi
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Setiap agenda yang dimasukkan akan memicu notifikasi prioritas di dashboard Dewan Guru dan Santri/Wali Murid.
          </p>
        </div>

        <button
          onClick={() => setIsAddEventOpen(true)}
          className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-800/20 flex items-center gap-2 cursor-pointer transition-transform active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Tambah Event & Broadcast Notifikasi</span>
        </button>
      </div>

      {successToast && (
        <div className="p-3.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Category Pills Filter */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Events List / Timeline */}
      <div className="space-y-3">
        {filteredEvents.map((evt) => {
          const catStyle = categoryColorMap[evt.category] || {
            bg: 'bg-slate-50',
            text: 'text-slate-800',
            border: 'border-slate-200',
          };

          const isOngoing =
            new Date(evt.startDate).getTime() <= Date.now() &&
            new Date(evt.endDate).getTime() >= Date.now();

          return (
            <div
              key={evt.id}
              className={`p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-emerald-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isOngoing ? 'ring-2 ring-emerald-500/30' : ''
              }`}
            >
              <div className="flex items-start space-x-3.5 min-w-0">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md font-bold text-xs"
                  style={{ backgroundColor: evt.color || '#059669' }}
                >
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
                    >
                      {evt.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                      Target: {evt.targetRole === 'ALL' ? 'Semua (Guru & Santri)' : evt.targetRole === 'GURU' ? 'Khusus Guru' : 'Khusus Siswa'}
                    </span>
                    {evt.notificationSent && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <Bell className="w-3 h-3 text-emerald-600" />
                        Ternotifikasi
                      </span>
                    )}
                  </div>

                  <h4 className="font-extrabold text-sm text-slate-900">{evt.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{evt.description}</p>

                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {evt.startDate} {evt.endDate !== evt.startDate ? ` s.d. ${evt.endDate}` : ''}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => deleteCalendarEvent(evt.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  title="Hapus Event Kalender"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add Calendar Event */}
      {isAddEventOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Tambah Event Kalender Pendidikan
                  </h3>
                  <p className="text-xs text-slate-500">
                    Otomatis mengirim notifikasi ke role guru dan siswa
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddEventOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Kegiatan / Event Kalender:
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Misal: Asesmen Sumatif Akhir Semester (ASAS) Genap"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-emerald-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kategori:</label>
                  <select
                    value={newEvent.category}
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        category: e.target.value as any,
                      })
                    }
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-emerald-600"
                  >
                    <option value="Akademik">Akademik & KBM</option>
                    <option value="Ujian ASTS/ASAS">Ujian / ASTS / ASAS</option>
                    <option value="PHBI & Keagamaan">PHBI & Keagamaan</option>
                    <option value="Libur Semester">Libur Semester / Ramadhan</option>
                    <option value="Rapat Guru & Wali">Rapat Guru & Wali</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Broadcast:
                  </label>
                  <select
                    value={newEvent.targetRole}
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        targetRole: e.target.value as any,
                      })
                    }
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-emerald-600"
                  >
                    <option value="ALL">Semua (Guru & Santri)</option>
                    <option value="GURU">Khusus Dewan Guru</option>
                    <option value="SISWA">Khusus Santri & Wali Murid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tanggal Mulai:
                  </label>
                  <input
                    type="date"
                    value={newEvent.startDate}
                    onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-emerald-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tanggal Selesai:
                  </label>
                  <input
                    type="date"
                    value={newEvent.endDate}
                    onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-emerald-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Deskripsi / Petunjuk Pelaksanaan:
                </label>
                <textarea
                  rows={3}
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Keterangan lengkap agenda kalender pendidikan yang akan dibaca guru dan santri..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-emerald-600 leading-relaxed"
                  required
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={newEvent.broadcastToNotification}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, broadcastToNotification: e.target.checked })
                    }
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span className="font-bold text-emerald-950">
                    Kirim notifikasi broadcast langsung ke Dashboard Guru & Siswa
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddEventOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-800/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Simpan & Broadcast Event</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
