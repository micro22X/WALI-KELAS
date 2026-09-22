'use client';

import React, { useState } from 'react';
import { useClass } from '@/context/ClassContext';
import { FileEdit, X, Save } from 'lucide-react';

export default function AddBehaviorModal() {
  const {
    openNewRecordModal,
    setOpenNewRecordModal,
    students,
    addBehaviorRecord,
    currentUser,
  } = useClass();

  const [studentId, setStudentId] = useState(students[0]?.id || '');
  const [type, setType] = useState<'Konseling Bimbingan' | 'Apresiasi Prestasi' | 'Pelanggaran Disiplin'>(
    'Apresiasi Prestasi'
  );
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [solution, setSolution] = useState('');
  const [points, setPoints] = useState<number>(10);
  const [notifyParent, setNotifyParent] = useState(true);

  if (!openNewRecordModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === studentId);
    if (!st || !title.trim()) return;

    addBehaviorRecord({
      studentId: st.id,
      studentName: st.name,
      studentNisn: st.nisn,
      type,
      title: title.trim(),
      description: description.trim(),
      solution: solution.trim() || undefined,
      points: Number(points),
      date: 'Hari Ini',
      time: 'Baru saja',
      recordedBy: currentUser?.name || 'Wali Kelas',
    });

    if (notifyParent && st.parentPhone) {
      const roleLabel = currentUser?.role || 'Wali Kelas';
      const classLabel = currentUser?.className ? ` ${currentUser.className}` : '';
      const msg = encodeURIComponent(
        `Assalamu'alaikum Warahmatullahi Wabarakatuh.\nSelamat pagi Bapak/Ibu wali murid ananda ${st.name}. Kami dari pihak ${roleLabel}${classLabel} menginformasikan catatan bimbingan/karakter hari ini: "${title}". Terima kasih atas kerja sama dan dukungannya.`
      );
      window.open(`https://wa.me/${st.parentPhone.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
    }

    // Reset form
    setTitle('');
    setDescription('');
    setSolution('');
    setOpenNewRecordModal(false);
  };

  return (
    <div
      id="modal-add-behavior"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
    >
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-5 shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileEdit className="w-6 h-6 text-[#006398] dark:text-sky-400" />
            <div className="flex flex-col">
              <h3 className="font-display font-bold text-[16px] text-[#0b1c30] dark:text-slate-100">
                Catat Bimbingan &amp; Karakter
              </h3>
              <span className="text-[11px] text-[#45464d] dark:text-slate-400">
                Catat prestasi, bimbingan, atau kedisiplinan
              </span>
            </div>
          </div>
          <button
            onClick={() => setOpenNewRecordModal(false)}
            className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Student selection */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-[#0b1c30] dark:text-slate-300">
              Pilih Peserta Didik
            </label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-[12px] text-[#0b1c30] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#006398]"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  #{String(s.absen).padStart(2, '0')} - {s.name} ({s.nisn})
                </option>
              ))}
            </select>
          </div>

          {/* Category Type */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-[#0b1c30] dark:text-slate-300">
              Kategori Catatan
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setType('Apresiasi Prestasi');
                  setPoints(10);
                }}
                className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                  type === 'Apresiasi Prestasi'
                    ? 'bg-amber-50 text-amber-900 border-amber-400 ring-2 ring-amber-400/30'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                Apresiasi (+)
              </button>

              <button
                type="button"
                onClick={() => {
                  setType('Konseling Bimbingan');
                  setPoints(0);
                }}
                className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                  type === 'Konseling Bimbingan'
                    ? 'bg-sky-50 text-[#006398] border-[#006398] ring-2 ring-sky-400/30'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                Konseling
              </button>

              <button
                type="button"
                onClick={() => {
                  setType('Pelanggaran Disiplin');
                  setPoints(-5);
                }}
                className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                  type === 'Pelanggaran Disiplin'
                    ? 'bg-rose-50 text-rose-900 border-rose-400 ring-2 ring-rose-400/30'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                Pelanggaran (-)
              </button>
            </div>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-[#0b1c30] dark:text-slate-300">
              Judul Kasus / Apresiasi
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Juara 1 Pidato / Terlambat 3x berturut..."
              className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-[12px] text-[#0b1c30] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#006398]"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-[#0b1c30] dark:text-slate-300">
              Deskripsi Kejadian / Kronologi
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan secara ringkas pengamatan guru..."
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-[12px] text-[#0b1c30] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#006398]"
            />
          </div>

          {/* Solusi & Tindak Lanjut */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-[#0b1c30] dark:text-slate-300">
              Solusi &amp; Tindak Lanjut
            </label>
            <input
              type="text"
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder="Contoh: Bimbingan wali kelas &amp; komitmen bangun pagi..."
              className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-[12px] text-[#0b1c30] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#006398]"
            />
          </div>

          {/* Points */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-[#0b1c30] dark:text-slate-300">
                Poin Sikap
              </label>
              <span className="font-bold text-[12px] text-[#006398] dark:text-sky-400">
                {points > 0 ? `+${points}` : points} Poin
              </span>
            </div>
            <input
              type="range"
              min={-20}
              max={25}
              step={5}
              value={points}
              onChange={(e) => setPoints(Number(e.target.value))}
              className="accent-[#006398] cursor-pointer"
            />
          </div>

          {/* WhatsApp Checkbox */}
          <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[#eff4ff] dark:bg-slate-900 border border-[#d3e4fe]/60 cursor-pointer">
            <input
              type="checkbox"
              checked={notifyParent}
              onChange={(e) => setNotifyParent(e.target.checked)}
              className="w-4 h-4 rounded text-[#006398] accent-[#006398]"
            />
            <span className="text-[11px] text-[#0b1c30] dark:text-slate-200 font-medium">
              Kirim kabar langsung ke WhatsApp Wali Murid
            </span>
          </label>

          <button
            type="submit"
            className="h-11 rounded-xl bg-[#006398] hover:bg-sky-700 text-white font-semibold text-[13px] flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all mt-1 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Catatan Karakter</span>
          </button>
        </form>
      </div>
    </div>
  );
}
