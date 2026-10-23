import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  School,
  UserCheck,
  Plus,
  Users,
  DoorOpen,
  ArrowRightLeft,
  X,
  Check,
  AlertCircle,
  Edit2,
  Trash2,
  GraduationCap,
  Sparkles,
  Search,
  Phone,
  Mail,
  Award,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { ClassRoom } from '../../types/lms';
import { PromosiMassalModal } from './PromosiMassalModal';

export const ManajemenKelas: React.FC = () => {
  const { classes, users, updateClassWali, addClass, updateClass, deleteClass, updateUser } = useLMS();
  const [selectedClassId, setSelectedClassId] = useState<string>('c-5a');
  
  // Modals
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  const [isEditClassModalOpen, setIsEditClassModalOpen] = useState(false);
  const [isEditWaliModalOpen, setIsEditWaliModalOpen] = useState(false);
  const [isMoveStudentModalOpen, setIsMoveStudentModalOpen] = useState(false);
  const [isPromosiMassalOpen, setIsPromosiMassalOpen] = useState(false);
  
  // Selected student and target class for moving
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [targetClassId, setTargetClassId] = useState<string>('');
  const [moveReasonCategory, setMoveReasonCategory] = useState<'PRESTASI' | 'KENAIKAN' | 'MUTASI'>('PRESTASI');
  const [moveReasonNotes, setMoveReasonNotes] = useState('');
  
  // Student Search in Selected Class
  const [studentSearchQuery, setStudentSearchQuery] = useState('');

  // Toast and Form Error
  const [successToast, setSuccessToast] = useState('');
  const [classFormError, setClassFormError] = useState('');

  // Form State for Add / Edit Class
  const [classFormData, setClassFormData] = useState({
    name: '',
    grade: 1,
    waliKelasId: '',
    capacity: 30,
    roomNumber: '',
    academicYear: '2026/2027 Ganjil',
  });

  const teachers = users.filter((u) => u.role === 'GURU');
  const students = users.filter((u) => u.role === 'SISWA');

  const selectedClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const studentsInSelectedClass = students.filter((s) => s.classId === selectedClass?.id);
  const currentWaliUser = teachers.find(
    (t) => t.id === selectedClass?.waliKelasId || t.name === selectedClass?.waliKelasName
  );

  const [newWaliId, setNewWaliId] = useState(selectedClass?.waliKelasId || '');

  // Open Add Class Modal with smart defaults
  const handleOpenAddClass = () => {
    setClassFormError('');
    const defaultGrade = 1;
    const countInGrade = classes.filter((c) => c.grade === defaultGrade).length;
    const nextChar = String.fromCharCode(65 + countInGrade);
    const defaultWaliId = teachers[0]?.id || '';

    setClassFormData({
      name: `Kelas ${defaultGrade}${nextChar}`,
      grade: defaultGrade,
      waliKelasId: defaultWaliId,
      capacity: 30,
      roomNumber: `Gedung ${defaultGrade}, R.${defaultGrade}0${countInGrade + 1}`,
      academicYear: '2026/2027 Ganjil',
    });
    setIsAddClassModalOpen(true);
  };

  // Grade change in form updates name and room suggestion
  const handleGradeChange = (gradeVal: number) => {
    const countInGrade = classes.filter((c) => c.grade === gradeVal).length;
    const nextChar = String.fromCharCode(65 + countInGrade);
    setClassFormData((prev) => ({
      ...prev,
      grade: gradeVal,
      name: `Kelas ${gradeVal}${nextChar}`,
      roomNumber: `Gedung ${gradeVal}, R.${gradeVal}0${countInGrade + 1}`,
    }));
  };

  const handleSaveAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    setClassFormError('');

    if (!classFormData.name.trim()) {
      setClassFormError('Nama Rombongan Belajar (Rombel) wajib diisi.');
      return;
    }
    if (!classFormData.waliKelasId) {
      setClassFormError('Silakan pilih salah satu Ustadz/Ustadzah sebagai Wali Kelas.');
      return;
    }

    const selectedTeacher = teachers.find((t) => t.id === classFormData.waliKelasId);
    const generatedId = `c-${Date.now()}`;

    addClass({
      name: classFormData.name.trim(),
      grade: Number(classFormData.grade),
      waliKelasId: classFormData.waliKelasId,
      waliKelasName: selectedTeacher ? selectedTeacher.name : 'Belum Ditentukan',
      capacity: Number(classFormData.capacity) || 30,
      totalStudents: 0,
      roomNumber: classFormData.roomNumber.trim() || `Gedung ${classFormData.grade}`,
      academicYear: classFormData.academicYear.trim() || '2026/2027 Ganjil',
    });

    setSelectedClassId(generatedId);
    setSuccessToast(
      `Rombongan Belajar (Rombel) "${classFormData.name.trim()}" berhasil ditambahkan! Wali Kelas: ${selectedTeacher?.name || '-'}`
    );
    setIsAddClassModalOpen(false);
  };

  // Open Edit Class Modal
  const handleOpenEditClass = (c: ClassRoom) => {
    setClassFormError('');
    setClassFormData({
      name: c.name,
      grade: c.grade,
      waliKelasId: c.waliKelasId,
      capacity: c.capacity,
      roomNumber: c.roomNumber,
      academicYear: c.academicYear,
    });
    setIsEditClassModalOpen(true);
  };

  const handleSaveEditClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass) return;

    if (!classFormData.name.trim()) {
      setClassFormError('Nama Rombel wajib diisi.');
      return;
    }

    const selectedTeacher = teachers.find((t) => t.id === classFormData.waliKelasId);
    updateClass(selectedClass.id, {
      name: classFormData.name.trim(),
      grade: Number(classFormData.grade),
      waliKelasId: classFormData.waliKelasId,
      waliKelasName: selectedTeacher ? selectedTeacher.name : selectedClass.waliKelasName,
      capacity: Number(classFormData.capacity) || 30,
      roomNumber: classFormData.roomNumber.trim() || selectedClass.roomNumber,
      academicYear: classFormData.academicYear.trim() || selectedClass.academicYear,
    });

    setSuccessToast(`Informasi rombel "${classFormData.name.trim()}" berhasil diperbarui.`);
    setIsEditClassModalOpen(false);
  };

  // Delete Class with in-app modal confirmation
  const [classToDelete, setClassToDelete] = useState<ClassRoom | null>(null);

  const handleDeleteClass = (c: ClassRoom) => {
    setClassToDelete(c);
  };

  const handleConfirmDeleteClass = () => {
    if (!classToDelete) return;
    const c = classToDelete;
    deleteClass(c.id);
    setSuccessToast(`Rombongan Belajar "${c.name}" telah berhasil dihapus.`);
    const remaining = classes.filter((item) => item.id !== c.id);
    if (remaining.length > 0) {
      setSelectedClassId(remaining[0].id);
    }
    setClassToDelete(null);
  };

  const handleOpenEditWali = () => {
    if (selectedClass) {
      setNewWaliId(selectedClass.waliKelasId);
      setIsEditWaliModalOpen(true);
    }
  };

  const handleSaveWali = (e: React.FormEvent) => {
    e.preventDefault();
    const teacherObj = teachers.find((t) => t.id === newWaliId);
    if (teacherObj && selectedClass) {
      updateClassWali(selectedClass.id, teacherObj.id, teacherObj.name);
      setSuccessToast(`Wali kelas ${selectedClass.name} berhasil diubah menjadi ${teacherObj.name}.`);
    }
    setIsEditWaliModalOpen(false);
  };

  const handleMoveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const targetObj = classes.find((c) => c.id === targetClassId);
    const studentObj = students.find((s) => s.id === selectedStudentId);
    if (selectedStudentId && targetObj && studentObj) {
      const fromClassName = selectedClass?.name || studentObj.className || 'Kelas Asal';
      const newMutation = {
        id: `mut-${Date.now()}`,
        fromClassId: studentObj.classId || '',
        fromClassName,
        toClassId: targetObj.id,
        toClassName: targetObj.name,
        date: new Date().toISOString().split('T')[0],
        reasonType: moveReasonCategory,
        reasonText: moveReasonNotes.trim() || 'Rekomendasi Wali Kelas',
        approvedBy: 'Administrator Madrasah',
      };

      updateUser(selectedStudentId, {
        classId: targetObj.id,
        className: targetObj.name,
        mutations: [...(studentObj.mutations || []), newMutation as any],
        achievementBadge:
          moveReasonCategory === 'PRESTASI'
            ? `Siswa Berprestasi (Akselerasi ${fromClassName} ➔ ${targetObj.name})`
            : studentObj.achievementBadge,
      });

      setSuccessToast(
        `Alhamdulillah! Santri "${studentObj.name}" berhasil dipindahkan dari ${fromClassName} ke ${targetObj.name} (${
          moveReasonCategory === 'PRESTASI'
            ? 'Rekomendasi Wali Kelas: Siswa Berprestasi'
            : 'Mutasi Rombel'
        }).`
      );
    }
    setIsMoveStudentModalOpen(false);
    setSelectedStudentId('');
    setMoveReasonNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <School className="w-6 h-6 text-emerald-700" />
            <span>Manajemen Kelas & Rombel</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Diagram Alur: Plotting Wali Kelas & Siswa per Rombongan Belajar (Rombel)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPromosiMassalOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-800/20 flex items-center gap-2 cursor-pointer transition-all active:scale-95 border border-emerald-600/30"
          >
            <ArrowRightLeft className="w-4 h-4 text-amber-300" />
            <span>Promosi Massal Rombel (1-Klik)</span>
          </button>
        </div>
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
            className="p-1 text-emerald-500 hover:text-emerald-700 rounded-lg hover:bg-emerald-100/50"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Grid of Class Badges / Tabs */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Daftar Rombel Aktif ({classes.length} Rombel)
          </span>
          <span className="text-[11px] text-slate-500">
            Klik rombel untuk melihat dan memetakan santri
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {classes.map((c) => {
            const isSelected = c.id === selectedClassId;
            const classStudentsCount = students.filter((s) => s.classId === c.id).length;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedClassId(c.id)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative group ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-700/20'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40'
                }`}
              >
                <div className="text-xs font-extrabold">{c.name}</div>
                <div
                  className={`text-[10px] truncate mt-0.5 ${
                    isSelected ? 'text-emerald-100' : 'text-slate-500'
                  }`}
                  title={c.waliKelasName}
                >
                  {c.waliKelasName.replace('Usth. ', '').replace('Ust. ', '')}
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px]">
                  <span className={isSelected ? 'text-amber-200 font-semibold' : 'text-slate-400'}>
                    {classStudentsCount} Siswa
                  </span>
                  <span
                    className={`px-1.5 py-0.2 rounded font-semibold text-[9px] ${
                      isSelected ? 'bg-white/20' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    Gd {c.grade}
                  </span>
                </div>
              </button>
            );
          })}

          {/* Quick Add Card */}
          <button
            onClick={handleOpenAddClass}
            className="p-3 rounded-2xl border-2 border-dashed border-emerald-300 hover:border-emerald-600 hover:bg-emerald-50/60 flex flex-col items-center justify-center text-center transition-all group min-h-[82px] cursor-pointer"
            title="Tambah Rombel Baru"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-100 group-hover:bg-emerald-600 text-emerald-700 group-hover:text-white flex items-center justify-center transition-colors mb-1">
              <Plus className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-800 group-hover:text-emerald-900">
              + Tambah Rombel
            </span>
          </button>
        </div>
      </div>

      {/* Selected Class Details & Plotting Controls */}
      {selectedClass ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Class Profile & Wali Kelas Card */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Informasi Rombel & Wali
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">{selectedClass.name}</h3>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-lg">
                    {selectedClass.academicYear}
                  </span>
                </div>
              </div>

              {/* Profil Lengkap Wali Kelas */}
              <div className="p-3.5 bg-gradient-to-br from-emerald-50/80 to-teal-50/50 border border-emerald-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Wali Kelas Resmi</span>
                  </span>
                  <button
                    onClick={handleOpenEditWali}
                    className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 bg-white border border-emerald-300 px-2 py-0.5 rounded-lg transition-colors cursor-pointer shadow-2xs"
                  >
                    Ganti Wali
                  </button>
                </div>

                <div className="flex items-center space-x-3">
                  <img
                    src={currentWaliUser?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'}
                    alt={selectedClass.waliKelasName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shadow-xs shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-slate-900 text-sm truncate">{selectedClass.waliKelasName}</h4>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {currentWaliUser?.nip ? `NIP: ${currentWaliUser.nip}` : 'Pendidik Madrasah'}
                    </p>
                    <span className="inline-block mt-0.5 px-2 py-0.2 text-[9px] font-bold rounded bg-emerald-100 text-emerald-800">
                      Wali Rombel {selectedClass.name}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-emerald-200/60 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Kontak WhatsApp:</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1 text-[11px]">
                      <Phone className="w-3 h-3 text-emerald-600" /> {currentWaliUser?.phone || '0812-3456-7890'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Email Resmi:</span>
                    <span className="font-mono text-slate-700 text-[10px] truncate max-w-[180px]">
                      {currentWaliUser?.email || `${selectedClass.name.toLowerCase()}@mi-assuyutiyah.sch.id`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Mata Pelajaran:</span>
                    <span className="font-medium text-slate-700 text-[10px] truncate max-w-[170px]">
                      {currentWaliUser?.subjectsTaught?.join(', ') || 'Semua Mapel Rombel'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="text-slate-400 text-[11px]">Ruang Belajar / Gedung:</div>
                  <div className="font-medium text-slate-800 mt-0.5 flex items-center gap-1.5">
                    <DoorOpen className="w-3.5 h-3.5 text-emerald-600" /> {selectedClass.roomNumber}
                  </div>
                </div>

                {/* Komposisi Siswa & Kapasitas */}
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                    <span>Kapasitas Kursi Terisi:</span>
                    <span className="font-bold text-slate-800">
                      {studentsInSelectedClass.length} / {selectedClass.capacity} Kursi
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(
                          100,
                          (studentsInSelectedClass.length / (selectedClass.capacity || 30)) * 100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Ringkasan Rasio Gender */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-center text-xs">
                  <div className="p-2 bg-blue-50 border border-blue-200 rounded-xl">
                    <span className="text-[10px] text-blue-700 font-semibold block">Santri Ikhwan (L)</span>
                    <span className="text-sm font-bold text-blue-900">
                      {studentsInSelectedClass.filter((s) => s.gender === 'L').length} Siswa
                    </span>
                  </div>
                  <div className="p-2 bg-pink-50 border border-pink-200 rounded-xl">
                    <span className="text-[10px] text-pink-700 font-semibold block">Santri Akhwat (P)</span>
                    <span className="text-sm font-bold text-pink-900">
                      {studentsInSelectedClass.filter((s) => s.gender === 'P').length} Siswa
                    </span>
                  </div>
                </div>

                {/* Edit & Delete Action Buttons */}
                <div className="pt-2 flex items-center space-x-2 border-t border-slate-100">
                  <button
                    onClick={() => handleOpenEditClass(selectedClass)}
                    className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Edit Rombel</span>
                  </button>
                  <button
                    onClick={() => handleDeleteClass(selectedClass)}
                    className="py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                    title="Hapus Rombel"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] leading-relaxed">
                💡 <strong>Catatan Plotting:</strong> Penempatan wali kelas menentukan hak akses pengisian absensi harian dan penerbitan rapor digital bagi santri di rombel ini.
              </div>
            </div>
          </div>

          {/* Students in Class Table & Plotting */}
          <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>Daftar Peserta Didik di {selectedClass.name}</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Total {studentsInSelectedClass.length} santri aktif • Wali Kelas: <strong className="text-emerald-800">{selectedClass.waliKelasName}</strong>
                </p>
              </div>

              <button
                onClick={() => {
                  if (studentsInSelectedClass.length > 0) {
                    setSelectedStudentId(studentsInSelectedClass[0].id);
                    setTargetClassId(classes.find((c) => c.id !== selectedClass.id)?.id || '');
                    setMoveReasonCategory('PRESTASI');
                    setMoveReasonNotes('Rekomendasi Wali Kelas karena siswa berprestasi.');
                    setIsMoveStudentModalOpen(true);
                  }
                }}
                disabled={studentsInSelectedClass.length === 0}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs shadow-emerald-700/20"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Pindah Rombel Siswa</span>
              </button>
            </div>

            {/* Student Search in Class */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={studentSearchQuery}
                onChange={(e) => setStudentSearchQuery(e.target.value)}
                placeholder={`Cari nama santri atau NISN di ${selectedClass.name}...`}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold border-b border-slate-100">
                  <tr>
                    <th className="py-2.5 px-3">No</th>
                    <th className="py-2.5 px-3">Nama Santri</th>
                    <th className="py-2.5 px-3">NISN & Gender</th>
                    <th className="py-2.5 px-3">Wali Murid</th>
                    <th className="py-2.5 px-3 text-center">Aksi Rombel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentsInSelectedClass.filter((st) => {
                    const q = studentSearchQuery.toLowerCase();
                    return (
                      st.name.toLowerCase().includes(q) ||
                      (st.nisn && st.nisn.includes(q)) ||
                      (st.username && st.username.toLowerCase().includes(q))
                    );
                  }).length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        {studentSearchQuery
                          ? 'Tidak ada santri yang cocok dengan pencarian di rombel ini.'
                          : 'Belum ada santri yang di-plotting ke rombel ini. Anda dapat memindahkan siswa dari rombel lain ke sini.'}
                      </td>
                    </tr>
                  ) : (
                    studentsInSelectedClass
                      .filter((st) => {
                        const q = studentSearchQuery.toLowerCase();
                        return (
                          st.name.toLowerCase().includes(q) ||
                          (st.nisn && st.nisn.includes(q)) ||
                          (st.username && st.username.toLowerCase().includes(q))
                        );
                      })
                      .map((st, idx) => (
                        <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2.5 px-3 text-slate-400 font-mono">{idx + 1}</td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center space-x-2.5">
                              <img
                                src={st.avatar}
                                alt={st.name}
                                className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-2xs"
                              />
                              <div>
                                <span className="font-bold text-slate-900 block">{st.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono">@{st.username}</span>
                                {st.achievementBadge && (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200 mt-0.5">
                                    <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                                    <span>{st.achievementBadge}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-mono text-slate-700 font-semibold">{st.nisn || '-'}</div>
                            <span
                              className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-bold mt-0.5 ${
                                st.gender === 'L'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : 'bg-pink-50 text-pink-700 border border-pink-200'
                              }`}
                            >
                              {st.gender === 'L' ? 'Ikhwan (L)' : 'Akhwat (P)'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="text-slate-700 font-medium">{st.parentName || '-'}</div>
                            <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Phone className="w-2.5 h-2.5 text-emerald-600" />
                              <span>{st.parentPhone || st.phone || '-'}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <button
                              onClick={() => {
                                setSelectedStudentId(st.id);
                                setTargetClassId(classes.find((c) => c.id !== selectedClass.id)?.id || '');
                                setMoveReasonCategory(st.achievementBadge || st.name.includes('Rizki') ? 'PRESTASI' : 'PRESTASI');
                                setMoveReasonNotes(
                                  st.achievementBadge || st.name.includes('Rizki')
                                    ? `Rekomendasi dari wali kelas ${selectedClass.name} untuk akselerasi rombel karena berprestasi tinggi.`
                                    : `Rekomendasi mutasi rombel dari wali kelas ${selectedClass.name}.`
                                );
                                setIsMoveStudentModalOpen(true);
                              }}
                              className="px-2.5 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer shadow-2xs"
                              title="Pindahkan Rombel Santri ini"
                            >
                              <ArrowRightLeft className="w-3 h-3 text-emerald-600" />
                              <span>Pindah Rombel</span>
                            </button>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
          <p className="text-slate-500 text-sm">Tidak ada rombongan belajar yang dipilih.</p>
          <button
            onClick={handleOpenAddClass}
            className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Tambah Rombel Baru
          </button>
        </div>
      )}

      {/* Modal Tambah Kelas & Rombel Baru */}
      {isAddClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <School className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Tambah Kelas & Rombel Baru</h3>
                  <p className="text-[11px] text-slate-500">Buat rombongan belajar baru untuk tahun ajaran aktif</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddClassModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAddClass} className="mt-4 space-y-4">
              {classFormError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2 text-rose-700 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{classFormError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tingkat Kelas (Grade) *
                  </label>
                  <select
                    value={classFormData.grade}
                    onChange={(e) => handleGradeChange(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value={1}>Kelas 1 (Ibtidaiyah Awal)</option>
                    <option value={2}>Kelas 2</option>
                    <option value={3}>Kelas 3</option>
                    <option value={4}>Kelas 4</option>
                    <option value={5}>Kelas 5</option>
                    <option value={6}>Kelas 6 (Tingkat Akhir)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Rombel / Kelas *
                  </label>
                  <input
                    type="text"
                    required
                    value={classFormData.name}
                    onChange={(e) => setClassFormData({ ...classFormData, name: e.target.value })}
                    placeholder="Contoh: Kelas 1B atau Kelas 5C"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Wali Kelas (Asatidz Penanggung Jawab) *
                </label>
                <select
                  required
                  value={classFormData.waliKelasId}
                  onChange={(e) => setClassFormData({ ...classFormData, waliKelasId: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">-- Pilih Ustadz / Ustadzah --</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} — ({t.subjectsTaught?.join(', ') || 'Guru'})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-500 mt-1">
                  Wali kelas memiliki wewenang untuk input kehadiran, catatan sikap, dan cetak rapor santri di rombel ini.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kapasitas Siswa (Jumlah Kursi)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={classFormData.capacity}
                    onChange={(e) => setClassFormData({ ...classFormData, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ruang Belajar / Gedung
                  </label>
                  <input
                    type="text"
                    value={classFormData.roomNumber}
                    onChange={(e) => setClassFormData({ ...classFormData, roomNumber: e.target.value })}
                    placeholder="Contoh: Gedung A, R. 201"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tahun Ajaran & Semester
                </label>
                <input
                  type="text"
                  value={classFormData.academicYear}
                  onChange={(e) => setClassFormData({ ...classFormData, academicYear: e.target.value })}
                  placeholder="2026/2027 Ganjil"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddClassModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Simpan Rombel Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Info Rombel */}
      {isEditClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Edit Informasi Rombel: {selectedClass?.name}
              </h3>
              <button
                onClick={() => setIsEditClassModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditClass} className="mt-4 space-y-4">
              {classFormError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2 text-rose-700 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{classFormError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tingkat Kelas (Grade)
                  </label>
                  <select
                    value={classFormData.grade}
                    onChange={(e) => setClassFormData({ ...classFormData, grade: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value={1}>Kelas 1</option>
                    <option value={2}>Kelas 2</option>
                    <option value={3}>Kelas 3</option>
                    <option value={4}>Kelas 4</option>
                    <option value={5}>Kelas 5</option>
                    <option value={6}>Kelas 6</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Rombel *
                  </label>
                  <input
                    type="text"
                    required
                    value={classFormData.name}
                    onChange={(e) => setClassFormData({ ...classFormData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Wali Kelas
                </label>
                <select
                  value={classFormData.waliKelasId}
                  onChange={(e) => setClassFormData({ ...classFormData, waliKelasId: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.subjectsTaught?.join(', ') || 'Guru'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kapasitas Kursi Siswa
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={classFormData.capacity}
                    onChange={(e) => setClassFormData({ ...classFormData, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ruang Belajar
                  </label>
                  <input
                    type="text"
                    value={classFormData.roomNumber}
                    onChange={(e) => setClassFormData({ ...classFormData, roomNumber: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tahun Ajaran
                </label>
                <input
                  type="text"
                  value={classFormData.academicYear}
                  onChange={(e) => setClassFormData({ ...classFormData, academicYear: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditClassModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Wali Kelas Cepat */}
      {isEditWaliModalOpen && selectedClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Plotting Wali Kelas: {selectedClass.name}
              </h3>
              <button
                onClick={() => setIsEditWaliModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveWali} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pilih Ustadz / Ustadzah sebagai Wali Kelas
                </label>
                <select
                  value={newWaliId}
                  onChange={(e) => setNewWaliId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.subjectsTaught?.join(', ') || 'Guru'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditWaliModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Tetapkan Wali Kelas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Pindah Rombel Siswa */}
      {isMoveStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Pindah Rombel Santri</h3>
              <button
                onClick={() => setIsMoveStudentModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleMoveStudent} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pilih Siswa / Santri
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (Sekarang: {s.className || 'Kelas 5A'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pindahkan ke Rombel Tujuan
                </label>
                <select
                  value={targetClassId}
                  onChange={(e) => setTargetClassId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (Wali: {c.waliKelasName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsMoveStudentModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Konfirmasi Pindah Rombel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Rombel */}
      {classToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 animate-in zoom-in-95">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Hapus Rombongan Belajar</h3>
                <p className="text-xs text-slate-500">Konfirmasi penghapusan data kelas</p>
              </div>
            </div>

            <div className="py-2 text-xs text-slate-600 space-y-3">
              <p>
                Apakah Anda yakin ingin menghapus rombongan belajar{' '}
                <strong className="text-slate-900 text-sm">"{classToDelete.name}"</strong>?
              </p>
              
              {students.filter((s) => s.classId === classToDelete.id).length > 0 ? (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-start space-x-2 leading-relaxed">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Rombel ini memiliki <strong>{students.filter((s) => s.classId === classToDelete.id).length} santri aktif</strong>. Jika rombel dihapus, data rombel akan dihapus dan santri dapat di-plotting ulang ke rombel lain.
                  </span>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-xs flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Rombel ini belum memiliki santri terdaftar. Data aman dihapus.</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100 mt-4">
              <button
                type="button"
                onClick={() => setClassToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteClass}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus Rombel</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Promosi Massal Akhir Tahun Ajaran Modal */}
      <PromosiMassalModal
        isOpen={isPromosiMassalOpen}
        onClose={() => setIsPromosiMassalOpen(false)}
        onSuccess={(msg) => setSuccessToast(msg)}
      />
    </div>
  );
};
