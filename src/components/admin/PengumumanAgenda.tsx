import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  Megaphone,
  Calendar,
  Plus,
  Clock,
  MapPin,
  X,
  Sparkles,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { SchoolAnnouncement, SchoolAgenda } from '../../types/lms';

import { KalenderPendidikanSection } from './KalenderPendidikanSection';

export const PengumumanAgenda: React.FC = () => {
  const { announcements, agendas, academicCalendar, currentUser, addAnnouncement, addAgenda } = useLMS();

  const [activeTab, setActiveTab] = useState<'PENGUMUMAN' | 'AGENDA' | 'KALENDER'>('PENGUMUMAN');

  // Modal new announcement
  const [isAddAnnOpen, setIsAddAnnOpen] = useState(false);
  const [newAnn, setNewAnn] = useState({
    title: '',
    content: '',
    targetRole: 'ALL' as SchoolAnnouncement['targetRole'],
    priority: 'Penting' as SchoolAnnouncement['priority'],
    author: currentUser?.name || 'Tata Usaha Madrasah',
  });

  // Modal new agenda
  const [isAddAgdOpen, setIsAddAgdOpen] = useState(false);
  const [newAgd, setNewAgd] = useState({
    title: '',
    date: '2026-10-25',
    time: '08:00 - 11:30 WIB',
    location: 'Aula Madrasah Assuyutiyah',
    description: '',
    category: 'Keagamaan' as SchoolAgenda['category'],
  });

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    addAnnouncement({
      title: newAnn.title,
      content: newAnn.content,
      targetRole: newAnn.targetRole,
      priority: newAnn.priority,
      author: newAnn.author,
    });
    setIsAddAnnOpen(false);
    setNewAnn({
      title: '',
      content: '',
      targetRole: 'ALL',
      priority: 'Penting',
      author: currentUser?.name || 'Tata Usaha Madrasah',
    });
  };

  const handleCreateAgenda = (e: React.FormEvent) => {
    e.preventDefault();
    addAgenda({
      title: newAgd.title,
      date: newAgd.date,
      time: newAgd.time,
      location: newAgd.location,
      description: newAgd.description,
      category: newAgd.category,
    });
    setIsAddAgdOpen(false);
    setNewAgd({
      title: '',
      date: '2026-10-25',
      time: '08:00 - 11:30 WIB',
      location: 'Aula Madrasah Assuyutiyah',
      description: '',
      category: 'Keagamaan',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Megaphone className="w-6 h-6 text-emerald-700" />
          <span>Pengumuman & Agenda Madrasah</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Diagram Alur: Saluran Pengumuman Resmi & Kalender Kegiatan MI Assuyutiyah
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('PENGUMUMAN')}
          className={`pb-3 px-4 text-xs font-bold flex items-center space-x-2 border-b-2 transition-colors ${
            activeTab === 'PENGUMUMAN'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Pengumuman Madrasah ({announcements.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('AGENDA')}
          className={`pb-3 px-4 text-xs font-bold flex items-center space-x-2 border-b-2 transition-colors ${
            activeTab === 'AGENDA'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Agenda Kegiatan ({agendas.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('KALENDER')}
          className={`pb-3 px-4 text-xs font-bold flex items-center space-x-2 border-b-2 transition-colors ${
            activeTab === 'KALENDER'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Kalender Pendidikan & Broadcast ({academicCalendar.length})</span>
        </button>
      </div>

      {/* 3. Kalender Pendidikan Section */}
      {activeTab === 'KALENDER' && <KalenderPendidikanSection />}

      {/* 1. Pengumuman */}
      {activeTab === 'PENGUMUMAN' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Daftar Pengumuman Aktif</h3>
              <p className="text-xs text-slate-500">
                Pesan yang dipublikasikan akan tampil di Dashboard Siswa dan Guru sesuai target
              </p>
            </div>
            <button
              onClick={() => setIsAddAnnOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Pengumuman Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        ann.priority === 'Mendesak'
                          ? 'bg-rose-100 text-rose-700'
                          : ann.priority === 'Penting'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {ann.priority}
                    </span>
                    <span className="text-[11px] text-slate-400">{ann.date}</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">{ann.title}</h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
                    {ann.content}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Penerbit: <strong className="text-slate-700">{ann.author}</strong></span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-600">
                    Target: {ann.targetRole}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Agenda */}
      {activeTab === 'AGENDA' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Jadwal & Agenda Madrasah</h3>
              <p className="text-xs text-slate-500">
                Kalender kegiatan formal, keagamaan, ujian, serta rapat dewan guru
              </p>
            </div>
            <button
              onClick={() => setIsAddAgdOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Agenda Baru</span>
            </button>
          </div>

          <div className="space-y-3">
            {agendas.map((agd) => (
              <div
                key={agd.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-emerald-300 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex flex-col items-center justify-center shrink-0 text-center font-bold">
                    <span className="text-base leading-none">{agd.date.split('-')[2]}</span>
                    <span className="text-[10px] uppercase mt-1">
                      {new Date(agd.date).toLocaleString('id-ID', { month: 'short' })}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold text-slate-900">{agd.title}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {agd.category}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> {agd.time}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {agd.location}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1.5">{agd.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Add Announcement */}
      {isAddAnnOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Buat Pengumuman Baru</h3>
              <button onClick={() => setIsAddAnnOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Pengumuman *</label>
                <input
                  type="text"
                  required
                  value={newAnn.title}
                  onChange={(e) => setNewAnn({ ...newAnn, title: e.target.value })}
                  placeholder="Contoh: Libur Hari Santri Nasional"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Audiens</label>
                  <select
                    value={newAnn.targetRole}
                    onChange={(e) => setNewAnn({ ...newAnn, targetRole: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="ALL">Semua (Guru & Siswa)</option>
                    <option value="GURU">Khusus Asatidz / Guru</option>
                    <option value="SISWA">Khusus Siswa & Wali Murid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Prioritas</label>
                  <select
                    value={newAnn.priority}
                    onChange={(e) => setNewAnn({ ...newAnn, priority: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Biasa">Biasa</option>
                    <option value="Penting">Penting</option>
                    <option value="Mendesak">Mendesak</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Isi Pesan Pengumuman *</label>
                <textarea
                  rows={4}
                  required
                  value={newAnn.content}
                  onChange={(e) => setNewAnn({ ...newAnn, content: e.target.value })}
                  placeholder="Tuliskan isi pengumuman secara jelas dan santun..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddAnnOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-colors"
                >
                  Publikasikan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Agenda */}
      {isAddAgdOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Tambah Agenda Madrasah</h3>
              <button onClick={() => setIsAddAgdOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAgenda} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Kegiatan *</label>
                <input
                  type="text"
                  required
                  value={newAgd.title}
                  onChange={(e) => setNewAgd({ ...newAgd, title: e.target.value })}
                  placeholder="Contoh: Pesantren Kilat Ramadhan"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={newAgd.date}
                    onChange={(e) => setNewAgd({ ...newAgd, date: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={newAgd.category}
                    onChange={(e) => setNewAgd({ ...newAgd, category: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Keagamaan">Keagamaan</option>
                    <option value="Akademik">Akademik</option>
                    <option value="Ekstrakurikuler">Ekstrakurikuler</option>
                    <option value="Rapat Guru">Rapat Guru</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Waktu</label>
                  <input
                    type="text"
                    value={newAgd.time}
                    onChange={(e) => setNewAgd({ ...newAgd, time: e.target.value })}
                    placeholder="07:30 - 12:00 WIB"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Lokasi</label>
                  <input
                    type="text"
                    value={newAgd.location}
                    onChange={(e) => setNewAgd({ ...newAgd, location: e.target.value })}
                    placeholder="Masjid / Lapangan"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Singkat</label>
                <textarea
                  rows={2}
                  value={newAgd.description}
                  onChange={(e) => setNewAgd({ ...newAgd, description: e.target.value })}
                  placeholder="Keterangan singkat mengenai teknis pelaksanaan kegiatan"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddAgdOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-colors"
                >
                  Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
