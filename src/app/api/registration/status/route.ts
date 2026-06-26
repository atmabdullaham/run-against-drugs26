import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureAdminSeeded } from "@/lib/auth";

// Ensure admin is seeded on first API call
let seeded = false;
async function ensureSeeded() {
  if (!seeded) {
    await ensureAdminSeeded();
    seeded = true;
  }
}

// GET /api/registration/status?phone=01XXXXXXXXX
// Returns the registration status for a given phone number
export async function GET(request: NextRequest) {
  await ensureSeeded();
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone")?.trim();

    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Validate Bangladeshi phone format
    if (!/^01[0-9]{9}$/.test(phone)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid 11-digit phone number (01XXXXXXXXX)" },
        { status: 400 }
      );
    }

    const registration = await db.registration.findFirst({
      where: { phoneNumber: phone },
      orderBy: { createdAt: "desc" },
    });

    if (!registration) {
      return NextResponse.json({ success: true, found: false });
    }

    return NextResponse.json({
      success: true,
      found: true,
      registration: {
        ...registration,
        createdAt: registration.createdAt.toISOString(),
        updatedAt: registration.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to check registration status" },
      { status: 500 }
    );
  }
}
