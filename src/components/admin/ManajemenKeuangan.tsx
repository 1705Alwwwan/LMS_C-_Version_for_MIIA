import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  CheckCircle,
  Clock,
  Printer,
  Search,
  X,
  CreditCard,
  FileText,
  AlertCircle,
  Edit2,
  Trash2,
  Settings,
  Sparkles,
  Check,
  Calendar,
  Building,
  Shirt,
  UserCheck,
  Tag,
  ShieldCheck,
  MessageSquare,
} from 'lucide-react';
import { FinanceInvoice, SchoolExpense, FeeTariff } from '../../types/lms';
import { WhatsAppReminderModal } from './WhatsAppReminderModal';

export const ManajemenKeuangan: React.FC = () => {
  const {
    invoices,
    expenses,
    classes,
    users,
    feeTariffs,
    updateFeeTariff,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    payInvoice,
    addExpense,
  } = useLMS();

  const [activeTab, setActiveTab] = useState<'TAGIHAN' | 'TARIF' | 'PENGELUARAN'>('TAGIHAN');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'LUNAS' | 'BELUM LUNAS'>('ALL');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [successToast, setSuccessToast] = useState('');
  const [invoiceToDelete, setInvoiceToDelete] = useState<FinanceInvoice | null>(null);
  const [waReminderInvoice, setWaReminderInvoice] = useState<FinanceInvoice | null>(null);
  const [batchError, setBatchError] = useState('');

  // Fallback defaults if feeTariffs is empty
  const defaultTariffs: FeeTariff[] = [
    {
      id: 'fee-spp',
      code: 'SPP',
      name: 'SPP Bulanan Siswa',
      category: 'SPP',
      amount: 150000,
      frequency: 'Bulanan (12x/tahun)',
      description: 'Iuran rutin bulanan untuk operasional KBM, fasilitas belajar, praktikum, dan ekstrakurikuler santri.',
      dueDateNote: 'Setiap tanggal 10 tiap bulan',
      includedItems: ['Kegiatan Belajar Mengajar', 'Modul & Lembar Kerja', 'Ujian Harian & Praktikum', 'Kegiatan Ekstrakurikuler'],
    },
    {
      id: 'fee-seragam',
      code: 'SERAGAM',
      name: 'Uang Seragam Madrasah',
      category: 'TAHUNAN',
      amount: 450000,
      frequency: 'Setahun 1x',
      description: 'Pengadaan paket seragam madrasah lengkap resmi MI Assuyutiyah untuk tahun ajaran baru.',
      dueDateNote: 'Awal Tahun Pelajaran (Juli)',
      includedItems: [
        '1 Stel Seragam Putih - Hijau Kemenag RI',
        '1 Stel Seragam Khas Batik MI Assuyutiyah',
        '1 Stel Kaos & Celana Olahraga Madrasah',
        '1 Pcs Rompi Madrasah Berlogo Bordir',
        'Atribut Lengkap: Peci / Jilbab, Dasi, & Sabuk MI',
      ],
    },
    {
      id: 'fee-bangunan',
      code: 'BANGUNAN',
      name: 'Uang Bangunan & Infaq Sarana',
      category: 'TAHUNAN',
      amount: 1200000,
      frequency: 'Setahun 1x',
      description: 'Infaq tahunan pemeliharaan gedung madrasah, pengembangan lab komputer CBT, perpustakaan, dan masjid.',
      dueDateNote: 'Awal Semester Ganjil (dapat diangsur 2 - 3x)',
      includedItems: [
        'Perawatan & Pengecatan Ruang Kelas',
        'Pengembangan Server & Lab Komputer',
        'Fasilitas Sanitasi & Tempat Wudhu Santri',
        'Peremajaan Meja & Kursi Belajar',
      ],
    },
    {
      id: 'fee-daftar-ulang',
      code: 'DAFTAR_ULANG',
      name: 'Uang Daftar Ulang / Heregistrasi',
      category: 'TAHUNAN',
      amount: 350000,
      frequency: 'Setahun 1x',
      description: 'Biaya administrasi tahunan registrasi ulang siswa, buku rapor digital, kartu tanda santri, dan pengelolaan Emis Kemenag.',
      dueDateNote: 'Awal Tahun Ajaran / Heregistrasi Kelas',
      includedItems: [
        'Administrasi Heregistrasi & Buku Induk',
        'Kartu Identitas Santri Digital (KTS)',
        'Buku Laporan Hasil Belajar (Rapor Semester)',
        'Sinkronisasi Data EMIS & Asesmen Kemenag',
      ],
    },
  ];

  const currentTariffs = feeTariffs && feeTariffs.length > 0 ? feeTariffs : defaultTariffs;

  // Modal Edit Tariff
  const [isEditTariffModalOpen, setIsEditTariffModalOpen] = useState(false);
  const [selectedTariffToEdit, setSelectedTariffToEdit] = useState<FeeTariff | null>(null);
  const [tariffForm, setTariffForm] = useState({
    name: '',
    amount: 150000,
    frequency: 'Setahun 1x',
    description: '',
    dueDateNote: '',
    includedItemsText: '',
  });

  // Modal Edit Invoice
  const [isEditInvoiceOpen, setIsEditInvoiceOpen] = useState(false);
  const [selectedInvoiceToEdit, setSelectedInvoiceToEdit] = useState<FinanceInvoice | null>(null);
  const [editInvForm, setEditInvForm] = useState({
    type: 'SPP Bulanan',
    month: 'Oktober 2026',
    amount: 150000,
    dueDate: '2026-10-10',
    status: 'BELUM LUNAS' as 'LUNAS' | 'BELUM LUNAS',
    notes: '',
  });

  // Modal Create Invoice (Single)
  const [isAddInvoiceOpen, setIsAddInvoiceOpen] = useState(false);
  const [newInv, setNewInv] = useState({
    studentId: '',
    type: 'SPP Bulanan',
    month: 'Oktober 2026',
    amount: 150000,
    dueDate: '2026-10-10',
  });

  // Modal Batch Create Invoices (By Class or All Students)
  const [isBatchInvoiceOpen, setIsBatchInvoiceOpen] = useState(false);
  const [batchTargetClass, setBatchTargetClass] = useState<string>('ALL');
  const [batchType, setBatchType] = useState<string>('SPP Bulanan');
  const [batchMonth, setBatchMonth] = useState('Oktober 2026');
  const [batchAmount, setBatchAmount] = useState<number>(150000);
  const [batchDueDate, setBatchDueDate] = useState('2026-10-10');

  // Modal Pay Invoice
  const [selectedInvoiceToPay, setSelectedInvoiceToPay] = useState<FinanceInvoice | null>(null);
  const [payMethod, setPayMethod] = useState<FinanceInvoice['paymentMethod']>('Transfer Bank BSI');

  // Modal Kwitansi Print
  const [kwitansiToPrint, setKwitansiToPrint] = useState<FinanceInvoice | null>(null);

  // Modal Add Expense
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [newExp, setNewExp] = useState({
    title: '',
    category: 'Operasional' as SchoolExpense['category'],
    amount: 500000,
    recipient: '',
    approvedBy: 'Ust. H. Muhammad Ilyas, S.Pd.I',
    notes: '',
  });

  const students = users.filter((u) => u.role === 'SISWA');

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const totalInvoicesPaid = invoices
    .filter((i) => i.status === 'LUNAS')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalInvoicesPending = invoices
    .filter((i) => i.status === 'BELUM LUNAS')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  // Filtered Invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchSearch =
      inv.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.className.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || inv.status === filterStatus;
    const matchType = filterType === 'ALL' || inv.type.toLowerCase().includes(filterType.toLowerCase());
    return matchSearch && matchStatus && matchType;
  });

  // Handler: Open Edit Tariff Modal
  const handleOpenEditTariff = (tariff: FeeTariff) => {
    setSelectedTariffToEdit(tariff);
    setTariffForm({
      name: tariff.name,
      amount: tariff.amount,
      frequency: tariff.frequency,
      description: tariff.description,
      dueDateNote: tariff.dueDateNote,
      includedItemsText: tariff.includedItems ? tariff.includedItems.join('\n') : '',
    });
    setIsEditTariffModalOpen(true);
  };

  const handleSaveTariff = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTariffToEdit) {
      const items = tariffForm.includedItemsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      updateFeeTariff(selectedTariffToEdit.id, {
        name: tariffForm.name,
        amount: Number(tariffForm.amount),
        description: tariffForm.description,
        dueDateNote: tariffForm.dueDateNote,
        includedItems: items,
      });

      setSuccessToast(`Tarif "${tariffForm.name}" berhasil diperbarui sewaktu-waktu!`);
      setIsEditTariffModalOpen(false);
    }
  };

  // Handler: Open Edit Invoice
  const handleOpenEditInvoice = (inv: FinanceInvoice) => {
    setSelectedInvoiceToEdit(inv);
    setEditInvForm({
      type: inv.type,
      month: inv.month,
      amount: inv.amount,
      dueDate: inv.dueDate,
      status: inv.status,
      notes: inv.notes || '',
    });
    setIsEditInvoiceOpen(true);
  };

  const handleSaveEditInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedInvoiceToEdit) {
      updateInvoice(selectedInvoiceToEdit.id, {
        type: editInvForm.type,
        month: editInvForm.month,
        amount: Number(editInvForm.amount),
        dueDate: editInvForm.dueDate,
        status: editInvForm.status,
        notes: editInvForm.notes,
      });
      setSuccessToast(`Tagihan "${selectedInvoiceToEdit.invoiceNumber}" berhasil diperbarui.`);
      setIsEditInvoiceOpen(false);
    }
  };

  const handleDeleteInvoice = (inv: FinanceInvoice) => {
    setInvoiceToDelete(inv);
  };

  // Handler: Single Invoice Creation
  const handleTypeChange = (typeVal: string) => {
    let matchedAmount = 150000;
    if (typeVal.includes('Seragam')) {
      const t = currentTariffs.find((item) => item.code === 'SERAGAM');
      matchedAmount = t ? t.amount : 450000;
    } else if (typeVal.includes('Bangunan') || typeVal.includes('Gedung')) {
      const t = currentTariffs.find((item) => item.code === 'BANGUNAN');
      matchedAmount = t ? t.amount : 1200000;
    } else if (typeVal.includes('Daftar Ulang')) {
      const t = currentTariffs.find((item) => item.code === 'DAFTAR_ULANG');
      matchedAmount = t ? t.amount : 350000;
    } else {
      const t = currentTariffs.find((item) => item.code === 'SPP');
      matchedAmount = t ? t.amount : 150000;
    }
    setNewInv((prev) => ({
      ...prev,
      type: typeVal,
      amount: matchedAmount,
    }));
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === newInv.studentId) || students[0];
    if (st) {
      addInvoice({
        studentId: st.id,
        studentName: st.name,
        classId: st.classId || 'c-5a',
        className: st.className || 'Kelas 5A',
        month: newInv.month,
        type: newInv.type,
        amount: Number(newInv.amount),
        dueDate: newInv.dueDate,
        status: 'BELUM LUNAS',
      });
      setSuccessToast(`Tagihan "${newInv.type}" untuk ${st.name} berhasil diterbitkan!`);
    }
    setIsAddInvoiceOpen(false);
  };

  // Handler: Batch Invoice Creation
  const handleBatchTypeChange = (typeVal: string) => {
    let matchedAmount = 150000;
    if (typeVal.includes('Seragam')) {
      const t = currentTariffs.find((item) => item.code === 'SERAGAM');
      matchedAmount = t ? t.amount : 450000;
    } else if (typeVal.includes('Bangunan') || typeVal.includes('Gedung')) {
      const t = currentTariffs.find((item) => item.code === 'BANGUNAN');
      matchedAmount = t ? t.amount : 1200000;
    } else if (typeVal.includes('Daftar Ulang')) {
      const t = currentTariffs.find((item) => item.code === 'DAFTAR_ULANG');
      matchedAmount = t ? t.amount : 350000;
    } else {
      const t = currentTariffs.find((item) => item.code === 'SPP');
      matchedAmount = t ? t.amount : 150000;
    }
    setBatchType(typeVal);
    setBatchAmount(matchedAmount);
  };

  const handleCreateBatchInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const targetStudents =
      batchTargetClass === 'ALL'
        ? students
        : students.filter((s) => s.classId === batchTargetClass);

    if (targetStudents.length === 0) {
      setBatchError('Tidak ada siswa di target rombel yang dipilih.');
      return;
    }
    setBatchError('');

    targetStudents.forEach((st) => {
      addInvoice({
        studentId: st.id,
        studentName: st.name,
        classId: st.classId || 'c-5a',
        className: st.className || 'Kelas 5A',
        month: batchMonth,
        type: batchType,
        amount: Number(batchAmount),
        dueDate: batchDueDate,
        status: 'BELUM LUNAS',
      });
    });

    setSuccessToast(
      `Berhasil menerbitkan tagihan "${batchType}" kepada ${targetStudents.length} santri sekaligus!`
    );
    setIsBatchInvoiceOpen(false);
  };

  // Confirm payment
  const handleConfirmPay = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedInvoiceToPay) {
      payInvoice(selectedInvoiceToPay.id, payMethod);
      const updatedInv: FinanceInvoice = {
        ...selectedInvoiceToPay,
        status: 'LUNAS',
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: payMethod,
        receiptNumber: `KW/${payMethod?.split(' ')[0] || 'PAY'}/${Date.now().toString().slice(-6)}`,
      };
      setKwitansiToPrint(updatedInv);
      setSelectedInvoiceToPay(null);
      setSuccessToast(`Pembayaran tagihan ${selectedInvoiceToPay.invoiceNumber} berhasil dicatat.`);
    }
  };

  // Create Expense
  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    addExpense({
      title: newExp.title,
      category: newExp.category,
      amount: Number(newExp.amount),
      date: today,
      recipient: newExp.recipient,
      approvedBy: newExp.approvedBy,
      notes: newExp.notes,
    });
    setIsAddExpenseOpen(false);
    setNewExp({
      title: '',
      category: 'Operasional',
      amount: 500000,
      recipient: '',
      approvedBy: 'Ust. H. Muhammad Ilyas, S.Pd.I',
      notes: '',
    });
    setSuccessToast(`Pengeluaran baru "${newExp.title}" berhasil dicatat.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-emerald-700" />
            <span>Manajemen Keuangan Madrasah</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Pengelolaan Tarif SPP Bulanan, Iuran Tahunan (Seragam, Bangunan, Daftar Ulang), & Kas Madrasah
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('TARIF')}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4 text-emerald-700" />
            <span>Ketetapan Tarif & Biaya</span>
          </button>

          <button
            onClick={() => {
              handleBatchTypeChange('SPP Bulanan');
              setIsBatchInvoiceOpen(true);
            }}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Terbitkan Tagihan Massal</span>
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
            className="p-1 text-emerald-500 hover:text-emerald-700 rounded-lg hover:bg-emerald-100/50 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pemasukan SPP & Iuran Terbayar</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-800 mt-2">{formatRupiah(totalInvoicesPaid)}</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
            {invoices.filter((i) => i.status === 'LUNAS').length} Transaksi Terverifikasi
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tunggakan SPP & Iuran</span>
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 mt-2">{formatRupiah(totalInvoicesPending)}</div>
          <span className="text-[11px] text-rose-500 font-semibold mt-1 inline-block">
            {invoices.filter((i) => i.status === 'BELUM LUNAS').length} Tagihan Belum Dibayar
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Pengeluaran Madrasah</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{formatRupiah(totalExpenses)}</div>
          <span className="text-[11px] text-slate-500 font-semibold mt-1 inline-block">
            {expenses.length} Transaksi Operasional
          </span>
        </div>
      </div>

      {/* Quick Tariff Cards Banner (SPP & Biaya Tahunan 1x Setahun) */}
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white rounded-2xl border border-emerald-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-emerald-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              Ketetapan Biaya Madrasah
            </span>
            <h3 className="text-sm font-extrabold text-slate-900 mt-1">
              Tarif SPP Bulanan & Biaya Tahunan (1x Setahun)
            </h3>
            <p className="text-xs text-slate-600">
              Biaya resmi yang dapat disunting sewaktu-waktu dan digunakan sebagai acuan penerbitan tagihan santri.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('TARIF')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>Kelola Lengkap</span> &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {currentTariffs.map((t) => {
            const isAnnual = t.frequency.includes('Setahun');
            return (
              <div
                key={t.id}
                className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-emerald-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        isAnnual
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {t.frequency}
                    </span>
                    <button
                      onClick={() => handleOpenEditTariff(t)}
                      className="p-1 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit Tarif Ini Sewaktu-waktu"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 mt-2">{t.name}</h4>
                  <div className="text-base font-extrabold text-emerald-800 mt-1">
                    {formatRupiah(t.amount)}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{t.description}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[9px] text-slate-400 font-medium truncate max-w-[120px]">
                    {t.dueDateNote}
                  </span>
                  <button
                    onClick={() => {
                      handleBatchTypeChange(t.name);
                      setIsBatchInvoiceOpen(true);
                    }}
                    className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 hover:underline cursor-pointer"
                  >
                    Tagihkan
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('TAGIHAN')}
          className={`pb-3 px-4 text-xs font-bold flex items-center space-x-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'TAGIHAN'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ArrowDownLeft className="w-4 h-4" />
          <span>Pemasukan & Tagihan Siswa ({invoices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('TARIF')}
          className={`pb-3 px-4 text-xs font-bold flex items-center space-x-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'TARIF'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Ketetapan Tarif & Iuran (SPP & Tahunan)</span>
        </button>

        <button
          onClick={() => setActiveTab('PENGELUARAN')}
          className={`pb-3 px-4 text-xs font-bold flex items-center space-x-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'PENGELUARAN'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>Pengeluaran Madrasah ({expenses.length})</span>
        </button>
      </div>

      {/* Tab 1: Pemasukan & Tagihan Siswa */}
      {activeTab === 'TAGIHAN' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari santri, rombel, invoice..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-700 outline-hidden cursor-pointer"
              >
                <option value="ALL">Semua Jenis Tagihan</option>
                <option value="SPP">SPP Bulanan</option>
                <option value="Seragam">Uang Seragam</option>
                <option value="Bangunan">Uang Bangunan</option>
                <option value="Daftar Ulang">Uang Daftar Ulang</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-700 outline-hidden cursor-pointer"
              >
                <option value="ALL">Semua Status</option>
                <option value="LUNAS">Sudah Lunas</option>
                <option value="BELUM LUNAS">Belum Lunas</option>
              </select>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => {
                  if (students.length > 0) {
                    setNewInv((prev) => ({ ...prev, studentId: students[0].id }));
                  }
                  handleTypeChange('SPP Bulanan');
                  setIsAddInvoiceOpen(true);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Terbitkan Tagihan Baru</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase text-[10px] font-semibold">
                  <tr>
                    <th className="py-3 px-4">No. Invoice & Bulan</th>
                    <th className="py-3 px-4">Nama Santri & Rombel</th>
                    <th className="py-3 px-4">Jenis Tagihan</th>
                    <th className="py-3 px-4">Nominal</th>
                    <th className="py-3 px-4">Batas Bayar</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Aksi & Kwitansi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        Tidak ada tagihan yang sesuai dengan pencarian atau filter.
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-mono font-bold text-slate-900">{inv.invoiceNumber}</div>
                          <div className="text-[11px] text-slate-400">{inv.month}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{inv.studentName}</div>
                          <span className="text-[10px] text-slate-500">{inv.className}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              inv.type.includes('Seragam')
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                : inv.type.includes('Bangunan') || inv.type.includes('Gedung')
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : inv.type.includes('Daftar Ulang')
                                ? 'bg-teal-50 text-teal-800 border border-teal-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {inv.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">{formatRupiah(inv.amount)}</td>
                        <td className="py-3 px-4 text-slate-500 text-[11px] font-mono">{inv.dueDate}</td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              inv.status === 'LUNAS'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center space-x-1.5">
                            {inv.status === 'LUNAS' ? (
                              <button
                                onClick={() => setKwitansiToPrint(inv)}
                                className="px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-lg inline-flex items-center gap-1 transition-colors cursor-pointer"
                                title="Cetak Kwitansi Lunas"
                              >
                                <Printer className="w-3 h-3" />
                                <span>Kwitansi</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => setSelectedInvoiceToPay(inv)}
                                className="px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg inline-flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                                title="Catat Pembayaran"
                              >
                                <CreditCard className="w-3 h-3" />
                                <span>Bayar</span>
                              </button>
                            )}

                            {/* Tombol Kirim Tagihan ke WA Orang Tua */}
                            <button
                              onClick={() => setWaReminderInvoice(inv)}
                              className="px-2 py-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg inline-flex items-center gap-1 transition-colors cursor-pointer"
                              title="Kirim Tagihan ke WhatsApp Orang Tua"
                            >
                              <MessageSquare className="w-3 h-3 text-emerald-600" />
                              <span className="hidden xl:inline">Kirim WA</span>
                            </button>

                            {/* Edit Invoice Button */}
                            <button
                              onClick={() => handleOpenEditInvoice(inv)}
                              className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                              title="Edit Detail Tagihan / Nominal"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Invoice Button */}
                            <button
                              onClick={() => handleDeleteInvoice(inv)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Hapus Tagihan"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Ketetapan Tarif & Iuran (SPP & Tahunan) */}
      {activeTab === 'TARIF' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-emerald-700" />
                  <span>Ketetapan Tarif Iuran Madrasah & Biaya Tahunan (1x/Tahun)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Atur nominal SPP bulanan, uang seragam, uang bangunan, dan daftar ulang yang dapat diubah sewaktu-waktu sesuai kebijakan madrasah.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleBatchTypeChange('SPP Bulanan');
                    setIsBatchInvoiceOpen(true);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Terbitkan Tagihan ke Siswa</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {currentTariffs.map((tariff) => {
                const isSPP = tariff.code === 'SPP';
                const isSeragam = tariff.code === 'SERAGAM';
                const isBangunan = tariff.code === 'BANGUNAN';
                const isDaftarUlang = tariff.code === 'DAFTAR_ULANG';

                return (
                  <div
                    key={tariff.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                              isSPP
                                ? 'bg-emerald-100 text-emerald-800'
                                : isSeragam
                                ? 'bg-indigo-100 text-indigo-800'
                                : isBangunan
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-teal-100 text-teal-800'
                            }`}
                          >
                            {isSPP ? (
                              <Wallet className="w-5 h-5" />
                            ) : isSeragam ? (
                              <Shirt className="w-5 h-5" />
                            ) : isBangunan ? (
                              <Building className="w-5 h-5" />
                            ) : (
                              <UserCheck className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                tariff.frequency.includes('Setahun')
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              }`}
                            >
                              {tariff.frequency}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900">{tariff.name}</h4>
                          </div>
                        </div>

                        <button
                          onClick={() => handleOpenEditTariff(tariff)}
                          className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-white hover:bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit Tarif</span>
                        </button>
                      </div>

                      <div className="mt-4">
                        <span className="text-xs text-slate-500">Nominal Tarif Resmi:</span>
                        <div className="text-2xl font-black text-emerald-800">
                          {formatRupiah(tariff.amount)}
                          <span className="text-xs font-normal text-slate-500 ml-1.5">
                            {isSPP ? '/ bulan' : '/ santri (1x setahun)'}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {tariff.description}
                      </p>

                      {/* Included Items / Rincian Komponen */}
                      {tariff.includedItems && tariff.includedItems.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-200/80">
                          <span className="text-[11px] font-bold text-slate-700 block mb-1.5">
                            Rincian Cakupan & Komponen:
                          </span>
                          <ul className="space-y-1">
                            {tariff.includedItems.map((item, idx) => (
                              <li key={idx} className="text-xs text-slate-600 flex items-start gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                      <div className="text-slate-500 text-[11px]">
                        Waktu Penagihan: <strong>{tariff.dueDateNote}</strong>
                      </div>
                      <button
                        onClick={() => {
                          handleBatchTypeChange(tariff.name);
                          setIsBatchInvoiceOpen(true);
                        }}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer"
                      >
                        Terbitkan Tagihan
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Pengeluaran Madrasah */}
      {activeTab === 'PENGELUARAN' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Buku Kas Pengeluaran MI Assuyutiyah</h3>
              <p className="text-xs text-slate-500">
                Pencatatan pos pengeluaran operasional, sarpras, kitab/buku, dan kegiatan madrasah
              </p>
            </div>
            <button
              onClick={() => setIsAddExpenseOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Pengeluaran Baru</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase text-[10px] font-semibold">
                  <tr>
                    <th className="py-3 px-4">Tanggal</th>
                    <th className="py-3 px-4">Uraian Pengeluaran</th>
                    <th className="py-3 px-4">Kategori Pos</th>
                    <th className="py-3 px-4">Penerima / Vendor</th>
                    <th className="py-3 px-4">Nominal</th>
                    <th className="py-3 px-4">Disetujui Oleh</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {expenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{exp.date}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {exp.title}
                        {exp.notes && (
                          <div className="text-[11px] text-slate-400 font-normal">{exp.notes}</div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          {exp.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">{exp.recipient}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{formatRupiah(exp.amount)}</td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">{exp.approvedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit Tarif Biaya (Sewaktu-waktu) */}
      {isEditTariffModalOpen && selectedTariffToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Edit Ketetapan Tarif: {selectedTariffToEdit.name}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Dapat disesuaikan sewaktu-waktu sesuai musyawarah komite & madrasah
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditTariffModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTariff} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Pos Iuran / Biaya</label>
                <input
                  type="text"
                  required
                  value={tariffForm.name}
                  onChange={(e) => setTariffForm({ ...tariffForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nominal Biaya (Rp) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={tariffForm.amount}
                    onChange={(e) => setTariffForm({ ...tariffForm, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden font-bold text-emerald-800 text-sm"
                  />
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Terbilang: {formatRupiah(tariffForm.amount || 0)}
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Frekuensi Penagihan</label>
                  <input
                    type="text"
                    readOnly
                    value={tariffForm.frequency}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-700 outline-hidden font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Keterangan & Catatan Waktu Pembayaran
                </label>
                <input
                  type="text"
                  value={tariffForm.dueDateNote}
                  onChange={(e) => setTariffForm({ ...tariffForm, dueDateNote: e.target.value })}
                  placeholder="Contoh: Awal Tahun Pelajaran (Juli)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Deskripsi / Peruntukan Iuran
                </label>
                <textarea
                  rows={2}
                  value={tariffForm.description}
                  onChange={(e) => setTariffForm({ ...tariffForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Rincian Item / Komponen (1 baris per item)
                </label>
                <textarea
                  rows={3}
                  value={tariffForm.includedItemsText}
                  onChange={(e) => setTariffForm({ ...tariffForm, includedItemsText: e.target.value })}
                  placeholder="Contoh:&#10;1 Stel Seragam Putih-Hijau&#10;1 Stel Seragam Batik MI&#10;Kaos Olahraga"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden font-mono text-[11px]"
                ></textarea>
                <p className="text-[10px] text-slate-400 mt-1">
                  Rincian ini akan terlihat di kartu informasi tarif bagi wali santri dan tata usaha.
                </p>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditTariffModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Simpan Perubahan Tarif
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Tagihan Siswa (Individual Invoice Edit) */}
      {isEditInvoiceOpen && selectedInvoiceToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Edit Data Tagihan: {selectedInvoiceToEdit.invoiceNumber}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Santri: {selectedInvoiceToEdit.studentName} ({selectedInvoiceToEdit.className})
                </p>
              </div>
              <button
                onClick={() => setIsEditInvoiceOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditInvoice} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jenis Iuran / Tagihan</label>
                <select
                  value={editInvForm.type}
                  onChange={(e) => setEditInvForm({ ...editInvForm, type: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="SPP Bulanan">SPP Bulanan</option>
                  <option value="Uang Seragam">Uang Seragam Madrasah (1x Setahun)</option>
                  <option value="Uang Bangunan">Uang Bangunan & Sarana (1x Setahun)</option>
                  <option value="Daftar Ulang">Uang Daftar Ulang / Heregistrasi (1x Setahun)</option>
                  <option value="Infaq Gedung">Infaq Gedung</option>
                  <option value="Ujian Madrasah">Ujian CBT Madrasah</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Periode / Bulan</label>
                  <input
                    type="text"
                    value={editInvForm.month}
                    onChange={(e) => setEditInvForm({ ...editInvForm, month: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nominal (Rp) *</label>
                  <input
                    type="number"
                    required
                    value={editInvForm.amount}
                    onChange={(e) => setEditInvForm({ ...editInvForm, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jatuh Tempo</label>
                  <input
                    type="date"
                    value={editInvForm.dueDate}
                    onChange={(e) => setEditInvForm({ ...editInvForm, dueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Pembayaran</label>
                  <select
                    value={editInvForm.status}
                    onChange={(e) =>
                      setEditInvForm({ ...editInvForm, status: e.target.value as 'LUNAS' | 'BELUM LUNAS' })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="BELUM LUNAS">BELUM LUNAS</option>
                    <option value="LUNAS">LUNAS</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan / Alasan Perubahan</label>
                <input
                  type="text"
                  value={editInvForm.notes}
                  onChange={(e) => setEditInvForm({ ...editInvForm, notes: e.target.value })}
                  placeholder="Misal: Keringanan beasiswa atau potongan anak asatidz"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditInvoiceOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Terbitkan Tagihan Baru (Individual) */}
      {isAddInvoiceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Terbitkan Tagihan Iuran Siswa</h3>
              <button
                onClick={() => setIsAddInvoiceOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pilih Siswa / Santri *</label>
                <select
                  value={newInv.studentId}
                  onChange={(e) => setNewInv({ ...newInv, studentId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.className || 'Kelas 5A'}) - NISN: {st.nisn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jenis Iuran / Tagihan</label>
                <select
                  value={newInv.type}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer font-medium"
                >
                  <option value="SPP Bulanan">SPP Bulanan (Rutin Tiap Bulan)</option>
                  <option value="Uang Seragam">Uang Seragam Madrasah (Muncul Setahun 1x)</option>
                  <option value="Uang Bangunan">Uang Bangunan & Infaq Sarpras (Muncul Setahun 1x)</option>
                  <option value="Daftar Ulang">Uang Daftar Ulang / Heregistrasi (Muncul Setahun 1x)</option>
                  <option value="Ujian Madrasah">Biaya Ujian Madrasah / CBT</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bulan / Periode Tagihan</label>
                  <input
                    type="text"
                    value={newInv.month}
                    onChange={(e) => setNewInv({ ...newInv, month: e.target.value })}
                    placeholder="Oktober 2026"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nominal (Rp) *</label>
                  <input
                    type="number"
                    required
                    value={newInv.amount}
                    onChange={(e) => setNewInv({ ...newInv, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden font-bold text-emerald-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jatuh Tempo Pembayaran</label>
                <input
                  type="date"
                  value={newInv.dueDate}
                  onChange={(e) => setNewInv({ ...newInv, dueDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddInvoiceOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Terbitkan Tagihan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Terbitkan Tagihan Massal */}
      {isBatchInvoiceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Terbitkan Tagihan Massal ke Siswa</h3>
                  <p className="text-[11px] text-slate-500">
                    Otomatis membuat tagihan untuk seluruh santri atau per rombel
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsBatchInvoiceOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBatchInvoice} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Siswa Penerima</label>
                <select
                  value={batchTargetClass}
                  onChange={(e) => setBatchTargetClass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer font-medium"
                >
                  <option value="ALL">Semua Santri Madrasah (Total {students.length} Santri)</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      Rombel {c.name} (Wali: {c.waliKelasName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pilih Jenis Tagihan</label>
                <select
                  value={batchType}
                  onChange={(e) => handleBatchTypeChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer font-bold text-emerald-900"
                >
                  <option value="SPP Bulanan">SPP Bulanan (Rutin 12x/tahun)</option>
                  <option value="Uang Seragam">Uang Seragam Madrasah (Muncul Setahun 1x)</option>
                  <option value="Uang Bangunan">Uang Bangunan & Sarana (Muncul Setahun 1x)</option>
                  <option value="Daftar Ulang">Uang Daftar Ulang / Heregistrasi (Muncul Setahun 1x)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Periode / Keterangan</label>
                  <input
                    type="text"
                    required
                    value={batchMonth}
                    onChange={(e) => setBatchMonth(e.target.value)}
                    placeholder="Contoh: Oktober 2026 atau TA 2026/2027"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nominal Tagihan per Santri (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={batchAmount}
                    onChange={(e) => setBatchAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden font-bold text-emerald-800 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Batas Akhir / Jatuh Tempo</label>
                <input
                  type="date"
                  required
                  value={batchDueDate}
                  onChange={(e) => setBatchDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-[11px] leading-relaxed">
                ℹ️ <strong>Informasi Penerbitan:</strong> Tagihan akan langsung muncul di dashboard portal masing-masing santri & orang tua, serta dapat dicatat pembayarannya melalui kasir TU atau transfer bank.
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBatchInvoiceOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Terbitkan Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Bayar Tagihan */}
      {selectedInvoiceToPay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Catat Pembayaran Tagihan</h3>
              <button
                onClick={() => setSelectedInvoiceToPay(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmPay} className="mt-4 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Santri:</span>
                  <span className="font-bold text-slate-900">{selectedInvoiceToPay.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Jenis & Periode:</span>
                  <span className="font-medium text-slate-800">
                    {selectedInvoiceToPay.type} ({selectedInvoiceToPay.month})
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1 mt-1 text-sm font-extrabold">
                  <span>Total Tagihan:</span>
                  <span className="text-emerald-700">{formatRupiah(selectedInvoiceToPay.amount)}</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pilih Metode Pembayaran</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="Transfer Bank BSI">Transfer Bank Syariah Indonesia (BSI)</option>
                  <option value="Tunai di TU">Tunai di Loket Tata Usaha</option>
                  <option value="QRIS">QRIS Madrasah</option>
                  <option value="Virtual Account">Virtual Account Bank</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedInvoiceToPay(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Konfirmasi Lunas & Terbitkan Kwitansi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Kwitansi Print View */}
      {kwitansiToPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-emerald-900 text-white flex items-center justify-between no-print">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <Printer className="w-4 h-4 text-amber-300" /> Kwitansi Pembayaran Resmi
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Cetak / Print
                </button>
                <button
                  onClick={() => setKwitansiToPrint(null)}
                  className="text-white hover:text-slate-300 p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Official Kwitansi Body */}
            <div className="p-8 space-y-5 bg-white text-slate-900">
              {/* Header Madrasah Kop */}
              <div className="text-center border-b-2 border-double border-emerald-900 pb-4">
                <div className="font-arabic text-emerald-800 text-lg font-bold">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </div>
                <h3 className="font-extrabold text-base tracking-wider text-slate-900 uppercase">
                  MADRASAH IBTIDAIYAH ASSUYUTIYAH
                </h3>
                <p className="text-[10px] text-slate-500">
                  KEMENTERIAN AGAMA REPUBLIK INDONESIA | NPSN: 60728912
                </p>
                <p className="text-[10px] text-slate-500">
                  Jl. Pesantren Assuyutiyah No. 15, Sukamaju • Telp: (021) 8765-4321
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold">
                <div>
                  <span className="text-slate-400">NO. KWITANSI:</span>{' '}
                  <span className="font-mono text-emerald-800 font-bold">
                    {kwitansiToPrint.receiptNumber || 'KW/2026/001'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">TANGGAL:</span>{' '}
                  <span>{kwitansiToPrint.paymentDate || '2026-10-17'}</span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2 text-xs">
                <div className="grid grid-cols-3">
                  <span className="text-slate-500">Telah diterima dari:</span>
                  <span className="col-span-2 font-bold text-slate-900">
                    {kwitansiToPrint.studentName} ({kwitansiToPrint.className})
                  </span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-slate-500">Untuk Pembayaran:</span>
                  <span className="col-span-2 font-semibold text-slate-800">
                    {kwitansiToPrint.type} Bulan {kwitansiToPrint.month}
                  </span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-slate-500">Metode Bayar:</span>
                  <span className="col-span-2 text-slate-700">
                    {kwitansiToPrint.paymentMethod || 'Tunai di TU'}
                  </span>
                </div>
                <div className="grid grid-cols-3 pt-2 border-t border-slate-200">
                  <span className="text-slate-500 font-bold">Jumlah Terbilang:</span>
                  <span className="col-span-2 font-bold text-emerald-900 text-sm">
                    {formatRupiah(kwitansiToPrint.amount)} (LUNAS)
                  </span>
                </div>
              </div>

              <div className="pt-4 flex justify-between text-center text-xs">
                <div>
                  <p className="text-[11px] text-slate-400">Wali Santri,</p>
                  <div className="h-12"></div>
                  <p className="font-semibold text-slate-700">( ......................... )</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">Bendahara Tata Usaha,</p>
                  <div className="h-12 flex items-center justify-center font-arabic text-emerald-700 text-sm">
                    ختم المدرسة
                  </div>
                  <p className="font-bold text-slate-900">Ust. H. Muhammad Ilyas, S.Pd.I</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Expense */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Catat Pengeluaran Madrasah</h3>
              <button
                onClick={() => setIsAddExpenseOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Uraian Pengeluaran *</label>
                <input
                  type="text"
                  required
                  value={newExp.title}
                  onChange={(e) => setNewExp({ ...newExp, title: e.target.value })}
                  placeholder="Contoh: Pembelian Sound System Lapangan"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kategori Pos</label>
                  <select
                    value={newExp.category}
                    onChange={(e) => setNewExp({ ...newExp, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="Operasional">Operasional</option>
                    <option value="Sarana & Prasarana">Sarana & Prasarana</option>
                    <option value="Kegiatan Madrasah">Kegiatan Madrasah</option>
                    <option value="Honorarium">Honorarium</option>
                    <option value="Buku & Modul">Buku & Modul</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nominal (Rp) *</label>
                  <input
                    type="number"
                    required
                    value={newExp.amount}
                    onChange={(e) => setNewExp({ ...newExp, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Penerima Dana / Vendor</label>
                <input
                  type="text"
                  value={newExp.recipient}
                  onChange={(e) => setNewExp({ ...newExp, recipient: e.target.value })}
                  placeholder="Contoh: Toko Kitab Al-Falah"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan Tambahan</label>
                <textarea
                  rows={2}
                  value={newExp.notes}
                  onChange={(e) => setNewExp({ ...newExp, notes: e.target.value })}
                  placeholder="Nomor invoice vendor atau keterangan rincian barang"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Simpan Pengeluaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Tagihan */}
      {invoiceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 animate-in zoom-in-95">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Hapus Tagihan Madrasah</h3>
                <p className="text-xs text-slate-500">Konfirmasi penghapusan data invoice</p>
              </div>
            </div>

            <div className="py-2 text-xs text-slate-600 space-y-3">
              <p>Apakah Anda yakin ingin menghapus tagihan santri berikut?</p>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900">{invoiceToDelete.invoiceNumber}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    invoiceToDelete.status === 'LUNAS' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {invoiceToDelete.status}
                  </span>
                </div>
                <div className="text-slate-800 font-bold text-sm">{invoiceToDelete.studentName}</div>
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span>{invoiceToDelete.type} • {invoiceToDelete.month}</span>
                  <span className="font-bold text-slate-900">{formatRupiah(invoiceToDelete.amount)}</span>
                </div>
              </div>

              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-[11px] flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>
                  Tindakan ini akan menghapus catatan tagihan dari database keuangan madrasah.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100 mt-4">
              <button
                type="button"
                onClick={() => setInvoiceToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteInvoice(invoiceToDelete.id);
                  setSuccessToast(`Tagihan "${invoiceToDelete.invoiceNumber}" milik ${invoiceToDelete.studentName} telah dihapus.`);
                  setInvoiceToDelete(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus Tagihan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Reminder Modal */}
      <WhatsAppReminderModal
        isOpen={Boolean(waReminderInvoice)}
        onClose={() => setWaReminderInvoice(null)}
        invoice={waReminderInvoice}
        studentUser={users.find((u) => u.id === waReminderInvoice?.studentId)}
        onSuccess={(msg) => setSuccessToast(msg)}
      />
    </div>
  );
};
