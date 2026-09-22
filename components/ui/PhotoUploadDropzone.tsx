'use client';

import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  Camera,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Link2,
  RefreshCw,
} from 'lucide-react';
import { compressAndResizeImage } from '@/lib/imageUtils';

interface PresetItem {
  label: string;
  url: string;
}

interface PhotoUploadDropzoneProps {
  id?: string;
  value: string;
  onChange: (url: string) => void;
  onClear?: () => void;
  label?: string;
  sublabel?: string;
  presets?: PresetItem[];
  shape?: 'circle' | 'rounded';
  aspectRatio?: 'square' | 'portrait';
}

export default function PhotoUploadDropzone({
  id = 'photo-uploader',
  value,
  onChange,
  onClear,
  label = 'Foto Profil Sesungguhnya',
  sublabel = 'Format JPG, PNG, atau WebP (otomatis dikompres optimal)',
  presets = [],
  shape = 'rounded',
}: PhotoUploadDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState('');

  const handleProcessFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Harap pilih file gambar (JPG, PNG, atau WebP)');
      return;
    }

    // Limit maximum raw file size to 15MB before client-side compression
    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg('Ukuran file terlalu besar. Maksimal 15 MB.');
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMsg(null);
      const result = await compressAndResizeImage(file, 480, 480, 0.84);
      onChange(result.dataUrl);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal memproses gambar.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
    // reset value so re-uploading same file triggers change
    if (e.target) e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrl.trim()) return;
    onChange(manualUrl.trim());
    setManualUrl('');
    setShowUrlInput(false);
  };

  const isCustomPhoto =
    Boolean(value) && (value.startsWith('data:image/') || !presets.some((p) => p.url === value));

  return (
    <div className="flex flex-col gap-2.5 w-full">
      {/* Header Label */}
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-[12px] font-semibold text-[#0b1c30] dark:text-slate-200">
            {label}
          </label>
          {sublabel && (
            <p className="text-[10px] text-[#45464d] dark:text-slate-400">{sublabel}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] font-medium text-[#006398] dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Link2 className="w-3 h-3" />
          <span>{showUrlInput ? 'Tutup URL' : 'Input URL Web'}</span>
        </button>
      </div>

      {/* Manual URL Input dropdown */}
      {showUrlInput && (
        <form onSubmit={handleApplyUrl} className="flex gap-2 animate-in fade-in">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://contoh.com/foto-anda.jpg"
            className="flex-1 h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-[12px] text-[#0b1c30] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#006398]"
          />
          <button
            type="submit"
            className="px-3 h-9 rounded-xl bg-[#006398] hover:bg-sky-700 text-white text-[11px] font-semibold transition-colors cursor-pointer"
          >
            Terapkan
          </button>
        </form>
      )}

      {/* Main Upload Dropzone Container */}
      <div
        id={id}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group rounded-2xl border-2 border-dashed p-3 sm:p-4 transition-all cursor-pointer flex flex-col sm:flex-row items-center gap-4 ${
          isDragging
            ? 'border-[#006398] bg-sky-50/70 dark:bg-sky-950/40 scale-[1.01]'
            : 'border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/60 hover:border-[#006398]/50 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp, image/gif"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Preview Thumbnail */}
        <div className="relative shrink-0">
          <div
            className={`w-16 h-16 sm:w-20 sm:h-20 overflow-hidden bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-slate-700 shadow-md flex items-center justify-center ${
              shape === 'circle' ? 'rounded-full' : 'rounded-2xl'
            }`}
          >
            {value ? (
              <img
                src={value}
                alt="Pratinjau Foto"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            ) : (
              <ImageIcon className="w-8 h-8 text-slate-400" />
            )}
          </div>

          {/* Camera Badge */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#006398] text-white flex items-center justify-center shadow-md ring-2 ring-white dark:ring-slate-900">
            <Camera className="w-3 h-3" />
          </div>
        </div>

        {/* Dropzone text and action prompts */}
        <div className="flex-1 text-center sm:text-left min-w-0">
          <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-1">
            <UploadCloud className="w-4 h-4 text-[#006398] dark:text-sky-400" />
            <span className="text-[13px] font-bold text-[#0b1c30] dark:text-slate-100">
              {isProcessing ? 'Memproses & Mengompres Foto...' : 'Unggah Foto dari Perangkat'}
            </span>
          </div>

          <p className="text-[11px] text-[#45464d] dark:text-slate-400">
            Klik untuk memilih foto atau tarik dan lepas (drag &amp; drop) foto di sini.
          </p>

          {isCustomPhoto && (
            <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3 h-3" />
              <span>Foto Asli Terpasang</span>
            </div>
          )}
        </div>

        {/* Action button inside dropzone */}
        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="h-8 px-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-[#006398] dark:text-sky-300 text-[11px] font-bold shadow-sm transition-colors cursor-pointer flex items-center gap-1"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Pilih Berkas</span>
          </button>

          {value && (
            <button
              type="button"
              onClick={() => {
                if (onClear) {
                  onClear();
                } else if (presets.length > 0) {
                  onChange(presets[0].url);
                } else {
                  onChange('');
                }
              }}
              title="Reset foto"
              className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900 flex items-center justify-center transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Error display */}
      {errorMsg && (
        <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-[11px] flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Preset alternatives if user wants fallback */}
      {presets.length > 0 && (
        <div className="space-y-1 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
              Atau Pilih Avatar Contoh:
            </span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onChange(preset.url)}
                className={`relative shrink-0 w-10 h-10 rounded-xl overflow-hidden transition-all cursor-pointer ${
                  value === preset.url
                    ? 'ring-2 ring-[#006398] scale-105 shadow-md'
                    : 'opacity-65 hover:opacity-100'
                }`}
                title={preset.label}
              >
                <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
