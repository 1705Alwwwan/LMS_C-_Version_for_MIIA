import express, { Request, Response, Router } from 'express';
import {
  INITIAL_USERS,
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
  INITIAL_SCHEDULES,
  INITIAL_MATERIALS,
  INITIAL_ASSIGNMENTS,
  INITIAL_GRADES,
  INITIAL_INVOICES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_TEACHER_ATTENDANCE,
  INITIAL_ATTENDANCE,
} from '../data/mockData';
import { User, ClassRoom, Subject, ScheduleItem, AttendanceRecord, AcademicGrade, FinanceInvoice, SchoolAnnouncement } from '../types/lms';

// In-memory data stores initialized with seed data for active runtime manipulation
let usersStore: User[] = [...INITIAL_USERS];
let classesStore: ClassRoom[] = [...INITIAL_CLASSES];
let subjectsStore: Subject[] = [...INITIAL_SUBJECTS];
let scheduleStore: ScheduleItem[] = [...INITIAL_SCHEDULES];
let studentAttendanceStore: AttendanceRecord[] = [...INITIAL_ATTENDANCE];
let teacherAttendanceStore = [...INITIAL_TEACHER_ATTENDANCE];
let gradesStore: AcademicGrade[] = [...INITIAL_GRADES];
let invoicesStore: FinanceInvoice[] = [...INITIAL_INVOICES];
let announcementsStore = [...INITIAL_ANNOUNCEMENTS];
let materialsStore = [...INITIAL_MATERIALS];
let assignmentsStore = [...INITIAL_ASSIGNMENTS];

