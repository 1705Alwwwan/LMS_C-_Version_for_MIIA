import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { MutabaahEntry, PrayerStatus } from '../../types/lms';
import {
  Heart,
  CheckCircle2,
  Calendar,
  Sparkles,
  Award,
  BookOpen,
  MessageSquare,
  Clock,
  Send,
  Star,
  Check,
  ShieldCheck,
  User,
} from 'lucide-react';

export const MutabaahSiswa: React.FC = () => {
  const { currentUser, mutabaahList, saveMutabaahEntry, verifyMutabaahByParent } = useLMS();

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [successToast, setSuccessToast] = useState<string>('');

  // Find or initialize today's entry for current student
  const existingEntry = mutabaahList.find(
    (m) => m.studentId === currentUser?.id && m.date === selectedDate
  );

  // Form state
  const [prayers, setPrayers] = useState(
    existingEntry?.prayers || {
      subuh: 'Berjamaah' as PrayerStatus,
      dzuhur: 'Berjamaah' as PrayerStatus,
      ashar: 'Berjamaah' as PrayerStatus,
      maghrib: 'Berjamaah' as PrayerStatus,
      isya: 'Berjamaah' as PrayerStatus,
      dhuha: true,
      tahajjud: false,
      rawatib: true,
    }
  );

  const [tadarus, setTadarus] = useState(
    existingEntry?.tadarus || {
      type: "Al-Qur'an" as const,
      surahOrVolume: 'Surat Al-Baqarah',
      startAyahOrPage: 'Ayat 282',
      endAyahOrPage: 'Ayat 286',
      notes: "Tilawah tartil ba'da maghrib",
    }
  );

  const [tahfidz, setTahfidz] = useState(
    existingEntry?.tahfidz || {
      surah: "An-Naba'",
      startAyat: 1,
      endAyat: 40,
      juz: 30,
      kelancaran: 'Mumtaz (Sangat Lancar)' as const,
      notes: 'Lanjut mutqin surat berikutnya',
    }
  );

  const [parentFeedback, setParentFeedback] = useState<string>(
    existingEntry?.parentNote || ''
  );

  const juz30Surahs = [
    "An-Naba'", "An-Nazi'at", "'Abasa", "At-Takwir", "Al-Infithar", "Al-Muthaffifin",
    "Al-Insyiqaq", "Al-Buruj", "Ath-Thariq", "Al-A'la", "Al-Ghasyiyah", "Al-Fajr",
    "Al-Balad", "Asy-Syams", "Al-Lail", "Adh-Dhuha", "Al-Insyirah", "At-Tin",
    "Al-'Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-'Adiyat", "Al-Qari'ah",
    "At-Takatsur", "Al-'Ashr", "Al-Humazah", "Al-Fil", "Quraisy", "Al-Ma'un",
    "Al-Kautsar", "Al-Kafirun", "An-Nashr", "Al-Lahab", "Al-Ikhlas", "Al-Falaq", "An-Nas",
  ];

  const handleSaveStudentMutabaah = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const newEntry: MutabaahEntry = {
      id: existingEntry?.id || `mut-${currentUser.id}-${selectedDate}`,
      date: selectedDate,
      studentId: currentUser.id,
      studentName: currentUser.name,
      classId: currentUser.classId || 'c-5a',
      className: currentUser.className || 'Kelas 5A',
      prayers,
      tadarus,
      tahfidz,
      teacherNote: existingEntry?.teacherNote,
      teacherName: existingEntry?.teacherName,
      teacherVerified: existingEntry?.teacherVerified || false,
      teacherVerifiedAt: existingEntry?.teacherVerifiedAt,
      parentNote: parentFeedback || existingEntry?.parentNote,
      parentVerified: existingEntry?.parentVerified || false,
      disciplineScore: existingEntry?.disciplineScore || 95,
      characterBadge: existingEntry?.characterBadge || 'Rajin Berjamaah',
    };

    saveMutabaahEntry(newEntry);
    setSuccessToast('Alhamdulillah! Catatan mutaba\'ah ibadah berhasil disimpan.');
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const handleParentVerification = () => {
    if (!existingEntry && !currentUser) return;
    const entryId = existingEntry?.id || `mut-${currentUser?.id}-${selectedDate}`;
    
    // First ensure saved
    saveMutabaahEntry({
      id: entryId,
      date: selectedDate,
      studentId: currentUser!.id,
      studentName: currentUser!.name,
      classId: currentUser!.classId || 'c-5a',
      className: currentUser!.className || 'Kelas 5A',
      prayers,
      tadarus,
      tahfidz,
      teacherNote: existingEntry?.teacherNote,
      teacherName: existingEntry?.teacherName,
      teacherVerified: existingEntry?.teacherVerified || false,
      parentNote: parentFeedback || 'Alhamdulillah ananda tertib dan rajin sholat di rumah.',
      parentVerified: true,
    });

    verifyMutabaahByParent(
      entryId,
      parentFeedback || 'Alhamdulillah ananda tertib dan rajin sholat di rumah.'
    );

    setSuccessToast('Paraf dan tanggapan orang tua berhasil dikirim ke Wali Kelas!');
    setTimeout(() => setSuccessToast(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Islamic Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-700/50 border border-emerald-500/30 text-amber-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Buku Penghubung & Catatan Ibadah Santri</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Mutaba'ah Yaumiyah Harian
            </h1>
            <p className="text-emerald-100/90 text-xs sm:text-sm mt-1 max-w-xl">
              "Amalan yang paling dicintai oleh Allah adalah sholat pada waktunya, berbakti kepada orang tua, dan jihad di jalan Allah." (HR. Bukhari & Muslim)
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-800/80 p-2.5 rounded-2xl border border-emerald-600/40 shrink-0">
            <Calendar className="w-4 h-4 text-amber-300" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs font-bold text-white focus:outline-hidden cursor-pointer"
            />
          </div>
        </div>
      </div>

      {successToast && (
        <div className="p-3.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Main Checklist Form */}
      <form onSubmit={handleSaveStudentMutabaah} className="space-y-6">
        {/* Sholat 5 Waktu Grid */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">1. Checklist Sholat Fardhu 5 Waktu</h3>
                <p className="text-xs text-slate-500">Pilih status pelaksanaan setiap waktu sholat</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {(
              [
                { key: 'subuh', label: 'Sholat Subuh' },
                { key: 'dzuhur', label: 'Sholat Dzuhur' },
                { key: 'ashar', label: 'Sholat Ashar' },
                { key: 'maghrib', label: 'Sholat Maghrib' },
                { key: 'isya', label: 'Sholat Isya' },
              ] as const
            ).map((s) => (
              <div key={s.key} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-xs text-slate-900 mb-2">{s.label}</div>
                <select
                  value={prayers[s.key]}
                  onChange={(e) =>
                    setPrayers((prev) => ({
                      ...prev,
                      [s.key]: e.target.value as PrayerStatus,
                    }))
                  }
                  className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg p-1.5 text-slate-800 focus:outline-emerald-600"
                >
                  <option value="Berjamaah">Berjamaah di Masjid</option>
                  <option value="Tepat Waktu">Tepat Waktu (Munfarid)</option>
                  <option value="Munfarid">Munfarid di Rumah</option>
                  <option value="Tidak Sholat">Tidak Sholat</option>
                  <option value="Udzur Syar'i">Udzur Syar'i</option>
                </select>
              </div>
            ))}
          </div>

          {/* Sholat Sunnah */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 mb-2">Sholat Sunnah & Ibadah Tambahan:</h4>
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={prayers.dhuha}
                  onChange={(e) => setPrayers((p) => ({ ...p, dhuha: e.target.checked }))}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="font-semibold text-slate-800">Sholat Dhuha (di Madrasah / Rumah)</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={prayers.rawatib}
                  onChange={(e) => setPrayers((p) => ({ ...p, rawatib: e.target.checked }))}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="font-semibold text-slate-800">Sholat Sunnah Rawatib (Qobliyah / Ba'diyah)</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={prayers.tahajjud}
                  onChange={(e) => setPrayers((p) => ({ ...p, tahajjud: e.target.checked }))}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="font-semibold text-slate-800">Sholat Tahajjud & Witir</span>
              </label>
            </div>
          </div>
        </div>

        {/* Tadarus & Tahfidz Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tadarus Al-Qur'an / Tilawati */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">2. Tadarus Al-Qur'an / Tilawati / Iqro</h3>
                <p className="text-xs text-slate-500">Catatan bacaan harian di rumah / asrama</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Metode / Media:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Al-Qur'an", "Tilawati", "Iqro"] as const).map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setTadarus((prev) => ({ ...prev, type: t }))}
                      className={`py-1.5 px-3 rounded-lg text-xs font-bold border transition-colors ${
                        tadarus.type === t
                          ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Surat atau Jilid:
                </label>
                <input
                  type="text"
                  value={tadarus.surahOrVolume}
                  onChange={(e) => setTadarus((prev) => ({ ...prev, surahOrVolume: e.target.value }))}
                  placeholder="Contoh: Surat Al-Baqarah / Jilid 4"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-emerald-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mulai Ayat/Hal:</label>
                  <input
                    type="text"
                    value={tadarus.startAyahOrPage}
                    onChange={(e) => setTadarus((prev) => ({ ...prev, startAyahOrPage: e.target.value }))}
                    placeholder="Ayat 1 / Hal 12"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-emerald-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Sampai Ayat/Hal:</label>
                  <input
                    type="text"
                    value={tadarus.endAyahOrPage}
                    onChange={(e) => setTadarus((prev) => ({ ...prev, endAyahOrPage: e.target.value }))}
                    placeholder="Ayat 25 / Hal 15"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-emerald-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan Tilawah:</label>
                <input
                  type="text"
                  value={tadarus.notes || ''}
                  onChange={(e) => setTadarus((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Contoh: Memperhatikan hukum ikhfa dan mad wajib muttashil"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Setoran Tahfidz (Juz 30) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">3. Setoran Tahfidz Al-Qur'an (Juz 30)</h3>
                <p className="text-xs text-slate-500">Program Unggulan Tahfidz MI Assuyutiyah</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Surat (Juz 30):</label>
                <select
                  value={tahfidz.surah}
                  onChange={(e) => setTahfidz((prev) => ({ ...prev, surah: e.target.value }))}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:outline-emerald-600"
                >
                  {juz30Surahs.map((surah, idx) => (
                    <option key={surah} value={surah}>
                      {idx + 1}. Surat {surah}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mulai Ayat:</label>
                  <input
                    type="number"
                    min="1"
                    value={tahfidz.startAyat}
                    onChange={(e) => setTahfidz((prev) => ({ ...prev, startAyat: Number(e.target.value) }))}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-emerald-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Sampai Ayat:</label>
                  <input
                    type="number"
                    min="1"
                    value={tahfidz.endAyat}
                    onChange={(e) => setTahfidz((prev) => ({ ...prev, endAyat: Number(e.target.value) }))}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-emerald-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Predikat Kelancaran:</label>
                <select
                  value={tahfidz.kelancaran}
                  onChange={(e) =>
                    setTahfidz((prev) => ({
                      ...prev,
                      kelancaran: e.target.value as any,
                    }))
                  }
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-emerald-800 focus:outline-emerald-600"
                >
                  <option value="Mumtaz (Sangat Lancar)">Mumtaz (Sangat Lancar & Fasih)</option>
                  <option value="Jayyid Jiddan (Lancar)">Jayyid Jiddan (Lancar)</option>
                  <option value="Jayyid (Cukup)">Jayyid (Cukup Lancar)</option>
                  <option value="Perlu Mengulang">Perlu Pengulangan (Muraja'ah)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan Ustadz/Ustadzah:</label>
                <input
                  type="text"
                  value={tahfidz.notes || ''}
                  onChange={(e) => setTahfidz((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Catatan setoran tahfidz..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-emerald-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Button to Save */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-800/20 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>Simpan Amalan Mutaba'ah Hari Ini</span>
          </button>
        </div>
      </form>

      {/* Kolom Komunikasi & Catatan Akhlak Dua Arah */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              4. Buku Penghubung & Catatan Akhlak Dua Arah
            </h3>
            <p className="text-xs text-slate-500">
              Komunikasi pembinaan karakter antara Wali Kelas dan Orang Tua/Wali Santri
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kolom dari Wali Kelas */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  Catatan dari Wali Kelas:
                </span>
                {existingEntry?.teacherVerified && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                    Terverifikasi
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-950 leading-relaxed italic bg-white/70 p-3 rounded-xl border border-emerald-100">
                "{existingEntry?.teacherNote || 'Ananda Zaki senantiasa istiqomah dalam sholat Dhuha berjamaah dan aktif menyimak hafalan teman sekelas.'}"
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-200/70 flex items-center justify-between text-[11px] text-emerald-800">
              <div>
                <strong>{existingEntry?.teacherName || 'Usth. Siti Fatimah, S.Pd.I'}</strong>
                <span className="block text-[10px] text-emerald-600">
                  {existingEntry?.teacherVerifiedAt || 'Hari ini, 09:30 WIB'}
                </span>
              </div>
              {existingEntry?.characterBadge && (
                <div className="px-2 py-1 bg-amber-100 border border-amber-300 rounded-lg text-amber-900 font-bold text-[10px] flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-600 fill-amber-600" />
                  <span>{existingEntry.characterBadge}</span>
                </div>
              )}
            </div>
          </div>

          {/* Kolom dari Orang Tua / Wali Santri */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-600" />
                  Catatan & Paraf Orang Tua / Wali Santri:
                </span>
                {existingEntry?.parentVerified && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-600 text-white">
                    Sudah Diparaf
                  </span>
                )}
              </div>
              <textarea
                rows={3}
                value={parentFeedback}
                onChange={(e) => setParentFeedback(e.target.value)}
                placeholder="Tuliskan catatan dari rumah mengenai kedisiplinan sholat ananda, perilaku santun, atau pesan untuk ustadz/ustadzah..."
                className="w-full text-xs p-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-emerald-600 leading-relaxed"
              />
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-[10px] text-slate-500">
                Orang Tua dari: <strong>{currentUser?.name}</strong>
              </span>
              <button
                type="button"
                onClick={handleParentVerification}
                className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Paraf & Kirim Balasan</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
