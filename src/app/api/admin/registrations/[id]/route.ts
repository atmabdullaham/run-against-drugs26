import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { generateNextIdNo, sendSms, buildConfirmationSms } from "@/lib/sms";
import { REGISTRATION_STATUS } from "@/lib/constants";

import type { Registration } from "@prisma/client";

// Helper to serialize registration (convert Date to ISO string)
function serialize(r: Registration | null) {
  if (!r) return null;
  return {
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}

// PATCH /api/admin/registrations/:id
// body: { action: "accept" | "reject" }
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

    const registration = await db.registration.findUnique({ where: { id } });
    if (!registration) {
      return NextResponse.json(
        { success: false, error: "Registration not found" },
        { status: 404 }
      );
    }

    if (action === "accept") {
      // Already accepted?
      if (registration.status === REGISTRATION_STATUS.ACCEPTED) {
        return NextResponse.json(
          { success: false, error: "Registration is already accepted" },
          { status: 400 }
        );
      }

      // Generate next ID number atomically using a transaction
      const updated = await db.$transaction(async (tx) => {
        const idNo = await generateNextIdNo();
        return tx.registration.update({
          where: { id },
          data: {
            status: REGISTRATION_STATUS.ACCEPTED,
            idNo,
          },
        });
      });

      // Send confirmation SMS
      const message = buildConfirmationSms(updated.name, updated.idNo!);
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
      // Reject
      if (registration.status === REGISTRATION_STATUS.ACCEPTED && registration.idNo) {
        // If rejecting an accepted registration, we keep the idNo assigned
        // (ID numbers are not reused). But we clear it so it's clear this is rejected.
        // Actually, per requirements, ID is assigned on accept. On reject we just change status.
      }
      const updated = await db.registration.update({
        where: { id },
        data: { status: REGISTRATION_STATUS.REJECTED },
      });

      return NextResponse.json({
        success: true,
        registration: serialize(updated),
      });
    }
  } catch (error) {
    console.error("Update registration error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update registration" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/registrations/:id
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

    const registration = await db.registration.findUnique({ where: { id } });
    if (!registration) {
      return NextResponse.json(
        { success: false, error: "Registration not found" },
        { status: 404 }
      );
    }

    await db.registration.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete registration error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete registration" },
      { status: 500 }
    );
  }
}
