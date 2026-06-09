// ============================================================
// Results API - GET/POST /api/results
// Study Hub Lahore - Server-side scoring
// ============================================================

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { readFile, readAndUpdate, generateId } from "./_github";
import { requireAuth } from "./_auth";
import type { ResultsData, ExamsData, StudentsData, Settings, Result } from "./_types";

// Calculate grade from percentage and grade scale
function calculateGrade(percentage: number, gradeScale: Record<string, number>): string {
  const sorted = Object.entries(gradeScale).sort((a, b) => b[1] - a[1]);
  for (const [grade, threshold] of sorted) {
    if (percentage >= threshold) return grade;
  }
  return "F";
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    // POST - Submit exam result (student only)
    if (req.method === "POST") {
      const user = await requireAuth(req, res, ["student"]);
      if (!user) return;

      const { examId, answers, timeTaken } = req.body;

      if (!examId || !Array.isArray(answers)) {
        return res.status(400).json({
          success: false,
          error: "Exam ID and answers array are required",
        });
      }

      // Check if student already submitted this exam
      const { content: resultsContent } = await readFile("data/results.json");
      const resultsData = resultsContent as ResultsData;
      const alreadySubmitted = resultsData.results.find(
        (r) => r.examId === examId && r.studentId === user.id
      );
      if (alreadySubmitted) {
        return res
          .status(400)
          .json({ success: false, error: "You have already submitted this exam" });
      }

      // Get exam with correct answers for scoring
      const { content: examsContent } = await readFile("data/exams.json");
      const examsData = examsContent as ExamsData;
      const exam = examsData.exams.find((e) => e.id === examId);

      if (!exam) {
        return res.status(404).json({ success: false, error: "Exam not found" });
      }

      if (exam.status !== "approved") {
        return res
          .status(400)
          .json({ success: false, error: "Exam is not approved" });
      }

      // Server-side scoring
      let score = 0;
      for (let i = 0; i < exam.questions.length; i++) {
        if (answers[i] === exam.questions[i].correctAnswer) {
          score++;
        }
      }

      const totalMarks = exam.questions.length;
      const percentage = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;

      // Get grade scale from settings
      let gradeScale: Record<string, number> = {
        "A+": 90,
        A: 80,
        B: 70,
        C: 60,
        D: 50,
        F: 0,
      };
      try {
        const { content: settingsContent } = await readFile("data/settings.json");
        const settings = settingsContent as Settings;
        if (settings.gradeScale) {
          gradeScale = settings.gradeScale;
        }
      } catch {
        // Use default grade scale
      }

      const grade = calculateGrade(percentage, gradeScale);

      // Get student name and class
      let studentName = user.email;
      let studentClass = "" as any;
      try {
        const { content: studentsContent } = await readFile("data/students.json");
        const studentsData = studentsContent as StudentsData;
        const student = studentsData.students.find((s) => s.id === user.id);
        if (student) {
          studentName = student.name;
          studentClass = student.class;
        }
      } catch {
        // Use email as fallback
      }

      const result: Result = {
        id: "", // Will be set after readAndUpdate
        studentId: user.id,
        studentName,
        studentClass,
        examId,
        examTitle: exam.title,
        answers,
        score,
        totalMarks,
        percentage,
        grade,
        timeTaken: Number(timeTaken) || 0,
        submittedAt: new Date().toISOString(),
      };

      const newData = await readAndUpdate<ResultsData>(
        "data/results.json",
        (data) => {
          const newResult: Result = {
            ...result,
            id: generateId("RSL", data.results),
          };
          return { results: [...data.results, newResult] };
        },
        `Submit result: ${exam.title} by ${user.email}`
      );

      const created = newData.results[newData.results.length - 1];
      return res.status(201).json({ success: true, data: created });
    }

    // GET - Get results
    if (req.method === "GET") {
      const user = await requireAuth(req, res, ["admin", "student", "teacher"]);
      if (!user) return;

      const { content } = await readFile("data/results.json");
      const data = content as ResultsData;

      // Single result by ID
      const resultId = req.query.resultId as string | undefined;
      if (resultId) {
        const result = data.results.find((r) => r.id === resultId);
        if (!result) {
          return res.status(404).json({ success: false, error: "Result not found" });
        }
        // Students can only see their own results
        if (user.role === "student" && result.studentId !== user.id) {
          return res.status(403).json({ success: false, error: "Access denied" });
        }
        return res.status(200).json({ success: true, data: result });
      }

      // Filter by exam
      const examId = req.query.examId as string | undefined;

      let results = data.results;

      if (examId) {
        results = results.filter((r) => r.examId === examId);
      }

      // Students only see their own results
      if (user.role === "student") {
        results = results.filter((r) => r.studentId === user.id);
      }

      // Teachers see results for their exams
      if (user.role === "teacher") {
        const { content: examsContent } = await readFile("data/exams.json");
        const examsData = examsContent as ExamsData;
        const teacherExamIds = examsData.exams
          .filter((e) => e.createdBy === user.id)
          .map((e) => e.id);
        results = results.filter((r) => teacherExamIds.includes(r.examId));
      }

      return res.status(200).json({ success: true, data: results });
    }

    return res.status(405).json({ success: false, error: "Method not allowed" });
  } catch (err: any) {
    console.error("Results API error:", err);
    return res
      .status(500)
      .json({ success: false, error: err.message || "Internal server error" });
  }
}
