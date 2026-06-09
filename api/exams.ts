// ============================================================
// Exams API - GET/POST/PUT/DELETE /api/exams
// Study Hub Lahore
// ============================================================

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { readFile, readAndUpdate, generateId } from "./_github.js";
import { requireAuth } from "./_auth.js";
import type { ExamsData, Exam, Question } from "./_types.js";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    // GET - List exams (filtered by role)
    if (req.method === "GET") {
      const user = await requireAuth(req, res, ["admin", "teacher", "student"]);
      if (!user) return;

      const { content } = await readFile("data/exams.json");
      const data = content as ExamsData;

      let exams = data.exams;

      // Filter by specific exam ID (for taking an exam)
      const examId = req.query.examId as string | undefined;
      if (examId) {
        const exam = exams.find((e) => e.id === examId);
        if (!exam) {
          return res.status(404).json({ success: false, error: "Exam not found" });
        }

        // For students: strip correctAnswer from questions
        if (user.role === "student") {
          const sanitized = {
            ...exam,
            questions: exam.questions.map((q) => ({
              id: q.id,
              text: q.text,
              options: q.options,
            })),
          };
          return res.status(200).json({ success: true, data: sanitized });
        }

        return res.status(200).json({ success: true, data: exam });
      }

      // Role-based filtering
      if (user.role === "teacher") {
        exams = exams.filter((e) => e.createdBy === user.id);
      } else if (user.role === "student") {
        // Students only see approved exams (class matching done on frontend/dashboard)
        exams = exams
          .filter((e) => e.status === "approved")
          .map((e) => ({
            ...e,
            questions: e.questions.map((q) => ({
              id: q.id,
              text: q.text,
              options: q.options,
            })),
          })) as Exam[];
      }

      // Filter by status query param
      const status = req.query.status as string | undefined;
      if (status) {
        exams = exams.filter((e) => e.status === status);
      }

      return res.status(200).json({ success: true, data: exams });
    }

    // POST - Create exam (teacher or admin)
    if (req.method === "POST") {
      const user = await requireAuth(req, res, ["teacher", "admin"]);
      if (!user) return;

      const { title, subject, class: examClass, duration, questions } = req.body;

      if (!title || !subject || !examClass || !duration || !questions) {
        return res.status(400).json({
          success: false,
          error: "Title, subject, class, duration, and questions are required",
        });
      }

      if (!Array.isArray(questions) || questions.length === 0) {
        return res
          .status(400)
          .json({ success: false, error: "At least one question is required" });
      }

      const newData = await readAndUpdate<ExamsData>(
        "data/exams.json",
        (data) => {
          const newExam: Exam = {
            id: generateId("EXM", data.exams),
            title,
            subject,
            class: examClass,
            createdBy: user.id,
            duration: Number(duration),
            totalMarks: questions.length,
            status: "pending",
            questions: questions.map((q: any, i: number) => ({
              id: `q${i + 1}`,
              text: q.text,
              options: q.options,
              correctAnswer: Number(q.correctAnswer),
            })),
            createdAt: new Date().toISOString(),
          };

          return { exams: [...data.exams, newExam] };
        },
        `Create exam: ${title}`
      );

      const created = newData.exams[newData.exams.length - 1];
      return res.status(201).json({ success: true, data: created });
    }

    // PUT - Approve/Reject exam (admin only)
    if (req.method === "PUT") {
      const user = await requireAuth(req, res, ["admin"]);
      if (!user) return;

      const { id, status } = req.body;

      if (!id || !status) {
        return res
          .status(400)
          .json({ success: false, error: "Exam ID and status are required" });
      }

      if (!["approved", "rejected"].includes(status)) {
        return res
          .status(400)
          .json({ success: false, error: "Status must be 'approved' or 'rejected'" });
      }

      const newData = await readAndUpdate<ExamsData>(
        "data/exams.json",
        (data) => {
          const exams = data.exams.map((e) =>
            e.id === id
              ? {
                  ...e,
                  status,
                  approvedAt: new Date().toISOString(),
                  approvedBy: user.email,
                }
              : e
          );
          return { exams };
        },
        `${status} exam: ${id}`
      );

      const updated = newData.exams.find((e) => e.id === id);
      return res.status(200).json({ success: true, data: updated });
    }

    // DELETE - Remove exam (admin only)
    if (req.method === "DELETE") {
      const user = await requireAuth(req, res, ["admin"]);
      if (!user) return;

      const { id } = req.body;

      if (!id) {
        return res
          .status(400)
          .json({ success: false, error: "Exam ID is required" });
      }

      await readAndUpdate<ExamsData>(
        "data/exams.json",
        (data) => {
          const exams = data.exams.filter((e) => e.id !== id);
          return { exams };
        },
        `Delete exam: ${id}`
      );

      return res
        .status(200)
        .json({ success: true, data: { message: "Exam deleted" } });
    }

    return res.status(405).json({ success: false, error: "Method not allowed" });
  } catch (err: any) {
    console.error("Exams API error:", err);
    return res
      .status(500)
      .json({ success: false, error: err.message || "Internal server error" });
  }
}
