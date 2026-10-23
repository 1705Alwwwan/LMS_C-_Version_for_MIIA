import { User, AcademicGrade, AttendanceRecord, TeacherAttendanceRecord, TeacherAttendanceStatus } from '../types/lms';

export const SAMPLE_20_TEACHERS: User[] = [
  {
    id: 'user-farhan',
    username: 'farhan',
    name: 'Farhan, S.Pd',
    role: 'GURU',
    password: '1234',
    email: 'farhan@mi-assuyutiyah.sch.id',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    nip: '199001012024011001',
    phone: '0812-3456-7890',
    gender: 'L',
    teacherType: 'WALI_KELAS',
    waliClassId: 'c-6b',
    waliClassName: 'Kelas 6B',
    assignedClasses: ['6B'],
    subjectsTaught: ['Informatika & Literasi Digital', 'Fikih'],
    address: 'Jl. Pesantren Assuyutiyah No. 15',
  },
  {
    id: 'user-guru-1',
    username: 'guru_siti',
    name: 'Usth. Siti Fatimah, S.Pd.I',
    role: 'GURU',
    password: '1234',
    email: 'siti.fatimah@mi-assuyutiyah.sch.id',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    nip: '198506242010012008',
    phone: '0857-8910-1112',
    gender: 'P',
    teacherType: 'WALI_KELAS',
    waliClassId: 'c-5a',
    waliClassName: 'Kelas 5A',
    assignedClasses: ['5A'],
    subjectsTaught: ['Fikih', 'Al-Qur\'an Hadis'],
    address: 'Komplek Griya Asri No. 8',
  },
  {
    id: 'user-guru-2',
    username: 'guru_ahmad',
    name: 'Ust. Ahmad Fauzi, M.Pd',
    role: 'GURU',
    password: '1234',
    email: 'ahmad.fauzi@mi-assuyutiyah.sch.id',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    nip: '198802152014021003',
    phone: '0813-9876-5432',
    gender: 'L',
    teacherType: 'WALI_KELAS',
    waliClassId: 'c-6a',
    waliClassName: 'Kelas 6A',
    assignedClasses: ['6A'],
    subjectsTaught: ['Bahasa Arab', 'SKI'],
    address: 'Jl. Melati Indah No. 12',
  },
  {
    id: 'user-guru-3',
    username: 'guru_nurul',
    name: 'Usth. Nurul Hidayah, S.Si',
    role: 'GURU',
    password: '1234',
    email: 'nurul.hidayah@mi-assuyutiyah.sch.id',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    nip: '199208102018032001',
    phone: '0821-4567-8901',
    gender: 'P',
    teacherType: 'WALI_KELAS',
    waliClassId: 'c-5b',
    waliClassName: 'Kelas 5B',
    assignedClasses: ['5B'],
    subjectsTaught: ['Matematika', 'IPAS'],
    address: 'Jl. Cendrawasih No. 4',
  },
  {
    id: 'user-guru-misc-1',
    username: 'guru_anisa',
    name: 'Usth. Anisa Rahma, S.Pd',
    role: 'GURU',
    password: '1234',
    email: 'anisa.rahma@mi-assuyutiyah.sch.id',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    nip: '199104102016022002',
    phone: '0812-9871-2345',
    gender: 'P',
    teacherType: 'WALI_KELAS',
    waliClassId: 'c-1a',
    waliClassName: 'Kelas 1A',
    assignedClasses: ['1A'],
    subjectsTaught: ['Tematik', 'Bahasa Indonesia'],
    address: 'Jl. Melati No. 20',
  },
  {
    id: 'user-guru-misc-2',
    username: 'guru_wildan',
    name: 'Ust. Wildan Hakim, S.Pd.I',
    role: 'GURU',
    password: '1234',
    email: 'wildan.hakim@mi-assuyutiyah.sch.id',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    nip: '198909152015011003',
    phone: '0813-2233-4455',
    gender: 'L',
    teacherType: 'WALI_KELAS',
    waliClassId: 'c-2a',
    waliClassName: 'Kelas 2A',
    assignedClasses: ['2A'],
    subjectsTaught: ['PJOK', 'Tahfidz'],
    address: 'Jl. KH. Hasyim Asy\'ari No. 45',
  },
  {
    id: 'user-guru-misc-3',
    username: 'guru_khadijah',
    name: 'Usth. Khadijah, S.Pd',
    role: 'GURU',
    password: '1234',
    email: 'khadijah@mi-assuyutiyah.sch.id',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    nip: '198705202011012004',
    phone: '0819-3344-5566',
    gender: 'P',
    teacherType: 'WALI_KELAS',
    waliClassId: 'c-1b',
    waliClassName: 'Kelas 1B',
    assignedClasses: ['1B'],
    subjectsTaught: ['Tematik', 'Seni Budaya'],
    address: 'Jl. Mawar Indah No. 11',
  },
  {
    id: 'user-guru-misc-4',
    username: 'guru_salman',
    name: 'Ust. Salman Al-Farisi, S.Pd.I',
    role: 'GURU',
    password: '1234',
    email: 'salman.alfarisi@mi-assuyutiyah.sch.id',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    nip: '199312122019031001',
    phone: '0821-8899-0011',
    gender: 'L',
    teacherType: 'WALI_KELAS',
    waliClassId: 'c-2b',
    waliClassName: 'Kelas 2B',
    assignedClasses: ['2B'],
    subjectsTaught: ['Pendidikan Pancasila', 'Al-Qur\'an'],
    address: 'Jl. Pesantren No. 8',
  },
  {
    id: 'user-guru-9',
    username: 'guru_dewi',
    name: 'Usth. Dewi Sartika, S.Pd',
    role: 'GURU',
    password: '1234',
    email: 'dewi.sartika@mi-assuyutiyah.sch.id',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    nip: '198603142012022003',
    phone: '0812-7711-2233',
    gender: 'P',
    teacherType: 'WALI_KELAS',
    waliClassId: 'c-3a',
    waliClassName: 'Kelas 3A',
    assignedClasses: ['3A'],
    subjectsTaught: ['Tematik', 'Bahasa Indonesia'],
    address: 'Perum Korpri Blok B No. 14',
  },
  {
    id: 'user-guru-10',
    username: 'guru_rahmat',
    name: 'Ust. Rahmat Hidayat, S.Pd.I',
    role: 'GURU',
    password: '1234',
    email: 'rahmat.hidayat@mi-assuyutiyah.sch.id',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    nip: '199005112015031002',
    phone: '0813-8822-4411',
    gender: 'L',
    teacherType: 'WALI_KELAS',
    waliClassId: 'c-3c',
    waliClassName: 'Kelas 3C',
    assignedClasses: ['3C'],
    subjectsTaught: ['SKI', 'Akidah Akhlak'],
    address: 'Jl. Diponegoro No. 33',
  },
  {
    id: 'user-guru-11',
    username: 'guru_mariam',
    name: 'Usth. Mariam Ulfah, M.Pd',
    role: 'GURU',
    password: '1234',
    email: 'mariam.ulfah@mi-assuyutiyah.sch.id',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    nip: '198711092011012005',
    phone: '0822-3344-9988',
    gender: 'P',
    teacherType: 'WALI_KELAS',
    waliClassId: 'c-4a',
    waliClassName: 'Kelas 4A',
    assignedClasses: ['4A'],
    subjectsTaught: ['IPAS', 'Matematika'],
    address: 'Jl. Kenanga Timur No. 17',
  },
  {
    id: 'user-guru-12',
    username: 'guru_yusuf',
    name: 'Ust. Muhammad Yusuf, S.Pd',
    role: 'GURU',
    password: '1234',
    email: 'muhammad.yusuf@mi-assuyutiyah.sch.id',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    nip: '199201142017011004',
    phone: '0815-9988-1122',
    gender: 'L',
    teacherType: 'WALI_KELAS',
    waliClassId: 'c-4b',
    waliClassName: 'Kelas 4B',
    assignedClasses: ['4B'],
    subjectsTaught: ['Bahasa Indonesia', 'Seni Budaya'],
    address: 'Jl. Kartini No. 5',
  },
  {
    id: 'user-guru-13',
    username: 'guru_zainuddin',
    name: 'Ust. Zainuddin, M.Pd.I',
    role: 'GURU',
    password: '1234',
    email: 'zainuddin@mi-assuyutiyah.sch.id',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    nip: '198408182009021001',
    phone: '0812-4455-6677',
    gender: 'L',
    teacherType: 'GURU_MAPEL',
    assignedClasses: ['5A', '5B', '6A', '6B'],
    subjectsTaught: ['Akidah Akhlak', 'Fikih'],
    address: 'Komplek Pondok Indah Blok D-2',
  },
  {
    id: 'user-guru-14',
    username: 'guru_burhan',
    name: 'Ust. Dr. H. Burhanuddin, Lc., M.A.',
    role: 'GURU',
    password: '1234',
    email: 'burhanuddin@mi-assuyutiyah.sch.id',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    nip: '198004152006041002',
    phone: '0811-2233-4455',
    gender: 'L',
    teacherType: 'GURU_MAPEL',
    assignedClasses: ['4A', '4B', '5A', '5B', '6A', '6B'],
    subjectsTaught: ['Bahasa Arab Pendalaman', 'Nahwu Shorof Dasar'],
    address: 'Jl. Kyai Mojo No. 10',
  },
  {
    id: 'user-guru-15',
    username: 'guru_halimah',
    name: 'Usth. Halimah Tusadiah, S.Pd.I',
    role: 'GURU',
    password: '1234',
    email: 'halimah@mi-assuyutiyah.sch.id',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    nip: '199402202020012003',
    phone: '0858-1122-3344',
    gender: 'P',
    teacherType: 'GURU_MAPEL',
    assignedClasses: ['1A', '1B', '2A', '2B'],
    subjectsTaught: ['Tahfidz Al-Qur\'an', 'Tahsin & Tilawah'],
    address: 'Jl. Flamboyan No. 22',
  },
  {
    id: 'user-guru-16',
    username: 'guru_fathur',
    name: 'Ust. Fathurrahman, S.Ag',
    role: 'GURU',
    password: '1234',
    email: 'fathurrahman@mi-assuyutiyah.sch.id',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    nip: '198906102014021004',
    phone: '0813-7766-5544',
    gender: 'L',
    teacherType: 'GURU_MAPEL',
    assignedClasses: ['3A', '3B', '3C', '4A', '4B'],
    subjectsTaught: ['Tajwid Aplikatif', 'Hadis Pilihan'],
    address: 'Jl. KH. Ahmad Dahlan No. 12',
  },
  {
    id: 'user-guru-17',
    username: 'guru_rina',
    name: 'Usth. Rina Agustina, S.Pd',
    role: 'GURU',
    password: '1234',
    email: 'rina.agustina@mi-assuyutiyah.sch.id',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    nip: '199508152021022004',
    phone: '0823-1199-8877',
    gender: 'P',
    teacherType: 'GURU_MAPEL',
    assignedClasses: ['4A', '4B', '5A', '5B'],
    subjectsTaught: ['Bahasa Inggris Madrasah'],
    address: 'Jl. Teratai Indah No. 9',
  },
  {
    id: 'user-guru-18',
    username: 'guru_ridwan',
    name: 'Ust. Ridwan Mansyur, S.Pd',
    role: 'GURU',
    password: '1234',
    email: 'ridwan.mansyur@mi-assuyutiyah.sch.id',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    nip: '199103032016011005',
    phone: '0812-8877-6655',
    gender: 'L',
    teacherType: 'GURU_MAPEL',
    assignedClasses: ['3A', '3B', '3C', '5A', '5B', '6A', '6B'],
    subjectsTaught: ['PJOK', 'Pencak Silat Tapak Suci'],
    address: 'Jl. Pahlawan No. 70',
  },
  {
    id: 'user-guru-19',
    username: 'guru_aisyah_w',
    name: 'Usth. Aisyah Wardani, S.Kom',
    role: 'GURU',
    password: '1234',
    email: 'aisyah.wardani@mi-assuyutiyah.sch.id',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    nip: '199607182022032001',
    phone: '0857-4433-2211',
    gender: 'P',
    teacherType: 'STAFF',
    staffPosition: 'Kepala Tata Usaha & IT Operator SIMPATIKA/EMIS',
    address: 'Jl. Gajah Mada No. 19',
  },
  {
    id: 'user-guru-20',
    username: 'guru_miftah',
    name: 'Ust. Miftah Farid, S.Pd.I',
    role: 'GURU',
    password: '1234',
    email: 'miftah.farid@mi-assuyutiyah.sch.id',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    nip: '198709092013011002',
    phone: '0813-5566-7799',
    gender: 'L',
    teacherType: 'STAFF',
    staffPosition: 'Kepala Perpustakaan Digital & Pengelola Sarpras',
    address: 'Jl. Anggrek No. 14',
  },
];

