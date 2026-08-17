import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { generateNextAcademicFestIdNo, sendSms, buildAcademicFestConfirmationSms } from "@/lib/sms";
import { REGISTRATION_STATUS } from "@/lib/constants";
import type { AcademicFestRegistration } from "@prisma/client";

function serialize(r: AcademicFestRegistration | null) {
  if (!r) return null;
  return {
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}

// PATCH /api/admin/academic-fest/registrations/:id
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { action } = await request.json();

    if (!["accept", "reject"].includes(action)) {
      return NextResponse.json(
        { success: false, error: "Invalid action. Use 'accept' or 'reject'." },
        { status: 400 }
      );
    }

    const registration = await db.academicFestRegistration.findUnique({ where: { id } });
    if (!registration) {
      return NextResponse.json(
        { success: false, error: "Registration not found" },
        { status: 404 }
      );
    }

    if (action === "accept") {
      if (registration.status === REGISTRATION_STATUS.ACCEPTED) {
        return NextResponse.json(
          { success: false, error: "Registration is already accepted" },
          { status: 400 }
        );
      }

      const updated = await db.$transaction(async (tx) => {
        const idNo = await generateNextAcademicFestIdNo(
          (registration.gender as "male" | "female") || "male"
        );
        return tx.academicFestRegistration.update({
          where: { id },
          data: {
            status: REGISTRATION_STATUS.ACCEPTED,
            idNo,
          },
        });
      });

      // Send confirmation SMS
      const message = buildAcademicFestConfirmationSms(updated.name, updated.idNo!);
      const smsResult = await sendSms({
        to: updated.phoneNumber,
        message,
        registrationId: updated.id,
      });

      return NextResponse.json({
        success: true,
        registration: serialize(updated),
        idNo: updated.idNo,
        smsSent: smsResult.success,
        smsMessage: message,
      });
    } else {
      const updated = await db.academicFestRegistration.update({
        where: { id },
        data: { status: REGISTRATION_STATUS.REJECTED },
      });

      return NextResponse.json({
        success: true,
        registration: serialize(updated),
      });
    }
  } catch (error) {
    console.error("Update Academic Fest registration error:", error);
    const message = error instanceof Error ? error.message : "Failed to update registration";
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}

// DELETE /api/admin/academic-fest/registrations/:id
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const registration = await db.academicFestRegistration.findUnique({ where: { id } });
    if (!registration) {
      return NextResponse.json(
        { success: false, error: "Registration not found" },
        { status: 404 }
      );
    }

    await db.academicFestRegistration.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Academic Fest registration error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete registration" },
      { status: 500 }
    );
  }
}
