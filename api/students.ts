// ============================================================
// Students API - GET/POST/PUT/DELETE /api/students
// Study Hub Lahore
// ============================================================

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { readFile, readAndUpdate, generateId } from "./_github";
import { requireAuth } from "./_auth";
import type { StudentsData, Student } from "./_types";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    // GET - List all students (admin only)
    if (req.method === "GET") {
      const user = await requireAuth(req, res, ["admin"]);
      if (!user) return;

      const { content } = await readFile("data/students.json");
      const data = content as StudentsData;
      return res.status(200).json({ success: true, data: data.students });
    }

    // POST - Create student (admin only)
    if (req.method === "POST") {
      const user = await requireAuth(req, res, ["admin"]);
      if (!user) return;

      const { name, email, class: studentClass, rollNo } = req.body;

      if (!name || !email || !studentClass) {
        return res
          .status(400)
          .json({ success: false, error: "Name, email, and class are required" });
      }

      const newData = await readAndUpdate<StudentsData>(
        "data/students.json",
        (data) => {
          // Check duplicate email
          const exists = data.students.find(
            (s) => s.email.toLowerCase() === email.toLowerCase()
          );
          if (exists) {
            throw new Error("A student with this email already exists");
          }

          const newStudent: Student = {
            id: generateId("STU", data.students),
            name,
            email,
            class: studentClass,
            rollNo: rollNo || "",
            createdAt: new Date().toISOString(),
          };

          return { students: [...data.students, newStudent] };
        },
        `Add student: ${name}`
      );

      const created = newData.students[newData.students.length - 1];
      return res.status(201).json({ success: true, data: created });
    }

    // PUT - Update student (admin only)
    if (req.method === "PUT") {
      const user = await requireAuth(req, res, ["admin"]);
      if (!user) return;

      const { id, ...updates } = req.body;

      if (!id) {
        return res
          .status(400)
          .json({ success: false, error: "Student ID is required" });
      }

      const newData = await readAndUpdate<StudentsData>(
        "data/students.json",
        (data) => {
          const students = data.students.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          );
          return { students };
        },
        `Update student: ${id}`
      );

      const updated = newData.students.find((s) => s.id === id);
      return res.status(200).json({ success: true, data: updated });
    }

    // DELETE - Remove student (admin only)
    if (req.method === "DELETE") {
      const user = await requireAuth(req, res, ["admin"]);
      if (!user) return;

      const { id } = req.body;

      if (!id) {
        return res
          .status(400)
          .json({ success: false, error: "Student ID is required" });
      }

      await readAndUpdate<StudentsData>(
        "data/students.json",
        (data) => {
          const students = data.students.filter((s) => s.id !== id);
          return { students };
        },
        `Delete student: ${id}`
      );

      return res
        .status(200)
        .json({ success: true, data: { message: "Student deleted" } });
    }

    return res.status(405).json({ success: false, error: "Method not allowed" });
  } catch (err: any) {
    console.error("Students API error:", err);
    return res
      .status(500)
      .json({ success: false, error: err.message || "Internal server error" });
  }
}
