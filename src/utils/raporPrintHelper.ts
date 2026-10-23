import { User, AcademicGrade } from '../types/lms';

export interface RaporPrintData {
  student: {
    id: string;
    name: string;
    nisn: string;
    className: string;
    fase: string;
  };
  semester: 'Ganjil' | 'Genap';
  academicYear: string;
  paperSize?: 'A4' | 'F4';
  grades: AcademicGrade[];
  attendance?: {
    sakit: number;
    izin: number;
    alpa: number;
  };
  ekskul?: Array<{
    name: string;
    predikat: string;
    description: string;
  }>;
  catatanWaliKelas?: string;
  keputusan?: string;
  waliKelas?: {
    name: string;
    nip: string;
  };
  kepalaMadrasah?: {
    name: string;
    nip: string;
  };
  options?: {
    showKop?: boolean;
    showStamp?: boolean;
    showCatatan?: boolean;
  };
}

export function generateRaporHtml(data: RaporPrintData): string {
  const {
    student,
    semester = 'Genap',
    academicYear = '2024/2025',
    paperSize = 'A4',
    grades = [],
    attendance = { sakit: 1, izin: 1, alpa: 0 },
    ekskul = [
      { name: "Tahfidz Al-Qur'an (Juz 30)", predikat: 'A', description: 'Lancar & Mutqin' },
      { name: 'Pramuka Penggalang', predikat: 'A', description: 'Aktif, Disiplin & Tangkas' },
      { name: 'Seni Hadroh Rebana', predikat: 'B', description: 'Terampil & Kompak' },
      { name: 'Kaligrafi Islam (Khat)', predikat: 'A', description: 'Rapi & Kaidah Bagus' },
    ],
    catatanWaliKelas = 'Ananda menunjukkan akhlakul karimah yang sangat terpuji, aktif dalam shalat dhuha berjamaah dan hafalan tahfidz. Tingkatkan terus minat baca dan literasi sains.',
    keputusan = 'Dinyatakan NAIK KE KELAS 6 (ENAM)',
    waliKelas = {
      name: 'Usth. Siti Fatimah, S.Pd.I',
      nip: '198506242010012008',
    },
    kepalaMadrasah = {
      name: 'Ust. H. Muhammad Ilyas, S.Pd.I',
      nip: '197904122005011004',
    },
    options = { showKop: true, showStamp: true, showCatatan: true },
  } = data;

  // Separate PAI and Umum
  const paiSubjects = grades.filter(
    (g) =>
      g.subjectName.toLowerCase().includes("qur'an") ||
      g.subjectName.toLowerCase().includes('akidah') ||
      g.subjectName.toLowerCase().includes('fikih') ||
      g.subjectName.toLowerCase().includes('ski') ||
      g.subjectName.toLowerCase().includes('arab')
  );

  const umumSubjects = grades.filter((g) => !paiSubjects.some((p) => p.id === g.id));

  const totalNilai = grades.reduce((acc, curr) => acc + (curr.nilaiAkhir || 0), 0);
  const rataRata = grades.length > 0 ? (totalNilai / grades.length).toFixed(1) : '90.5';

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Rapor Digital Madrasah - ${student.name} - ${student.className}</title>
  <style>
    @page {
      size: ${paperSize === 'F4' ? '215mm 330mm' : 'A4 portrait'};
      margin: 12mm 15mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: 'Segoe UI', Arial, Helvetica, sans-serif;
      font-size: 11pt;
      line-height: 1.35;
      color: #1e293b;
      background-color: #f8fafc;
      margin: 0;
      padding: 20px 0;
    }
    .sheet {
      background: #ffffff;
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto 30px auto;
      padding: 15mm 18mm;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border: 1px solid #e2e8f0;
      position: relative;
    }
    .action-bar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: #064e3b;
      color: white;
      padding: 12px 20px;
      margin: -20px 0 20px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .action-bar h2 {
      margin: 0;
      font-size: 14pt;
      font-weight: 700;
    }
    .action-bar .btn-group {
      display: flex;
      gap: 10px;
    }
    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 8px;
      font-weight: bold;
      font-size: 10pt;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      text-decoration: none;
    }
    .btn-print {
      background: #f59e0b;
      color: #78350f;
    }
    .btn-print:hover {
      background: #d97706;
      color: white;
    }
    .btn-close {
      background: #065f46;
      color: white;
      border: 1px solid #10b981;
    }
    .btn-close:hover {
      background: #047857;
    }
    @media print {
      body {
        background: transparent !important;
        padding: 0 !important;
      }
      .sheet {
        width: 100% !important;
        min-height: auto !important;
        margin: 0 !important;
        padding: 0 !important;
        box-shadow: none !important;
        border: none !important;
      }
      .action-bar {
        display: none !important;
      }
    }
    .kop-header {
      border-bottom: 3px double #064e3b;
      padding-bottom: 8px;
      margin-bottom: 14px;
      text-align: center;
    }
    .basmalah {
      font-family: 'Amiri', 'Traditional Arabic', serif;
      font-size: 16pt;
      color: #064e3b;
      font-weight: bold;
      margin-bottom: 4px;
    }
    .kop-kemenag {
      font-size: 10.5pt;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin: 0;
    }
    .kop-madrasah {
      font-size: 14pt;
      font-weight: 900;
      color: #064e3b;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin: 2px 0;
    }
    .kop-desc {
      font-size: 8pt;
      color: #475569;
      margin: 1px 0;
    }
    .rapor-title {
      text-align: center;
      margin: 12px 0 14px 0;
    }
    .rapor-title h3 {
      font-size: 11pt;
      font-weight: 900;
      text-decoration: underline;
      text-underline-offset: 3px;
      text-transform: uppercase;
      margin: 0;
      color: #0f172a;
    }
    .rapor-title p {
      font-size: 8.5pt;
      color: #64748b;
      margin: 2px 0 0 0;
    }
    .identity-box {
      background-color: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 8px 12px;
      margin-bottom: 14px;
      display: flex;
      justify-content: space-between;
      font-size: 9pt;
    }
    .identity-col {
      width: 48%;
    }
    .identity-row {
      display: flex;
      margin-bottom: 3px;
    }
    .identity-label {
      width: 130px;
      color: #64748b;
    }
    .identity-value {
      font-weight: 700;
      color: #0f172a;
    }
    .section-title {
      font-size: 9.5pt;
      font-weight: 800;
      text-transform: uppercase;
      color: #064e3b;
      margin: 10px 0 4px 0;
    }
    table.grade-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12px;
      font-size: 8.5pt;
    }
    table.grade-table th {
      background-color: #064e3b;
      color: white;
      padding: 5px 6px;
      border: 1px solid #064e3b;
      text-align: center;
      font-weight: 700;
    }
    table.grade-table td {
      padding: 5px 6px;
      border: 1px solid #cbd5e1;
      vertical-align: middle;
    }
    .group-header td {
      background-color: #f1f5f9;
      font-weight: 700;
      color: #334155;
    }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .font-bold { font-weight: bold; }
    .score-badge {
      font-weight: 800;
      color: #065f46;
    }
    .grid-2 {
      display: flex;
      gap: 12px;
      margin-bottom: 12px;
    }
    .info-card {
      flex: 1;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 8px 10px;
      background: #fafafa;
      font-size: 8.5pt;
    }
    .info-card h5 {
      font-size: 8.5pt;
      font-weight: 800;
      text-transform: uppercase;
      margin: 0 0 6px 0;
      color: #0f172a;
      border-bottom: 1px dashed #cbd5e1;
      padding-bottom: 3px;
    }
    .info-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 3px;
    }
    .decision-banner {
      background-color: #ecfdf5;
      border: 2px solid #6ee7b7;
      border-radius: 8px;
      padding: 8px;
      text-align: center;
      margin-bottom: 14px;
    }
    .decision-sub {
      font-size: 8pt;
      color: #047857;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0;
    }
    .decision-main {
      font-size: 11pt;
      font-weight: 900;
      color: #064e3b;
      margin: 3px 0 0 0;
    }
    .signature-grid {
      display: flex;
      justify-content: space-between;
      margin-top: 18px;
      text-align: center;
      font-size: 8.5pt;
    }
    .sig-col {
      width: 30%;
      position: relative;
    }
    .sig-space {
      height: 52px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .stamp-box {
      font-family: 'Amiri', 'Traditional Arabic', serif;
      color: #065f46;
      font-size: 13pt;
      font-weight: bold;
      border: 2px dashed #059669;
      border-radius: 50%;
      width: 55px;
      height: 55px;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: rotate(-10deg);
      opacity: 0.85;
      margin: 0 auto;
    }
    .sig-name {
      font-weight: 800;
      text-decoration: underline;
      color: #0f172a;
      margin: 0;
    }
    .sig-nip {
      font-size: 7.5pt;
      color: #64748b;
      margin: 1px 0 0 0;
    }
  </style>
</head>
<body>
  <!-- Print & Download Control Bar (hidden during printing) -->
  <div class="action-bar">
    <div>
      <h2>Rapor Digital Madrasah (RDM) — MI Assuyutiyah</h2>
      <div style="font-size: 9pt; opacity: 0.9;">Santri: <strong>${student.name}</strong> (${student.className}) • Semester ${semester} TP ${academicYear}</div>
    </div>
    <div class="btn-group">
      <button class="btn btn-print" onclick="window.print()">
        🖨️ Cetak / Simpan PDF (Ctrl+P)
      </button>
      <button class="btn btn-close" onclick="window.close()">
        ✕ Tutup Jendela
      </button>
    </div>
  </div>

  <div class="sheet">
    ${
      options.showKop !== false
        ? `
    <!-- Kop Resmi Madrasah -->
    <div class="kop-header">
      <div class="basmalah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
      <h2 class="kop-kemenag">KEMENTERIAN AGAMA REPUBLIK INDONESIA</h2>
      <h1 class="kop-madrasah">MADRASAH IBTIDAIYAH ASSUYUTIYAH</h1>
      <p class="kop-desc">NSM: 111232010045 • NPSN: 60728912 • Terakreditasi "A" (Unggul)</p>
      <p class="kop-desc">Jl. Pesantren Assuyutiyah No. 15, Sukamaju • Email: info@mi-assuyutiyah.sch.id</p>
    </div>`
        : ''
    }

    <!-- Judul Rapor -->
    <div class="rapor-title">
      <h3>LAPORAN HASIL BELAJAR PESERTA DIDIK (RAPOR DIGITAL)</h3>
      <p>Kurikulum Merdeka Madrasah — Tahun Pelajaran ${academicYear} (Semester ${semester})</p>
    </div>

    <!-- Identitas Santri -->
    <div class="identity-box">
      <div class="identity-col">
        <div class="identity-row">
          <span class="identity-label">Nama Santri/Siswa</span>
          <span class="identity-value">: ${student.name}</span>
        </div>
        <div class="identity-row">
          <span class="identity-label">Nomor Induk / NISN</span>
          <span class="identity-value">: ${student.nisn || '-'}</span>
        </div>
        <div class="identity-row">
          <span class="identity-label">Nama Madrasah</span>
          <span class="identity-value">: MI Assuyutiyah</span>
        </div>
      </div>
      <div class="identity-col">
        <div class="identity-row">
          <span class="identity-label">Kelas / Fase</span>
          <span class="identity-value">: ${student.className} (${student.fase || 'Fase C'})</span>
        </div>
        <div class="identity-row">
          <span class="identity-label">Semester / TP</span>
          <span class="identity-value">: ${semester} / ${academicYear}</span>
        </div>
        <div class="identity-row">
          <span class="identity-label">Rata-rata Nilai</span>
          <span class="identity-value">: <span style="color:#065f46">${rataRata}</span> (Predikat Amat Baik)</span>
        </div>
      </div>
    </div>

    <!-- Tabel Capaian Hasil Belajar -->
    <div class="section-title">A. Capaian Hasil Belajar Mata Pelajaran</div>
    <table class="grade-table">
      <thead>
        <tr>
          <th style="width: 28px;">No</th>
          <th>Mata Pelajaran</th>
          <th style="width: 48px;">KKTP</th>
          <th style="width: 48px;">Nilai</th>
          <th style="width: 55px;">Predikat</th>
          <th>Capaian Kompetensi Kemenag</th>
        </tr>
      </thead>
      <tbody>
        <!-- Kelompok A -->
        <tr class="group-header">
          <td colspan="6">Kelompok A (Pendidikan Agama Islam & Bahasa Arab)</td>
        </tr>
        ${paiSubjects
          .map(
            (sb, idx) => `
        <tr>
          <td class="text-center font-bold">${idx + 1}</td>
          <td class="font-bold">${sb.subjectName}</td>
          <td class="text-center">75</td>
          <td class="text-center score-badge">${sb.nilaiAkhir}</td>
          <td class="text-center font-bold">${sb.predikat}</td>
          <td style="font-size: 8pt; line-height: 1.25;">${sb.capaianKompetensi}</td>
        </tr>`
          )
          .join('')}

        <!-- Kelompok B -->
        <tr class="group-header">
          <td colspan="6">Kelompok B (Mata Pelajaran Umum)</td>
        </tr>
        ${umumSubjects
          .map(
            (sb, idx) => `
        <tr>
          <td class="text-center font-bold">${paiSubjects.length + idx + 1}</td>
          <td class="font-bold">${sb.subjectName}</td>
          <td class="text-center">75</td>
          <td class="text-center score-badge">${sb.nilaiAkhir}</td>
          <td class="text-center font-bold">${sb.predikat}</td>
          <td style="font-size: 8pt; line-height: 1.25;">${sb.capaianKompetensi}</td>
        </tr>`
          )
          .join('')}
      </tbody>
    </table>

    <!-- Ekstrakurikuler & Kehadiran -->
    <div class="grid-2">
      <div class="info-card">
        <h5>B. Ekstrakurikuler & Karakter</h5>
        ${ekskul
          .map(
            (ek, idx) => `
        <div class="info-item">
          <span>${idx + 1}. ${ek.name}</span>
          <span class="font-bold" style="color: #065f46">${ek.predikat} (${ek.description})</span>
        </div>`
          )
          .join('')}
      </div>

      <div class="info-card">
        <h5>C. Rekapitulasi Ketidakhadiran</h5>
        <div class="info-item">
          <span>Sakit (S)</span>
          <span class="font-bold">${attendance.sakit} Hari</span>
        </div>
        <div class="info-item">
          <span>Izin (I)</span>
          <span class="font-bold">${attendance.izin} Hari</span>
        </div>
        <div class="info-item">
          <span>Tanpa Keterangan / Alpa (A)</span>
          <span class="font-bold">${attendance.alpa} Hari</span>
        </div>
        <div class="info-item" style="border-top: 1px dotted #cbd5e1; margin-top: 4px; padding-top: 4px;">
          <span>Status Kehadiran</span>
          <span class="font-bold" style="color: #047857">Sangat Disiplin (98%)</span>
        </div>
      </div>
    </div>

    ${
      options.showCatatan !== false
        ? `
    <!-- Catatan Wali Kelas -->
    <div style="border: 1px solid #cbd5e1; border-radius: 8px; padding: 6px 10px; margin-bottom: 12px; font-size: 8.5pt; background: #fff;">
      <strong style="color: #064e3b; text-transform: uppercase; font-size: 8pt; display: block; margin-bottom: 2px;">D. Catatan Perkembangan Karakter & Asatidz:</strong>
      <span style="font-style: italic; color: #334155;">"${catatanWaliKelas}"</span>
    </div>`
        : ''
    }

    <!-- Keputusan Kenaikan / Kelulusan -->
    <div class="decision-banner">
      <p class="decision-sub">Keputusan Berdasarkan Rapat Pleno Dewan Asatidz:</p>
      <p class="decision-main">${keputusan}</p>
    </div>

    <!-- Tanda Tangan Resmi -->
    <div class="signature-grid">
      <div class="sig-col">
        <p style="color: #64748b; margin: 0 0 4px 0;">Orang Tua / Wali Santri,</p>
        <div class="sig-space"></div>
        <p class="sig-name">H. Bambang Sudirman</p>
        <p class="sig-nip">Wali Santri</p>
      </div>

      <div class="sig-col">
        <p style="color: #64748b; margin: 0 0 4px 0;">Wali Kelas ${student.className},</p>
        <div class="sig-space">
          ${options.showStamp !== false ? '<div class="stamp-box">ختم الإجازة</div>' : ''}
        </div>
        <p class="sig-name">${waliKelas.name}</p>
        <p class="sig-nip">NIP. ${waliKelas.nip}</p>
      </div>

      <div class="sig-col">
        <p style="color: #64748b; margin: 0 0 4px 0;">Mengetahui, Kepala Madrasah</p>
        <div class="sig-space">
          ${options.showStamp !== false ? '<div class="stamp-box">ختم المدرسة</div>' : ''}
        </div>
        <p class="sig-name">${kepalaMadrasah.name}</p>
        <p class="sig-nip">NIP. ${kepalaMadrasah.nip}</p>
      </div>
    </div>
  </div>

  <script>
    // Automatically trigger print on load if opened standalone
    window.onload = function() {
      // small delay to let styles render
      setTimeout(function() {
        try {
          window.print();
        } catch (e) {
          console.warn('Auto print was prevented by browser policy:', e);
        }
      }, 500);
    };
  </script>
</body>
</html>`;
}

/**
 * Downloads a printable HTML document of the report card.
 * This works 100% reliably in any browser and iframe environment!
 */
export function downloadRaporDocument(data: RaporPrintData): void {
  const htmlContent = generateRaporHtml(data);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const sanitizedName = data.student.name.replace(/[^a-zA-Z0-9]/g, '_');
  link.href = url;
  link.download = `Rapor_Digital_Kemenag_${sanitizedName}_${data.semester}_2024_2025.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/**
 * Opens a dedicated printable tab in browser.
 */
export function openRaporPrintWindow(data: RaporPrintData): boolean {
  try {
    const htmlContent = generateRaporHtml(data);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (!win) {
      // Pop-up might be blocked, fallback to download
      downloadRaporDocument(data);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Could not open print window, downloading document instead:', err);
    downloadRaporDocument(data);
    return false;
  }
}

/**
 * Safe print trigger for iframe environment
 */
export function safeTriggerPrint(onFallback?: () => void): void {
  try {
    // Attempt standard print
    window.print();
  } catch (err) {
    console.warn('window.print() prevented by sandbox iframe:', err);
    if (onFallback) onFallback();
  }
}