// Helper to generate 100 students across 12 classes with varied dynamics
interface StudentRosterItem {
  name: string;
  gender: 'L' | 'P';
  parent: string;
}

const CLASS_CONFIGS: { classId: string; className: string; grade: number; students: StudentRosterItem[] }[] = [
  {
    classId: 'c-1a',
    className: 'Kelas 1A',
    grade: 1,
    students: [
      { name: 'Muhammad Rayyan Al-Ghifari', gender: 'L', parent: 'H. Lukman Hakim' },
      { name: 'Siti Aisyah Putri', gender: 'P', parent: 'Ir. Agus Wijaya' },
      { name: 'Arkan Faiz Rabbani', gender: 'L', parent: 'Drs. Subhan' },
      { name: 'Nabila Syakira', gender: 'P', parent: 'Hendra Saputra' },
      { name: 'Kenzo Al-Fatih', gender: 'L', parent: 'Budi Santoso' },
      { name: 'Zahira Maryam', gender: 'P', parent: 'dr. Faisal Anwar' },
      { name: 'Malik Ibrahim Pratama', gender: 'L', parent: 'Agung Gunawan' },
      { name: 'Hafidzah Nur Ramadhani', gender: 'P', parent: 'Ahmad Syafi\'i' },
    ],
  },
  {
    classId: 'c-1b',
    className: 'Kelas 1B',
    grade: 1,
    students: [
      { name: 'Fatih Al-Ayyubi', gender: 'L', parent: 'M. Shodiq, S.Pd' },
      { name: 'Safira Alya Nabila', gender: 'P', parent: 'Rahmat Basuki' },
      { name: 'Dhafin Rizqy Pratama', gender: 'L', parent: 'Slamet Widodo' },
      { name: 'Salwa Khairunnisa', gender: 'P', parent: 'Yayan Hendrayana' },
      { name: 'Zaidan Ahza Athallah', gender: 'L', parent: 'Harun Al-Rasyid' },
      { name: 'Adiba Shakila Atmarini', gender: 'P', parent: 'Bambang Tri' },
      { name: 'Rafa Raditya Akbar', gender: 'L', parent: 'H. Sudrajat' },
      { name: 'Nayra Salsabila Az-Zahra', gender: 'P', parent: 'Agus Salim' },
    ],
  },
  {
    classId: 'c-2a',
    className: 'Kelas 2A',
    grade: 2,
    students: [
      { name: 'Habibi Al-Ghazali', gender: 'L', parent: 'H. Mansyur Hidayat' },
      { name: 'Maryam Qonita', gender: 'P', parent: 'Ust. Nurul Huda' },
      { name: 'Raffasya Zayyan', gender: 'L', parent: 'Joni Hermawan' },
      { name: 'Syifa Nurul Izzah', gender: 'P', parent: 'Wahyu Hidayat' },
      { name: 'Ibrahim Hanif Al-Banjari', gender: 'L', parent: 'Dr. Ilham Kurnia' },
      { name: 'Khadijah Al-Kubro', gender: 'P', parent: 'Taufiqurrahman' },
      { name: 'Salman Al-Baqir', gender: 'L', parent: 'Abdul Malik' },
      { name: 'Aqila Humaira', gender: 'P', parent: 'Eko Prasetyo' },
    ],
  },
  {
    classId: 'c-2b',
    className: 'Kelas 2B',
    grade: 2,
    students: [
      { name: 'Ammar Yasir Al-Farabi', gender: 'L', parent: 'H. Syamsul Maarif' },
      { name: 'Zalfa Naura', gender: 'P', parent: 'Rudi Hartono' },
      { name: 'Fakhri Aliando', gender: 'L', parent: 'Wawan Gunawan' },
      { name: 'Ghaida Shofi', gender: 'P', parent: 'H. Hasan Basri' },
      { name: 'Rizqi Nur Fajar', gender: 'L', parent: 'Yusuf Mansur' },
      { name: 'Talita Hasna Humaira', gender: 'P', parent: 'Dedi Mulyadi' },
      { name: 'Gibran Rakabuming Satria', gender: 'L', parent: 'H. Joko Susanto' },
      { name: 'Fathiya Rahmawati', gender: 'P', parent: 'Edi Supriyadi' },
    ],
  },
  {
    classId: 'c-3a',
    className: 'Kelas 3A',
    grade: 3,
    students: [
      { name: 'Hamzah Asadullah', gender: 'L', parent: 'H. Ridwan Kamil' },
      { name: 'Yasmin Zahra Fauziyyah', gender: 'P', parent: 'dr. Fauzi Ahmad' },
      { name: 'Rayan Atharizz', gender: 'L', parent: 'Sunardi' },
      { name: 'Anindita Keisha Zahra', gender: 'P', parent: 'Indra Lesmana' },
      { name: 'Farrel Arya Kusuma', gender: 'L', parent: 'Bagus Prakoso' },
      { name: 'Nabila Azzahra Fitri', gender: 'P', parent: 'Heru Wibowo' },
      { name: 'Zuhair Bilal Al-Mubarok', gender: 'L', parent: 'H. Mubarok' },
      { name: 'Qiana Shaqueena', gender: 'P', parent: 'Dadan Ramdani' },
    ],
  },
  {
    classId: 'c-3b',
    className: 'Kelas 3B',
    grade: 3,
    students: [
      { name: 'Thoriq Ziyad Al-Hafiz', gender: 'L', parent: 'Ust. Ziyad Al-Banna' },
      { name: 'Syakira Az-Zahra', gender: 'P', parent: 'H. Hendra Kurniawan' },
      { name: 'Naufal Abiyyu', gender: 'L', parent: 'Suhartono' },
      { name: 'Lathifah Nur Azizah', gender: 'P', parent: 'Ir. Ahmad Baihaqi' },
      { name: 'Mikael Rafa Danendra', gender: 'L', parent: 'Danang Joyo' },
      { name: 'Khalila Hasna Nabila', gender: 'P', parent: 'Surya Saputra' },
      { name: 'Haikal Fikri Pratama', gender: 'L', parent: 'Agus Budiman' },
      { name: 'Azkia Naila Husna', gender: 'P', parent: 'Faisal Basri' },
    ],
  },
  {
    classId: 'c-3c',
    className: 'Kelas 3C',
    grade: 3,
    students: [
      { name: 'Muhammad Rizki Pratama', gender: 'L', parent: 'H. Suryanto, M.M.' },
      { name: 'Qonita Lutfia Syahidah', gender: 'P', parent: 'Drs. Syahid Ali' },
      { name: 'Fawwaz Al-Ghazi', gender: 'L', parent: 'Ir. Ruslan Efendi' },
      { name: 'Salma Azka Nurina', gender: 'P', parent: 'H. Nur Fauzi' },
      { name: 'Zaki Rabbani Arkan', gender: 'L', parent: 'Bambang Sudarto' },
      { name: 'Alya Sabrina Mumtaz', gender: 'P', parent: 'dr. Mumtaz, Sp.A' },
      { name: 'Rasyadan Al-Muntazar', gender: 'L', parent: 'H. Hasan Munir' },
      { name: 'Hilya Aulia Rahmah', gender: 'P', parent: 'Syaiful Bahri' },
    ],
  },
  {
    classId: 'c-4a',
    className: 'Kelas 4A',
    grade: 4,
    students: [
      { name: 'Sulaiman Al-Habsyi', gender: 'L', parent: 'Habib Ali Al-Habsyi' },
      { name: 'Fatimah Az-Zahro', gender: 'P', parent: 'H. Mustofa' },
      { name: 'Rasyid Ridha', gender: 'L', parent: 'Syaifuddin Zuhri' },
      { name: 'Nadya Putri Ramadhani', gender: 'P', parent: 'Bambang Pamungkas' },
      { name: 'Genta Buana Al-Hakim', gender: 'L', parent: 'Kuswanto' },
      { name: 'Almira Shafa Salsabila', gender: 'P', parent: 'M. Iqbal, S.T.' },
      { name: 'Dzakyandra Putra', gender: 'L', parent: 'Suhendar' },
      { name: 'Kirana Larasati Husna', gender: 'P', parent: 'Arya Wiguna' },
    ],
  },
  {
    classId: 'c-4b',
    className: 'Kelas 4B',
    grade: 4,
    students: [
      { name: 'Alif Danuarta', gender: 'L', parent: 'Danu Pratama' },
      { name: 'Zaskia Adya Mecca Putri', gender: 'P', parent: 'H. Gunawan' },
      { name: 'Bagas Aditya Rahman', gender: 'L', parent: 'Kurniawan Dwi' },
      { name: 'Hana Khairunnisa Al-Baqir', gender: 'P', parent: 'dr. Baqir' },
      { name: 'Daffa Ibnu Sina', gender: 'L', parent: 'H. Sina Iskandar' },
      { name: 'Shafiyyah Nurul Ain', gender: 'P', parent: 'Hidayatullah' },
      { name: 'Arya Bimasena', gender: 'L', parent: 'Bima Satria' },
      { name: 'Zahra Amelia Ramadhan', gender: 'P', parent: 'Ramadhan Pohan' },
    ],
  },
  {
    classId: 'c-5a',
    className: 'Kelas 5A',
    grade: 5,
    students: [
      { name: 'Ahmad Zaki Ramadhan', gender: 'L', parent: 'H. Bambang Sudirman' },
      { name: 'Aisha Nur Syifa', gender: 'P', parent: 'Drs. Hendra Gunawan' },
      { name: 'Bilal Habibi', gender: 'L', parent: 'Suryo Utomo, S.T.' },
      { name: 'Fatimah Az-Zahra', gender: 'P', parent: 'H. Ridwan Kamil, S.Ag' },
      { name: 'Muhammad Al-Fatih', gender: 'L', parent: 'H. Fatih Kurnia' },
      { name: 'Nurul Izzati', gender: 'P', parent: 'Syamsudin' },
      { name: 'Rizki Dwi Saputra', gender: 'L', parent: 'H. Saputra Jaya' },
      { name: 'Hafizhah Khairina', gender: 'P', parent: 'Ir. Khairul Umam' },
      { name: 'Farhan Dwi Pratama', gender: 'L', parent: 'Bambang Irawan' },
      { name: 'Syifa Aulia Rahmi', gender: 'P', parent: 'dr. Rahmi Sp.A' },
    ],
  },
  {
    classId: 'c-5b',
    className: 'Kelas 5B',
    grade: 5,
    students: [
      { name: 'Ilham Maulana Syahputra', gender: 'L', parent: 'H. Syahputra Jaya' },
      { name: 'Kayla Nadira Azzahra', gender: 'P', parent: 'Dr. Heru Prasetyo' },
      { name: 'Danial Al-Kautsar', gender: 'L', parent: 'H. Kautsar Nur' },
      { name: 'Naura Syahla', gender: 'P', parent: 'Hadi Sucipto' },
      { name: 'Farras Haidar Akbar', gender: 'L', parent: 'Ir. Haidar' },
      { name: 'Aura Kasih Ramadhani', gender: 'P', parent: 'Sugeng Riyadi' },
      { name: 'Rafi Ahmad Fauzan', gender: 'L', parent: 'Fauzan Adzim' },
      { name: 'Meisya Aurelia', gender: 'P', parent: 'Asep Suparman' },
    ],
  },
  {
    classId: 'c-6a',
    className: 'Kelas 6A',
    grade: 6,
    students: [
      { name: 'Raden Fajar Pratama', gender: 'L', parent: 'Raden Subroto, M.Si' },
      { name: 'Zahra Qurrata Ayun', gender: 'P', parent: 'H. Ayun Shobirin' },
      { name: 'Ikhwanul Muslimin', gender: 'L', parent: 'H. Muslimin' },
      { name: 'Tasya Kamila Putri', gender: 'P', parent: 'Ir. Kamila' },
      { name: 'Muhammad Hasan Basri', gender: 'L', parent: 'Drs. Basri' },
      { name: 'Rania Salsabila', gender: 'P', parent: 'dr. Salsabila Sp.PD' },
      { name: 'Ali bin Abi Thalib Jr.', gender: 'L', parent: 'H. Thalib Ma\'ruf' },
      { name: 'Safina Az-Zahra', gender: 'P', parent: 'Suwandi' },
      { name: 'Wildan Maulana', gender: 'L', parent: 'Taufiq Hidayat' },
    ],
  },
  {
    classId: 'c-6b',
    className: 'Kelas 6B',
    grade: 6,
    students: [
      { name: 'Dimas Aryasuta Wibowo', gender: 'L', parent: 'Bambang Tri Wibowo' },
      { name: 'Anisa Tri Wahyuni', gender: 'P', parent: 'Wahyudi, S.Pd' },
      { name: 'Genta Pratama Putra', gender: 'L', parent: 'H. Genta Jaya' },
      { name: 'Chelsea Olivia Sholihat', gender: 'P', parent: 'Suhendra' },
      { name: 'Rendi Pangestu', gender: 'L', parent: 'Pangestu Adi' },
      { name: 'Devi Larasati Putri', gender: 'P', parent: 'Mulyadi' },
      { name: 'Yusuf Mansur Hidayat', gender: 'L', parent: 'Hidayatullah S.E.' },
      { name: 'Tiara Andini Santri', gender: 'P', parent: 'Santoso Nugroho' },
      { name: 'Zidan Al-Mubarak', gender: 'L', parent: 'Mubarak Ahmad' },
    ],
  },
];

