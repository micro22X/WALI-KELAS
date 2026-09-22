'use client';

import React, { useState } from 'react';
import { useClass } from '@/context/ClassContext';
import { LOGO_URL } from '@/lib/mockData';
import { Sun, Moon, Bell, Database, Menu } from 'lucide-react';
import HeaderQuickMenuModal from '@/components/modals/HeaderQuickMenuModal';

export default function Header() {
  const {
    activeTab,
    currentUser,
    isDarkMode,
    toggleDarkMode,
    setOpenConfigModal,
    setOpenNotificationDrawer,
    setOpenEditClassModal,
    isSupabaseConfigured,
    isSyncing,
  } = useClass();

  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);

  const tabTitles: Record<string, string> = {
    beranda: 'Beranda',
    presensi: 'Presensi',
    'data-siswa': 'Data Siswa',
    bimbingan: 'Bimbingan',
  };

  return (
    <>
      <header
        id="app-header"
        className="sticky top-0 w-full z-40 bg-[#f8f9ff]/95 dark:bg-[#0b1c30]/95 backdrop-blur-xl border-b border-[#e2e8f0] dark:border-slate-800 transition-colors shadow-xs"
      >
        <div className="max-w-md mx-auto h-16 px-3.5 flex items-center justify-between gap-2">
          {/* Left: School/Wali Logo & Tab Context */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              id="btn-app-logo"
              onClick={() => setIsQuickMenuOpen(true)}
              className="group relative flex items-center shrink-0 cursor-pointer focus:outline-none"
              title="Buka Menu Pop-up Wali Kelas"
            >
              <img
                alt="Logo Wali Kelas"
                className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
                src={LOGO_URL}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg/512px-Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg.png';
                }}
              />
            </button>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-[15px] text-[#0b1c30] dark:text-slate-100 truncate">
                  WaliKelas
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#006398] dark:bg-sky-400 shrink-0"></span>
                <span className="text-[12px] font-semibold text-[#006398] dark:text-sky-400 truncate max-w-[120px]">
                  {tabTitles[activeTab]}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#45464d] dark:text-slate-400">
                <button
                  type="button"
                  id="btn-header-edit-class"
                  onClick={() => setIsQuickMenuOpen(true)}
                  className="truncate hover:text-[#006398] dark:hover:text-sky-300 hover:underline cursor-pointer text-left"
                  title="Klik untuk membuka menu & pengaturan kelas"
                >
                  {currentUser ? `${currentUser.className} • ${currentUser.schoolName}` : 'Profil Kelas'}
                </button>
                {/* Live status badge */}
                <button
                  type="button"
                  onClick={() => setOpenConfigModal(true)}
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium cursor-pointer transition-colors ${
                    isSupabaseConfigured
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                  }`}
                  title="Status Sinkronisasi Real-time"
                >
                  <Database className="w-2.5 h-2.5" />
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSyncing ? 'bg-amber-400 animate-ping' : isSupabaseConfigured ? 'bg-emerald-500' : 'bg-blue-500'
                    }`}
                  />
                  {isSupabaseConfigured ? 'Supabase' : 'Real-time'}
                </button>
              </div>
            </div>
          </div>

          {/* Right: Actions (Dark mode, Notif, User profile pop-up trigger) */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Dark Mode Toggle */}
            <button
              id="btn-toggle-dark-mode"
              onClick={toggleDarkMode}
              aria-label={isDarkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
              title={isDarkMode ? 'Klik untuk Mode Terang' : 'Klik untuk Mode Gelap'}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#e5eeff] dark:hover:bg-slate-700 text-[#45464d] dark:text-amber-400 transition-all cursor-pointer ring-1 ring-slate-200/80 dark:ring-slate-700"
              type="button"
            >
              {isDarkMode ? (
                <Sun className="w-4.5 h-4.5 text-amber-400" />
              ) : (
                <Moon className="w-4.5 h-4.5 text-slate-700" />
              )}
            </button>

            {/* Notifications */}
            <button
              id="btn-notifications"
              onClick={() => setOpenNotificationDrawer(true)}
              aria-label="Notifikasi Siswa"
              className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#e5eeff] dark:hover:bg-slate-700 text-[#45464d] dark:text-slate-300 transition-colors ring-1 ring-slate-200/80 dark:ring-slate-700 cursor-pointer"
              type="button"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ba1a1a] ring-2 ring-[#f8f9ff] dark:ring-[#0b1c30]"></span>
            </button>

            {/* User Profile Avatar - Opens Pop-up Menu */}
            <button
              id="btn-user-profile"
              onClick={() => setIsQuickMenuOpen(true)}
              className="relative ml-0.5 rounded-full p-0.5 ring-2 ring-sky-500/30 hover:ring-sky-500 transition-all focus:outline-none cursor-pointer"
              title={currentUser ? `Menu Pop-up: ${currentUser.name}` : 'Buka Menu Pop-up Guru'}
            >
              {currentUser?.avatar ? (
                <img
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-white/50 shadow-sm"
                  src={currentUser.avatar}
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#006398] text-white flex items-center justify-center font-bold text-xs">
                  BS
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-[#0b1c30] rounded-full"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Pop-up Menu Modal */}
      <HeaderQuickMenuModal
        isOpen={isQuickMenuOpen}
        onClose={() => setIsQuickMenuOpen(false)}
      />
    </>
  );
}
