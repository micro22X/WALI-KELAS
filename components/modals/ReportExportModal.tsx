'use client';

import React, { useState } from 'react';
import { useClass } from '@/context/ClassContext';
import { Printer, X, Copy, Check } from 'lucide-react';

export default function ReportExportModal() {
  const {
    openExportModal,
    setOpenExportModal,
    students,
    attendanceRecords,
    attendanceCounts,
    attendanceDate,
    currentUser,
  } = useClass();

  const [exportType, setExportType] = useState<'presensi' | 'rapor' | 'bimbingan'>('presensi');
  const [copied, setCopied] = useState(false);

  if (!openExportModal) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const summaryText = `*LAPORAN PRESENSI HARIAN ${currentUser?.className?.toUpperCase() || 'KELAS'}*
Tanggal: ${attendanceDate}
Wali Kelas: ${currentUser?.name || 'Bapak/Ibu Guru'}
Sekolah: ${currentUser?.schoolName || '-'}

Total Siswa: ${attendanceCounts.total}
• Hadir: ${attendanceCounts.hadir} (${attendanceCounts.ratePercent}%)
• Sakit: ${attendanceCounts.sakit}
• Izin: ${attendanceCounts.izin}
• Alfa: ${attendanceCounts.alfa}

Siswa Sakit/Izin:
${Object.entries(attendanceRecords)
  .filter(([, rec]) => rec.status === 'Sakit' || rec.status === 'Izin')
  .map(([id, rec]) => {
    const s = students.find((st) => st.id === id);
    return `- ${s?.name} (${rec.status}): ${rec.note || 'Surat terlampir'}`;
  })
  .join('\n') || '- Tidak ada siswa berhalangan'}

_Dicatat melalui Aplikasi Digital Wali Kelas ${currentUser?.className || ''}._`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      id="modal-export-report"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
    >
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-5 shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer className="w-6 h-6 text-[#006398] dark:text-sky-400" />
            <div className="flex flex-col">
              <h3 className="font-display font-bold text-[16px] text-[#0b1c30] dark:text-slate-100">
                Unduh &amp; Cetak Laporan
              </h3>
              <span className="text-[11px] text-[#45464d] dark:text-slate-400">
                Format resmi untuk arsip kurikulum &amp; kepala sekolah
              </span>
            </div>
          </div>
          <button
            onClick={() => setOpenExportModal(false)}
            className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Export Type Selector */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
          <button
            onClick={() => setExportType('presensi')}
            className={`py-2 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
              exportType === 'presensi'
                ? 'bg-white dark:bg-slate-800 text-[#006398] dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Presensi Harian
          </button>
          <button
            onClick={() => setExportType('rapor')}
            className={`py-2 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
              exportType === 'rapor'
                ? 'bg-white dark:bg-slate-800 text-[#006398] dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Ledger Rapor
          </button>
          <button
            onClick={() => setExportType('bimbingan')}
            className={`py-2 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
              exportType === 'bimbingan'
                ? 'bg-white dark:bg-slate-800 text-[#006398] dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Catatan Bimbingan
          </button>
        </div>

        {/* Printable Document Preview Container */}
        <div className="p-4 rounded-2xl bg-[#eff4ff] dark:bg-slate-900 border border-[#d3e4fe] dark:border-slate-700 flex flex-col gap-3 font-sans text-xs">
          {/* Letterhead */}
          <div className="flex items-center justify-between border-b pb-2 border-slate-300 dark:border-slate-700">
            <div>
              <p className="font-bold text-[13px] text-[#0b1c30] dark:text-slate-100">
                {currentUser?.schoolName || 'SEKOLAH'}
              </p>
              <p className="text-[10px] text-slate-500">
                LAPORAN RESMI WALI KELAS • TA {currentUser?.academicYear || '2025/2026'}
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-[#006398] uppercase">
              {currentUser?.className || 'KELAS'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 dark:text-slate-300">
            <div>
              Wali Kelas: <strong>{currentUser?.name || 'Bapak/Ibu Guru'}</strong>
            </div>
            <div>
              Tanggal: <strong>{attendanceDate}</strong>
            </div>
            <div>
              Tingkat Kehadiran: <strong>{attendanceCounts.ratePercent}%</strong>
            </div>
            <div>
              Total Siswa: <strong>{students.length} Peserta Didik</strong>
            </div>
          </div>

          {/* Table Preview */}
          <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <table className="w-full text-left text-[10px]">
              <thead className="bg-slate-100 dark:bg-slate-800 font-semibold sticky top-0">
                <tr>
                  <th className="p-1.5">No</th>
                  <th className="p-1.5">Nama Siswa</th>
                  <th className="p-1.5">Status / Nilai</th>
                  <th className="p-1.5">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {students.slice(0, 10).map((s) => {
                  const record = attendanceRecords[s.id];
                  return (
                    <tr key={s.id}>
                      <td className="p-1.5 font-bold">{s.absen}</td>
                      <td className="p-1.5 truncate max-w-[120px]">{s.name}</td>
                      <td className="p-1.5 font-semibold">
                        {exportType === 'rapor' ? `${s.averageScore} (${s.grade})` : record?.status || 'Hadir'}
                      </td>
                      <td className="p-1.5 text-slate-500 truncate max-w-[100px]">
                        {record?.note || '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <span className="text-[10px] text-slate-400 italic text-center">
            Menampilkan {Math.min(10, students.length)} baris pertama dari total {students.length} siswa.
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleCopySummary}
            className="flex-1 h-11 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] text-[#006398] font-bold text-[12px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin WA Paguyuban'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 h-11 rounded-xl bg-[#006398] hover:bg-sky-700 text-white font-bold text-[12px] flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
