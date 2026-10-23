import React, { useEffect } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  LayoutDashboard,
  Users,
  School,
  GraduationCap,
  Wallet,
  Megaphone,
  CalendarCheck,
  FileText,
  HelpCircle,
  Award,
  BookOpen,
  Clock,
  ClipboardList,
  ChevronRight,
  ChevronLeft,
  UserCheck,
  FileSpreadsheet,
  X,
  PanelLeftClose,
  PanelLeft,
  Heart,
  LogOut,
  Download,
  Calendar,
  Code2,
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

export const Sidebar: React.FC = () => {
  const {
    activeRole,
    currentView,
    setCurrentView,
    isSidebarOpen,
    setIsSidebarOpen,
    isSidebarCollapsed,
    toggleSidebarCollapse,
    requestLogout,
  } = useLMS();

  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile drawer on Escape key and handle scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen, setIsSidebarOpen]);

  useEffect(() => {
    if (isSidebarOpen && typeof window !== 'undefined' && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  if (!activeRole) return null;

  interface MenuItem {
    id: string;
    label: string;
    sublabel?: string;
    icon: React.ElementType;
  }

  const adminMenu: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard Admin', sublabel: 'Ringkasan & Statistik', icon: LayoutDashboard },
    { id: 'rekap-kehadiran-guru', label: 'Rekap Presensi Guru', sublabel: 'Harian Asatidz & Pegawai', icon: UserCheck },
    { id: 'rekap-rapor-sekolah', label: 'Rekap Rapor Kelas 1-6', sublabel: 'Ledger Rombel & Cetak Semester', icon: FileSpreadsheet },
    { id: 'manajemen-pengguna', label: 'Manajemen Pengguna', sublabel: 'Tambah/Edit Siswa & Guru', icon: Users },
    { id: 'manajemen-kelas', label: 'Manajemen Kelas & Rombel', sublabel: 'Plotting Wali Kelas & Siswa', icon: School },
    { id: 'manajemen-akademik', label: 'Manajemen Akademik', sublabel: 'Mapel, Tahun Ajaran, Jadwal', icon: GraduationCap },
    { id: 'manajemen-keuangan', label: 'Manajemen Keuangan', sublabel: 'Pemasukan SPP & Pengeluaran', icon: Wallet },
    { id: 'pengumuman-agenda', label: 'Pengumuman & Agenda', sublabel: 'Kanal Berita & Agenda', icon: Megaphone },
    { id: 'kalender-pendidikan', label: 'Kalender Pendidikan', sublabel: 'Jadwal Semester & Event', icon: Calendar },
    { id: 'aspnet-study', label: 'Modul ASP.NET & C#', sublabel: 'Arsitektur, EF Core & Kode', icon: Code2 },
  ];

  const guruMenu: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard Guru', sublabel: 'Jadwal Mengajar & Info Kelas', icon: LayoutDashboard },
    { id: 'mutabaah-guru', label: "Buku Penghubung & Mutaba'ah", sublabel: 'Sholat, Tahfidz & Akhlak', icon: Heart },
    { id: 'absensi-siswa', label: 'Absensi Siswa', sublabel: 'Harian, Bulanan & Semester', icon: CalendarCheck },
    { id: 'manajemen-materi', label: 'Manajemen Materi & Modul', sublabel: 'Unggah PDF, Video, Link', icon: BookOpen },
    { id: 'manajemen-tugas-kuis', label: 'Manajemen Tugas & Kuis', sublabel: 'Bank Soal, Deadline, Koreksi', icon: ClipboardList },
    { id: 'penilaian-rapor', label: 'Penilaian & Rapor', sublabel: 'Nilai Harian, UTS, & UAS', icon: Award },
    { id: 'aspnet-study', label: 'Modul ASP.NET & C#', sublabel: 'Arsitektur, EF Core & Kode', icon: Code2 },
  ];

  const siswaMenu: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard Siswa', sublabel: 'Info Tagihan, Absensi & Jadwal', icon: LayoutDashboard },
    { id: 'mutabaah-santri', label: "Buku Penghubung & Mutaba'ah", sublabel: 'Catatan Ibadah & Wali Santri', icon: Heart },
    { id: 'nilai-evaluasi', label: 'Grafik & Hasil Evaluasi', sublabel: 'Riwayat Kelas 1 Smt 1 - 6 Smt 2', icon: Award },
    { id: 'materi-belajar', label: 'Materi Belajar', sublabel: 'Baca & Unduh Modul', icon: BookOpen },
    { id: 'tugas-ujian', label: 'Tugas & Ujian', sublabel: 'Kirim Jawaban & Ujian CBT', icon: ClipboardList },
    { id: 'rapor-akademik', label: 'Rapor Akademik', sublabel: 'Cetak / Unduh Rapor Semester', icon: FileText },
    { id: 'aspnet-study', label: 'Modul ASP.NET & C#', sublabel: 'Arsitektur, EF Core & Kode', icon: Code2 },
  ];

  const currentMenu =
    activeRole === 'ADMIN' ? adminMenu : activeRole === 'GURU' ? guruMenu : siswaMenu;

  const handleMenuClick = (viewId: string) => {
    setCurrentView(viewId);
    // Always close drawer on mobile upon selection
    setIsSidebarOpen(false);
  };

  const renderNavItems = (isMini = false) => (
    <nav className="space-y-1.5">
      {currentMenu.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleMenuClick(item.id)}
            title={item.label}
            className={`w-full flex items-center transition-all text-xs group rounded-xl ${
              isMini ? 'justify-center p-2.5' : 'justify-between p-2.5 sm:p-3'
            } ${
              isActive
                ? 'bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-700/20'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className={`flex items-center ${isMini ? 'justify-center' : 'space-x-3 min-w-0'}`}>
              <div
                className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-600 group-hover:text-emerald-700 group-hover:bg-emerald-50'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              {!isMini && (
                <div className="truncate text-left">
                  <div className="font-medium truncate">{item.label}</div>
                  {item.sublabel && (
                    <div
                      className={`text-[10px] truncate ${
                        isActive ? 'text-emerald-100 font-normal' : 'text-slate-400'
                      }`}
                    >
                      {item.sublabel}
                    </div>
                  )}
                </div>
              )}
            </div>
            {!isMini && (
              <ChevronRight
                className={`w-4 h-4 shrink-0 transition-transform ${
                  isActive ? 'text-white' : 'text-slate-300 group-hover:text-slate-500'
                }`}
              />
            )}
          </button>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* MOBILE DRAWER BACKDROP */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 md:hidden transition-opacity cursor-pointer animate-in fade-in"
          aria-label="Tutup Menu Navigasi"
        />
      )}

      {/* MOBILE DRAWER SIDEBAR */}
      <div
        className={`no-print fixed inset-y-0 left-0 z-50 w-72 sm:w-80 max-w-[85vw] bg-white border-r border-slate-200 shadow-2xl p-4 flex flex-col justify-between md:hidden transform transition-all duration-300 ease-in-out ${
          isSidebarOpen
            ? 'translate-x-0 opacity-100 visible'
            : '-translate-x-full opacity-0 pointer-events-none invisible'
        }`}
        aria-hidden={!isSidebarOpen}
      >
        <div className="overflow-y-auto pr-1">
          {/* Header Mobile Drawer */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-xs">
                <BookOpen className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-sm block leading-tight">Menu Navigasi</span>
                <p className="text-[10px] text-slate-400">Portal MI Assuyutiyah</p>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs border border-slate-200"
              aria-label="Tutup Menu Navigasi"
              title="Tutup Menu"
            >
              <X className="w-4 h-4 text-slate-600" />
              <span>Tutup</span>
            </button>
          </div>

          {/* Role Info Box */}
          <div className="mb-3 px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
              HAK AKSES RESMI
            </p>
            <p className="text-xs font-bold text-slate-900 mt-0.5">
              {activeRole === 'ADMIN'
                ? 'Portal Administrator'
                : activeRole === 'GURU'
                ? 'Portal Dewan Guru'
                : 'Portal Santri / Siswa'}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {activeRole === 'ADMIN'
                ? 'Khusus Tata Usaha & Manajemen'
                : activeRole === 'GURU'
                ? 'Akademik & Penilaian Pembelajaran'
                : 'Akses Pembelajaran & Evaluasi'}
            </p>
          </div>

          {/* Navigation Links */}
          {renderNavItems(false)}
        </div>

        {/* Footer Support & Close Action */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          {/* PWA Install Button inside mobile drawer */}
          <div className="pb-1">
            <PWAInstallButton variant="banner" />
          </div>

          <button
            onClick={() => {
              setIsSidebarOpen(false);
              requestLogout();
            }}
            className="w-full py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-rose-200"
            title="Keluar dari Akun"
          >
            <LogOut className="w-4 h-4 text-rose-600" />
            <span>Keluar / Logout</span>
          </button>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
            title="Tutup Menu Navigasi"
          >
            <X className="w-4 h-4 text-slate-500" />
            <span>Tutup Menu Navigasi</span>
          </button>
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-2 text-center">
            <p className="text-[11px] font-bold text-emerald-900">Bantuan IT Madrasah</p>
            <p className="text-[10px] text-emerald-700 mt-0.5">
              WA Layanan TU: 0812-3456-7890
            </p>
          </div>
        </div>
      </div>

      {/* DESKTOP SIDEBAR - completely excluded on mobile devices */}
      {!isMobile && (
        <aside
          className={`no-print desktop-sidebar-only hidden md:flex flex-col bg-white border-r border-slate-200 shrink-0 min-h-[calc(100vh-4rem)] p-3 sm:p-4 transition-all duration-200 ${
            isSidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          <div className="flex-1 overflow-y-auto">
            {/* Collapse/Expand Toggle Header on Desktop */}
            <div className="mb-3 flex items-center justify-between">
              {!isSidebarCollapsed ? (
                <div className="px-1">
                  <p className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                    MENU NAVIGASI
                  </p>
                </div>
              ) : null}
              <button
                onClick={toggleSidebarCollapse}
                className={`p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors ${
                  isSidebarCollapsed ? 'mx-auto' : ''
                }`}
                title={isSidebarCollapsed ? 'Buka Sidebar' : 'Tutup Sidebar'}
              >
                {isSidebarCollapsed ? (
                  <PanelLeft className="w-4 h-4 text-emerald-700" />
                ) : (
                  <PanelLeftClose className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Role Badge (when expanded) */}
            {!isSidebarCollapsed && (
              <div className="mb-4 px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                  HAK AKSES RESMI
                </p>
                <p className="text-xs font-bold text-slate-900 mt-0.5 truncate">
                  {activeRole === 'ADMIN'
                    ? 'Portal Administrator'
                    : activeRole === 'GURU'
                    ? 'Portal Dewan Guru'
                    : 'Portal Santri / Siswa'}
                </p>
              </div>
            )}

            {/* Desktop Navigation Items */}
            {renderNavItems(isSidebarCollapsed)}
          </div>

          {/* Desktop Footer Box */}
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
            {!isSidebarCollapsed ? (
              <>
                <PWAInstallButton variant="compact" className="w-full justify-center" />
                <button
                  type="button"
                  onClick={requestLogout}
                  className="w-full py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-rose-200"
                  title="Keluar dari Akun"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-600" />
                  <span>Keluar / Logout</span>
                </button>
                <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-2.5">
                  <p className="text-[11px] font-bold text-emerald-900">Bantuan Madrasah</p>
                  <p className="text-[10px] text-emerald-700 mt-0.5">
                    Pusat Bantuan & IT Assuyutiyah
                  </p>
                  <div className="mt-1 text-[10px] font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded inline-block">
                    WA: 0812-3456-7890
                  </div>
                </div>
              </>
            ) : (
              <button
                type="button"
                onClick={requestLogout}
                className="w-full p-2.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center justify-center"
                title="Keluar / Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </aside>
      )}
    </>
  );
};
