import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { TSHIRT_SIZES, ACADEMIC_LEVELS } from "@/lib/constants";
import type { Summary } from "@/types";

// GET /api/admin/summary
// Returns aggregated statistics about registrations
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const [total, pending, accepted, rejected] = await Promise.all([
      db.registration.count(),
      db.registration.count({ where: { status: "pending" } }),
      db.registration.count({ where: { status: "accepted" } }),
      db.registration.count({ where: { status: "rejected" } }),
    ]);

    // Group by T-shirt size (all registrations)
    const tshirtAll = await db.registration.groupBy({
      by: ["tShirtSize"],
      _count: true,
    });
    const byTShirtSize: Record<string, number> = {};
    TSHIRT_SIZES.forEach((s) => (byTShirtSize[s] = 0));
    tshirtAll.forEach((g) => (byTShirtSize[g.tShirtSize] = g._count));

    // Group by T-shirt size (accepted only)
    const tshirtAccepted = await db.registration.groupBy({
      by: ["tShirtSize"],
      where: { status: "accepted" },
      _count: true,
    });
    const acceptedByTShirtSize: Record<string, number> = {};
    TSHIRT_SIZES.forEach((s) => (acceptedByTShirtSize[s] = 0));
    tshirtAccepted.forEach((g) => (acceptedByTShirtSize[g.tShirtSize] = g._count));

    // Group by academic level (all)
    const levelAll = await db.registration.groupBy({
      by: ["academicLevel"],
      _count: true,
    });
    const byAcademicLevel: Record<string, number> = {};
    ACADEMIC_LEVELS.forEach((l) => (byAcademicLevel[l.value] = 0));
    levelAll.forEach((g) => (byAcademicLevel[g.academicLevel] = g._count));

    // Group by academic level (accepted)
    const levelAccepted = await db.registration.groupBy({
      by: ["academicLevel"],
      where: { status: "accepted" },
      _count: true,
    });
    const acceptedByAcademicLevel: Record<string, number> = {};
    ACADEMIC_LEVELS.forEach((l) => (acceptedByAcademicLevel[l.value] = 0));
    levelAccepted.forEach((g) => (acceptedByAcademicLevel[g.academicLevel] = g._count));

    const summary: Summary = {
      total,
      pending,
      accepted,
      rejected,
      byTShirtSize,
      byAcademicLevel,
      acceptedByTShirtSize,
      acceptedByAcademicLevel,
    };

    return NextResponse.json({ success: true, summary });
  } catch (error) {
    console.error("Summary error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch summary" },
      { status: 500 }
    );
  }
}