export const createApiRouter = (): Router => {
  const router = express.Router();

  // Helper response wrapper
  const sendSuccess = (res: Response, data: any, message = 'Success', status = 200, meta?: any) => {
    return res.status(status).json({
      success: true,
      message,
      data,
      ...(meta ? { meta } : {}),
      timestamp: new Date().toISOString(),
    });
  };

  const sendError = (res: Response, message: string, status = 400, errors?: any) => {
    return res.status(status).json({
      success: false,
      message,
      ...(errors ? { errors } : {}),
      timestamp: new Date().toISOString(),
    });
  };

  // ----------------------------------------------------------------------
  // 1. HEALTHCHECK & SYSTEM INFO
  // ----------------------------------------------------------------------
  router.get('/health', (_req: Request, res: Response) => {
    res.json({
      status: 'UP',
      app: 'LMS MI Assuyutiyah Digital Backend API',
      version: '1.2.0',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
      stats: {
        totalStudents: usersStore.filter((u) => u.role === 'SISWA').length,
        totalTeachers: usersStore.filter((u) => u.role === 'GURU').length,
        totalClasses: classesStore.length,
        totalSubjects: subjectsStore.length,
      },
    });
  });

  // ----------------------------------------------------------------------
  // 2. OPENAPI 3.0 SPECIFICATION
  // ----------------------------------------------------------------------
  router.get('/openapi.json', (req: Request, res: Response) => {
    const protocol = req.protocol;
    const host = req.get('host') || 'localhost:3000';
    const baseUrl = `${protocol}://${host}/api`;

    res.json({
      openapi: '3.0.3',
      info: {
        title: 'LMS MI Assuyutiyah RESTful API',
        version: '1.2.0',
        description:
          'Open API untuk Sistem Pembelajaran Digital Terpadu Madrasah Ibtidaiyah Assuyutiyah. Mendukung integrasi aplikasi Android, iOS, sistem Kemenag, absensi sidik jari/RFID, dan bot WhatsApp.',
        contact: {
          name: 'Tim IT MI Assuyutiyah',
          email: 'it@mi-assuyutiyah.sch.id',
        },
      },
      servers: [{ url: baseUrl, description: 'Current Server Instance' }],
      paths: {
        '/health': {
          get: {
            summary: 'Periksa status kesehatan server dan sistem',
            responses: { 200: { description: 'Server aktif dan sehat' } },
          },
        },
        '/auth/login': {
          post: {
            summary: 'Login pengguna (Admin, Guru, Siswa)',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      username: { type: 'string', example: 'admin' },
                      password: { type: 'string', example: 'Admin#123' },
                    },
                    required: ['username', 'password'],
                  },
                },
              },
            },
            responses: {
              200: { description: 'Login berhasil, token dan profil dikembalikan' },
              401: { description: 'Kredensial tidak valid' },
            },
          },
        },
        '/students': {
          get: {
            summary: 'Daftar data siswa dengan filter dan pencarian',
            parameters: [
              { name: 'q', in: 'query', schema: { type: 'string' }, description: 'Cari nama atau NISN' },
              { name: 'classId', in: 'query', schema: { type: 'string' }, description: 'ID Kelas (misal c-1a)' },
              { name: 'grade', in: 'query', schema: { type: 'integer' }, description: 'Tingkat kelas (1-6)' },
              { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
              { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            ],
            responses: { 200: { description: 'Daftar siswa berhasil diambil' } },
          },
          post: {
            summary: 'Tambah data siswa baru',
            responses: { 201: { description: 'Siswa berhasil ditambahkan' } },
          },
        },
        '/students/{id}': {
          get: {
            summary: 'Ambil profil siswa berdasarkan ID atau NISN',
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: 'Profil siswa' }, 404: { description: 'Tidak ditemukan' } },
          },
          put: {
            summary: 'Perbarui data siswa',
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: 'Pembaruan berhasil' } },
          },
        },
        '/teachers': {
          get: {
            summary: 'Daftar guru dan wali kelas',
            responses: { 200: { description: 'Daftar guru' } },
          },
        },
        '/classes': {
          get: {
            summary: 'Daftar kelas rombel Madrasah',
            responses: { 200: { description: 'Daftar kelas' } },
          },
        },
        '/subjects': {
          get: {
            summary: 'Daftar mata pelajaran (Kemenag & Umum)',
            responses: { 200: { description: 'Daftar mata pelajaran' } },
          },
        },
        '/schedules': {
          get: {
            summary: 'Jadwal pelajaran',
            parameters: [
              { name: 'classId', in: 'query', schema: { type: 'string' } },
              { name: 'day', in: 'query', schema: { type: 'string' } },
            ],
            responses: { 200: { description: 'Jadwal pelajaran' } },
          },
        },
        '/attendance': {
          get: {
            summary: 'Rekap kehadiran siswa',
            parameters: [
              { name: 'date', in: 'query', schema: { type: 'string' } },
              { name: 'classId', in: 'query', schema: { type: 'string' } },
            ],
            responses: { 200: { description: 'Data kehadiran' } },
          },
          post: {
            summary: 'Input absensi siswa baru (tunggal atau batch)',
            responses: { 201: { description: 'Absensi tercatat' } },
          },
        },
        '/finance/invoices': {
          get: {
            summary: 'Daftar tagihan & kwitansi SPP',
            responses: { 200: { description: 'Daftar tagihan' } },
          },
        },
        '/finance/stats': {
          get: {
            summary: 'Statistik keuangan dan pembayaran SPP',
            responses: { 200: { description: 'Statistik keuangan' } },
          },
        },
        '/announcements': {
          get: {
            summary: 'Pengumuman resmi madrasah',
            responses: { 200: { description: 'Daftar pengumuman' } },
          },
        },
        '/stats': {
          get: {
            summary: 'Ringkasan metrik dashboard',
            responses: { 200: { description: 'Ringkasan metrik' } },
          },
        },
      },
    });
  });

  // ----------------------------------------------------------------------
  // 3. AUTHENTICATION
  // ----------------------------------------------------------------------
  router.post('/auth/login', (req: Request, res: Response) => {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return sendError(res, 'Username dan password wajib diisi', 400);
    }

    const trimmedUser = String(username).trim().toLowerCase();
    const user = usersStore.find(
      (u) =>
        u.username.toLowerCase() === trimmedUser ||
        (u.email && u.email.toLowerCase() === trimmedUser) ||
        (u.nisn && u.nisn === trimmedUser) ||
        (u.nip && u.nip === trimmedUser)
    );

    if (!user) {
      return sendError(res, 'Akun pengguna tidak ditemukan', 401);
    }

    // Check password (supports default seeds: Admin#123, Guru#123, Siswa#123 or direct match)
    const validPassword =
      user.password === password ||
      (user.role === 'ADMIN' && password === 'Admin#123') ||
      (user.role === 'GURU' && password === 'Guru#123') ||
      (user.role === 'SISWA' && password === 'Siswa#123');

    if (!validPassword) {
      return sendError(res, 'Kata sandi salah. Silakan periksa kembali kredensial Anda.', 401);
    }

    const { password: _, ...userSafe } = user;
    const mockToken = `jwt-token-${user.id}-${Date.now().toString(36)}`;

    return sendSuccess(res, {
      token: mockToken,
      tokenType: 'Bearer',
      expiresIn: '7d',
      user: userSafe,
    }, 'Login berhasil');
  });

  // ----------------------------------------------------------------------
  // 4. OVERALL STATS
  // ----------------------------------------------------------------------
  router.get('/stats', (_req: Request, res: Response) => {
    const students = usersStore.filter((u) => u.role === 'SISWA');
    const teachers = usersStore.filter((u) => u.role === 'GURU');
    const paidInvoices = invoicesStore.filter((i) => i.status === 'LUNAS');
    const unpaidInvoices = invoicesStore.filter((i) => i.status === 'BELUM LUNAS');
    const totalCollected = paidInvoices.reduce((acc, curr) => acc + curr.amount, 0);
    const totalOutstanding = unpaidInvoices.reduce((acc, curr) => acc + curr.amount, 0);

    return sendSuccess(res, {
      totalStudents: students.length,
      totalTeachers: teachers.length,
      totalClasses: classesStore.length,
      totalSubjects: subjectsStore.length,
      totalAssignments: assignmentsStore.length,
      totalMaterials: materialsStore.length,
      finance: {
        totalCollected,
        totalOutstanding,
        collectionRate: invoicesStore.length > 0 ? Math.round((paidInvoices.length / invoicesStore.length) * 100) : 0,
      },
      academicYear: '2024/2025 Genap',
      curriculum: 'Kurikulum Merdeka & Kemenag Madrasah',
    });
  });

  // ----------------------------------------------------------------------
  // 5. STUDENTS (CRUD & FILTERING)
  // ----------------------------------------------------------------------
  router.get('/students', (req: Request, res: Response) => {
    let students = usersStore.filter((u) => u.role === 'SISWA');

    const { q, classId, grade, gender, page = '1', limit = '50' } = req.query;

    if (q) {
      const search = String(q).toLowerCase();
      students = students.filter(
        (s) =>
          s.name.toLowerCase().includes(search) ||
          (s.nisn && s.nisn.includes(search)) ||
          (s.className && s.className.toLowerCase().includes(search))
      );
    }

    if (classId) {
      students = students.filter((s) => s.classId === String(classId));
    }

    if (grade) {
      students = students.filter((s) => {
        const cls = classesStore.find((c) => c.id === s.classId);
        return cls && cls.grade === Number(grade);
      });
    }

    if (gender) {
      students = students.filter((s) => s.gender === String(gender).toUpperCase());
    }

    const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
    const limitNum = Math.max(1, parseInt(String(limit), 10) || 50);
    const total = students.length;
    const totalPages = Math.ceil(total / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = students.slice(startIndex, startIndex + limitNum);

    const safeData = paginated.map(({ password: _, ...s }) => s);

    return sendSuccess(res, safeData, 'Daftar siswa berhasil diambil', 200, {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
    });
  });

  router.get('/students/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const student = usersStore.find((u) => u.role === 'SISWA' && (u.id === id || u.nisn === id));
    if (!student) {
      return sendError(res, 'Siswa tidak ditemukan', 404);
    }
    const { password: _, ...safeStudent } = student;
    return sendSuccess(res, safeStudent);
  });

  router.post('/students', (req: Request, res: Response) => {
    const { name, nisn, classId, className, gender, parentName, parentPhone, address } = req.body;

    if (!name || !nisn || !classId) {
      return sendError(res, 'Nama, NISN, dan Kelas wajib diisi', 400);
    }

    // Check NISN duplicate
    if (usersStore.some((u) => u.nisn === nisn)) {
      return sendError(res, `Siswa dengan NISN ${nisn} sudah terdaftar`, 409);
    }

    const matchedClass = classesStore.find((c) => c.id === classId);
    const newStudent: User = {
      id: `user-siswa-${Date.now()}`,
      username: `siswa_${nisn}`,
      name,
      role: 'SISWA',
      nisn,
      email: `${nisn}@siswa.mi-assuyutiyah.sch.id`,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      gender: gender === 'P' ? 'P' : 'L',
      classId,
      className: className || (matchedClass ? matchedClass.name : 'Kelas Belum Ditentukan'),
      parentName: parentName || 'Wali Santri',
      parentPhone: parentPhone || '08xxxxxxxxxx',
      address: address || 'Domisili Pesantren Assuyutiyah',
      password: 'Siswa#123',
    };

    usersStore.push(newStudent);
    if (matchedClass) {
      matchedClass.totalStudents += 1;
    }

    const { password: _, ...safeStudent } = newStudent;
    return sendSuccess(res, safeStudent, 'Siswa berhasil ditambahkan', 201);
  });

  router.put('/students/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = usersStore.findIndex((u) => u.role === 'SISWA' && (u.id === id || u.nisn === id));
    if (index === -1) {
      return sendError(res, 'Siswa tidak ditemukan', 404);
    }

    const updated = {
      ...usersStore[index],
      ...req.body,
      id: usersStore[index].id,
      role: 'SISWA' as const,
    };

    usersStore[index] = updated;
    const { password: _, ...safeStudent } = updated;
    return sendSuccess(res, safeStudent, 'Data siswa berhasil diperbarui');
  });

  router.delete('/students/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = usersStore.findIndex((u) => u.role === 'SISWA' && (u.id === id || u.nisn === id));
    if (index === -1) {
      return sendError(res, 'Siswa tidak ditemukan', 404);
    }
    const deleted = usersStore.splice(index, 1)[0];
    return sendSuccess(res, { id: deleted.id, name: deleted.name }, 'Siswa berhasil dihapus');
  });

  // ----------------------------------------------------------------------
  // 6. TEACHERS
  // ----------------------------------------------------------------------
  router.get('/teachers', (req: Request, res: Response) => {
    let teachers = usersStore.filter((u) => u.role === 'GURU');
    const { q, teacherType, subject } = req.query;

    if (q) {
      const search = String(q).toLowerCase();
      teachers = teachers.filter(
        (t) =>
          t.name.toLowerCase().includes(search) ||
          (t.nip && t.nip.includes(search)) ||
          (t.position && t.position.toLowerCase().includes(search))
      );
    }

    if (teacherType) {
      teachers = teachers.filter((t) => t.teacherType === String(teacherType));
    }

    if (subject) {
      teachers = teachers.filter((t) =>
        t.subjectsTaught?.some((s) => s.toLowerCase().includes(String(subject).toLowerCase()))
      );
    }

    const safeData = teachers.map(({ password: _, ...t }) => t);
    return sendSuccess(res, safeData, 'Daftar guru berhasil diambil');
  });

  router.get('/teachers/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const teacher = usersStore.find((u) => u.role === 'GURU' && (u.id === id || u.nip === id));
    if (!teacher) {
      return sendError(res, 'Guru tidak ditemukan', 404);
    }
    const { password: _, ...safeTeacher } = teacher;
    return sendSuccess(res, safeTeacher);
  });

  // ----------------------------------------------------------------------
  // 7. CLASSES & SUBJECTS
  // ----------------------------------------------------------------------
  router.get('/classes', (_req: Request, res: Response) => {
    return sendSuccess(res, classesStore, 'Daftar rombel kelas berhasil diambil');
  });

  router.get('/classes/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const cls = classesStore.find((c) => c.id === id);
    if (!cls) {
      return sendError(res, 'Kelas tidak ditemukan', 404);
    }
    const studentsInClass = usersStore
      .filter((u) => u.role === 'SISWA' && u.classId === cls.id)
      .map(({ password: _, ...s }) => s);

    return sendSuccess(res, { ...cls, students: studentsInClass });
  });

  router.get('/subjects', (req: Request, res: Response) => {
    return sendSuccess(res, subjectsStore, 'Daftar mata pelajaran');
  });

  // ----------------------------------------------------------------------
  // 8. SCHEDULES
  // ----------------------------------------------------------------------
  router.get('/schedules', (req: Request, res: Response) => {
    const { classId, day, teacherId } = req.query;
    let schedules = [...scheduleStore];

    if (classId) {
      schedules = schedules.filter((s) => s.classId === String(classId));
    }
    if (day) {
      schedules = schedules.filter((s) => s.day === String(day));
    }
    if (teacherId) {
      schedules = schedules.filter((s) => s.teacherId === String(teacherId));
    }

    return sendSuccess(res, schedules, 'Jadwal pelajaran berhasil diambil');
  });

  // ----------------------------------------------------------------------
  // 9. ATTENDANCE (STUDENTS & TEACHERS)
  // ----------------------------------------------------------------------
  router.get('/attendance', (req: Request, res: Response) => {
    const { date, classId, studentId } = req.query;
    let records = [...studentAttendanceStore];

    if (date) {
      records = records.filter((r) => r.date === String(date));
    }
    if (classId) {
      records = records.filter((r) => r.classId === String(classId));
    }
    if (studentId) {
      records = records.filter((r) => r.studentId === String(studentId));
    }

    return sendSuccess(res, records, 'Data absensi siswa');
  });

  router.post('/attendance', (req: Request, res: Response) => {
    const payload = req.body;
    if (Array.isArray(payload)) {
      // Bulk attendance insertion
      const inserted: AttendanceRecord[] = payload.map((item, idx) => ({
        id: item.id || `att-${Date.now()}-${idx}`,
        date: item.date || new Date().toISOString().split('T')[0],
        classId: item.classId,
        studentId: item.studentId,
        studentName: item.studentName || 'Santri',
        status: item.status || 'Hadir',
        notes: item.notes || '',
      }));
      studentAttendanceStore.unshift(...inserted);
      return sendSuccess(res, inserted, `${inserted.length} data absensi berhasil disimpan`, 201);
    } else {
      const { classId, studentId, studentName, status, date, notes } = payload;
      if (!classId || !studentId) {
        return sendError(res, 'classId dan studentId wajib diisi', 400);
      }
      const newRecord: AttendanceRecord = {
        id: `att-${Date.now()}`,
        date: date || new Date().toISOString().split('T')[0],
        classId,
        studentId,
        studentName: studentName || 'Santri',
        status: status || 'Hadir',
        notes: notes || '',
      };
      studentAttendanceStore.unshift(newRecord);
      return sendSuccess(res, newRecord, 'Absensi santri berhasil dicatat', 201);
    }
  });

  router.get('/teacher-attendance', (req: Request, res: Response) => {
    const { date, teacherId } = req.query;
    let records = [...teacherAttendanceStore];
    if (date) {
      records = records.filter((r) => r.date === String(date));
    }
    if (teacherId) {
      records = records.filter((r) => r.teacherId === String(teacherId));
    }
    return sendSuccess(res, records, 'Presensi kehadiran dewan guru');
  });

  // ----------------------------------------------------------------------
  // 10. GRADES & ACADEMICS
  // ----------------------------------------------------------------------
  router.get('/grades', (req: Request, res: Response) => {
    const { studentId, classId, subjectId } = req.query;
    let grades = [...gradesStore];

    if (studentId) {
      grades = grades.filter((g) => g.studentId === String(studentId));
    }
    if (classId) {
      grades = grades.filter((g) => g.classId === String(classId));
    }
    if (subjectId) {
      grades = grades.filter((g) => g.subjectId === String(subjectId));
    }

    return sendSuccess(res, grades, 'Data nilai akademik');
  });

  // ----------------------------------------------------------------------
  // 11. FINANCE & SPP INVOICES
  // ----------------------------------------------------------------------
  router.get('/finance/invoices', (req: Request, res: Response) => {
    const { studentId, status, month, year } = req.query;
    let invoices = [...invoicesStore];

    if (studentId) {
      invoices = invoices.filter((i) => i.studentId === String(studentId));
    }
    if (status) {
      invoices = invoices.filter((i) => i.status === String(status));
    }
    if (month) {
      invoices = invoices.filter((i) => i.month.toLowerCase().includes(String(month).toLowerCase()));
    }
    if (year) {
      invoices = invoices.filter((i) => i.dueDate.startsWith(String(year)) || i.month.includes(String(year)));
    }

    return sendSuccess(res, invoices, 'Daftar invoice SPP');
  });

  router.put('/finance/invoices/:id/pay', (req: Request, res: Response) => {
    const { id } = req.params;
    const { paymentMethod = 'Tunai di TU', receivedBy = 'Staf Tata Usaha' } = req.body;

    const invoice = invoicesStore.find((i) => i.id === id);
    if (!invoice) {
      return sendError(res, 'Invoice tidak ditemukan', 404);
    }

    invoice.status = 'LUNAS';
    invoice.paymentDate = new Date().toISOString().split('T')[0];
    invoice.paymentMethod = (paymentMethod as any) || 'Tunai di TU';
    if (receivedBy) {
      invoice.notes = invoice.notes ? `${invoice.notes} | Diterima oleh: ${receivedBy}` : `Diterima oleh: ${receivedBy}`;
    }
    invoice.receiptNumber = `KW-ASY-${Date.now().toString().slice(-6)}`;

    return sendSuccess(res, invoice, 'Pembayaran SPP berhasil diverifikasi dan dicatat');
  });

  router.get('/finance/stats', (_req: Request, res: Response) => {
    const paid = invoicesStore.filter((i) => i.status === 'LUNAS');
    const unpaid = invoicesStore.filter((i) => i.status === 'BELUM LUNAS');
    const totalCollected = paid.reduce((sum, item) => sum + item.amount, 0);
    const totalOutstanding = unpaid.reduce((sum, item) => sum + item.amount, 0);

    return sendSuccess(res, {
      totalInvoices: invoicesStore.length,
      paidCount: paid.length,
      unpaidCount: unpaid.length,
      totalCollected,
      totalOutstanding,
      collectionRate: invoicesStore.length > 0 ? ((paid.length / invoicesStore.length) * 100).toFixed(1) + '%' : '0%',
    });
  });

  // ----------------------------------------------------------------------
  // 12. ANNOUNCEMENTS & MATERIALS
  // ----------------------------------------------------------------------
  router.get('/announcements', (_req: Request, res: Response) => {
    return sendSuccess(res, announcementsStore, 'Pengumuman resmi madrasah');
  });

  router.post('/announcements', (req: Request, res: Response) => {
    const { title, content, targetRole = 'ALL', priority = 'Biasa', authorName = 'Humas Madrasah' } = req.body;
    if (!title || !content) {
      return sendError(res, 'Judul dan konten pengumuman wajib diisi', 400);
    }

    const newAnnouncement: SchoolAnnouncement = {
      id: `ann-${Date.now()}`,
      title,
      content,
      targetRole,
      priority,
      author: authorName,
      date: new Date().toISOString().split('T')[0],
    };

    announcementsStore.unshift(newAnnouncement);
    return sendSuccess(res, newAnnouncement, 'Pengumuman berhasil dipublikasikan', 201);
  });

  router.get('/materials', (_req: Request, res: Response) => {
    return sendSuccess(res, materialsStore, 'Materi pembelajaran dan modul');
  });

  router.get('/assignments', (_req: Request, res: Response) => {
    return sendSuccess(res, assignmentsStore, 'Daftar penugasan dan PR');
  });

  return router;
};
