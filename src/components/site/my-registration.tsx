"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SearchX,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Lock,
  Phone,
  MessageCircle,
  User,
  Building2,
  GraduationCap,
  Shirt,
  Hash,
  MapPin,
  Home as HomeIcon,
  Calendar,
  ArrowLeft,
  RotateCw,
  AlertCircle,
  UserPlus,
  type LucideIcon,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import { navigate } from "@/lib/nav";
import { EVENT_CONFIG, ACADEMIC_LEVELS } from "@/lib/constants";
import { api, ApiError } from "@/lib/api";
import type { Registration, RegistrationStatus } from "@/types";
import { useToast } from "@/hooks/use-toast";

type SearchResult =
  | { kind: "idle" }
  | { kind: "found"; registration: Registration }
  | { kind: "not-found"; phone: string }
  | { kind: "error"; message: string };

const PHONE_REGEX = /^01\d{9}$/;

function validatePhone(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Please enter your phone number.";
  if (!PHONE_REGEX.test(trimmed))
    return "Enter a valid 11-digit phone number starting with 01 (e.g. 01712345678).";
  return null;
}

function formatDateTime(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function academicLevelLabel(level: string): string {
  const found = ACADEMIC_LEVELS.find((l) => l.value === level);
  return found ? found.label.split(" (")[0] : level;
}

type StatusMeta = {
  label: string;
  icon: LucideIcon;
  badgeClass: string;
  idBoxClass: string;
  labelClass: string;
  idTextClass: string;
};

const STATUS_META: Record<RegistrationStatus, StatusMeta> = {
  pending: {
    label: "Pending Review",
    icon: Clock,
    badgeClass:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30",
    idBoxClass:
      "border-amber-300 bg-amber-50/60 dark:border-amber-500/30 dark:bg-amber-500/5",
    labelClass: "text-amber-700 dark:text-amber-300",
    idTextClass: "text-amber-900 dark:text-amber-200",
  },
  accepted: {
    label: "Accepted",
    icon: CheckCircle2,
    badgeClass:
      "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-300 dark:border-green-500/30",
    idBoxClass: "",
    labelClass: "text-brand-green dark:text-green-300",
    idTextClass: "",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    badgeClass:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30",
    idBoxClass:
      "border-red-300 bg-red-50/60 dark:border-red-500/30 dark:bg-red-500/5",
    labelClass: "text-brand-red dark:text-red-300",
    idTextClass: "text-red-900 dark:text-red-200",
  },
};

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-accent/60 flex items-center justify-center text-navy dark:text-sky">
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <div className="text-sm font-semibold text-foreground break-words">
          {value ? (
            value
          ) : (
            <span className="text-muted-foreground font-normal italic">
              Not provided
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-bold uppercase tracking-wider text-navy dark:text-sky pt-4 pb-1 border-b border-border">
      {children}
    </div>
  );
}

export function MyRegistration() {
  const { toast } = useToast();
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult>({ kind: "idle" });
  const resultRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (result.kind !== "idle") {
      // Defer to next frame so the element is mounted before scrolling.
      requestAnimationFrame(() => {
        resultRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }, [result]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
    setPhone(digits);
    if (phoneError) setPhoneError(null);
  };

  const runSearch = async () => {
    const err = validatePhone(phone);
    if (err) {
      setPhoneError(err);
      return;
    }
    setLoading(true);
    setResult({ kind: "idle" });
    try {
      const data = await api.get<{
        success: boolean;
        found?: boolean;
        registration?: Registration;
        error?: string;
      }>(`/api/registration/status?phone=${encodeURIComponent(phone.trim())}`);

      if (!data.success) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      if (data.found && data.registration) {
        setResult({ kind: "found", registration: data.registration });
      } else {
        setResult({ kind: "not-found", phone: phone.trim() });
      }
    } catch (e) {
      const msg =
        e instanceof ApiError || e instanceof Error
          ? e.message
          : "Unable to reach the server. Please try again.";
      toast({
        title: "Lookup failed",
        description: msg,
        variant: "destructive",
      });
      setResult({ kind: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void runSearch();
  };

  const handleReset = () => {
    setResult({ kind: "idle" });
    setPhone("");
    setPhoneError(null);
  };

  const statusMeta: StatusMeta | null =
    result.kind === "found" ? STATUS_META[result.registration.status] : null;

  return (
    <div className="container mx-auto px-4 py-12 sm:py-16 min-h-[calc(100vh-5rem)] bg-pattern">
      <div className="max-w-2xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-navy shadow-navy mb-4">
            <Search className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gradient-navy leading-tight">
            Check Your Registration Status
          </h1>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
            Enter the phone number you used during registration
          </p>
        </motion.div>

        {/* Search form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          whileHover={{ y: -2 }}
        >
          <Card className="shadow-navy/30 border-border/80">
            <CardHeader>
              <CardTitle className="text-lg text-navy">Phone Lookup</CardTitle>
              <CardDescription>
                Use the 11-digit mobile number (e.g. 01712345678) you registered
                with.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-navy">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      placeholder="01XXXXXXXXX"
                      value={phone}
                      onChange={handlePhoneChange}
                      maxLength={11}
                      aria-invalid={!!phoneError}
                      aria-describedby={
                        phoneError ? "phone-error" : "phone-hint"
                      }
                      className={`pl-9 h-11 text-base tracking-wide ${
                        phoneError ? "border-destructive" : ""
                      }`}
                      disabled={loading}
                    />
                  </div>
                  {phoneError ? (
                    <p
                      id="phone-error"
                      role="alert"
                      className="text-xs font-medium text-destructive flex items-center gap-1.5"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      {phoneError}
                    </p>
                  ) : (
                    <p id="phone-hint" className="text-xs text-muted-foreground">
                      We only use this to find your registration record.
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-gradient-navy text-white hover:opacity-90 shadow-navy"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Search
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results */}
        <div
          ref={resultRef}
          className="mt-6"
          aria-live="polite"
          aria-atomic="true"
        >
          <AnimatePresence mode="wait">
            {result.kind === "not-found" && (
              <motion.div
                key="not-found"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-amber-200 bg-amber-50/40 dark:bg-amber-500/5">
                  <CardContent className="pt-6 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-500/15 flex items-center justify-center mb-4">
                      <SearchX className="w-8 h-8 text-amber-600 dark:text-amber-300" />
                    </div>
                    <h2 className="text-xl font-bold text-navy">
                      User Not Found
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                      No registration found with phone number{" "}
                      <span className="font-semibold text-foreground">
                        {result.phone}
                      </span>
                      . Please check your number or register now.
                    </p>
                    <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                      <Button
                        onClick={() => navigate("register")}
                        className="bg-gradient-red text-white hover:opacity-90 shadow-red"
                      >
                        <UserPlus className="w-4 h-4" />
                        Register Now
                      </Button>
                      <Button variant="outline" onClick={handleReset}>
                        <RotateCw className="w-4 h-4" />
                        Try Another Number
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {result.kind === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-destructive/40 bg-red-50/40 dark:bg-red-500/5">
                  <CardContent className="pt-6 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/15 flex items-center justify-center mb-4">
                      <AlertCircle className="w-8 h-8 text-brand-red" />
                    </div>
                    <h2 className="text-xl font-bold text-navy">
                      Something went wrong
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                      {result.message}
                    </p>
                    <Button
                      onClick={() => void runSearch()}
                      className="mt-6 bg-gradient-navy text-white hover:opacity-90 shadow-navy"
                    >
                      <RotateCw className="w-4 h-4" />
                      Retry Search
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {result.kind === "found" && statusMeta && (
              <FoundCard
                registration={result.registration}
                statusMeta={statusMeta}
                onReset={handleReset}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Bottom action when idle */}
        {result.kind === "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Button
              variant="outline"
              onClick={() => navigate("home")}
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("register")}
              className="w-full sm:w-auto"
            >
              <UserPlus className="w-4 h-4" />
              Register Now
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Found card — keeps the main component readable                       */
/* ------------------------------------------------------------------ */

function FoundCard({
  registration,
  statusMeta,
  onReset,
}: {
  registration: Registration;
  statusMeta: StatusMeta;
  onReset: () => void;
}) {
  const StatusIcon = statusMeta.icon;
  const firstName = registration.name.split(" ")[0] || "Participant";
  const accepted =
    registration.status === "accepted" && !!registration.idNo;

  return (
    <motion.div
      key="found"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35 }}
    >
      <Card className="overflow-hidden shadow-navy/40 py-0 gap-0">
        {/* Header band */}
        <CardHeader className="bg-gradient-navy text-white py-5 border-b-0">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <CardTitle className="text-sm font-medium uppercase tracking-widest text-white/80">
                Registration Found
              </CardTitle>
              <CardDescription className="text-white/90 text-sm mt-1">
                Welcome back, {firstName}! Here are your registration details.
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className={`shrink-0 border ${statusMeta.badgeClass} text-xs px-3 py-1`}
            >
              <StatusIcon className="w-3.5 h-3.5" />
              {statusMeta.label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-2">
          {/* ID box */}
          {accepted ? (
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.1,
                type: "spring",
                stiffness: 200,
                damping: 18,
              }}
              className="rounded-xl bg-gradient-navy text-white p-5 shadow-navy relative overflow-hidden"
            >
              <div
                className="absolute inset-0 bg-pattern opacity-20"
                aria-hidden
              />
              <div className="relative">
                <div className="text-[11px] font-semibold uppercase tracking-widest text-white/70">
                  Your Participant ID
                </div>
                <div className="mt-1 text-3xl sm:text-4xl font-bold font-mono tracking-tight">
                  {registration.idNo}
                </div>
                <div className="mt-2 text-xs text-white/80 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Show this ID at the event check-in counter.
                </div>
              </div>
            </motion.div>
          ) : registration.status === "pending" ? (
            <div
              className={`rounded-xl border-2 border-dashed p-5 ${statusMeta.idBoxClass}`}
            >
              <div
                className={`text-[11px] font-semibold uppercase tracking-widest ${statusMeta.labelClass}`}
              >
                Participant ID
              </div>
              <div
                className={`mt-1 text-3xl sm:text-4xl font-bold font-mono tracking-tight select-none ${statusMeta.idTextClass}`}
              >
                RD
                <span className="blur-[3px] inline-block">XXX</span>
              </div>
              <div
                className={`mt-2 text-xs flex items-center gap-1.5 ${statusMeta.labelClass}`}
              >
                <Clock className="w-3.5 h-3.5" />
                ID will be assigned after your registration is verified.
              </div>
            </div>
          ) : (
            <div
              className={`rounded-xl border-2 border-dashed p-5 ${statusMeta.idBoxClass}`}
            >
              <div
                className={`text-[11px] font-semibold uppercase tracking-widest ${statusMeta.labelClass}`}
              >
                Participant ID
              </div>
              <div
                className={`mt-1 text-xl font-semibold ${statusMeta.idTextClass}`}
              >
                No ID assigned
              </div>
              <div className={`mt-2 text-xs ${statusMeta.labelClass}`}>
                Your registration was not approved. Please contact the
                organizers if you believe this is an error.
              </div>
            </div>
          )}

          {/* Participant Info */}
          <div>
            <SectionTitle>Participant Information</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-x-4">
              <InfoRow
                icon={User}
                label="Full Name"
                value={registration.name}
              />
              <InfoRow
                icon={Building2}
                label="Institution"
                value={registration.institutionName}
              />
              <InfoRow
                icon={GraduationCap}
                label="Academic Level"
                value={academicLevelLabel(registration.academicLevel)}
              />
              <InfoRow
                icon={GraduationCap}
                label="Class / Year"
                value={registration.academicValue}
              />
              <InfoRow
                icon={Shirt}
                label="T-Shirt Size"
                value={registration.tShirtSize}
              />
            </div>
          </div>

          {/* Payment Info */}
          <div>
            <SectionTitle>Payment Information</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-x-4">
              <InfoRow
                icon={Phone}
                label="bKash Number"
                value={registration.bkashNumber}
              />
              <InfoRow
                icon={Hash}
                label="Transaction ID"
                value={registration.transactionId}
              />
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <SectionTitle>Contact Information</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-x-4">
              <InfoRow
                icon={Phone}
                label="Phone Number"
                value={registration.phoneNumber}
              />
              <InfoRow
                icon={MessageCircle}
                label="WhatsApp Number"
                value={registration.whatsappNumber}
              />
              <InfoRow
                icon={MapPin}
                label="Present Address"
                value={registration.presentAddress}
              />
              <InfoRow
                icon={HomeIcon}
                label="Permanent Address"
                value={registration.permanentAddress}
              />
            </div>
          </div>

          {/* Timeline */}
          <div>
            <SectionTitle>Application Timeline</SectionTitle>
            <InfoRow
              icon={Calendar}
              label="Registered On"
              value={formatDateTime(registration.createdAt)}
            />
          </div>

          {/* WhatsApp button */}
          {accepted ? (
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="pt-2"
            >
              <Button
                asChild
                className="w-full h-11 bg-brand-green hover:bg-brand-green/90 text-white shadow-sm"
              >
                <a
                  href={EVENT_CONFIG.whatsappGroupLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Join the WhatsApp group (opens in a new tab)"
                >
                  <MessageCircle className="w-4 h-4" />
                  Join WhatsApp Group
                </a>
              </Button>
            </motion.div>
          ) : (
            <div className="pt-2">
              <Button
                disabled
                aria-disabled="true"
                className="w-full h-11 bg-muted text-muted-foreground cursor-not-allowed"
              >
                <Lock className="w-4 h-4" />
                Join WhatsApp Group (Available after acceptance)
              </Button>
            </div>
          )}
        </CardContent>

        <CardFooter className="border-t border-border bg-muted/30 px-6 py-4 flex flex-col sm:flex-row gap-3 justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("home")}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          <Button
            variant="outline"
            onClick={onReset}
            className="w-full sm:w-auto"
          >
            <RotateCw className="w-4 h-4" />
            Search Another Number
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
