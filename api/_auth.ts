// ============================================================
// Authentication Utilities
// Study Hub Lahore - JWT + Ban Checking
// ============================================================

import jwt from "jsonwebtoken";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { readFile } from "./_github";
import type { UserRole, BannedData } from "./_types";

interface TokenPayload {
  id: string;
  role: UserRole;
  email: string;
}

// ============================================================
// JWT Functions
// ============================================================

export function signToken(payload: TokenPayload): string {
  const secret = process.env.JWT_SECRET || "study-hub-lahore-secret-key";
  return jwt.sign(payload, secret, { expiresIn: "8h" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const secret = process.env.JWT_SECRET || "study-hub-lahore-secret-key";
    return jwt.verify(token, secret) as TokenPayload;
  } catch {
    return null;
  }
}

// ============================================================
// Extract user from request Authorization header
// ============================================================
export function extractUser(req: VercelRequest): TokenPayload | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.slice(7);
  return verifyToken(token);
}

// ============================================================
// Check if user is banned
// ============================================================
export async function isBanned(email: string): Promise<boolean> {
  try {
    const { content } = await readFile("data/banned.json");
    const data = content as BannedData;
    return data.users.some(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
  } catch {
    return false;
  }
}

// ============================================================
// Require authentication + role + ban check
// Returns user payload or null (and sends error response)
// ============================================================
export async function requireAuth(
  req: VercelRequest,
  res: VercelResponse,
  allowedRoles: UserRole[]
): Promise<TokenPayload | null> {
  const user = extractUser(req);

  if (!user) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return null;
  }

  // Check ban
  const banned = await isBanned(user.email);
  if (banned) {
    res
      .status(403)
      .json({ success: false, error: "You are banned from this system" });
    return null;
  }

  // Check role
  if (!allowedRoles.includes(user.role)) {
    res
      .status(403)
      .json({ success: false, error: "Insufficient permissions" });
    return null;
  }

  return user;
}
