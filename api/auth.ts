// ============================================================
// Auth Endpoint - POST /api/auth
// Study Hub Lahore - Login for Admin, Teacher, Student
// ============================================================

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { readFile } from "./_github";
import { signToken, isBanned } from "./_auth";
import type {
  StudentsData,
  TeachersData,
  UserRole,
} from "./_types";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { email, password, role } = req.body as {
      email: string;
      password: string;
      role: UserRole;
    };

    // Validate inputs
    if (!role || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Role and password are required" });
    }

    if (role !== "admin" && !email) {
      return res
        .status(400)
        .json({ success: false, error: "Email is required" });
    }

    // Check role password
    const passwords: Record<UserRole, string | undefined> = {
      admin: process.env.VITE_ADMIN_PASSWORD,
      teacher: process.env.VITE_TEACHER_PASSWORD,
      student: process.env.VITE_STUDENT_PASSWORD,
    };

    const expectedPassword = passwords[role];
    if (!expectedPassword || password !== expectedPassword) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid password" });
    }

    // Check if banned
    const checkEmail = email || "admin";
    if (role !== "admin") {
      const banned = await isBanned(checkEmail);
      if (banned) {
        return res
          .status(403)
          .json({ success: false, error: "You are banned from this system" });
      }
    }

    // Role-specific logic
    if (role === "admin") {
      const token = signToken({ id: "admin", role: "admin", email: email || "admin" });
      return res.status(200).json({
        success: true,
        data: {
          token,
          user: {
            id: "admin",
            name: "Administrator",
            role: "admin",
            email: email || "admin",
          },
        },
      });
    }

    if (role === "teacher") {
      const { content } = await readFile("data/teachers.json");
      const data = content as TeachersData;
      const teacher = data.teachers.find(
        (t) => t.email.toLowerCase() === email.toLowerCase()
      );

      if (!teacher) {
        return res
          .status(404)
          .json({ success: false, error: "Teacher not found. Contact admin." });
      }

      const token = signToken({
        id: teacher.id,
        role: "teacher",
        email: teacher.email,
      });

      return res.status(200).json({
        success: true,
        data: {
          token,
          user: {
            id: teacher.id,
            name: teacher.name,
            role: "teacher",
            email: teacher.email,
          },
        },
      });
    }

    if (role === "student") {
      const { content } = await readFile("data/students.json");
      const data = content as StudentsData;
      const student = data.students.find(
        (s) => s.email.toLowerCase() === email.toLowerCase()
      );

      if (!student) {
        return res
          .status(404)
          .json({ success: false, error: "Student not found. Contact admin." });
      }

      const token = signToken({
        id: student.id,
        role: "student",
        email: student.email,
      });

      return res.status(200).json({
        success: true,
        data: {
          token,
          user: {
            id: student.id,
            name: student.name,
            role: "student",
            email: student.email,
            class: student.class,
          },
        },
      });
    }

    return res
      .status(400)
      .json({ success: false, error: "Invalid role" });
  } catch (err: any) {
    console.error("Auth error:", err);
    return res
      .status(500)
      .json({ success: false, error: err.message || "Internal server error" });
  }
}
