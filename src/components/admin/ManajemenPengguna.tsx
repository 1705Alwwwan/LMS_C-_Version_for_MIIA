import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  Users,
  GraduationCap,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  UserCheck,
  Phone,
  BookOpen,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  ArrowRightLeft,
  Award,
  Sparkles,
  Briefcase,
  School,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { User, UserRole, TeacherSubRole, MutationRecord } from '../../types/lms';

export const ManajemenPengguna: React.FC = () => {
  const { users, classes, subjects, addUser, updateUser, deleteUser, currentUser } = useLMS();
  const [activeTab, setActiveTab] = useState<'SISWA' | 'GURU' | 'ADMIN'>('SISWA');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('ALL');
  const [teacherTypeFilter, setTeacherTypeFilter] = useState<'ALL' | 'WALI_KELAS' | 'GURU_MAPEL' | 'STAFF'>('ALL');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [isUsernameManuallyEdited, setIsUsernameManuallyEdited] = useState(false);
  const [successToast, setSuccessToast] = useState('');
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleteAlertError, setDeleteAlertError] = useState('');

  // Student Mutation Modal State (Pindah Kelas & Rombel Siswa Berprestasi / Akselerasi)
  const [isMutationModalOpen, setIsMutationModalOpen] = useState(false);
  const [studentForMutation, setStudentForMutation] = useState<User | null>(null);
  const [mutationTargetClassId, setMutationTargetClassId] = useState('');
  const [mutationReasonType, setMutationReasonType] = useState<'PRESTASI' | 'KENAIKAN' | 'MUTASI' | 'LAINNYA'>('PRESTASI');
  const [mutationReasonText, setMutationReasonText] = useState('');
  const [mutationDocNumber, setMutationDocNumber] = useState('');
  const [mutationError, setMutationError] = useState('');

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    nisn: '',
    nip: '',
    phone: '',
    gender: 'L' as 'L' | 'P',
    classId: 'c-5a',
    className: 'Kelas 5A',
    parentName: '',
    parentPhone: '',
    address: '',
    adminRoleTitle: 'Tata Usaha & Manajemen Sistem',
    // Teacher specific subroles
    teacherType: 'WALI_KELAS' as TeacherSubRole,
    waliClassId: 'c-5a',
    staffPosition: 'Kepala Tata Usaha (TU)',
    subjectsTaught: [] as string[],
    assignedClasses: [] as string[],
    password: '',
    confirmPassword: '',
  });

  const students = users.filter((u) => u.role === 'SISWA');
  const teachers = users.filter((u) => u.role === 'GURU');
  const admins = users.filter((u) => u.role === 'ADMIN');

  const targetUsers =
    activeTab === 'SISWA' ? students : activeTab === 'GURU' ? teachers : admins;

  const filteredUsers = targetUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.nisn && u.nisn.includes(searchQuery)) ||
      (u.nip && u.nip.includes(searchQuery)) ||
      (u.username && u.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesClass =
      activeTab !== 'SISWA' || filterClass === 'ALL' || u.classId === filterClass;

    const matchesTeacherType =
      activeTab !== 'GURU' ||
      teacherTypeFilter === 'ALL' ||
      (teacherTypeFilter === 'WALI_KELAS' && (u.teacherType === 'WALI_KELAS' || Boolean(u.waliClassId))) ||
      (teacherTypeFilter === 'GURU_MAPEL' && (u.teacherType === 'GURU_MAPEL' || (!u.waliClassId && !u.staffPosition && !u.position))) ||
      (teacherTypeFilter === 'STAFF' && (u.teacherType === 'STAFF' || Boolean(u.staffPosition) || Boolean(u.position)));

    return matchesSearch && matchesClass && matchesTeacherType;
  });

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormError('');
    setShowPassword(false);
    setIsUsernameManuallyEdited(false);
    setFormData({
      name: '',
      username: '',
      email: '',
      nisn: '',
      nip: '',
      phone: '',
      gender: 'L',
      classId: 'c-5a',
      className: 'Kelas 5A',
      parentName: '',
      parentPhone: '',
      address: '',
      adminRoleTitle: 'Tata Usaha & Manajemen Sistem',
      teacherType: 'WALI_KELAS',
      waliClassId: classes[0]?.id || 'c-1a',
      staffPosition: 'Kepala Tata Usaha (TU)',
      subjectsTaught: ['Fikih'],
      assignedClasses: ['5A'],
      password: '',
      confirmPassword: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (u: User) => {
    setEditingUser(u);
    setFormError('');
    setShowPassword(false);
    setIsUsernameManuallyEdited(true);
    setFormData({
      name: u.name,
      username: u.username,
      email: u.email,
      nisn: u.nisn || '',
      nip: u.nip || '',
      phone: u.phone || '',
      gender: u.gender || 'L',
      classId: u.classId || 'c-5a',
      className: u.className || 'Kelas 5A',
      parentName: u.parentName || '',
      parentPhone: u.parentPhone || '',
      address: u.address || '',
      adminRoleTitle: u.position || u.address || 'Tata Usaha & Manajemen Sistem',
      teacherType: u.teacherType || (u.waliClassId ? 'WALI_KELAS' : u.staffPosition ? 'STAFF' : 'GURU_MAPEL'),
      waliClassId: u.waliClassId || u.classId || classes[0]?.id || 'c-1a',
      staffPosition: u.staffPosition || u.position || 'Kepala Tata Usaha (TU)',
      subjectsTaught: u.subjectsTaught || [],
      assignedClasses: u.assignedClasses || [],
      password: '',
      confirmPassword: '',
    });
    setIsModalOpen(true);
  };

  // Open Mutation Modal for Student Class / Rombel Change
  const handleOpenMutationModal = (student: User) => {
    setStudentForMutation(student);
    let defaultTargetId = '';
    // If student is in Kelas 3C, default to Kelas 4A (as directly requested in user prompt)
    if (student.classId === 'c-3c') {
      defaultTargetId = 'c-4a';
    } else {
      const currIdx = classes.findIndex((c) => c.id === student.classId);
      defaultTargetId =
        classes[currIdx + 1]?.id ||
        classes.find((c) => c.id !== student.classId)?.id ||
        classes[0]?.id ||
        'c-4a';
    }
    setMutationTargetClassId(defaultTargetId);
    setMutationReasonType('PRESTASI');
    setMutationReasonText(
      student.name.includes('Rizki') || student.classId === 'c-3c'
        ? 'Rekomendasi resmi dari Wali Kelas atas dasar prestasi akademik istimewa, nilai rata-rata 96.5, dan kesiapan kognitif akselerasi rombel ke tingkat lebih tinggi.'
        : 'Rekomendasi resmi dari Wali Kelas atas dasar capaian prestasi belajar santri dan hasil musyawarah dewan guru.'
    );
    setMutationDocNumber(`REK-WK/MI/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`);
    setMutationError('');
    setIsMutationModalOpen(true);
  };

  const handleConfirmMutation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForMutation) return;

    const targetClassObj = classes.find((c) => c.id === mutationTargetClassId);
    if (!targetClassObj) {
      setMutationError('Silakan pilih kelas dan rombel tujuan yang valid.');
      return;
    }
    if (targetClassObj.id === studentForMutation.classId) {
      setMutationError('Kelas dan rombel tujuan tidak boleh sama dengan kelas asal santri.');
      return;
    }

    const fromClassObj = classes.find((c) => c.id === studentForMutation.classId);
    const fromClassName = fromClassObj ? fromClassObj.name : studentForMutation.className || 'Kelas Awal';
    const toClassName = targetClassObj.name;

    const newMutation: MutationRecord = {
      id: `mut-${Date.now()}`,
      fromClassId: studentForMutation.classId || '',
      fromClassName,
      toClassId: targetClassObj.id,
      toClassName,
      date: new Date().toISOString().split('T')[0],
      reasonType: mutationReasonType,
      reasonText: mutationReasonText.trim() || 'Rekomendasi Wali Kelas',
      approvedBy: currentUser?.name || 'Administrator Madrasah',
    };

    const updatedMutations = [...(studentForMutation.mutations || []), newMutation];

    updateUser(studentForMutation.id, {
      classId: targetClassObj.id,
      className: targetClassObj.name,
      mutations: updatedMutations,
      achievementBadge:
        mutationReasonType === 'PRESTASI'
          ? `Siswa Berprestasi (Akselerasi ${fromClassName} ➔ ${toClassName})`
          : studentForMutation.achievementBadge,
    });

    setSuccessToast(
      `Alhamdulillah! Santri "${studentForMutation.name}" berhasil dipindahkan dari ${fromClassName} ke ${toClassName} (${
        mutationReasonType === 'PRESTASI'
          ? 'Rekomendasi Wali Kelas: Siswa Berprestasi / Akselerasi'
          : 'Mutasi Rombel'
      })!`
    );
    setIsMutationModalOpen(false);
    setStudentForMutation(null);
  };

  // Password Policy: 8-12 chars, uppercase, lowercase, symbol
  const checkPasswordPolicy = (pass: string) => {
    if (pass.length < 8) return 'Password minimal harus 8 karakter.';
    if (pass.length > 12) return 'Password maksimal 12 karakter.';
    if (!/[A-Z]/.test(pass)) return 'Password wajib mengandung minimal 1 huruf kapital (A-Z).';
    if (!/[a-z]/.test(pass)) return 'Password wajib mengandung minimal 1 huruf kecil (a-z).';
    if (!/[^A-Za-z0-9]/.test(pass)) return 'Password wajib mengandung minimal 1 karakter simbol (contoh: @, #, $, !, %, *, _).';
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const cleanPass = formData.password.trim();
    const cleanConfirm = formData.confirmPassword.trim();

    // Password validation for new user or when updating password
    if (!editingUser) {
      if (!cleanPass) {
        setFormError('Password wajib diisi untuk pengguna baru.');
        return;
      }
      const policyError = checkPasswordPolicy(cleanPass);
      if (policyError) {
        setFormError(policyError);
        return;
      }
      if (cleanPass !== cleanConfirm) {
        setFormError('Password dan Konfirmasi Password tidak cocok!');
        return;
      }
    } else {
      // When editing, if user typed anything in password or confirmPassword
      if (cleanPass || cleanConfirm) {
        const policyError = checkPasswordPolicy(cleanPass);
        if (policyError) {
          setFormError(policyError);
          return;
        }
        if (cleanPass !== cleanConfirm) {
          setFormError('Password dan Konfirmasi Password tidak cocok!');
          return;
        }
      }
    }

    const selectedClassObj = classes.find((c) => c.id === formData.classId);
    const selectedWaliClassObj = classes.find((c) => c.id === formData.waliClassId);
    
    // Auto-generate NISN / NIP if empty so submission is never blocked
    const finalNisn = (formData.nisn || '').trim() || `009${Math.floor(1000000 + Math.random() * 9000000)}`;
    const finalNip = (formData.nip || '').trim() || `199${Math.floor(100000000000000 + Math.random() * 900000000000000)}`;

    const finalUsername =
      (formData.username || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '') ||
      formData.name.toLowerCase().trim().replace(/\s+/g, '').replace(/[^a-z0-9_]/g, '') ||
      (activeTab === 'SISWA' ? finalNisn : finalNip) ||
      `user_${Date.now()}`;

    if (editingUser) {
      updateUser(editingUser.id, {
        name: formData.name,
        username: finalUsername,
        email: formData.email || `${finalUsername}@mi-assuyutiyah.sch.id`,
        phone: formData.phone,
        nisn: activeTab === 'SISWA' ? finalNisn : undefined,
        nip: activeTab === 'GURU' || activeTab === 'ADMIN' ? finalNip : undefined,
        gender: formData.gender,
        classId: activeTab === 'SISWA' ? formData.classId : undefined,
        className: activeTab === 'SISWA' ? (selectedClassObj ? selectedClassObj.name : formData.className) : undefined,
        parentName: formData.parentName,
        parentPhone: formData.parentPhone,
        address: formData.address,
        position: activeTab === 'ADMIN' ? formData.adminRoleTitle : activeTab === 'GURU' && formData.teacherType === 'STAFF' ? formData.staffPosition : undefined,
        teacherType: activeTab === 'GURU' ? formData.teacherType : undefined,
        waliClassId: activeTab === 'GURU' && formData.teacherType === 'WALI_KELAS' ? formData.waliClassId : undefined,
        waliClassName: activeTab === 'GURU' && formData.teacherType === 'WALI_KELAS' ? (selectedWaliClassObj ? selectedWaliClassObj.name : undefined) : undefined,
        staffPosition: activeTab === 'GURU' && formData.teacherType === 'STAFF' ? formData.staffPosition : undefined,
        subjectsTaught: activeTab === 'GURU' && formData.teacherType === 'GURU_MAPEL' ? formData.subjectsTaught : activeTab === 'GURU' && formData.teacherType === 'WALI_KELAS' ? ['Semua Mapel Rombel & Tematik'] : undefined,
        assignedClasses: activeTab === 'GURU' ? formData.assignedClasses : undefined,
        password: cleanPass ? cleanPass : editingUser.password,
      });
      setSuccessToast(`Data pengguna "${formData.name}" berhasil diperbarui! Username login: @${finalUsername}`);
    } else {
      const defaultAvatar =
        formData.gender === 'P'
          ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80';

      addUser({
        name: formData.name,
        username: finalUsername,
        role: activeTab,
        email: formData.email || `${finalUsername}@mi-assuyutiyah.sch.id`,
        avatar: defaultAvatar,
        phone: formData.phone,
        nisn: activeTab === 'SISWA' ? finalNisn : undefined,
        nip: activeTab === 'GURU' || activeTab === 'ADMIN' ? finalNip : undefined,
        gender: formData.gender,
        classId: activeTab === 'SISWA' ? formData.classId : undefined,
        className: activeTab === 'SISWA' ? (selectedClassObj ? selectedClassObj.name : formData.className) : undefined,
        parentName: formData.parentName,
        parentPhone: formData.parentPhone,
        address: formData.address,
        position: activeTab === 'ADMIN' ? formData.adminRoleTitle : activeTab === 'GURU' && formData.teacherType === 'STAFF' ? formData.staffPosition : undefined,
        teacherType: activeTab === 'GURU' ? formData.teacherType : undefined,
        waliClassId: activeTab === 'GURU' && formData.teacherType === 'WALI_KELAS' ? formData.waliClassId : undefined,
        waliClassName: activeTab === 'GURU' && formData.teacherType === 'WALI_KELAS' ? (selectedWaliClassObj ? selectedWaliClassObj.name : undefined) : undefined,
        staffPosition: activeTab === 'GURU' && formData.teacherType === 'STAFF' ? formData.staffPosition : undefined,
        subjectsTaught: activeTab === 'GURU' && formData.teacherType === 'GURU_MAPEL' ? formData.subjectsTaught : activeTab === 'GURU' && formData.teacherType === 'WALI_KELAS' ? ['Semua Mapel Rombel & Tematik'] : undefined,
        assignedClasses: activeTab === 'GURU' ? formData.assignedClasses : undefined,
        password: cleanPass,
      });
      setSuccessToast(`Pengguna baru "${formData.name}" (${activeTab}) berhasil ditambahkan! Username: "${finalUsername}" | Password: "${cleanPass}"`);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header title matching diagram */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-700" />
            <span>Manajemen Pengguna</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Pengelolaan Akun & Hak Akses Resmi: Siswa / Santri, Guru & Asatidz, serta Administrator Madrasah
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 flex items-center justify-center space-x-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>
            {activeTab === 'SISWA'
              ? 'Tambah Siswa Baru'
              : activeTab === 'GURU'
              ? 'Tambah Guru / Asatidz Baru'
              : 'Tambah Administrator Baru'}
          </span>
        </button>
      </div>

      {/* Success Notification Alert */}
      {successToast && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-800 text-xs shadow-xs animate-in fade-in">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{successToast}</span>
          </div>
          <button
            onClick={() => setSuccessToast('')}
            className="p-1 text-emerald-500 hover:text-emerald-700 rounded-lg hover:bg-emerald-100/50 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Delete Alert Error Banner */}
      {deleteAlertError && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-rose-800 text-xs shadow-xs animate-in fade-in">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-medium">{deleteAlertError}</span>
          </div>
          <button
            onClick={() => setDeleteAlertError('')}
            className="p-1 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-100/50 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => {
            setActiveTab('SISWA');
            setSearchQuery('');
          }}
          className={`pb-3 px-4 text-xs font-bold flex items-center space-x-2 border-b-2 transition-colors ${
            activeTab === 'SISWA'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Tambah/Edit Siswa ({students.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('GURU');
            setSearchQuery('');
          }}
          className={`pb-3 px-4 text-xs font-bold flex items-center space-x-2 border-b-2 transition-colors ${
            activeTab === 'GURU'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Tambah/Edit Guru & Staf ({teachers.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('ADMIN');
            setSearchQuery('');
          }}
          className={`pb-3 px-4 text-xs font-bold flex items-center space-x-2 border-b-2 transition-colors ${
            activeTab === 'ADMIN'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Tambah/Edit Admin ({admins.length})</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'SISWA'
                ? 'Cari nama santri, username, kelas, atau NISN...'
                : activeTab === 'GURU'
                ? 'Cari nama guru, NIP, mapel, atau jabatan staf...'
                : 'Cari nama administrator, username, atau email...'
            }
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white"
          />
        </div>

        {activeTab === 'SISWA' && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">Filter Rombel:</span>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-700 outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              <option value="ALL">Semua Kelas & Rombel ({classes.length} Rombel)</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} - Wali: {c.waliKelasName}
                </option>
              ))}
            </select>
          </div>
        )}

        {activeTab === 'GURU' && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap mr-1">Tipe Guru:</span>
            {[
              { id: 'ALL', label: `Semua (${teachers.length})` },
              { id: 'WALI_KELAS', label: `Wali Kelas (${teachers.filter((t) => t.teacherType === 'WALI_KELAS' || Boolean(t.waliClassId)).length})` },
              { id: 'GURU_MAPEL', label: `Guru Mapel (${teachers.filter((t) => t.teacherType === 'GURU_MAPEL' || (!t.waliClassId && !t.staffPosition && !t.position)).length})` },
              { id: 'STAFF', label: `Staf Tendik (${teachers.filter((t) => t.teacherType === 'STAFF' || Boolean(t.staffPosition) || Boolean(t.position)).length})` },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setTeacherTypeFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  teacherTypeFilter === f.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Table view */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Pengguna</th>
                <th className="py-3 px-4">
                  {activeTab === 'SISWA' ? 'NISN, Rombel & Status' : activeTab === 'GURU' ? 'NIP & Peran Guru' : 'Jabatan & NIP'}
                </th>
                <th className="py-3 px-4">
                  {activeTab === 'SISWA' ? 'Wali Murid & Kontak' : 'No. HP / WA'}
                </th>
                <th className="py-3 px-4">
                  {activeTab === 'ADMIN' ? 'Email Resmi & Divisi' : 'Alamat'}
                </th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Tidak ada data pengguna {activeTab.toLowerCase()} ditemukan.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{u.name}</span>
                            {u.role === 'ADMIN' && (
                              <span className="px-1.5 py-0.2 text-[9px] font-bold bg-emerald-100 text-emerald-800 rounded">
                                ADMIN
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200">
                              User: @{u.username}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200" title="Password Akun untuk Login">
                              Sandi: {u.password || '1234'}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{u.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {activeTab === 'SISWA' ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-slate-800 font-semibold">{u.nisn || '-'}</span>
                            <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {u.className || 'Kelas 5A'}
                            </span>
                          </div>
                          {u.achievementBadge && (
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-50 text-amber-900 border border-amber-200">
                              <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
                              <span>{u.achievementBadge}</span>
                            </div>
                          )}
                          {u.mutations && u.mutations.length > 0 && (
                            <div className="text-[10px] text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                              <ArrowRightLeft className="w-2.5 h-2.5 text-blue-600 shrink-0" />
                              <span>Mutasi: {u.mutations[u.mutations.length - 1].fromClassName} ➔ {u.mutations[u.mutations.length - 1].toClassName}</span>
                            </div>
                          )}
                        </div>
                      ) : activeTab === 'GURU' ? (
                        <div className="space-y-1">
                          <div className="font-mono text-slate-800 font-semibold">{u.nip || '-'}</div>
                          {u.teacherType === 'WALI_KELAS' ? (
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <GraduationCap className="w-3 h-3 text-emerald-700 shrink-0" />
                              <span>Wali Kelas: {u.waliClassName || u.className || 'Kelas Binaan'}</span>
                            </div>
                          ) : u.teacherType === 'STAFF' ? (
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-md bg-purple-100 text-purple-800 border border-purple-200">
                              <Briefcase className="w-3 h-3 text-purple-700 shrink-0" />
                              <span>Staf: {u.staffPosition || u.position || 'Tenaga Kependidikan'}</span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-md bg-sky-100 text-sky-800 border border-sky-200">
                              <BookOpen className="w-3 h-3 text-sky-700 shrink-0" />
                              <span>Guru Mapel: {u.subjectsTaught?.slice(0, 2).join(', ') || 'Umum'}</span>
                            </div>
                          )}
                          {u.subjectsTaught && u.subjectsTaught.length > 0 && u.teacherType !== 'WALI_KELAS' && (
                            <div className="text-[10px] text-slate-500 truncate max-w-[200px]">
                              {u.subjectsTaught.join(', ')}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {u.position || u.address || 'Tata Usaha (TU)'}
                          </span>
                          <div className="font-mono text-slate-500 text-[11px] mt-0.5">
                            {u.nip ? `NIP: ${u.nip}` : 'Akses Penuh Administrator'}
                          </div>
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {activeTab === 'SISWA' ? (
                        <div>
                          <div className="text-slate-800 font-medium">{u.parentName || '-'}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-emerald-600" /> {u.parentPhone || u.phone || '-'}
                          </div>
                        </div>
                      ) : (
                        <div className="text-slate-700 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-emerald-600" /> {u.phone || '-'}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                      {activeTab === 'ADMIN' ? (
                        <div>
                          <div className="text-slate-800 font-medium">{u.email}</div>
                          <div className="text-[10px] text-slate-400">Pusat Tata Usaha & IT</div>
                        </div>
                      ) : (
                        u.address || 'Kec. Sukamaju'
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        {activeTab === 'SISWA' && (
                          <button
                            onClick={() => handleOpenMutationModal(u)}
                            className="px-2.5 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                            title="Ubah Kelas & Rombel Siswa (Mutasi / Akselerasi Berprestasi)"
                          >
                            <ArrowRightLeft className="w-3 h-3 text-emerald-600" />
                            <span>Pindah Rombel</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEditModal(u)}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Data Lengkap"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (activeTab === 'ADMIN' && currentUser?.id === u.id) {
                              setDeleteAlertError('Tidak dapat menghapus akun Administrator yang sedang aktif login.');
                              return;
                            }
                            setDeleteAlertError('');
                            setUserToDelete(u);
                          }}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Pengguna"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Modal Add / Edit User */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {editingUser
                  ? `Edit Data ${activeTab === 'SISWA' ? 'Siswa' : activeTab === 'GURU' ? 'Guru' : 'Administrator'}`
                  : `Tambah ${activeTab === 'SISWA' ? 'Siswa / Santri' : activeTab === 'GURU' ? 'Guru / Asatidz' : 'Administrator / Staf TU'} Baru`}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2 text-rose-700 text-xs animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap & Gelar *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        name: val,
                        username: !isUsernameManuallyEdited && !editingUser
                          ? val.toLowerCase().trim().replace(/\s+/g, '').replace(/[^a-z0-9_]/g, '')
                          : prev.username,
                      }));
                    }}
                    placeholder={
                      activeTab === 'SISWA'
                        ? 'Ahmad Farhan'
                        : activeTab === 'GURU'
                        ? 'Ust. Farhan, S.Pd.I'
                        : 'Ust. H. Muhammad Ilyas, S.Pd.I'
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Username untuk Login *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => {
                      setIsUsernameManuallyEdited(true);
                      setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s+/g, '') });
                    }}
                    placeholder="farhan (tanpa spasi)"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden font-mono"
                  />
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[10px] text-slate-500">
                      Login LMS: <strong className="font-mono text-emerald-700">@{formData.username || 'username'}</strong>
                    </p>
                    {isUsernameManuallyEdited && !editingUser && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsUsernameManuallyEdited(false);
                          setFormData({
                            ...formData,
                            username: formData.name.toLowerCase().trim().replace(/\s+/g, '').replace(/[^a-z0-9_]/g, ''),
                          });
                        }}
                        className="text-[10px] text-emerald-600 hover:underline"
                      >
                        Reset ke nama
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {activeTab === 'SISWA' ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      NISN <span className="text-slate-400 font-normal">(Opsional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nisn}
                      onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                      placeholder="Contoh: 0098765432"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden font-mono"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      NIP / PegID <span className="text-slate-400 font-normal">(Opsional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nip}
                      onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                      placeholder="Contoh: 19850624..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden font-mono"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'L' | 'P' })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="L">Laki-Laki (Ikhwan)</option>
                    <option value="P">Perempuan (Akhwat)</option>
                  </select>
                </div>
              </div>

              {activeTab === 'SISWA' ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Kelas / Rombel</label>
                    <select
                      value={formData.classId}
                      onChange={(e) => {
                        const c = classes.find((cl) => cl.id === e.target.value);
                        setFormData({
                          ...formData,
                          classId: e.target.value,
                          className: c ? c.name : 'Kelas 5A',
                        });
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white outline-hidden focus:ring-2 focus:ring-emerald-500"
                    >
                      {classes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} - Wali: {c.waliKelasName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Orang Tua / Wali</label>
                      <input
                        type="text"
                        value={formData.parentName}
                        onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                        placeholder="H. Bambang Sudirman"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">No. WhatsApp Wali</label>
                      <input
                        type="text"
                        value={formData.parentPhone}
                        onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                        placeholder="0812-7788-9900"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                      />
                    </div>
                  </div>
                </>
              ) : activeTab === 'GURU' ? (
                <>
                  {/* Pilihan Peran & Penugasan Guru */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Peran & Penugasan Resmi Pendidik / Tenaga Kependidikan *
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, teacherType: 'WALI_KELAS' })}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          formData.teacherType === 'WALI_KELAS'
                            ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-2 ring-emerald-500 font-bold shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <GraduationCap className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                        <div className="text-[11px] font-bold">Wali Kelas</div>
                        <div className="text-[9px] text-slate-500 font-normal">Bina Rombel</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, teacherType: 'GURU_MAPEL' })}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          formData.teacherType === 'GURU_MAPEL'
                            ? 'bg-sky-50 border-sky-600 text-sky-900 ring-2 ring-sky-500 font-bold shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <BookOpen className="w-4 h-4 mx-auto mb-1 text-sky-600" />
                        <div className="text-[11px] font-bold">Guru Mapel</div>
                        <div className="text-[9px] text-slate-500 font-normal">Mata Pelajaran</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, teacherType: 'STAFF' })}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          formData.teacherType === 'STAFF'
                            ? 'bg-purple-50 border-purple-600 text-purple-900 ring-2 ring-purple-500 font-bold shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Briefcase className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                        <div className="text-[11px] font-bold">Staf / Tendik</div>
                        <div className="text-[9px] text-slate-500 font-normal">Kependidikan</div>
                      </button>
                    </div>
                  </div>

                  {formData.teacherType === 'WALI_KELAS' && (
                    <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-2 animate-in fade-in">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                        <School className="w-4 h-4 text-emerald-700" />
                        <span>Pilih Rombongan Belajar (Rombel Binaan)</span>
                      </div>
                      <select
                        value={formData.waliClassId}
                        onChange={(e) => setFormData({ ...formData, waliClassId: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-emerald-300 bg-white text-slate-800 outline-hidden focus:ring-2 focus:ring-emerald-500 font-semibold"
                      >
                        {classes.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} (Tingkat {c.grade}) - Ruangan: {c.roomNumber} [Wali saat ini: {c.waliKelasName}]
                          </option>
                        ))}
                      </select>
                      <p className="text-[10px] text-emerald-700 leading-relaxed">
                        ✓ Wali kelas berhak memantau kehadiran santri harian, memberikan rekomendasi mutasi/akselerasi siswa berprestasi, dan memvalidasi rapor digital.
                      </p>
                    </div>
                  )}

                  {formData.teacherType === 'GURU_MAPEL' && (
                    <div className="p-3 bg-sky-50/80 border border-sky-200 rounded-xl space-y-2 animate-in fade-in">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-sky-900">
                        <BookOpen className="w-4 h-4 text-sky-700" />
                        <span>Mata Pelajaran yang Diampu</span>
                      </div>
                      <input
                        type="text"
                        value={formData.subjectsTaught.join(', ')}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            subjectsTaught: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                          })
                        }
                        placeholder="Contoh: Fikih, Al-Qur'an Hadis, Bahasa Arab"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-sky-300 bg-white focus:ring-2 focus:ring-sky-500 outline-hidden font-medium"
                      />
                      <div className="flex flex-wrap items-center gap-1 text-[10px] pt-1">
                        <span className="font-semibold text-sky-800">Pilihan Cepat:</span>
                        {["Fikih", "Al-Qur'an Hadis", "Akidah Akhlak", "SKI", "Bahasa Arab", "Matematika", "IPAS", "PJOK"].map((sub) => (
                          <button
                            type="button"
                            key={sub}
                            onClick={() => {
                              if (!formData.subjectsTaught.includes(sub)) {
                                setFormData({
                                  ...formData,
                                  subjectsTaught: [...formData.subjectsTaught, sub],
                                });
                              }
                            }}
                            className="px-1.5 py-0.5 bg-white border border-sky-200 rounded text-sky-700 hover:bg-sky-100 cursor-pointer"
                          >
                            + {sub}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.teacherType === 'STAFF' && (
                    <div className="p-3 bg-purple-50/80 border border-purple-200 rounded-xl space-y-2 animate-in fade-in">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                        <Briefcase className="w-4 h-4 text-purple-700" />
                        <span>Posisi / Jabatan Tenaga Kependidikan (Tendik)</span>
                      </div>
                      <select
                        value={formData.staffPosition}
                        onChange={(e) => setFormData({ ...formData, staffPosition: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-purple-300 bg-white text-slate-800 outline-hidden focus:ring-2 focus:ring-purple-500 font-semibold"
                      >
                        <option value="Kepala Tata Usaha (TU)">Kepala Tata Usaha (TU)</option>
                        <option value="Operator SIMPATIKA & EMIS Kemenag">Operator SIMPATIKA & EMIS Kemenag</option>
                        <option value="Bendahara Madrasah & SPP">Bendahara Madrasah & SPP</option>
                        <option value="Kepala Perpustakaan Digital & Literasi">Kepala Perpustakaan Digital & Literasi</option>
                        <option value="Pengelola Sarana Prasarana & Logistik">Pengelola Sarana Prasarana & Logistik</option>
                        <option value="Staf Administrasi Kesiswaan & Kurikulum">Staf Administrasi Kesiswaan & Kurikulum</option>
                        <option value="Laboran & Teknisi Komputer">Laboran & Teknisi Komputer</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">No. WhatsApp / HP</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0812-3456-7890"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Jabatan / Posisi Administrator
                      </label>
                      <select
                        value={formData.adminRoleTitle}
                        onChange={(e) => setFormData({ ...formData, adminRoleTitle: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                      >
                        <option value="Tata Usaha & Manajemen Sistem">Tata Usaha (TU) & Manajemen Sistem</option>
                        <option value="Kepala Madrasah & Pengawas">Kepala Madrasah & Pengawas</option>
                        <option value="Operator IT & Administrator LMS">Operator IT & Administrator LMS</option>
                        <option value="Bendahara Madrasah & SPP">Bendahara Madrasah & SPP</option>
                        <option value="Staf Administrasi Akademik">Staf Administrasi Akademik</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">No. WhatsApp / HP</label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="0812-3456-7890"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Resmi Madrasah</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="admin.tu@mi-assuyutiyah.sch.id"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    />
                  </div>
                </>
              )}

              {/* Input Password dan Konfirmasi Password untuk Akses Masing-masing */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <KeyRound className="w-4 h-4 text-emerald-700" />
                    <span className="font-bold text-xs text-slate-800">
                      Akses Login & Password {editingUser ? '(Ubah Password)' : '*'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPassword ? 'Sembunyikan' : 'Tampilkan'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Password {!editingUser && '*'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required={!editingUser}
                        maxLength={12}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder={editingUser ? 'Kosongkan jika tidak diubah' : '8-12 karakter'}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white text-slate-900 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Konfirmasi Password {!editingUser && '*'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required={!editingUser || Boolean(formData.password)}
                        maxLength={12}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        placeholder="Ulangi password"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white text-slate-900 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Real-time Password Policy Checklist */}
                {(() => {
                  const pass = formData.password;
                  const confirm = formData.confirmPassword;
                  const passLen = pass.length;
                  const hasLen = passLen >= 8 && passLen <= 12;
                  const hasUpper = /[A-Z]/.test(pass);
                  const hasLower = /[a-z]/.test(pass);
                  const hasSym = /[^A-Za-z0-9]/.test(pass);
                  const hasMatch = Boolean(pass && confirm && pass === confirm);
                  const allValid = hasLen && hasUpper && hasLower && hasSym && hasMatch;

                  return (
                    <div className="pt-2 border-t border-slate-200">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold text-slate-700">
                          Ketentuan Password (8 - 12 Karakter):
                        </span>
                        {allValid ? (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-700" /> Memenuhi Syarat
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-mono">
                            {passLen}/12 Karakter
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[10px]">
                        <div
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border font-medium transition-colors ${
                            hasLen
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                              : 'bg-white text-slate-500 border-slate-200'
                          }`}
                        >
                          <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${hasLen ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                            {hasLen ? '✓' : '•'}
                          </span>
                          <span>8 - 12 Karakter</span>
                        </div>

                        <div
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border font-medium transition-colors ${
                            hasUpper
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                              : 'bg-white text-slate-500 border-slate-200'
                          }`}
                        >
                          <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${hasUpper ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                            {hasUpper ? '✓' : '•'}
                          </span>
                          <span>Huruf Kapital (A-Z)</span>
                        </div>

                        <div
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border font-medium transition-colors ${
                            hasLower
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                              : 'bg-white text-slate-500 border-slate-200'
                          }`}
                        >
                          <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${hasLower ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                            {hasLower ? '✓' : '•'}
                          </span>
                          <span>Huruf Kecil (a-z)</span>
                        </div>

                        <div
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border font-medium transition-colors ${
                            hasSym
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                              : 'bg-white text-slate-500 border-slate-200'
                          }`}
                        >
                          <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${hasSym ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                            {hasSym ? '✓' : '•'}
                          </span>
                          <span>Simbol (@,#,$,!,dll)</span>
                        </div>

                        <div
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border font-medium col-span-2 sm:col-span-2 transition-colors ${
                            hasMatch
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                              : 'bg-white text-slate-500 border-slate-200'
                          }`}
                        >
                          <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${hasMatch ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                            {hasMatch ? '✓' : '•'}
                          </span>
                          <span>Konfirmasi Password Cocok</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                <p className="text-[10px] text-slate-500">
                  Password ini berlaku untuk {activeTab === 'SISWA' ? 'Siswa / Santri' : activeTab === 'GURU' ? 'Guru / Asatidz' : 'Administrator'} untuk masuk ke portal LMS masing-masing.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Domisili</label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Jl. Melati No. 12, Kel. Sukamaju"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-colors"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Pengguna */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 animate-in zoom-in-95">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Hapus Akun Pengguna</h3>
                <p className="text-xs text-slate-500">Konfirmasi penghapusan data akun madrasah</p>
              </div>
            </div>

            <div className="py-2 text-xs text-slate-600 space-y-3">
              <p>
                Apakah Anda yakin ingin menghapus akun pengguna berikut?
              </p>
              
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <div className="font-bold text-slate-900 text-sm">{userToDelete.name}</div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                    @{userToDelete.username}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded">
                    {userToDelete.role === 'SISWA' ? 'Siswa / Santri' : userToDelete.role === 'GURU' ? 'Guru / Asatidz' : 'Administrator'}
                  </span>
                </div>
                {userToDelete.email && (
                  <div className="text-[11px] text-slate-500">{userToDelete.email}</div>
                )}
              </div>

              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-[11px] flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>
                  Tindakan ini permanen. Pengguna tidak akan dapat login lagi menggunakan akun ini.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100 mt-4">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteUser(userToDelete.id);
                  setSuccessToast(`Pengguna "${userToDelete.name}" (@${userToDelete.username}) berhasil dihapus.`);
                  setUserToDelete(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus Pengguna</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Mutasi & Pindah Rombel Peserta Didik (Rekomendasi Wali Kelas / Siswa Berprestasi) */}
      {isMutationModalOpen && studentForMutation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Pindah Kelas & Rombel Peserta Didik
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Otoritas Admin: Mutasi Rombel & Akselerasi Siswa Berprestasi
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsMutationModalOpen(false);
                  setStudentForMutation(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmMutation} className="p-6 overflow-y-auto space-y-4 text-xs">
              {mutationError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2 text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{mutationError}</span>
                </div>
              )}

              {/* Profil Singkat Siswa */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Data Santri / Peserta Didik
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                    NISN: {studentForMutation.nisn || '-'}
                  </span>
                </div>
                <div className="flex items-center space-x-3 pt-1">
                  <img
                    src={studentForMutation.avatar}
                    alt={studentForMutation.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-300 shadow-2xs"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{studentForMutation.name}</h4>
                    <p className="text-[11px] text-slate-500 font-mono">@{studentForMutation.username}</p>
                  </div>
                </div>

                {studentForMutation.achievementBadge && (
                  <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-1.5 text-amber-900 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="font-semibold">{studentForMutation.achievementBadge}</span>
                  </div>
                )}
              </div>

              {/* Visual Visualisasi Perpindahan */}
              <div className="p-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 rounded-xl">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Alur Pemindahan Kelas & Rombel
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 p-2 bg-white rounded-lg border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-400 block">Rombel Asal</span>
                    <strong className="text-xs text-slate-800 font-bold">
                      {classes.find((c) => c.id === studentForMutation.classId)?.name || studentForMutation.className || 'Kelas Asal'}
                    </strong>
                    <span className="text-[9px] text-slate-500 block truncate">
                      Wali: {classes.find((c) => c.id === studentForMutation.classId)?.waliKelasName || '-'}
                    </span>
                  </div>

                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                  </div>

                  <div className="flex-1 p-2 bg-emerald-100/60 rounded-lg border border-emerald-300 text-center">
                    <span className="text-[10px] text-emerald-700 block">Rombel Tujuan</span>
                    <strong className="text-xs text-emerald-950 font-bold">
                      {classes.find((c) => c.id === mutationTargetClassId)?.name || 'Pilih Rombel'}
                    </strong>
                    <span className="text-[9px] text-emerald-800 block truncate">
                      Wali: {classes.find((c) => c.id === mutationTargetClassId)?.waliKelasName || '-'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Form Input Rombel Tujuan */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pilih Rombongan Belajar (Rombel) Tujuan *
                </label>
                <select
                  value={mutationTargetClassId}
                  onChange={(e) => setMutationTargetClassId(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  {classes.map((c) => {
                    const isCurrent = c.id === studentForMutation.classId;
                    return (
                      <option key={c.id} value={c.id} disabled={isCurrent}>
                        {c.name} (Tingkat {c.grade}) - Wali: {c.waliKelasName} {isCurrent ? '(Kelas Saat Ini)' : ''}
                      </option>
                    );
                  })}
                </select>
                <p className="text-[10px] text-slate-400 mt-1">
                  Contoh: Siswa berprestasi di Kelas 3C dapat langsung dipindahkan ke Kelas 4A berdasarkan rekomendasi wali kelas.
                </p>
              </div>

              {/* Kategori Dasar Pemindahan */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dasar & Kategori Pemindahan *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'PRESTASI', label: '🏆 Rekomendasi Wali Kelas (Siswa Berprestasi / Akselerasi)', desc: 'Prestasi istimewa' },
                    { id: 'KENAIKAN', label: '📈 Kenaikan Kelas Reguler', desc: 'Evaluasi tahunan' },
                    { id: 'MUTASI', label: '🔄 Penataan & Pemerataan Rombel', desc: 'Kapasitas kelas' },
                    { id: 'LAINNYA', label: '📝 Permintaan Khusus / Wali Santri', desc: 'Faktor domisili/kebutuhan' },
                  ].map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setMutationReasonType(cat.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        mutationReasonType === cat.id
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-2 ring-emerald-400'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-[11px] leading-snug">{cat.label}</div>
                      <div className="text-[9px] text-slate-400 font-normal mt-0.5">{cat.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* No Surat / Berita Acara Rekomendasi */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor Surat / Berita Acara Rekomendasi (Opsional)
                </label>
                <div className="relative">
                  <FileText className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={mutationDocNumber}
                    onChange={(e) => setMutationDocNumber(e.target.value)}
                    placeholder="Contoh: REK-WK/MI/2026/041"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 font-mono focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Catatan / Keterangan Rekomendasi */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan Rekomendasi Wali Kelas & Pertimbangan Akademik *
                </label>
                <textarea
                  rows={3}
                  required
                  value={mutationReasonText}
                  onChange={(e) => setMutationReasonText(e.target.value)}
                  placeholder="Tuliskan pertimbangan rekomendasi wali kelas, nilai rapor, atau surat keputusan..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden leading-relaxed"
                ></textarea>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] leading-relaxed flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Setelah pemindahan dikonfirmasi, data santri otomatis diperbarui di Buku Induk, daftar absensi rombel tujuan, serta rekap rapor madrasah.
                </span>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsMutationModalOpen(false);
                    setStudentForMutation(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Konfirmasi & Pindahkan Siswa</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
