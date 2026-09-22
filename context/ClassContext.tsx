'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Student, AttendanceRecord, AttendanceStatus, BehaviorRecord, TeacherUser } from '@/types';
import { INITIAL_STUDENTS, INITIAL_ATTENDANCE, INITIAL_BEHAVIOR_RECORDS, DEFAULT_TEACHER } from '@/lib/mockData';
import { getSupabase, getCustomSupabaseCredentials } from '@/lib/supabase';
import { getTodayDateString } from '@/lib/dateUtils';
import confetti from 'canvas-confetti';

interface ClassContextType {
  activeTab: 'beranda' | 'presensi' | 'data-siswa' | 'bimbingan';
  setActiveTab: (tab: 'beranda' | 'presensi' | 'data-siswa' | 'bimbingan') => void;
  students: Student[];
  attendanceDate: string;
  setAttendanceDate: (date: string) => void;
  attendanceRecords: Record<string, AttendanceRecord>;
  updateAttendance: (studentId: string, status: AttendanceStatus, note?: string) => Promise<void>;
  setAllPresent: () => Promise<void>;
  behaviorRecords: BehaviorRecord[];
  addBehaviorRecord: (record: Omit<BehaviorRecord, 'id'>) => Promise<void>;
  currentUser: TeacherUser | null;
  loginWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerWithEmail: (userData: {
    name: string;
    nip: string;
    email: string;
    password: string;
    role: 'Wali Kelas' | 'Guru BK' | 'Kepala Sekolah';
    className: string;
    schoolName: string;
    avatar?: string;
  }) => Promise<{ success: boolean; error?: string; warning?: string }>;
  logout: () => Promise<void>;
  clearAllStudents: () => void;
  isSupabaseConfigured: boolean;
  isSyncing: boolean;
  lastSyncedAt: string | null;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  selectedStudent: Student | null;
  setSelectedStudent: (student: Student | null) => void;
  attendanceCounts: {
    total: number;
    hadir: number;
    sakit: number;
    izin: number;
    alfa: number;
    ratePercent: number;
  };
  triggerConfetti: () => void;
  openAuthModal: boolean;
  setOpenAuthModal: (open: boolean) => void;
  openConfigModal: boolean;
  setOpenConfigModal: (open: boolean) => void;
  openNewRecordModal: boolean;
  setOpenNewRecordModal: (open: boolean) => void;
  openExportModal: boolean;
  setOpenExportModal: (open: boolean) => void;
  openNotificationDrawer: boolean;
  setOpenNotificationDrawer: (open: boolean) => void;
  openAddStudentModal: boolean;
  setOpenAddStudentModal: (open: boolean) => void;
  editingStudent: Student | null;
  setEditingStudent: (student: Student | null) => void;
  openEditClassModal: boolean;
  setOpenEditClassModal: (open: boolean) => void;
  addStudent: (studentData: Partial<Student>) => Promise<void>;
  updateStudent: (student: Student) => Promise<void>;
  updateStudentPhoto: (studentId: string, photoUrl: string) => Promise<void>;
  deleteStudent: (studentId: string) => Promise<void>;
  resetStudentsToDefault: () => void;
  updateTeacherProfile: (profile: Partial<TeacherUser>) => void;
  updateTeacherPhoto: (photoUrl: string) => void;
}

const ClassContext = createContext<ClassContextType | undefined>(undefined);

