import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  BookOpen,
  FileText,
  Video,
  Link as LinkIcon,
  Plus,
  Trash2,
  ExternalLink,
  Eye,
  X,
  Sparkles,
  Download,
  Check,
} from 'lucide-react';
import { LearningMaterial, MaterialType } from '../../types/lms';

export const ManajemenMateri: React.FC = () => {
  const { materials, subjects, classes, currentUser, addMaterial, deleteMaterial } = useLMS();

  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [previewMaterial, setPreviewMaterial] = useState<LearningMaterial | null>(null);

  const [materialToDelete, setMaterialToDelete] = useState<any | null>(null);
  const [feedbackToast, setFeedbackToast] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    subjectId: 'sb-3',
    classId: 'c-5a',
    type: 'pdf' as MaterialType,
    url: '',
    description: '',
    content: '',
  });

  const filteredMaterials = materials.filter((m) => {
    return selectedSubjectFilter === 'ALL' || m.subjectId === selectedSubjectFilter;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sub = subjects.find((s) => s.id === formData.subjectId) || subjects[0];
    const cls = classes.find((c) => c.id === formData.classId) || classes[0];

    addMaterial({
      title: formData.title,
      subjectId: sub.id,
      subjectName: sub.name,
      classId: cls.id,
      className: cls.name,
      teacherId: currentUser?.id || 'user-guru-1',
      teacherName: currentUser?.name || 'Usth. Siti Fatimah, S.Pd.I',
      type: formData.type,
      url: formData.url,
      description: formData.description,
      content: formData.content,
      fileSizeBytes: formData.type === 'pdf' ? 2100000 : undefined,
    });

    setIsAddModalOpen(false);
    setFormData({
      title: '',
      subjectId: 'sb-3',
      classId: 'c-5a',
      type: 'pdf',
      url: '',
      description: '',
      content: '',
    });
  };

  const getBadgeForType = (type: MaterialType) => {
    switch (type) {
      case 'pdf':
        return { label: 'PDF Modul', icon: FileText, bg: 'bg-rose-50 text-rose-700 border-rose-200' };
      case 'video':
        return { label: 'Video Pelajaran', icon: Video, bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'link':
        return { label: 'Tautan Web', icon: LinkIcon, bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      default:
        return { label: 'Rangkuman Teks', icon: BookOpen, bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-700" />
            <span>Manajemen Materi & Modul</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Diagram Alur: Unggah PDF, Video Pembelajaran, dan Tautan Edukatif
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Unggah Modul / Materi Baru</span>
        </button>
      </div>

      {/* Feedback Toast */}
      {feedbackToast && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-800 text-xs shadow-xs animate-in fade-in">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{feedbackToast}</span>
          </div>
          <button
            onClick={() => setFeedbackToast('')}
            className="p-1 text-emerald-500 hover:text-emerald-700 rounded-lg hover:bg-emerald-100/50 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-600">Saring Mata Pelajaran:</span>
          <select
            value={selectedSubjectFilter}
            onChange={(e) => setSelectedSubjectFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-800 outline-hidden focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">Semua Mata Pelajaran ({materials.length})</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Materials Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMaterials.map((mat) => {
          const badge = getBadgeForType(mat.type);
          const BadgeIcon = badge.icon;
          return (
            <div
              key={mat.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}
                  >
                    <BadgeIcon className="w-3 h-3" />
                    <span>{badge.label}</span>
                  </span>
                  <span className="text-[10px] text-slate-400">{mat.createdAt}</span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900 line-clamp-2 leading-snug">
                    {mat.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-[11px] text-emerald-700 font-semibold mt-1">
                    <span>{mat.subjectName}</span>
                    <span>•</span>
                    <span className="text-slate-500 font-normal">{mat.className}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {mat.description}
                </p>
              </div>

              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setPreviewMaterial(mat)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Lihat Detail Materi</span>
                </button>

                <button
                  onClick={() => setMaterialToDelete(mat)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Hapus Modul"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add Material */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Unggah Materi & Modul Baru</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Judul Materi / Bab *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Modul Fikih Shalat Idul Fitri & Idul Adha"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
                  <select
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sasaran Kelas</label>
                  <select
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tipe Materi</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['pdf', 'video', 'link', 'text'] as MaterialType[]).map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setFormData({ ...formData, type: t })}
                      className={`py-2 rounded-xl border font-bold capitalize transition-all ${
                        formData.type === t
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {formData.type === 'video' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">URL Video (YouTube / Google Drive)</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>
              )}

              {formData.type === 'link' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tautan Web / E-Book</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://perpustakaan.kemenag.go.id/..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>
              )}

              {formData.type === 'pdf' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Simulasi File PDF</label>
                  <div className="p-4 border-2 border-dashed border-slate-300 rounded-xl text-center bg-slate-50">
                    <FileText className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
                    <p className="font-semibold text-slate-700">File Modul Ajar Digital MI Assuyutiyah</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Otomatis dilampirkan sebagai format PDF siap unduh santri</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ringkasan / Isi Materi</label>
                <textarea
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Ketik ringkasan dalil, kaidah tajwid, atau poin penting materi di sini..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deskripsi Singkat</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Keterangan singkat pengantar modul untuk siswa"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-colors"
                >
                  Unggah Modul
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Preview Material */}
      {previewMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-emerald-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-300 uppercase">
                  {previewMaterial.subjectName} • {previewMaterial.className}
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">{previewMaterial.title}</h3>
              </div>
              <button onClick={() => setPreviewMaterial(null)} className="text-white hover:text-slate-300 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 leading-relaxed">
                <p className="font-semibold text-slate-800 mb-1">Pengantar Modul:</p>
                {previewMaterial.description}
              </div>

              {previewMaterial.content && (
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm">Isi Pembelajaran:</h4>
                  <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 text-slate-800 leading-relaxed whitespace-pre-line font-serif text-sm">
                    {previewMaterial.content}
                  </div>
                </div>
              )}

              {previewMaterial.type === 'video' && (
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-blue-900">
                    <Video className="w-5 h-5 text-blue-600" />
                    <span className="font-bold">Tautan Media Video Pembelajaran</span>
                  </div>
                  <a
                    href={previewMaterial.url || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg inline-flex items-center gap-1"
                  >
                    <span>Tonton Video</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {previewMaterial.type === 'pdf' && (
                <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-rose-900">
                    <FileText className="w-5 h-5 text-rose-600" />
                    <div>
                      <p className="font-bold">Dokumen Modul PDF Digital</p>
                      <p className="text-[10px] text-rose-700">Ukuran: 2.4 MB • Format Kemenag</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setFeedbackToast('Berkas modul pembelajaran digital berhasil diunduh ke perangkat.');
                      setTimeout(() => setFeedbackToast(''), 4000);
                    }}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>Unduh Modul</span>
                  </button>
                </div>
              )}

              <div className="pt-2 text-[11px] text-slate-400 flex justify-between border-t border-slate-100">
                <span>Pengajar: {previewMaterial.teacherName}</span>
                <span>Diunggah pada: {previewMaterial.createdAt}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Materi */}
      {materialToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 animate-in zoom-in-95">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Hapus Modul Pembelajaran</h3>
                <p className="text-xs text-slate-500">Konfirmasi penghapusan materi KBM</p>
              </div>
            </div>

            <div className="py-2 text-xs text-slate-600 space-y-3">
              <p>Apakah Anda yakin ingin menghapus materi modul pembelajaran ini?</p>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 text-sm">{materialToDelete.title}</div>
                <div className="text-[11px] text-slate-500">
                  {materialToDelete.subjectName} • {materialToDelete.className}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100 mt-4">
              <button
                type="button"
                onClick={() => setMaterialToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteMaterial(materialToDelete.id);
                  setFeedbackToast(`Modul "${materialToDelete.title}" telah dihapus.`);
                  setTimeout(() => setFeedbackToast(''), 4000);
                  setMaterialToDelete(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus Modul</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
