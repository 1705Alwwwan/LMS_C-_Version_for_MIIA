import React, { useState, useEffect } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  ClipboardList,
  Clock,
  CheckCircle,
  HelpCircle,
  Upload,
  FileText,
  AlertCircle,
  X,
  Send,
  Award,
  ChevronRight,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Assignment, Quiz, QuizQuestion } from '../../types/lms';

export const TugasUjian: React.FC = () => {
  const {
    assignments,
    quizzes,
    submissions,
    quizAttempts,
    currentUser,
    submitAssignment,
    submitQuizAttempt,
    setCurrentView,
  } = useLMS();

  const [activeTab, setActiveTab] = useState<'TUGAS' | 'CBT'>('TUGAS');

  // Modal Submit Assignment
  const [selectedAssignmentToSubmit, setSelectedAssignmentToSubmit] = useState<Assignment | null>(null);
  const [answerTextInput, setAnswerTextInput] = useState('');
  const [mockFileName, setMockFileName] = useState('');
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

  // Active CBT Quiz Taking State
  const [activeQuizTaking, setActiveQuizTaking] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(1200); // in seconds
  const [examFinishedResult, setExamFinishedResult] = useState<{ score: number; maxScore: number; percentage: number } | null>(null);
  const [showQuitConfirmModal, setShowQuitConfirmModal] = useState(false);
  const [showFinishConfirmModal, setShowFinishConfirmModal] = useState(false);

  // Countdown timer for CBT
  useEffect(() => {
    if (!activeQuizTaking || examFinishedResult) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeQuizTaking, examFinishedResult, userAnswers]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleOpenSubmit = (asg: Assignment) => {
    setSelectedAssignmentToSubmit(asg);
    setAnswerTextInput('');
    setMockFileName(`Tugas_${currentUser?.name?.split(' ')[0] || 'Santri'}_${asg.subjectName}.jpg`);
  };

  const handleDoSubmitAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignmentToSubmit || !currentUser) return;

    submitAssignment({
      assignmentId: selectedAssignmentToSubmit.id,
      assignmentTitle: selectedAssignmentToSubmit.title,
      studentId: currentUser.id,
      studentName: currentUser.name,
      classId: currentUser.classId || 'c-5a',
      answerText: answerTextInput || 'Sudah dikerjakan di buku catatan dan difoto pada lampiran.',
      fileName: mockFileName || 'Tugas_Santri.pdf',
      fileSize: '1.4 MB',
    });

    setSelectedAssignmentToSubmit(null);
    setIsSubmitSuccess(true);
    setTimeout(() => setIsSubmitSuccess(false), 3500);
  };

  const handleStartQuiz = (q: Quiz) => {
    setActiveQuizTaking(q);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setTimeLeft(q.durationMinutes * 60);
    setExamFinishedResult(null);
  };

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleFinishQuiz = () => {
    if (!activeQuizTaking || !currentUser) return;

    let totalEarned = 0;
    const maxScore = activeQuizTaking.totalPoints || 100;

    activeQuizTaking.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswerIndex) {
        totalEarned += q.points;
      }
    });

    const percentage = Math.round((totalEarned / maxScore) * 100);

    submitQuizAttempt({
      quizId: activeQuizTaking.id,
      quizTitle: activeQuizTaking.title,
      studentId: currentUser.id,
      studentName: currentUser.name,
      classId: currentUser.classId || 'c-5a',
      answers: userAnswers,
      score: totalEarned,
      maxScore,
      percentage,
      feedback: percentage >= 80 ? 'Mumtaz! Nilai sangat memuaskan.' : 'Baik, tingkatkan lagi belajarmu.',
    });

    setExamFinishedResult({
      score: totalEarned,
      maxScore,
      percentage,
    });

    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // safe fallback
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-emerald-700" />
          <span>Tugas & Ujian Madrasah</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Diagram Alur: Kirim Jawaban / File Tugas dan Kerjakan Kuis / UTS / UAS CBT
        </p>
      </div>

      {isSubmitSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Jawaban tugas berhasil dikirimkan kepada ustadz/ustadzah untuk dinilai!</span>
        </div>
      )}

      {/* Tabs */}
      {!activeQuizTaking && (
        <div className="flex items-center space-x-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('TUGAS')}
            className={`pb-3 px-4 text-xs font-bold flex items-center space-x-2 border-b-2 transition-colors ${
              activeTab === 'TUGAS'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Kirim Jawaban & Tugas ({assignments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('CBT')}
            className={`pb-3 px-4 text-xs font-bold flex items-center space-x-2 border-b-2 transition-colors ${
              activeTab === 'CBT'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Ujian CBT & Kuis Interaktif ({quizzes.length})</span>
          </button>
        </div>
      )}

      {/* 1. Tab Tugas */}
      {!activeQuizTaking && activeTab === 'TUGAS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignments.map((asg) => {
              const mySub = submissions.find(
                (s) => s.assignmentId === asg.id && (s.studentId === currentUser?.id || s.studentName.includes('Ahmad Zaki'))
              );

              return (
                <div
                  key={asg.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between hover:border-emerald-300 transition-colors"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {asg.subjectName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">{asg.className}</span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 leading-snug">{asg.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {asg.description}
                    </p>

                    <div className="text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Batas: {asg.deadline.replace('T', ' ')}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      {mySub ? (
                        <div>
                          <span
                            className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              mySub.status === 'Sudah Dinilai'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {mySub.status === 'Sudah Dinilai' ? `Nilai: ${mySub.score}` : 'Terkirim (Menunggu)'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-400">
                          Belum Dikerjakan
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleOpenSubmit(asg)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                        mySub
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{mySub ? 'Kirim Ulang' : 'Kirim Jawaban'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Tab CBT Kuis */}
      {!activeQuizTaking && activeTab === 'CBT' && (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-emerald-950 text-xs flex items-center space-x-3">
            <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold">Simulasi Ujian Computer-Based Test (CBT) Madrasah</p>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                Pastikan Anda memiliki waktu luang dan koneksi stabil sebelum memulai ujian kuis interaktif.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizzes.map((qz) => {
              const prevAttempt = quizAttempts.find(
                (a) => a.quizId === qz.id && (a.studentId === currentUser?.id || a.studentName.includes('Ahmad Zaki'))
              );

              return (
                <div
                  key={qz.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between hover:border-emerald-300 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        {qz.subjectName} • {qz.className}
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-700 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {qz.durationMinutes} Menit
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900">{qz.title}</h3>

                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>{qz.questions.length} Butir Soal</span>
                      <span>•</span>
                      <span>Total Skor: {qz.totalPoints}</span>
                    </div>

                    {prevAttempt && (
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                        <div>
                          <p className="text-[10px] font-bold text-emerald-700 uppercase">Hasil Ujian Sebelumnya:</p>
                          <p className="font-bold text-slate-900 mt-0.5">
                            Skor: <span className="text-emerald-700 text-sm">{prevAttempt.score}</span> / {prevAttempt.maxScore} ({prevAttempt.percentage}%)
                          </p>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">{prevAttempt.completedAt}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Penguji: {qz.teacherName}
                    </span>

                    <button
                      onClick={() => handleStartQuiz(qz)}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 flex items-center space-x-1.5 transition-transform hover:scale-102"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{prevAttempt ? 'Ulangi Ujian CBT' : 'Mulai Ujian CBT'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CBT Interactive Examination Screen */}
      {activeQuizTaking && !examFinishedResult && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in">
          {/* Exam Header */}
          <div className="p-4 bg-emerald-900 text-white flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-amber-300 uppercase">
                {activeQuizTaking.subjectName} • UJIAN BERBASIS CBT
              </span>
              <h3 className="text-sm font-bold text-white mt-0.5">{activeQuizTaking.title}</h3>
            </div>

            <div className="flex items-center space-x-3">
              <div className="px-3 py-1.5 bg-rose-500/80 text-white rounded-xl font-mono font-bold text-xs flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Sisa Waktu: {formatTimer(timeLeft)}</span>
              </div>
              <button
                onClick={() => setShowQuitConfirmModal(true)}
                className="text-white hover:text-slate-300 p-1 cursor-pointer"
                title="Keluar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Question Screen */}
            <div className="lg:col-span-8 space-y-5">
              {(() => {
                const currentQuestion = activeQuizTaking.questions[currentQuestionIndex];
                if (!currentQuestion) return null;
                const selectedOption = userAnswers[currentQuestion.id];

                return (
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
                        Soal Nomor {currentQuestionIndex + 1} dari {activeQuizTaking.questions.length}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        Bobot: {currentQuestion.points} Poin
                      </span>
                    </div>

                    <p className="mt-4 text-sm font-semibold text-slate-900 leading-relaxed">
                      {currentQuestion.questionText}
                    </p>

                    {/* Options list */}
                    <div className="mt-5 space-y-2.5">
                      {currentQuestion.options.map((opt, optIdx) => {
                        const isChosen = selectedOption === optIdx;
                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleAnswerSelect(currentQuestion.id, optIdx)}
                            className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all flex items-center space-x-3 ${
                              isChosen
                                ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 shadow-xs ring-1 ring-emerald-500'
                                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                            }`}
                          >
                            <span
                              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${
                                isChosen
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="leading-snug">{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Next / Prev navigation buttons */}
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <button
                        type="button"
                        disabled={currentQuestionIndex === 0}
                        onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                      >
                        ← Soal Sebelumnya
                      </button>

                      {currentQuestionIndex < activeQuizTaking.questions.length - 1 ? (
                        <button
                          type="button"
                          onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1"
                        >
                          <span>Soal Selanjutnya</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleFinishQuiz}
                          className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-amber-950 font-black rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Selesaikan Ujian CBT</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Questions Quick Navigator (Right column) */}
            <div className="lg:col-span-4 bg-slate-50 p-4 rounded-xl border border-slate-200 h-fit space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Lembar Jawaban Komputer</h4>
                <p className="text-[10px] text-slate-500">Klik nomor untuk melompat ke soal</p>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {activeQuizTaking.questions.map((q, idx) => {
                  const isAnswered = userAnswers[q.id] !== undefined;
                  const isCurrent = currentQuestionIndex === idx;

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`h-10 rounded-xl text-xs font-bold transition-all border ${
                        isCurrent
                          ? 'border-emerald-600 ring-2 ring-emerald-500 bg-white text-emerald-800'
                          : isAnswered
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-emerald-600"></span>
                  <span>Sudah Terjawab ({Object.keys(userAnswers).length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-white border border-slate-300"></span>
                  <span>Belum Dijawab ({activeQuizTaking.questions.length - Object.keys(userAnswers).length})</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowFinishConfirmModal(true)}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
              >
                Kumpulkan Ujian Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CBT Completion Result Card */}
      {examFinishedResult && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 max-w-lg mx-auto text-center space-y-5 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              Ujian CBT Selesai
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-1">
              Alhamdulillah! Jawaban Berhasil Terkirim
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Hasil evaluasi otomatis kuis interaktif MI Assuyutiyah
            </p>
          </div>

          <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 space-y-2">
            <span className="text-[11px] font-bold text-emerald-800 uppercase">Perolehan Nilai:</span>
            <div className="text-4xl font-black text-emerald-800">
              {examFinishedResult.score} <span className="text-lg text-slate-400 font-normal">/ {examFinishedResult.maxScore}</span>
            </div>
            <p className="text-xs font-bold text-emerald-700">
              Persentase Keberhasilan: {examFinishedResult.percentage}%
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setActiveQuizTaking(null);
                setExamFinishedResult(null);
              }}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
            >
              Kembali ke Menu Ujian
            </button>
            <button
              onClick={() => {
                setActiveQuizTaking(null);
                setExamFinishedResult(null);
                setCurrentView('nilai-evaluasi');
              }}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md shadow-emerald-700/20"
            >
              Lihat Riwayat Nilai
            </button>
          </div>
        </div>
      )}

      {/* Modal Kirim Jawaban / File Tugas */}
      {selectedAssignmentToSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-emerald-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-300 uppercase">
                  Pengumpulan Tugas Santri
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">
                  {selectedAssignmentToSubmit.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAssignmentToSubmit(null)}
                className="text-white hover:text-slate-300 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDoSubmitAssignment} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-bold text-slate-800">Instruksi Tugas dari Guru:</p>
                <p className="text-slate-600 mt-1 leading-relaxed">{selectedAssignmentToSubmit.description}</p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Uraian Jawaban Teks (Bila Ada)
                </label>
                <textarea
                  rows={4}
                  value={answerTextInput}
                  onChange={(e) => setAnswerTextInput(e.target.value)}
                  placeholder="Ketik jawaban tertulis, penjelasan hadis, atau dalil di sini..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden leading-relaxed font-sans"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Lampiran Berkas / Foto Buku Tugas Santri
                </label>
                <div className="p-4 border-2 border-dashed border-emerald-300 rounded-xl bg-emerald-50/40 text-center space-y-1.5">
                  <Upload className="w-6 h-6 text-emerald-600 mx-auto" />
                  <p className="font-bold text-slate-800">{mockFileName}</p>
                  <p className="text-[10px] text-slate-400">
                    File foto/PDF berhasil disiapkan (JPG/PNG/PDF maks 10MB)
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedAssignmentToSubmit(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-colors flex items-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim ke Guru</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Batal Ujian */}
      {showQuitConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-slate-200 p-6 animate-in zoom-in-95">
            <div className="flex items-center space-x-3 mb-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Batalkan Ujian?</h3>
                <p className="text-xs text-slate-500">Konfirmasi keluar dari sesi CBT</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed py-2">
              Yakin ingin keluar dan membatalkan ujian ini? Seluruh lembar jawaban yang telah dipilih pada sesi ini tidak akan tersimpan.
            </p>

            <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100 mt-3">
              <button
                type="button"
                onClick={() => setShowQuitConfirmModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Lanjutkan Ujian
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowQuitConfirmModal(false);
                  setActiveQuizTaking(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors cursor-pointer"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Kumpulkan Ujian */}
      {showFinishConfirmModal && activeQuizTaking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-slate-200 p-6 animate-in zoom-in-95">
            <div className="flex items-center space-x-3 mb-3 text-emerald-600">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Kumpulkan Ujian?</h3>
                <p className="text-xs text-slate-500">Konfirmasi pengumpulan nilai CBT</p>
              </div>
            </div>

            <div className="py-2 text-xs text-slate-600 space-y-2">
              <p>Apakah Anda yakin telah selesai mengerjakan seluruh soal dan ingin mengumpulkan ujian ini?</p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between font-medium">
                <span>Soal Terjawab:</span>
                <span className="font-bold text-slate-900">
                  {Object.keys(userAnswers).length} dari {activeQuizTaking.questions.length} Soal
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100 mt-3">
              <button
                type="button"
                onClick={() => setShowFinishConfirmModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Periksa Kembali
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowFinishConfirmModal(false);
                  handleFinishQuiz();
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Ya, Kumpulkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
