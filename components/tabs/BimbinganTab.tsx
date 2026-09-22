'use client';

import React, { useState, useMemo } from 'react';
import { useClass } from '@/context/ClassContext';
import { WHATSAPP_TEMPLATES } from '@/lib/mockData';
import { WhatsAppMessageTemplate } from '@/types';
import { formatIndonesianDate } from '@/lib/dateUtils';
import {
  ShieldCheck,
  MessageSquare,
  Megaphone,
  Heart,
  BookOpenCheck,
  PlusCircle,
  AlertTriangle,
  Award,
  Handshake,
  Clock,
  CalendarX,
  Users,
  Send,
  Eye,
  Check,
  Copy,
  MessageCircle,
  User,
} from 'lucide-react';

export default function BimbinganTab() {
  const { behaviorRecords, setOpenNewRecordModal, students, currentUser } = useClass();

  const [activeChip, setActiveChip] = useState<'sikap' | 'wa' | 'pengumuman'>('sikap');
  const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppMessageTemplate>(WHATSAPP_TEMPLATES[0]);
  const [copied, setCopied] = useState(false);

  // Dynamic preview text based on template
  const previewText = useMemo(() => {
    const nextFiveDays = new Date();
    nextFiveDays.setDate(nextFiveDays.getDate() + 5);
    return selectedTemplate.content
      .replace('{NAMA_SISWA}', students[0]?.name || 'Nama Siswa')
      .replace('{TANGGAL}', formatIndonesianDate(new Date()))
      .replace('{TANGGAL_PAGUYUBAN}', formatIndonesianDate(nextFiveDays));
  }, [selectedTemplate.content, students]);

  const activeCasesCount = behaviorRecords.filter((r) => r.points < 0).length;
  const appreciationCount = behaviorRecords.filter((r) => r.points > 0).length;
  const parentResponseRate = behaviorRecords.length > 0
    ? `${Math.round((behaviorRecords.filter((r) => r.parentNotified).length / behaviorRecords.length) * 100)}%`
    : '100%';

  const handleCopy = () => {
    navigator.clipboard.writeText(previewText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = (phone = '+6281288912309') => {
    const text = encodeURIComponent(previewText);
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="flex flex-col w-full gap-3.5 pb-24">
      {/* Top Filter Chips */}
      <section id="section-bimbingan-chips" className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        <button
          onClick={() => setActiveChip('sikap')}
          className={`h-9 px-4 rounded-full text-[12px] font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
            activeChip === 'sikap'
              ? 'bg-[#006398] text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-[#45464d] dark:text-slate-300 border border-[#e2e8f0] dark:border-slate-700'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Catatan Sikap</span>
        </button>

        <button
          onClick={() => setActiveChip('wa')}
          className={`h-9 px-4 rounded-full text-[12px] font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
            activeChip === 'wa'
              ? 'bg-[#006398] text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-[#45464d] dark:text-slate-300 border border-[#e2e8f0] dark:border-slate-700'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>WhatsApp Ortu</span>
        </button>

        <button
          onClick={() => setActiveChip('pengumuman')}
          className={`h-9 px-4 rounded-full text-[12px] font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
            activeChip === 'pengumuman'
              ? 'bg-[#006398] text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-[#45464d] dark:text-slate-300 border border-[#e2e8f0] dark:border-slate-700'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Pengumuman</span>
        </button>
      </section>

      {/* Pusat Konseling IX-B Banner */}
      <section
        id="card-pusat-konseling"
        className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-[#e2e8f0] dark:border-slate-700 flex flex-col gap-3"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-[16px] text-[#0b1c30] dark:text-slate-100">
                Pusat Bimbingan {currentUser?.className || 'Kelas'}
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Aktif
              </span>
            </div>
            <p className="text-[12px] text-[#45464d] dark:text-slate-400 mt-1 leading-relaxed">
              Membimbing {students.length} siswa dengan empati, disiplin positif, dan kolaborasi orang tua.
            </p>
          </div>

          <button
            className="w-10 h-10 rounded-full bg-[#eff4ff] dark:bg-slate-700 text-[#006398] dark:text-sky-300 flex items-center justify-center shrink-0 hover:scale-105 transition-transform cursor-pointer"
            type="button"
            title="Apresiasi Siswa"
          >
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 dark:border-slate-700/60">
          <div className="flex flex-col items-center p-2 rounded-xl bg-[#eff4ff] dark:bg-slate-900 text-center">
            <span className="font-display font-bold text-[18px] text-[#0b1c30] dark:text-slate-100">
              {activeCasesCount}
            </span>
            <span className="text-[10px] text-[#45464d] dark:text-slate-400 font-medium">Kasus Perlu BK</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-xl bg-[#eff4ff] dark:bg-slate-900 text-center">
            <span className="font-display font-bold text-[18px] text-[#006398] dark:text-sky-400">
              {appreciationCount}
            </span>
            <span className="text-[10px] text-[#45464d] dark:text-slate-400 font-medium">Apresiasi</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-xl bg-[#eff4ff] dark:bg-slate-900 text-center">
            <span className="font-display font-bold text-[18px] text-emerald-600 dark:text-emerald-400">
              {parentResponseRate}
            </span>
            <span className="text-[10px] text-[#45464d] dark:text-slate-400 font-medium">Notifikasi Ortu</span>
          </div>
        </div>
      </section>

      {/* Catatan Terkini Siswa */}
      <section id="section-catatan-terkini" className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <BookOpenCheck className="w-4 h-4 text-[#006398] dark:text-sky-400" />
            <h3 className="font-display font-semibold text-[15px] text-[#0b1c30] dark:text-slate-100">
              Catatan Terkini Siswa
            </h3>
          </div>
          <span className="text-[11px] text-[#45464d] dark:text-slate-400">
            {behaviorRecords.length} Catatan
          </span>
        </div>

        {/* Action Button: Buat Catatan Baru */}
        <button
          onClick={() => setOpenNewRecordModal(true)}
          className="w-full h-11 rounded-2xl bg-[#0b1c30] hover:bg-slate-800 dark:bg-sky-500 dark:hover:bg-sky-600 text-white font-display font-semibold text-[13px] flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Buat Catatan Kasus / Apresiasi Baru</span>
        </button>

        {/* Behavior Feed Items */}
        <div className="flex flex-col gap-2.5">
          {behaviorRecords.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center text-[#45464d] dark:text-slate-400 border border-[#e2e8f0] dark:border-slate-700 flex flex-col items-center justify-center">
              <BookOpenCheck className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-2" />
              <h4 className="text-[14px] font-bold text-[#0b1c30] dark:text-slate-100 mb-1">
                Belum Ada Catatan Bimbingan
              </h4>
              <p className="text-[12px] max-w-xs mb-3">
                Catatan perilaku positif, apresiasi keteladanan, atau pembinaan murid akan tampil di sini.
              </p>
            </div>
          ) : (
            behaviorRecords.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-[#e2e8f0] dark:border-slate-700 flex flex-col gap-3"
            >
              {/* Top Header: Student info & category badge */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#eff4ff] dark:bg-slate-700 text-[#006398] dark:text-sky-300 flex items-center justify-center font-bold text-[13px]">
                    {item.studentName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-display font-bold text-[14px] text-[#0b1c30] dark:text-slate-100 truncate">
                      {item.studentName}
                    </span>
                    <span className="text-[11px] text-[#45464d] dark:text-slate-400">
                      Kehadiran &amp; Keteladanan
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    item.points >= 0
                      ? 'bg-sky-50 dark:bg-sky-950 text-[#006398] dark:text-sky-300 border border-sky-200'
                      : 'bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-200'
                  }`}
                >
                  {item.points > 0 ? `+${item.points} Poin Kebaikan` : item.type}
                </span>
              </div>

              {/* Title & Description Box */}
              <div
                className={`p-3 rounded-xl border text-[12px] flex flex-col gap-1 ${
                  item.points < 0
                    ? 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50'
                    : 'bg-[#eff4ff]/60 dark:bg-slate-900/60 border-[#d3e4fe] dark:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-[#0b1c30] dark:text-slate-100">
                  {item.points < 0 ? (
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                  ) : (
                    <Award className="w-4 h-4 text-amber-600" />
                  )}
                  <span>{item.title}</span>
                </div>
                <p className="text-[#45464d] dark:text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Solusi & Tindak Lanjut if present */}
              {item.solution && (
                <div className="p-3 rounded-xl bg-sky-50/60 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60 text-[12px] flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-[#006398] dark:text-sky-300 uppercase tracking-wider flex items-center gap-1">
                    <Handshake className="w-3.5 h-3.5" />
                    SOLUSI &amp; TINDAK LANJUT
                  </span>
                  <p className="text-[#0b1c30] dark:text-slate-200">{item.solution}</p>
                </div>
              )}

              {/* Footer row: Timestamp & Follow-up WA button */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700/60 text-[11px] text-[#45464d] dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {item.date} • {item.time}
                </span>

                <button
                  onClick={() => handleOpenWhatsApp()}
                  className="h-8 px-3 rounded-lg bg-[#eff4ff] hover:bg-[#dce9ff] dark:bg-slate-700 text-[#006398] dark:text-sky-300 font-semibold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{item.points < 0 ? 'Follow-up WA' : 'Kabar Baik ke Ortu'}</span>
                </button>
              </div>
            </div>
          )))}
        </div>
      </section>

      {/* Template WhatsApp Otomatis */}
      <section id="section-wa-templates" className="flex flex-col gap-2">
        <div className="flex flex-col px-1">
          <h3 className="font-display font-semibold text-[15px] text-[#0b1c30] dark:text-slate-100">
            Template WhatsApp Otomatis
          </h3>
          <span className="text-[11px] text-[#45464d] dark:text-slate-400">
            Kirim kabar resmi kelas dengan sekali sentuh
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {WHATSAPP_TEMPLATES.map((tpl) => {
            const isSelected = selectedTemplate.id === tpl.id;
            return (
              <div
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl)}
                className={`p-3.5 rounded-2xl bg-white dark:bg-slate-800 border transition-all cursor-pointer flex flex-col gap-2 shadow-sm ${
                  isSelected
                    ? 'border-[#006398] ring-2 ring-[#006398]/20 dark:border-sky-500'
                    : 'border-[#e2e8f0] dark:border-slate-700 hover:border-sky-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {tpl.category === 'Absensi' ? (
                      <CalendarX className="w-5 h-5 text-[#006398] dark:text-sky-400" />
                    ) : tpl.category === 'Paguyuban' ? (
                      <Users className="w-5 h-5 text-[#006398] dark:text-sky-400" />
                    ) : (
                      <Award className="w-5 h-5 text-[#006398] dark:text-sky-400" />
                    )}
                    <span className="font-display font-semibold text-[13px] text-[#0b1c30] dark:text-slate-100">
                      {tpl.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-[#45464d] dark:text-slate-300">
                    {tpl.category === 'Paguyuban' ? 'Grup Paguyuban' : 'Personal'}
                  </span>
                </div>

                <p className="text-[11px] text-[#45464d] dark:text-slate-300">
                  {tpl.description}
                </p>

                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="text-[#006398] dark:text-sky-400 font-medium truncate">
                    Target: {tpl.targetLabel}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTemplate(tpl);
                      handleOpenWhatsApp();
                    }}
                    className="h-8 px-3 rounded-lg bg-[#006398] hover:bg-sky-700 text-white font-semibold text-[11px] flex items-center gap-1 shadow-sm shrink-0 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim WA</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pratinjau Pesan WhatsApp */}
      <section id="section-wa-preview" className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-emerald-600" />
            <h3 className="font-display font-semibold text-[15px] text-[#0b1c30] dark:text-slate-100">
              Pratinjau Pesan WhatsApp
            </h3>
          </div>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
            Siap Dikirim
          </span>
        </div>

        {/* WhatsApp Chat Preview Container */}
        <div className="rounded-2xl overflow-hidden shadow-sm border border-emerald-300/60 dark:border-emerald-900/60 bg-[#efeae2] dark:bg-slate-900">
          {/* WA Top Bar */}
          <div className="bg-[#075e54] text-white p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                W
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-[12px] truncate">
                  {selectedTemplate.targetLabel}
                </span>
                <span className="text-[10px] text-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Online
                </span>
              </div>
            </div>

            <span className="text-[10px] text-emerald-200">+62 812-8891-2309</span>
          </div>

          {/* WA Message Bubble */}
          <div className="p-3.5 flex flex-col gap-2">
            <div className="max-w-[92%] bg-white dark:bg-slate-800 rounded-2xl rounded-tl-sm p-3 shadow-sm border border-slate-200/70 dark:border-slate-700 text-[12px] text-slate-800 dark:text-slate-100 whitespace-pre-line leading-relaxed relative">
              {previewText}
              <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 mt-1">
                <span>08:42</span>
                <span className="text-sky-500 font-bold">✔✔</span>
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700 flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[12px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Tersalin' : 'Salin'}</span>
            </button>

            <button
              onClick={() => handleOpenWhatsApp()}
              className="flex-1 h-10 px-4 rounded-xl bg-[#25d366] hover:bg-[#20bd5a] text-white font-bold text-[12px] flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Buka di Aplikasi WhatsApp</span>
            </button>
          </div>
        </div>
      </section>

      {/* Riwayat Pesan Terkirim */}
      <section id="section-riwayat-wa" className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <MessageCircle className="w-4 h-4 text-[#45464d] dark:text-slate-400" />
            <h3 className="font-display font-semibold text-[15px] text-[#0b1c30] dark:text-slate-100">
              Riwayat Pesan Terkirim
            </h3>
          </div>
          <span className="text-[11px] text-[#45464d] dark:text-slate-400">Terkini</span>
        </div>

        {students.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 text-center text-[#45464d] dark:text-slate-400 border border-[#e2e8f0] dark:border-slate-700 flex flex-col items-center justify-center">
            <MessageCircle className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
            <span className="text-[12px] font-semibold text-[#0b1c30] dark:text-slate-100 mb-0.5">
              Belum Ada Riwayat Pesan
            </span>
            <span className="text-[11px] max-w-xs">
              Pesan WhatsApp presensi atau pengumuman yang dikirim ke wali murid akan tercatat di sini.
            </span>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-3 shadow-sm border border-[#e2e8f0] dark:border-slate-700 flex flex-col divide-y divide-slate-100 dark:divide-slate-700/60">
            <div className="py-2.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#eff4ff] text-[#006398] flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-[12px] text-[#0b1c30] dark:text-slate-100 truncate">
                    Grup Paguyuban Orang Tua {currentUser?.className || 'Kelas'}
                  </span>
                  <span className="text-[11px] text-[#45464d] dark:text-slate-400 truncate">
                    Informasi Pembelajaran &amp; Presensi Kelas
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end shrink-0 text-[10px]">
                <span className="text-sky-600 font-semibold flex items-center gap-0.5">
                  <span>✔✔</span> Terkirim
                </span>
                <span className="text-[#45464d] dark:text-slate-400">Hari ini</span>
              </div>
            </div>

            {students[0] && (
              <div className="py-2.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-[12px] text-[#0b1c30] dark:text-slate-100 truncate">
                      {students[0].parentName ? `${students[0].parentName} (Wali ${students[0].name})` : `Wali Murid ${students[0].name}`}
                    </span>
                    <span className="text-[11px] text-[#45464d] dark:text-slate-400 truncate">
                      Laporan Kehadiran &amp; Pembinaan Murid
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end shrink-0 text-[10px]">
                  <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                    <span>✔✔</span> Terhubung
                  </span>
                  <span className="text-[#45464d] dark:text-slate-400">Hari ini</span>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
