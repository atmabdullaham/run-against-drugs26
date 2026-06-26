// Event configuration constants
// Customize these values for your event

export const EVENT_CONFIG = {
  name: "Run Against Drugs 2026",
  tagline: "Youth Against Drugs",
  subtitle: "A 3 KM Run for a Drug-Free Bangladesh",
  // Event date in Asia/Dhaka timezone (ISO string)
  eventDate: "2026-06-30T08:00:00+06:00",
  // Registration deadline in Asia/Dhaka timezone (ISO string)
  registrationDeadline: "2026-06-28T23:59:59+06:00",
  location: "Chawkbazar (Gulzar Mor), Chittagong",
  registrationFee: 100,
  bkashNumber: "01859902430",
  contactPhone: "01859902430",
  // WhatsApp group link - shown only when registration is accepted
  whatsappGroupLink: "https://chat.whatsapp.com/your-group-invite-code",
  // SMS message template - {idNo} and {name} are replaced
  smsTemplate:
    "Assalamu Alaikum {name}! Your registration for Run Against Drugs 2026 is CONFIRMED. Your ID No: {idNo}. Please join the WhatsApp group for updates. Thank you.",
} as const;

// Academic level options for registration form
export const ACADEMIC_LEVELS = [
  { value: "school", label: "School (Class 5-12)" },
  { value: "college", label: "College (1st-4th Year)" },
  { value: "university", label: "University (1st-8th Semester)" },
] as const;

// Academic value options based on level
export const ACADEMIC_VALUES: Record<string, string[]> = {
  school: [
    "Class 5",
    "Class 6",
    "Class 7",
    "Class 8",
    "Class 9",
    "Class 10",
    "Class 11",
    "Class 12",
  ],
  college: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
  university: [
    "1st Semester",
    "2nd Semester",
    "3rd Semester",
    "4th Semester",
    "5th Semester",
    "6th Semester",
    "7th Semester",
    "8th Semester",
  ],
};

// T-shirt size options
export const TSHIRT_SIZES = ["S", "M", "L", "XL", "XXL", "3XL"] as const;

// Registration statuses
export const REGISTRATION_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
} as const;

// ID number prefix and padding
export const ID_NUMBER_PREFIX = "RD";
export const ID_NUMBER_PAD_LENGTH = 3; // RD001, RD002, ...

// Session config
export const SESSION_COOKIE_NAME = "admin_session";
export const SESSION_EXPIRY_HOURS = 12;

// Admin credentials (seeded on first run)
export const DEFAULT_ADMIN = {
  username: "admin",
  password: "admin123", // Change after first login
};

// Navigation hash routes
export const ROUTES = {
  HOME: "#/",
  REGISTER: "#/register",
  MY_REGISTRATION: "#/my-registration",
  ADMIN: "#/admin",
} as const;