// Generate the 100 students
export const SAMPLE_100_STUDENTS: User[] = [];
let studentCounter = 1;

CLASS_CONFIGS.forEach((cfg) => {
  cfg.students.forEach((s) => {
    const padded = String(studentCounter).padStart(3, '0');
    const nisnBase = `${cfg.grade}${padded}890123`.slice(0, 10);
    const uname = `siswa_${cfg.className.toLowerCase().replace(/[^a-z0-9]/g, '')}_${studentCounter}`;
    
    // Ahmad Zaki special ID keep user-siswa-1 for continuity
    const id = studentCounter === 67 ? 'user-siswa-1' : `user-std-${studentCounter}`;
    
    SAMPLE_100_STUDENTS.push({
      id: s.name.includes('Ahmad Zaki') ? 'user-siswa-1' : id,
      username: s.name.includes('Ahmad Zaki') ? 'siswa' : uname,
      name: s.name,
      role: 'SISWA',
      email: `${uname}@student.mi-assuyutiyah.sch.id`,
      password: '1234',
      avatar: s.gender === 'L'
        ? `https://images.unsplash.com/photo-${1535713875000 + (studentCounter % 100)}?w=150&auto=format&fit=crop&q=80`
        : `https://images.unsplash.com/photo-${1544005313000 + (studentCounter % 100)}?w=150&auto=format&fit=crop&q=80`,
      nisn: s.name.includes('Ahmad Zaki') ? '0098765432' : nisnBase,
      classId: cfg.classId,
      className: cfg.className,
      gender: s.gender,
      parentName: s.parent,
      parentPhone: `0812-77${String(studentCounter).padStart(2, '0')}-9900`,
      address: `Jl. Santri Assuyutiyah No. ${studentCounter}, Sukamaju`,
      achievementBadge: s.name.includes('Muhammad Rizki Pratama')
        ? 'Siswa Berprestasi (Nilai Tertinggi Kelas 3C - Rekomendasi Akselerasi ke Kelas 4A)'
        : undefined,
      mutations: [],
    });
    studentCounter++;
  });
});

