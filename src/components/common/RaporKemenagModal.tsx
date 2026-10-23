import React from 'react';
import { User, AcademicGrade } from '../../types/lms';
import { generateRaporHtml, downloadRaporDocument, safeTriggerPrint } from '../../utils/raporPrintHelper';
import { Printer, Download, X, Award, CheckCircle2, ShieldCheck } from 'lucide-react';

interface RaporKemenagModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: User;
  grades: AcademicGrade[];
  semester?: 'Ganjil' | 'Genap';
  academicYear?: string;
  waliKelasName?: string;
}

export const RaporKemenagModal: React.FC<RaporKemenagModalProps> = ({
  isOpen,
  onClose,
  student,
  grades,
  semester = 'Genap',
  academicYear = '2024/2025',
  waliKelasName = 'Usth. Siti Fatimah, S.Pd.I',
}) => {
  if (!isOpen) return null;

  const studentGrades = grades.filter((g) => g.studentId === student.id);
  const kemenagSubjects = studentGrades.filter(
    (g) =>
      g.subjectName.toLowerCase().includes("qur'an") ||
      g.subjectName.toLowerCase().includes('akidah') ||
      g.subjectName.toLowerCase().includes('fikih') ||
      g.subjectName.toLowerCase().includes('ski') ||
      g.subjectName.toLowerCase().includes('arab')
  );
  const umumSubjects = studentGrades.filter((g) => !kemenagSubjects.some((k) => k.id === g.id));

  const totalNilai = studentGrades.reduce((acc, curr) => acc + (curr.nilaiAkhir || 0), 0);
  const rataRata = studentGrades.length > 0 ? (totalNilai / studentGrades.length).toFixed(1) : '91.2';

  const printData = {
    student: {
      id: student.id,
      name: student.name,
      nisn: student.nisn || '0098765432',
      className: student.className || 'Kelas 5A',
      fase: (student.className || '').includes('1') || (student.className || '').includes('2')
        ? 'Fase A'
        : (student.className || '').includes('3') || (student.className || '').includes('4')
        ? 'Fase B'
        : 'Fase C',
    },
    semester,
    academicYear,
    grades: studentGrades,
    attendance: { sakit: 1, izin: 1, alpa: 0 },
    waliKelas: {
      name: waliKelasName,
      nip: '198506242010012008',
    },
    kepalaMadrasah: {
      name: 'Ust. H. Muhammad Ilyas, S.Pd.I',
      nip: '197904122005011004',
    },
  };

  const handlePrint = () => {
    // Open printable HTML iframe or trigger print
    const html = generateRaporHtml(printData);
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 3000);
      }, 400);
    } else {
      safeTriggerPrint(() => downloadRaporDocument(printData));
    }
  };

  const handleDownload = () => {
    downloadRaporDocument(printData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[92vh] bg-white rounded-2xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700/80 border border-emerald-500/30 flex items-center justify-center text-amber-300">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-white">
                  Pratinjau Rapor Digital Kemenag RI
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-amber-950">
                  Resmi Kurikulum Merdeka
                </span>
              </div>
              <p className="text-xs text-emerald-100/80">
                {student.name} • {student.className} • NISN: {student.nisn || '-'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-amber-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cetak PDF</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl border border-emerald-500/50 flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Unduh HTML</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-emerald-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Printable Sheet Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100 text-slate-800">
          <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-md border border-slate-300 text-xs leading-relaxed font-sans">
            {/* Kop Madrasah Resmi */}
            <div className="border-b-4 border-double border-emerald-900 pb-3 text-center mb-4 relative">
              <div className="font-arabic text-emerald-900 text-sm font-bold mb-1">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>
              <p className="text-[11px] font-extrabold text-slate-900 tracking-wider uppercase">
                KEMENTERIAN AGAMA REPUBLIK INDONESIA
              </p>
              <p className="text-[10px] font-bold text-slate-800 uppercase">
                KANTOR KEMENTERIAN AGAMA KABUPATEN BOGOR
              </p>
              <h2 className="text-base sm:text-lg font-black text-emerald-900 tracking-wide uppercase my-0.5">
                MADRASAH IBTIDAIYAH ASSUYUTIYAH
              </h2>
              <p className="text-[9px] text-slate-600">
                NSM: 111232010045 • NPSN: 60712345 • Terakreditasi A (BAN-S/M)
              </p>
              <p className="text-[9px] text-slate-500">
                Jl. Raya Pesantren Assuyutiyah No. 12, Jawa Barat. Telp: (021) 8765432 • Website: mi-assuyutiyah.sch.id
              </p>
            </div>

            {/* Judul Rapor */}
            <div className="text-center mb-4">
              <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase underline tracking-wide">
                LAPORAN HASIL BELAJAR PESERTA DIDIK (RAPOR DIGITAL MADRASAH)
              </h4>
              <p className="text-[10px] text-slate-600 mt-0.5">
                Semester: <strong>{semester}</strong> • Tahun Ajaran: <strong>{academicYear}</strong>
              </p>
            </div>

            {/* Identitas Santri */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200 text-[10px] mb-4">
              <div className="space-y-1">
                <div className="flex">
                  <span className="w-24 text-slate-500">Nama Santri</span>
                  <span className="font-bold text-slate-900">: {student.name}</span>
                </div>
                <div className="flex">
                  <span className="w-24 text-slate-500">NISN / NIS</span>
                  <span className="text-slate-800">: {student.nisn || '0098765432'} / 2021008</span>
                </div>
                <div className="flex">
                  <span className="w-24 text-slate-500">Madrasah</span>
                  <span className="text-slate-800">: MI Assuyutiyah</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex">
                  <span className="w-24 text-slate-500">Kelas / Fase</span>
                  <span className="font-bold text-slate-900">: {student.className} / {printData.student.fase}</span>
                </div>
                <div className="flex">
                  <span className="w-24 text-slate-500">Semester</span>
                  <span className="text-slate-800">: {semester}</span>
                </div>
                <div className="flex">
                  <span className="w-24 text-slate-500">Tahun Ajaran</span>
                  <span className="text-slate-800">: {academicYear}</span>
                </div>
              </div>
            </div>

            {/* Tabel Kelompok A (Kemenag) */}
            <div className="mb-4">
              <div className="bg-emerald-800 text-white px-2.5 py-1 text-[10px] font-bold uppercase rounded-t-md">
                Kelompok A : Pendidikan Agama Islam & Bahasa Arab (Kemenag)
              </div>
              <div className="border border-slate-300 rounded-b-md overflow-x-auto">
                <table className="w-full text-[10px] text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                    <tr>
                      <th className="p-2 w-8 text-center">No</th>
                      <th className="p-2 w-48">Mata Pelajaran</th>
                      <th className="p-2 w-12 text-center">KKM</th>
                      <th className="p-2 w-14 text-center">Nilai</th>
                      <th className="p-2 w-12 text-center">Predikat</th>
                      <th className="p-2">Capaian Pembelajaran (Deskripsi)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {kemenagSubjects.map((sub, idx) => (
                      <tr key={sub.id} className="hover:bg-slate-50">
                        <td className="p-2 text-center font-semibold">{idx + 1}</td>
                        <td className="p-2 font-bold text-slate-900">{sub.subjectName}</td>
                        <td className="p-2 text-center text-slate-500">75</td>
                        <td className="p-2 text-center font-bold text-emerald-800">{sub.nilaiAkhir}</td>
                        <td className="p-2 text-center font-extrabold text-amber-700">{sub.predikat}</td>
                        <td className="p-2 text-slate-700">{sub.capaianKompetensi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tabel Kelompok B (Umum) */}
            <div className="mb-4">
              <div className="bg-teal-800 text-white px-2.5 py-1 text-[10px] font-bold uppercase rounded-t-md">
                Kelompok B : Muatan Nasional & Umum
              </div>
              <div className="border border-slate-300 rounded-b-md overflow-x-auto">
                <table className="w-full text-[10px] text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                    <tr>
                      <th className="p-2 w-8 text-center">No</th>
                      <th className="p-2 w-48">Mata Pelajaran</th>
                      <th className="p-2 w-12 text-center">KKM</th>
                      <th className="p-2 w-14 text-center">Nilai</th>
                      <th className="p-2 w-12 text-center">Predikat</th>
                      <th className="p-2">Capaian Pembelajaran (Deskripsi)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {umumSubjects.map((sub, idx) => (
                      <tr key={sub.id} className="hover:bg-slate-50">
                        <td className="p-2 text-center font-semibold">{idx + 1}</td>
                        <td className="p-2 font-bold text-slate-900">{sub.subjectName}</td>
                        <td className="p-2 text-center text-slate-500">72</td>
                        <td className="p-2 text-center font-bold text-teal-800">{sub.nilaiAkhir}</td>
                        <td className="p-2 text-center font-extrabold text-amber-700">{sub.predikat}</td>
                        <td className="p-2 text-slate-700">{sub.capaianKompetensi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Ringkasan & Ekstrakurikuler */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-[10px]">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Ekstrakurikuler & Pembiasaan Ibadah
                </div>
                <ul className="space-y-1 text-slate-700">
                  <li>• <strong>Tahfidz Qur'an Juz 30</strong>: Predikat A (Lancar & Mumtaz)</li>
                  <li>• <strong>Pramuka Madrasah</strong>: Predikat A (Disiplin & Aktif)</li>
                  <li>• <strong>Seni Hadroh & Rebana</strong>: Predikat B (Terampil)</li>
                </ul>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="font-bold text-slate-800 mb-1.5">Ketidakhadiran & Rekap Nilai</div>
                <div className="grid grid-cols-3 gap-2 text-center py-1">
                  <div className="bg-white p-1 rounded border border-slate-200">
                    <span className="text-[9px] text-slate-500 block">Sakit</span>
                    <strong className="text-slate-800">1 Hari</strong>
                  </div>
                  <div className="bg-white p-1 rounded border border-slate-200">
                    <span className="text-[9px] text-slate-500 block">Izin</span>
                    <strong className="text-slate-800">1 Hari</strong>
                  </div>
                  <div className="bg-white p-1 rounded border border-slate-200">
                    <span className="text-[9px] text-slate-500 block">Alpa</span>
                    <strong className="text-emerald-700">0 Hari</strong>
                  </div>
                </div>
                <p className="mt-1 text-slate-600">
                  Rata-rata Nilai: <strong className="text-emerald-900">{rataRata}</strong> • Predikat:{' '}
                  <strong className="text-amber-800">Sangat Baik (A)</strong>
                </p>
              </div>
            </div>

            {/* Catatan Karakter & Kenaikan */}
            <div className="p-3 bg-emerald-50/70 rounded-lg border border-emerald-200 mb-6 text-[10px]">
              <div className="font-bold text-emerald-900 mb-0.5">Catatan Perkembangan Karakter Wali Kelas:</div>
              <p className="text-emerald-950 italic">
                "Ananda menunjukkan akhlakul karimah yang sangat terpuji, rajin sholat dhuha berjamaah dan bersemangat dalam setoran tahfidz Juz 30. Tingkatkan terus prestasi dan kecintaan membaca."
              </p>
              <div className="mt-2 pt-2 border-t border-emerald-200 font-bold text-emerald-900 flex items-center justify-between">
                <span>Keputusan Akhir Semester:</span>
                <span className="bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px] font-black">
                  Dinyatakan NAIK KE KELAS BERIKUTNYA
                </span>
              </div>
            </div>

            {/* Tanda Tangan */}
            <div className="grid grid-cols-3 gap-4 text-center text-[10px] pt-2">
              <div>
                <p className="text-slate-500 mb-10">Mengetahui,<br />Orang Tua / Wali Santri</p>
                <div className="border-b border-slate-400 w-32 mx-auto"></div>
              </div>
              <div>
                <p className="text-slate-500 mb-10">
                  Bogor, 20 Juni 2026<br />Wali Kelas
                </p>
                <p className="font-bold text-slate-900 underline">{waliKelasName}</p>
                <p className="text-[9px] text-slate-500">NIP: 198506242010012008</p>
              </div>
              <div>
                <p className="text-slate-500 mb-10">
                  Mengetahui,<br />Kepala Madrasah
                </p>
                <p className="font-bold text-slate-900 underline">Ust. H. Muhammad Ilyas, S.Pd.I</p>
                <p className="text-[9px] text-slate-500">NIP: 197904122005011004</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500">
            Dokumen resmi berstandar POS Kemenag RI Direktorat KSKK Madrasah
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors"
          >
            Tutup Pratinjau
          </button>
        </div>
      </div>
    </div>
  );
};
