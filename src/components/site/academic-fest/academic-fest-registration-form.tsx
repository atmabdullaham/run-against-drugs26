"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  School,
  Award,
  Phone,
  MapPin,
  Shirt,
  HelpCircle,
  Loader2,
  Send,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { navigate } from "@/lib/nav";
import { api, ApiError } from "@/lib/api";
import {
  HSC27_AF_CONFIG,
  ACADEMIC_FEST_GROUPS,
  EDUCATION_BOARDS,
  TSHIRT_SIZES,
  GENDER_OPTIONS,
} from "@/lib/constants";
import type { AcademicFestGroup, TShirtSize } from "@/types";

interface FormState {
  name: string;
  gender: "male" | "female" | "";
  institutionName: string;
  tShirtSize: TShirtSize | "";
  group: AcademicFestGroup | "";
  rollNumber: string;
  regNumber: string;
  board: string;
  phoneNumber: string;
  whatsappNumber: string;
  presentAddress: string;
  sameAsPresent: boolean;
  permanentAddress: string;
  guestQuestion: string;
}

const INITIAL_FORM: FormState = {
  name: "",
  gender: "",
  institutionName: "",
  tShirtSize: "",
  group: "",
  rollNumber: "",
  regNumber: "",
  board: "",
  phoneNumber: "",
  whatsappNumber: "",
  presentAddress: "",
  sameAsPresent: true,
  permanentAddress: "",
  guestQuestion: "",
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const PHONE_REGEX = /^01[0-9]{9}$/;
const ROLL_NUM_REGEX = /^[0-9]{6}$/;
const REG_NUM_REGEX = /^[0-9]{6,15}$/;

function validateField(field: keyof FormState, value: unknown, formState: FormState): string | undefined {
  const strVal = typeof value === "string" ? value : "";

  switch (field) {
    case "name":
      if (!strVal.trim()) return "Full name is required";
      if (strVal.trim().length < 3) return "Name must be at least 3 characters";
      return undefined;
    case "gender":
      if (!strVal) return "Please select your Gender";
      return undefined;
    case "institutionName":
      if (!strVal.trim()) return "Institution name is required";
      if (strVal.trim().length < 2) return "Institution name is too short";
      return undefined;
    case "tShirtSize":
      if (!strVal) return "Please select a T-shirt size";
      return undefined;
    case "group":
      if (!strVal) return "Please select a Group (Science, Commerce, Arts)";
      return undefined;
    case "rollNumber":
      if (!strVal.trim()) return "SSC Roll Number is required";
      if (!ROLL_NUM_REGEX.test(strVal.trim())) return "SSC Roll Number must be exactly 6 digits";
      return undefined;
    case "regNumber":
      if (!strVal.trim()) return "SSC Registration Number is required";
      if (!REG_NUM_REGEX.test(strVal.trim())) return "Valid registration number required (digits only)";
      return undefined;
    case "board":
      if (!strVal) return "Please select an Education Board";
      return undefined;
    case "phoneNumber":
      if (!strVal.trim()) return "Phone number is required";
      if (!PHONE_REGEX.test(strVal.trim())) return "Enter valid 11-digit phone number (01XXXXXXXXX)";
      return undefined;
    case "whatsappNumber":
      if (!strVal.trim()) return "WhatsApp number is required";
      if (!PHONE_REGEX.test(strVal.trim())) return "Enter valid 11-digit WhatsApp number (01XXXXXXXXX)";
      return undefined;
    case "presentAddress":
      if (!strVal.trim()) return "Present address is required";
      if (strVal.trim().length < 5) return "Address is too short (min 5 characters)";
      return undefined;
    case "permanentAddress":
      if (!formState.sameAsPresent) {
        if (!strVal.trim()) return "Permanent address is required";
        if (strVal.trim().length < 5) return "Address is too short (min 5 characters)";
      }
      return undefined;
    default:
      return undefined;
  }
}

export function AcademicFestRegistrationForm() {
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{ id: string; name: string; phoneNumber: string; rollNumber: string; regNumber: string } | null>(null);

  const isClosed = useMemo(() => {
    return Date.now() > new Date(HSC27_AF_CONFIG.registrationDeadline).getTime();
  }, []);

  // Handle "Same as Present Address" checkbox change
  const handleSameAsPresentChange = (checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      sameAsPresent: checked,
      permanentAddress: checked ? prev.presentAddress : prev.permanentAddress,
    }));
  };

  // Sync permanentAddress if sameAsPresent is true
  useEffect(() => {
    if (form.sameAsPresent) {
      setForm((prev) => ({ ...prev, permanentAddress: prev.presentAddress }));
    }
  }, [form.presentAddress, form.sameAsPresent]);

  const handleChange = useCallback(
    (field: keyof FormState, value: unknown) => {
      setForm((prev) => {
        const next = { ...prev, [field]: value };
        if (touched[field]) {
          const err = validateField(field, value, next);
          setErrors((prevErrs) => ({ ...prevErrs, [field]: err }));
        }
        return next;
      });
    },
    [touched]
  );

  const handleBlur = useCallback(
    (field: keyof FormState) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const err = validateField(field, form[field], form);
      setErrors((prevErrs) => ({ ...prevErrs, [field]: err }));
    },
    [form]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isClosed) return;

    const allTouched: Record<string, boolean> = {};
    const newErrors: FieldErrors = {};
    let hasError = false;

    (Object.keys(form) as (keyof FormState)[]).forEach((field) => {
      allTouched[field] = true;
      const err = validateField(field, form[field], form);
      if (err) {
        newErrors[field] = err;
        hasError = true;
      }
    });

    setTouched(allTouched);
    setErrors(newErrors);

    if (hasError) {
      toast({
        title: "Validation Error",
        description: "Please fix the highlighted fields in the form.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const json = await api.post<{
        success: boolean;
        data: {
          id: string;
          name: string;
          phoneNumber: string;
          rollNumber: string;
          regNumber: string;
        };
      }>("/api/event/hsc27-af/registration", {
        ...form,
        permanentAddress: form.sameAsPresent ? form.presentAddress : form.permanentAddress,
      });

      if (!json.success || !json.data) {
        throw new Error("Registration failed. Please try again.");
      }

      setSuccessData(json.data);
      toast({
        title: "Registration Successful! 🎉",
        description: `Welcome ${json.data.name}! Your registration has been submitted successfully.`,
      });
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      if (apiErr?.fields) {
        setErrors(apiErr.fields as FieldErrors);
        setTouched(
          Object.keys(apiErr.fields).reduce((acc, k) => {
            acc[k] = true;
            return acc;
          }, {} as Record<string, boolean>)
        );
      }
      const message =
        err instanceof Error
          ? err.message
          : "Registration failed. Please check your connection and try again.";

      toast({
        title: "Registration Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isClosed) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <Card className="border-amber-500/30 bg-slate-900 text-white">
          <CardHeader>
            <Clock className="mx-auto size-12 text-amber-400" />
            <CardTitle className="mt-2 text-2xl">Registration Closed</CardTitle>
            <CardDescription className="text-slate-400">
              Registration for the HSC&apos;27 Academic Fest ended on 20th August 2026.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("event/hsc27-af")} variant="outline" className="text-slate-900 border-white bg-white hover:bg-slate-200">
              <ArrowLeft className="mr-2 size-4" /> Back to Event Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Back Link */}
        <div className="mb-6">
          <button
            onClick={() => navigate("event/hsc27-af")}
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <ArrowLeft className="size-4" /> Back to Event Details
          </button>
        </div>

        <Card className="border-emerald-500/30 bg-slate-900 shadow-2xl text-white backdrop-blur-md">
          <CardHeader className="border-b border-emerald-900/60 pb-6 text-center">
            <div className="mx-auto mb-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-300">
              <Sparkles className="size-3.5 text-yellow-400" />
              {HSC27_AF_CONFIG.name}
            </div>
            <CardTitle className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Registration Form
            </CardTitle>
            <CardDescription className="text-emerald-100/70 text-sm mt-1">
              Provide your accurate student and SSC information to complete registration.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Section 1: Participant Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-emerald-800/40 pb-2 text-emerald-400">
                  <User className="size-5" />
                  <h3 className="text-base font-bold uppercase tracking-wider">Participant Information</h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-200 font-medium">
                       Full Name <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="e.g. Abdullah Al Mamun"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      onBlur={() => handleBlur("name")}
                      className={`bg-slate-950/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 ${
                        errors.name && touched.name ? "border-red-500" : ""
                      }`}
                    />
                    {errors.name && touched.name && (
                      <p className="text-xs text-red-400">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-slate-200 font-medium">
                      Gender <span className="text-red-400">*</span>
                    </Label>
                    <Select
                      value={form.gender}
                      onValueChange={(val) => handleChange("gender", val)}
                    >
                      <SelectTrigger
                        id="gender"
                        onBlur={() => handleBlur("gender")}
                        className={`bg-slate-950/80 border-slate-700 text-white ${
                          errors.gender && touched.gender ? "border-red-500" : ""
                        }`}
                      >
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700 text-white">
                        {GENDER_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.gender && touched.gender && (
                      <p className="text-xs text-red-400">{errors.gender}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="institutionName" className="text-slate-200 font-medium">
                      Institution Name <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="institutionName"
                      placeholder="e.g. Chittagong College"
                      value={form.institutionName}
                      onChange={(e) => handleChange("institutionName", e.target.value)}
                      onBlur={() => handleBlur("institutionName")}
                      className={`bg-slate-950/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 ${
                        errors.institutionName && touched.institutionName ? "border-red-500" : ""
                      }`}
                    />
                    {errors.institutionName && touched.institutionName && (
                      <p className="text-xs text-red-400">{errors.institutionName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="group" className="text-slate-200 font-medium">
                      Academic Group <span className="text-red-400">*</span>
                    </Label>
                    <Select
                      value={form.group}
                      onValueChange={(val) => handleChange("group", val)}
                    >
                      <SelectTrigger
                        id="group"
                        onBlur={() => handleBlur("group")}
                        className={`bg-slate-950/80 border-slate-700 text-white ${
                          errors.group && touched.group ? "border-red-500" : ""
                        }`}
                      >
                        <SelectValue placeholder="Select Group" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700 text-white">
                        {ACADEMIC_FEST_GROUPS.map((g) => (
                          <SelectItem key={g} value={g}>
                            {g}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.group && touched.group && (
                      <p className="text-xs text-red-400">{errors.group}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="tShirtSize" className="text-slate-200 font-medium">
                      T-Shirt Size (for Gift Hamper) <span className="text-red-400">*</span>
                    </Label>
                    <Select
                      value={form.tShirtSize}
                      onValueChange={(val) => handleChange("tShirtSize", val)}
                    >
                      <SelectTrigger
                        id="tShirtSize"
                        onBlur={() => handleBlur("tShirtSize")}
                        className={`bg-slate-950/80 border-slate-700 text-white ${
                          errors.tShirtSize && touched.tShirtSize ? "border-red-500" : ""
                        }`}
                      >
                        <SelectValue placeholder="Select T-shirt Size" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700 text-white">
                        {TSHIRT_SIZES.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size} Size
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.tShirtSize && touched.tShirtSize && (
                      <p className="text-xs text-red-400">{errors.tShirtSize}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 2: SSC Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-emerald-800/40 pb-2 text-emerald-400">
                  <Award className="size-5" />
                  <h3 className="text-base font-bold uppercase tracking-wider">SSC Details</h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="rollNumber" className="text-slate-200 font-medium">
                      SSC Roll Number <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="rollNumber"
                      placeholder="6-digit Roll Number"
                      maxLength={6}
                      value={form.rollNumber}
                      onChange={(e) => handleChange("rollNumber", e.target.value.replace(/\D/g, "").slice(0, 6))}
                      onBlur={() => handleBlur("rollNumber")}
                      className={`bg-slate-950/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 font-mono ${
                        errors.rollNumber && touched.rollNumber ? "border-red-500" : ""
                      }`}
                    />
                    {errors.rollNumber && touched.rollNumber && (
                      <p className="text-xs text-red-400">{errors.rollNumber}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="regNumber" className="text-slate-200 font-medium">
                      SSC Registration Number <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="regNumber"
                      placeholder="e.g. 2014859623"
                      value={form.regNumber}
                      onChange={(e) => handleChange("regNumber", e.target.value.replace(/\D/g, ""))}
                      onBlur={() => handleBlur("regNumber")}
                      className={`bg-slate-950/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 font-mono ${
                        errors.regNumber && touched.regNumber ? "border-red-500" : ""
                      }`}
                    />
                    {errors.regNumber && touched.regNumber && (
                      <p className="text-xs text-red-400">{errors.regNumber}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="board" className="text-slate-200 font-medium">
                      Education Board <span className="text-red-400">*</span>
                    </Label>
                    <Select
                      value={form.board}
                      onValueChange={(val) => handleChange("board", val)}
                    >
                      <SelectTrigger
                        id="board"
                        onBlur={() => handleBlur("board")}
                        className={`bg-slate-950/80 border-slate-700 text-white ${
                          errors.board && touched.board ? "border-red-500" : ""
                        }`}
                      >
                        <SelectValue placeholder="Select Board" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700 text-white">
                        {EDUCATION_BOARDS.map((b) => (
                          <SelectItem key={b} value={b}>
                            {b} Board
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.board && touched.board && (
                      <p className="text-xs text-red-400">{errors.board}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 3: Contact Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-emerald-800/40 pb-2 text-emerald-400">
                  <Phone className="size-5" />
                  <h3 className="text-base font-bold uppercase tracking-wider">Contact Numbers</h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-slate-200 font-medium">
                      Mobile Phone Number <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="phoneNumber"
                      placeholder="01XXXXXXXXX"
                      value={form.phoneNumber}
                      onChange={(e) => handleChange("phoneNumber", e.target.value.replace(/\D/g, "").slice(0, 11))}
                      onBlur={() => handleBlur("phoneNumber")}
                      className={`bg-slate-950/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 ${
                        errors.phoneNumber && touched.phoneNumber ? "border-red-500" : ""
                      }`}
                    />
                    {errors.phoneNumber && touched.phoneNumber && (
                      <p className="text-xs text-red-400">{errors.phoneNumber}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsappNumber" className="text-slate-200 font-medium">
                      WhatsApp Number <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="whatsappNumber"
                      placeholder="01XXXXXXXXX"
                      value={form.whatsappNumber}
                      onChange={(e) => handleChange("whatsappNumber", e.target.value.replace(/\D/g, "").slice(0, 11))}
                      onBlur={() => handleBlur("whatsappNumber")}
                      className={`bg-slate-950/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 ${
                        errors.whatsappNumber && touched.whatsappNumber ? "border-red-500" : ""
                      }`}
                    />
                    {errors.whatsappNumber && touched.whatsappNumber && (
                      <p className="text-xs text-red-400">{errors.whatsappNumber}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 4: Address Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-emerald-800/40 pb-2 text-emerald-400">
                  <MapPin className="size-5" />
                  <h3 className="text-base font-bold uppercase tracking-wider">Address Details</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="presentAddress" className="text-slate-200 font-medium">
                    Present Address <span className="text-red-400">*</span>
                  </Label>
                  <Textarea
                    id="presentAddress"
                    placeholder="Enter your current address"
                    rows={2}
                    value={form.presentAddress}
                    onChange={(e) => handleChange("presentAddress", e.target.value)}
                    onBlur={() => handleBlur("presentAddress")}
                    className={`bg-slate-950/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 ${
                      errors.presentAddress && touched.presentAddress ? "border-red-500" : ""
                    }`}
                  />
                  {errors.presentAddress && touched.presentAddress && (
                    <p className="text-xs text-red-400">{errors.presentAddress}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <Checkbox
                    id="sameAsPresent"
                    checked={form.sameAsPresent}
                    onCheckedChange={(checked) => handleSameAsPresentChange(Boolean(checked))}
                    className="border-slate-600 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                  />
                  <Label htmlFor="sameAsPresent" className="text-sm font-medium text-emerald-300 cursor-pointer">
                    Permanent Address is the same as Present Address
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="permanentAddress" className="text-slate-200 font-medium">
                    Permanent Address <span className="text-red-400">*</span>
                  </Label>
                  <Textarea
                    id="permanentAddress"
                    placeholder="Enter your permanent address"
                    rows={2}
                    disabled={form.sameAsPresent}
                    value={form.sameAsPresent ? form.presentAddress : form.permanentAddress}
                    onChange={(e) => handleChange("permanentAddress", e.target.value)}
                    onBlur={() => handleBlur("permanentAddress")}
                    className={`bg-slate-950/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 ${
                      form.sameAsPresent ? "opacity-60 cursor-not-allowed" : ""
                    } ${errors.permanentAddress && touched.permanentAddress ? "border-red-500" : ""}`}
                  />
                  {errors.permanentAddress && touched.permanentAddress && !form.sameAsPresent && (
                    <p className="text-xs text-red-400">{errors.permanentAddress}</p>
                  )}
                </div>
              </div>

              {/* Section 5: Question to Panelist / Guest */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-emerald-800/40 pb-2 text-emerald-400">
                  <MessageSquare className="size-5" />
                  <h3 className="text-base font-bold uppercase tracking-wider">Question to Panelist / Guest</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guestQuestion" className="text-slate-200 font-medium">
                    Question to Panelist / Guest <span className="text-xs text-slate-400 font-normal">(Optional)</span>
                  </Label>
                  <p className="text-xs text-emerald-200/90 font-sans leading-relaxed bg-emerald-950/60 p-3 rounded-lg border border-emerald-500/30 mb-2">
                    💡 <strong className="text-yellow-400">ডিসক্লেইমার:</strong> আপনি যদি অনুষ্ঠানে উপস্থিত সম্মানিত প্যানেলিস্ট বা অতিথিদের কোনো প্রশ্ন করতে চান, তবে তা এখানে লিখতে পারেন। নির্বাচিত সেরা প্রশ্নগুলো সেশনে উত্থাপন করা হবে।
                  </p>
                  <Textarea
                    id="guestQuestion"
                    placeholder="আপনার প্রশ্নটি এখানে লিখুন (অপশনাল)..."
                    rows={3}
                    value={form.guestQuestion}
                    onChange={(e) => handleChange("guestQuestion", e.target.value)}
                    className="bg-slate-950/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Verification & Admission Policy Notice Box */}
              <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-950/40 via-slate-900 to-emerald-950/40 p-4 sm:p-5 text-left">
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-400/20 text-yellow-400 border border-amber-400/30 mt-0.5">
                    <Sparkles className="size-4" />
                  </div>
                  <div className="space-y-1 text-xs leading-relaxed text-slate-200">
                    <div className="font-bold text-yellow-300 text-sm flex items-center gap-1.5">
                      Important Registration Policy
                    </div>
                    <p>
                      After verifying your information, the organizing team will process your registration. The team reserves the right to accept or reject any application without stating a reason. Seats are limited. Only accepted students will receive a confirmation message on their provided phone number.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 py-6 text-lg font-bold text-slate-950 shadow-lg shadow-yellow-500/20 hover:bg-yellow-300 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="size-5 animate-spin" /> Submitting Registration...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Send className="size-5" /> Submit Registration
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {successData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-2xl border border-emerald-500/40 bg-slate-900 p-6 text-center text-white shadow-2xl"
            >
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="size-10" />
              </div>
              <h3 className="text-2xl font-bold text-white">Registration Submitted!</h3>
              <p className="mt-2 text-sm text-slate-300">
                Thank you <span className="font-semibold text-yellow-400">{successData.name}</span> for registering for <span className="font-semibold text-emerald-300">HSC&apos;27 Academic Fest</span>!
              </p>

              <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-950/50 p-4 text-left text-xs space-y-2 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">SSC Roll No:</span>
                  <span className="font-bold text-white">{successData.rollNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">SSC Reg No:</span>
                  <span className="font-bold text-white">{successData.regNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Phone Number:</span>
                  <span className="font-bold text-white">{successData.phoneNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="font-semibold text-yellow-400 uppercase font-sans">Pending Review</span>
                </div>
              </div>

              {/* Policy note in Modal */}
              <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-950/30 p-3.5 text-left text-xs text-amber-200/90 leading-relaxed">
                ℹ️ <strong>Note:</strong> After verifying your information, the organizing team will process your registration. Seats are limited. Only accepted students will receive a confirmation message on their provided phone number.
              </div>

              {/* WhatsApp Community Link */}
              <div className="mt-4 rounded-xl border border-green-500/30 bg-green-950/40 p-4 text-center">
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

              <div className="mt-6 flex flex-col gap-2">
                <Button
                  onClick={() => {
                    setSuccessData(null);
                    setForm(INITIAL_FORM);
                    setTouched({});
                    setErrors({});
                    navigate("event/hsc27-af");
                  }}
                  className="w-full bg-emerald-500 font-bold text-slate-950 hover:bg-emerald-400"
                >
                  Return to Event Details
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