// Full 100 students list verified (length: 100)
// Now generate realistic academic grades for all 100 students across the key subjects
const SUBJECT_POOL = [
  { id: 'sb-1', name: "Al-Qur'an Hadis" },
  { id: 'sb-2', name: 'Akidah Akhlak' },
  { id: 'sb-3', name: 'Fikih' },
  { id: 'sb-4', name: 'Sejarah Kebudayaan Islam (SKI)' },
  { id: 'sb-5', name: 'Bahasa Arab' },
  { id: 'sb-6', name: 'Matematika' },
  { id: 'sb-7', name: 'IPAS (Sains & Sosial)' },
  { id: 'sb-8', name: 'Bahasa Indonesia' },
  { id: 'sb-9', name: 'Pendidikan Pancasila' },
  { id: 'sb-10', name: 'PJOK' },
];

export const SAMPLE_EXTENDED_GRADES: AcademicGrade[] = [];
let gradeCounter = 1;

SAMPLE_100_STUDENTS.forEach((student, sIdx) => {
  // Varied student performance profile: high, mid, improving, etc.
  // base offset based on index to create rich ledger distribution
  const baseScore = 75 + ((sIdx * 7) % 20); // 75 to 94

  SUBJECT_POOL.forEach((sb, sbIdx) => {
    const variation = ((sIdx + sbIdx * 3) % 9) - 3; // -3 to +5
    const finalScore = Math.min(99, Math.max(76, baseScore + variation));
    const uts = Math.min(99, Math.max(74, finalScore - 2 + (sbIdx % 4)));
    const uas = Math.min(100, Math.max(75, finalScore + 1 - (sIdx % 3)));
    const tugas = Math.min(100, Math.max(78, finalScore + (sbIdx % 3)));
    const predikat: 'A' | 'B' | 'C' | 'D' = finalScore >= 90 ? 'A' : finalScore >= 80 ? 'B' : finalScore >= 70 ? 'C' : 'D';

    let capaian = `Menunjukkan penguasaan materi ${sb.name} dengan predikat ${predikat}.`;
    if (predikat === 'A') {
      capaian = `Sangat terampil dan mahir dalam memahami konsep serta praktik ibadah/kaidah ${sb.name}.`;
    } else if (predikat === 'B') {
      capaian = `Baik dalam menguasai kompetensi dasar ${sb.name}, perlu ditingkatkan pada latihan mandiri.`;
    }

    SAMPLE_EXTENDED_GRADES.push({
      id: `grd-ext-${gradeCounter++}`,
      studentId: student.id,
      studentName: student.name,
      studentNisn: student.nisn || '0000000000',
      classId: student.classId || 'c-5a',
      className: student.className || 'Kelas 5A',
      subjectId: sb.id,
      subjectName: sb.name,
      semester: 'Genap',
      academicYear: '2024/2025',
      nilaiTugas: tugas,
      nilaiUTS: uts,
      nilaiUAS: uas,
      nilaiAkhir: finalScore,
      predikat: predikat,
      capaianKompetensi: capaian,
    });
  });
});

