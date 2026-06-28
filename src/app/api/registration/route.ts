import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureAdminSeeded } from "@/lib/auth";
import { EVENT_CONFIG, ACADEMIC_LEVELS, ACADEMIC_VALUES, TSHIRT_SIZES, REGISTRATION_STATUS, MAX_TRANSACTION_ID_USES } from "@/lib/constants";
import type { RegistrationInput } from "@/types";

// Ensure admin is seeded on first API call
let seeded = false;
async function ensureSeeded() {
  if (!seeded) {
    await ensureAdminSeeded();
    seeded = true;
  }
}

// POST /api/registration
// Submit a new registration
export async function POST(request: NextRequest) {
  await ensureSeeded();
  try {
    // Check registration deadline
    if (Date.now() > new Date(EVENT_CONFIG.registrationDeadline).getTime()) {
      return NextResponse.json(
        { success: false, error: "Registration has closed." },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const errors: Record<string, string> = {};
    const data = body as Partial<RegistrationInput>;

    if (!data.name || data.name.trim().length < 3) {
      errors.name = "Name is required (min 3 characters)";
    }
    if (!data.institutionName || data.institutionName.trim().length < 2) {
      errors.institutionName = "Institution name is required";
    }
    if (!data.academicLevel || !ACADEMIC_LEVELS.some((l) => l.value === data.academicLevel)) {
      errors.academicLevel = "Please select a valid academic level";
    }
    if (
      !data.academicValue ||
      !ACADEMIC_VALUES[data.academicLevel || ""]?.includes(data.academicValue)
    ) {
      errors.academicValue = "Please select a valid class/year/semester";
    }
    if (!data.tShirtSize || !TSHIRT_SIZES.includes(data.tShirtSize as (typeof TSHIRT_SIZES)[number])) {
      errors.tShirtSize = "Please select a T-shirt size";
    }
    if (!data.bkashNumber || !/^01[0-9]{9}$/.test(data.bkashNumber.trim())) {
      errors.bkashNumber = "Valid bKash number required (01XXXXXXXXX)";
    }
    if (!data.transactionId || !/^[A-Za-z0-9]{6,20}$/.test(data.transactionId.trim())) {
      errors.transactionId = "Transaction ID must be 6-20 alphanumeric characters";
    }
    if (!data.phoneNumber || !/^01[0-9]{9}$/.test(data.phoneNumber.trim())) {
      errors.phoneNumber = "Valid phone number required (01XXXXXXXXX)";
    }
    if (!data.whatsappNumber || !/^01[0-9]{9}$/.test(data.whatsappNumber.trim())) {
      errors.whatsappNumber = "Valid WhatsApp number required (01XXXXXXXXX)";
    }
    if (!data.presentAddress || data.presentAddress.trim().length < 5) {
      errors.presentAddress = "Present address is required";
    }
    if (!data.permanentAddress || data.permanentAddress.trim().length < 5) {
      errors.permanentAddress = "Permanent address is required";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { success: false, error: "Validation failed", fields: errors },
        { status: 400 }
      );
    }

    // Sanitize input
    const cleaned = {
      name: data.name!.trim(),
      institutionName: data.institutionName!.trim(),
      academicLevel: data.academicLevel!,
      academicValue: data.academicValue!,
      tShirtSize: data.tShirtSize!,
      bkashNumber: data.bkashNumber!.trim(),
      transactionId: data.transactionId!.trim().toUpperCase(),
      phoneNumber: data.phoneNumber!.trim(),
      whatsappNumber: data.whatsappNumber!.trim(),
      presentAddress: data.presentAddress!.trim(),
      permanentAddress: data.permanentAddress!.trim(),
    };

    // Check for duplicate transaction ID usage limit
    const existingTxnCount = await db.registration.count({
      where: { transactionId: cleaned.transactionId },
    });
    if (existingTxnCount >= MAX_TRANSACTION_ID_USES) {
      return NextResponse.json(
        {
          success: false,
          error: `This Transaction ID has already been used the maximum of ${MAX_TRANSACTION_ID_USES} times. Please check and try again.`,
        },
        { status: 409 }
      );
    }

    const registration = await db.registration.create({
      data: {
        ...cleaned,
        status: REGISTRATION_STATUS.PENDING,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: registration.id,
        name: registration.name,
        phoneNumber: registration.phoneNumber,
      },
    });
  } catch (error) {
    console.error("Registration submit error:", error);
    return NextResponse.json(
      { success: false, error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
