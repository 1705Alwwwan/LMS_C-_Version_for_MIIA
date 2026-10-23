import React from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  Users,
  GraduationCap,
  School,
  Wallet,
  Calendar,
  Megaphone,
  TrendingUp,
  ArrowUpRight,
  UserPlus,
  PlusCircle,
  FileCheck,
  CheckCircle,
  Clock,
  ChevronRight,
  UserCheck,
  FileSpreadsheet,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { users, classes, invoices, expenses, agendas, announcements, setCurrentView } = useLMS();

  const students = users.filter((u) => u.role === 'SISWA');
  const teachers = users.filter((u) => u.role === 'GURU');

  const totalInvoicesPaid = invoices
    .filter((inv) => inv.status === 'LUNAS')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalInvoicesPending = invoices
    .filter((inv) => inv.status === 'BELUM LUNAS')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold backdrop-blur-xs mb-3">
            <span>Tahun Ajaran 2024/2025 Semester Genap</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Dashboard Utama Administrator Madrasah
          </h1>
          <p className="text-emerald-100/90 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Selamat datang di pusat kendali operasional MI Assuyutiyah. Kelola data santri, plotting wali kelas, jadwal kurikulum, tagihan SPP, hingga pengumuman madrasah secara terintegrasi.
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              onClick={() => setCurrentView('rekap-kehadiran-guru')}
              className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-sm"
            >
              <UserCheck className="w-3.5 h-3.5 text-slate-900" />
              <span>Presensi Guru Harian</span>
            </button>
            <button
              onClick={() => setCurrentView('rekap-rapor-sekolah')}
              className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-sm"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-white" />
              <span>Rekap Rapor Kelas 1-6</span>
            </button>
            <button
              onClick={() => setCurrentView('manajemen-pengguna')}
              className="px-3.5 py-2 bg-white text-emerald-900 rounded-xl text-xs font-bold hover:bg-emerald-50 transition-colors flex items-center space-x-1.5 shadow-sm"
            >
              <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tambah Siswa / Guru</span>
            </button>
            <button
              onClick={() => setCurrentView('manajemen-kelas')}
              className="px-3.5 py-2 bg-emerald-700/60 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors border border-emerald-500/30 flex items-center space-x-1.5"
            >
              <School className="w-3.5 h-3.5 text-amber-300" />
              <span>Plotting Wali Kelas</span>
            </button>
            <button
              onClick={() => setCurrentView('manajemen-keuangan')}
              className="px-3.5 py-2 bg-emerald-700/60 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors border border-emerald-500/30 flex items-center space-x-1.5 cursor-pointer"
            >
              <Wallet className="w-3.5 h-3.5 text-amber-300" />
              <span>Kelola Tagihan SPP</span>
            </button>
            <button
              onClick={() => setCurrentView('kalender-pendidikan')}
              className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center space-x-1.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-900" />
              <span>Kalender Pendidikan & Event</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Santri / Siswa</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{students.length} Santri</div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Terdaftar di 12 Rombel
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Dewan Asatidz / Guru</span>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{teachers.length} Guru</div>
            <p className="text-[11px] text-amber-700 font-semibold mt-0.5">
              10 Mata Pelajaran Aktif
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-teal-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Penerimaan SPP Bulan Ini</span>
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-black text-slate-900">{formatRupiah(totalInvoicesPaid)}</div>
            <p className="text-[11px] text-rose-500 font-semibold mt-0.5">
              Tunggakan: {formatRupiah(totalInvoicesPending)}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Rombongan Belajar (Rombel)</span>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <School className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{classes.length} Kelas</div>
            <p className="text-[11px] text-blue-600 font-semibold mt-0.5">
              Semua memiliki Wali Kelas
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Quick Agenda & Recent Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Agenda & Kalender Madrasah */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Agenda & Kegiatan Madrasah Mendatang</h3>
            </div>
            <button
              onClick={() => setCurrentView('pengumuman-agenda')}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
            >
              <span>Kelola Agenda</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {agendas.map((agd) => (
              <div
                key={agd.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors flex items-start space-x-3"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex flex-col items-center justify-center shrink-0 text-center leading-tight">
                  <span className="text-xs">{agd.date.split('-')[2]}</span>
                  <span className="text-[9px] uppercase">{new Date(agd.date).toLocaleString('id-ID', { month: 'short' })}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{agd.title}</h4>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      {agd.category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-[11px] text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> {agd.time}
                    </span>
                    <span>•</span>
                    <span className="truncate">{agd.location}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">{agd.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ringkasan Pemasukan & Tagihan SPP */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Wallet className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Status Tagihan SPP Santri</h3>
            </div>
            <button
              onClick={() => setCurrentView('manajemen-keuangan')}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
            >
              <span>Semua Tagihan</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4 space-y-2.5">
            {invoices.slice(0, 5).map((inv) => (
              <div
                key={inv.id}
                className="p-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors"
              >
                <div>
                  <div className="font-bold text-slate-900">{inv.studentName}</div>
                  <div className="text-[11px] text-slate-500">
                    {inv.type} • {inv.className} ({inv.month})
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900">{formatRupiah(inv.amount)}</div>
                  <span
                    className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-0.5 ${
                      inv.status === 'LUNAS'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
