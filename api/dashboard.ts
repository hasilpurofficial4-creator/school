// ============================================================
// Dashboard API - GET /api/dashboard
// Study Hub Lahore - Aggregated data per role
// ============================================================

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { readFile } from "./_github";
import { requireAuth } from "./_auth";
import type {
  StudentsData,
  TeachersData,
  ExamsData,
  ResultsData,
  BannedData,
} from "./_types";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const user = await requireAuth(req, res, ["admin", "teacher", "student"]);
    if (!user) return;

    // ============================================================
    // ADMIN DASHBOARD
    // ============================================================
    if (user.role === "admin") {
      const [studentsRes, teachersRes, examsRes, resultsRes, bannedRes] =
        await Promise.all([
          readFile("data/students.json"),
          readFile("data/teachers.json"),
          readFile("data/exams.json"),
          readFile("data/results.json"),
          readFile("data/banned.json"),
        ]);

      const students = (studentsRes.content as StudentsData).students;
      const teachers = (teachersRes.content as TeachersData).teachers;
      const exams = (examsRes.content as ExamsData).exams;
      const results = (resultsRes.content as ResultsData).results;
      const banned = (bannedRes.content as BannedData).users;

      return res.status(200).json({
        success: true,
        data: {
          students,
          teachers,
          exams,
          results,
          banned,
          stats: {
            totalStudents: students.length,
            totalTeachers: teachers.length,
            pendingExams: exams.filter((e) => e.status === "pending").length,
            totalResults: results.length,
            activeBans: banned.length,
          },
        },
      });
    }

    // ============================================================
    // TEACHER DASHBOARD
    // ============================================================
    if (user.role === "teacher") {
      const [examsRes, resultsRes] = await Promise.all([
        readFile("data/exams.json"),
        readFile("data/results.json"),
      ]);

      const allExams = (examsRes.content as ExamsData).exams;
      const allResults = (resultsRes.content as ResultsData).results;

      const teacherExams = allExams.filter((e) => e.createdBy === user.id);
      const teacherExamIds = teacherExams.map((e) => e.id);
      const teacherResults = allResults.filter((r) =>
        teacherExamIds.includes(r.examId)
      );

      return res.status(200).json({
        success: true,
        data: {
          exams: teacherExams,
          results: teacherResults,
          stats: {
            totalExams: teacherExams.length,
            pendingExams: teacherExams.filter((e) => e.status === "pending")
              .length,
            approvedExams: teacherExams.filter((e) => e.status === "approved")
              .length,
            totalResults: teacherResults.length,
          },
        },
      });
    }

    // ============================================================
    // STUDENT DASHBOARD
    // ============================================================
    if (user.role === "student") {
      // Get student info for class matching
      const studentsRes = await readFile("data/students.json");
      const students = (studentsRes.content as StudentsData).students;
      const student = students.find((s) => s.id === user.id);

      if (!student) {
        return res
          .status(404)
          .json({ success: false, error: "Student record not found" });
      }

      const [examsRes, resultsRes] = await Promise.all([
        readFile("data/exams.json"),
        readFile("data/results.json"),
      ]);

      const allExams = (examsRes.content as ExamsData).exams;
      const allResults = (resultsRes.content as ResultsData).results;

      // Approved exams matching student's class (without correct answers)
      const availableExams = allExams
        .filter((e) => e.status === "approved" && e.class === student.class)
        .map((e) => ({
          ...e,
          questions: e.questions.map((q) => ({
            id: q.id,
            text: q.text,
            options: q.options,
          })),
        }));

      // Student's results
      const studentResults = allResults.filter(
        (r) => r.studentId === user.id
      );

      // Filter out exams already taken
      const completedExamIds = studentResults.map((r) => r.examId);
      const pendingExams = availableExams.filter(
        (e) => !completedExamIds.includes(e.id)
      );

      const avgScore =
        studentResults.length > 0
          ? Math.round(
              studentResults.reduce((sum, r) => sum + r.percentage, 0) /
                studentResults.length
            )
          : 0;

      return res.status(200).json({
        success: true,
        data: {
          availableExams: pendingExams,
          results: studentResults,
          studentInfo: student,
          stats: {
            availableExams: pendingExams.length,
            completedExams: studentResults.length,
            averageScore: avgScore,
          },
        },
      });
    }

    return res.status(400).json({ success: false, error: "Invalid role" });
  } catch (err: any) {
    console.error("Dashboard API error:", err);
    return res
      .status(500)
      .json({ success: false, error: err.message || "Internal server error" });
  }
}
