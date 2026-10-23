import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  Bell,
  LogOut,
  User as UserIcon,
  Sparkles,
  BookOpen,
  Calendar,
  ShieldCheck,
  GraduationCap,
  X,
  Menu,
  PanelLeftClose,
  PanelLeft,
  Code2,
} from 'lucide-react';
import { UserRole } from '../../types/lms';
import { PWAInstallButton } from './PWAInstallButton';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    activeRole,
    requestLogout,
    announcements,
    academicCalendar,
    assignments,
    setCurrentView,
    isSidebarOpen,
    toggleSidebar,
    isSidebarCollapsed,
    toggleSidebarCollapse,
  } = useLMS();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifTab, setNotifTab] = useState<'SEMUA' | 'KALENDER' | 'TUGAS'>('SEMUA');

  const roleConfigs: Record<UserRole, { bg: string; text: string; border: string; label: string; icon: React.ElementType }> = {
    ADMIN: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200', label: 'Administrator', icon: ShieldCheck },
    GURU: { bg: 'bg-amber-50', text: 'text-amber-900', border: 'border-amber-200', label: 'Dewan Asatidz / Guru', icon: BookOpen },
    SISWA: { bg: 'bg-teal-50', text: 'text-teal-900', border: 'border-teal-200', label: 'Santri / Siswa', icon: GraduationCap },
  };

  const currentRoleConfig = activeRole ? roleConfigs[activeRole] : null;

  return (
    <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Left & Toggle */}
          <div className="flex items-center space-x-1.5 sm:space-x-3 min-w-0">
            {/* Mobile Sidebar Hamburger Toggle */}
            <button
              type="button"
              onClick={toggleSidebar}
              className={`p-2 rounded-xl transition-all shrink-0 flex items-center justify-center cursor-pointer md:hidden ${
                isSidebarOpen
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/20'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 active:scale-95'
              }`}
              aria-label={isSidebarOpen ? 'Tutup Menu Navigasi' : 'Buka Menu Navigasi'}
              title={isSidebarOpen ? 'Tutup Menu Navigasi' : 'Buka Menu Navigasi'}
            >
              {isSidebarOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-slate-700" />}
            </button>

            {/* Desktop Sidebar Collapse Toggle */}
            <button
              onClick={toggleSidebarCollapse}
              className="hidden md:flex p-2 rounded-xl text-slate-500 hover:text-emerald-800 hover:bg-emerald-50 transition-colors focus:outline-hidden"
              aria-label="Ciutkan / Lebarkan Sidebar"
              title={isSidebarCollapsed ? 'Lebarkan Sidebar' : 'Ciutkan Sidebar'}
            >
              {isSidebarCollapsed ? (
                <PanelLeft className="w-5 h-5 text-emerald-700" />
              ) : (
                <PanelLeftClose className="w-5 h-5 text-slate-600" />
              )}
            </button>

            <button
              onClick={() => setCurrentView('dashboard')}
              className="flex items-center space-x-2 sm:space-x-3 text-left group focus:outline-hidden"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform shrink-0">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <span className="font-bold text-slate-900 tracking-tight text-sm sm:text-base truncate">
                    MI Assuyutiyah
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                    Kemenag RI
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block truncate">
                  Madrasah Ibtidaiyah Digital Terpadu
                </p>
              </div>
            </button>
          </div>

          {/* Center Date & Hijri Display */}
          <div className="hidden lg:flex items-center space-x-3 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-medium text-slate-700">Sabtu, 17 Oktober 2026</span>
            <span className="text-slate-300">|</span>
            <span className="font-arabic text-emerald-800 font-semibold text-sm">٦ ربيع الآخر ١٤٤٨ هـ</span>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Static Official Role Badge (No switching) */}
            {currentRoleConfig && (
              <div
                className={`flex items-center space-x-2 px-3 py-1.5 text-xs font-semibold rounded-xl border shadow-2xs ${currentRoleConfig.bg} ${currentRoleConfig.text} ${currentRoleConfig.border}`}
                title={`Login Aktif sebagai ${currentRoleConfig.label}`}
              >
                <currentRoleConfig.icon className="w-4 h-4 shrink-0" />
                <span className="hidden md:inline text-slate-500 font-normal">Peran:</span>
                <span className="font-bold">{currentRoleConfig.label}</span>
              </div>
            )}

            {/* C# & ASP.NET Study Button */}
            <button
              onClick={() => setCurrentView('aspnet-study')}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 hover:text-purple-900 border border-purple-200 transition-all shadow-2xs cursor-pointer active:scale-95"
              title="Pelajari Arsitektur C# dan ASP.NET Core 8"
            >
              <Code2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span className="hidden sm:inline">Belajar C# / ASP.NET</span>
              <span className="sm:hidden font-mono text-[10px]">C#</span>
            </button>

            {/* Notification Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-hidden"
                aria-label="Pengumuman"
              >
                <Bell className="w-5 h-5" />
                {announcements.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Pengumuman Madrasah
                    </span>
                    <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="mt-2 divide-y divide-slate-100 max-h-72 overflow-y-auto">
                    {announcements.map((ann) => (
                      <div key={ann.id} className="py-2.5 px-2 hover:bg-slate-50 rounded-lg transition-colors">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              ann.priority === 'Mendesak'
                                ? 'bg-rose-100 text-rose-700'
                                : ann.priority === 'Penting'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {ann.priority}
                          </span>
                          <span className="text-[10px] text-slate-400">{ann.date}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 mt-1">{ann.title}</h4>
                        <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{ann.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile and Role Indicator */}
            {currentUser && (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
                />
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-900 truncate max-w-[130px]">
                    {currentUser.name}
                  </div>
                  {currentRoleConfig && (
                    <span
                      className={`inline-block text-[10px] font-semibold px-1.5 py-0.2 rounded-md ${currentRoleConfig.bg} ${currentRoleConfig.text}`}
                    >
                      {currentRoleConfig.label}
                    </span>
                  )}
                </div>

                <button
                  onClick={requestLogout}
                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1 cursor-pointer"
                  title="Keluar / Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
