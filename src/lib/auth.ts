import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, SESSION_EXPIRY_HOURS, DEFAULT_ADMIN } from "@/lib/constants";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

// Password hashing using Node's built-in scrypt
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const hashBuf = Buffer.from(hash, "hex");
  const testBuf = scryptSync(password, salt, 64);
  if (hashBuf.length !== testBuf.length) return false;
  return timingSafeEqual(hashBuf, testBuf);
}

// Session management
export function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}

export async function createSession(adminId: string): Promise<string> {
  const token = generateSessionToken();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + SESSION_EXPIRY_HOURS);

  await db.adminSession.create({
    data: { token, adminId, expiresAt },
  });

  return token;
}

export async function getSession(): Promise<{ adminId: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await db.adminSession.findUnique({
    where: { token },
  });

  if (!session) return null;

  if (session.expiresAt < new Date()) {
    // Expired - clean up
    await db.adminSession.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }

  return { adminId: session.adminId };
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return;
  await db.adminSession.delete({ where: { token } }).catch(() => {});
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_EXPIRY_HOURS * 60 * 60,
  };
}

// Seed default admin if none exists
export async function ensureAdminSeeded(): Promise<void> {
  const count = await db.admin.count();
  if (count === 0) {
    await db.admin.create({
      data: {
        username: DEFAULT_ADMIN.username,
        passwordHash: hashPassword(DEFAULT_ADMIN.password),
      },
    });
  }
}