// Daily attendance records for all 20 teachers across multiple dates
const ATTENDANCE_DATES = ['2026-10-15', '2026-10-16', '2026-10-17'];
export const SAMPLE_20_TEACHER_ATTENDANCE: TeacherAttendanceRecord[] = [];
let tAttCounter = 1;

ATTENDANCE_DATES.forEach((date) => {
  SAMPLE_20_TEACHERS.forEach((teacher, tIdx) => {
    // Realistic dynamics: most present, occasional Izin/Sakit/Dinas
    let status: TeacherAttendanceStatus = 'Hadir';
    let checkIn = `06:${String(35 + (tIdx % 22)).padStart(2, '0')}`;
    let checkOut = `14:${String(10 + (tIdx % 20)).padStart(2, '0')}`;
    let notes = 'Hadir tepat waktu dan melaksanakan jam mengajar.';

    if (date === '2026-10-17') {
      if (tIdx === 6) {
        status = 'Izin';
        checkIn = '-';
        checkOut = '-';
        notes = 'Izin menghadiri bimbingan teknis kurikulum Kemenag.';
      } else if (tIdx === 12) {
        status = 'Sakit';
        checkIn = '-';
        checkOut = '-';
        notes = 'Surat keterangan sakit dari dokter terlampir.';
      } else if (tIdx === 17) {
        status = 'Dinas Luar';
        checkIn = '07:15';
        checkOut = '15:30';
        notes = 'Mendampingi santri kontingen lomba silat tingkat kabupaten.';
      }
    } else if (date === '2026-10-16') {
      if (tIdx === 4) {
        status = 'Izin';
        checkIn = '-';
        checkOut = '-';
        notes = 'Izin keperluan keluarga mendesak.';
      }
    }

    SAMPLE_20_TEACHER_ATTENDANCE.push({
      id: `t-att-gen-${tAttCounter++}`,
      date,
      teacherId: teacher.id,
      teacherName: teacher.name,
      nip: teacher.nip,
      checkInTime: checkIn,
      checkOutTime: checkOut,
      status,
      subjectSummary: teacher.subjectsTaught?.join(', ') || 'Guru Kelas',
      notes,
    });
  });
});

// Sample student attendance records for classes across dates
export const SAMPLE_STUDENT_ATTENDANCES: AttendanceRecord[] = [];
let sAttCounter = 1;

ATTENDANCE_DATES.forEach((date) => {
  SAMPLE_100_STUDENTS.forEach((student, sIdx) => {
    let status: 'Hadir' | 'Sakit' | 'Izin' | 'Alpa' = 'Hadir';
    let notes = '';

    if ((sIdx * 3 + date.length) % 25 === 0) {
      status = 'Sakit';
      notes = 'Demam';
    } else if ((sIdx * 7 + date.length) % 31 === 0) {
      status = 'Izin';
      notes = 'Acara keluarga';
    }

    SAMPLE_STUDENT_ATTENDANCES.push({
      id: `att-gen-${sAttCounter++}`,
      date,
      classId: student.classId || 'c-5a',
      studentId: student.id,
      studentName: student.name,
      status,
      notes,
    });
  });
});
