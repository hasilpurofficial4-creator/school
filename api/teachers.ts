// ============================================================
// Teachers API - GET/POST/PUT/DELETE /api/teachers
// Study Hub Lahore
// ============================================================

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { readFile, readAndUpdate, generateId } from "./_github";
import { requireAuth } from "./_auth";
import type { TeachersData, Teacher } from "./_types";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    // GET - List all teachers (admin only)
    if (req.method === "GET") {
      const user = await requireAuth(req, res, ["admin"]);
      if (!user) return;

      const { content } = await readFile("data/teachers.json");
      const data = content as TeachersData;
      return res.status(200).json({ success: true, data: data.teachers });
    }

    // POST - Create teacher (admin only)
    if (req.method === "POST") {
      const user = await requireAuth(req, res, ["admin"]);
      if (!user) return;

      const { name, email, subject } = req.body;

      if (!name || !email) {
        return res
          .status(400)
          .json({ success: false, error: "Name and email are required" });
      }

      const newData = await readAndUpdate<TeachersData>(
        "data/teachers.json",
        (data) => {
          const exists = data.teachers.find(
            (t) => t.email.toLowerCase() === email.toLowerCase()
          );
          if (exists) {
            throw new Error("A teacher with this email already exists");
          }

          const newTeacher: Teacher = {
            id: generateId("TCH", data.teachers),
            name,
            email,
            subject: subject || "",
            createdAt: new Date().toISOString(),
          };

          return { teachers: [...data.teachers, newTeacher] };
        },
        `Add teacher: ${name}`
      );

      const created = newData.teachers[newData.teachers.length - 1];
      return res.status(201).json({ success: true, data: created });
    }

    // PUT - Update teacher (admin only)
    if (req.method === "PUT") {
      const user = await requireAuth(req, res, ["admin"]);
      if (!user) return;

      const { id, ...updates } = req.body;

      if (!id) {
        return res
          .status(400)
          .json({ success: false, error: "Teacher ID is required" });
      }

      const newData = await readAndUpdate<TeachersData>(
        "data/teachers.json",
        (data) => {
          const teachers = data.teachers.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          );
          return { teachers };
        },
        `Update teacher: ${id}`
      );

      const updated = newData.teachers.find((t) => t.id === id);
      return res.status(200).json({ success: true, data: updated });
    }

    // DELETE - Remove teacher (admin only)
    if (req.method === "DELETE") {
      const user = await requireAuth(req, res, ["admin"]);
      if (!user) return;

      const { id } = req.body;

      if (!id) {
        return res
          .status(400)
          .json({ success: false, error: "Teacher ID is required" });
      }

      await readAndUpdate<TeachersData>(
        "data/teachers.json",
        (data) => {
          const teachers = data.teachers.filter((t) => t.id !== id);
          return { teachers };
        },
        `Delete teacher: ${id}`
      );

      return res
        .status(200)
        .json({ success: true, data: { message: "Teacher deleted" } });
    }

    return res.status(405).json({ success: false, error: "Method not allowed" });
  } catch (err: any) {
    console.error("Teachers API error:", err);
    return res
      .status(500)
      .json({ success: false, error: err.message || "Internal server error" });
  }
}
