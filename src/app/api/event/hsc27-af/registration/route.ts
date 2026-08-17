import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  HSC27_AF_CONFIG,
  ACADEMIC_FEST_GROUPS,
  EDUCATION_BOARDS,
  TSHIRT_SIZES,
  REGISTRATION_STATUS,
} from "@/lib/constants";
import type { AcademicFestRegistrationInput } from "@/types";

// POST /api/event/hsc27-af/registration
export async function POST(request: NextRequest) {
  try {
    // Check registration deadline
    if (Date.now() > new Date(HSC27_AF_CONFIG.registrationDeadline).getTime()) {
      return NextResponse.json(
        { success: false, error: "Registration for HSC'27 Academic Fest has closed." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const data = body as Partial<AcademicFestRegistrationInput>;
    const errors: Record<string, string> = {};

    if (!data.name || data.name.trim().length < 3) {
      errors.name = "Full name is required (min 3 characters)";
    }
    if (!data.gender || !["male", "female"].includes(data.gender.toLowerCase())) {
      errors.gender = "Please select a valid Gender (Male or Female)";
    }
    if (!data.institutionName || data.institutionName.trim().length < 2) {
      errors.institutionName = "Institution name is required";
    }
    if (!data.tShirtSize || !TSHIRT_SIZES.includes(data.tShirtSize as (typeof TSHIRT_SIZES)[number])) {
      errors.tShirtSize = "Please select a valid T-shirt size";
    }
    if (!data.group || !ACADEMIC_FEST_GROUPS.includes(data.group as (typeof ACADEMIC_FEST_GROUPS)[number])) {
      errors.group = "Please select a valid Group (Science, Commerce, Arts)";
    }

    if (!data.rollNumber || !/^[0-9]{6}$/.test(data.rollNumber.trim())) {
      errors.rollNumber = "SSC Roll Number must be exactly 6 digits";
    }

    if (!data.regNumber || !/^[0-9]{6,15}$/.test(data.regNumber.trim())) {
      errors.regNumber = "Valid SSC Registration Number is required (digits only)";
    }
    if (!data.board || !EDUCATION_BOARDS.includes(data.board as (typeof EDUCATION_BOARDS)[number])) {
      errors.board = "Please select your Education Board";
    }
    if (!data.phoneNumber || !/^01[0-9]{9}$/.test(data.phoneNumber.trim())) {
      errors.phoneNumber = "Valid phone number required (01XXXXXXXXX)";
    }
    if (!data.whatsappNumber || !/^01[0-9]{9}$/.test(data.whatsappNumber.trim())) {
      errors.whatsappNumber = "Valid WhatsApp number required (01XXXXXXXXX)";
    }
    if (!data.presentAddress || data.presentAddress.trim().length < 5) {
      errors.presentAddress = "Present address is required (min 5 characters)";
    }
    if (!data.sameAsPresent && (!data.permanentAddress || data.permanentAddress.trim().length < 5)) {
      errors.permanentAddress = "Permanent address is required (min 5 characters)";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { success: false, error: "Validation failed", fields: errors },
        { status: 400 }
      );
    }

    const cleaned = {
      name: data.name!.trim(),
      gender: data.gender!.toLowerCase() as "male" | "female",
      institutionName: data.institutionName!.trim(),
      tShirtSize: data.tShirtSize!,
      group: data.group!,
      rollNumber: data.rollNumber!.trim(),
      regNumber: data.regNumber!.trim(),
      board: data.board!,
      phoneNumber: data.phoneNumber!.trim(),
      whatsappNumber: data.whatsappNumber!.trim(),
      presentAddress: data.presentAddress!.trim(),
      sameAsPresent: Boolean(data.sameAsPresent),
      permanentAddress: data.sameAsPresent
        ? data.presentAddress!.trim()
        : data.permanentAddress!.trim(),
      guestQuestion: data.guestQuestion?.trim() || null,
    };

    // Check if phone or roll or reg number already registered for this event
    const existing = await db.academicFestRegistration.findFirst({
      where: {
        OR: [
          { rollNumber: cleaned.rollNumber },
          { regNumber: cleaned.regNumber },
          { phoneNumber: cleaned.phoneNumber },
        ],
      },
    });

    if (existing) {
      if (existing.rollNumber === cleaned.rollNumber) {
        return NextResponse.json(
          { success: false, error: "A registration with this SSC Roll Number already exists." },
          { status: 409 }
        );
      }
      if (existing.regNumber === cleaned.regNumber) {
        return NextResponse.json(
          { success: false, error: "A registration with this SSC Registration Number already exists." },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { success: false, error: "A registration with this phone number already exists." },
        { status: 409 }
      );
    }

    const registration = await db.academicFestRegistration.create({
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
        rollNumber: registration.rollNumber,
        regNumber: registration.regNumber,
      },
    });
  } catch (error: any) {
    console.error("Academic Fest registration submit error:", error);

    // Prisma Unique Constraint Violation (P2002)
    if (error?.code === "P2002") {
      const target = Array.isArray(error.meta?.target) ? error.meta.target.join(", ") : "provided details";
      return NextResponse.json(
        { success: false, error: `A registration with this ${target} already exists.` },
        { status: 409 }
      );
    }

    const message = error instanceof Error ? error.message : "Registration failed. Please try again.";
    return NextResponse.json(
      { success: false, error: "Registration failed. Please try again in a few moments." },
      { status: 500 }
    );
  }
}

// GET /api/event/hsc27-af/registration?phone=01XXXXXXXXX
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone")?.trim();
    const rollNumber = searchParams.get("rollNumber")?.trim();
    const regNumber = searchParams.get("regNumber")?.trim();

    if (!phone && !rollNumber && !regNumber) {
      return NextResponse.json(
        { success: false, error: "Phone number, Roll Number, or Registration Number required." },
        { status: 400 }
      );
    }

    const registration = await db.academicFestRegistration.findFirst({
      where: {
        OR: [
          phone ? { phoneNumber: phone } : {},
          rollNumber ? { rollNumber: rollNumber } : {},
          regNumber ? { regNumber: regNumber } : {},
        ].filter((o) => Object.keys(o).length > 0),
      },
    });

    if (!registration) {
      return NextResponse.json({ success: true, found: false });
    }

    return NextResponse.json({
      success: true,
      found: true,
      registration,
    });
  } catch (error) {
    console.error("Academic Fest status error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch registration status." },
      { status: 500 }
    );
  }
}
