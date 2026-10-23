import React, { useState } from 'react';
import { FinanceInvoice, User } from '../../types/lms';
import { MessageSquare, Phone, Copy, Check, ExternalLink, X, Send, AlertCircle } from 'lucide-react';

interface WhatsAppReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: FinanceInvoice | null;
  studentUser?: User | null;
  onSuccess?: (msg: string) => void;
}

export const WhatsAppReminderModal: React.FC<WhatsAppReminderModalProps> = ({
  isOpen,
  onClose,
  invoice,
  studentUser,
  onSuccess,
}) => {
  if (!isOpen || !invoice) return null;

  // Initial phone number: normalize to country code 62
  const initialRawPhone = studentUser?.parentPhone || studentUser?.phone || '081234567890';
  const cleanInitialPhone = initialRawPhone.replace(/[^0-9]/g, '');
  const formattedDefaultPhone = cleanInitialPhone.startsWith('0')
    ? '62' + cleanInitialPhone.slice(1)
    : cleanInitialPhone.startsWith('62')
    ? cleanInitialPhone
    : '62' + cleanInitialPhone;

  const [phoneNumber, setPhoneNumber] = useState<string>(formattedDefaultPhone);
  const [copied, setCopied] = useState<boolean>(false);

  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  const messageText = `Assalamu'alaikum Wr. Wb.

Yth. Bapak/Ibu Wali Santri dari *${invoice.studentName}*
(NISN: ${studentUser?.nisn || '-'}, Kelas: ${invoice.className})

Kami dari Bagian Keuangan MI Assuyutiyah menginformasikan rincian tagihan pendidikan madrasah:
━━━━━━━━━━━━━━━━━━━━
📄 No. Invoice : *${invoice.invoiceNumber}*
📌 Rincian : *${invoice.type}* (${invoice.month})
💰 Total Nominal : *${formatRupiah(invoice.amount)}*
📅 Jatuh Tempo : *${invoice.dueDate}*
⚠️ Status : *BELUM LUNAS*
━━━━━━━━━━━━━━━━━━━━

Pembayaran dapat ditransfer melalui rekening resmi:
🏦 *Bank Syariah Indonesia (BSI)*
No. Rekening : *7123456789*
Atas Nama : *MI Assuyutiyah Digital*

Atau dapat dibayarkan langsung secara tunai di loket Tata Usaha Madrasah (Senin - Sabtu, 07:30 - 14:00 WIB).

Mohon konfirmasi dengan membalas pesan ini disertai bukti transfer setelah melakukan pembayaran. Syukron Katsiran atas kerja sama Bapak/Ibu.

Wassalamu'alaikum Wr. Wb.
— *Tata Usaha & Keuangan MI Assuyutiyah*`;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(messageText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
      if (onSuccess) onSuccess('Template pesan WhatsApp berhasil disalin ke papan klip!');
    } catch (e) {
      console.warn('Clipboard copy failed:', e);
    }
  };

  const handleOpenWhatsApp = () => {
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    if (onSuccess) {
      onSuccess(`Tautan WhatsApp Gateway berhasil dibuka untuk ${invoice.studentName}!`);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-slate-800 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
              <MessageSquare className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-900">
                  Kirim Pengingat Tagihan via WhatsApp
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  WA Gateway
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Otomatis membuat tautan wa.me dengan rincian rekening resmi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs">
          {/* Target Phone Input */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Nomor WhatsApp Orang Tua / Wali Santri:
            </label>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="628123456789"
                  className="w-full pl-9 pr-3 py-2 text-xs font-mono font-bold bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-emerald-600"
                />
              </div>
              <span className="text-[10px] text-slate-500 shrink-0">
                Gunakan format <strong>628...</strong>
              </span>
            </div>
          </div>

          {/* Quick Invoice Summary */}
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-emerald-950">{invoice.studentName}</div>
              <div className="text-[11px] text-emerald-800">
                {invoice.className} • {invoice.type} ({invoice.month})
              </div>
            </div>
            <div className="text-right">
              <div className="font-black text-emerald-900 text-sm">
                {formatRupiah(invoice.amount)}
              </div>
              <div className="text-[10px] text-rose-700 font-bold">Jatuh Tempo: {invoice.dueDate}</div>
            </div>
          </div>

          {/* Message Preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                Format Pesan WhatsApp (Otomatis Dibuat):
              </label>
              <button
                type="button"
                onClick={handleCopyText}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Pesan</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 bg-slate-900 text-emerald-200 rounded-xl text-[11px] leading-relaxed font-sans whitespace-pre-wrap max-h-48 overflow-y-auto border border-slate-800 select-all">
              {messageText}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleCopyText}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5 text-slate-600" />
            <span>Salin Format</span>
          </button>
          <button
            type="button"
            onClick={handleOpenWhatsApp}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-700/20 flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Kirim via WhatsApp (wa.me)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
