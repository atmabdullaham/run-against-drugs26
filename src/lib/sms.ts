import { db } from "@/lib/db";
import { EVENT_CONFIG, ID_NUMBER_PREFIX, ID_NUMBER_PAD_LENGTH } from "@/lib/constants";

interface SendSmsParams {
  to: string;
  message: string;
  registrationId?: string;
}

/**
 * SMS Service
 *
 * This service prepares and logs SMS messages. In production, integrate with
 * a real SMS gateway provider (e.g., bulk SMS BD, Twilio, etc.) by replacing
 * the sendViaGateway function with the provider's API call.
 *
 * For now, messages are logged to the SmsLog table and console for the admin
 * to verify what would be sent.
 */
async function sendViaGateway(number: string, message: string): Promise<any> {
  const apiKey = process.env.BULKSMS_API_KEY;
  const senderId = process.env.BULKSMS_SENDERID;

  if (!apiKey || !senderId) {
    throw new Error("BulkSMS API Key or Sender ID is not configured in environment variables.");
  }

  const smsData = {
    api_key: apiKey,
    senderid: senderId,
    number: number,
    message: message,
  };

  const response = await fetch("http://bulksmsbd.net/api/smsapi", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(smsData),
  });

  if (!response.ok) {
    throw new Error(`SMS Gateway HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log("✅ SMS gateway response:", data);
  return data;
}

export async function sendSms({ to, message, registrationId }: SendSmsParams): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    // Normalize phone number (remove leading 0, add +880 for Bangladesh)
    const normalizedPhone = normalizePhone(to);

    // Log the SMS attempt
    const log = await db.smsLog.create({
      data: {
        to: normalizedPhone,
        message,
        registrationId: registrationId || null,
        status: "logged",
      },
    });

    try {
      // Strip leading '+' so the format becomes 8801XXXXXXXX
      const gatewayPhone = normalizedPhone.replace("+", "");
      await sendViaGateway(gatewayPhone, message);

      // Update status to sent
      await db.smsLog.update({
        where: { id: log.id },
        data: { status: "sent" },
      });

      console.log(`[SMS SENT] To: ${normalizedPhone} | Message: ${message}`);
    } catch (gatewayError) {
      console.error("❌ SMS Gateway send failed:", gatewayError);

      // Update status to failed
      await db.smsLog.update({
        where: { id: log.id },
        data: { status: "failed" },
      });

      return { success: false, message: "SMS gateway delivery failed" };
    }

    return { success: true, message: "SMS sent successfully" };
  } catch (error) {
    console.error("SMS service error:", error);
    return { success: false, message: "Failed to send SMS" };
  }
}

function normalizePhone(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "");
  // If starts with 880, keep as is
  if (digits.startsWith("880")) return `+${digits}`;
  // If starts with 0, replace with +880
  if (digits.startsWith("0")) return `+880${digits.slice(1)}`;
  return `+${digits}`;
}

/**
 * Generate the confirmation SMS for an accepted registration
 */
export function buildConfirmationSms(name: string, idNo: string): string {
  return EVENT_CONFIG.smsTemplate
    .replace("{name}", name)
    .replace("{idNo}", idNo);
}

/**
 * Generate the next sequential ID number (RD001, RD002, ...)
 * Must be called within a transaction for atomicity.
 *
 * ID is based on the ORDER OF ACCEPTANCE, not registration order.
 * The nth accepted registration gets RD{n:03d}.
 */
export async function generateNextIdNo(): Promise<string> {
  const acceptedCount = await db.registration.count({
    where: { status: "accepted" },
  });
  const nextNumber = acceptedCount + 1;
  const padded = String(nextNumber).padStart(ID_NUMBER_PAD_LENGTH, "0");
  return `${ID_NUMBER_PREFIX}${padded}`;
}
