import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  Award,
  BookOpen,
  Users,
  Edit2,
  Save,
  CheckCircle2,
  X,
  FileSpreadsheet,
  Printer,
  Download,
  ExternalLink,
  FileText,
  Settings2,
  HelpCircle,
} from 'lucide-react';
import { AcademicGrade } from '../../types/lms';
import {
  downloadRaporDocument,
  openRaporPrintWindow,
  safeTriggerPrint,
  RaporPrintData,
} from '../../utils/raporPrintHelper';

export const PenilaianRapor: React.FC = () => {
  const { grades, subjects, classes, users, updateGrade } = useLMS();

  const [selectedSubjectId, setSelectedSubjectId] = useState('sb-3'); // Fikih
  const [selectedClassId, setSelectedClassId] = useState('c-5a');
  const [editingGrade, setEditingGrade] = useState<AcademicGrade | null>(null);
  const [isSuccessToast, setIsSuccessToast] = useState(false);

  // Rapor Cetak Modal State
  const [studentRaporToPrint, setStudentRaporToPrint] = useState<{
    id: string;
    name: string;
    nisn: string;
    className: string;
  } | null>(null);

  const [paperSize, setPaperSize] = useState<'A4' | 'F4'>('A4');
  const [selectedSemester, setSelectedSemester] = useState<'Ganjil' | 'Genap'>('Genap');
  const [showKop, setShowKop] = useState(true);
  const [showStamp, setShowStamp] = useState(true);
  const [showCatatan, setShowCatatan] = useState(true);
  const [isLedgerPrintOpen, setIsLedgerPrintOpen] = useState(false);
  const [raporToastNotice, setRaporToastNotice] = useState<string | null>(null);

  // Form edit fields
  const [editForm, setEditForm] = useState({
    nilaiTugas: 90,
    nilaiUTS: 90,
    nilaiUAS: 90,
    capaianKompetensi: '',
  });

  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];
  const selectedClass = classes.find((c) => c.id === selectedClassId) || classes[0];

  const currentGrades = grades.filter(
    (g) => g.subjectId === selectedSubjectId && (g.classId === selectedClassId || selectedClassId === 'c-5a')
  );

  const handleOpenEdit = (g: AcademicGrade) => {
    setEditingGrade(g);
    setEditForm({
      nilaiTugas: g.nilaiTugas,
      nilaiUTS: g.nilaiUTS,
      nilaiUAS: g.nilaiUAS,
      capaianKompetensi: g.capaianKompetensi,
    });
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGrade) {
      updateGrade(editingGrade.id, {
        nilaiTugas: Number(editForm.nilaiTugas),
        nilaiUTS: Number(editForm.nilaiUTS),
        nilaiUAS: Number(editForm.nilaiUAS),
        capaianKompetensi: editForm.capaianKompetensi,
      });

      setEditingGrade(null);
      setIsSuccessToast(true);
      setTimeout(() => setIsSuccessToast(false), 3000);
    }
  };

  // Helper to construct RaporPrintData for any student
  const getStudentRaporPayload = (student: { id: string; name: string; nisn: string; className: string }): RaporPrintData => {
    const studentGrades = grades.filter(
      (g) => g.studentId === student.id || g.studentName === student.name
    );

    const baseStandardGrades: AcademicGrade[] = [
      {
        id: `sg-1-${student.id}`,
        studentId: student.id,
        studentName: student.name,
        studentNisn: student.nisn || '0098765432',
        classId: selectedClass.id,
        className: selectedClass.name,
        subjectId: 'sb-1',
        subjectName: "Al-Qur'an Hadis",
        semester: selectedSemester,
        academicYear: '2024/2025',
        nilaiTugas: 94,
        nilaiUTS: 92,
        nilaiUAS: 95,
        nilaiAkhir: 94,
        predikat: 'A',
        capaianKompetensi:
          'Sangat baik dalam melafalkan dan menerapkan hukum bacaan mim sukun serta menghafal hadits keutamaan sedekah.',
      },
      {
        id: `sg-2-${student.id}`,
        studentId: student.id,
        studentName: student.name,
        studentNisn: student.nisn || '0098765432',
        classId: selectedClass.id,
        className: selectedClass.name,
        subjectId: 'sb-2',
        subjectName: 'Akidah Akhlak',
        semester: selectedSemester,
        academicYear: '2024/2025',
        nilaiTugas: 90,
        nilaiUTS: 88,
        nilaiUAS: 92,
        nilaiAkhir: 90,
        predikat: 'A',
        capaianKompetensi:
          'Sangat menguasai pemahaman asmaul husna Al-Qawiyyu dan Al-Qayyum serta adab bertamu.',
      },
      {
        id: `sg-3-${student.id}`,
        studentId: student.id,
        studentName: student.name,
        studentNisn: student.nisn || '0098765432',
        classId: selectedClass.id,
        className: selectedClass.name,
        subjectId: 'sb-3',
        subjectName: 'Fikih',
        semester: selectedSemester,
        academicYear: '2024/2025',
        nilaiTugas: 95,
        nilaiUTS: 90,
        nilaiUAS: 94,
        nilaiAkhir: 93,
        predikat: 'A',
        capaianKompetensi:
          'Memiliki penguasaan istimewa dalam tata cara shalat sunnah rawatib dan shalat dhuha.',
      },
      {
        id: `sg-4-${student.id}`,
        studentId: student.id,
        studentName: student.name,
        studentNisn: student.nisn || '0098765432',
        classId: selectedClass.id,
        className: selectedClass.name,
        subjectId: 'sb-4',
        subjectName: 'Sejarah Kebudayaan Islam (SKI)',
        semester: selectedSemester,
        academicYear: '2024/2025',
        nilaiTugas: 88,
        nilaiUTS: 86,
        nilaiUAS: 89,
        nilaiAkhir: 88,
        predikat: 'B',
        capaianKompetensi:
          'Memahami peristiwa Fathu Makkah dan keteladanan sifat pemaaf Rasulullah SAW dengan baik.',
      },
      {
        id: `sg-5-${student.id}`,
        studentId: student.id,
        studentName: student.name,
        studentNisn: student.nisn || '0098765432',
        classId: selectedClass.id,
        className: selectedClass.name,
        subjectId: 'sb-5',
        subjectName: 'Bahasa Arab',
        semester: selectedSemester,
        academicYear: '2024/2025',
        nilaiTugas: 86,
        nilaiUTS: 85,
        nilaiUAS: 88,
        nilaiAkhir: 86,
        predikat: 'B',
        capaianKompetensi:
          'Mampu menyusun kalimat sederhana bertemakan jam dan kegiatan harian di madrasah.',
      },
      {
        id: `sg-6-${student.id}`,
        studentId: student.id,
        studentName: student.name,
        studentNisn: student.nisn || '0098765432',
        classId: selectedClass.id,
        className: selectedClass.name,
        subjectId: 'sb-6',
        subjectName: 'Matematika',
        semester: selectedSemester,
        academicYear: '2024/2025',
        nilaiTugas: 92,
        nilaiUTS: 90,
        nilaiUAS: 91,
        nilaiAkhir: 91,
        predikat: 'A',
        capaianKompetensi:
          'Sangat mahir menghitung pecahan biasa, desimal, dan perbandingan senilai.',
      },
      {
        id: `sg-7-${student.id}`,
        studentId: student.id,
        studentName: student.name,
        studentNisn: student.nisn || '0098765432',
        classId: selectedClass.id,
        className: selectedClass.name,
        subjectId: 'sb-7',
        subjectName: 'IPAS (Sains & Sosial)',
        semester: selectedSemester,
        academicYear: '2024/2025',
        nilaiTugas: 89,
        nilaiUTS: 87,
        nilaiUAS: 89,
        nilaiAkhir: 88,
        predikat: 'B',
        capaianKompetensi:
          'Baik dalam mengidentifikasi organ peredaran darah manusia dan ekosistem alam.',
      },
      {
        id: `sg-8-${student.id}`,
        studentId: student.id,
        studentName: student.name,
        studentNisn: student.nisn || '0098765432',
        classId: selectedClass.id,
        className: selectedClass.name,
        subjectId: 'sb-8',
        subjectName: 'Bahasa Indonesia',
        semester: selectedSemester,
        academicYear: '2024/2025',
        nilaiTugas: 91,
        nilaiUTS: 93,
        nilaiUAS: 92,
        nilaiAkhir: 92,
        predikat: 'A',
        capaianKompetensi:
          'Mampu menemukan ide pokok teks eksplanasi dan menyajikan ringkasan secara runtut.',
      },
    ];

    const effectiveGrades = baseStandardGrades.map((bg) => {
      const match = studentGrades.find((sg) => sg.subjectId === bg.subjectId);
      return match || bg;
    });

    return {
      student: {
        id: student.id,
        name: student.name,
        nisn: student.nisn || '0098765432',
        className: student.className || selectedClass.name,
        fase: 'Fase C',
      },
      semester: selectedSemester,
      academicYear: '2024/2025',
      paperSize,
      grades: effectiveGrades,
      options: {
        showKop,
        showStamp,
        showCatatan,
      },
    };
  };

  const handleOpenPrintRapor = (g: AcademicGrade) => {
    setStudentRaporToPrint({
      id: g.studentId,
      name: g.studentName,
      nisn: g.studentNisn,
      className: g.className,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="no-print pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-emerald-700" />
            <span>Penilaian & Rapor Santri</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Input Nilai Harian, UTS, UAS, Cetak Rapor Digital Madrasah (RDM), dan Ledger Nilai Rombel
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Button Cetak Ledger Nilai */}
          <button
            onClick={() => setIsLedgerPrintOpen(true)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors border border-slate-300 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Cetak Ledger Nilai</span>
          </button>

          {/* Button Cetak Rapor Rombel (quick first student or modal) */}
          <button
            onClick={() => {
              if (currentGrades.length > 0) {
                handleOpenPrintRapor(currentGrades[0]);
              } else {
                setStudentRaporToPrint({
                  id: 'user-siswa-1',
                  name: 'Ahmad Zaki Ramadhan',
                  nisn: '0098765432',
                  className: selectedClass.name,
                });
              }
            }}
            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>Cetak Rapor Santri (RDM)</span>
          </button>
        </div>
      </div>

      {isSuccessToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Nilai berhasil disimpan dan terintegrasi otomatis ke Rapor Digital Madrasah (RDM)!</span>
        </div>
      )}

      {/* Filter Selector */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Pilih Mata Pelajaran:
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-800 outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code}) - KKM: {s.kkm}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Pilih Rombel / Kelas:
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-800 outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-slate-500">Bobot Rapor Kemenag:</span>
          <div className="text-xs font-bold text-slate-800">
            Tugas (30%) + UTS (30%) + UAS (40%)
          </div>
        </div>
      </div>

      {/* Grade Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase text-[10px] font-semibold">
              <tr>
                <th className="py-3 px-4">Santri</th>
                <th className="py-3 px-4 font-mono">NISN</th>
                <th className="py-3 px-4 text-center">Nilai Harian / Tugas (30%)</th>
                <th className="py-3 px-4 text-center">Nilai UTS (30%)</th>
                <th className="py-3 px-4 text-center">Nilai UAS (40%)</th>
                <th className="py-3 px-4 text-center font-bold">Nilai Akhir</th>
                <th className="py-3 px-4 text-center">Predikat</th>
                <th className="py-3 px-4">Deskripsi Capaian Kompetensi</th>
                <th className="py-3 px-4 text-center">Aksi Penilaian & Rapor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentGrades.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    Belum ada ledger nilai untuk kelas dan mapel ini.
                  </td>
                </tr>
              ) : (
                currentGrades.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{g.studentName}</div>
                      <span className="text-[10px] text-slate-400">{g.className}</span>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-600">{g.studentNisn}</td>

                    <td className="py-3 px-4 text-center font-semibold text-slate-800">
                      {g.nilaiTugas}
                    </td>

                    <td className="py-3 px-4 text-center font-semibold text-slate-800">
                      {g.nilaiUTS}
                    </td>

                    <td className="py-3 px-4 text-center font-semibold text-slate-800">
                      {g.nilaiUAS}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="font-black text-sm text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                        {g.nilaiAkhir}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          g.predikat === 'A'
                            ? 'bg-emerald-100 text-emerald-800'
                            : g.predikat === 'B'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {g.predikat}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-600 text-[11px] max-w-xs leading-snug">
                      {g.capaianKompetensi}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(g)}
                          className="px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-lg inline-flex items-center gap-1 transition-colors cursor-pointer"
                          title="Input Nilai Tugas, UTS, UAS, dan Deskripsi Capaian"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Input</span>
                        </button>

                        <button
                          onClick={() => handleOpenPrintRapor(g)}
                          className="px-2.5 py-1 text-xs font-bold text-amber-800 hover:text-amber-950 bg-amber-100 hover:bg-amber-200 rounded-lg inline-flex items-center gap-1 transition-colors cursor-pointer"
                          title="Cetak Rapor Digital Kemenag untuk santri ini"
                        >
                          <Printer className="w-3 h-3 text-amber-700" />
                          <span>Cetak Rapor</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Input Nilai */}
      {editingGrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Input Nilai & Capaian</span>
                <h3 className="text-sm font-bold text-slate-900">{editingGrade.studentName}</h3>
              </div>
              <button onClick={() => setEditingGrade(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveGrade} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nilai Tugas</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={editForm.nilaiTugas}
                    onChange={(e) => setEditForm({ ...editForm, nilaiTugas: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nilai UTS</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={editForm.nilaiUTS}
                    onChange={(e) => setEditForm({ ...editForm, nilaiUTS: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nilai UAS</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={editForm.nilaiUAS}
                    onChange={(e) => setEditForm({ ...editForm, nilaiUAS: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Deskripsi Capaian Kompetensi (Rapor Kemenag)
                </label>
                <textarea
                  rows={3}
                  value={editForm.capaianKompetensi}
                  onChange={(e) => setEditForm({ ...editForm, capaianKompetensi: e.target.value })}
                  placeholder="Deskripsi pencapaian kompetensi santri pada semester ini..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingGrade(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Simpan Nilai Rapor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Cetak Rapor Santri (RDM) */}
      {studentRaporToPrint && (() => {
        const payload = getStudentRaporPayload(studentRaporToPrint);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-2 sm:p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
              {/* Modal Top Header with Actions */}
              <div className="p-4 bg-emerald-900 text-white flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-amber-300">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">
                      Cetak Rapor Digital — {studentRaporToPrint.name}
                    </h3>
                    <p className="text-[10px] text-emerald-200">
                      Rombel: {studentRaporToPrint.className} • NISN: {studentRaporToPrint.nisn}
                    </p>
                  </div>
                </div>

                {/* Print Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      downloadRaporDocument(payload);
                      setRaporToastNotice(
                        `Berkas Rapor "${studentRaporToPrint.name}" berhasil diunduh. Buka file di browser untuk Simpan sebagai PDF (Ctrl+P)!`
                      );
                    }}
                    className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 border border-emerald-600 shadow-xs cursor-pointer transition-colors"
                    title="Unduh file HTML mandiri yang siap cetak & simpan PDF di browser"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Dokumen (PDF)</span>
                  </button>

                  <button
                    onClick={() => {
                      openRaporPrintWindow(payload);
                    }}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                    title="Buka lembar cetak di tab baru"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Tab Baru</span>
                  </button>

                  <button
                    onClick={() => {
                      safeTriggerPrint(() => {
                        setRaporToastNotice(
                          'Dialog print browser dibatasi dalam frame aplikasi. Silakan gunakan tombol "Unduh Dokumen (PDF)" atau "Tab Baru" untuk mencetak langsung!'
                        );
                      });
                    }}
                    className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak Sekarang</span>
                  </button>

                  <button
                    onClick={() => setStudentRaporToPrint(null)}
                    className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-emerald-800 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Toast Notice inside Modal if needed */}
              {raporToastNotice && (
                <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                  <span>{raporToastNotice}</span>
                  <button
                    onClick={() => setRaporToastNotice(null)}
                    className="text-emerald-700 font-bold underline ml-2 cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              )}

              {/* Sub-toolbar: Settings */}
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
                <div className="flex items-center gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mr-1.5">
                      Kertas:
                    </label>
                    <select
                      value={paperSize}
                      onChange={(e) => setPaperSize(e.target.value as 'A4' | 'F4')}
                      className="px-2 py-1 bg-white border border-slate-300 rounded-lg font-semibold text-slate-800 text-xs"
                    >
                      <option value="A4">A4 (210 x 297 mm)</option>
                      <option value="F4">F4 / Folio (215 x 330 mm)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mr-1.5">
                      Semester:
                    </label>
                    <select
                      value={selectedSemester}
                      onChange={(e) => setSelectedSemester(e.target.value as 'Ganjil' | 'Genap')}
                      className="px-2 py-1 bg-white border border-slate-300 rounded-lg font-semibold text-slate-800 text-xs"
                    >
                      <option value="Genap">Semester 2 (Genap)</option>
                      <option value="Ganjil">Semester 1 (Ganjil)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-700">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showKop}
                      onChange={(e) => setShowKop(e.target.checked)}
                      className="rounded text-emerald-600"
                    />
                    <span>Kop Madrasah</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showStamp}
                      onChange={(e) => setShowStamp(e.target.checked)}
                      className="rounded text-emerald-600"
                    />
                    <span>Stempel & TTD</span>
                  </label>
                </div>
              </div>

              {/* Modal Sheet Preview Scrollable */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-slate-100">
                <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 sm:p-10 max-w-3xl mx-auto space-y-5 text-slate-900 text-xs">
                  {showKop && (
                    <div className="border-b-4 border-double border-emerald-900 pb-3 text-center space-y-1">
                      <div className="font-arabic text-emerald-900 text-lg font-bold">
                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                      </div>
                      <h2 className="text-xs sm:text-sm font-black text-slate-900 uppercase">
                        KEMENTERIAN AGAMA REPUBLIK INDONESIA
                      </h2>
                      <h1 className="text-sm sm:text-base font-black text-emerald-950 uppercase">
                        MADRASAH IBTIDAIYAH ASSUYUTIYAH
                      </h1>
                      <p className="text-[10px] text-slate-500">
                        NSM: 111232010045 • NPSN: 60728912 • Terakreditasi "A" (Unggul)
                      </p>
                    </div>
                  )}

                  <div className="text-center">
                    <h3 className="text-xs font-black text-slate-900 tracking-wider uppercase underline">
                      LAPORAN HASIL BELAJAR PESERTA DIDIK (RAPOR DIGITAL)
                    </h3>
                    <p className="text-[10px] text-slate-500">
                      Kurikulum Merdeka Madrasah — Tahun Pelajaran 2024/2025 (Semester {selectedSemester})
                    </p>
                  </div>

                  {/* Student identity box */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px]">
                    <div>
                      <div>Nama: <strong>{studentRaporToPrint.name}</strong></div>
                      <div>NISN: <span className="font-mono">{studentRaporToPrint.nisn}</span></div>
                    </div>
                    <div>
                      <div>Kelas: <strong>{studentRaporToPrint.className}</strong> (Fase C)</div>
                      <div>Madrasah: <strong>MI Assuyutiyah</strong></div>
                    </div>
                  </div>

                  {/* Table summary of grades */}
                  <table className="w-full text-left border border-slate-300 text-[10px]">
                    <thead className="bg-emerald-900 text-white font-bold">
                      <tr>
                        <th className="p-1.5 text-center w-8">No</th>
                        <th className="p-1.5">Mata Pelajaran</th>
                        <th className="p-1.5 text-center w-12">KKTP</th>
                        <th className="p-1.5 text-center w-12">Nilai</th>
                        <th className="p-1.5 text-center w-12">Predikat</th>
                        <th className="p-1.5">Capaian Kompetensi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {payload.grades.map((sb, idx) => (
                        <tr key={sb.id} className="hover:bg-slate-50">
                          <td className="p-1.5 text-center border-r font-mono">{idx + 1}</td>
                          <td className="p-1.5 border-r font-bold">{sb.subjectName}</td>
                          <td className="p-1.5 text-center border-r text-slate-500">75</td>
                          <td className="p-1.5 text-center border-r font-bold text-emerald-800">{sb.nilaiAkhir}</td>
                          <td className="p-1.5 text-center border-r font-bold">{sb.predikat}</td>
                          <td className="p-1.5 text-slate-600 text-[9px] leading-tight">{sb.capaianKompetensi}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Decision */}
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 text-center">
                    <p className="text-[10px] text-slate-600 font-semibold uppercase">
                      Keputusan Rapat Dewan Asatidz:
                    </p>
                    <p className="text-xs font-black text-emerald-950 mt-0.5">
                      Dinyatakan NAIK KE KELAS 6 (ENAM)
                    </p>
                  </div>

                  {/* Signatures */}
                  {showStamp && (
                    <div className="pt-4 grid grid-cols-3 text-center text-[10px]">
                      <div>
                        <p className="text-slate-500">Orang Tua / Wali,</p>
                        <div className="h-10"></div>
                        <p className="font-bold underline">H. Bambang Sudirman</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Wali Kelas,</p>
                        <div className="h-10 flex items-center justify-center font-arabic text-emerald-800 font-bold">
                          ختم الإجازة
                        </div>
                        <p className="font-bold underline">Usth. Siti Fatimah, S.Pd.I</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Kepala Madrasah,</p>
                        <div className="h-10 flex items-center justify-center font-arabic text-emerald-800 font-bold">
                          ختم المدرسة
                        </div>
                        <p className="font-bold underline">Ust. H. Muhammad Ilyas, S.Pd.I</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Modal Cetak Ledger Nilai Rombel */}
      {isLedgerPrintOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 bg-emerald-900 text-white flex items-center justify-between shrink-0">
              <span className="text-sm font-bold flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-amber-300" />
                Cetak Ledger Nilai Kelas {selectedClass.name} — Mapel {selectedSubject.name}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => safeTriggerPrint()}
                  className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Ledger</span>
                </button>
                <button
                  onClick={() => setIsLedgerPrintOpen(false)}
                  className="p-1 text-white hover:text-slate-300 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs text-slate-900">
              <div className="border-b-2 border-double border-emerald-900 pb-3 text-center">
                <h3 className="font-black text-sm uppercase">BUKU LEDGER REKAPITULASI PENILAIAN HASIL BELAJAR</h3>
                <h4 className="font-bold text-xs text-emerald-900">MI ASSUYUTIYAH SUKAMAJU</h4>
                <p className="text-[10px] text-slate-500">
                  Rombel: {selectedClass.name} • Mata Pelajaran: {selectedSubject.name} • Tahun Pelajaran 2024/2025
                </p>
              </div>

              <table className="w-full text-left border border-slate-300 text-[11px]">
                <thead className="bg-slate-100 text-slate-800 font-bold">
                  <tr>
                    <th className="p-2 border text-center w-8">No</th>
                    <th className="p-2 border">Nama Santri</th>
                    <th className="p-2 border text-center font-mono">NISN</th>
                    <th className="p-2 border text-center">Tugas (30%)</th>
                    <th className="p-2 border text-center">UTS (30%)</th>
                    <th className="p-2 border text-center">UAS (40%)</th>
                    <th className="p-2 border text-center">Nilai Akhir</th>
                    <th className="p-2 border text-center">Predikat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {currentGrades.map((g, idx) => (
                    <tr key={g.id}>
                      <td className="p-2 border text-center font-mono">{idx + 1}</td>
                      <td className="p-2 border font-bold">{g.studentName}</td>
                      <td className="p-2 border text-center font-mono">{g.studentNisn}</td>
                      <td className="p-2 border text-center">{g.nilaiTugas}</td>
                      <td className="p-2 border text-center">{g.nilaiUTS}</td>
                      <td className="p-2 border text-center">{g.nilaiUAS}</td>
                      <td className="p-2 border text-center font-bold text-emerald-800">{g.nilaiAkhir}</td>
                      <td className="p-2 border text-center font-bold">{g.predikat}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pt-6 grid grid-cols-2 text-center text-xs">
                <div>
                  <p className="text-slate-500">Guru Pengampu Mata Pelajaran,</p>
                  <div className="h-14"></div>
                  <p className="font-bold underline">Usth. Siti Fatimah, S.Pd.I</p>
                  <p className="text-[10px] text-slate-400">NIP. 198506242010012008</p>
                </div>
                <div>
                  <p className="text-slate-500">Wali Kelas {selectedClass.name},</p>
                  <div className="h-14"></div>
                  <p className="font-bold underline">Ust. Ahmad Baihaqi, S.Pd</p>
                  <p className="text-[10px] text-slate-400">NIP. 198803152012011005</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
