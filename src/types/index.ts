// Shared types for the registration system

export type RegistrationStatus = "pending" | "accepted" | "rejected";

export type AcademicLevel = "school" | "college" | "university";

export type TShirtSize = "S" | "M" | "L" | "XL" | "XXL" | "3XL";

export interface Registration {
  id: string;
  name: string;
  institutionName: string;
  academicLevel: AcademicLevel;
  academicValue: string;
  tShirtSize: TShirtSize;
  bkashNumber: string;
  transactionId: string;
  phoneNumber: string;
  whatsappNumber: string;
  presentAddress: string;
  permanentAddress: string;
  status: RegistrationStatus;
  idNo: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RegistrationInput {
  name: string;
  institutionName: string;
  academicLevel: AcademicLevel;
  academicValue: string;
  tShirtSize: TShirtSize;
  bkashNumber: string;
  transactionId: string;
  phoneNumber: string;
  whatsappNumber: string;
  presentAddress: string;
  permanentAddress: string;
}

export interface Summary {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  byTShirtSize: Record<string, number>;
  byAcademicLevel: Record<string, number>;
  acceptedByTShirtSize: Record<string, number>;
  acceptedByAcademicLevel: Record<string, number>;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export type ViewName =
  | "home"
  | "register"
  | "my-registration"
  | "admin";
