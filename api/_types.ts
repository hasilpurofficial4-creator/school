// ============================================================
// Types for Serverless API Functions (Study Hub Lahore)
// Duplicated from src/types/index.ts to avoid cross-compilation
// ============================================================

export type StudentClass = "9th" | "10th" | "11th" | "12th";

export type UserRole = "admin" | "teacher" | "student";

export type ExamStatus = "pending" | "approved" | "rejected";

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
  correctAnswer: number;
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  class: StudentClass;
  createdBy: string;
  duration: number;
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
  timeTaken: number;
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

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
