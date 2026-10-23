import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  FileText,
  Printer,
  Download,
  Award,
  CheckCircle,
  BookOpen,
  ExternalLink,
  Settings2,
  AlertCircle,
  ChevronDown,
  User as UserIcon,
  HelpCircle,
} from 'lucide-react';
import { AcademicGrade, User } from '../../types/lms';
import {
  downloadRaporDocument,
  openRaporPrintWindow,
  safeTriggerPrint,
  RaporPrintData,
} from '../../utils/raporPrintHelper';

export const RaporAkademik: React.FC = () => {
  const { currentUser, grades, users, classes } = useLMS();

  // All student users
  const studentsList = users.filter((u) => u.role === 'SISWA');

  // Selected student
  const defaultStudentId =
    currentUser?.role === 'SISWA' ? currentUser.id : studentsList[0]?.id || 'user-siswa-1';
  const [selectedStudentId, setSelectedStudentId] = useState<string>(defaultStudentId);
  const [selectedSemester, setSelectedSemester] = useState<'Ganjil' | 'Genap'>('Genap');
  const [academicYear, setAcademicYear] = useState('2024/2025');
  const [paperSize, setPaperSize] = useState<'A4' | 'F4'>('A4');

  // Options
  const [showKop, setShowKop] = useState(true);
  const [showStamp, setShowStamp] = useState(true);
  const [showCatatan, setShowCatatan] = useState(true);

  // Toast / help modal
  const [printNotice, setPrintNotice] = useState<string | null>(null);

  // Active student object
  const activeStudent: User =
    studentsList.find((s) => s.id === selectedStudentId) ||
    currentUser || {
      id: 'user-siswa-1',
      username: 'zaki',
      role: 'SISWA',
      email: 'zaki@siswa.mi-assuyutiyah.sch.id',
      avatar: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=150&auto=format&fit=crop&q=80',
      name: 'Ahmad Zaki Ramadhan',
      nisn: '0098765432',
      classId: 'c-5a',
      className: 'Kelas 5A',
      parentName: 'H. Bambang Sudirman',
    };

  // Find all grades for this student or synthesize complete standard curriculum grades
  const studentGradesFromStore = grades.filter(
    (g) => g.studentId === activeStudent.id || g.studentName === activeStudent.name
  );

  // If student only has partial grades, provide standard curriculum grades
  const baseStandardGrades: AcademicGrade[] = [
    {
      id: `sg-1-${activeStudent.id}`,
      studentId: activeStudent.id,
      studentName: activeStudent.name,
      studentNisn: activeStudent.nisn || '0098765432',
      classId: activeStudent.classId || 'c-5a',
      className: activeStudent.className || 'Kelas 5A',
      subjectId: 'sb-1',
      subjectName: "Al-Qur'an Hadis",
      semester: selectedSemester,
      academicYear,
      nilaiTugas: 94,
      nilaiUTS: 92,
      nilaiUAS: 95,
      nilaiAkhir: 94,
      predikat: 'A',
      capaianKompetensi:
        'Sangat baik dalam melafalkan dan menerapkan hukum bacaan mim sukun serta menghafal hadits keutamaan sedekah.',
    },
    {
      id: `sg-2-${activeStudent.id}`,
      studentId: activeStudent.id,
      studentName: activeStudent.name,
      studentNisn: activeStudent.nisn || '0098765432',
      classId: activeStudent.classId || 'c-5a',
      className: activeStudent.className || 'Kelas 5A',
      subjectId: 'sb-2',
      subjectName: 'Akidah Akhlak',
      semester: selectedSemester,
      academicYear,
      nilaiTugas: 90,
      nilaiUTS: 88,
      nilaiUAS: 92,
      nilaiAkhir: 90,
      predikat: 'A',
      capaianKompetensi:
        'Sangat menguasai pemahaman asmaul husna Al-Qawiyyu dan Al-Qayyum serta adab bertamu.',
    },
    {
      id: `sg-3-${activeStudent.id}`,
      studentId: activeStudent.id,
      studentName: activeStudent.name,
      studentNisn: activeStudent.nisn || '0098765432',
      classId: activeStudent.classId || 'c-5a',
      className: activeStudent.className || 'Kelas 5A',
      subjectId: 'sb-3',
      subjectName: 'Fikih',
      semester: selectedSemester,
      academicYear,
      nilaiTugas: 95,
      nilaiUTS: 90,
      nilaiUAS: 94,
      nilaiAkhir: 93,
      predikat: 'A',
      capaianKompetensi:
        'Memiliki penguasaan istimewa dalam tata cara shalat sunnah rawatib dan shalat dhuha.',
    },
    {
      id: `sg-4-${activeStudent.id}`,
      studentId: activeStudent.id,
      studentName: activeStudent.name,
      studentNisn: activeStudent.nisn || '0098765432',
      classId: activeStudent.classId || 'c-5a',
      className: activeStudent.className || 'Kelas 5A',
      subjectId: 'sb-4',
      subjectName: 'Sejarah Kebudayaan Islam (SKI)',
      semester: selectedSemester,
      academicYear,
      nilaiTugas: 88,
      nilaiUTS: 86,
      nilaiUAS: 89,
      nilaiAkhir: 88,
      predikat: 'B',
      capaianKompetensi:
        'Memahami peristiwa Fathu Makkah dan keteladanan sifat pemaaf Rasulullah SAW dengan baik.',
    },
    {
      id: `sg-5-${activeStudent.id}`,
      studentId: activeStudent.id,
      studentName: activeStudent.name,
      studentNisn: activeStudent.nisn || '0098765432',
      classId: activeStudent.classId || 'c-5a',
      className: activeStudent.className || 'Kelas 5A',
      subjectId: 'sb-5',
      subjectName: 'Bahasa Arab',
      semester: selectedSemester,
      academicYear,
      nilaiTugas: 86,
      nilaiUTS: 85,
      nilaiUAS: 88,
      nilaiAkhir: 86,
      predikat: 'B',
      capaianKompetensi:
        'Mampu menyusun kalimat sederhana bertemakan jam dan kegiatan harian di madrasah.',
    },
    {
      id: `sg-6-${activeStudent.id}`,
      studentId: activeStudent.id,
      studentName: activeStudent.name,
      studentNisn: activeStudent.nisn || '0098765432',
      classId: activeStudent.classId || 'c-5a',
      className: activeStudent.className || 'Kelas 5A',
      subjectId: 'sb-6',
      subjectName: 'Matematika',
      semester: selectedSemester,
      academicYear,
      nilaiTugas: 92,
      nilaiUTS: 90,
      nilaiUAS: 91,
      nilaiAkhir: 91,
      predikat: 'A',
      capaianKompetensi:
        'Sangat mahir menghitung pecahan biasa, desimal, dan perbandingan senilai.',
    },
    {
      id: `sg-7-${activeStudent.id}`,
      studentId: activeStudent.id,
      studentName: activeStudent.name,
      studentNisn: activeStudent.nisn || '0098765432',
      classId: activeStudent.classId || 'c-5a',
      className: activeStudent.className || 'Kelas 5A',
      subjectId: 'sb-7',
      subjectName: 'IPAS (Sains & Sosial)',
      semester: selectedSemester,
      academicYear,
      nilaiTugas: 89,
      nilaiUTS: 87,
      nilaiUAS: 89,
      nilaiAkhir: 88,
      predikat: 'B',
      capaianKompetensi:
        'Baik dalam mengidentifikasi organ peredaran darah manusia dan ekosistem alam.',
    },
    {
      id: `sg-8-${activeStudent.id}`,
      studentId: activeStudent.id,
      studentName: activeStudent.name,
      studentNisn: activeStudent.nisn || '0098765432',
      classId: activeStudent.classId || 'c-5a',
      className: activeStudent.className || 'Kelas 5A',
      subjectId: 'sb-8',
      subjectName: 'Bahasa Indonesia',
      semester: selectedSemester,
      academicYear,
      nilaiTugas: 91,
      nilaiUTS: 93,
      nilaiUAS: 92,
      nilaiAkhir: 92,
      predikat: 'A',
      capaianKompetensi:
        'Mampu menemukan ide pokok teks eksplanasi dan menyajikan ringkasan secara runtut.',
    },
  ];

  // Merge store grades with base standard so all subjects always appear
  const effectiveGrades: AcademicGrade[] = baseStandardGrades.map((baseG) => {
    const existing = studentGradesFromStore.find((eg) => eg.subjectId === baseG.subjectId);
    return existing || baseG;
  });

  const paiSubjects = effectiveGrades.filter(
    (g) =>
      g.subjectName.toLowerCase().includes("qur'an") ||
      g.subjectName.toLowerCase().includes('akidah') ||
      g.subjectName.toLowerCase().includes('fikih') ||
      g.subjectName.toLowerCase().includes('ski') ||
      g.subjectName.toLowerCase().includes('arab')
  );

  const umumSubjects = effectiveGrades.filter(
    (g) => !paiSubjects.some((p) => p.id === g.id)
  );

  const averageFinalScore =
    effectiveGrades.length > 0
      ? Math.round(
          effectiveGrades.reduce((acc, curr) => acc + curr.nilaiAkhir, 0) / effectiveGrades.length
        )
      : 90;

  // Print data payload
  const currentRaporData: RaporPrintData = {
    student: {
      id: activeStudent.id,
      name: activeStudent.name,
      nisn: activeStudent.nisn || '0098765432',
      className: activeStudent.className || 'Kelas 5A',
      fase: 'Fase C',
    },
    semester: selectedSemester,
    academicYear,
    paperSize,
    grades: effectiveGrades,
    attendance: { sakit: 1, izin: 1, alpa: 0 },
    options: {
      showKop,
      showStamp,
      showCatatan,
    },
  };

  const handlePrintDirect = () => {
    safeTriggerPrint(() => {
      // If direct print fails in iframe sandbox:
      setPrintNotice(
        'Karena sistem berjalan dalam frame aman, gunakan tombol "Unduh Dokumen Rapor" atau "Buka di Tab Baru" untuk mencetak/menyimpan PDF secara instan!'
      );
    });
  };

  const handleDownloadRapor = () => {
    downloadRaporDocument(currentRaporData);
    setPrintNotice(
      `Berkas Rapor Digital "${activeStudent.name}" berhasil diunduh. Buka berkas di Google Chrome / Edge dan pilih Simpan sebagai PDF (Ctrl+P)!`
    );
  };

  const handleOpenNewTab = () => {
    const opened = openRaporPrintWindow(currentRaporData);
    if (!opened) {
      setPrintNotice(
        'Jendela baru diblokir oleh browser. Berkas HTML Rapor Digital telah diunduh otomatis ke perangkat Anda.'
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Download Action */}
      <div className="no-print pb-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-700" />
            <span>Rapor Digital Akademik Santri (RDM)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Format Resmi Standar Kementerian Agama RI — Cetak Kertas & Unduh PDF Rapor Digital
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Download HTML/PDF Button */}
          <button
            onClick={handleDownloadRapor}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
            title="Unduh berkas rapor mandiri yang dapat dibuka dan disimpan PDF di Chrome/Edge"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Berkas Rapor (PDF/Cetak)</span>
          </button>

          {/* Open New Tab Print Window */}
          <button
            onClick={handleOpenNewTab}
            className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
            title="Buka lembar cetak di tab baru bebas iframe"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Buka di Tab Baru</span>
          </button>

          {/* Direct Print Button */}
          <button
            onClick={handlePrintDirect}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-md shadow-amber-600/20 transition-all cursor-pointer"
            title="Cetak langsung menggunakan dialog print browser"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Langsung (Print)</span>
          </button>
        </div>
      </div>

      {/* Information Banner if iframe alert exists */}
      {printNotice && (
        <div className="no-print p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start justify-between gap-3 text-xs text-emerald-900 animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Informasi Pencetakan Rapor Digital:</p>
              <p className="mt-0.5 text-emerald-800 leading-relaxed">{printNotice}</p>
            </div>
          </div>
          <button
            onClick={() => setPrintNotice(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold underline shrink-0 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Control Panel: Student Selector, Semester, Paper & Options */}
      <div className="no-print bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Settings2 className="w-4 h-4 text-emerald-700" /> Pengaturan Cetak & Pilihan Santri
          </span>
          <span className="text-[11px] text-slate-500">
            Total {effectiveGrades.length} Mata Pelajaran Terdata
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Student Selector */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Pilih Santri / Siswa:
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-hidden"
            >
              {studentsList.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.className || 'Kelas 5A'}) - NISN: {st.nisn || '-'}
                </option>
              ))}
            </select>
          </div>

          {/* Semester Selector */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Semester:
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value as 'Ganjil' | 'Genap')}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-hidden"
            >
              <option value="Genap">Semester 2 (Genap) - Kenaikan Kelas</option>
              <option value="Ganjil">Semester 1 (Ganjil) - Tengah Tahun</option>
            </select>
          </div>

          {/* Paper Size */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Format Kertas Cetak:
            </label>
            <select
              value={paperSize}
              onChange={(e) => setPaperSize(e.target.value as 'A4' | 'F4')}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-hidden"
            >
              <option value="A4">A4 (210 x 297 mm) — Standar Internasional</option>
              <option value="F4">F4 / Folio (215 x 330 mm) — Standar Kemenag</option>
            </select>
          </div>

          {/* Toggle Switches */}
          <div className="flex flex-col justify-end gap-1.5 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={showKop}
                onChange={(e) => setShowKop(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Sertakan Kop Madrasah</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={showStamp}
                onChange={(e) => setShowStamp(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Sertakan Stempel Digital</span>
            </label>
          </div>
        </div>
      </div>

      {/* Official Print-Ready Report Card Sheet */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 max-w-4xl mx-auto space-y-6 text-slate-900 print:shadow-none print:border-none print:p-0">
        {/* Kop Madrasah */}
        {showKop && (
          <div className="border-b-4 border-double border-emerald-900 pb-4 text-center space-y-1">
            <div className="font-arabic text-emerald-900 text-xl font-bold">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
            <h2 className="text-sm sm:text-base font-black tracking-wider text-slate-900 uppercase">
              KEMENTERIAN AGAMA REPUBLIK INDONESIA
            </h2>
            <h1 className="text-base sm:text-xl font-black text-emerald-950 uppercase tracking-tight">
              MADRASAH IBTIDAIYAH ASSUYUTIYAH
            </h1>
            <p className="text-xs text-slate-600">
              NSM: 111232010045 • NPSN: 60728912 • Terakreditasi "A" (Unggul)
            </p>
            <p className="text-xs text-slate-500">
              Jl. Pesantren Assuyutiyah No. 15, Sukamaju • Email: info@mi-assuyutiyah.sch.id
            </p>
          </div>
        )}

        {/* Title Report */}
        <div className="text-center">
          <h3 className="text-sm font-black text-slate-900 tracking-wider uppercase underline underline-offset-4">
            LAPORAN HASIL BELAJAR PESERTA DIDIK (RAPOR DIGITAL)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Kurikulum Merdeka Madrasah — Tahun Pelajaran {academicYear} (Semester {selectedSemester})
          </p>
        </div>

        {/* Student Identity Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
          <div className="space-y-1.5">
            <div className="flex">
              <span className="w-32 text-slate-500">Nama Santri/Siswa</span>
              <span className="font-bold text-slate-900">: {activeStudent.name}</span>
            </div>
            <div className="flex">
              <span className="w-32 text-slate-500">Nomor Induk / NISN</span>
              <span className="font-mono font-bold text-slate-900">: {activeStudent.nisn || '0098765432'}</span>
            </div>
            <div className="flex">
              <span className="w-32 text-slate-500">Nama Madrasah</span>
              <span className="font-semibold text-slate-800">: MI Assuyutiyah</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex">
              <span className="w-32 text-slate-500">Kelas / Fase</span>
              <span className="font-bold text-slate-900">: {activeStudent.className || 'Kelas 5A'} (Fase C)</span>
            </div>
            <div className="flex">
              <span className="w-32 text-slate-500">Semester / TP</span>
              <span className="font-semibold text-slate-800">: {selectedSemester} / {academicYear}</span>
            </div>
            <div className="flex">
              <span className="w-32 text-slate-500">Rata-rata Nilai</span>
              <span className="font-bold text-emerald-800">: {averageFinalScore} (Predikat A)</span>
            </div>
          </div>
        </div>

        {/* Academic Grade Table */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
            A. Capaian Hasil Belajar Mata Pelajaran
          </h4>

          <div className="border border-slate-300 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-emerald-900 text-white font-bold text-[11px]">
                <tr>
                  <th className="p-2.5 w-10 text-center border-r border-emerald-800">No</th>
                  <th className="p-2.5 border-r border-emerald-800">Mata Pelajaran</th>
                  <th className="p-2.5 w-16 text-center border-r border-emerald-800">KKTP</th>
                  <th className="p-2.5 w-16 text-center border-r border-emerald-800">Nilai</th>
                  <th className="p-2.5 w-16 text-center border-r border-emerald-800">Predikat</th>
                  <th className="p-2.5">Capaian Kompetensi Kemenag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {/* Subheader Kelompok A */}
                <tr className="bg-slate-100 font-bold text-slate-700">
                  <td colSpan={6} className="p-2 px-3">
                    Kelompok A (Pendidikan Agama Islam & Bahasa Arab)
                  </td>
                </tr>
                {paiSubjects.map((sb, idx) => (
                  <tr key={sb.id} className="hover:bg-slate-50">
                    <td className="p-2 text-center border-r border-slate-200 font-mono">{idx + 1}</td>
                    <td className="p-2 border-r border-slate-200 font-bold text-slate-900">{sb.subjectName}</td>
                    <td className="p-2 text-center border-r border-slate-200 text-slate-500 font-medium">75</td>
                    <td className="p-2 text-center border-r border-slate-200 font-bold text-emerald-800">
                      {sb.nilaiAkhir}
                    </td>
                    <td className="p-2 text-center border-r border-slate-200 font-bold">{sb.predikat}</td>
                    <td className="p-2 text-slate-700 leading-snug text-[11px]">{sb.capaianKompetensi}</td>
                  </tr>
                ))}

                {/* Subheader Kelompok B */}
                <tr className="bg-slate-100 font-bold text-slate-700">
                  <td colSpan={6} className="p-2 px-3">
                    Kelompok B (Mata Pelajaran Umum)
                  </td>
                </tr>
                {umumSubjects.map((sb, idx) => (
                  <tr key={sb.id} className="hover:bg-slate-50">
                    <td className="p-2 text-center border-r border-slate-200 font-mono">
                      {paiSubjects.length + idx + 1}
                    </td>
                    <td className="p-2 border-r border-slate-200 font-bold text-slate-900">{sb.subjectName}</td>
                    <td className="p-2 text-center border-r border-slate-200 text-slate-500 font-medium">75</td>
                    <td className="p-2 text-center border-r border-slate-200 font-bold text-emerald-800">
                      {sb.nilaiAkhir}
                    </td>
                    <td className="p-2 text-center border-r border-slate-200 font-bold">{sb.predikat}</td>
                    <td className="p-2 text-slate-700 leading-snug text-[11px]">{sb.capaianKompetensi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ekstrakurikuler & Karakter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="border border-slate-300 rounded-xl p-3.5 space-y-2 bg-slate-50/50">
            <h5 className="font-bold text-slate-900 uppercase text-[11px]">
              B. Ekstrakurikuler & Kepribadian
            </h5>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span>1. Tahfidz Al-Qur'an (Juz 30):</span>
                <span className="font-bold text-emerald-800">A (Lancar & Mutqin)</span>
              </div>
              <div className="flex justify-between">
                <span>2. Pramuka Penggalang:</span>
                <span className="font-bold text-emerald-800">A (Aktif & Disiplin)</span>
              </div>
              <div className="flex justify-between">
                <span>3. Seni Hadroh Rebana:</span>
                <span className="font-bold text-emerald-800">B (Terampil)</span>
              </div>
              <div className="flex justify-between">
                <span>4. Kaligrafi Islam:</span>
                <span className="font-bold text-emerald-800">A (Rapi & Indah)</span>
              </div>
            </div>
          </div>

          <div className="border border-slate-300 rounded-xl p-3.5 space-y-2 bg-slate-50/50">
            <h5 className="font-bold text-slate-900 uppercase text-[11px]">
              C. Rekapitulasi Ketidakhadiran
            </h5>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span>Sakit (S):</span>
                <span className="font-bold">1 Hari</span>
              </div>
              <div className="flex justify-between">
                <span>Izin (I):</span>
                <span className="font-bold">1 Hari</span>
              </div>
              <div className="flex justify-between">
                <span>Tanpa Keterangan (A):</span>
                <span className="font-bold">0 Hari</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-1 mt-1">
                <span>Status Kehadiran:</span>
                <span className="font-bold text-emerald-800">Sangat Rajin (98%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Catatan Wali Kelas */}
        {showCatatan && (
          <div className="border border-slate-300 rounded-xl p-3 bg-slate-50/40 text-xs">
            <h5 className="font-bold text-emerald-900 uppercase text-[10px] mb-1">
              D. Catatan Wali Kelas & Karakter Santri:
            </h5>
            <p className="italic text-slate-700 text-[11px] leading-relaxed">
              "Ananda {activeStudent.name} menunjukkan akhlakul karimah yang sangat terpuji, konsisten dalam hafalan tahfidz dan shalat berjamaah. Pertahankan prestasi dan terus kembangkan bakat kepemimpinan."
            </p>
          </div>
        )}

        {/* Keputusan Kenaikan Kelas */}
        <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-300 text-center">
          <p className="text-xs text-slate-600 font-semibold uppercase tracking-wider">
            Keputusan Berdasarkan Rapat Dewan Asatidz:
          </p>
          <p className="text-base font-black text-emerald-950 mt-1">
            {selectedSemester === 'Genap'
              ? 'Dinyatakan NAIK KE KELAS 6 (ENAM)'
              : 'Dinyatakan MEMENUHI SYARAT EVALUASI TENGAH TAHUN'}
          </p>
        </div>

        {/* Tanda Tangan */}
        <div className="pt-6 grid grid-cols-3 text-center text-xs">
          <div>
            <p className="text-slate-500">Orang Tua / Wali Santri,</p>
            <div className="h-16"></div>
            <p className="font-bold text-slate-900 underline">
              {activeStudent.parentName || 'H. Bambang Sudirman'}
            </p>
            <p className="text-[10px] text-slate-400">Wali Santri</p>
          </div>

          <div>
            <p className="text-slate-500">Wali Kelas {activeStudent.className || '5A'},</p>
            <div className="h-16 flex items-center justify-center font-arabic text-emerald-800 font-bold">
              {showStamp && <span>ختم الإجازة</span>}
            </div>
            <p className="font-bold text-slate-900 underline">Usth. Siti Fatimah, S.Pd.I</p>
            <p className="text-[10px] text-slate-500">NIP. 198506242010012008</p>
          </div>

          <div>
            <p className="text-slate-500">Kepala Madrasah,</p>
            <div className="h-16 flex items-center justify-center font-arabic text-emerald-800 font-bold">
              {showStamp && <span>ختم المدرسة</span>}
            </div>
            <p className="font-bold text-slate-900 underline">Ust. H. Muhammad Ilyas, S.Pd.I</p>
            <p className="text-[10px] text-slate-500">NIP. 197904122005011004</p>
          </div>
        </div>
      </div>

      {/* Guide Card at Bottom */}
      <div className="no-print bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 max-w-4xl mx-auto flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-slate-800">Petunjuk Mencetak & Menyimpan Rapor Digital (PDF):</p>
          <ul className="list-disc pl-4 space-y-0.5 text-slate-600 text-[11px]">
            <li>
              <strong>Metode Unduh Berkas:</strong> Klik <em>"Unduh Berkas Rapor (PDF/Cetak)"</em>, berkas HTML mandiri akan tersimpan di komputer/ponsel. Buka berkas tersebut dengan Google Chrome, Edge, atau browser favorit Anda, lalu tekan <strong>Ctrl + P</strong> (atau Cmd + P di Mac) dan pilih <em>"Save as PDF" / "Simpan sebagai PDF"</em>.
            </li>
            <li>
              <strong>Metode Tab Baru:</strong> Klik <em>"Buka di Tab Baru"</em> untuk menampilkan halaman bersih tanpa menu aplikasi, lalu pilih Cetak.
            </li>
            <li>
              <strong>Pilihan Ukuran Kertas:</strong> Anda dapat memilih antara ukuran <strong>A4</strong> atau <strong>F4 / Folio</strong> sesuai standar buku rapor madrasah Kementerian Agama RI.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
