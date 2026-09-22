'use client';

import React from 'react';
import { useClass } from '@/context/ClassContext';
import {
  X,
  Sun,
  Moon,
  Camera,
  School,
  Database,
  Bell,
  User,
  ShieldCheck,
  CheckCircle2,
  LogOut,
  ChevronRight,
} from 'lucide-react';

interface HeaderQuickMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HeaderQuickMenuModal({ isOpen, onClose }: HeaderQuickMenuModalProps) {
  const {
    currentUser,
    isDarkMode,
    toggleDarkMode,
    isSupabaseConfigured,
    isSyncing,
    setOpenEditClassModal,
    setOpenConfigModal,
    setOpenNotificationDrawer,
    setOpenAuthModal,
    logout,
  } = useClass();

  if (!isOpen) return null;

  return (
    <div
      id="modal-quick-menu-backdrop"
      className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-20 px-3 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        id="modal-quick-menu-container"
        className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Dialog */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-850/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#006398]/10 dark:bg-sky-500/20 text-[#006398] dark:text-sky-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-[#0b1c30] dark:text-slate-100">
                Menu & Profil Wali Kelas
              </h3>
              <p className="text-[11px] text-[#45464d] dark:text-slate-400">
                Akses cepat pengaturan & tema
              </p>
            </div>
          </div>
          <button
            type="button"
            id="btn-close-quick-menu"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
            title="Tutup Menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-3.5 max-h-[80vh] overflow-y-auto">
          {/* Teacher Profile Card */}
          <div className="bg-gradient-to-br from-[#f0f4fd] to-[#e6efff] dark:from-slate-800 dark:to-slate-850 p-3.5 rounded-2xl border border-sky-100 dark:border-slate-700/80 flex items-center gap-3.5">
            <div className="relative group shrink-0">
              <img
                src={currentUser?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUCVerHn8tk2JrXyIoA3re0jDuAj5vSIq1LyHt9GOz2yM3rrNiDfygefyREnxeHPbmfu7xZPUHpk6jkxeHX9wFNlW_j8m7usFaMWzMK6T5P5aPNai09_n0rJi4QxEz-vIFah2u2g6WMvPkGraWnwIMWP3zacA33EJzeKlYEHkztzxL6cyEIVEapOySEUUaBEJhyBsO61WfrU3fRtT08VbNuRR1_eb-XJLtnCSvKlt-aMD7yNIJFSiSAw'}
                alt={currentUser?.name || 'Wali Kelas'}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white dark:ring-slate-700 shadow-sm"
              />
              <button
                type="button"
                id="btn-quick-menu-edit-photo"
                onClick={() => {
                  onClose();
                  setOpenEditClassModal(true);
                }}
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#006398] text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                title="Ganti Foto Guru"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="font-display font-bold text-sm text-[#0b1c30] dark:text-slate-100 truncate">
                  {currentUser?.name || 'Budi Santoso, S.Pd.'}
                </h4>
                <ShieldCheck className="w-3.5 h-3.5 text-sky-500 shrink-0" />
              </div>
              <p className="text-[11px] text-[#45464d] dark:text-slate-300 font-medium truncate">
                {currentUser?.role || 'Wali Kelas'} • {currentUser?.className || 'Kelas IX-B'}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                NIP: {currentUser?.nip || '19850715 200902 1 003'}
              </p>
            </div>
          </div>

          {/* Dark / Light Mode Switch Card */}
          <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                  isDarkMode
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-indigo-50 text-indigo-600 dark:bg-slate-700 dark:text-amber-400'
                }`}
              >
                {isDarkMode ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
              </div>
              <div>
                <p className="text-xs font-bold text-[#0b1c30] dark:text-slate-100">
                  {isDarkMode ? 'Mode Gelap Aktif' : 'Mode Terang Aktif'}
                </p>
                <p className="text-[10px] text-[#45464d] dark:text-slate-400">
                  {isDarkMode ? 'Tampilan nyaman di mata saat malam' : 'Tampilan cerah standar sekolah'}
                </p>
              </div>
            </div>

            <button
              type="button"
              id="btn-quick-menu-toggle-dark"
              onClick={toggleDarkMode}
              className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isDarkMode ? 'bg-sky-600' : 'bg-slate-300 dark:bg-slate-600'
              }`}
              role="switch"
              aria-checked={isDarkMode}
              title="Ganti Tema Gelap / Terang"
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              >
                {isDarkMode ? (
                  <Moon className="w-3.5 h-3.5 text-sky-600" />
                ) : (
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                )}
              </span>
            </button>
          </div>

          {/* Quick Menu Options */}
          <div className="space-y-1.5 pt-1">
            {/* Edit Class Profile */}
            <button
              type="button"
              id="btn-quick-edit-class"
              onClick={() => {
                onClose();
                setOpenEditClassModal(true);
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-[#006398] dark:text-sky-300 flex items-center justify-center">
                  <School className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#0b1c30] dark:text-slate-100">
                    Identitas Kelas & Foto Guru
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    {currentUser?.className || 'Kelas Anda'} • {currentUser?.schoolName || 'Sekolah Anda'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Supabase Database Config */}
            <button
              type="button"
              id="btn-quick-config-database"
              onClick={() => {
                onClose();
                setOpenConfigModal(true);
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-semibold text-[#0b1c30] dark:text-slate-100">
                      Sinkronisasi Database Cloud
                    </p>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                        isSupabaseConfigured
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300'
                          : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {isSupabaseConfigured ? 'Aktif' : 'Lokal'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    {isSupabaseConfigured ? 'Terkoneksi ke Supabase' : 'Koneksikan ke Supabase PostgreSQL'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Notifications */}
            <button
              type="button"
              id="btn-quick-notifications"
              onClick={() => {
                onClose();
                setOpenNotificationDrawer(true);
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#0b1c30] dark:text-slate-100">
                    Notifikasi & Rekap Presensi
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Pemberitahuan absensi & konseling hari ini
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Switch Account / Auth */}
            <button
              type="button"
              id="btn-quick-switch-account"
              onClick={() => {
                onClose();
                setOpenAuthModal(true);
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#0b1c30] dark:text-slate-100">
                    Kelola Akun Guru & Login
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Masuk atau daftarkan akun guru lain
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-850/60 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
          <span className="text-slate-500 dark:text-slate-400">
            WaliKelas v2.4 • Offline Ready
          </span>
          <button
            type="button"
            onClick={onClose}
            className="font-medium text-[#006398] dark:text-sky-400 hover:underline cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
