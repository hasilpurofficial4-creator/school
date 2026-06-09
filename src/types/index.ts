// ============================================================
// Shared Types for Study Hub Lahore
// ============================================================

export type StudentClass = "9th" | "10th" | "11th" | "12th";

export type UserRole = "admin" | "teacher" | "student";

export type ExamStatus = "pending" | "approved" | "rejected";

// ============================================================
// Data Models
// ============================================================

export interface Student {
  id: string;
  name: string;
  email: string;
  class: StudentClass;
  rollNo: string;
  createdAt: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  subject: string;
  createdAt: string;
}

export interface Question {
  id: string;
  text: string;
  options: [string, string, string, string];
  correctAnswer: number; // index 0-3
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  class: StudentClass;
  createdBy: string; // teacher ID
  duration: number; // minutes
  totalMarks: number;
  status: ExamStatus;
  questions: Question[];
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
}

export interface Result {
  id: string;
  studentId: string;
  studentName: string;
  studentClass: StudentClass;
  examId: string;
  examTitle: string;
  answers: number[];
  score: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  timeTaken: number; // seconds
  submittedAt: string;
}

export interface BannedUser {
  id: string;
  email: string;
  role: UserRole;
  reason: string;
  bannedAt: string;
  bannedBy: string;
}

export interface Settings {
  version: number;
  institutionName: string;
  gradeScale: Record<string, number>;
}

// ============================================================
// API Types
// ============================================================

export interface LoginRequest {
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    role: UserRole;
    email: string;
    class?: StudentClass;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============================================================
// Data Store Shapes (JSON file wrappers)
// ============================================================

export interface StudentsData {
  students: Student[];
}

export interface TeachersData {
  teachers: Teacher[];
}

export interface ExamsData {
  exams: Exam[];
}

export interface ResultsData {
  results: Result[];
}

export interface BannedData {
  users: BannedUser[];
}

// ============================================================
// Dashboard Types
// ============================================================

export interface AdminDashboard {
  students: Student[];
  teachers: Teacher[];
  exams: Exam[];
  results: Result[];
  banned: BannedUser[];
  stats: {
    totalStudents: number;
    totalTeachers: number;
    pendingExams: number;
    totalResults: number;
    activeBans: number;
  };
}

export interface TeacherDashboard {
  exams: Exam[];
  results: Result[];
  stats: {
    totalExams: number;
    pendingExams: number;
    approvedExams: number;
    totalResults: number;
  };
}

export interface StudentDashboard {
  availableExams: Exam[];
  results: Result[];
  stats: {
    availableExams: number;
    completedExams: number;
    averageScore: number;
  };
}
