'use client';

import React, { useState, useMemo } from 'react';
import { useClass } from '@/context/ClassContext';
import { AttendanceStatus } from '@/types';
import { getTodayDateString, formatIndonesianDate } from '@/lib/dateUtils';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Zap,
  CheckCheck,
  Search,
  X,
  UserX,
  FileText,
  TrendingUp,
  Send,
} from 'lucide-react';

export default function PresensiTab() {
  const {
    students,
    attendanceRecords,
    updateAttendance,
    setAllPresent,
    attendanceDate,
    setAttendanceDate,
    attendanceCounts,
    setOpenExportModal,
    setActiveTab,
  } = useClass();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'Semua' | AttendanceStatus>('Semua');
  const [noteModalStudentId, setNoteModalStudentId] = useState<string | null>(null);
  const [tempNoteText, setTempNoteText] = useState('');

  // Format Indonesian date for header safely across all timezones
  const formattedDate = useMemo(() => {
    return formatIndonesianDate(attendanceDate);
  }, [attendanceDate]);

  // Navigate dates
  const handlePrevDay = () => {
    const parts = attendanceDate.split('-').map(Number);
    if (parts.length === 3) {
      const d = new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
      d.setDate(d.getDate() - 1);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      setAttendanceDate(`${y}-${m}-${day}`);
    }
  };

  const handleNextDay = () => {
    const parts = attendanceDate.split('-').map(Number);
    if (parts.length === 3) {
      const d = new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
      d.setDate(d.getDate() + 1);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      setAttendanceDate(`${y}-${m}-${day}`);
    }
  };

  const handleSetToday = () => {
    setAttendanceDate(getTodayDateString());
  };

  // Filter students based on search and status filter
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const record = attendanceRecords[s.id];
      const status = record?.status || 'Hadir';

      // Status filter
      if (filterStatus !== 'Semua' && status !== filterStatus) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = s.name.toLowerCase().includes(q);
        const matchNisn = s.nisn.includes(q);
        const matchAbsen = String(s.absen).padStart(2, '0').includes(q);
        return matchName || matchNisn || matchAbsen;
      }

      return true;
    });
  }, [students, attendanceRecords, filterStatus, searchQuery]);

  const handleStatusClick = (studentId: string, status: AttendanceStatus) => {
    if (status === 'Sakit' || status === 'Izin') {
      const existing = attendanceRecords[studentId];
      setTempNoteText(existing?.note || '');
      setNoteModalStudentId(studentId);
    }
    updateAttendance(studentId, status);
  };

  const saveNoteAndClose = () => {
    if (noteModalStudentId) {
      const currentStatus = attendanceRecords[noteModalStudentId]?.status || 'Sakit';
      updateAttendance(noteModalStudentId, currentStatus, tempNoteText);
      setNoteModalStudentId(null);
      setTempNoteText('');
    }
  };

  return (
    <div className="flex flex-col w-full gap-3 pb-24">
      {/* Date Header Navigator */}
      <section
        id="card-date-navigator"
        className="bg-white dark:bg-slate-800 rounded-2xl p-3.5 shadow-sm border border-[#e2e8f0] dark:border-slate-700 flex items-center justify-between gap-2"
      >
        <button
          onClick={handlePrevDay}
          className="w-10 h-10 rounded-xl bg-[#eff4ff] dark:bg-slate-700 hover:bg-[#dce9ff] dark:hover:bg-slate-600 flex items-center justify-center text-[#0b1c30] dark:text-slate-100 transition-colors cursor-pointer"
          type="button"
          aria-label="Hari Sebelumnya"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <h2 className="font-display font-bold text-[16px] text-[#0b1c30] dark:text-slate-100">
            {formattedDate}
          </h2>
          <span className="text-[11px] text-[#45464d] dark:text-slate-400">
            Sesi Pagi • 07:15 WIB
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleNextDay}
            className="w-10 h-10 rounded-xl bg-[#eff4ff] dark:bg-slate-700 hover:bg-[#dce9ff] dark:hover:bg-slate-600 flex items-center justify-center text-[#0b1c30] dark:text-slate-100 transition-colors cursor-pointer"
            type="button"
            aria-label="Hari Berikutnya"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={handleSetToday}
            className="h-10 px-3 rounded-xl bg-[#cce5ff] dark:bg-sky-950 hover:bg-[#b8daff] text-[#006398] dark:text-sky-300 font-semibold text-[12px] flex items-center gap-1.5 transition-colors cursor-pointer"
            type="button"
          >
            <Calendar className="w-4 h-4" />
            <span>Hari Ini</span>
          </button>
        </div>
      </section>

      {/* Filter Tabs */}
      <section id="section-filter-status" className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {/* Semua */}
        <button
          onClick={() => setFilterStatus('Semua')}
          className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
            filterStatus === 'Semua'
              ? 'bg-[#0f172a] dark:bg-sky-500 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-[#45464d] dark:text-slate-300 border border-[#e2e8f0] dark:border-slate-700'
          }`}
          type="button"
        >
          <span>Semua</span>
          <span className="opacity-80 text-[11px]">{attendanceCounts.total}</span>
        </button>

        {/* Hadir */}
        <button
          onClick={() => setFilterStatus('Hadir')}
          className={`px-3 py-1.5 rounded-full text-[12px] font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
            filterStatus === 'Hadir'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-[#45464d] dark:text-slate-300 border border-[#e2e8f0] dark:border-slate-700'
          }`}
          type="button"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Hadir</span>
          <span className="text-[11px] font-bold">{attendanceCounts.hadir}</span>
        </button>

        {/* Sakit */}
        <button
          onClick={() => setFilterStatus('Sakit')}
          className={`px-3 py-1.5 rounded-full text-[12px] font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
            filterStatus === 'Sakit'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-[#45464d] dark:text-slate-300 border border-[#e2e8f0] dark:border-slate-700'
          }`}
          type="button"
        >
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          <span>Sakit</span>
          <span className="text-[11px] font-bold">{attendanceCounts.sakit}</span>
        </button>

        {/* Izin */}
        <button
          onClick={() => setFilterStatus('Izin')}
          className={`px-3 py-1.5 rounded-full text-[12px] font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
            filterStatus === 'Izin'
              ? 'bg-[#006398] text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-[#45464d] dark:text-slate-300 border border-[#e2e8f0] dark:border-slate-700'
          }`}
          type="button"
        >
          <span className="w-2 h-2 rounded-full bg-[#0284c7]"></span>
          <span>Izin</span>
          <span className="text-[11px] font-bold">{attendanceCounts.izin}</span>
        </button>

        {/* Alfa */}
        <button
          onClick={() => setFilterStatus('Alfa')}
          className={`px-3 py-1.5 rounded-full text-[12px] font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
            filterStatus === 'Alfa'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-[#45464d] dark:text-slate-300 border border-[#e2e8f0] dark:border-slate-700'
          }`}
          type="button"
        >
          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          <span>Alfa</span>
          <span className="text-[11px] font-bold">{attendanceCounts.alfa}</span>
        </button>
      </section>

      {/* Presensi Cepat Banner */}
      <section
        id="card-quick-attendance"
        className="bg-[#eff4ff] dark:bg-slate-800/90 rounded-2xl p-3.5 border border-[#d3e4fe] dark:border-slate-700 flex items-center justify-between gap-2 shadow-sm"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#cce5ff] dark:bg-sky-950 text-[#006398] dark:text-sky-300 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-[#006398] dark:text-sky-400" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-display font-semibold text-[13px] text-[#0b1c30] dark:text-slate-100 truncate">
              Presensi Cepat
            </span>
            <span className="text-[11px] text-[#45464d] dark:text-slate-400 truncate">
              Otomatiskan semua siswa belum terisi
            </span>
          </div>
        </div>

        <button
          onClick={setAllPresent}
          className="h-9 px-3.5 rounded-xl bg-[#006398] hover:bg-sky-700 text-white font-semibold text-[12px] flex items-center gap-1.5 shadow-sm active:scale-95 transition-all shrink-0 cursor-pointer"
          type="button"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Set Semua Hadir</span>
        </button>
      </section>

      {/* Search Bar */}
      <section id="search-student-bar" className="relative w-full">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#76777d] dark:text-slate-400">
          <Search className="w-4 h-4" />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari nama atau nomor absen siswa..."
          className="w-full h-11 pl-10 pr-10 rounded-2xl bg-white dark:bg-slate-800 text-[13px] text-[#0b1c30] dark:text-slate-100 placeholder-[#76777d] dark:placeholder-slate-500 border border-[#e2e8f0] dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#006398] shadow-sm transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#76777d] hover:text-[#0b1c30] dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </section>

      {/* Student Attendance List */}
      <section id="section-attendance-roster" className="flex flex-col gap-2.5">
        {students.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center text-[#45464d] dark:text-slate-400 border border-[#e2e8f0] dark:border-slate-700 flex flex-col items-center justify-center">
            <UserX className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-2" />
            <h4 className="text-[14px] font-bold text-[#0b1c30] dark:text-slate-100 mb-1">Belum Ada Data Siswa</h4>
            <p className="text-[12px] max-w-xs mb-3">Tambahkan data siswa kelas Anda terlebih dahulu untuk mencatat presensi harian.</p>
            <button
              onClick={() => setActiveTab('data-siswa')}
              className="h-10 px-4 rounded-xl bg-[#006398] hover:bg-[#004f7a] text-white text-[12px] font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <span>Buka Data Siswa</span>
            </button>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center text-[#45464d] dark:text-slate-400 border border-[#e2e8f0] dark:border-slate-700 flex flex-col items-center justify-center">
            <UserX className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-2" />
            <p className="text-[13px] font-medium">Tidak ada siswa yang sesuai filter.</p>
          </div>
        ) : (
          filteredStudents.map((student) => {
            const record = attendanceRecords[student.id];
            const currentStatus = record?.status || 'Hadir';

            return (
              <div
                key={student.id}
                id={`student-row-${student.id}`}
                className="bg-white dark:bg-slate-800 rounded-2xl p-3.5 shadow-sm border border-[#e2e8f0] dark:border-slate-700 flex flex-col gap-2.5 transition-all"
              >
                {/* Header: Photo, Name, NISN, Status Chip */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Photo with Absen Badge */}
                    <div className="relative shrink-0">
                      <img
                        alt={student.name}
                        className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        src={student.photo}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces';
                        }}
                      />
                      <span className="absolute -bottom-1 -left-1 px-1.5 py-0.2 bg-[#0b1c30] text-white text-[9px] font-bold rounded-md ring-1 ring-white">
                        {String(student.absen).padStart(2, '0')}
                      </span>
                    </div>

                    <div className="flex flex-col min-w-0">
                      <h4 className="font-display font-semibold text-[14px] text-[#0b1c30] dark:text-slate-100 truncate">
                        {student.name}
                      </h4>
                      <span className="text-[11px] text-[#45464d] dark:text-slate-400">
                        NISN: {student.nisn}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="shrink-0">
                    {currentStatus === 'Hadir' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Hadir
                      </span>
                    )}
                    {currentStatus === 'Sakit' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        Sakit
                      </span>
                    )}
                    {currentStatus === 'Izin' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7]"></span>
                        Izin
                      </span>
                    )}
                    {currentStatus === 'Alfa' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        Alfa
                      </span>
                    )}
                  </div>
                </div>

                {/* Sub-note/Attachment if present */}
                {record?.note && (
                  <div className="flex items-center justify-between text-[11px] bg-[#eff4ff] dark:bg-slate-900 px-2.5 py-1.5 rounded-lg text-[#0b1c30] dark:text-slate-300 border border-[#d3e4fe]/50 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 min-w-0 truncate">
                      <FileText className="w-4 h-4 text-[#006398] dark:text-sky-400 shrink-0" />
                      <span className="truncate">{record.note}</span>
                    </div>
                    {record.attachment && (
                      <span className="text-[#006398] dark:text-sky-400 font-semibold shrink-0 ml-1">
                        Terverifikasi ↗
                      </span>
                    )}
                  </div>
                )}

                {/* Segmented [H] [S] [I] [A] Buttons */}
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {/* Hadir Button */}
                  <button
                    onClick={() => handleStatusClick(student.id, 'Hadir')}
                    className={`h-10 rounded-xl font-display font-bold text-[14px] flex items-center justify-center transition-all cursor-pointer ${
                      currentStatus === 'Hadir'
                        ? 'bg-[#006398] text-white shadow-sm ring-2 ring-[#006398]/30'
                        : 'bg-[#f8f9ff] dark:bg-slate-700 text-[#45464d] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-650'
                    }`}
                    type="button"
                  >
                    H
                  </button>

                  {/* Sakit Button */}
                  <button
                    onClick={() => handleStatusClick(student.id, 'Sakit')}
                    className={`h-10 rounded-xl font-display font-bold text-[14px] flex items-center justify-center transition-all cursor-pointer ${
                      currentStatus === 'Sakit'
                        ? 'bg-[#ffddb8] dark:bg-amber-900/80 text-[#2a1700] dark:text-amber-100 shadow-sm ring-2 ring-amber-500/40'
                        : 'bg-[#f8f9ff] dark:bg-slate-700 text-[#45464d] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-650'
                    }`}
                    type="button"
                  >
                    S
                  </button>

                  {/* Izin Button */}
                  <button
                    onClick={() => handleStatusClick(student.id, 'Izin')}
                    className={`h-10 rounded-xl font-display font-bold text-[14px] flex items-center justify-center transition-all cursor-pointer ${
                      currentStatus === 'Izin'
                        ? 'bg-[#5bb8fe] dark:bg-sky-600 text-white shadow-sm ring-2 ring-sky-400/40'
                        : 'bg-[#f8f9ff] dark:bg-slate-700 text-[#45464d] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-650'
                    }`}
                    type="button"
                  >
                    I
                  </button>

                  {/* Alfa Button */}
                  <button
                    onClick={() => handleStatusClick(student.id, 'Alfa')}
                    className={`h-10 rounded-xl font-display font-bold text-[14px] flex items-center justify-center transition-all cursor-pointer ${
                      currentStatus === 'Alfa'
                        ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-500/40'
                        : 'bg-[#f8f9ff] dark:bg-slate-700 text-[#45464d] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-650'
                    }`}
                    type="button"
                  >
                    A
                  </button>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* Tren Kehadiran Pekan Ini Card */}
      <section
        id="card-attendance-trend"
        className="bg-white dark:bg-slate-800 rounded-2xl p-3.5 shadow-sm border border-[#e2e8f0] dark:border-slate-700 flex items-center justify-between gap-3 mt-1"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#eff4ff] dark:bg-slate-700 text-[#006398] dark:text-sky-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-semibold text-[13px] text-[#0b1c30] dark:text-slate-100">
              Tren Kehadiran Pekan Ini
            </span>
            <span className="text-[11px] text-[#45464d] dark:text-slate-400">
              Rata-rata 93.8% • Peringkat 2 Kelas Tertib
            </span>
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-[#76777d] dark:text-slate-400" />
      </section>

      {/* Floating Bottom Bar: Total Hadir & Kirim Laporan */}
      <div className="fixed bottom-16 inset-x-0 z-30 pointer-events-none">
        <div className="max-w-md mx-auto px-4 pb-2">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl p-3 shadow-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 pointer-events-auto">
            <div className="flex items-center gap-3">
              {/* Radial Percentage Indicator */}
              <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
                <svg className="w-11 h-11 transform -rotate-90">
                  <circle
                    cx="22"
                    cy="22"
                    r="18"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    className="text-slate-100 dark:text-slate-800"
                    fill="transparent"
                  />
                  <circle
                    cx="22"
                    cy="22"
                    r="18"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    className="text-[#006398] dark:text-sky-400"
                    strokeDasharray={113}
                    strokeDashoffset={113 - (113 * attendanceCounts.ratePercent) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute font-display font-bold text-[11px] text-[#0b1c30] dark:text-slate-100">
                  {Math.round(attendanceCounts.ratePercent)}%
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] text-[#45464d] dark:text-slate-400 uppercase font-semibold">
                  Total Hadir
                </span>
                <span className="font-display font-bold text-[14px] text-[#0b1c30] dark:text-slate-100">
                  {attendanceCounts.hadir}/{attendanceCounts.total} Siswa
                </span>
              </div>
            </div>

            <button
              onClick={() => setOpenExportModal(true)}
              className="h-11 px-5 rounded-xl bg-[#0b1c30] hover:bg-slate-800 dark:bg-sky-500 dark:hover:bg-sky-600 text-white font-semibold text-[13px] flex items-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer"
              type="button"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Laporan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Note/Keterangan Modal when tapping Sakit or Izin */}
      {noteModalStudentId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-sm w-full p-4 shadow-xl border border-slate-200 dark:border-slate-700 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-[15px] text-[#0b1c30] dark:text-slate-100">
                Catatan / Bukti Surat
              </h3>
              <button
                onClick={() => setNoteModalStudentId(null)}
                className="text-[#76777d] hover:text-[#0b1c30] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[12px] text-[#45464d] dark:text-slate-300">
              Tambahkan surat dokter, keterangan izin resmi, atau dispensasi kegiatan:
            </p>

            <textarea
              rows={3}
              value={tempNoteText}
              onChange={(e) => setTempNoteText(e.target.value)}
              placeholder="Contoh: Surat dokter terlampir (Demam 2 hari) atau Lomba Pramuka..."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-[13px] text-[#0b1c30] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#006398] bg-slate-50 dark:bg-slate-900"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setNoteModalStudentId(null)}
                className="px-3.5 py-2 rounded-xl text-[12px] font-semibold text-[#45464d] dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
              >
                Lewati
              </button>
              <button
                onClick={saveNoteAndClose}
                className="px-4 py-2 rounded-xl text-[12px] font-semibold bg-[#006398] text-white hover:bg-sky-700 cursor-pointer"
              >
                Simpan Catatan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
