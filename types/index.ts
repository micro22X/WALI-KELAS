export type AttendanceStatus = 'Hadir' | 'Sakit' | 'Izin' | 'Alfa';

export interface Student {
  id: string;
  absen: number;
  name: string;
  nisn: string;
  gender: 'L' | 'P';
  photo: string;
  phone: string;
  parentName: string;
  parentRelation: string;
  parentPhone: string;
  address: string;
  role?: string; // e.g. "Ketua Kelas IX-B", "Sekretaris"
  averageScore: number;
  grade: 'A' | 'B' | 'C' | 'D';
  utsDiff: string;
  attendanceRate: number; // e.g. 98
  totalHadir: number;
  totalSakit: number;
  totalIzin: number;
  totalAlfa: number;
  meritPoints: number;
  demeritPoints: number;
  subjects: {
    name: string;
    score: number;
  }[];
  achievements: string[];
  notes?: string;
  needsAttention?: boolean;
  attentionReason?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  note?: string;
  attachment?: {
    name: string;
    url?: string;
    verified: boolean;
  };
  updatedAt: string;
  updatedBy: string;
}

export interface BehaviorRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentNisn?: string;
  type: 'Konseling Bimbingan' | 'Apresiasi Prestasi' | 'Pelanggaran' | 'Pelanggaran Disiplin';
  title: string;
  description: string;
  solution?: string;
  points: number; // e.g. +10, -5
  date: string;
  time: string;
  loggedBy?: string;
  recordedBy?: string;
  parentFollowUp?: boolean;
  parentNotified?: boolean;
}

export interface TeacherUser {
  id: string;
  name: string;
  nip: string;
  email: string;
  role: 'Wali Kelas' | 'Guru BK' | 'Kepala Sekolah';
  className: string;
  schoolName: string;
  avatar: string;
  academicYear?: string;
  semester?: string;
}

export interface WhatsAppMessageTemplate {
  id: string;
  category: 'Absensi' | 'Paguyuban' | 'Apresiasi';
  title: string;
  targetLabel: string;
  description: string;
  content: string;
}
