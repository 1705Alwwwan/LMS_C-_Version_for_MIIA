import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  ArrowRightLeft,
  X,
  CheckCircle2,
  Users,
  AlertTriangle,
  GraduationCap,
  Sparkles,
  School,
  Check,
  Award,
} from 'lucide-react';

interface PromosiMassalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

export const PromosiMassalModal: React.FC<PromosiMassalModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { classes, users, promoteClassBatch, grades } = useLMS();

  const [fromClassId, setFromClassId] = useState<string>(classes[0]?.id || 'c-5a');
  const [toClassId, setToClassId] = useState<string>(classes[1]?.id || 'c-6a');
  const [newAcademicYear, setNewAcademicYear] = useState<string>('2025/2026 Ganjil');

  // Students in source class
  const sourceStudents = users.filter((u) => u.role === 'SISWA' && u.classId === fromClassId);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(
    sourceStudents.map((s) => s.id)
  );

  // When fromClassId changes, auto-select all students of that class and pick next grade
  const handleFromClassChange = (newFromId: string) => {
    setFromClassId(newFromId);
    const newSource = users.filter((u) => u.role === 'SISWA' && u.classId === newFromId);
    setSelectedStudentIds(newSource.map((s) => s.id));

    const fromClass = classes.find((c) => c.id === newFromId);
    if (fromClass) {
      if (fromClass.grade === 6) {
        setToClassId('ALUMNI');
      } else {
        const nextGrade = fromClass.grade + 1;
        const matchingNextClass = classes.find((c) => c.grade === nextGrade);
        if (matchingNextClass) {
          setToClassId(matchingNextClass.id);
        }
      }
    }
  };

  const handleToggleStudent = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((sId) => sId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedStudentIds(sourceStudents.map((s) => s.id));
  };

  const handleDeselectAll = () => {
    setSelectedStudentIds([]);
  };

  const handleExecutePromotion = () => {
    if (selectedStudentIds.length === 0) {
      alert('Pilih minimal 1 santri untuk dipromosikan.');
      return;
    }

    const res = promoteClassBatch(fromClassId, toClassId, selectedStudentIds, newAcademicYear);
    if (res.success) {
      onSuccess(res.message);
      onClose();
    }
  };

  if (!isOpen) return null;

  const fromClass = classes.find((c) => c.id === fromClassId);
  const toClass = toClassId === 'ALUMNI' ? { name: 'Alumni MI Assuyutiyah (Lulus)' } : classes.find((c) => c.id === toClassId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[92vh] bg-white rounded-2xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden text-slate-800">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700/80 border border-emerald-500/30 flex items-center justify-center text-amber-300">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-white">
                  Alat Promosi Massal Akhir Tahun Ajaran (Kenaikan Kelas Serentak)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-amber-950">
                  1-Klik Selesai
                </span>
              </div>
              <p className="text-xs text-emerald-100/80">
                Pindahkan seluruh rombel secara serentak, otomatis memperbarui status siswa dan riwayat mutasi.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 bg-slate-50">
          {/* Step 1: Mapping Rombel */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <School className="w-4 h-4 text-emerald-700" />
              1. Konfigurasi Pemindahan Rombongan Belajar
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Rombel Asal (Tingkat Sebelumnya):
                </label>
                <select
                  value={fromClassId}
                  onChange={(e) => handleFromClassChange(e.target.value)}
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-emerald-600 cursor-pointer"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.academicYear}) • {c.totalStudents} Siswa
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-center pt-2 md:pt-4">
                <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300">
                  <span>Dinaikkan Ke</span>
                  <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-700" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Rombel Tujuan (Tingkat Baru):
                </label>
                <select
                  value={toClassId}
                  onChange={(e) => setToClassId(e.target.value)}
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-emerald-900 focus:outline-emerald-600 cursor-pointer"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (Tingkat {c.grade}) • Wali: {c.waliKelasName}
                    </option>
                  ))}
                  <option value="ALUMNI">🎓 Lulus / Alumni MI Assuyutiyah (Kelas 6 Tamat)</option>
                </select>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-600">Tahun Ajaran Baru:</span>
                <input
                  type="text"
                  value={newAcademicYear}
                  onChange={(e) => setNewAcademicYear(e.target.value)}
                  className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-slate-800"
                  placeholder="2025/2026 Ganjil"
                />
              </div>
              <div className="text-slate-500 text-[11px]">
                Target: <strong>{fromClass?.name}</strong> ➔ <strong>{toClass?.name}</strong>
              </div>
            </div>
          </div>

          {/* Step 2: Student Selection Checklist */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pb-3 border-b border-slate-100 mb-3">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-700" />
                  2. Verifikasi Santri yang Dinaikkan ({selectedStudentIds.length} / {sourceStudents.length} Santri Terpilih)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Secara default seluruh santri dicentang. Hilangkan centang jika ada santri yang tinggal kelas.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="px-2.5 py-1 text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg hover:bg-emerald-100"
                >
                  Pilih Semua (100% Naik)
                </button>
                <button
                  type="button"
                  onClick={handleDeselectAll}
                  className="px-2.5 py-1 text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-200"
                >
                  Hapus Centang
                </button>
              </div>
            </div>

            {sourceStudents.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                Tidak ada data santri pada rombel asal terpilih.
              </div>
            ) : (
              <div className="overflow-x-auto max-h-72 overflow-y-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3 w-10 text-center">Pilih</th>
                      <th className="py-2.5 px-3">Nama Santri</th>
                      <th className="py-2.5 px-3">NISN</th>
                      <th className="py-2.5 px-3">Status Kenaikan</th>
                      <th className="py-2.5 px-3 text-center">Rata-rata Nilai</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sourceStudents.map((st) => {
                      const isChecked = selectedStudentIds.includes(st.id);
                      return (
                        <tr
                          key={st.id}
                          className={`hover:bg-slate-50 cursor-pointer ${
                            isChecked ? 'bg-emerald-50/30' : 'bg-slate-50/50 opacity-60'
                          }`}
                          onClick={() => handleToggleStudent(st.id)}
                        >
                          <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleStudent(st.id)}
                              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                            />
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-bold text-slate-900">{st.name}</span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                            {st.nisn || '-'}
                          </td>
                          <td className="py-2.5 px-3">
                            {isChecked ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                <Check className="w-3 h-3 text-emerald-600" />
                                Naik ke {toClass?.name}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                                Tinggal di {fromClass?.name}
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-center font-bold text-emerald-900">
                            92.4
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500">
            Riwayat mutasi rombel bertipe <strong>"KENAIKAN"</strong> akan otomatis tersimpan di buku induk digital.
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleExecutePromotion}
              disabled={selectedStudentIds.length === 0}
              className="w-full sm:w-auto px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-800/20 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Eksekusi Promosi Massal ({selectedStudentIds.length} Santri)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
