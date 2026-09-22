'use client';

import React from 'react';
import { ClassProvider, useClass } from '@/context/ClassContext';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import BerandaTab from '@/components/tabs/BerandaTab';
import PresensiTab from '@/components/tabs/PresensiTab';
import DataSiswaTab from '@/components/tabs/DataSiswaTab';
import BimbinganTab from '@/components/tabs/BimbinganTab';
import AuthModal from '@/components/modals/AuthModal';
import SupabaseConfigModal from '@/components/modals/SupabaseConfigModal';
import AddBehaviorModal from '@/components/modals/AddBehaviorModal';
import ReportExportModal from '@/components/modals/ReportExportModal';
import NotificationDrawer from '@/components/modals/NotificationDrawer';
import StudentFormModal from '@/components/modals/StudentFormModal';
import ClassProfileModal from '@/components/modals/ClassProfileModal';

function AppContent() {
  const { activeTab, isDarkMode } = useClass();

  return (
    <div
      className={`${
        isDarkMode ? 'dark ' : ''
      }flex flex-col min-h-screen bg-[#f8f9ff] dark:bg-slate-950 text-[#0b1c30] dark:text-slate-100 transition-colors`}
    >
      {/* Sticky Top Navigation Header */}
      <Header />

      {/* Main Container - Mobile First Frame Centered */}
      <main className="flex-1 w-full max-w-md mx-auto px-3.5 pt-4 pb-24">
        {activeTab === 'beranda' && <BerandaTab />}
        {activeTab === 'presensi' && <PresensiTab />}
        {activeTab === 'data-siswa' && <DataSiswaTab />}
        {activeTab === 'bimbingan' && <BimbinganTab />}
      </main>

      {/* Interactive Modals & Drawers */}
      <AuthModal />
      <SupabaseConfigModal />
      <AddBehaviorModal />
      <ReportExportModal />
      <NotificationDrawer />
      <StudentFormModal />
      <ClassProfileModal />

      {/* Fixed Bottom Navigation Bar */}
      <BottomNav />
    </div>
  );
}

export default function Page() {
  return (
    <ClassProvider>
      <AppContent />
    </ClassProvider>
  );
}
