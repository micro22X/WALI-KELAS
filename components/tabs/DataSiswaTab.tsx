'use client';

import React, { useState, useMemo } from 'react';
import { useClass } from '@/context/ClassContext';
import { Student } from '@/types';
import {
  Users,
  Search,
  ArrowUpDown,
  BadgeCheck,
  Sparkles,
  TrendingUp,
  CalendarCheck,
  Trophy,
  HeartHandshake,
  MessageSquare,
  Phone,
  Download,
  UserPlus,
  Pencil,
  Settings,
  School,
  RotateCcw,
  Camera,
  CheckCircle2,
  Trash2,
  UserX,
} from 'lucide-react';
import { compressAndResizeImage } from '@/lib/imageUtils';

export default function DataSiswaTab() {
  const {
    students,
    selectedStudent,
    setSelectedStudent,
    setOpenExportModal,
    setOpenAddStudentModal,
    setEditingStudent,
    setOpenEditClassModal,
    clearAllStudents,
    currentUser,
    updateStudentPhoto,
    triggerConfetti,
  } = useClass();

  const [photoTargetStudentId, setPhotoTargetStudentId] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoUploadSuccess, setPhotoUploadSuccess] = useState<string | null>(null);

  const [subTab, setSubTab] = useState<'daftar' | 'nilai' | 'ranking'>('daftar');
  const [sortOption, setSortOption] = useState<'absen' | 'nilai' | 'presensi'>('absen');
  const [searchQuery, setSearchQuery] = useState('');

  // Active student featured in the top card
  const activeStudent: Student | null = selectedStudent || students[0] || null;

  const triggerPhotoUpload = (studentId: string) => {
    setPhotoTargetStudentId(studentId);
    if (typeof document !== 'undefined') {
      const input = document.getElementById('student-photo-file-input') as HTMLInputElement | null;
      input?.click();
    }
  };

  const handleStudentPhotoSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !photoTargetStudentId) return;

    try {
      setIsUploadingPhoto(true);
      const result = await compressAndResizeImage(file, 480, 480, 0.84);
      await updateStudentPhoto(photoTargetStudentId, result.dataUrl);
      triggerConfetti();
      const target = students.find((s) => s.id === photoTargetStudentId);
      setPhotoUploadSuccess(`Foto ${target ? target.name : 'siswa'} berhasil diperbarui!`);
      setTimeout(() => setPhotoUploadSuccess(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Gagal memperbarui foto siswa.');
    } finally {
      setIsUploadingPhoto(false);
      setPhotoTargetStudentId(null);
      if (e.target) e.target.value = '';
    }
  };

  const maleCount = useMemo(() => students.filter((s) => s.gender === 'L').length, [students]);
  const femaleCount = useMemo(() => students.filter((s) => s.gender === 'P').length, [students]);

  // Sort and filter logic
  const sortedStudents = useMemo(() => {
    const list = [...students];

    // Sorting
    if (sortOption === 'absen') {
      list.sort((a, b) => a.absen - b.absen);
    } else if (sortOption === 'nilai') {
      list.sort((a, b) => b.averageScore - a.averageScore);
    } else if (sortOption === 'presensi') {
      list.sort((a, b) => a.attendanceRate - b.attendanceRate);
    }

    // Searching
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.nisn.includes(q) ||
          String(s.absen).padStart(2, '0').includes(q)
      );
    }

    return list;
  }, [students, sortOption, searchQuery]);

  const handleWhatsAppParent = (phone: string, studentName: string) => {
    const roleLabel = currentUser?.role || 'Wali Kelas';
    const classLabel = currentUser?.className ? ` ${currentUser.className}` : '';
    const schoolLabel = currentUser?.schoolName ? ` ${currentUser.schoolName}` : '';
    const text = encodeURIComponent(
      `Assalamu'alaikum Warahmatullahi Wabarakatuh.\nSelamat pagi Bapak/Ibu wali murid ananda ${studentName}. Kami dari ${roleLabel}${classLabel}${schoolLabel} ingin menyampaikan laporan capaian belajar dan kehadiran ananda semester ini. Terima kasih.`
    );
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="flex flex-col w-full gap-3.5 pb-24">
      {/* Top Header Stats & Sub-tabs */}
      <section
        id="section-students-header"
        className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-[#e2e8f0] dark:border-slate-700 flex flex-col gap-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#006398] dark:text-sky-400" />
            <h2 className="font-display font-bold text-[16px] text-[#0b1c30] dark:text-slate-100">
              {students.length} Siswa Aktif
            </h2>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#45464d] dark:text-slate-300 font-medium">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              {maleCount} Putra
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-pink-500"></span>
              {femaleCount} Putri
            </span>
          </div>
        </div>

        {/* Sub-tabs pills */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#eff4ff] dark:bg-slate-900 rounded-xl">
          <button
            onClick={() => setSubTab('daftar')}
            className={`py-1.5 text-[12px] font-semibold rounded-lg transition-all cursor-pointer ${
              subTab === 'daftar'
                ? 'bg-white dark:bg-slate-800 text-[#0b1c30] dark:text-slate-100 shadow-sm'
                : 'text-[#45464d] dark:text-slate-400 hover:text-[#0b1c30]'
            }`}
          >
            Daftar Siswa
          </button>
          <button
            onClick={() => setSubTab('nilai')}
            className={`py-1.5 text-[12px] font-semibold rounded-lg transition-all cursor-pointer ${
              subTab === 'nilai'
                ? 'bg-white dark:bg-slate-800 text-[#0b1c30] dark:text-slate-100 shadow-sm'
                : 'text-[#45464d] dark:text-slate-400 hover:text-[#0b1c30]'
            }`}
          >
            Rekap Nilai
          </button>
          <button
            onClick={() => setSubTab('ranking')}
            className={`py-1.5 text-[12px] font-semibold rounded-lg transition-all cursor-pointer ${
              subTab === 'ranking'
                ? 'bg-white dark:bg-slate-800 text-[#0b1c30] dark:text-slate-100 shadow-sm'
                : 'text-[#45464d] dark:text-slate-400 hover:text-[#0b1c30]'
            }`}
          >
            Ranking Kelas
          </button>
        </div>

        {/* Action Toolbar: Tambah Siswa & Kelola Kelas Sesungguhnya */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-700/60">
          <button
            id="btn-add-student-modal-top"
            onClick={() => {
              setEditingStudent(null);
              setOpenAddStudentModal(true);
            }}
            className="flex-1 h-9 px-3 rounded-xl bg-[#006398] hover:bg-[#004f7a] text-white text-[12px] font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Tambah Siswa</span>
          </button>

          <button
            id="btn-edit-class-profile-top"
            onClick={() => setOpenEditClassModal(true)}
            className="h-9 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-[#0b1c30] dark:text-slate-200 text-[12px] font-semibold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            title="Ubah Profil Wali Kelas & Identitas Kelas"
          >
            <Settings className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Atur Kelas &amp; Wali</span>
          </button>

          {students.length > 0 && (
            <button
              id="btn-clear-all-students"
              onClick={() => {
                if (window.confirm('Kosongkan seluruh data murid di kelas ini? Anda dapat menambahkan data siswa baru kapan saja.')) {
                  clearAllStudents();
                }
              }}
              className="h-9 px-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center gap-1 text-[11px] font-semibold border border-rose-200 dark:border-rose-900/60 transition-colors cursor-pointer"
              title="Kosongkan Data Siswa"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kosongkan</span>
            </button>
          )}
        </div>
      </section>

      {/* Search & Sort Pills */}
      <section id="section-search-sort" className="flex flex-col gap-2">
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#76777d] dark:text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama siswa atau NISN..."
            className="w-full h-11 pl-10 pr-4 rounded-2xl bg-white dark:bg-slate-800 text-[13px] text-[#0b1c30] dark:text-slate-100 placeholder-[#76777d] dark:placeholder-slate-500 border border-[#e2e8f0] dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#006398] shadow-sm"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-[11px]">
          <span className="text-[#45464d] dark:text-slate-400 flex items-center gap-1 shrink-0 font-medium">
            <ArrowUpDown className="w-3.5 h-3.5" />
            Urutkan:
          </span>
          <button
            onClick={() => setSortOption('absen')}
            className={`px-3 py-1 rounded-full font-semibold shrink-0 transition-all cursor-pointer ${
              sortOption === 'absen'
                ? 'bg-[#006398] text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-[#45464d] dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            No. Absen
          </button>
          <button
            onClick={() => setSortOption('nilai')}
            className={`px-3 py-1 rounded-full font-semibold shrink-0 transition-all cursor-pointer ${
              sortOption === 'nilai'
                ? 'bg-[#006398] text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-[#45464d] dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            Nilai Tertinggi
          </button>
          <button
            onClick={() => setSortOption('presensi')}
            className={`px-3 py-1 rounded-full font-semibold shrink-0 transition-all cursor-pointer ${
              sortOption === 'presensi'
                ? 'bg-[#006398] text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-[#45464d] dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            Presensi Rendah
          </button>
        </div>
      </section>

      {/* Hidden file input for uploading real student photo */}
      <input
        id="student-photo-file-input"
        type="file"
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        onChange={handleStudentPhotoSelected}
      />

      {/* Success Toast */}
      {photoUploadSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-[12px] font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{photoUploadSuccess}</span>
        </div>
      )}

      {/* Active / Featured Student Detail Card */}
      {activeStudent && (
        <section
          id="card-featured-student"
          className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-[#e2e8f0] dark:border-slate-700 flex flex-col gap-3.5"
        >
          {/* Header row: Photo, Name, Verified, Role */}
          <div className="flex items-start gap-3">
            <div
              className="relative shrink-0 group cursor-pointer"
              onClick={() => triggerPhotoUpload(activeStudent.id)}
              title="Klik untuk mengganti foto siswa sesungguhnya"
            >
              <img
                alt={activeStudent.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#006398]/30 dark:ring-sky-500/30 shadow-sm group-hover:opacity-90 transition-opacity"
                src={activeStudent.photo}
              />
              <button
                type="button"
                className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity cursor-pointer"
              >
                <Camera className="w-4 h-4 mb-0.5" />
                <span className="text-[8px] font-bold">Ganti Foto</span>
              </button>
              <span className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 bg-[#006398] text-white text-[10px] font-bold rounded-lg shadow-sm">
                #{activeStudent.absen}
              </span>
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <h3 className="font-display font-bold text-[16px] text-[#0b1c30] dark:text-slate-100 truncate">
                    {activeStudent.name}
                  </h3>
                  <BadgeCheck className="w-5 h-5 text-[#006398] dark:text-sky-400 shrink-0" />
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    id="btn-upload-photo-student"
                    onClick={() => triggerPhotoUpload(activeStudent.id)}
                    className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/60 dark:hover:bg-sky-900 text-[#006398] dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Camera className="w-3 h-3" />
                    <span>
                      {isUploadingPhoto && photoTargetStudentId === activeStudent.id
                        ? 'Mengompres...'
                        : 'Ganti Foto'}
                    </span>
                  </button>
                  <button
                    type="button"
                    id="btn-edit-active-student"
                    onClick={() => {
                      setEditingStudent(activeStudent);
                      setOpenAddStudentModal(true);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-750 dark:hover:bg-slate-700 text-[#006398] dark:text-sky-300 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Pencil className="w-3 h-3" />
                    <span>Edit Data</span>
                  </button>
                </div>
              </div>
              <p className="text-[12px] text-[#45464d] dark:text-slate-400">
                NISN: {activeStudent.nisn} • Absen {activeStudent.absen}
              </p>

              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                {activeStudent.role && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
                    <Sparkles className="w-3.5 h-3.5" />
                    {activeStudent.role}
                  </span>
                )}
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#eff4ff] dark:bg-slate-700 text-[#006398] dark:text-sky-300">
                  Semester Genap
                </span>
              </div>
            </div>
          </div>

          {/* Metric Quad / Twin Boxes */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Box 1: Rapor */}
            <div className="p-3 rounded-xl bg-[#eff4ff] dark:bg-slate-900 border border-[#d3e4fe]/60 dark:border-slate-800 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-semibold text-[#45464d] dark:text-slate-400">
                  Rata-rata Rapor
                </span>
                <span className="font-display font-bold text-[22px] text-[#0b1c30] dark:text-slate-100">
                  {activeStudent.averageScore}
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {activeStudent.utsDiff}
                </span>
              </div>

              {/* Grade Ring */}
              <div className="w-11 h-11 rounded-full border-2 border-[#006398] dark:border-sky-400 flex items-center justify-center font-display font-bold text-[16px] text-[#006398] dark:text-sky-400 shadow-sm bg-white dark:bg-slate-800">
                {activeStudent.grade}
              </div>
            </div>

            {/* Box 2: Presensi */}
            <div className="p-3 rounded-xl bg-[#eff4ff] dark:bg-slate-900 border border-[#d3e4fe]/60 dark:border-slate-800 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-semibold text-[#45464d] dark:text-slate-400">
                  Presensi Kelas
                </span>
                <span className="font-display font-bold text-[22px] text-[#0b1c30] dark:text-slate-100">
                  {activeStudent.attendanceRate}%
                </span>
                <span className="text-[11px] text-[#45464d] dark:text-slate-400 truncate">
                  {activeStudent.totalHadir}H • {activeStudent.totalSakit}S • {activeStudent.totalAlfa}A
                </span>
              </div>

              <div className="w-11 h-11 rounded-full bg-[#cce5ff] dark:bg-sky-950 flex items-center justify-center text-[#006398] dark:text-sky-300">
                <CalendarCheck className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Rincian Mata Pelajaran Utama */}
          <div className="flex flex-col gap-2 pt-1">
            <div className="flex items-center justify-between">
              <h4 className="font-display font-semibold text-[13px] text-[#0b1c30] dark:text-slate-100">
                Rincian Mata Pelajaran Utama
              </h4>
              <button className="text-[11px] text-[#006398] dark:text-sky-400 font-semibold hover:underline cursor-pointer">
                Semua Mapel ↗
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {activeStudent.subjects.map((sub, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#45464d] dark:text-slate-400 truncate">{sub.name}</span>
                    <span className="font-bold text-[#0b1c30] dark:text-slate-100">{sub.score}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#006398] dark:bg-sky-500 rounded-full"
                      style={{ width: `${Math.min(100, sub.score)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Poin Sikap & Catatan Prestasi */}
          <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-600" />
                Poin Sikap &amp; Catatan Prestasi
              </span>
              <span className="font-bold text-amber-700 dark:text-amber-300">
                +{activeStudent.meritPoints} Poin Positif
              </span>
            </div>
            <p className="text-[11px] text-amber-950 dark:text-amber-200/90 leading-relaxed">
              {activeStudent.achievements[0] || 'Berperilaku disiplin dan aktif dalam kegiatan kelas.'}
            </p>
          </div>

          {/* Wali Murid Contact Card */}
          <div className="p-3 rounded-xl bg-[#eff4ff] dark:bg-slate-900 border border-[#d3e4fe]/60 dark:border-slate-800 flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-[#006398] dark:text-sky-400" />
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-[12px] text-[#0b1c30] dark:text-slate-100 truncate">
                  {activeStudent.parentName}
                </span>
                <span className="text-[11px] text-[#45464d] dark:text-slate-400">
                  {activeStudent.parentRelation} • {activeStudent.parentPhone}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => handleWhatsAppParent(activeStudent.parentPhone, activeStudent.name)}
                className="h-9 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Ortu</span>
              </button>
              <button
                onClick={() => window.open(`tel:${activeStudent.parentPhone}`, '_self')}
                className="h-9 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0b1c30] dark:text-slate-200 hover:bg-slate-50 font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Hubungi</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Class Member Roster List */}
      <section id="section-class-members" className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-display font-semibold text-[15px] text-[#0b1c30] dark:text-slate-100">
            Daftar Anggota Kelas
          </h3>
          <span className="text-[11px] text-[#45464d] dark:text-slate-400">
            Menampilkan {sortedStudents.length} dari {students.length}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {sortedStudents.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center text-slate-500 dark:text-slate-400 border border-[#e2e8f0] dark:border-slate-700 flex flex-col items-center justify-center">
              <UserX className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-2" />
              <h4 className="text-[14px] font-bold text-[#0b1c30] dark:text-slate-100 mb-1">
                {searchQuery ? 'Tidak Ada Siswa Sesuai Pencarian' : 'Belum Ada Data Siswa'}
              </h4>
              <p className="text-[12px] max-w-xs mb-3">
                {searchQuery
                  ? 'Coba gunakan kata kunci pencarian lain.'
                  : 'Mulai dengan menambahkan data murid pertama kelas Anda.'}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => {
                    setEditingStudent(null);
                    setOpenAddStudentModal(true);
                  }}
                  className="h-10 px-4 rounded-xl bg-[#006398] hover:bg-[#004f7a] text-white text-[12px] font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Tambah Siswa Baru</span>
                </button>
              )}
            </div>
          ) : (
            sortedStudents.map((s) => {
              const isSelected = activeStudent?.id === s.id;
              return (
              <div
                key={s.id}
                onClick={() => setSelectedStudent(s)}
                className={`p-3 rounded-2xl bg-white dark:bg-slate-800 border transition-all cursor-pointer flex items-center justify-between gap-2 shadow-sm ${
                  isSelected
                    ? 'border-[#006398] dark:border-sky-500 ring-2 ring-[#006398]/20'
                    : 'border-[#e2e8f0] dark:border-slate-700 hover:border-sky-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-display font-bold text-[14px] text-[#76777d] dark:text-slate-400 w-5 text-center shrink-0">
                    {String(s.absen).padStart(2, '0')}
                  </span>

                  <div
                    className="relative group shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerPhotoUpload(s.id);
                    }}
                    title="Klik untuk mengganti foto siswa ini"
                  >
                    <img
                      alt={s.name}
                      className="w-10 h-10 rounded-xl object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700 group-hover:ring-2 group-hover:ring-[#006398] transition-all"
                      src={s.photo}
                    />
                    <div className="absolute inset-0 bg-black/45 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                      <Camera className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="flex flex-col min-w-0">
                    <span className="font-display font-semibold text-[13px] text-[#0b1c30] dark:text-slate-100 truncate">
                      {s.name}
                    </span>
                    <span className="text-[11px] text-[#45464d] dark:text-slate-400">
                      NISN: {s.nisn} • {s.totalHadir} Hadir
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex flex-col items-end">
                    <span className="font-display font-bold text-[15px] text-[#006398] dark:text-sky-400">
                      {s.averageScore}
                    </span>
                    <span className="text-[10px] text-[#45464d] dark:text-slate-400 flex items-center gap-1">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          s.needsAttention ? 'bg-rose-500' : 'bg-emerald-500'
                        }`}
                      />
                      {s.needsAttention ? 'Perlu BK' : `${s.attendanceRate}% Hadir`}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingStudent(s);
                      setOpenAddStudentModal(true);
                    }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#006398] dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    title={`Edit Data ${s.name}`}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          }))}
        </div>
      </section>

      {/* Bottom Bar: Unduh Ledger & Tambah Siswa */}
      <div className="flex items-center gap-2 pt-2">
        <button
          onClick={() => setOpenExportModal(true)}
          className="flex-1 h-12 rounded-2xl bg-[#eff4ff] hover:bg-[#dce9ff] dark:bg-slate-800 dark:hover:bg-slate-750 text-[#006398] dark:text-sky-300 font-display font-semibold text-[13px] flex items-center justify-center gap-2 border border-[#d3e4fe] dark:border-slate-700 transition-colors shadow-sm cursor-pointer"
        >
          <Download className="w-5 h-5" />
          <span>Unduh Ledger Rapor</span>
        </button>

        <button
          id="btn-bottom-add-student"
          onClick={() => {
            setEditingStudent(null);
            setOpenAddStudentModal(true);
          }}
          className="h-12 w-12 rounded-2xl bg-[#006398] hover:bg-[#004f7a] text-white flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer"
          title="Tambah Siswa Baru"
        >
          <UserPlus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
