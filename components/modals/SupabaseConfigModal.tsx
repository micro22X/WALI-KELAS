'use client';

import React, { useState } from 'react';
import { useClass } from '@/context/ClassContext';
import {
  getCustomSupabaseCredentials,
  setCustomSupabaseCredentials,
  sanitizeSupabaseUrl,
  isRealSupabaseConfigured,
  SUPABASE_SQL_SCHEMA,
} from '@/lib/supabase';
import { Database, X, Save, Check, Copy, AlertTriangle } from 'lucide-react';

export default function SupabaseConfigModal() {
  const { openConfigModal, setOpenConfigModal, isSupabaseConfigured, lastSyncedAt } = useClass();

  const current = getCustomSupabaseCredentials();
  const [url, setUrl] = useState(current.url);
  const [anonKey, setAnonKey] = useState(current.anonKey);
  const [copiedSql, setCopiedSql] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!openConfigModal) return null;

  const hasPathError = url.includes('/rest') || url.includes('/auth') || url.endsWith('/');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = sanitizeSupabaseUrl(url);
    const cleanKey = anonKey.trim();
    setCustomSupabaseCredentials(cleanUrl, cleanKey);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      window.location.reload();
    }, 1000);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div
      id="modal-supabase-config"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
    >
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-5 shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <div className="flex flex-col">
              <h3 className="font-display font-bold text-[16px] text-[#0b1c30] dark:text-slate-100">
                Pengaturan Database Supabase
              </h3>
              <span className="text-[11px] text-[#45464d] dark:text-slate-400">
                Real-time Sync &amp; PostgreSQL Backend
              </span>
            </div>
          </div>
          <button
            onClick={() => setOpenConfigModal(false)}
            className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status indicator */}
        <div
          className={`p-3 rounded-2xl border flex items-center justify-between gap-2 ${
            isSupabaseConfigured
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
              : 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isSupabaseConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'
              }`}
            />
            <div className="flex flex-col">
              <span className="font-semibold text-[12px]">
                {isSupabaseConfigured
                  ? 'Terhubung ke Proyek Supabase'
                  : 'Mode Real-time Browser Aktif'}
              </span>
              <span className="text-[10px] opacity-85">
                {isSupabaseConfigured
                  ? `Status sinkronisasi: ${lastSyncedAt}`
                  : 'Data tersimpan otomatis & sinkron antar tab'}
              </span>
            </div>
          </div>

          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 shadow-xs">
            {isSupabaseConfigured ? 'Cloud Live' : 'Local+Broadcast'}
          </span>
        </div>

        {/* Form to enter/update credentials */}
        <form onSubmit={handleSave} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-[#0b1c30] dark:text-slate-300">
                Supabase Project URL (Root Domain)
              </label>
              {url && hasPathError && (
                <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Akan dibersihkan otomatis ke root URL
                </span>
              )}
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://xyzabcdefghijkl.supabase.co"
              className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-[12px] text-[#0b1c30] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Gunakan URL utama proyek saja (tanpa akhiran <code>/rest/v1</code> atau tanda garis miring di ujung).
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-[#0b1c30] dark:text-slate-300">
              Supabase Anon Public API Key
            </label>
            <input
              type="password"
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-[12px] text-[#0b1c30] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {saveSuccess && (
            <p className="text-[11px] text-emerald-600 font-semibold">
              Kredensial tersimpan! Memperbarui koneksi real-time...
            </p>
          )}

          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[12px] flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan &amp; Hubungkan</span>
            </button>
            {url && (
              <button
                type="button"
                onClick={() => {
                  setCustomSupabaseCredentials('', '');
                  setUrl('');
                  setAnonKey('');
                  window.location.reload();
                }}
                className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 text-[11px] font-semibold cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </form>

        {/* Copy SQL Schema Box */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
              Skema Tabel SQL Supabase (3 Tabel)
            </span>
            <button
              onClick={handleCopySql}
              className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'Tersalin!' : 'Salin SQL'}</span>
            </button>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            Jalankan skema ini di menu SQL Editor Supabase untuk membuat tabel <code>students</code>,{' '}
            <code>attendance</code>, dan <code>behavior_records</code> beserta publikasi Realtime.
          </p>
          <pre className="text-[9px] font-mono bg-white dark:bg-slate-950 p-2 rounded-lg border border-slate-200 dark:border-slate-800 max-h-28 overflow-y-auto text-slate-700 dark:text-slate-300">
            {SUPABASE_SQL_SCHEMA}
          </pre>
        </div>
      </div>
    </div>
  );
}
