import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limit
const failedAttempts = new Map<string, { count: number; lockedUntil: number }>();

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
  const now = Date.now();

  // Check rate limit
  const record = failedAttempts.get(ip);
  if (record && record.lockedUntil > now) {
    const waitSec = Math.ceil((record.lockedUntil - now) / 1000);
    return NextResponse.json(
      { error: `too many attempts. try again in ${waitSec}s.` },
      { status: 429 }
    );
  }

  const { password } = await req.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json(
      { error: "admin not configured." },
      { status: 500 }
    );
  }

  if (password !== adminPassword) {
    // Track failed attempt
    const current = failedAttempts.get(ip) || { count: 0, lockedUntil: 0 };
    current.count += 1;
    if (current.count >= 5) {
      current.lockedUntil = now + 60_000; // 60s lockout
    }
    failedAttempts.set(ip, current);

    return NextResponse.json({ error: "wrong password." }, { status: 401 });
  }

  // Success — clear attempts, set cookie
  failedAttempts.delete(ip);

  const response = NextResponse.json({ success: true });
  response.cookies.set("slowhrs_admin", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return response;
}
