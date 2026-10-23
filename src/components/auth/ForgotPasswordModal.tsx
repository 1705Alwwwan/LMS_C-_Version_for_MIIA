import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { KeyRound, CheckCircle, AlertCircle, X, ArrowLeft, Send } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { resetPassword } = useLMS();
  const [identifier, setIdentifier] = useState('');
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setStatus({ type: 'error', message: 'Harap masukkan NISN, NIP, atau Email terdaftar.' });
      return;
    }

    const res = resetPassword(identifier);
    if (res.success) {
      setStatus({ type: 'success', message: res.message });
    } else {
      setStatus({ type: 'error', message: res.message });
    }
  };

  const handleReset = () => {
    setIdentifier('');
    setStatus({ type: 'idle', message: '' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Lupa Password / Sandi</h3>
                <p className="text-xs text-slate-500">Pemulihan Akun LMS MI Assuyutiyah</p>
              </div>
            </div>
            <button
              onClick={() => {
                handleReset();
                onClose();
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {status.type === 'success' ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Permintaan Pemulihan Terkirim</h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed px-4">{status.message}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">Petunjuk Selanjutnya:</p>
                <p>1. Periksa kotak masuk / spam email Anda.</p>
                <p>2. Atau hubungi Admin Tata Usaha di ruang TU Madrasah.</p>
              </div>
              <button
                onClick={() => {
                  handleReset();
                  onClose();
                }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs transition-colors"
              >
                Kembali ke Halaman Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Masukkan NISN (untuk Siswa), NIP/NUPTK (untuk Guru), atau Email yang terdaftar di database MI Assuyutiyah untuk menerima tautan atur ulang sandi.
              </p>

              {status.type === 'error' && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2 text-rose-700 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{status.message}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NISN / NIP / Alamat Email
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Contoh: 0098765432 atau 19850624... atau email"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden transition-all"
                  autoFocus
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Tips: Untuk uji coba, masukkan NISN siswa: <span className="font-mono text-slate-700 font-semibold">0098765432</span> atau NIP guru: <span className="font-mono text-slate-700 font-semibold">198506242010012008</span>
                </p>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    handleReset();
                    onClose();
                  }}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-700/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Tautan Reset</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
