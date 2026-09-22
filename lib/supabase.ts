import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default environment credentials if provided
const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const envAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let clientInstance: SupabaseClient | null = null;

/**
 * Membersihkan URL Supabase agar tidak mengandung path '/rest/v1', '/auth/v1',
 * tanda petik, spasi, atau trailing slash yang menyebabkan error:
 * "Invalid path specified in request URL" (PGRST125).
 */
export function sanitizeSupabaseUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  let clean = rawUrl.trim();
  // Hapus tanda kutip jika ada
  clean = clean.replace(/^["']|["']$/g, '');
  
  // Pastikan memiliki skema protokol
  if (clean && !clean.startsWith('http://') && !clean.startsWith('https://')) {
    clean = `https://${clean}`;
  }

  try {
    const parsed = new URL(clean);
    // Supabase client HANYA membutuhkan origin (protokol + host + port jika ada)
    // Abaikan path seperti /rest/v1, /auth/v1, atau query string
    return parsed.origin;
  } catch {
    // Fallback regex jika parsing URL gagal
    return clean
      .replace(/\/(rest|auth|graphql|storage)\/.*$/i, '')
      .replace(/\/+$/, '');
  }
}

/**
 * Memeriksa apakah kredensial Supabase benar-benar valid dan bukan placeholder.
 */
export function isRealSupabaseConfigured(url: string, anonKey: string): boolean {
  const cleanUrl = sanitizeSupabaseUrl(url);
  const cleanKey = (anonKey || '').trim().replace(/^["']|["']$/g, '');

  if (!cleanUrl || !cleanKey) return false;

  // Cek apakah nilai masih dummy / placeholder
  const isDummyUrl =
    cleanUrl.includes('your-project-id') ||
    cleanUrl.includes('xyzcompany') ||
    cleanUrl.includes('example.com') ||
    cleanUrl.includes('<your-project-ref>');
  const isDummyKey =
    cleanKey.includes('your-anon-key') ||
    cleanKey.length < 20;

  if (isDummyUrl || isDummyKey) {
    return false;
  }

  try {
    const parsed = new URL(cleanUrl);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export function getCustomSupabaseCredentials(): {
  url: string;
  anonKey: string;
  isValid: boolean;
} {
  if (typeof window === 'undefined') {
    const cleanEnv = sanitizeSupabaseUrl(envUrl);
    const valid = isRealSupabaseConfigured(cleanEnv, envAnonKey);
    return { url: cleanEnv, anonKey: envAnonKey, isValid: valid };
  }

  const customUrl = localStorage.getItem('wali_supabase_url') || envUrl;
  const customKey = localStorage.getItem('wali_supabase_anon_key') || envAnonKey;
  const sanitizedUrl = sanitizeSupabaseUrl(customUrl);
  const sanitizedKey = (customKey || '').trim().replace(/^["']|["']$/g, '');
  const isValid = isRealSupabaseConfigured(sanitizedUrl, sanitizedKey);

  return {
    url: sanitizedUrl,
    anonKey: sanitizedKey,
    isValid,
  };
}

export function setCustomSupabaseCredentials(url: string, anonKey: string) {
  if (typeof window !== 'undefined') {
    const sanitizedUrl = sanitizeSupabaseUrl(url);
    const sanitizedKey = (anonKey || '').trim().replace(/^["']|["']$/g, '');

    if (sanitizedUrl && sanitizedKey && isRealSupabaseConfigured(sanitizedUrl, sanitizedKey)) {
      localStorage.setItem('wali_supabase_url', sanitizedUrl);
      localStorage.setItem('wali_supabase_anon_key', sanitizedKey);
    } else {
      localStorage.removeItem('wali_supabase_url');
      localStorage.removeItem('wali_supabase_anon_key');
    }
    clientInstance = null; // reset client instance
  }
}

export function getSupabase(): SupabaseClient | null {
  const { url, anonKey, isValid } = getCustomSupabaseCredentials();

  if (!isValid || !url || !anonKey) {
    return null;
  }

  if (!clientInstance) {
    try {
      clientInstance = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
        realtime: {
          params: {
            eventsPerSecond: 10,
          },
        },
      });
    } catch (err) {
      console.warn('Gagal inisialisasi client Supabase:', err);
      return null;
    }
  }

  return clientInstance;
}

export const SUPABASE_SQL_SCHEMA = `-- Skema SQL untuk WaliKelas IX-B (Supabase PostgreSQL)
-- Jalankan di SQL Editor Supabase Anda:

-- 1. Tabel Siswa
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  absen INTEGER NOT NULL,
  name TEXT NOT NULL,
  nisn TEXT UNIQUE NOT NULL,
  gender CHAR(1) NOT NULL,
  photo TEXT,
  phone TEXT,
  parent_name TEXT,
  parent_relation TEXT,
  parent_phone TEXT,
  address TEXT,
  role TEXT,
  average_score NUMERIC(5,2) DEFAULT 0.00,
  grade CHAR(1) DEFAULT 'B',
  uts_diff TEXT DEFAULT '+0.0',
  attendance_rate NUMERIC(5,2) DEFAULT 100.00,
  total_hadir INTEGER DEFAULT 0,
  total_sakit INTEGER DEFAULT 0,
  total_izin INTEGER DEFAULT 0,
  total_alfa INTEGER DEFAULT 0,
  merit_points INTEGER DEFAULT 0,
  demerit_points INTEGER DEFAULT 0,
  subjects JSONB DEFAULT '[]'::jsonb,
  achievements TEXT[] DEFAULT '{}',
  notes TEXT,
  needs_attention BOOLEAN DEFAULT FALSE,
  attention_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel Presensi Harian
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT NOT NULL,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Hadir', 'Sakit', 'Izin', 'Alfa')),
  note TEXT,
  attachment JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT,
  UNIQUE(student_id, date)
);

-- 3. Tabel Catatan Pembinaan & Karakter
CREATE TABLE IF NOT EXISTS behavior_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  solution TEXT,
  points INTEGER DEFAULT 0,
  date DATE NOT NULL,
  time TIME NOT NULL,
  logged_by TEXT,
  parent_follow_up BOOLEAN DEFAULT FALSE,
  parent_notified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Aktifkan Real-time untuk semua tabel
ALTER PUBLICATION supabase_realtime ADD TABLE students;
ALTER PUBLICATION supabase_realtime ADD TABLE attendance;
ALTER PUBLICATION supabase_realtime ADD TABLE behavior_records;
`;
