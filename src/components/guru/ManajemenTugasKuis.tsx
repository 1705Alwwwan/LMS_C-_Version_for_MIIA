import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  ClipboardList,
  Clock,
  HelpCircle,
  Award,
  Plus,
  CheckCircle,
  FileText,
  X,
  MessageSquare,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { Assignment, Quiz, StudentSubmission, QuizQuestion } from '../../types/lms';

export const ManajemenTugasKuis: React.FC = () => {
  const {
    assignments,
    quizzes,
    submissions,
    subjects,
    classes,
    currentUser,
    addAssignment,
    addQuiz,
    gradeSubmission,
  } = useLMS();

  const [activeTab, setActiveTab] = useState<'TUGAS' | 'KUIS' | 'KOREKSI'>('KOREKSI');

  // Modal Create Assignment
  const [isAddAssignmentOpen, setIsAddAssignmentOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    subjectId: 'sb-3',
    classId: 'c-5a',
    description: '',
    deadline: '2026-10-25T23:59',
    maxScore: 100,
  });

  // Modal Create Quiz with Bank Soal
  const [isAddQuizOpen, setIsAddQuizOpen] = useState(false);
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    subjectId: 'sb-3',
    classId: 'c-5a',
    durationMinutes: 25,
    deadline: '2026-10-30T12:00',
  });
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([
    {
      id: 'q-new-1',
      questionText: 'Sebutkan rukun wudhu yang pertama...',
      type: 'multiple_choice',
      options: ['Membasuh muka', 'Niat', 'Membasuh tangan', 'Mengusap sebagian kepala'],
      correctAnswerIndex: 1,
      points: 25,
    },
    {
      id: 'q-new-2',
      questionText: 'Berapa jumlah takbir pada rakaat pertama shalat Idul Fitri setelah takbiratul ihram?',
      type: 'multiple_choice',
      options: ['5 kali takbir', '7 kali takbir', '3 kali takbir', '9 kali takbir'],
      correctAnswerIndex: 1,
      points: 25,
    },
  ]);

  // Modal Grading Submission
  const [selectedSubmissionToGrade, setSelectedSubmissionToGrade] = useState<StudentSubmission | null>(null);
  const [gradeInput, setGradeInput] = useState<number>(90);
  const [feedbackInput, setFeedbackInput] = useState<string>('Bagus sekali, pemahaman fikih sangat tepat dan tulisan rapi.');

  // Handle Add Assignment
  const handleSaveAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    const s = subjects.find((sb) => sb.id === newAssignment.subjectId) || subjects[0];
    const c = classes.find((cl) => cl.id === newAssignment.classId) || classes[0];

    addAssignment({
      title: newAssignment.title,
      subjectId: s.id,
      subjectName: s.name,
      classId: c.id,
      className: c.name,
      teacherId: currentUser?.id || 'user-guru-1',
      teacherName: currentUser?.name || 'Usth. Siti Fatimah, S.Pd.I',
      description: newAssignment.description,
      deadline: newAssignment.deadline,
      maxScore: Number(newAssignment.maxScore) || 100,
    });
    setIsAddAssignmentOpen(false);
  };

  // Handle Add Quiz
  const handleSaveQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    const s = subjects.find((sb) => sb.id === newQuiz.subjectId) || subjects[0];
    const c = classes.find((cl) => cl.id === newQuiz.classId) || classes[0];
    const totalPoints = quizQuestions.reduce((acc, q) => acc + q.points, 0);

    addQuiz({
      title: newQuiz.title,
      subjectId: s.id,
      subjectName: s.name,
      classId: c.id,
      className: c.name,
      teacherId: currentUser?.id || 'user-guru-1',
      teacherName: currentUser?.name || 'Usth. Siti Fatimah, S.Pd.I',
      durationMinutes: Number(newQuiz.durationMinutes) || 20,
      deadline: newQuiz.deadline,
      totalPoints,
      questions: quizQuestions,
    });
    setIsAddQuizOpen(false);
  };

  // Handle Grading
  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSubmissionToGrade) {
      gradeSubmission(
        selectedSubmissionToGrade.id,
        Number(gradeInput),
        feedbackInput,
        currentUser?.name || 'Usth. Siti Fatimah, S.Pd.I'
      );
      setSelectedSubmissionToGrade(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header matching diagram */}
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-emerald-700" />
          <span>Manajemen Tugas & Kuis</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Diagram Alur: Buat Tugas & Deadline, Buat Bank Soal Kuis CBT, dan Koreksi & Umpan Balik Santri
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('KOREKSI')}
          className={`pb-3 px-4 text-xs font-bold flex items-center space-x-2 border-b-2 transition-colors ${
            activeTab === 'KOREKSI'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Koreksi & Umpan Balik ({submissions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('TUGAS')}
          className={`pb-3 px-4 text-xs font-bold flex items-center space-x-2 border-b-2 transition-colors ${
            activeTab === 'TUGAS'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Buat Tugas & Deadline ({assignments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('KUIS')}
          className={`pb-3 px-4 text-xs font-bold flex items-center space-x-2 border-b-2 transition-colors ${
            activeTab === 'KUIS'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Bank Soal Kuis CBT ({quizzes.length})</span>
        </button>
      </div>

      {/* 1. Koreksi & Umpan Balik */}
      {activeTab === 'KOREKSI' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Kiriman Berkas & Jawaban Tugas Santri</h3>
              <p className="text-xs text-slate-500">
                Periksa hasil pengerjaan tugas santri, input nilai angka (0-100), dan berikan catatan evaluasi
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase text-[10px] font-semibold">
                  <tr>
                    <th className="py-3 px-4">Santri</th>
                    <th className="py-3 px-4">Tugas / Mata Pelajaran</th>
                    <th className="py-3 px-4">Waktu Kirim</th>
                    <th className="py-3 px-4">Lampiran & Jawaban</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Nilai</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{sub.studentName}</div>
                        <span className="text-[10px] text-slate-400">Kelas 5A</span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 max-w-xs">{sub.assignmentTitle}</div>
                      </td>

                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{sub.submittedAt}</td>

                      <td className="py-3 px-4 max-w-xs">
                        {sub.fileName && (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono mb-1">
                            <FileText className="w-3 h-3 text-emerald-600" /> {sub.fileName}
                          </div>
                        )}
                        <p className="text-[11px] text-slate-600 line-clamp-1 italic">
                          "{sub.answerText}"
                        </p>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            sub.status === 'Sudah Dinilai'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {sub.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        {sub.score !== undefined ? (
                          <span className="font-black text-sm text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                            {sub.score}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedSubmissionToGrade(sub);
                            setGradeInput(sub.score || 90);
                            setFeedbackInput(sub.feedback || 'Mumtaz! Jawaban sangat baik dan tepat.');
                          }}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 shadow-xs"
                        >
                          <span>{sub.status === 'Sudah Dinilai' ? 'Ubah Nilai' : 'Koreksi'}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. Daftar & Buat Tugas */}
      {activeTab === 'TUGAS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Daftar Tugas & Batas Waktu (Deadline)</h3>
              <p className="text-xs text-slate-500">Kelola instruksi penugasan harian atau portofolio santri</p>
            </div>
            <button
              onClick={() => setIsAddAssignmentOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Tugas Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignments.map((asg) => (
              <div
                key={asg.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {asg.subjectName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">{asg.className}</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 line-clamp-2">{asg.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{asg.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-rose-500" /> Deadline:
                    </span>
                    <span className="font-bold text-rose-700">
                      {asg.deadline.replace('T', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Maks. Nilai: {asg.maxScore}</span>
                    <span>Oleh: {asg.teacherName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Bank Soal Kuis */}
      {activeTab === 'KUIS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Bank Soal Kuis CBT & Ujian Tengah Semester</h3>
              <p className="text-xs text-slate-500">Soal interaktif otomatis terkoreksi untuk menguji pemahaman santri</p>
            </div>
            <button
              onClick={() => setIsAddQuizOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Bank Soal Kuis</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizzes.map((qz) => (
              <div
                key={qz.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      {qz.subjectName} • {qz.className}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-700 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {qz.durationMinutes} Menit
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">{qz.title}</h4>
                  <div className="mt-2 text-xs text-slate-500 flex items-center gap-3">
                    <span>{qz.questions.length} Butir Soal PG</span>
                    <span>•</span>
                    <span>Total {qz.totalPoints} Poin</span>
                  </div>

                  {/* Question preview list */}
                  <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Contoh Soal di Bank:</p>
                    {qz.questions.slice(0, 2).map((q, idx) => (
                      <div key={q.id} className="text-[11px] text-slate-700">
                        <span className="font-bold text-emerald-800">{idx + 1}.</span> {q.questionText}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Batas Ujian: {qz.deadline.replace('T', ' ')}</span>
                  <span className="font-semibold text-emerald-700">Siap Dikerjakan Siswa</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Buat Tugas */}
      {isAddAssignmentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Buat Tugas & Tentukan Deadline</h3>
              <button onClick={() => setIsAddAssignmentOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAssignment} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Judul Tugas *</label>
                <input
                  type="text"
                  required
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  placeholder="Contoh: Menghafal & Menulis Kaligrafi Fikih Wudhu"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
                  <select
                    value={newAssignment.subjectId}
                    onChange={(e) => setNewAssignment({ ...newAssignment, subjectId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kelas</label>
                  <select
                    value={newAssignment.classId}
                    onChange={(e) => setNewAssignment({ ...newAssignment, classId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Batas Waktu Pengumpulan (Deadline)</label>
                <input
                  type="datetime-local"
                  required
                  value={newAssignment.deadline}
                  onChange={(e) => setNewAssignment({ ...newAssignment, deadline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Instruksi Tugas *</label>
                <textarea
                  rows={3}
                  required
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  placeholder="Jelaskan apa yang harus dikerjakan santri, format tulisan, atau lampiran foto..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddAssignmentOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-colors"
                >
                  Terbitkan Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Buat Bank Soal Kuis */}
      {isAddQuizOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Buat Bank Soal Kuis Interaktif (CBT)</h3>
              <button onClick={() => setIsAddQuizOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveQuiz} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Judul Kuis / Ujian *</label>
                <input
                  type="text"
                  required
                  value={newQuiz.title}
                  onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                  placeholder="Contoh: Kuis Fikih Bab Najis & Thaharah"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mapel</label>
                  <select
                    value={newQuiz.subjectId}
                    onChange={(e) => setNewQuiz({ ...newQuiz, subjectId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kelas</label>
                  <select
                    value={newQuiz.classId}
                    onChange={(e) => setNewQuiz({ ...newQuiz, classId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Durasi (Menit)</label>
                  <input
                    type="number"
                    min="5"
                    max="120"
                    value={newQuiz.durationMinutes}
                    onChange={(e) => setNewQuiz({ ...newQuiz, durationMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Bank Soal Questions Preview */}
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Daftar Soal Pilihan Ganda ({quizQuestions.length} Soal)</span>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Otomatis Dinilai Sistem
                  </span>
                </div>

                {quizQuestions.map((q, idx) => (
                  <div key={q.id} className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900">
                      Soal {idx + 1}: {q.questionText}
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-600 pl-2">
                      {q.options.map((opt, optIdx) => (
                        <div
                          key={optIdx}
                          className={optIdx === q.correctAnswerIndex ? 'font-bold text-emerald-700' : ''}
                        >
                          {String.fromCharCode(65 + optIdx)}. {opt} {optIdx === q.correctAnswerIndex && '✓ (Kunci)'}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddQuizOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-colors"
                >
                  Simpan & Rilis Kuis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Koreksi & Umpan Balik */}
      {selectedSubmissionToGrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-emerald-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-300 uppercase">
                  Koreksi & Evaluasi Jawaban Santri
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">
                  {selectedSubmissionToGrade.studentName}
                </h3>
              </div>
              <button onClick={() => setSelectedSubmissionToGrade(null)} className="text-white hover:text-slate-300 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveGrade} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <p className="text-slate-500"><strong>Tugas:</strong> {selectedSubmissionToGrade.assignmentTitle}</p>
                <p className="text-slate-500"><strong>Waktu Kirim:</strong> {selectedSubmissionToGrade.submittedAt}</p>
                {selectedSubmissionToGrade.fileName && (
                  <p className="text-emerald-800 font-medium flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" /> Berkas Terlampir: {selectedSubmissionToGrade.fileName} ({selectedSubmissionToGrade.fileSize})
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Isi Jawaban Santri:</label>
                <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-slate-800 leading-relaxed whitespace-pre-line max-h-40 overflow-y-auto">
                  {selectedSubmissionToGrade.answerText}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nilai Angka (Skala 0 - 100) *</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={gradeInput}
                  onChange={(e) => setGradeInput(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden font-bold text-sm text-emerald-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan & Umpan Balik Guru (Feedback) *</label>
                <textarea
                  rows={3}
                  required
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  placeholder="Berikan apresiasi, koreksi tajwid atau arahan perbaikan untuk santri..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedSubmissionToGrade(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-colors"
                >
                  Simpan Nilai & Umpan Balik
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
