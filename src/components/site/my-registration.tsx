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
  Sparkles,
  Award,
  BookOpen,
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
import { EVENT_CONFIG, HSC27_AF_CONFIG, ACADEMIC_LEVELS } from "@/lib/constants";
import { api, ApiError } from "@/lib/api";
import type { Registration, AcademicFestRegistration, RegistrationStatus } from "@/types";
import { useToast } from "@/hooks/use-toast";

type EventType = "hsc27-af" | "run26-against-drugs";

type SearchResult =
  | { kind: "idle" }
  | { kind: "found-af"; registration: AcademicFestRegistration }
  | { kind: "found-rad"; registration: Registration }
  | { kind: "not-found"; term: string }
  | { kind: "error"; message: string };

const PHONE_REGEX = /^01\d{9}$/;

function validateSearchTerm(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Please enter your phone number or registration number.";
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

type StatusMeta = {
  label: string;
  icon: LucideIcon;
  badgeClass: string;
};

const STATUS_META: Record<RegistrationStatus, StatusMeta> = {
  pending: {
    label: "Pending Review",
    icon: Clock,
    badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  },
  accepted: {
    label: "Accepted",
    icon: CheckCircle2,
    badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    badgeClass: "bg-red-500/20 text-red-300 border-red-500/40",
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
      <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-400">
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </div>
        <div className="text-sm font-semibold text-white break-words">
          {value ? (
            value
          ) : (
            <span className="text-slate-500 font-normal italic">Not provided</span>
          )}
        </div>
      </div>
    </div>
  );
}

export function MyRegistration() {
  const { toast } = useToast();
  const [selectedEvent, setSelectedEvent] = useState<EventType>("hsc27-af");
  const [term, setTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult>({ kind: "idle" });
  const resultRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (result.kind !== "idle") {
      requestAnimationFrame(() => {
        resultRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }, [result]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const valErr = validateSearchTerm(term);
    if (valErr) {
      setError(valErr);
      return;
    }

    setLoading(true);
    setResult({ kind: "idle" });
    setError(null);

    const query = term.trim();

    try {
      if (selectedEvent === "hsc27-af") {
        // Query Academic Fest API endpoint
        const isDigits = /^[0-9]+$/.test(query);
        const queryParam = isDigits && query.length === 11 ? `phone=${encodeURIComponent(query)}` : `regNumber=${encodeURIComponent(query)}`;
        const res = await fetch(`/api/event/hsc27-af/registration?${queryParam}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Lookup failed");
        }

        if (data.found && data.registration) {
          setResult({ kind: "found-af", registration: data.registration });
        } else {
          setResult({ kind: "not-found", term: query });
        }
      } else {
        // Query Run Against Drugs API endpoint
        const data = await api.get<{
          success: boolean;
          found?: boolean;
          registration?: Registration;
          error?: string;
        }>(`/api/registration/status?phone=${encodeURIComponent(query)}`);

        if (!data.success) {
          throw new Error(data.error || "Lookup failed");
        }

        if (data.found && data.registration) {
          setResult({ kind: "found-rad", registration: data.registration });
        } else {
          setResult({ kind: "not-found", term: query });
        }
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unable to reach server.";
      toast({
        title: "Lookup Failed",
        description: msg,
        variant: "destructive",
      });
      setResult({ kind: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult({ kind: "idle" });
    setTerm("");
    setError(null);
  };

  return (
    <div className="container mx-auto px-4 py-12 sm:py-16 min-h-[calc(100vh-5rem)] bg-slate-950 text-white">
      <div className="max-w-2xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 mb-4 shadow-lg">
            <Search className="w-7 h-7" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Check Registration Status
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-md mx-auto">
            Select your event and enter your registered phone number or registration ID.
          </p>
        </motion.div>

        {/* Event Selection Switcher */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setSelectedEvent("hsc27-af");
                handleReset();
              }}
              className={`flex items-center justify-center gap-2 rounded-xl py-3 px-3 text-xs sm:text-sm font-bold transition-all ${
                selectedEvent === "hsc27-af"
                  ? "bg-emerald-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <Sparkles className="size-4 text-amber-300" />
              <span>HSC&apos;27 Academic Fest</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedEvent("run26-against-drugs");
                handleReset();
              }}
              className={`flex items-center justify-center gap-2 rounded-xl py-3 px-3 text-xs sm:text-sm font-bold transition-all ${
                selectedEvent === "run26-against-drugs"
                  ? "bg-emerald-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <span>Run Against Drugs 2026</span>
            </button>
          </div>
        </motion.div>

        {/* Search Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-slate-800 bg-slate-900/90 text-white shadow-2xl backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-lg text-white">
                {selectedEvent === "hsc27-af" ? "HSC'27 Academic Fest Lookup" : "Run Against Drugs Lookup"}
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs">
                {selectedEvent === "hsc27-af"
                  ? "Enter the Mobile Phone Number (01XXXXXXXXX) or SSC Registration Number used during registration."
                  : "Enter the 11-digit mobile number used during registration."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="term" className="text-slate-200">
                    {selectedEvent === "hsc27-af" ? "Phone or Registration Number" : "Phone Number"}
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      id="term"
                      type="text"
                      placeholder={selectedEvent === "hsc27-af" ? "01XXXXXXXXX or SSC Reg No" : "01XXXXXXXXX"}
                      value={term}
                      onChange={(e) => setTerm(e.target.value)}
                      className="pl-9 h-11 bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500"
                      disabled={loading}
                    />
                  </div>
                  {error && <p className="text-xs text-red-400">{error}</p>}
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/20"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Searching...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Search className="w-4 h-4" /> Check Status
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search Results */}
        <div ref={resultRef} className="mt-6">
          <AnimatePresence mode="wait">
            {result.kind === "not-found" && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
              >
                <Card className="border-amber-500/30 bg-slate-900 text-white text-center p-6">
                  <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
                    <SearchX className="size-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">No Registration Found</h3>
                  <p className="mt-2 text-sm text-slate-300">
                    No record found for &quot;<span className="font-semibold text-amber-400">{result.term}</span>&quot; in {selectedEvent === "hsc27-af" ? "HSC'27 Academic Fest" : "Run Against Drugs 2026"}.
                  </p>
                  <div className="mt-6 flex justify-center gap-3">
                    {selectedEvent === "hsc27-af" && (
                      <Button
                        onClick={() => navigate("event/hsc27-af/registration")}
                        className="bg-amber-400 font-bold text-slate-950 hover:bg-amber-300"
                      >
                        Register for HSC&apos;27 Fest
                      </Button>
                    )}
                    <Button variant="outline" onClick={handleReset} className="border-slate-700 text-white hover:bg-slate-800">
                      Try Another Number
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {result.kind === "found-af" && (
              <AcademicFestResultCard registration={result.registration} onReset={handleReset} />
            )}

            {result.kind === "found-rad" && (
              <RunAgainstDrugsResultCard registration={result.registration} onReset={handleReset} />
            )}
          </AnimatePresence>
        </div>

        {result.kind === "idle" && (
          <div className="mt-8 text-center">
            <Button variant="ghost" onClick={() => navigate("home")} className="text-slate-400 hover:text-white">
              <ArrowLeft className="mr-2 size-4" /> Back to Main Event Portal
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Result Card for HSC'27 Academic Fest
function AcademicFestResultCard({
  registration,
  onReset,
}: {
  registration: AcademicFestRegistration;
  onReset: () => void;
}) {
  const meta = STATUS_META[registration.status];
  const Icon = meta.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
    >
      <Card className="border-emerald-500/40 bg-slate-900 text-white shadow-2xl overflow-hidden">
        <CardHeader className="bg-emerald-950/60 border-b border-emerald-800/40 py-5 text-center">
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 mb-2 mx-auto">
            HSC&apos;27 Academic Fest
          </Badge>
          <CardTitle className="text-2xl font-bold text-white">{registration.name}</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-5">
          {/* Status Badge */}
          <div className="flex flex-col items-center gap-3">
            <div className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-bold ${meta.badgeClass}`}>
              <Icon className="size-5" />
              {meta.label}
            </div>

            {registration.idNo && (
              <div className="rounded-xl bg-slate-800/80 border border-slate-700 p-4 text-center w-full">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Participant ID</span>
                <div className="text-3xl font-extrabold font-mono text-emerald-400 mt-1">{registration.idNo}</div>
              </div>
            )}
          </div>

          {/* Phone Number */}
          <div className="flex items-center gap-3 rounded-xl bg-slate-800/60 border border-slate-700/50 p-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Registered Phone</div>
              <div className="text-base font-bold text-white font-mono">{registration.phoneNumber}</div>
            </div>
          </div>

          {/* WhatsApp Community Link */}
          <div className="rounded-xl border border-green-500/30 bg-green-950/40 p-5 text-center">
            <p className="text-xs text-emerald-200/80 mb-3 font-sans">
              📢 ইভেন্ট সম্পর্কে আপডেট পেতে আমাদের WhatsApp কমিউনিটিতে যোগ দিন:
            </p>
            <a
              href="https://chat.whatsapp.com/LGSS9PZOSxF7vHIOxscPwm?s=cl&p=a&ilr=1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-sm px-5 py-2.5 transition-colors shadow-md shadow-green-600/20"
            >
              <svg viewBox="0 0 24 24" className="size-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              Join WhatsApp Community
            </a>
          </div>
        </CardContent>
        <CardFooter className="bg-slate-950 border-t border-slate-800 px-6 py-4 flex justify-between">
          <Button variant="ghost" onClick={() => navigate("home")} className="text-slate-400 hover:text-white">
            <ArrowLeft className="mr-2 size-4" /> Portal Home
          </Button>
          <Button variant="outline" onClick={onReset} className="border-slate-700 text-white hover:bg-slate-800">
            <RotateCw className="mr-2 size-4" /> Search Again
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

// Result Card for Run Against Drugs 2026
function RunAgainstDrugsResultCard({
  registration,
  onReset,
}: {
  registration: Registration;
  onReset: () => void;
}) {
  const meta = STATUS_META[registration.status];
  const Icon = meta.icon;

  return (
    <Card className="border-slate-800 bg-slate-900 text-white shadow-2xl overflow-hidden">
      <CardHeader className="bg-slate-950 border-b border-slate-800 py-5">
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="outline" className="border-slate-700 text-slate-300 mb-1">
              Run Against Drugs 2026
            </Badge>
            <CardTitle className="text-2xl font-bold text-white">{registration.name}</CardTitle>
          </div>
          <Badge className={`border px-3 py-1 text-xs font-semibold ${meta.badgeClass}`}>
            <Icon className="mr-1.5 size-3.5" />
            {meta.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {registration.idNo && (
          <div className="rounded-xl bg-slate-800/80 border border-slate-700 p-4 text-center">
            <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Participant ID Number</span>
            <div className="text-3xl font-extrabold font-mono text-emerald-400 mt-1">{registration.idNo}</div>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoRow icon={User} label="Full Name" value={registration.name} />
          <InfoRow icon={Building2} label="Institution" value={registration.institutionName} />
          <InfoRow icon={GraduationCap} label="Academic Level" value={registration.academicLevel} />
          <InfoRow icon={Shirt} label="T-Shirt Size" value={registration.tShirtSize} />
          <InfoRow icon={Phone} label="bKash Number" value={registration.bkashNumber} />
          <InfoRow icon={Hash} label="Transaction ID" value={registration.transactionId} />
          <InfoRow icon={Phone} label="Phone Number" value={registration.phoneNumber} />
          <InfoRow icon={MessageCircle} label="WhatsApp Number" value={registration.whatsappNumber} />
        </div>
      </CardContent>
      <CardFooter className="bg-slate-950 border-t border-slate-800 px-6 py-4 flex justify-between">
        <Button variant="ghost" onClick={() => navigate("home")} className="text-slate-400 hover:text-white">
          <ArrowLeft className="mr-2 size-4" /> Portal Home
        </Button>
        <Button variant="outline" onClick={onReset} className="border-slate-700 text-white hover:bg-slate-800">
          <RotateCw className="mr-2 size-4" /> Search Again
        </Button>
      </CardFooter>
    </Card>
  );
}
