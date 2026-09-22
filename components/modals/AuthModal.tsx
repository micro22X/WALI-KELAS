'use client';

import React, { useState, useRef } from 'react';
import { useClass } from '@/context/ClassContext';
import {
  UserCircle,
  X,
  LogOut,
  LogIn,
  BadgeCheck,
  School,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Camera,
  UploadCloud,
} from 'lucide-react';
import PhotoUploadDropzone from '@/components/ui/PhotoUploadDropzone';
import { compressAndResizeImage } from '@/lib/imageUtils';

export default function AuthModal() {
  const {
    openAuthModal,
    setOpenAuthModal,
    currentUser,
    loginWithEmail,
    registerWithEmail,
    logout,
    isSupabaseConfigured,
    setOpenEditClassModal,
    triggerConfetti,
    updateTeacherPhoto,
  } = useClass();

  const teacherPhotoInputRef = useRef<HTMLInputElement>(null);

  // Mode: 'login' | 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Register form states
  const [regName, setRegName] = useState('');
  const [regNip, setRegNip] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<'Wali Kelas' | 'Guru BK' | 'Kepala Sekolah'>('Wali Kelas');
  const [regClassName, setRegClassName] = useState('Kelas VII-A');
  const [regSchoolName, setRegSchoolName] = useState('SMP Negeri 1');
  const [regAvatar, setRegAvatar] = useState(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBUCVerHn8tk2JrXyIoA3re0jDuAj5vSIq1LyHt9GOz2yM3rrNiDfygefyREnxeHPbmfu7xZPUHpk6jkxeHX9wFNlW_j8m7usFaMWzMK6T5P5aPNai09_n0rJi4QxEz-vIFah2u2g6WMvPkGraWnwIMWP3zacA33EJzeKlYEHkztzxL6cyEIVEapOySEUUaBEJhyBsO61WfrU3fRtT08VbNuRR1_eb-XJLtnCSvKlt-aMD7yNIJFSiSAw'
  );

  if (!openAuthModal) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    const res = await loginWithEmail(email, password);
    setLoading(false);
    if (!res.success) {
      setErrorMsg(res.error || 'Gagal masuk. Silakan cek kembali email & sandi.');
    } else {
      triggerConfetti();
      setOpenAuthModal(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!regName.trim()) {
      setErrorMsg('Nama lengkap dan gelar wajib diisi');
      return;
    }
    if (!regEmail.trim()) {
      setErrorMsg('Alamat email wajib diisi');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMsg('Kata sandi minimal 6 karakter');
      return;
    }

    setLoading(true);
    const res = await registerWithEmail({
      name: regName.trim(),
      nip: regNip.trim() || '19850101 201001 1 001',
      email: regEmail.trim(),
      password: regPassword,
      role: regRole,
      className: regClassName.trim() || 'Kelas Anda',
      schoolName: regSchoolName.trim() || 'Sekolah Anda',
      avatar: regAvatar,
    });
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Gagal mendaftarkan akun. Silakan coba lagi.');
    } else {
      triggerConfetti();
      setSuccessMsg(res.warning || 'Akun pengguna berhasil didaftarkan dan langsung aktif!');
      setTimeout(() => {
        setOpenAuthModal(false);
      }, res.warning ? 2800 : 1200);
    }
  };

  return (
    <div
      id="modal-auth"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in"
    >
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#006398]/10 dark:bg-sky-500/20 text-[#006398] dark:text-sky-400 flex items-center justify-center">
              <UserCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-[16px] text-[#0b1c30] dark:text-slate-100">
                Autentikasi Pengguna
              </h3>
              <p className="text-[11px] text-[#45464d] dark:text-slate-400">
                Kelola akun wali kelas &amp; hak akses aplikasi
              </p>
            </div>
          </div>
          <button
            id="btn-close-auth-modal"
            onClick={() => setOpenAuthModal(false)}
            className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {currentUser ? (
          /* Profile Logged-in View */
          <div className="flex flex-col gap-3.5">
            {/* Hidden file input for quick teacher photo change */}
            <input
              ref={teacherPhotoInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  try {
                    const res = await compressAndResizeImage(file, 480, 480, 0.84);
                    updateTeacherPhoto(res.dataUrl);
                    triggerConfetti();
                    setSuccessMsg('Foto profil guru sesungguhnya berhasil diperbarui!');
                    setTimeout(() => setSuccessMsg(null), 3000);
                  } catch (err: any) {
                    setErrorMsg(err.message || 'Gagal mengubah foto guru.');
                  }
                }
                if (e.target) e.target.value = '';
              }}
            />

            <div className="flex items-center gap-3.5 p-3.5 bg-[#eff4ff] dark:bg-slate-900 rounded-2xl border border-[#d3e4fe]/60 dark:border-slate-800">
              <div
                className="relative shrink-0 group cursor-pointer"
                onClick={() => teacherPhotoInputRef.current?.click()}
                title="Klik untuk mengganti foto profil guru sesungguhnya"
              >
                <img
                  alt={currentUser.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#006398]/30 shadow-sm group-hover:opacity-90 transition-opacity"
                  src={currentUser.avatar}
                />
                <button
                  type="button"
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#006398] text-white flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-sm cursor-pointer"
                >
                  <Camera className="w-3 h-3" />
                </button>
              </div>

              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-display font-bold text-[14px] text-[#0b1c30] dark:text-slate-100 truncate">
                  {currentUser.name}
                </span>
                <span className="text-[11px] text-[#006398] dark:text-sky-400 font-semibold">
                  {currentUser.role} • {currentUser.className}
                </span>
                <span className="text-[10px] text-[#45464d] dark:text-slate-400">
                  NIP: {currentUser.nip}
                </span>
                <button
                  type="button"
                  onClick={() => teacherPhotoInputRef.current?.click()}
                  className="mt-1 text-[11px] font-semibold text-[#006398] dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer w-fit"
                >
                  <Camera className="w-3 h-3" />
                  <span>Ganti Foto Guru Asli</span>
                </button>
              </div>
            </div>

            <div className="text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
              <span>Status Koneksi:</span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {isSupabaseConfigured ? 'Supabase Auth Aktif' : 'Penyimpanan Lokal Aktif'}
              </strong>
            </div>

            <button
              type="button"
              id="btn-open-class-profile-from-auth"
              onClick={() => {
                setOpenAuthModal(false);
                setOpenEditClassModal(true);
              }}
              className="w-full h-11 rounded-xl bg-[#006398] hover:bg-[#004f7a] text-white text-[12px] font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer mt-1"
            >
              <School className="w-4 h-4" />
              <span>Ubah Profil Guru &amp; Kelas Sesungguhnya</span>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                id="btn-switch-to-register-from-logged-in"
                onClick={async () => {
                  await logout();
                  setAuthMode('register');
                }}
                className="flex-1 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5 text-[#006398] dark:text-sky-400" />
                <span>Daftar Akun Baru</span>
              </button>

              <button
                type="button"
                id="btn-logout"
                onClick={async () => {
                  await logout();
                  setAuthMode('login');
                }}
                className="flex-1 h-10 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar (Logout)</span>
              </button>
            </div>
          </div>
        ) : (
          /* Authentication Forms (Login vs Register) */
          <div className="flex flex-col gap-3">
            {/* Mode Switcher Tabs */}
            <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
              <button
                type="button"
                id="tab-btn-login"
                onClick={() => {
                  setAuthMode('login');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`flex-1 py-2 rounded-xl text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  authMode === 'login'
                    ? 'bg-white dark:bg-slate-800 text-[#006398] dark:text-sky-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk (Login)</span>
              </button>

              <button
                type="button"
                id="tab-btn-register"
                onClick={() => {
                  setAuthMode('register');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`flex-1 py-2 rounded-xl text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  authMode === 'register'
                    ? 'bg-white dark:bg-slate-800 text-[#006398] dark:text-sky-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Daftar Akun Baru</span>
              </button>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-[11px] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-[11px] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {authMode === 'login' ? (
              /* LOGIN FORM */
              <form onSubmit={handleLogin} className="flex flex-col gap-3">
                <p className="text-[12px] text-[#45464d] dark:text-slate-300">
                  Gunakan email terdaftar atau masuk dengan kredensial guru:
                </p>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-[#45464d] dark:text-slate-300">
                    Email Pengguna
                  </label>
                  <input
                    id="input-login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama.guru@sekolah.sch.id"
                    className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-[12px] text-[#0b1c30] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#006398]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-[#45464d] dark:text-slate-300">
                    Kata Sandi
                  </label>
                  <input
                    id="input-login-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-[12px] text-[#0b1c30] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#006398]"
                  />
                </div>

                <button
                  type="submit"
                  id="btn-submit-login"
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-[#006398] hover:bg-sky-700 text-white font-semibold text-[13px] flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all mt-1 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{loading ? 'Memverifikasi...' : 'Masuk Sekarang'}</span>
                </button>
              </form>
            ) : (
              /* REGISTER FORM */
              <form onSubmit={handleRegister} className="flex flex-col gap-2.5">
                <div className="p-2.5 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60 rounded-xl text-[11px] text-sky-800 dark:text-sky-300 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#006398] dark:text-sky-400 flex-shrink-0 mt-0.5" />
                  <span>
                    Daftarkan akun guru sesungguhnya. Akun ini langsung aktif dan tersimpan aman di browser Anda (serta ke Supabase jika terhubung).
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-2">
                    <label className="text-[11px] font-semibold text-[#45464d] dark:text-slate-300 mb-1 block">
                      Nama Lengkap &amp; Gelar *
                    </label>
                    <input
                      id="input-reg-name"
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Contoh: Dra. Hj. Ratna Sari, M.Pd."
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-[12px] text-[#0b1c30] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#006398]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#45464d] dark:text-slate-300 mb-1 block">
                      NIP Guru
                    </label>
                    <input
                      id="input-reg-nip"
                      type="text"
                      value={regNip}
                      onChange={(e) => setRegNip(e.target.value)}
                      placeholder="19850101 201001 2 001"
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-[12px] text-[#0b1c30] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#006398]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#45464d] dark:text-slate-300 mb-1 block">
                      Peran Pengguna
                    </label>
                    <select
                      id="select-reg-role"
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as any)}
                      className="w-full h-10 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-[12px] font-medium text-[#0b1c30] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#006398]"
                    >
                      <option value="Wali Kelas">Wali Kelas</option>
                      <option value="Guru BK">Guru BK</option>
                      <option value="Kepala Sekolah">Kepala Sekolah</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="text-[11px] font-semibold text-[#45464d] dark:text-slate-300 mb-1 block">
                      Email Dinas / Pengguna *
                    </label>
                    <input
                      id="input-reg-email"
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="ratna.sari@sekolah.sch.id"
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-[12px] text-[#0b1c30] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#006398]"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-[11px] font-semibold text-[#45464d] dark:text-slate-300 mb-1 block">
                      Kata Sandi (Minimal 6 karakter) *
                    </label>
                    <input
                      id="input-reg-password"
                      type="password"
                      required
                      minLength={6}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Buat kata sandi akun..."
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-[12px] text-[#0b1c30] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#006398]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#45464d] dark:text-slate-300 mb-1 block">
                      Kelas Binaan
                    </label>
                    <input
                      id="input-reg-classname"
                      type="text"
                      value={regClassName}
                      onChange={(e) => setRegClassName(e.target.value)}
                      placeholder="Contoh: Kelas VII-A"
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-[12px] text-[#0b1c30] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#006398]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#45464d] dark:text-slate-300 mb-1 block">
                      Nama Sekolah
                    </label>
                    <input
                      id="input-reg-school"
                      type="text"
                      value={regSchoolName}
                      onChange={(e) => setRegSchoolName(e.target.value)}
                      placeholder="Contoh: SMP Negeri 1"
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-[12px] text-[#0b1c30] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#006398]"
                    />
                  </div>
                </div>

                {/* Upload Foto Guru Sesungguhnya */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <PhotoUploadDropzone
                    id="uploader-reg-photo"
                    value={regAvatar}
                    onChange={(url) => setRegAvatar(url)}
                    label="Foto Profil Guru Sesungguhnya"
                    sublabel="Unggah foto guru dari perangkat atau pilih avatar contoh"
                    shape="circle"
                  />
                </div>

                <button
                  type="submit"
                  id="btn-submit-register"
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-[#006398] hover:bg-sky-700 text-white font-bold text-[13px] flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all mt-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{loading ? 'Mendaftarkan Akun...' : 'Daftarkan Akun Pengguna'}</span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

