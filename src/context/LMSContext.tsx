import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  ClassRoom,
  Subject,
  ScheduleItem,
  AttendanceRecord,
  LearningMaterial,
  Assignment,
  StudentSubmission,
  Quiz,
  QuizAttempt,
  AcademicGrade,
  FinanceInvoice,
  SchoolExpense,
  SchoolAnnouncement,
  SchoolAgenda,
  FeeTariff,
  TeacherAttendanceRecord,
  HistoricalSemesterGrade,
  MutabaahEntry,
  AcademicCalendarEvent,
} from '../types/lms';
import {
  INITIAL_USERS,
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
  INITIAL_SCHEDULES,
  INITIAL_ATTENDANCE,
  INITIAL_MATERIALS,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_QUIZZES,
  INITIAL_QUIZ_ATTEMPTS,
  INITIAL_GRADES,
  INITIAL_INVOICES,
  INITIAL_EXPENSES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_AGENDAS,
  INITIAL_FEE_TARIFFS,
  INITIAL_TEACHER_ATTENDANCE,
  HISTORICAL_GRADES_ZAKI,
  INITIAL_MUTABAAH,
  INITIAL_ACADEMIC_CALENDAR,
} from '../data/mockData';

interface LMSContextType {
  currentUser: User | null;
  activeRole: UserRole | null;
  currentView: string;
  setCurrentView: (view: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarCollapse: () => void;
  login: (username: string, password?: string) => boolean;
  loginAsRole: (role: UserRole) => void;
  logout: () => void;
  resetPassword: (identifier: string) => { success: boolean; message: string };

  // Data states
  users: User[];
  classes: ClassRoom[];
  subjects: Subject[];
  schedules: ScheduleItem[];
  attendances: AttendanceRecord[];
  materials: LearningMaterial[];
  assignments: Assignment[];
  submissions: StudentSubmission[];
  quizzes: Quiz[];
  quizAttempts: QuizAttempt[];
  grades: AcademicGrade[];
  invoices: FinanceInvoice[];
  expenses: SchoolExpense[];
  announcements: SchoolAnnouncement[];
  agendas: SchoolAgenda[];
  teacherAttendances: TeacherAttendanceRecord[];
  historicalGrades: HistoricalSemesterGrade[];

  // Mutations
  saveTeacherAttendance: (records: TeacherAttendanceRecord[]) => void;
  updateTeacherAttendance: (id: string, updated: Partial<TeacherAttendanceRecord>) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;

  updateClassWali: (classId: string, waliKelasId: string, waliKelasName: string) => void;
  addClass: (newClass: Omit<ClassRoom, 'id'>) => void;
  updateClass: (id: string, updated: Partial<ClassRoom>) => void;
  deleteClass: (id: string) => void;

  addSubject: (subject: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, subject: Partial<Subject>) => void;
  addScheduleItem: (item: Omit<ScheduleItem, 'id'>) => void;
  deleteScheduleItem: (id: string) => void;

  saveAttendance: (records: AttendanceRecord[]) => void;

  addMaterial: (material: Omit<LearningMaterial, 'id' | 'createdAt'>) => void;
  deleteMaterial: (id: string) => void;

  addAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt'>) => void;
  submitAssignment: (submission: Omit<StudentSubmission, 'id' | 'submittedAt' | 'status'>) => void;
  gradeSubmission: (id: string, score: number, feedback: string, gradedBy: string) => void;

  addQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt'>) => void;
  submitQuizAttempt: (attempt: Omit<QuizAttempt, 'id' | 'completedAt'>) => void;

  updateGrade: (id: string, data: Partial<AcademicGrade>) => void;

  feeTariffs: FeeTariff[];
  updateFeeTariff: (id: string, updated: Partial<FeeTariff>) => void;
  addInvoice: (invoice: Omit<FinanceInvoice, 'id' | 'invoiceNumber'>) => void;
  updateInvoice: (id: string, updated: Partial<FinanceInvoice>) => void;
  deleteInvoice: (id: string) => void;
  payInvoice: (invoiceId: string, paymentMethod: FinanceInvoice['paymentMethod']) => void;
  addExpense: (expense: Omit<SchoolExpense, 'id'>) => void;

  addAnnouncement: (announcement: Omit<SchoolAnnouncement, 'id' | 'date'>) => void;
  addAgenda: (agenda: Omit<SchoolAgenda, 'id'>) => void;

  // Mutaba'ah & Catatan Akhlak
  mutabaahList: MutabaahEntry[];
  saveMutabaahEntry: (entry: MutabaahEntry) => void;
  verifyMutabaahByTeacher: (id: string, teacherNote: string, badge?: MutabaahEntry['characterBadge'], score?: number) => void;
  verifyMutabaahByParent: (id: string, parentNote: string) => void;

  // Kalender Pendidikan
  academicCalendar: AcademicCalendarEvent[];
  addCalendarEvent: (event: Omit<AcademicCalendarEvent, 'id'>, broadcastToAgenda?: boolean) => void;
  updateCalendarEvent: (id: string, updated: Partial<AcademicCalendarEvent>) => void;
  deleteCalendarEvent: (id: string) => void;

  // Promosi Massal Rombel
  promoteClassBatch: (fromClassId: string, toClassId: string, studentIds: string[], newAcademicYear: string) => { success: boolean; count: number; message: string };

  // Logout Verification Modal
  isLogoutModalOpen: boolean;
  setIsLogoutModalOpen: (open: boolean) => void;
  requestLogout: () => void;
  confirmLogout: () => void;
}

const LMSContext = createContext<LMSContextType | undefined>(undefined);

export const LMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try loading from localStorage or fallback to defaults
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('mi_lms_currentUser');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null;
  });

  const [currentView, setCurrentView] = useState<string>(() => {
    return currentUser ? 'dashboard' : 'landing';
  });

  const [users, setUsers] = useState<User[]>(() => {
    const s = localStorage.getItem('mi_lms_users');
    let list: User[] = s ? JSON.parse(s) : INITIAL_USERS;
    if (list.length < 100 || !list.some((u) => u.teacherType) || !list.some((u) => u.name.includes('Muhammad Rizki Pratama'))) {
      list = INITIAL_USERS;
    }

    // Check if farhan already exists or if there's an account with name 'farhan' or username 'f'
    const farhanIndex = list.findIndex(
      (u) =>
        u.username?.toLowerCase() === 'farhan' ||
        u.username?.toLowerCase() === 'f' ||
        u.name?.toLowerCase().includes('farhan')
    );

    if (farhanIndex >= 0) {
      list[farhanIndex] = {
        ...list[farhanIndex],
        username: 'farhan',
        password: list[farhanIndex].password || '1234',
        teacherType: list[farhanIndex].teacherType || 'WALI_KELAS',
        waliClassId: list[farhanIndex].waliClassId || 'c-6b',
        waliClassName: list[farhanIndex].waliClassName || 'Kelas 6B',
      };
    } else {
      list.unshift({
        id: 'user-farhan',
        username: 'farhan',
        name: 'Farhan, S.Pd',
        role: 'GURU',
        teacherType: 'WALI_KELAS',
        waliClassId: 'c-6b',
        waliClassName: 'Kelas 6B',
        password: '1234',
        email: 'farhan@mi-assuyutiyah.sch.id',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        nip: '199001012024011001',
        phone: '0812-3456-7890',
        gender: 'L',
        assignedClasses: ['6B'],
        subjectsTaught: ['Informatika & Literasi Digital', 'Fikih'],
        address: 'Jl. Pesantren Assuyutiyah No. 15',
      });
    }

    return list;
  });

  const [classes, setClasses] = useState<ClassRoom[]>(() => {
    const s = localStorage.getItem('mi_lms_classes');
    let list: ClassRoom[] = s ? JSON.parse(s) : INITIAL_CLASSES;
    if (list.length < 13 || !list.some((c) => c.id === 'c-3c')) {
      list = INITIAL_CLASSES;
    }
    return list;
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const s = localStorage.getItem('mi_lms_subjects');
    return s ? JSON.parse(s) : INITIAL_SUBJECTS;
  });

  const [schedules, setSchedules] = useState<ScheduleItem[]>(() => {
    const s = localStorage.getItem('mi_lms_schedules');
    return s ? JSON.parse(s) : INITIAL_SCHEDULES;
  });

  const [attendances, setAttendances] = useState<AttendanceRecord[]>(() => {
    const s = localStorage.getItem('mi_lms_attendances');
    let list: AttendanceRecord[] = s ? JSON.parse(s) : INITIAL_ATTENDANCE;
    if (list.length < 20) {
      list = INITIAL_ATTENDANCE;
    }
    return list;
  });

  const [materials, setMaterials] = useState<LearningMaterial[]>(() => {
    const s = localStorage.getItem('mi_lms_materials');
    return s ? JSON.parse(s) : INITIAL_MATERIALS;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const s = localStorage.getItem('mi_lms_assignments');
    return s ? JSON.parse(s) : INITIAL_ASSIGNMENTS;
  });

  const [submissions, setSubmissions] = useState<StudentSubmission[]>(() => {
    const s = localStorage.getItem('mi_lms_submissions');
    return s ? JSON.parse(s) : INITIAL_SUBMISSIONS;
  });

  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const s = localStorage.getItem('mi_lms_quizzes');
    return s ? JSON.parse(s) : INITIAL_QUIZZES;
  });

  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>(() => {
    const s = localStorage.getItem('mi_lms_quizAttempts');
    return s ? JSON.parse(s) : INITIAL_QUIZ_ATTEMPTS;
  });

  const [grades, setGrades] = useState<AcademicGrade[]>(() => {
    const s = localStorage.getItem('mi_lms_grades');
    let list: AcademicGrade[] = s ? JSON.parse(s) : INITIAL_GRADES;
    if (list.length < 50) {
      list = INITIAL_GRADES;
    }
    return list;
  });

  const [invoices, setInvoices] = useState<FinanceInvoice[]>(() => {
    const s = localStorage.getItem('mi_lms_invoices');
    let list: FinanceInvoice[] = s ? JSON.parse(s) : INITIAL_INVOICES;
    list = list.map((inv) => (inv.type === 'SPP Bulanan' && inv.amount === 150000 ? { ...inv, amount: 120000 } : inv));
    return list;
  });

  const [expenses, setExpenses] = useState<SchoolExpense[]>(() => {
    const s = localStorage.getItem('mi_lms_expenses');
    return s ? JSON.parse(s) : INITIAL_EXPENSES;
  });

  const [announcements, setAnnouncements] = useState<SchoolAnnouncement[]>(() => {
    const s = localStorage.getItem('mi_lms_announcements');
    return s ? JSON.parse(s) : INITIAL_ANNOUNCEMENTS;
  });

  const [feeTariffs, setFeeTariffs] = useState<FeeTariff[]>(() => {
    const s = localStorage.getItem('mi_lms_fee_tariffs');
    let list: FeeTariff[] = s ? JSON.parse(s) : INITIAL_FEE_TARIFFS;
    list = list.map((t) => (t.code === 'SPP' ? { ...t, amount: 120000, description: 'Iuran rutin bulanan untuk operasional KBM, fasilitas belajar, praktikum, dan ekstrakurikuler santri (Flat Rp 120.000).' } : t));
    return list;
  });

  const [agendas, setAgendas] = useState<SchoolAgenda[]>(() => {
    const s = localStorage.getItem('mi_lms_agendas');
    return s ? JSON.parse(s) : INITIAL_AGENDAS;
  });

  const [teacherAttendances, setTeacherAttendances] = useState<TeacherAttendanceRecord[]>(() => {
    const s = localStorage.getItem('mi_lms_teacher_attendances');
    let list: TeacherAttendanceRecord[] = s ? JSON.parse(s) : INITIAL_TEACHER_ATTENDANCE;
    if (list.length < 20) {
      list = INITIAL_TEACHER_ATTENDANCE;
    }
    return list;
  });

  const [historicalGrades] = useState<HistoricalSemesterGrade[]>(HISTORICAL_GRADES_ZAKI);

  const [mutabaahList, setMutabaahList] = useState<MutabaahEntry[]>(() => {
    const s = localStorage.getItem('mi_lms_mutabaah');
    return s ? JSON.parse(s) : INITIAL_MUTABAAH;
  });

  const [academicCalendar, setAcademicCalendar] = useState<AcademicCalendarEvent[]>(() => {
    const s = localStorage.getItem('mi_lms_calendar');
    return s ? JSON.parse(s) : INITIAL_ACADEMIC_CALENDAR;
  });

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const toggleSidebarCollapse = () => setIsSidebarCollapsed((prev) => !prev);

  // Save changes to localStorage for persistence
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('mi_lms_currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('mi_lms_currentUser');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('mi_lms_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('mi_lms_classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('mi_lms_attendances', JSON.stringify(attendances));
  }, [attendances]);

  useEffect(() => {
    localStorage.setItem('mi_lms_materials', JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem('mi_lms_assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('mi_lms_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('mi_lms_quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('mi_lms_quizAttempts', JSON.stringify(quizAttempts));
  }, [quizAttempts]);

  useEffect(() => {
    localStorage.setItem('mi_lms_grades', JSON.stringify(grades));
  }, [grades]);

  useEffect(() => {
    localStorage.setItem('mi_lms_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('mi_lms_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('mi_lms_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('mi_lms_agendas', JSON.stringify(agendas));
  }, [agendas]);

  useEffect(() => {
    localStorage.setItem('mi_lms_fee_tariffs', JSON.stringify(feeTariffs));
  }, [feeTariffs]);

  useEffect(() => {
    localStorage.setItem('mi_lms_teacher_attendances', JSON.stringify(teacherAttendances));
  }, [teacherAttendances]);

  useEffect(() => {
    localStorage.setItem('mi_lms_mutabaah', JSON.stringify(mutabaahList));
  }, [mutabaahList]);

  useEffect(() => {
    localStorage.setItem('mi_lms_calendar', JSON.stringify(academicCalendar));
  }, [academicCalendar]);

  // Auth actions
  const login = (username: string, password?: string) => {
    const clean = username.trim().toLowerCase();
    const cleanPassword = password ? password.trim() : '';

    const found = users.find((u) => {
      const matchUsername = u.username && u.username.toLowerCase() === clean;
      
      const cleanName = (u.name || '').toLowerCase().trim();
      const matchName = Boolean(cleanName) && (
        cleanName === clean ||
        cleanName.replace(/\s+/g, '') === clean ||
        cleanName.split(/[\s,.-]+/).includes(clean) ||
        cleanName.replace(/[^a-z0-9]/g, '').includes(clean) ||
        cleanName.replace(/^ust(\.|h\.)?\s*/i, '').trim().split(/[\s,.-]+/)[0].toLowerCase() === clean
      );

      const matchNisn = u.nisn && u.nisn.toLowerCase() === clean;
      const matchNip = u.nip && u.nip.toLowerCase() === clean;
      const matchEmail = u.email && (
        u.email.toLowerCase() === clean ||
        u.email.toLowerCase().split('@')[0] === clean
      );

      // Special fallback: if searching farhan and username is 'f' or name contains farhan
      const matchFarhan = clean === 'farhan' && (
        u.username === 'f' ||
        cleanName.includes('farhan')
      );

      return matchUsername || matchName || matchNisn || matchNip || matchEmail || matchFarhan;
    });

    if (found) {
      const storedPassword = (found.password || '').trim();
      
      // If user has a password set, verify it
      if (storedPassword && cleanPassword) {
        if (storedPassword !== cleanPassword) {
          return false;
        }
      } else if (storedPassword && !cleanPassword) {
        return false;
      }

      setCurrentUser(found);
      setCurrentView('dashboard');
      return true;
    }
    return false;
  };

  const loginAsRole = (role: UserRole) => {
    const target = users.find((u) => u.role === role);
    if (target) {
      setCurrentUser(target);
      setCurrentView('dashboard');
    }
  };

  const logout = () => {
    setIsLogoutModalOpen(true);
  };

  const requestLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    setIsLogoutModalOpen(false);
    setCurrentUser(null);
    setCurrentView('landing');
  };

  const resetPassword = (identifier: string) => {
    const clean = identifier.trim().toLowerCase();
    const userFound = users.find(
      (u) =>
        u.email.toLowerCase() === clean ||
        u.username.toLowerCase() === clean ||
        u.nisn === clean ||
        u.nip === clean
    );

    if (userFound) {
      return {
        success: true,
        message: `Instruksi pengaturan ulang sandi dan tautan verifikasi telah dikirimkan ke email terdaftar (${userFound.email}) serta nomor WhatsApp terdaftar.`,
      };
    }
    return {
      success: false,
      message: 'Data NISN / NIP / Email tidak ditemukan dalam pangkalan data MI Assuyutiyah.',
    };
  };

  // Mutations
  const addUser = (newUser: Omit<User, 'id'>) => {
    const cleanUsername = (newUser.username || '').trim().toLowerCase().replace(/\s+/g, '');
    const cleanPass = newUser.password ? newUser.password.trim() : '1234';
    const user: User = {
      ...newUser,
      username: cleanUsername,
      password: cleanPass,
      id: `user-${Date.now()}`,
    };
    setUsers((prev) => [user, ...prev]);
  };

  const updateUser = (id: string, updated: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updated } : u)));
    if (currentUser?.id === id) {
      setCurrentUser((prev) => (prev ? { ...prev, ...updated } : null));
    }
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const updateClassWali = (classId: string, waliKelasId: string, waliKelasName: string) => {
    setClasses((prev) =>
      prev.map((c) => (c.id === classId ? { ...c, waliKelasId, waliKelasName } : c))
    );
  };

  const addClass = (newClass: Omit<ClassRoom, 'id'>) => {
    const item: ClassRoom = {
      ...newClass,
      id: `c-${Date.now()}`,
    };
    setClasses((prev) => [...prev, item]);
  };

  const updateClass = (id: string, updated: Partial<ClassRoom>) => {
    setClasses((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
  };

  const deleteClass = (id: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== id));
  };

  const addSubject = (newSubject: Omit<Subject, 'id'>) => {
    const item: Subject = {
      ...newSubject,
      id: `sb-${Date.now()}`,
    };
    setSubjects((prev) => [...prev, item]);
  };

  const updateSubject = (id: string, updated: Partial<Subject>) => {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
  };

  const addScheduleItem = (item: Omit<ScheduleItem, 'id'>) => {
    const sc: ScheduleItem = {
      ...item,
      id: `sc-${Date.now()}`,
    };
    setSchedules((prev) => [...prev, sc]);
  };

  const deleteScheduleItem = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  };

  const saveAttendance = (records: AttendanceRecord[]) => {
    setAttendances((prev) => {
      // Replace existing for same date & student
      const updated = [...prev];
      records.forEach((rec) => {
        const idx = updated.findIndex((r) => r.date === rec.date && r.studentId === rec.studentId);
        if (idx >= 0) {
          updated[idx] = rec;
        } else {
          updated.push(rec);
        }
      });
      return updated;
    });
  };

  const saveTeacherAttendance = (records: TeacherAttendanceRecord[]) => {
    setTeacherAttendances((prev) => {
      const map = new Map(prev.map((r) => [`${r.teacherId}-${r.date}`, r]));
      records.forEach((r) => map.set(`${r.teacherId}-${r.date}`, r));
      return Array.from(map.values());
    });
  };

  const updateTeacherAttendance = (id: string, updated: Partial<TeacherAttendanceRecord>) => {
    setTeacherAttendances((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updated } : r))
    );
  };

  const addMaterial = (newMat: Omit<LearningMaterial, 'id' | 'createdAt'>) => {
    const today = new Date().toISOString().split('T')[0];
    const mat: LearningMaterial = {
      ...newMat,
      id: `mat-${Date.now()}`,
      createdAt: today,
    };
    setMaterials((prev) => [mat, ...prev]);
  };

  const deleteMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  const addAssignment = (newAsg: Omit<Assignment, 'id' | 'createdAt'>) => {
    const today = new Date().toISOString().split('T')[0];
    const asg: Assignment = {
      ...newAsg,
      id: `asg-${Date.now()}`,
      createdAt: today,
    };
    setAssignments((prev) => [asg, ...prev]);
  };

  const submitAssignment = (newSub: Omit<StudentSubmission, 'id' | 'submittedAt' | 'status'>) => {
    const now = new Date();
    const timeStr = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const sub: StudentSubmission = {
      ...newSub,
      id: `sub-${Date.now()}`,
      submittedAt: timeStr,
      status: 'Menunggu Penilaian',
    };
    // remove duplicate if student resubmits
    setSubmissions((prev) => [
      sub,
      ...prev.filter(
        (s) => !(s.assignmentId === newSub.assignmentId && s.studentId === newSub.studentId)
      ),
    ]);
  };

  const gradeSubmission = (id: string, score: number, feedback: string, gradedBy: string) => {
    const now = new Date();
    const timeStr = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              score,
              feedback,
              gradedBy,
              gradedAt: timeStr,
              status: 'Sudah Dinilai',
            }
          : s
      )
    );
  };

  const addQuiz = (newQuiz: Omit<Quiz, 'id' | 'createdAt'>) => {
    const today = new Date().toISOString().split('T')[0];
    const q: Quiz = {
      ...newQuiz,
      id: `quiz-${Date.now()}`,
      createdAt: today,
    };
    setQuizzes((prev) => [q, ...prev]);
  };

  const submitQuizAttempt = (newAttempt: Omit<QuizAttempt, 'id' | 'completedAt'>) => {
    const now = new Date();
    const timeStr = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const attempt: QuizAttempt = {
      ...newAttempt,
      id: `att-q-${Date.now()}`,
      completedAt: timeStr,
    };
    setQuizAttempts((prev) => [
      attempt,
      ...prev.filter(
        (a) => !(a.quizId === newAttempt.quizId && a.studentId === newAttempt.studentId)
      ),
    ]);
  };

  const updateGrade = (id: string, data: Partial<AcademicGrade>) => {
    setGrades((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const updated = { ...g, ...data };
          // Recalculate final score if parts provided
          const t = updated.nilaiTugas ?? g.nilaiTugas;
          const uts = updated.nilaiUTS ?? g.nilaiUTS;
          const uas = updated.nilaiUAS ?? g.nilaiUAS;
          const finalScore = Math.round((t * 0.3) + (uts * 0.3) + (uas * 0.4));
          let predikat: 'A' | 'B' | 'C' | 'D' = 'B';
          if (finalScore >= 90) predikat = 'A';
          else if (finalScore >= 80) predikat = 'B';
          else if (finalScore >= 70) predikat = 'C';
          else predikat = 'D';

          return {
            ...updated,
            nilaiAkhir: finalScore,
            predikat,
          };
        }
        return g;
      })
    );
  };

  const addInvoice = (inv: Omit<FinanceInvoice, 'id' | 'invoiceNumber'>) => {
    const item: FinanceInvoice = {
      ...inv,
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV/${new Date().getFullYear()}/${String(Date.now()).slice(-4)}`,
    };
    setInvoices((prev) => [item, ...prev]);
  };

  const payInvoice = (invoiceId: string, paymentMethod: FinanceInvoice['paymentMethod']) => {
    const today = new Date().toISOString().split('T')[0];
    const receiptNum = `KW/${paymentMethod?.split(' ')[0] || 'PAY'}/${Date.now().toString().slice(-6)}`;
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId
          ? {
              ...inv,
              status: 'LUNAS',
              paymentDate: today,
              paymentMethod,
              receiptNumber: receiptNum,
            }
          : inv
      )
    );
  };

  const updateInvoice = (id: string, updated: Partial<FinanceInvoice>) => {
    setInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, ...updated } : inv)));
  };

  const deleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
  };

  const updateFeeTariff = (id: string, updated: Partial<FeeTariff>) => {
    setFeeTariffs((prev) => prev.map((f) => (f.id === id ? { ...f, ...updated } : f)));
  };

  const addExpense = (exp: Omit<SchoolExpense, 'id'>) => {
    const item: SchoolExpense = {
      ...exp,
      id: `exp-${Date.now()}`,
    };
    setExpenses((prev) => [item, ...prev]);
  };

  const addAnnouncement = (newAnn: Omit<SchoolAnnouncement, 'id' | 'date'>) => {
    const today = new Date().toISOString().split('T')[0];
    const ann: SchoolAnnouncement = {
      ...newAnn,
      id: `ann-${Date.now()}`,
      date: today,
    };
    setAnnouncements((prev) => [ann, ...prev]);
  };

  const addAgenda = (newAgd: Omit<SchoolAgenda, 'id'>) => {
    const agd: SchoolAgenda = {
      ...newAgd,
      id: `agd-${Date.now()}`,
    };
    setAgendas((prev) => [agd, ...prev]);
  };

  // Mutaba'ah Methods
  const saveMutabaahEntry = (entry: MutabaahEntry) => {
    setMutabaahList((prev) => {
      const idx = prev.findIndex((m) => m.id === entry.id || (m.studentId === entry.studentId && m.date === entry.date));
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], ...entry };
        return updated;
      }
      return [entry, ...prev];
    });
  };

  const verifyMutabaahByTeacher = (id: string, teacherNote: string, badge?: MutabaahEntry['characterBadge'], score = 95) => {
    const now = new Date();
    const timeStr = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setMutabaahList((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              teacherNote,
              teacherName: currentUser?.name || 'Wali Kelas',
              teacherVerified: true,
              teacherVerifiedAt: timeStr,
              ...(badge ? { characterBadge: badge } : {}),
              disciplineScore: score,
            }
          : m
      )
    );
  };

  const verifyMutabaahByParent = (id: string, parentNote: string) => {
    const now = new Date();
    const timeStr = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setMutabaahList((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              parentNote,
              parentVerified: true,
              parentVerifiedAt: timeStr,
            }
          : m
      )
    );
  };

  // Kalender Pendidikan Methods
  const addCalendarEvent = (event: Omit<AcademicCalendarEvent, 'id'>, broadcastToAgenda = true) => {
    const id = `cal-${Date.now()}`;
    const newCal: AcademicCalendarEvent = {
      ...event,
      id,
      notificationSent: broadcastToAgenda,
    };
    setAcademicCalendar((prev) => [newCal, ...prev]);

    if (broadcastToAgenda) {
      // Automatic broadcast to agenda & announcement
      const newAgd: SchoolAgenda = {
        id: `agd-${Date.now()}`,
        title: event.title,
        date: event.startDate,
        time: '07:30 - Selesai WIB',
        location: 'Lingkungan Madrasah MI Assuyutiyah',
        description: event.description,
        category: (event.category === 'PHBI & Keagamaan' ? 'Keagamaan' : 'Akademik') as SchoolAgenda['category'],
      };
      setAgendas((prev) => [newAgd, ...prev]);

      const newAnn: SchoolAnnouncement = {
        id: `ann-${Date.now()}`,
        title: `[Kalender Pendidikan] ${event.title}`,
        content: `Diumumkan kepada seluruh ${event.targetRole === 'ALL' ? 'Keluarga Besar Madrasah' : event.targetRole === 'GURU' ? 'Dewan Asatidz' : 'Santri & Wali Murid'}: ${event.description}. Tanggal Pelaksanaan: ${event.startDate}${event.endDate !== event.startDate ? ` s.d. ${event.endDate}` : ''}.`,
        targetRole: event.targetRole,
        date: new Date().toISOString().split('T')[0],
        author: 'Waka Kurikulum & Akademik',
        priority: event.category === 'Ujian ASTS/ASAS' ? 'Mendesak' : 'Penting',
      };
      setAnnouncements((prev) => [newAnn, ...prev]);
    }
  };

  const updateCalendarEvent = (id: string, updated: Partial<AcademicCalendarEvent>) => {
    setAcademicCalendar((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
  };

  const deleteCalendarEvent = (id: string) => {
    setAcademicCalendar((prev) => prev.filter((c) => c.id !== id));
  };

  // Promosi Massal Rombel
  const promoteClassBatch = (fromClassId: string, toClassId: string, studentIds: string[], newAcademicYear: string) => {
    const fromClass = classes.find((c) => c.id === fromClassId);
    const toClass = toClassId === 'ALUMNI'
      ? { id: 'ALUMNI', name: 'Alumni MI Assuyutiyah', grade: 6, academicYear: newAcademicYear }
      : classes.find((c) => c.id === toClassId);

    if (!fromClass || !toClass) {
      return { success: false, count: 0, message: 'Rombel asal atau tujuan tidak valid' };
    }

    const today = new Date().toISOString().split('T')[0];

    // Update students
    setUsers((prev) =>
      prev.map((u) => {
        if (studentIds.includes(u.id)) {
          const newMutation = {
            id: `mut-${Date.now()}-${u.id}`,
            fromClassId: fromClass.id,
            fromClassName: fromClass.name,
            toClassId: toClass.id,
            toClassName: toClass.name,
            date: today,
            reasonType: 'KENAIKAN' as const,
            reasonText: `Kenaikan Kelas Kolektif Akhir Tahun Ajaran ke ${toClass.name} (${newAcademicYear})`,
            approvedBy: currentUser?.name || 'Administrator Tata Usaha',
          };
          return {
            ...u,
            classId: toClass.id,
            className: toClass.name,
            mutations: [...(u.mutations || []), newMutation],
          };
        }
        return u;
      })
    );

    // Update class counts
    setClasses((prev) =>
      prev.map((c) => {
        if (c.id === fromClassId) {
          return {
            ...c,
            totalStudents: Math.max(0, c.totalStudents - studentIds.length),
          };
        }
        if (c.id === toClassId) {
          return {
            ...c,
            academicYear: newAcademicYear || c.academicYear,
            totalStudents: c.totalStudents + studentIds.length,
          };
        }
        return c;
      })
    );

    return {
      success: true,
      count: studentIds.length,
      message: `Alhamdulillah! Berhasil mempromosikan ${studentIds.length} santri dari ${fromClass.name} ke ${toClass.name}.`,
    };
  };

  return (
    <LMSContext.Provider
      value={{
        currentUser,
        activeRole: currentUser?.role || null,
        currentView,
        setCurrentView,
        isSidebarOpen,
        setIsSidebarOpen,
        toggleSidebar,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        toggleSidebarCollapse,
        login,
        loginAsRole,
        logout,
        requestLogout,
        confirmLogout,
        isLogoutModalOpen,
        setIsLogoutModalOpen,
        resetPassword,
        users,
        classes,
        subjects,
        schedules,
        attendances,
        materials,
        assignments,
        submissions,
        quizzes,
        quizAttempts,
        grades,
        invoices,
        expenses,
        announcements,
        agendas,
        addUser,
        updateUser,
        deleteUser,
        updateClassWali,
        addClass,
        updateClass,
        deleteClass,
        addSubject,
        updateSubject,
        addScheduleItem,
        deleteScheduleItem,
        saveAttendance,
        teacherAttendances,
        saveTeacherAttendance,
        updateTeacherAttendance,
        historicalGrades,
        addMaterial,
        deleteMaterial,
        addAssignment,
        submitAssignment,
        gradeSubmission,
        addQuiz,
        submitQuizAttempt,
        updateGrade,
        feeTariffs,
        updateFeeTariff,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        payInvoice,
        addExpense,
        addAnnouncement,
        addAgenda,
        mutabaahList,
        saveMutabaahEntry,
        verifyMutabaahByTeacher,
        verifyMutabaahByParent,
        academicCalendar,
        addCalendarEvent,
        updateCalendarEvent,
        deleteCalendarEvent,
        promoteClassBatch,
      }}
    >
      {children}
    </LMSContext.Provider>
  );
};

export const useLMS = () => {
  const context = useContext(LMSContext);
  if (!context) {
    throw new Error('useLMS must be used within an LMSProvider');
  }
  return context;
};
