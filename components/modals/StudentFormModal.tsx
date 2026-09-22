'use client';

import React, { useState, useEffect } from 'react';
import { useClass } from '@/context/ClassContext';
import { Student } from '@/types';
import {
  UserPlus,
  UserCheck,
  X,
  Save,
  Trash2,
  AlertCircle,
  Sparkles,
  Phone,
  Home,
  Award,
  BookOpen,
} from 'lucide-react';
import PhotoUploadDropzone from '@/components/ui/PhotoUploadDropzone';

const AVATAR_PRESETS = [
  {
    label: 'Putra 1',
    gender: 'L',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=faces',
  },
  {
    label: 'Putra 2',
    gender: 'L',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&h=200&fit=crop&crop=faces',
  },
  {
    label: 'Putra 3',
    gender: 'L',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=faces',
  },
  {
    label: 'Putri 1',
    gender: 'P',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
  },
  {
    label: 'Putri 2',
    gender: 'P',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=faces',
  },
  {
    label: 'Putri 3',
    gender: 'P',
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop&crop=faces',
  },
];

function StudentFormContent({
  student,
  onClose,
}: {
  student: Student | null;
  onClose: () => void;
}) {
  const {
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    triggerConfetti,
  } = useClass();

  const isEditing = Boolean(student);

  // Suggest next absen number
  const nextAbsen = students.length > 0 ? Math.max(...students.map((s) => s.absen)) + 1 : 1;

  // Form states
  const [absen, setAbsen] = useState<number>(student ? student.absen : nextAbsen);
  const [name, setName] = useState(student?.name || '');
  const [nisn, setNisn] = useState(student?.nisn || '');
  const [gender, setGender] = useState<'L' | 'P'>(student?.gender || 'L');
  const [phone, setPhone] = useState(student?.phone || '');
  const [parentName, setParentName] = useState(student?.parentName || '');
  const [parentRelation, setParentRelation] = useState(student?.parentRelation || 'Ayah Kandung');
  const [parentPhone, setParentPhone] = useState(student?.parentPhone || '');
  const [address, setAddress] = useState(student?.address || '');
  const [role, setRole] = useState(student?.role || '');
  const [averageScore, setAverageScore] = useState<number>(student?.averageScore || 80);
  const [photo, setPhoto] = useState(student?.photo || AVATAR_PRESETS[0].url);
  const [notes, setNotes] = useState(student?.notes || '');
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Nama siswa wajib diisi');
      return;
    }
    if (!nisn.trim()) {
      setErrorMessage('Nomor NISN wajib diisi');
      return;
    }

    if (isEditing && student) {
      const updated: Student = {
        ...student,
        absen: Number(absen),
        name: name.trim(),
        nisn: nisn.trim(),
        gender,
        phone: phone.trim() || '+62 812-0000-0000',
        parentName: parentName.trim() || 'Orang Tua / Wali',
        parentRelation,
        parentPhone: parentPhone.trim() || phone.trim() || '+62 812-0000-0000',
        address: address.trim() || 'Alamat Tempat Tinggal',
        role: role.trim() || undefined,
        averageScore: Number(averageScore) || 80,
        photo,
        notes: notes.trim() || undefined,
      };
      await updateStudent(updated);
    } else {
      await addStudent({
        absen: Number(absen),
        name: name.trim(),
        nisn: nisn.trim(),
        gender,
        phone: phone.trim() || '+62 812-0000-0000',
        parentName: parentName.trim() || 'Orang Tua / Wali',
        parentRelation,
        parentPhone: parentPhone.trim() || phone.trim() || '+62 812-0000-0000',
        address: address.trim() || 'Alamat Tempat Tinggal',
        role: role.trim() || undefined,
        averageScore: Number(averageScore) || 80,
        grade: averageScore >= 90 ? 'A' : averageScore >= 80 ? 'B' : averageScore >= 70 ? 'C' : 'D',
        utsDiff: '+0.0',
        photo,
        notes: notes.trim() || undefined,
      });
      triggerConfetti();
    }

    onClose();
  };

  const handleDelete = async () => {
    if (!student) return;
    await deleteStudent(student.id);
    onClose();
  };

  return (
    <div
      id="modal-student-form-container"
      className="relative w-full max-w-lg max-h-[90vh] bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200"
    >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#006398]/10 text-[#006398] dark:bg-sky-500/20 dark:text-sky-400 flex items-center justify-center">
              {isEditing ? <UserCheck className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-display font-bold text-[16px] text-[#0b1c30] dark:text-slate-100">
                {isEditing ? 'Edit Data Siswa' : 'Tambah Siswa Sesungguhnya'}
              </h3>
              <p className="text-[12px] text-[#45464d] dark:text-slate-400">
                {isEditing ? 'Perbarui identitas & kontak siswa' : 'Tambahkan siswa riil ke dalam kelas'}
              </p>
            </div>
          </div>
          <button
            id="btn-close-student-form"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 space-y-4 max-h-[calc(90vh-140px)]">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 flex items-center gap-2 text-[13px] text-red-700 dark:text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section: Identitas Pokok */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#45464d] dark:text-slate-400">
              Identitas Pokok Siswa
            </h4>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="block text-[12px] font-semibold text-[#0b1c30] dark:text-slate-200 mb-1">
                  No. Absen *
                </label>
                <input
                  id="input-student-absen"
                  type="number"
                  min={1}
                  max={60}
                  value={absen}
                  onChange={(e) => setAbsen(Number(e.target.value))}
                  required
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[14px] font-bold text-[#0b1c30] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#006398]"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[12px] font-semibold text-[#0b1c30] dark:text-slate-200 mb-1">
                  NISN Siswa *
                </label>
                <input
                  id="input-student-nisn"
                  type="text"
                  placeholder="Contoh: 0089214732"
                  value={nisn}
                  onChange={(e) => setNisn(e.target.value)}
                  required
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[14px] text-[#0b1c30] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#006398]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#0b1c30] dark:text-slate-200 mb-1">
                Nama Lengkap Siswa *
              </label>
              <input
                id="input-student-name"
                type="text"
                placeholder="Contoh: Muhammad Rayhan Ramadhan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[14px] font-medium text-[#0b1c30] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#006398]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-semibold text-[#0b1c30] dark:text-slate-200 mb-1">
                  Jenis Kelamin
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setGender('L');
                      if (!isEditing) setPhoto(AVATAR_PRESETS[0].url);
                    }}
                    className={`h-11 rounded-xl text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      gender === 'L'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-blue-300"></span>
                    Putra (L)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setGender('P');
                      if (!isEditing) setPhoto(AVATAR_PRESETS[3].url);
                    }}
                    className={`h-11 rounded-xl text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      gender === 'P'
                        ? 'bg-pink-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-pink-300"></span>
                    Putri (P)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#0b1c30] dark:text-slate-200 mb-1">
                  Jabatan di Kelas
                </label>
                <select
                  id="select-student-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] text-[#0b1c30] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#006398]"
                >
                  <option value="">Anggota Kelas</option>
                  <option value="Ketua Kelas">Ketua Kelas</option>
                  <option value="Wakil Ketua Kelas">Wakil Ketua Kelas</option>
                  <option value="Sekretaris I">Sekretaris I</option>
                  <option value="Sekretaris II">Sekretaris II</option>
                  <option value="Bendahara I">Bendahara I</option>
                  <option value="Bendahara II">Bendahara II</option>
                  <option value="Sie Kerohanian">Sie Kerohanian</option>
                  <option value="Sie Kebersihan">Sie Kebersihan</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Foto Murid Sesungguhnya */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <PhotoUploadDropzone
              id="uploader-student-photo"
              value={photo}
              onChange={(newUrl) => setPhoto(newUrl)}
              onClear={() =>
                setPhoto(
                  gender === 'P'
                    ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces'
                    : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=faces'
                )
              }
              label="Foto Profil Murid Sesungguhnya"
              sublabel="Unggah pas foto siswa asli dari perangkat/kamera atau pilih avatar contoh"
              presets={AVATAR_PRESETS.filter((p) => p.gender === gender)}
              shape="rounded"
            />
          </div>

          {/* Section: Kontak & Orang Tua */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#45464d] dark:text-slate-400">
              Kontak & Orang Tua / Wali
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-semibold text-[#0b1c30] dark:text-slate-200 mb-1">
                  Nama Orang Tua / Wali
                </label>
                <input
                  id="input-parent-name"
                  type="text"
                  placeholder="Contoh: Bpk. Bambang"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] text-[#0b1c30] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#006398]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#0b1c30] dark:text-slate-200 mb-1">
                  Hubungan
                </label>
                <select
                  id="select-parent-relation"
                  value={parentRelation}
                  onChange={(e) => setParentRelation(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] text-[#0b1c30] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#006398]"
                >
                  <option value="Ayah Kandung">Ayah Kandung</option>
                  <option value="Ibu Kandung">Ibu Kandung</option>
                  <option value="Wali Siswa">Wali Siswa</option>
                  <option value="Keluarga">Keluarga</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-semibold text-[#0b1c30] dark:text-slate-200 mb-1">
                  WhatsApp Orang Tua (Wajib untuk Pesan)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-3.5 h-3.5" />
                  </span>
                  <input
                    id="input-parent-phone"
                    type="tel"
                    placeholder="+62 812-3456-7890"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    className="w-full h-11 pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] text-[#0b1c30] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#006398]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#0b1c30] dark:text-slate-200 mb-1">
                  Nilai Rapor Rata-rata
                </label>
                <input
                  id="input-student-score"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={averageScore}
                  onChange={(e) => setAverageScore(Number(e.target.value))}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] text-[#0b1c30] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#006398]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#0b1c30] dark:text-slate-200 mb-1">
                Alamat Tinggal Siswa
              </label>
              <input
                id="input-student-address"
                type="text"
                placeholder="Contoh: Jl. Ahmad Yani No. 12, RT 04 RW 02"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] text-[#0b1c30] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#006398]"
              />
            </div>
          </div>

          {/* Section: Catatan Khusus */}
          <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-[12px] font-semibold text-[#0b1c30] dark:text-slate-200">
              Catatan Wali Kelas (Opsional)
            </label>
            <textarea
              id="input-student-notes"
              rows={2}
              placeholder="Catatan potensi, kondisi kesehatan, atau karakteristik siswa..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] text-[#0b1c30] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#006398]"
            />
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
            {isEditing ? (
              confirmDelete ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="h-11 px-3.5 bg-red-600 hover:bg-red-700 text-white text-[12px] font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Yakin Hapus?
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="h-11 px-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[12px] font-semibold rounded-xl"
                  >
                    Batal
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  id="btn-delete-student"
                  onClick={() => setConfirmDelete(true)}
                  className="h-11 px-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-[12px] font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  Hapus Siswa
                </button>
              )
            ) : (
              <div></div>
            )}

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
                id="btn-save-student"
                className="h-11 px-5 rounded-xl bg-[#006398] hover:bg-[#004f7a] text-white text-[13px] font-bold shadow-md hover:shadow-lg flex items-center gap-2 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {isEditing ? 'Simpan Perubahan' : 'Tambahkan Siswa'}
              </button>
            </div>
          </div>
        </form>
      </div>
  );
}

export default function StudentFormModal() {
  const {
    openAddStudentModal,
    setOpenAddStudentModal,
    editingStudent,
    setEditingStudent,
  } = useClass();

  if (!openAddStudentModal) return null;

  return (
    <div
      id="modal-student-form-backdrop"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200"
    >
      <StudentFormContent
        key={editingStudent ? `edit-${editingStudent.id}` : 'new-student'}
        student={editingStudent}
        onClose={() => {
          setOpenAddStudentModal(false);
          setEditingStudent(null);
        }}
      />
    </div>
  );
}
