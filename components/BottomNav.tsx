'use client';

import React from 'react';
import { useClass } from '@/context/ClassContext';
import { Home, ClipboardCheck, GraduationCap, MessagesSquare } from 'lucide-react';

export default function BottomNav() {
  const { activeTab, setActiveTab } = useClass();

  const tabs = [
    { id: 'beranda', label: 'Beranda', Icon: Home },
    { id: 'presensi', label: 'Presensi', Icon: ClipboardCheck },
    { id: 'data-siswa', label: 'Data Siswa', Icon: GraduationCap },
    { id: 'bimbingan', label: 'Bimbingan', Icon: MessagesSquare },
  ] as const;

  return (
    <nav
      id="bottom-navigation-bar"
      className="fixed bottom-0 w-full z-40 pb-safe bg-[#f8f9ff]/90 dark:bg-[#0b1c30]/90 backdrop-blur-xl border-t border-[#e2e8f0] dark:border-slate-800 shadow-[0_-4px_16px_rgba(11,28,48,0.06)]"
    >
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const { Icon } = tab;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 h-14 min-w-[64px] rounded-xl transition-all duration-200 group focus:outline-none ${
                isActive
                  ? 'text-[#006398] dark:text-sky-400 font-semibold'
                  : 'text-[#45464d] dark:text-slate-400 hover:text-[#0b1c30] dark:hover:text-slate-200'
              }`}
              type="button"
            >
              <div
                className={`px-4 py-1 rounded-full flex items-center justify-center transition-colors ${
                  isActive
                    ? 'bg-[#006398]/10 dark:bg-sky-500/20'
                    : 'group-hover:bg-slate-100 dark:group-hover:bg-slate-800/50'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform group-active:scale-90 ${
                    isActive ? 'stroke-[2.5]' : 'stroke-2'
                  }`}
                />
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
