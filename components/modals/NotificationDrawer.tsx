'use client';

import React from 'react';
import { useClass } from '@/context/ClassContext';
import { Bell, X, CheckCircle, AlertTriangle, Trophy, Cloud } from 'lucide-react';

export default function NotificationDrawer() {
  const {
    openNotificationDrawer,
    setOpenNotificationDrawer,
    setActiveTab,
    students,
    attendanceCounts,
    behaviorRecords,
    currentUser,
  } = useClass();

  if (!openNotificationDrawer) return null;

  const attentionStudents = students.filter((s) => s.needsAttention || s.attendanceRate < 80);
  const firstAttention = attentionStudents[0];
  const latestBehavior = behaviorRecords[0];

  const notifications = [
    {
      id: '1',
      title: 'Status Presensi Harian',
      time: 'Hari ini',
      desc:
        students.length > 0
          ? `${attendanceCounts.hadir} Hadir (${attendanceCounts.ratePercent}%), ${attendanceCounts.sakit} Sakit, ${attendanceCounts.izin} Izin, ${attendanceCounts.alfa} Alfa.`
          : 'Belum ada data siswa terdaftar di kelas.',
      type: 'success',
      icon: CheckCircle,
    },
    {
      id: '2',
      title: firstAttention ? `Perhatian: ${firstAttention.name}` : 'Disiplin Siswa Terjaga',
      time: 'Terkini',
      desc: firstAttention
        ? `NISN: ${firstAttention.nisn}. ${firstAttention.notes || `Kehadiran ${firstAttention.attendanceRate}%. Perlu pendampingan wali kelas.`}`
        : 'Seluruh peserta didik terpantau aktif dan tidak ada catatan ketidakhadiran mendesak.',
      type: firstAttention ? 'warning' : 'success',
      icon: firstAttention ? AlertTriangle : CheckCircle,
    },
    ...(latestBehavior
      ? [
          {
            id: '3',
            title: `${latestBehavior.type}: ${latestBehavior.studentName}`,
            time: latestBehavior.date,
            desc: `${latestBehavior.title}. ${latestBehavior.description || ''} (${latestBehavior.points >= 0 ? '+' : ''}${latestBehavior.points} Poin).`,
            type: latestBehavior.points >= 0 ? 'info' : 'warning',
            icon: Trophy,
          },
        ]
      : []),
    {
      id: '4',
      title: 'Penyimpanan Kelas Aktif',
      time: 'Realtime',
      desc: `Data kelas ${currentUser?.className || ''} ${currentUser?.schoolName || ''} tersimpan aman di sistem.`,
      type: 'cloud',
      icon: Cloud,
    },
  ];

  return (
    <div
      id="drawer-notifications"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 pt-16 animate-in fade-in"
    >
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-sm w-full p-4 shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col gap-3 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#006398] dark:text-sky-400" />
            <h3 className="font-display font-bold text-[15px] text-[#0b1c30] dark:text-slate-100">
              Pemberitahuan Kelas
            </h3>
          </div>
          <button
            onClick={() => setOpenNotificationDrawer(false)}
            className="w-7 h-7 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {notifications.map((n) => {
            const Icon = n.icon;
            return (
              <div
                key={n.id}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-start gap-2.5"
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    n.type === 'warning'
                      ? 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300'
                      : n.type === 'success'
                      ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-sky-100 text-[#006398] dark:bg-sky-950 dark:text-sky-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-[12px] text-[#0b1c30] dark:text-slate-100 truncate">
                      {n.title}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                  </div>
                  <p className="text-[11px] text-[#45464d] dark:text-slate-300 mt-0.5 leading-relaxed">
                    {n.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => {
            setOpenNotificationDrawer(false);
            setActiveTab('bimbingan');
          }}
          className="w-full py-2.5 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] dark:bg-slate-700 dark:hover:bg-slate-600 text-[#006398] dark:text-sky-300 text-[11px] font-bold transition-colors text-center cursor-pointer"
        >
          Lihat Semua Log Bimbingan &amp; Presensi
        </button>
      </div>
    </div>
  );
}