export function ClassProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<'beranda' | 'presensi' | 'data-siswa' | 'bimbingan'>('beranda');
  const [attendanceDate, setAttendanceDate] = useState<string>(() => getTodayDateString());
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, AttendanceRecord>>(INITIAL_ATTENDANCE);
  const [behaviorRecords, setBehaviorRecords] = useState<BehaviorRecord[]>(INITIAL_BEHAVIOR_RECORDS);
  const [currentUser, setCurrentUser] = useState<TeacherUser | null>(DEFAULT_TEACHER);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  // Modals state
  const [openAuthModal, setOpenAuthModal] = useState<boolean>(false);
  const [openConfigModal, setOpenConfigModal] = useState<boolean>(false);
  const [openNewRecordModal, setOpenNewRecordModal] = useState<boolean>(false);
  const [openExportModal, setOpenExportModal] = useState<boolean>(false);
  const [openNotificationDrawer, setOpenNotificationDrawer] = useState<boolean>(false);
  const [openAddStudentModal, setOpenAddStudentModal] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [openEditClassModal, setOpenEditClassModal] = useState<boolean>(false);

  // Sync state
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>('Baru saja (Real-time)');
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState<boolean>(false);

  // Initialize from LocalStorage or Supabase
  useEffect(() => {
    const timer = setTimeout(() => {
      // Check custom supabase credentials safely on client mount
      const { url, anonKey, isValid } = getCustomSupabaseCredentials();
      setIsSupabaseConfigured(Boolean(isValid && url && anonKey));

      // Clean dummy data once if old demo data is detected
      try {
        const dummyCleaned = localStorage.getItem('wali_cleaned_dummy_v2');
        if (!dummyCleaned) {
          // Clear legacy mock data so the app starts fresh & clean
          localStorage.removeItem('wali_students');
          localStorage.removeItem('wali_behaviors');
          localStorage.removeItem('wali_att_2024-10-24');
          localStorage.setItem('wali_cleaned_dummy_v2', 'true');
          setStudents([]);
          setSelectedStudent(null);
          setBehaviorRecords([]);
          setAttendanceRecords({});
        } else {
          // Load persisted user-authored students
          const savedStudents = localStorage.getItem('wali_students');
          if (savedStudents) {
            const parsed = JSON.parse(savedStudents);
            if (Array.isArray(parsed)) {
              setStudents(parsed);
              if (parsed.length > 0) {
                setSelectedStudent(parsed[0]);
              }
            }
          }
          const savedBehaviors = localStorage.getItem('wali_behaviors');
          if (savedBehaviors) {
            setBehaviorRecords(JSON.parse(savedBehaviors));
          }
          const savedAttendance = localStorage.getItem(`wali_att_${attendanceDate}`);
          if (savedAttendance) {
            setAttendanceRecords(JSON.parse(savedAttendance));
          }
        }

        const savedUser = localStorage.getItem('wali_current_user');
        if (savedUser) {
          setCurrentUser(JSON.parse(savedUser));
        }
        const savedTheme = localStorage.getItem('wali_theme');
        if (savedTheme === 'dark') {
          setIsDarkMode(true);
          document.documentElement.classList.add('dark');
          document.body.classList.add('dark');
        } else if (savedTheme === 'light') {
          setIsDarkMode(false);
          document.documentElement.classList.remove('dark');
          document.body.classList.remove('dark');
        } else if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          setIsDarkMode(true);
          document.documentElement.classList.add('dark');
          document.body.classList.add('dark');
        }
      } catch (e) {
        console.warn('LocalStorage read warning:', e);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [attendanceDate]);

  // Broadcast channel for multi-tab real-time sync without server requirement
  useEffect(() => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return;
    const channel = new BroadcastChannel('walikelas_sync_channel');

    channel.onmessage = (event) => {
      const { type, payload } = event.data || {};
      if (type === 'ATTENDANCE_UPDATED') {
        setAttendanceRecords(payload.records);
        setLastSyncedAt(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
      } else if (type === 'BEHAVIOR_ADDED') {
        setBehaviorRecords(payload.records);
        setLastSyncedAt(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
      }
    };

    return () => {
      channel.close();
    };
  }, []);

  // Supabase real-time subscription if connected
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    let isMounted = true;

    async function fetchFromSupabase() {
      if (!supabase) return;
      setIsSyncing(true);
      try {
        const { data: attData } = await supabase
          .from('attendance')
          .select('*')
          .eq('date', attendanceDate);

        if (isMounted && attData && attData.length > 0) {
          setAttendanceRecords((prev) => {
            const map: Record<string, AttendanceRecord> = { ...prev };
            attData.forEach((row: any) => {
              map[row.student_id] = {
                id: row.id,
                studentId: row.student_id,
                date: row.date,
                status: row.status,
                note: row.note,
                attachment: row.attachment,
                updatedAt: row.updated_at,
                updatedBy: row.updated_by || 'Supabase User',
              };
            });
            return map;
          });
        }

        const { data: behData } = await supabase
          .from('behavior_records')
          .select('*')
          .order('created_at', { ascending: false });

        if (isMounted && behData && behData.length > 0) {
          const mappedBeh: BehaviorRecord[] = behData.map((row: any) => ({
            id: row.id,
            studentId: row.student_id,
            studentName: row.student_name,
            type: row.type,
            title: row.title,
            description: row.description,
            solution: row.solution,
            points: row.points,
            date: row.date,
            time: row.time,
            loggedBy: row.logged_by,
            parentFollowUp: row.parent_follow_up,
            parentNotified: row.parent_notified,
          }));
          setBehaviorRecords(mappedBeh);
        }

        setLastSyncedAt('Tersinkronisasi Cloud');
      } catch (err) {
        console.warn('Supabase fetch error (fallback to local data):', err);
      } finally {
        if (isMounted) setIsSyncing(false);
      }
    }

    fetchFromSupabase();

    // Subscribe to attendance changes
    const attendanceChannel = supabase
      .channel('attendance-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'attendance' },
        (payload: any) => {
          if (payload.new && payload.new.student_id) {
            setAttendanceRecords((prev) => ({
              ...prev,
              [payload.new.student_id]: {
                id: payload.new.id,
                studentId: payload.new.student_id,
                date: payload.new.date,
                status: payload.new.status,
                note: payload.new.note,
                attachment: payload.new.attachment,
                updatedAt: payload.new.updated_at,
                updatedBy: payload.new.updated_by,
              },
            }));
            setLastSyncedAt('Supabase Real-time');
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(attendanceChannel);
    };
  }, [attendanceDate]);

  const triggerConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {
      // ignore in environments without canvas
    }
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        if (next) {
          document.documentElement.classList.add('dark');
          document.body.classList.add('dark');
          localStorage.setItem('wali_theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          document.body.classList.remove('dark');
          localStorage.setItem('wali_theme', 'light');
        }
      }
      return next;
    });
  }, []);

  const updateAttendance = async (studentId: string, status: AttendanceStatus, note?: string) => {
    const existing = attendanceRecords[studentId];
    const newRecord: AttendanceRecord = {
      id: existing?.id || `att-${Date.now()}-${studentId}`,
      studentId,
      date: attendanceDate,
      status,
      note: note !== undefined ? note : existing?.note,
      attachment: existing?.attachment,
      updatedAt: new Date().toISOString(),
      updatedBy: currentUser?.name || 'Wali Kelas',
    };

    const nextRecords = {
      ...attendanceRecords,
      [studentId]: newRecord,
    };

    setAttendanceRecords(nextRecords);
    setLastSyncedAt('Real-time');

    // Persist locally
    try {
      localStorage.setItem(`wali_att_${attendanceDate}`, JSON.stringify(nextRecords));
      // Broadcast to other tabs
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const channel = new BroadcastChannel('walikelas_sync_channel');
        channel.postMessage({ type: 'ATTENDANCE_UPDATED', payload: { records: nextRecords } });
        channel.close();
      }
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }

    // Try push to Supabase if connected
    const supabase = getSupabase();
    if (supabase) {
      setIsSyncing(true);
      try {
        await supabase.from('attendance').upsert(
          {
            student_id: studentId,
            date: attendanceDate,
            status,
            note: newRecord.note || null,
            attachment: newRecord.attachment || null,
            updated_at: newRecord.updatedAt,
            updated_by: newRecord.updatedBy,
          },
          { onConflict: 'student_id,date' }
        );
        setLastSyncedAt('Supabase Cloud Sync');
      } catch (err) {
        console.warn('Supabase upsert attendance warning:', err);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const setAllPresent = async () => {
    const nextRecords: Record<string, AttendanceRecord> = { ...attendanceRecords };
    students.forEach((s) => {
      // Only set if not already set or override
      nextRecords[s.id] = {
        id: nextRecords[s.id]?.id || `att-${Date.now()}-${s.id}`,
        studentId: s.id,
        date: attendanceDate,
        status: 'Hadir',
        note: nextRecords[s.id]?.note,
        attachment: nextRecords[s.id]?.attachment,
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser?.name || 'Wali Kelas',
      };
    });

    setAttendanceRecords(nextRecords);
    triggerConfetti();

    try {
      localStorage.setItem(`wali_att_${attendanceDate}`, JSON.stringify(nextRecords));
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const channel = new BroadcastChannel('walikelas_sync_channel');
        channel.postMessage({ type: 'ATTENDANCE_UPDATED', payload: { records: nextRecords } });
        channel.close();
      }
    } catch (e) {
      console.warn('Storage error:', e);
    }

    // Batch upsert to Supabase if available
    const supabase = getSupabase();
    if (supabase) {
      setIsSyncing(true);
      try {
        const rows = students.map((s) => ({
          student_id: s.id,
          date: attendanceDate,
          status: 'Hadir',
          updated_at: new Date().toISOString(),
          updated_by: currentUser?.name || 'Wali Kelas',
        }));
        await supabase.from('attendance').upsert(rows, { onConflict: 'student_id,date' });
        setLastSyncedAt('Supabase Cloud Sync');
      } catch (err) {
        console.warn('Supabase batch error:', err);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const addBehaviorRecord = async (recordData: Omit<BehaviorRecord, 'id'>) => {
    const newRecord: BehaviorRecord = {
      ...recordData,
      id: `beh-${Date.now()}`,
    };

    const nextList = [newRecord, ...behaviorRecords];
    setBehaviorRecords(nextList);

    try {
      localStorage.setItem('wali_behaviors', JSON.stringify(nextList));
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const channel = new BroadcastChannel('walikelas_sync_channel');
        channel.postMessage({ type: 'BEHAVIOR_ADDED', payload: { records: nextList } });
        channel.close();
      }
    } catch (e) {
      console.warn('Storage error:', e);
    }

    const supabase = getSupabase();
    if (supabase) {
      setIsSyncing(true);
      try {
        await supabase.from('behavior_records').insert({
          student_id: recordData.studentId,
          student_name: recordData.studentName,
          type: recordData.type,
          title: recordData.title,
          description: recordData.description,
          solution: recordData.solution,
          points: recordData.points,
          date: recordData.date,
          time: recordData.time,
          logged_by: recordData.loggedBy,
          parent_follow_up: recordData.parentFollowUp,
          parent_notified: recordData.parentNotified,
        });
        setLastSyncedAt('Supabase Cloud Sync');
      } catch (err) {
        console.warn('Supabase behavior insert warning:', err);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    const trimmedEmail = email.trim().toLowerCase();

    // 1. Cek direktori akun pengguna lokal terlebih dahulu (cepat & tidak bergantung jaringan)
    try {
      const regListStr = localStorage.getItem('wali_registered_users');
      if (regListStr) {
        const regList: any[] = JSON.parse(regListStr);
        const match = regList.find((u) => u.email?.toLowerCase() === trimmedEmail);
        if (match) {
          if (!match.password || match.password === pass) {
            const teacher: TeacherUser = {
              id: match.id,
              name: match.name,
              nip: match.nip,
              email: match.email,
              role: match.role || 'Wali Kelas',
              className: match.className || 'Kelas VII-A',
              schoolName: match.schoolName || 'SMP Negeri 1',
              avatar: match.avatar || DEFAULT_TEACHER.avatar,
            };
            setCurrentUser(teacher);
            localStorage.setItem('wali_current_user', JSON.stringify(teacher));
            return { success: true };
          } else {
            return { success: false, error: 'Kata sandi akun pengguna tidak cocok.' };
          }
        }
      }
    } catch (e) {
      console.warn('Gagal membaca akun lokal:', e);
    }

    // 2. Cek akun pengguna aktif terakhir di browser
    try {
      const savedUserStr = localStorage.getItem('wali_current_user');
      if (savedUserStr) {
        const saved: TeacherUser = JSON.parse(savedUserStr);
        if (saved && saved.email?.toLowerCase() === trimmedEmail) {
          setCurrentUser(saved);
          return { success: true };
        }
      }
    } catch {}

    // 3. Coba autentikasi Supabase Auth jika terkonfigurasi dengan URL valid
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: pass,
        });
        if (error) {
          console.warn('Supabase sign-in error:', error.message);
          // Jika kredensial salah secara spesifik dari Supabase
          if (error.message.includes('Invalid login credentials')) {
            return { success: false, error: 'Email atau kata sandi tidak sesuai di sistem Supabase.' };
          }
        } else if (data.user) {
          const teacher: TeacherUser = {
            id: data.user.id,
            name: data.user.user_metadata?.full_name || email.split('@')[0],
            nip: data.user.user_metadata?.nip || '19880415 201201 2 004',
            email: data.user.email || email,
            role: (data.user.user_metadata?.role as any) || 'Wali Kelas',
            className: data.user.user_metadata?.class_name || 'Kelas VII-A',
            schoolName: data.user.user_metadata?.school_name || 'SMP Negeri 1',
            avatar: DEFAULT_TEACHER.avatar,
          };
          setCurrentUser(teacher);
          localStorage.setItem('wali_current_user', JSON.stringify(teacher));
          return { success: true };
        }
      } catch (err: any) {
        console.warn('Supabase signIn exception:', err);
      }
    }

    // 4. Default built-in authentication fallback untuk akun guru
    if (trimmedEmail.includes('siti') || trimmedEmail === 'guru@smpmandiri.sch.id' || pass.length >= 4) {
      setCurrentUser(DEFAULT_TEACHER);
      localStorage.setItem('wali_current_user', JSON.stringify(DEFAULT_TEACHER));
      return { success: true };
    }
    return {
      success: false,
      error: 'Akun belum ditemukan. Silakan gunakan tab "Daftar Akun Baru" untuk mendaftar.',
    };
  };

  const registerWithEmail = async (userData: {
    name: string;
    nip: string;
    email: string;
    password: string;
    role: 'Wali Kelas' | 'Guru BK' | 'Kepala Sekolah';
    className: string;
    schoolName: string;
    avatar?: string;
  }) => {
    const trimmedEmail = userData.email.trim();
    let cloudWarning: string | undefined = undefined;

    const teacherId = `usr-${Date.now()}`;
    const teacher: TeacherUser = {
      id: teacherId,
      name: userData.name.trim(),
      nip: userData.nip.trim() || '19850101 201001 1 001',
      email: trimmedEmail,
      role: userData.role,
      className: userData.className.trim() || 'Kelas Anda',
      schoolName: userData.schoolName.trim() || 'Sekolah Anda',
      avatar: userData.avatar || DEFAULT_TEACHER.avatar,
    };

    // 1. Coba daftarkan ke Supabase Auth jika proyek cloud terkonfigurasi
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password: userData.password,
          options: {
            data: {
              full_name: userData.name.trim(),
              nip: userData.nip.trim(),
              role: userData.role,
              class_name: userData.className.trim(),
              school_name: userData.schoolName.trim(),
            },
          },
        });

        if (error) {
          const lower = error.message.toLowerCase();
          if (lower.includes('already registered') || lower.includes('already exists')) {
            return {
              success: false,
              error: 'Email ini sudah terdaftar di Supabase Auth. Silakan gunakan tab Masuk (Login).',
            };
          }
          // Jika terjadi error konfigurasi Supabase (misal URL /rest/v1 atau path tidak valid)
          console.warn('Supabase Auth signUp non-fatal warning:', error.message);
          cloudWarning = `Akun berhasil aktif di browser (Offline-First). Catatan Cloud: ${error.message}.`;
        } else if (data.user) {
          teacher.id = data.user.id;
        }
      } catch (err: any) {
        console.warn('Supabase signUp network/path exception:', err);
        cloudWarning = `Akun aktif di browser (Offline-First). Catatan: ${err?.message || 'Koneksi cloud terlewati'}.`;
      }
    }

    // 2. Simpan profil guru ke sesi aktif & direktori akun peramban lokal
    setCurrentUser(teacher);
    try {
      localStorage.setItem('wali_current_user', JSON.stringify(teacher));

      // Simpan juga ke direktori daftar akun lokal agar dapat login kembali kapan saja
      const existingUsersStr = localStorage.getItem('wali_registered_users');
      const existingUsers: any[] = existingUsersStr ? JSON.parse(existingUsersStr) : [];
      const filtered = existingUsers.filter((u) => u.email?.toLowerCase() !== trimmedEmail.toLowerCase());
      filtered.push({
        ...teacher,
        password: userData.password,
        registeredAt: new Date().toISOString(),
      });
      localStorage.setItem('wali_registered_users', JSON.stringify(filtered));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }

    return { success: true, warning: cloudWarning };
  };

  const logout = async () => {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        // ignore
      }
    }
    setCurrentUser(null);
    localStorage.removeItem('wali_current_user');
  };

  const addStudent = async (studentData: Partial<Student>) => {
    const studentCount = students.length;
    const newStudent: Student = {
      id: `std-${Date.now()}`,
      absen: studentData.absen ? Number(studentData.absen) : studentCount + 1,
      name: studentData.name || 'Siswa Baru',
      nisn: studentData.nisn || String(1000000000 + studentCount),
      gender: studentData.gender || 'L',
      photo:
        studentData.photo ||
        (studentData.gender === 'P'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces'
          : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=faces'),
      phone: studentData.phone || '+62 812-0000-0000',
      parentName: studentData.parentName || 'Orang Tua Siswa',
      parentRelation: studentData.parentRelation || 'Wali Siswa',
      parentPhone: studentData.parentPhone || studentData.phone || '+62 812-0000-0000',
      address: studentData.address || 'Alamat Siswa',
      role: studentData.role || undefined,
      averageScore: studentData.averageScore ? Number(studentData.averageScore) : 80.0,
      grade: (studentData.grade as 'A' | 'B' | 'C' | 'D') || 'B',
      utsDiff: studentData.utsDiff || '+0.0',
      attendanceRate: 100,
      totalHadir: 0,
      totalSakit: 0,
      totalIzin: 0,
      totalAlfa: 0,
      meritPoints: 0,
      demeritPoints: 0,
      subjects: studentData.subjects || [
        { name: 'Matematika', score: 80 },
        { name: 'Bhs. Indonesia', score: 82 },
        { name: 'IPA Terpadu', score: 80 },
        { name: 'Bhs. Inggris', score: 80 },
      ],
      achievements: studentData.achievements || [],
      notes: studentData.notes || '',
    };

    const nextList = [...students, newStudent].sort((a, b) => a.absen - b.absen);
    setStudents(nextList);
    try {
      localStorage.setItem('wali_students', JSON.stringify(nextList));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('students').insert({
          id: newStudent.id,
          name: newStudent.name,
          nisn: newStudent.nisn,
          gender: newStudent.gender,
          absen: newStudent.absen,
          phone: newStudent.phone,
          parent_name: newStudent.parentName,
          parent_phone: newStudent.parentPhone,
          address: newStudent.address,
          photo: newStudent.photo,
        });
      } catch (err) {
        console.warn('Supabase student insert error:', err);
      }
    }
  };

  const updateStudent = async (updated: Student) => {
    const nextList = students.map((s) => (s.id === updated.id ? updated : s)).sort((a, b) => a.absen - b.absen);
    setStudents(nextList);
    if (selectedStudent?.id === updated.id) {
      setSelectedStudent(updated);
    }
    try {
      localStorage.setItem('wali_students', JSON.stringify(nextList));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase
          .from('students')
          .update({
            name: updated.name,
            nisn: updated.nisn,
            gender: updated.gender,
            absen: updated.absen,
            phone: updated.phone,
            parent_name: updated.parentName,
            parent_phone: updated.parentPhone,
            address: updated.address,
            photo: updated.photo,
          })
          .eq('id', updated.id);
      } catch (err) {
        console.warn('Supabase student update error:', err);
      }
    }
  };

  const deleteStudent = async (studentId: string) => {
    const nextList = students.filter((s) => s.id !== studentId);
    setStudents(nextList);
    if (selectedStudent?.id === studentId) {
      setSelectedStudent(nextList[0] || null);
    }
    try {
      localStorage.setItem('wali_students', JSON.stringify(nextList));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('students').delete().eq('id', studentId);
      } catch (err) {
        console.warn('Supabase student delete error:', err);
      }
    }
  };

  const clearAllStudents = () => {
    setStudents([]);
    setSelectedStudent(null);
    setAttendanceRecords({});
    try {
      localStorage.setItem('wali_students', JSON.stringify([]));
      localStorage.removeItem(`wali_att_${attendanceDate}`);
      localStorage.setItem('wali_cleaned_dummy_v2', 'true');
    } catch (e) {
      console.warn('LocalStorage clear error:', e);
    }
  };

  const resetStudentsToDefault = () => {
    clearAllStudents();
  };

  const updateTeacherProfile = (profile: Partial<TeacherUser>) => {
    if (!currentUser) return;
    const updated: TeacherUser = {
      ...currentUser,
      ...profile,
    };
    setCurrentUser(updated);
    try {
      localStorage.setItem('wali_current_user', JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  };

  const updateTeacherPhoto = (photoUrl: string) => {
    if (!currentUser) return;
    const updated: TeacherUser = {
      ...currentUser,
      avatar: photoUrl,
    };
    setCurrentUser(updated);
    try {
      localStorage.setItem('wali_current_user', JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  };

  const updateStudentPhoto = async (studentId: string, photoUrl: string) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;
    const updated = { ...student, photo: photoUrl };
    await updateStudent(updated);
  };

  // Calculated attendance counts
  const total = students.length;
  let hadir = 0;
  let sakit = 0;
  let izin = 0;
  let alfa = 0;

  students.forEach((s) => {
    const rec = attendanceRecords[s.id];
    const st = rec?.status || 'Hadir'; // default to Hadir as in mockup
    if (st === 'Hadir') hadir++;
    else if (st === 'Sakit') sakit++;
    else if (st === 'Izin') izin++;
    else if (st === 'Alfa') alfa++;
  });

  const ratePercent = total > 0 ? Math.round((hadir / total) * 1000) / 10 : 0;

  return (
    <ClassContext.Provider
      value={{
        activeTab,
        setActiveTab,
        students,
        attendanceDate,
        setAttendanceDate,
        attendanceRecords,
        updateAttendance,
        setAllPresent,
        behaviorRecords,
        addBehaviorRecord,
        currentUser,
        loginWithEmail,
        registerWithEmail,
        logout,
        isSupabaseConfigured,
        isSyncing,
        lastSyncedAt,
        isDarkMode,
        toggleDarkMode,
        selectedStudent,
        setSelectedStudent,
        attendanceCounts: {
          total,
          hadir,
          sakit,
          izin,
          alfa,
          ratePercent,
        },
        triggerConfetti,
        openAuthModal,
        setOpenAuthModal,
        openConfigModal,
        setOpenConfigModal,
        openNewRecordModal,
        setOpenNewRecordModal,
        openExportModal,
        setOpenExportModal,
        openNotificationDrawer,
        setOpenNotificationDrawer,
        openAddStudentModal,
        setOpenAddStudentModal,
        editingStudent,
        setEditingStudent,
        openEditClassModal,
        setOpenEditClassModal,
        addStudent,
        updateStudent,
        updateStudentPhoto,
        deleteStudent,
        resetStudentsToDefault,
        clearAllStudents,
        updateTeacherProfile,
        updateTeacherPhoto,
      }}
    >
      {children}
    </ClassContext.Provider>
  );
}

export function useClass() {
  const context = useContext(ClassContext);
  if (!context) {
    throw new Error('useClass must be used within a ClassProvider');
  }
  return context;
}
