/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LMSProvider, useLMS } from './context/LMSContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { Menu, X } from 'lucide-react';

// Admin Views
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ManajemenPengguna } from './components/admin/ManajemenPengguna';
import { ManajemenKelas } from './components/admin/ManajemenKelas';
import { ManajemenAkademik } from './components/admin/ManajemenAkademik';
import { ManajemenKeuangan } from './components/admin/ManajemenKeuangan';
import { PengumumanAgenda } from './components/admin/PengumumanAgenda';
import { RekapKehadiranGuru } from './components/admin/RekapKehadiranGuru';
import { RekapRaporSekolah } from './components/admin/RekapRaporSekolah';
import { KalenderPendidikanSection } from './components/admin/KalenderPendidikanSection';

// Guru Views
import { GuruDashboard } from './components/guru/GuruDashboard';
import { AbsensiSiswa } from './components/guru/AbsensiSiswa';
import { ManajemenMateri } from './components/guru/ManajemenMateri';
import { ManajemenTugasKuis } from './components/guru/ManajemenTugasKuis';
import { PenilaianRapor } from './components/guru/PenilaianRapor';
import { MutabaahGuru } from './components/guru/MutabaahGuru';

// Siswa Views
import { SiswaDashboard } from './components/siswa/SiswaDashboard';
import { MateriBelajar } from './components/siswa/MateriBelajar';
import { TugasUjian } from './components/siswa/TugasUjian';
import { NilaiEvaluasi } from './components/siswa/NilaiEvaluasi';
import { RaporAkademik } from './components/siswa/RaporAkademik';
import { MutabaahSiswa } from './components/siswa/MutabaahSiswa';

// Common Modals & Indicators
import { LogoutConfirmModal } from './components/common/LogoutConfirmModal';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { AspNetStudyCenter } from './components/common/AspNetStudyCenter';

const MainLayout: React.FC = () => {
  const {
    currentView,
    activeRole,
    currentUser,
    isSidebarOpen,
    toggleSidebar,
    isLogoutModalOpen,
    setIsLogoutModalOpen,
    confirmLogout,
  } = useLMS();

  if (currentView === 'landing' || (!currentUser && currentView !== 'login')) {
    return (
      <>
        <OfflineIndicator />
        <LandingPage />
        <LogoutConfirmModal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          onConfirm={confirmLogout}
          userName={currentUser?.name}
        />
      </>
    );
  }

  if (currentView === 'login' || !currentUser) {
    return (
      <>
        <OfflineIndicator />
        <LoginPage />
      </>
    );
  }

  // Render role-specific views according to diagram
  const renderContent = () => {
    if (currentView === 'aspnet-study') {
      return <AspNetStudyCenter />;
    }

    if (activeRole === 'ADMIN') {
      switch (currentView) {
        case 'manajemen-pengguna':
          return <ManajemenPengguna />;
        case 'manajemen-kelas':
          return <ManajemenKelas />;
        case 'manajemen-akademik':
          return <ManajemenAkademik />;
        case 'manajemen-keuangan':
          return <ManajemenKeuangan />;
        case 'pengumuman-agenda':
          return <PengumumanAgenda />;
        case 'kalender-pendidikan':
          return <KalenderPendidikanSection />;
        case 'rekap-kehadiran-guru':
          return <RekapKehadiranGuru />;
        case 'rekap-rapor-sekolah':
          return <RekapRaporSekolah />;
        case 'dashboard':
        default:
          return <AdminDashboard />;
      }
    }

    if (activeRole === 'GURU') {
      switch (currentView) {
        case 'mutabaah-guru':
          return <MutabaahGuru />;
        case 'absensi-siswa':
          return <AbsensiSiswa />;
        case 'manajemen-materi':
          return <ManajemenMateri />;
        case 'manajemen-tugas-kuis':
          return <ManajemenTugasKuis />;
        case 'penilaian-rapor':
          return <PenilaianRapor />;
        case 'dashboard':
        default:
          return <GuruDashboard />;
      }
    }

    if (activeRole === 'SISWA') {
      switch (currentView) {
        case 'mutabaah-santri':
          return <MutabaahSiswa />;
        case 'materi-belajar':
          return <MateriBelajar />;
        case 'tugas-ujian':
          return <TugasUjian />;
        case 'nilai-evaluasi':
          return <NilaiEvaluasi />;
        case 'rapor-akademik':
          return <RaporAkademik />;
        case 'dashboard':
        default:
          return <SiswaDashboard />;
      }
    }

    return <AdminDashboard />;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 relative">
      <OfflineIndicator />
      <Navbar />
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-3 sm:p-5 lg:p-7 min-w-0">
          {renderContent()}
        </main>
      </div>

      {/* Floating Action Button for Mobile Menu */}
      <button
        type="button"
        onClick={toggleSidebar}
        className="md:hidden fixed bottom-5 right-5 z-40 px-3.5 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs rounded-full shadow-lg shadow-emerald-950/25 flex items-center gap-2 transition-transform active:scale-95 cursor-pointer border border-emerald-500/40"
        aria-label={isSidebarOpen ? 'Tutup Menu Navigasi' : 'Buka Menu Navigasi'}
        title={isSidebarOpen ? 'Tutup Menu' : 'Menu Navigasi'}
      >
        {isSidebarOpen ? (
          <>
            <X className="w-4 h-4 text-white" />
            <span>Tutup Menu</span>
          </>
        ) : (
          <>
            <Menu className="w-4 h-4 text-white" />
            <span>Menu Navigasi</span>
          </>
        )}
      </button>

      {/* Verification Logout Modal */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
        userName={currentUser?.name}
      />
    </div>
  );
};

export default function App() {
  return (
    <LMSProvider>
      <MainLayout />
    </LMSProvider>
  );
}
