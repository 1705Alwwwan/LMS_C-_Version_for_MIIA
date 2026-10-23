export type UserRole = 'ADMIN' | 'GURU' | 'SISWA';

export type TeacherSubRole = 'WALI_KELAS' | 'GURU_MAPEL' | 'STAFF';

export interface MutationRecord {
  id: string;
  fromClassId: string;
  fromClassName: string;
  toClassId: string;
  toClassName: string;
  date: string;
  reasonType: 'PRESTASI' | 'KENAIKAN' | 'MUTASI' | 'LAINNYA';
  reasonText: string;
  approvedBy: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  email: string;
  avatar: string;
  phone?: string;
  nisn?: string;
  nip?: string;
  gender?: 'L' | 'P';
  classId?: string;
  className?: string;
  assignedClasses?: string[];
  subjectsTaught?: string[];
  address?: string;
  parentName?: string;
  parentPhone?: string;
  password?: string;
  position?: string;
  teacherType?: TeacherSubRole;
  staffPosition?: string;
  waliClassId?: string;
  waliClassName?: string;
  mutations?: MutationRecord[];
  achievementBadge?: string;
}

export interface ClassRoom {
  id: string;
  name: string;
  grade: number;
  waliKelasId: string;
  waliKelasName: string;
  capacity: number;
  totalStudents: number;
  roomNumber: string;
  academicYear: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  category: 'Keagamaan (Kemenag)' | 'Umum' | 'Muatan Lokal';
  kkm: number;
  teacherId: string;
  teacherName: string;
}

export interface ScheduleItem {
  id: string;
  day: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  startTime: string;
  endTime: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  room: string;
}

export type AttendanceStatus = 'Hadir' | 'Sakit' | 'Izin' | 'Alpa';

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  classId: string;
  studentId: string;
  studentName: string;
  status: AttendanceStatus;
  notes?: string;
}

export type TeacherAttendanceStatus = 'Hadir' | 'Izin' | 'Sakit' | 'Dinas Luar' | 'Alpa';

export interface TeacherAttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  teacherId: string;
  teacherName: string;
  nip?: string;
  checkInTime?: string; // HH:mm
  checkOutTime?: string; // HH:mm
  status: TeacherAttendanceStatus;
  notes?: string;
  subjectSummary?: string;
}

export interface HistoricalSemesterGrade {
  gradeLevel: number; // 1 - 6
  semester: 'Ganjil' | 'Genap';
  semesterIndex: number; // 1 - 12
  academicYear: string;
  averageScore: number;
  kemenagAverage: number;
  umumAverage: number;
  rank: number;
  totalStudents: number;
  attendanceRate: number;
  notes: string;
  subjects: {
    subjectName: string;
    category: 'Keagamaan (Kemenag)' | 'Umum' | 'Muatan Lokal';
    score: number;
    predicate: 'A' | 'B' | 'C' | 'D';
  }[];
}

export type MaterialType = 'pdf' | 'video' | 'link' | 'text';

export interface LearningMaterial {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  classId: string;
  className: string;
  teacherId: string;
  teacherName: string;
  type: MaterialType;
  url?: string;
  content?: string;
  description: string;
  fileSizeBytes?: number;
  createdAt: string;
}

export interface Assignment {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  classId: string;
  className: string;
  teacherId: string;
  teacherName: string;
  description: string;
  deadline: string;
  attachmentName?: string;
  maxScore: number;
  createdAt: string;
}

export interface StudentSubmission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  classId: string;
  submittedAt: string;
  answerText: string;
  fileName?: string;
  fileSize?: string;
  score?: number;
  feedback?: string;
  gradedAt?: string;
  gradedBy?: string;
  status: 'Menunggu Penilaian' | 'Sudah Dinilai';
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  type: 'multiple_choice' | 'essay';
  options: string[];
  correctAnswerIndex: number;
  points: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  classId: string;
  className: string;
  teacherId: string;
  teacherName: string;
  durationMinutes: number;
  deadline: string;
  totalPoints: number;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  studentId: string;
  studentName: string;
  classId: string;
  answers: Record<string, number | string>;
  score: number;
  maxScore: number;
  percentage: number;
  completedAt: string;
  feedback?: string;
}

