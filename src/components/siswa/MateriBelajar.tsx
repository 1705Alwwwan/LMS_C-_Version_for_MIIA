import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  BookOpen,
  FileText,
  Video,
  Download,
  ExternalLink,
  Eye,
  X,
  Sparkles,
  CheckCircle,
  Search,
} from 'lucide-react';
import { LearningMaterial } from '../../types/lms';

export const MateriBelajar: React.FC = () => {
  const { materials, subjects } = useLMS();

  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeReadingModal, setActiveReadingModal] = useState<LearningMaterial | null>(null);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  const filteredMaterials = materials.filter((m) => {
    const matchSub = selectedSubject === 'ALL' || m.subjectId === selectedSubject;
    const matchSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSub && matchSearch;
  });

  const handleDownload = (mat: LearningMaterial) => {
    setDownloadSuccessToast(`Mengunduh berkas "${mat.title}.pdf"... Berkas tersimpan di perangkat Anda.`);
    setTimeout(() => setDownloadSuccessToast(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-emerald-700" />
          <span>Materi Belajar & E-Modul Santri</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Diagram Alur: Baca & Unduh Modul Pembelajaran, Video Pelajaran, dan Tautan Edukatif
        </p>
      </div>

      {downloadSuccessToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{downloadSuccessToast}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari materi, bab, atau kata kunci..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-600 shrink-0">Mapel:</span>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-800 outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
          >
            <option value="ALL">Semua Mata Pelajaran</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMaterials.map((mat) => (
          <div
            key={mat.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {mat.subjectName}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">{mat.createdAt}</span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                  {mat.title}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Pengampu: {mat.teacherName}</p>
              </div>

              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {mat.description}
              </p>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setActiveReadingModal(mat)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Baca Modul</span>
              </button>

              <button
                onClick={() => handleDownload(mat)}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 flex items-center space-x-1 transition-colors"
                title="Unduh Berkas PDF"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>Unduh</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Reader Modal */}
      {activeReadingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 flex flex-col max-h-[85vh]">
            <div className="p-4 bg-emerald-900 text-white flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] font-bold text-amber-300 uppercase">
                  {activeReadingModal.subjectName} • {activeReadingModal.className}
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">{activeReadingModal.title}</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDownload(activeReadingModal)}
                  className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs rounded-lg inline-flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  <span>Unduh</span>
                </button>
                <button
                  onClick={() => setActiveReadingModal(null)}
                  className="text-white hover:text-slate-300 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs leading-relaxed">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-900">
                <p className="font-bold text-xs mb-1">Pengantar Ustadz/Ustadzah:</p>
                <p className="text-xs text-emerald-800">{activeReadingModal.description}</p>
              </div>

              {activeReadingModal.content ? (
                <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3 font-serif text-sm leading-relaxed text-slate-800 whitespace-pre-line">
                  {activeReadingModal.content}
                </div>
              ) : (
                <div className="p-6 text-center text-slate-500 space-y-2">
                  <FileText className="w-10 h-10 text-emerald-600 mx-auto" />
                  <p className="font-bold text-slate-800">Modul Terlampir dalam Format PDF</p>
                  <p className="text-xs text-slate-500">
                    Klik tombol "Unduh" di atas untuk menyimpan file lengkap pada perangkat Anda.
                  </p>
                </div>
              )}

              {activeReadingModal.type === 'video' && (
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-blue-900">
                    <Video className="w-5 h-5 text-blue-600" />
                    <span className="font-bold">Video Penjelasan Tartil & Praktik</span>
                  </div>
                  <a
                    href={activeReadingModal.url || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg inline-flex items-center gap-1"
                  >
                    <span>Buka Video Pembelajaran</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
              <span>Pengampu: {activeReadingModal.teacherName}</span>
              <span>MI Assuyutiyah E-Library</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
