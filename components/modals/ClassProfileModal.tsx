'use client';

import React, { useState, useEffect } from 'react';
import { useClass } from '@/context/ClassContext';
import {
  School,
  User,
  X,
  Save,
  RotateCcw,
  CheckCircle2,
  Mail,
  FileBadge,
  Layers,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { getCurrentAcademicYear } from '@/lib/dateUtils';
import PhotoUploadDropzone from '@/components/ui/PhotoUploadDropzone';

const TEACHER_AVATAR_PRESETS = [
  {
    label: 'Guru Berhijab',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUCVerHn8tk2JrXyIoA3re0jDuAj5vSIq1LyHt9GOz2yM3rrNiDfygefyREnxeHPbmfu7xZPUHpk6jkxeHX9wFNlW_j8m7usFaMWzMK6T5P5aPNai09_n0rJi4QxEz-vIFah2u2g6WMvPkGraWnwIMWP3zacA33EJzeKlYEHkztzxL6cyEIVEapOySEUUaBEJhyBsO61WfrU3fRtT08VbNuRR1_eb-XJLtnCSvKlt-aMD7yNIJFSiSAw',
  },
  {
    label: 'Guru Pria Formal',
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces',
  },
  {
    label: 'Guru Wanita Formal',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces',
  },
  {
    label: 'Guru Pria Kacamata',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
  },
];

function ClassProfileFormContent({ onClose }: { onClose: () => void }) {
  const {
    currentUser,
    updateTeacherProfile,
    triggerConfetti,
  } = useClass();

  const [name, setName] = useState(currentUser?.name || '');
  const [nip, setNip] = useState(currentUser?.nip || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [role, setRole] = useState<'Wali Kelas' | 'Guru BK' | 'Kepala Sekolah'>(currentUser?.role || 'Wali Kelas');
  const [className, setClassName] = useState(currentUser?.className || 'Kelas VII-A');
  const [schoolName, setSchoolName] = useState(currentUser?.schoolName || 'SMP Negeri 1');
  const [academicYear, setAcademicYear] = useState(currentUser?.academicYear || getCurrentAcademicYear());
  const [semester, setSemester] = useState(currentUser?.semester || 'Genap');
  const [avatar, setAvatar] = useState(currentUser?.avatar || TEACHER_AVATAR_PRESETS[0].url);
  const [successToast, setSuccessToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTeacherProfile({
      name: name.trim() || 'Wali Kelas',
      nip: nip.trim() || '-',
      email: email.trim() || 'guru@sekolah.sch.id',
      role,
      className: className.trim() || 'Kelas VII-A',
      schoolName: schoolName.trim() || 'SMP Negeri 1',
      academicYear,
      semester,
      avatar,
    });

    triggerConfetti();
    setSuccessToast(true);
    setTimeout(() => {
      setSuccessToast(false);
      onClose();
    }, 900);
  };

  const handleReset = () => {
    if (currentUser) {
      setName(currentUser.name);
      setNip(currentUser.nip);
      setEmail(currentUser.email);
      setRole(currentUser.role);
      setClassName(currentUser.className);
      setSchoolName(currentUser.schoolName);
      setAcademicYear(currentUser.academicYear || getCurrentAcademicYear());
      setSemester(currentUser.semester || 'Genap');
      setAvatar(currentUser.avatar);
    }
  };

  return (
    <div
      id="modal-class-profile-container"
      className="relative w-full max-w-lg max-h-[90vh] bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200"
    >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#006398]/10 text-[#006398] dark:bg-sky-500/20 dark:text-sky-400 flex items-center justify-center">
              <School className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-[16px] text-[#0b1c30] dark:text-slate-100">
                Pengaturan Akun Wali & Identitas Kelas
              </h3>
              <p className="text-[12px] text-[#45464d] dark:text-slate-400">
                Sesuaikan nama guru, NIP, sekolah, dan kelas sesungguhnya
              </p>
            </div>
          </div>
          <button
            id="btn-close-class-profile"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 space-y-4 max-h-[calc(90vh-140px)]">
          {successToast && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-[13px] text-emerald-800 dark:text-emerald-300 font-semibold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>Profil Wali Kelas & Identitas Kelas berhasil diperbarui!</span>
            </div>
          )}

          {/* Section: Identitas Wali Kelas */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#45464d] dark:text-slate-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Data Profil Guru / Wali Kelas
              </h4>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#0b1c30] dark:text-slate-200 mb-1">
                Nama Lengkap & Gelar *
              </label>
              <input
                id="input-teacher-name"
                type="text"
                placeholder="Contoh: Budi Santoso, S.Pd., M.Si."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[14px] font-medium text-[#0b1c30] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#006398]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-semibold text-[#0b1c30] dark:text-slate-200 mb-1">
                  NIP / NUPTK
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <FileBadge className="w-3.5 h-3.5" />
                  </span>
                  <input
                    id="input-teacher-nip"
                    type="text"
                    placeholder="19850412 201001 1 012"
                    value={nip}
                    onChange={(e) => setNip(e.target.value)}
                    className="w-full h-11 pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] text-[#0b1c30] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#006398]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#0b1c30] dark:text-slate-200 mb-1">
                  Peran / Jabatan
                </label>
                <select
                  id="select-teacher-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] font-semibold text-[#0b1c30] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#006398]"
                >
                  <option value="Wali Kelas">Wali Kelas</option>
                  <option value="Guru BK">Guru BK (Bimbingan Konseling)</option>
                  <option value="Kepala Sekolah">Kepala Sekolah</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#0b1c30] dark:text-slate-200 mb-1">
                Email Kedinasan
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-3.5 h-3.5" />
                </span>
                <input
                  id="input-teacher-email"
                  type="email"
                  placeholder="budi.santoso@sekolah.sch.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] text-[#0b1c30] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#006398]"
                />
              </div>
            </div>

            {/* Foto Profil Guru Sesungguhnya */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <PhotoUploadDropzone
                id="uploader-teacher-photo"
                value={avatar}
                onChange={(newUrl) => setAvatar(newUrl)}
                onClear={() => setAvatar(TEACHER_AVATAR_PRESETS[0].url)}
                label="Foto Profil Guru / Wali Kelas Sesungguhnya"
                sublabel="Unggah foto formal guru Anda atau pilih avatar preset di bawah"
                presets={TEACHER_AVATAR_PRESETS}
                shape="circle"
              />
            </div>
          </div>

          {/* Section: Identitas Kelas & Lembaga */}
          <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#45464d] dark:text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Identitas Kelas & Satuan Pendidikan
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-semibold text-[#0b1c30] dark:text-slate-200 mb-1">
                  Nama Kelas *
                </label>
                <input
                  id="input-class-name"
                  type="text"
                  placeholder="Contoh: Kelas IX-B / 8A / X-MIPA"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  required
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[14px] font-bold text-[#0b1c30] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#006398]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#0b1c30] dark:text-slate-200 mb-1">
                  Nama Sekolah / Madrasah *
                </label>
                <input
                  id="input-school-name"
                  type="text"
                  placeholder="Contoh: SMP Negeri 1 Balikpapan"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  required
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[14px] font-medium text-[#0b1c30] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#006398]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-semibold text-[#0b1c30] dark:text-slate-200 mb-1">
                  Tahun Pelajaran
                </label>
                <input
                  id="input-academic-year"
                  type="text"
                  placeholder={getCurrentAcademicYear()}
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] text-[#0b1c30] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#006398]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#0b1c30] dark:text-slate-200 mb-1">
                  Semester
                </label>
                <select
                  id="select-semester"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] font-medium text-[#0b1c30] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#006398]"
                >
                  <option value="Ganjil">Semester Ganjil</option>
                  <option value="Genap">Semester Genap</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              id="btn-reset-teacher-profile"
              onClick={handleReset}
              className="h-11 px-3 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-[12px] font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Kembalikan isian formulir ke data saat ini"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Form
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="h-11 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-[13px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                id="btn-save-class-profile"
                className="h-11 px-5 rounded-xl bg-[#006398] hover:bg-[#004f7a] text-white text-[13px] font-bold shadow-md hover:shadow-lg flex items-center gap-2 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Simpan Perubahan
              </button>
            </div>
          </div>
        </form>
      </div>
  );
}

export default function ClassProfileModal() {
  const { openEditClassModal, setOpenEditClassModal, currentUser } = useClass();

  if (!openEditClassModal) return null;

  return (
    <div
      id="modal-class-profile-backdrop"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200"
    >
      <ClassProfileFormContent
        key={`${currentUser?.email || currentUser?.name || 'profile'}-${currentUser?.className || 'class'}`}
        onClose={() => setOpenEditClassModal(false)}
      />
    </div>
  );
}
