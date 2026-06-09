// ============================================================
// Banned Users API - GET/POST/DELETE /api/banned
// Study Hub Lahore
// ============================================================

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { readFile, readAndUpdate, generateId } from "./_github";
import { requireAuth } from "./_auth";
import type { BannedData, BannedUser } from "./_types";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    // GET - List all banned users (admin only)
    if (req.method === "GET") {
      const user = await requireAuth(req, res, ["admin"]);
      if (!user) return;

      const { content } = await readFile("data/banned.json");
      const data = content as BannedData;
      return res.status(200).json({ success: true, data: data.users });
    }

    // POST - Ban a user (admin only)
    if (req.method === "POST") {
      const user = await requireAuth(req, res, ["admin"]);
      if (!user) return;

      const { email, role, reason } = req.body;

      if (!email || !role) {
        return res
          .status(400)
          .json({ success: false, error: "Email and role are required" });
      }

      const newData = await readAndUpdate<BannedData>(
        "data/banned.json",
        (data) => {
          // Check if already banned
          const exists = data.users.find(
            (u) => u.email.toLowerCase() === email.toLowerCase()
          );
          if (exists) {
            throw new Error("This user is already banned");
          }

          const newBan: BannedUser = {
            id: generateId("BAN", data.users),
            email,
            role,
            reason: reason || "No reason provided",
            bannedAt: new Date().toISOString(),
            bannedBy: user.email,
          };

          return { users: [...data.users, newBan] };
        },
        `Ban user: ${email}`
      );

      const created = newData.users[newData.users.length - 1];
      return res.status(201).json({ success: true, data: created });
    }

    // DELETE - Unban a user (admin only)
    if (req.method === "DELETE") {
      const user = await requireAuth(req, res, ["admin"]);
      if (!user) return;

      const { email } = req.body;

      if (!email) {
        return res
          .status(400)
          .json({ success: false, error: "Email is required" });
      }

      await readAndUpdate<BannedData>(
        "data/banned.json",
        (data) => {
          const users = data.users.filter(
            (u) => u.email.toLowerCase() !== email.toLowerCase()
          );
          return { users };
        },
        `Unban user: ${email}`
      );

      return res
        .status(200)
        .json({ success: true, data: { message: "User unbanned" } });
    }

    return res.status(405).json({ success: false, error: "Method not allowed" });
  } catch (err: any) {
    console.error("Banned API error:", err);
    return res
      .status(500)
      .json({ success: false, error: err.message || "Internal server error" });
  }
}
