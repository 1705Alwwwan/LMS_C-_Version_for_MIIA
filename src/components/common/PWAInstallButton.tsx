import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Smartphone, X, CheckCircle2, Share2, PlusSquare } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'button' | 'banner' | 'compact';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'button',
  className = '',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showSimulatedPrompt, setShowSimulatedPrompt] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      setShowSimulatedPrompt(true);
    }
  };

  const renderContent = () => {
    if (variant === 'compact') {
      return (
        <button
          onClick={handleInstallClick}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-colors shadow-2xs ${className}`}
          title="Pasang LMS MI Assuyutiyah di Perangkat Anda"
        >
          <Download className="w-3.5 h-3.5 text-emerald-700" />
          <span className="hidden sm:inline">Install PWA</span>
        </button>
      );
    }

    if (variant === 'banner') {
      return (
        <div className={`p-4 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white shadow-xl border border-emerald-700/50 flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-700/80 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-inner">
              <Smartphone className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-white">Pasang Aplikasi LMS Assuyutiyah</h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-amber-950">
                  Resmi PWA
                </span>
              </div>
              <p className="text-xs text-emerald-100/80 mt-0.5">
                Akses cepat dari layar utama HP Android, iPhone, tablet atau desktop tanpa browser.
              </p>
            </div>
          </div>
          <button
            onClick={handleInstallClick}
            className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-950" />
            <span>Install Sekarang</span>
          </button>
        </div>
      );
    }

    // Default button
    return (
      <button
        onClick={handleInstallClick}
        className={`flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:from-emerald-700 hover:to-teal-800 transition active:scale-95 cursor-pointer ${className}`}
      >
        <Download className="w-4 h-4 text-amber-300" />
        <span>Install Aplikasi (PWA)</span>
      </button>
    );
  };

  return (
    <>
      {renderContent()}

      {/* Modal Panduan iOS */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Install di iPhone / iPad</h3>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  Buka website ini di <strong>Safari</strong> lalu ketuk tombol <strong>Bagikan (Share)</strong>{' '}
                  <Share2 className="inline w-3.5 h-3.5 text-blue-600" /> di bilah bawah.
                </div>
              </div>
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  Gulir ke bawah dan pilih <strong>"Tambahkan ke Layar Utama" (Add to Home Screen)</strong>{' '}
                  <PlusSquare className="inline w-3.5 h-3.5 text-emerald-600" />.
                </div>
              </div>
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  Ketuk <strong>"Tambah"</strong> di pojok kanan atas. Ikon MI Assuyutiyah akan siap digunakan!
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full rounded-xl bg-emerald-700 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 shadow-md cursor-pointer transition-colors"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}

      {/* Modal Petunjuk Browser / Desktop Guide jika browser belum trigger prompt */}
      {showSimulatedPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-700/20">
                  <Smartphone className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Install LMS MI Assuyutiyah</h3>
                  <p className="text-[10px] text-slate-500">Progressive Web Application (PWA)</p>
                </div>
              </div>
              <button
                onClick={() => setShowSimulatedPrompt(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                Aplikasi ini mendukung teknologi <strong>Progressive Web App (PWA)</strong> resmi. Anda dapat menginstalnya langsung ke laptop, PC, atau ponsel tanpa perlu mengunduh file APK dari store.
              </p>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 space-y-1.5 text-emerald-900">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Cara Pasang Cepat di Browser:
                </p>
                <p className="text-[11px] text-emerald-800 pl-5">
                  1. Di Chrome/Edge: Klik ikon <strong>Install / Pasang Aplikasi</strong> di bilah alamat (URL bar) sebelah kanan atas.
                </p>
                <p className="text-[11px] text-emerald-800 pl-5">
                  2. Di Android: Ketuk menu titik tiga (⋮) lalu pilih <strong>"Tambahkan ke Layar Utama / Install App"</strong>.
                </p>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowSimulatedPrompt(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  setShowSimulatedPrompt(false);
                  if (isInstallable) install();
                }}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-xs font-bold text-white shadow-md cursor-pointer"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
