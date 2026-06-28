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
  contactPhone: "01882137803",
  // WhatsApp group link - shown only when registration is accepted
  whatsappGroupLink: "https://chat.whatsapp.com/JcoF9izXdoW9ulGZFphSNa?s=cl&p=a&ilr=4&amv=3",
  // SMS message template - {idNo} and {name} are replaced
  smsTemplate:
    "Assalamu Alaikum {name}! Your registration for Run Against Drugs is CONFIRMED. ID: {idNo}. Msg 01881849412 for getting WhatsApp group link. ShibirCCN",
} as const;

// Academic level options for registration form
export const ACADEMIC_LEVELS = [
  { value: "school", label: "School or Madrasha" },
  { value: "college", label: "College or Madrasha" },
  { value: "honours", label: "Honours" },
  { value: "masters", label: "Masters" },
  { value: "polytechnic", label: "Polytechnic" },
  { value: "degree", label: "Degree" },
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
  ],
  college: [
    "11", "12"
  ],
  honours: [
    "1st Semester/1st Year",
    "2nd Semester/1st Year",
    "3rd Semester/2nd Year",
    "4th Semester/2nd Year",
    "5th Semester/3rd Year",
    "6th Semester/3rd Year",
    "7th Semester/4th Year",
    "8th Semester/4th Year",
  ],
  masters: [
    "1st Semester/1st Year",
    "2nd Semester/1st Year",
    "3rd Semester/2nd Year",
    "4th Semester/2nd Year",
  ],
  polytechnic: [
    "1st Semester",
    "2nd Semester",
    "3rd Semester",
    "4th Semester",
    "5th Semester",
    "6th Semester",
    "7th Semester",
    "8th Semester",
  ],
  degree: [
    "1st Year",
    "2nd Year",
    "3rd Year",
  ]
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
export const MAX_TRANSACTION_ID_USES = 3; // Max number of times a single Transaction ID can be reused (e.g. for group payments)

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
