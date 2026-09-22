import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'WaliKelas - Presensi & Bimbingan Siswa',
  description:
    'Aplikasi pendamping Wali Kelas digital dengan manajemen presensi real-time, data siswa & rekap nilai, konseling & bimbingan, integrasi WhatsApp ortu, dan autentikasi Supabase.',
  openGraph: {
    title: 'WaliKelas - Presensi & Bimbingan Siswa',
    description:
      'Aplikasi pendamping Wali Kelas digital dengan manajemen presensi real-time, data siswa & rekap nilai, konseling & bimbingan, integrasi WhatsApp ortu, dan autentikasi Supabase.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WaliKelas - Presensi & Bimbingan Siswa',
    description:
      'Aplikasi pendamping Wali Kelas digital dengan manajemen presensi real-time, data siswa & rekap nilai, konseling & bimbingan, integrasi WhatsApp ortu, dan autentikasi Supabase.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
