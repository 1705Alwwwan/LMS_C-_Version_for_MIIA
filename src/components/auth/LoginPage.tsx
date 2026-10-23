import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { ForgotPasswordModal } from './ForgotPasswordModal';

export const LoginPage: React.FC = () => {
  const { login, setCurrentView } = useLMS();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!username.trim()) {
      setErrorMsg('Silakan masukkan nama pengguna, NISN, atau NIP.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Silakan masukkan password / sandi Anda.');
      return;
    }

    const success = login(username, password);
    if (!success) {
      setErrorMsg('Nama pengguna, NISN/NIP, atau kata sandi tidak sesuai. Pastikan Anda telah terdaftar oleh Admin Madrasah.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-emerald-500 blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-amber-500 blur-3xl"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Back to landing */}
        <button
          onClick={() => setCurrentView('landing')}
          className="inline-flex items-center text-xs text-emerald-300 hover:text-white mb-6 group transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Beranda Madrasah
        </button>

        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 mx-auto mb-3">
            <BookOpen className="w-8 h-8 text-amber-300" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Login & Autentikasi LMS
          </h2>
          <p className="mt-1 text-sm text-emerald-200/80">
            Madrasah Ibtidaiyah Assuyutiyah
          </p>
          <p className="text-xs text-amber-300/90 font-arabic mt-1 text-base">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </div>

        {/* Regular Login Form Card - Only Username and Password */}
        <div className="mt-8 bg-white py-8 px-6 shadow-2xl rounded-2xl border border-slate-100 sm:px-8">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2 text-rose-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Username / NISN / NIP
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username, NISN, atau NIP"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden transition-all text-slate-900"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 transition-colors"
                >
                  Lupa Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password Anda"
                  className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden transition-all text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center space-x-2"
            >
              <span>Masuk ke Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-slate-100 text-center space-y-1">
            <p className="text-[11px] font-semibold text-slate-700">
              Username dan password hanya diberikan oleh Administrator / Tata Usaha Madrasah.
            </p>
            <p className="text-[10px] text-slate-400">
              Hubungi bagian TU MI Assuyutiyah apabila belum menerima akun atau lupa kata sandi.
            </p>
          </div>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
      />
    </div>
  );
};
