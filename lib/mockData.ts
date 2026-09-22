import { Student, AttendanceRecord, BehaviorRecord, TeacherUser, WhatsAppMessageTemplate } from '@/types';
import { getCurrentAcademicYear } from '@/lib/dateUtils';

export const DEFAULT_TEACHER: TeacherUser = {
  id: 'guru-utama',
  name: 'Bapak/Ibu Wali Kelas',
  nip: '19900101 201501 1 001',
  email: 'walikelas@sekolah.sch.id',
  role: 'Wali Kelas',
  className: 'Kelas VII-A',
  schoolName: 'SMP Negeri 1',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUCVerHn8tk2JrXyIoA3re0jDuAj5vSIq1LyHt9GOz2yM3rrNiDfygefyREnxeHPbmfu7xZPUHpk6jkxeHX9wFNlW_j8m7usFaMWzMK6T5P5aPNai09_n0rJi4QxEz-vIFah2u2g6WMvPkGraWnwIMWP3zacA33EJzeKlYEHkztzxL6cyEIVEapOySEUUaBEJhyBsO61WfrU3fRtT08VbNuRR1_eb-XJLtnCSvKlt-aMD7yNIJFSiSAw',
  academicYear: getCurrentAcademicYear(),
  semester: 'Genap',
};

export const LOGO_URL = 'https://lh3.googleusercontent.com/aida/AEtjO1UYP6BjTAWohtUOEffEEQJryBkJHW6USeNdEUyEb5KAlUeT4EBcYHeQmMre2XqDAZaqLAluT0BNgTu-WUZvb9izwxmQfNlA-oMO2FDBmNzEmV8pGneaM2yqeAc_wI7nLGgnMR_mt7medHbNC_ZNU6YIkvwaz7QHiSzOEBOfW6ORoxwW4G9-cuwVg0BIyDi8a9z89zsYv3gjLVWcMsr1B2dG9fv2po6qyP9SEed87ABNPaPCIkbFdrYNhiA';

// Bersih dari data dummy - pengguna memulai dengan data kelas yang riil
export const INITIAL_STUDENTS: Student[] = [];

// Initial attendance records (kosong untuk kelas baru)
export const INITIAL_ATTENDANCE: Record<string, AttendanceRecord> = {};

// Initial behavior records (kosong untuk kelas baru)
export const INITIAL_BEHAVIOR_RECORDS: BehaviorRecord[] = [];

export const WHATSAPP_TEMPLATES: WhatsAppMessageTemplate[] = [
  {
    id: 'tpl-01',
    category: 'Absensi',
    title: 'Pemberitahuan Ketidakhadiran Hari Ini',
    targetLabel: 'Orang Tua / Wali Siswa Tidak Hadir',
    description: 'Konfirmasi kehadiran otomatis bagi ananda yang belum hadir di presensi pagi.',
    content: `Assalamu'alaikum Wr. Wb.
Selamat pagi Bapak/Ibu Wali Murid.

Semoga senantiasa dalam keadaan sehat dan penuh berkah.
Kami dari pihak sekolah menginformasikan bahwa ananda *{NAMA_SISWA}* hari ini ({TANGGAL}) belum hadir di ruang kelas tanpa keterangan.

Mohon konfirmasi jika ananda sedang sakit atau ada kendala izin keluarga, agar kami dapat mencatat kehadiran di buku presensi sekolah dengan benar.

Terima kasih banyak atas perhatian dan kerja samanya.
Hormat kami,
*Wali Kelas*`,
  },
  {
    id: 'tpl-02',
    category: 'Paguyuban',
    title: 'Undangan Evaluasi Tengah Semester (PTS)',
    targetLabel: 'Grup WhatsApp Paguyuban Orang Tua Kelas',
    description: 'Undangan tatap muka evaluasi belajar triwulan dan perkembangan karakter siswa.',
    content: `Assalamu'alaikum Wr. Wb.
Selamat pagi Bapak/Ibu Wali Murid yang kami hormati.

Menindaklanjuti kegiatan belajar siswa, kami mengundang Bapak/Ibu untuk hadir dalam pertemuan Paguyuban Kelas:

📅 Hari/Tanggal: {TANGGAL}
⏰ Waktu: 09.00 - 11.30 WIB
📍 Tempat: Ruang Pertemuan Sekolah
Agenda: Pembagian Ledger Capaian Belajar, Sosialisasi Projek Penguatan Karakter P5, dan Diskusi Persiapan Ujian.

Kehadiran Bapak/Ibu sangat berarti bagi kesuksesan belajar putra-putri kita.
Wassalamu'alaikum Wr. Wb.
*Wali Kelas*`,
  },
  {
    id: 'tpl-03',
    category: 'Apresiasi',
    title: 'Apresiasi Prestasi & Budi Pekerti',
    targetLabel: 'Orang Tua Siswa Berprestasi',
    description: 'Pujian hangat atas dedikasi belajar, budi pekerti, atau pertolongan sesama kawan.',
    content: `Assalamu'alaikum Wr. Wb.
Selamat pagi Bapak/Ibu Wali Murid.

Kabar gembira dari sekolah! Kami ingin menyampaikan apresiasi setinggi-tingginya atas sikap teladan dan prestasi ananda *{NAMA_SISWA}* hari ini di sekolah.

Terima kasih kepada Bapak/Ibu yang senantiasa membimbing ananda dengan nilai-nilai kepedulian yang luar biasa di rumah. Semoga ananda senantiasa berprestasi dan membanggakan keluarga.

Hormat kami,
*Wali Kelas*`,
  },
];