export interface AcademicGrade {
  id: string;
  studentId: string;
  studentName: string;
  studentNisn: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  semester: 'Ganjil' | 'Genap';
  academicYear: string;
  nilaiTugas: number;
  nilaiUTS: number;
  nilaiUAS: number;
  nilaiAkhir: number;
  predikat: 'A' | 'B' | 'C' | 'D';
  capaianKompetensi: string;
}

export interface FeeTariff {
  id: string;
  code: 'SPP' | 'SERAGAM' | 'BANGUNAN' | 'DAFTAR_ULANG';
  name: string;
  category: 'SPP' | 'TAHUNAN';
  amount: number;
  frequency: 'Bulanan (12x/tahun)' | 'Setahun 1x';
  description: string;
  dueDateNote: string;
  includedItems?: string[];
}

export interface FinanceInvoice {
  id: string;
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  month: string;
  type: 'SPP Bulanan' | 'Uang Seragam' | 'Uang Bangunan' | 'Daftar Ulang' | 'Infaq Gedung' | 'Seragam & Kitab' | 'Ujian Madrasah' | string;
  amount: number;
  dueDate: string;
  status: 'LUNAS' | 'BELUM LUNAS';
  paymentDate?: string;
  paymentMethod?: 'Transfer Bank BSI' | 'Tunai di TU' | 'QRIS' | 'Virtual Account';
  receiptNumber?: string;
  notes?: string;
}

export interface SchoolExpense {
  id: string;
  title: string;
  category: 'Operasional' | 'Sarana & Prasarana' | 'Kegiatan Madrasah' | 'Honorarium' | 'Buku & Modul';
  amount: number;
  date: string;
  approvedBy: string;
  recipient: string;
  notes?: string;
}

export interface SchoolAnnouncement {
  id: string;
  title: string;
  content: string;
  targetRole: 'ALL' | 'GURU' | 'SISWA';
  date: string;
  author: string;
  priority: 'Biasa' | 'Penting' | 'Mendesak';
}

export interface SchoolAgenda {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: 'Akademik' | 'Keagamaan' | 'Ekstrakurikuler' | 'Rapat Guru';
}

export type PrayerStatus = 'Berjamaah' | 'Munfarid' | 'Tepat Waktu' | 'Tidak Sholat' | 'Udzur Syar\'i';

export interface DailyPrayerRecord {
  subuh: PrayerStatus;
  dzuhur: PrayerStatus;
  ashar: PrayerStatus;
  maghrib: PrayerStatus;
  isya: PrayerStatus;
  dhuha: boolean;
  tahajjud: boolean;
  rawatib: boolean;
}

export interface QuranTadarusRecord {
  type: 'Al-Qur\'an' | 'Tilawati' | 'Iqro';
  surahOrVolume: string;
  startAyahOrPage: string;
  endAyahOrPage: string;
  notes?: string;
}

export interface TahfidzRecord {
  surah: string;
  startAyat: number;
  endAyat: number;
  juz: number;
  kelancaran: 'Mumtaz (Sangat Lancar)' | 'Jayyid Jiddan (Lancar)' | 'Jayyid (Cukup)' | 'Perlu Mengulang';
  notes?: string;
}

export interface MutabaahEntry {
  id: string;
  date: string; // YYYY-MM-DD
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  prayers: DailyPrayerRecord;
  tadarus: QuranTadarusRecord;
  tahfidz: TahfidzRecord;
  // Catatan akhlak & pembinaan dua arah antara Wali Kelas & Orang Tua:
  teacherNote?: string;
  teacherName?: string;
  teacherVerified: boolean;
  teacherVerifiedAt?: string;
  parentNote?: string;
  parentVerified: boolean;
  parentVerifiedAt?: string;
  disciplineScore?: number; // 1-100
  characterBadge?: 'Amanah' | 'Disiplin' | 'Rajin Berjamaah' | 'Hafidz Cilik' | 'Santun & Berbakti';
}

export interface AcademicCalendarEvent {
  id: string;
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  category: 'Akademik' | 'Ujian ASTS/ASAS' | 'PHBI & Keagamaan' | 'Libur Semester' | 'Rapat Guru & Wali';
  targetRole: 'ALL' | 'GURU' | 'SISWA';
  description: string;
  color: string;
  notificationSent?: boolean;
}

