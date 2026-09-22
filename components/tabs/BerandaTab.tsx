'use client';

import React from 'react';
import { useClass } from '@/context/ClassContext';
import { formatIndonesianDate } from '@/lib/dateUtils';
import {
  BadgeCheck,
  FileCheck,
  AlertCircle,
  History,
  Phone,
  ClipboardCheck,
  Sparkles,
  Megaphone,
  FileText,
  CheckCircle2,
  GraduationCap,
  Heart,
  UserPlus,
  Settings,
  School,
  Camera,
  Check,
} from 'lucide-react';

export default function BerandaTab() {
  const {
    setActiveTab,
    attendanceCounts,
    attendanceRecords,
    behaviorRecords,
    currentUser,
    setOpenNewRecordModal,
    setOpenExportModal,
    setOpenEditClassModal,
    setOpenAddStudentModal,
    setEditingStudent,
    students,
  } = useClass();

  const todayFormatted = formatIndonesianDate(new Date());

  const sakitStudents = students.filter((s) => attendanceRecords[s.id]?.status === 'Sakit');
  const izinStudents = students.filter((s) => attendanceRecords[s.id]?.status === 'Izin');
  const attentionStudents = students.filter((s) => s.needsAttention || s.attendanceRate < 80);
  const firstAttentionStudent = attentionStudents[0];

  const handleCallParent = (name: string, phone: string) => {
    const text = encodeURIComponent(
      `Assalamu'alaikum Warahmatullahi Wabarakatuh.\nSelamat pagi Bapak/Ibu wali murid dari ananda ${name}. Kami dari pihak Wali Kelas ${currentUser?.className || 'Kelas'} ${currentUser?.schoolName || 'Sekolah'} ingin menanyakan kabar dan konfirmasi kehadiran ananda hari ini. Terima kasih.`
    );
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="flex flex-col w-full gap-4 pb-4">
      {/* Greeting & Class Pulse Card */}
      <section
        id="card-greeting-pulse"
        className="relative overflow-hidden bg-[#eff4ff] dark:bg-slate-800/80 rounded-2xl p-4 border border-[#d3e4fe]/60 dark:border-slate-700/60 shadow-sm"
      >
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-[#cce5ff]/60 dark:bg-sky-900/30 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#006398] dark:bg-sky-400"></span>
              <span className="text-[11px] font-semibold text-[#45464d] dark:text-slate-300 uppercase tracking-wider">
                {todayFormatted}
              </span>
            </div>
            <h1 className="font-display text-[20px] font-bold text-[#0b1c30] dark:text-slate-100 truncate">
              Semangat Pagi, {currentUser?.name ? currentUser.name.split(',')[0] : 'Bapak/Ibu Guru'}! 👋
            </h1>
            <button
              type="button"
              id="btn-beranda-edit-class"
              onClick={() => setOpenEditClassModal(true)}
              className="text-[12px] text-[#45464d] dark:text-slate-300 hover:text-[#006398] dark:hover:text-sky-300 hover:underline flex items-center gap-1.5 cursor-pointer text-left"
              title="Klik untuk mengubah nama kelas & profil wali kelas"
            >
              <span>{currentUser?.className || 'Kelas'} • {students.length} Peserta Didik</span>
              <Settings className="w-3.5 h-3.5 text-[#006398] dark:text-sky-400 shrink-0" />
            </button>
          </div>

          <button
            type="button"
            id="btn-beranda-teacher-avatar"
            onClick={() => setOpenEditClassModal(true)}
            className="shrink-0 relative group flex items-center justify-center w-12 h-12 rounded-2xl overflow-hidden bg-white dark:bg-slate-700 shadow-sm ring-2 ring-[#006398]/30 dark:ring-sky-500/30 hover:scale-105 transition-transform cursor-pointer"
            title="Klik untuk mengganti foto guru & identitas kelas"
          >
            <img
              src={currentUser?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUCVerHn8tk2JrXyIoA3re0jDuAj5vSIq1LyHt9GOz2yM3rrNiDfygefyREnxeHPbmfu7xZPUHpk6jkxeHX9wFNlW_j8m7usFaMWzMK6T5P5aPNai09_n0rJi4QxEz-vIFah2u2g6WMvPkGraWnwIMWP3zacA33EJzeKlYEHkztzxL6cyEIVEapOySEUUaBEJhyBsO61WfrU3fRtT08VbNuRR1_eb-XJLtnCSvKlt-aMD7yNIJFSiSAw'}
              alt={currentUser?.name || 'Foto Guru'}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
              <Camera className="w-4 h-4" />
            </div>
          </button>
        </div>

        {/* Attendance Completion Highlight */}
        <div className="mt-3.5 pt-2 flex items-center justify-between bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl px-3.5 py-2.5 shadow-sm border border-[#e2e8f0]/70 dark:border-slate-800">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
            <div className="flex flex-col min-w-0">
              <span className="text-[12px] font-semibold text-[#0b1c30] dark:text-slate-100 truncate">
                Presensi Harian Lengkap
              </span>
              <span className="text-[11px] text-[#45464d] dark:text-slate-400">
                Terverifikasi pk 07.25 WIB
              </span>
            </div>
          </div>
          <span className="font-display font-bold text-[16px] text-[#006398] dark:text-sky-400 shrink-0">
            {attendanceCounts.ratePercent}%
          </span>
        </div>
      </section>

      {/* Quick Stat Summary Banner (Tally Cards) */}
      <section id="section-tally-summary" className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-display font-semibold text-[15px] text-[#0b1c30] dark:text-slate-100">
            Rekap Presensi Hari Ini
          </h2>
          <button
            onClick={() => setActiveTab('presensi')}
            className="text-[11px] text-[#006398] dark:text-sky-400 font-semibold hover:underline cursor-pointer"
          >
            {attendanceCounts.total} Total Siswa
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {/* Hadir */}
          <button
            onClick={() => setActiveTab('presensi')}
            className="group flex flex-col items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800/90 shadow-sm border border-[#e2e8f0] dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-600 text-left transition-all active:scale-95 cursor-pointer"
            type="button"
          >
            <div className="w-full flex items-center justify-between">
              <span className="text-[11px] text-[#45464d] dark:text-slate-400">Hadir</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <span className="font-display text-[26px] font-bold text-[#0b1c30] dark:text-slate-100 my-0.5">
              {attendanceCounts.hadir}
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold text-center truncate w-full">
              {attendanceCounts.ratePercent}%
            </span>
          </button>

          {/* Sakit */}
          <button
            onClick={() => setActiveTab('presensi')}
            className="group flex flex-col items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800/90 shadow-sm border border-[#e2e8f0] dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-600 text-left transition-all active:scale-95 cursor-pointer"
            type="button"
          >
            <div className="w-full flex items-center justify-between">
              <span className="text-[11px] text-[#45464d] dark:text-slate-400">Sakit</span>
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            </div>
            <span className="font-display text-[26px] font-bold text-[#0b1c30] dark:text-slate-100 my-0.5">
              {attendanceCounts.sakit}
            </span>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold text-center truncate w-full">
              Surat (+{attendanceCounts.sakit})
            </span>
          </button>

          {/* Izin */}
          <button
            onClick={() => setActiveTab('presensi')}
            className="group flex flex-col items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800/90 shadow-sm border border-[#e2e8f0] dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-600 text-left transition-all active:scale-95 cursor-pointer"
            type="button"
          >
            <div className="w-full flex items-center justify-between">
              <span className="text-[11px] text-[#45464d] dark:text-slate-400">Izin</span>
              <span className="w-2 h-2 rounded-full bg-[#0284c7]"></span>
            </div>
            <span className="font-display text-[26px] font-bold text-[#0b1c30] dark:text-slate-100 my-0.5">
              {attendanceCounts.izin}
            </span>
            <span className="text-[11px] text-[#006398] dark:text-sky-400 font-semibold text-center truncate w-full">
              Dispensasi
            </span>
          </button>

          {/* Alfa */}
          <button
            onClick={() => setActiveTab('presensi')}
            className="group flex flex-col items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800/90 shadow-sm border border-[#e2e8f0] dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-600 text-left transition-all active:scale-95 cursor-pointer"
            type="button"
          >
            <div className="w-full flex items-center justify-between">
              <span className="text-[11px] text-[#45464d] dark:text-slate-400">Alfa</span>
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            </div>
            <span className="font-display text-[26px] font-bold text-[#0b1c30] dark:text-slate-100 my-0.5">
              {attendanceCounts.alfa}
            </span>
            <span className="text-[11px] text-[#45464d] dark:text-slate-400 font-semibold text-center truncate w-full">
              {attendanceCounts.alfa === 0 ? 'Nihil' : `${attendanceCounts.alfa} Siswa`}
            </span>
          </button>
        </div>

        {/* Micro Detail Drawer for Sakit & Izin */}
        <div className="flex flex-col gap-1.5 p-2.5 bg-[#eff4ff] dark:bg-slate-800/60 rounded-xl border border-[#d3e4fe]/50 dark:border-slate-700/50">
          <div className="flex items-center gap-2 text-[#0b1c30] dark:text-slate-200">
            <FileCheck className="w-4 h-4 text-[#45464d] dark:text-slate-400" />
            <span className="text-[12px] font-semibold">Keterangan Khusus Hari Ini:</span>
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            {sakitStudents.length > 0 || izinStudents.length > 0 ? (
              <>
                {sakitStudents.length > 0 && (
                  <div className="flex items-center justify-between bg-white dark:bg-slate-900 px-3 py-2 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 shrink-0">
                        Sakit ({sakitStudents.length})
                      </span>
                      <span className="text-[12px] text-[#0b1c30] dark:text-slate-200 truncate">
                        {sakitStudents.map((s) => s.name).join(', ')}
                      </span>
                    </div>
                  </div>
                )}
                {izinStudents.length > 0 && (
                  <div className="flex items-center justify-between bg-white dark:bg-slate-900 px-3 py-2 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-200 shrink-0">
                        Izin ({izinStudents.length})
                      </span>
                      <span className="text-[12px] text-[#0b1c30] dark:text-slate-200 truncate">
                        {izinStudents.map((s) => s.name).join(', ')}
                      </span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white dark:bg-slate-900 px-3 py-2 rounded-lg text-[12px] text-slate-500 dark:text-slate-400">
                {students.length === 0
                  ? 'Belum ada siswa terdaftar di kelas.'
                  : 'Nihil. Seluruh siswa terdata hadir atau belum ada permohonan izin/sakit.'}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Attention Widget: Siswa Perlu Perhatian */}
      <section id="section-attention-needed" className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-5 h-5 text-[#ba1a1a] dark:text-rose-400" />
            <h2 className="font-display font-semibold text-[15px] text-[#0b1c30] dark:text-slate-100">
              Perhatian Khusus
            </h2>
          </div>
          <span className="text-[11px] text-[#ba1a1a] dark:text-rose-400 bg-rose-50 dark:bg-rose-950/80 px-2 py-0.5 rounded-full font-semibold border border-rose-200 dark:border-rose-900">
            {attentionStudents.length} Siswa
          </span>
        </div>

        {firstAttentionStudent ? (
          <div className="bg-white dark:bg-slate-800/90 p-4 rounded-2xl shadow-sm border border-[#e2e8f0] dark:border-slate-700 flex flex-col gap-3 relative overflow-hidden">
            <div className="flex items-start gap-3">
              <img
                alt={firstAttentionStudent.name}
                className="w-12 h-12 rounded-xl object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
                src={firstAttentionStudent.photo}
              />
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="font-display font-semibold text-[15px] text-[#0b1c30] dark:text-slate-100 truncate">
                    {firstAttentionStudent.name}
                  </h3>
                  <span className="text-[11px] text-[#ba1a1a] dark:text-rose-400 font-semibold shrink-0">
                    Perlu Respons
                  </span>
                </div>
                <p className="text-[12px] text-[#45464d] dark:text-slate-400 mt-0.5">
                  NISN: {firstAttentionStudent.nisn} • Absen #{String(firstAttentionStudent.absen).padStart(2, '0')}
                </p>

                <div className="mt-2 p-2.5 rounded-lg bg-[#eff4ff] dark:bg-slate-900 text-[#0b1c30] dark:text-slate-200 text-[12px] border border-[#d3e4fe]/50 dark:border-slate-800">
                  <strong className="font-semibold text-[#0b1c30] dark:text-slate-100">Catatan:</strong>{' '}
                  {firstAttentionStudent.notes || `Kehadiran: ${firstAttentionStudent.attendanceRate}%. Perlu pendampingan wali kelas.`}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100 dark:border-slate-700/60">
              <button
                onClick={() => setActiveTab('bimbingan')}
                className="h-9 px-3 rounded-lg bg-[#e5eeff] hover:bg-[#dce9ff] dark:bg-slate-700 dark:hover:bg-slate-600 text-[#0b1c30] dark:text-slate-100 font-semibold text-[12px] flex items-center gap-1.5 transition-colors cursor-pointer"
                type="button"
              >
                <History className="w-4 h-4" />
                <span>Riwayat</span>
              </button>
              <button
                onClick={() => handleCallParent(firstAttentionStudent.name, firstAttentionStudent.parentPhone)}
                className="h-9 px-4 rounded-lg bg-[#006398] hover:bg-sky-700 text-white font-semibold text-[12px] flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                type="button"
              >
                <Phone className="w-4 h-4" />
                <span>Hubungi Ortu</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800/90 p-4 rounded-2xl shadow-sm border border-[#e2e8f0] dark:border-slate-700 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <Check className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <h4 className="font-display font-semibold text-[14px] text-[#0b1c30] dark:text-slate-100">
                Kondisi Kelas Prima
              </h4>
              <p className="text-[12px] text-[#45464d] dark:text-slate-400">
                {students.length === 0
                  ? 'Data siswa masih kosong. Tambahkan siswa untuk mulai memantau.'
                  : 'Seluruh peserta didik terpantau hadir aktif dan tidak ada catatan bimbingan mendesak.'}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Quick Action Grid */}
      <section id="section-quick-actions" className="flex flex-col gap-2">
        <h2 className="font-display font-semibold text-[15px] text-[#0b1c30] dark:text-slate-100 px-1">
          Aksi Cepat Wali Kelas
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {/* Quick Attendance */}
          <button
            onClick={() => setActiveTab('presensi')}
            className="flex flex-col items-start p-3.5 rounded-2xl bg-white dark:bg-slate-800 shadow-sm hover:bg-[#eff4ff] dark:hover:bg-slate-750 border border-[#e2e8f0] dark:border-slate-700 text-left transition-colors group cursor-pointer"
            type="button"
          >
            <div className="w-10 h-10 rounded-xl bg-[#cce5ff] dark:bg-sky-950 text-[#006398] dark:text-sky-300 flex items-center justify-center mb-2.5">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <span className="font-display font-semibold text-[14px] text-[#0b1c30] dark:text-slate-100 group-hover:text-[#006398] dark:group-hover:text-sky-400 transition-colors">
              Isi Presensi
            </span>
            <span className="text-[11px] text-[#45464d] dark:text-slate-400">Update harian/sesi</span>
          </button>

          {/* Record Merit / Infraction */}
          <button
            onClick={() => setOpenNewRecordModal(true)}
            className="flex flex-col items-start p-3.5 rounded-2xl bg-white dark:bg-slate-800 shadow-sm hover:bg-[#eff4ff] dark:hover:bg-slate-750 border border-[#e2e8f0] dark:border-slate-700 text-left transition-colors group cursor-pointer"
            type="button"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center justify-center mb-2.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-display font-semibold text-[14px] text-[#0b1c30] dark:text-slate-100 group-hover:text-[#006398] dark:group-hover:text-sky-400 transition-colors">
              Karakter &amp; Poin
            </span>
            <span className="text-[11px] text-[#45464d] dark:text-slate-400">Catat prestasi &amp; catatan</span>
          </button>

          {/* Broadcast announcement */}
          <button
            onClick={() => setActiveTab('bimbingan')}
            className="flex flex-col items-start p-3.5 rounded-2xl bg-white dark:bg-slate-800 shadow-sm hover:bg-[#eff4ff] dark:hover:bg-slate-750 border border-[#e2e8f0] dark:border-slate-700 text-left transition-colors group cursor-pointer"
            type="button"
          >
            <div className="w-10 h-10 rounded-xl bg-[#e5eeff] dark:bg-slate-700 text-[#0b1c30] dark:text-slate-100 flex items-center justify-center mb-2.5">
              <Megaphone className="w-5 h-5" />
            </div>
            <span className="font-display font-semibold text-[14px] text-[#0b1c30] dark:text-slate-100 group-hover:text-[#006398] dark:group-hover:text-sky-400 transition-colors">
              Pesan Paguyuban
            </span>
            <span className="text-[11px] text-[#45464d] dark:text-slate-400">Info wali murid kelas</span>
          </button>

          {/* Export Report */}
          <button
            onClick={() => setOpenExportModal(true)}
            className="flex flex-col items-start p-3.5 rounded-2xl bg-white dark:bg-slate-800 shadow-sm hover:bg-[#eff4ff] dark:hover:bg-slate-750 border border-[#e2e8f0] dark:border-slate-700 text-left transition-colors group cursor-pointer"
            type="button"
          >
            <div className="w-10 h-10 rounded-xl bg-[#dce9ff] dark:bg-slate-700 text-[#0b1c30] dark:text-slate-100 flex items-center justify-center mb-2.5">
              <FileText className="w-5 h-5" />
            </div>
            <span className="font-display font-semibold text-[14px] text-[#0b1c30] dark:text-slate-100 group-hover:text-[#006398] dark:group-hover:text-sky-400 transition-colors">
              Unduh Rekap
            </span>
            <span className="text-[11px] text-[#45464d] dark:text-slate-400">PDF Presensi &amp; Bimbingan</span>
          </button>

          {/* Add Student Real */}
          <button
            id="btn-quick-add-student"
            onClick={() => {
              setEditingStudent(null);
              setOpenAddStudentModal(true);
            }}
            className="flex flex-col items-start p-3.5 rounded-2xl bg-white dark:bg-slate-800 shadow-sm hover:bg-[#eff4ff] dark:hover:bg-slate-750 border border-[#e2e8f0] dark:border-slate-700 text-left transition-colors group cursor-pointer"
            type="button"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-2.5">
              <UserPlus className="w-5 h-5" />
            </div>
            <span className="font-display font-semibold text-[14px] text-[#0b1c30] dark:text-slate-100 group-hover:text-[#006398] dark:group-hover:text-sky-400 transition-colors">
              Tambah Siswa
            </span>
            <span className="text-[11px] text-[#45464d] dark:text-slate-400">Input data siswa asli</span>
          </button>

          {/* Edit Class & Teacher Profile */}
          <button
            id="btn-quick-edit-class"
            onClick={() => setOpenEditClassModal(true)}
            className="flex flex-col items-start p-3.5 rounded-2xl bg-white dark:bg-slate-800 shadow-sm hover:bg-[#eff4ff] dark:hover:bg-slate-750 border border-[#e2e8f0] dark:border-slate-700 text-left transition-colors group cursor-pointer"
            type="button"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center mb-2.5">
              <School className="w-5 h-5" />
            </div>
            <span className="font-display font-semibold text-[14px] text-[#0b1c30] dark:text-slate-100 group-hover:text-[#006398] dark:group-hover:text-sky-400 transition-colors">
              Akun &amp; Kelas
            </span>
            <span className="text-[11px] text-[#45464d] dark:text-slate-400">Atur profil wali &amp; sekolah</span>
          </button>
        </div>
      </section>

      {/* Teaching & Class Agenda Today */}
      <section id="section-today-agenda" className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-display font-semibold text-[15px] text-[#0b1c30] dark:text-slate-100">
            Jadwal &amp; Kegiatan Hari Ini
          </h2>
          <span className="text-[11px] text-[#006398] dark:text-sky-400 font-semibold">2 Sesi</span>
        </div>

        <div className="flex flex-col gap-2">
          {/* Selesai Item */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/75 dark:bg-slate-800/60 opacity-80 shadow-sm border border-[#e2e8f0] dark:border-slate-700">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[#e5eeff] dark:bg-slate-700 flex items-center justify-center text-[#45464d] dark:text-slate-300 shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] text-[#45464d] dark:text-slate-400">
                  Jam ke 1-2 (07.30 - 09.00)
                </span>
                <span className="font-display font-semibold text-[13px] text-[#0b1c30] dark:text-slate-200 truncate">
                  Matematika - Bab Transformasi
                </span>
                <span className="text-[11px] text-[#45464d] dark:text-slate-400">
                  Kelas IX-B • Selesai Terlaksana
                </span>
              </div>
            </div>
            <span className="text-[10px] font-semibold bg-[#e5eeff] dark:bg-slate-700 px-2 py-1 rounded-md text-[#45464d] dark:text-slate-300 shrink-0">
              Selesai
            </span>
          </div>

          {/* Upcoming Highlighted Item */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-sky-200 dark:border-sky-900/60 ring-1 ring-sky-500/20">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[#cce5ff] dark:bg-sky-950 text-[#006398] dark:text-sky-300 flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5 text-[#006398] dark:text-sky-400" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] text-[#006398] dark:text-sky-400 font-semibold">
                  Jam ke 5-6 (11.30 - 13.00)
                </span>
                <span className="font-display font-semibold text-[13px] text-[#0b1c30] dark:text-slate-100 truncate">
                  Bimbingan Karakter &amp; Refleksi Kelas
                </span>
                <span className="text-[11px] text-[#45464d] dark:text-slate-400">
                  Ruang Kelas IX-B • Persiapan Projek P5
                </span>
              </div>
            </div>
            <span className="text-[11px] bg-[#006398] text-white font-medium px-2.5 py-1 rounded-md shrink-0 shadow-sm">
              Mendatang
            </span>
          </div>
        </div>
      </section>

      {/* Recent Mentoring / Activity Feed */}
      <section id="section-recent-mentoring" className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-display font-semibold text-[15px] text-[#0b1c30] dark:text-slate-100">
            Catatan Pembinaan Terkini
          </h2>
          <button
            onClick={() => setActiveTab('bimbingan')}
            className="text-[11px] text-[#006398] dark:text-sky-400 font-semibold hover:underline cursor-pointer"
            type="button"
          >
            Lihat Semua
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-[#e2e8f0] dark:border-slate-700 flex flex-col gap-3">
          {behaviorRecords.length > 0 ? (
            behaviorRecords.slice(0, 3).map((item, idx) => (
              <React.Fragment key={item.id}>
                {idx > 0 && <div className="border-t border-slate-100 dark:border-slate-700/60"></div>}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#eff4ff] dark:bg-slate-700 text-[#006398] dark:text-sky-300 flex items-center justify-center font-bold text-[13px] shrink-0">
                    {item.studentName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-display font-semibold text-[14px] text-[#0b1c30] dark:text-slate-100 truncate">
                        {item.studentName}
                      </span>
                      <span className="text-[11px] text-[#45464d] dark:text-slate-400 shrink-0">
                        {item.date}
                      </span>
                    </div>
                    <p className="text-[12px] text-[#45464d] dark:text-slate-300 mt-0.5 line-clamp-2">
                      {item.description || item.title}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        item.points >= 0
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                      }`}>
                        {item.type}
                      </span>
                      <span className={`text-[11px] font-semibold ${item.points >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {item.points >= 0 ? `+${item.points}` : item.points} Poin
                      </span>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))
          ) : (
            <div className="text-center py-4 text-slate-500 dark:text-slate-400 text-[12px]">
              Belum ada catatan pembinaan siswa. Anda dapat mencatat apresiasi atau konseling melalui tab Bimbingan.
            </div>
          )}
        </div>
      </section>

      {/* Classroom Motivation Toast Banner */}
      <aside
        id="toast-motivation-banner"
        className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#eff4ff] dark:bg-slate-800/80 border border-[#d3e4fe]/50 dark:border-slate-700/60 text-[#0b1c30] dark:text-slate-200"
      >
        <Heart className="w-5 h-5 text-rose-500 fill-rose-500 shrink-0" />
        <p className="text-[12px] italic flex-1">
          &quot;Satu teladan lebih bermakna dari seribu kata arahan. Selamat membimbing anak-anak hari ini!&quot;
        </p>
      </aside>
    </div>
  );
}
