"use client";

import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
  User,
  School,
  CreditCard,
  Phone,
  Loader2,
  Send,
  CheckCircle2,
  Info,
  Clock,
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
import { Badge } from "@/components/ui/badge";
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
  EVENT_CONFIG,
  ACADEMIC_LEVELS,
  ACADEMIC_VALUES,
  TSHIRT_SIZES,
} from "@/lib/constants";
import type { AcademicLevel } from "@/types";
import { SuccessModal } from "@/components/site/success-modal";

interface FormState {
  name: string;
  institutionName: string;
  academicLevel: AcademicLevel | "";
  academicValue: string;
  tShirtSize: string;
  bkashNumber: string;
  transactionId: string;
  phoneNumber: string;
  whatsappNumber: string;
  presentAddress: string;
  permanentAddress: string;
}

interface FieldErrors {
  [key: string]: string | undefined;
}

const INITIAL_FORM: FormState = {
  name: "",
  institutionName: "",
  academicLevel: "",
  academicValue: "",
  tShirtSize: "",
  bkashNumber: "",
  transactionId: "",
  phoneNumber: "",
  whatsappNumber: "",
  presentAddress: "",
  permanentAddress: "",
};

// Validation helpers
const PHONE_REGEX = /^01[0-9]{9}$/;
const TXN_REGEX = /^[A-Za-z0-9]{6,20}$/;

function validateField(field: keyof FormState, value: string): string | undefined {
  switch (field) {
    case "name":
      if (!value.trim()) return "Name is required";
      if (value.trim().length < 3) return "Name must be at least 3 characters";
      return undefined;
    case "institutionName":
      if (!value.trim()) return "Institution name is required";
      if (value.trim().length < 2) return "Institution name is too short";
      return undefined;
    case "academicLevel":
      if (!value) return "Please select an academic level";
      return undefined;
    case "academicValue":
      if (!value) return "Please select a class/year/semester";
      return undefined;
    case "tShirtSize":
      if (!value) return "Please select a T-shirt size";
      return undefined;
    case "bkashNumber":
      if (!value.trim()) return "bKash number is required";
      if (!PHONE_REGEX.test(value.trim()))
        return "Enter a valid 11-digit bKash number (01XXXXXXXXX)";
      return undefined;
    case "transactionId":
      if (!value.trim()) return "Transaction ID is required";
      if (!TXN_REGEX.test(value.trim()))
        return "Transaction ID must be 6-20 alphanumeric characters";
      return undefined;
    case "phoneNumber":
      if (!value.trim()) return "Phone number is required";
      if (!PHONE_REGEX.test(value.trim()))
        return "Enter a valid 11-digit phone number (01XXXXXXXXX)";
      return undefined;
    case "whatsappNumber":
      if (!value.trim()) return "WhatsApp number is required";
      if (!PHONE_REGEX.test(value.trim()))
        return "Enter a valid 11-digit WhatsApp number (01XXXXXXXXX)";
      return undefined;
    case "presentAddress":
      if (!value.trim()) return "Present address is required";
      if (value.trim().length < 5) return "Address is too short (min 5 characters)";
      return undefined;
    case "permanentAddress":
      if (!value.trim()) return "Permanent address is required";
      if (value.trim().length < 5) return "Address is too short (min 5 characters)";
      return undefined;
    default:
      return undefined;
  }
}

export function RegistrationForm() {
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [sameAddress, setSameAddress] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const isClosed = useMemo(() => {
    return Date.now() > new Date(EVENT_CONFIG.registrationDeadline).getTime();
  }, []);

  const academicValueOptions = useMemo(() => {
    if (!form.academicLevel) return [];
    return ACADEMIC_VALUES[form.academicLevel] || [];
  }, [form.academicLevel]);

  const updateField = useCallback(
    (field: keyof FormState, value: string) => {
      let nextValue = value;

      // Auto-uppercase transaction ID
      if (field === "transactionId") {
        nextValue = value.toUpperCase();
      }

      setForm((prev) => {
        const next = { ...prev, [field]: nextValue };

        // If present address changes and sameAddress is on, mirror it
        if (field === "presentAddress" && sameAddress) {
          next.permanentAddress = nextValue;
        }

        return next;
      });

      // Re-validate if previously touched
      if (touched[field]) {
        const err = validateField(field, nextValue);
        setErrors((prev) => ({ ...prev, [field]: err }));
      }

      // For permanent address mirrored via present address + checkbox
      if (field === "presentAddress" && sameAddress && touched.permanentAddress) {
        setErrors((prev) => ({ ...prev, permanentAddress: undefined }));
      }
    },
    [sameAddress, touched]
  );

  const handleBlur = useCallback(
    (field: keyof FormState) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const err = validateField(field, form[field]);
      setErrors((prev) => ({ ...prev, [field]: err }));
    },
    [form]
  );

  const handleAcademicLevelChange = useCallback(
    (value: string) => {
      setForm((prev) => ({
        ...prev,
        academicLevel: value as AcademicLevel,
        academicValue: "",
      }));
      // Re-validate level, and clear value error since it just reset
      setErrors((prev) => ({
        ...prev,
        academicLevel: validateField("academicLevel", value),
        academicValue: undefined,
      }));
      setTouched((prev) => ({ ...prev, academicLevel: true, academicValue: false }));
    },
    []
  );

  const handleSameAddressChange = useCallback(
    (checked: boolean) => {
      setSameAddress(checked);
      if (checked) {
        setForm((prev) => ({
          ...prev,
          permanentAddress: prev.presentAddress,
        }));
        setErrors((prev) => ({ ...prev, permanentAddress: undefined }));
      } else {
        // Allow user to edit again
        setTouched((prev) => ({ ...prev, permanentAddress: true }));
        const err = validateField("permanentAddress", form.permanentAddress);
        setErrors((prev) => ({ ...prev, permanentAddress: err }));
      }
    },
    [form.permanentAddress]
  );

  const validateAll = useCallback((): FieldErrors => {
    const next: FieldErrors = {};
    (Object.keys(form) as Array<keyof FormState>).forEach((field) => {
      const err = validateField(field, form[field]);
      if (err) next[field] = err;
    });
    return next;
  }, [form]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const allErrors = validateAll();
      const allTouched: Record<string, boolean> = {};
      (Object.keys(form) as Array<keyof FormState>).forEach((k) => {
        allTouched[k] = true;
      });
      setTouched(allTouched);
      setErrors(allErrors);

      if (Object.keys(allErrors).length > 0) {
        toast({
          variant: "destructive",
          title: "Please fix the errors",
          description: "Some fields need your attention before submitting.",
        });
        // Focus first error
        const firstErrorField = Object.keys(allErrors)[0];
        if (firstErrorField) {
          const el = document.getElementById(`field-${firstErrorField}`);
          el?.focus();
        }
        return;
      }

      setSubmitting(true);
      try {
        await api.post("/api/registration", {
          name: form.name.trim(),
          institutionName: form.institutionName.trim(),
          academicLevel: form.academicLevel,
          academicValue: form.academicValue,
          tShirtSize: form.tShirtSize,
          bkashNumber: form.bkashNumber.trim(),
          transactionId: form.transactionId.trim().toUpperCase(),
          phoneNumber: form.phoneNumber.trim(),
          whatsappNumber: form.whatsappNumber.trim(),
          presentAddress: form.presentAddress.trim(),
          permanentAddress: form.permanentAddress.trim(),
        });

        toast({
          title: "Registration Submitted!",
          description: "Your registration is now under review.",
        });

        // Reset form
        setForm(INITIAL_FORM);
        setErrors({});
        setTouched({});
        setSameAddress(false);
        setShowSuccess(true);
      } catch (err) {
        const apiErr = err as ApiError;
        if (apiErr.fields) {
          // Field-level errors from server
          setErrors(apiErr.fields);
          setTouched(
            Object.keys(apiErr.fields).reduce((acc, k) => {
              acc[k] = true;
              return acc;
            }, {} as Record<string, boolean>)
          );
        }
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: apiErr.message || "Something went wrong. Please try again.",
        });
      } finally {
        setSubmitting(false);
      }
    },
    [form, validateAll, toast]
  );

  // Section animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.1 * i, duration: 0.4, ease: "easeOut" as const },
    }),
  };

  if (isClosed) {
    return (
      <div className="w-full max-w-2xl mx-auto pb-12 px-4 sm:px-6">
        <Card className="border-brand-red/30 bg-card shadow-lg text-center overflow-hidden relative">
          <div aria-hidden className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-brand-red to-brand-orange" />
          <CardHeader className="pt-8 pb-4 flex flex-col items-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-brand-red/10 mb-4 animate-pulse">
              <Clock className="w-8 h-8 text-brand-red" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-gradient-navy">
              Registration Closed
            </CardTitle>
            <CardDescription className="text-sm sm:text-base mt-2 max-w-md mx-auto">
              Registration for the {EVENT_CONFIG.name} is now closed. Thank you to everyone who registered!
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8 pt-2 flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground max-w-sm">
              If you have already registered, you can verify your details and status on the &quot;My Registration&quot; page.
            </p>
            <Button
              type="button"
              onClick={() => navigate("my-registration")}
              className="bg-gradient-navy text-white hover:opacity-90 shadow-navy rounded-full px-6 py-2 mt-2"
            >
              Check My Registration
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <motion.form
        onSubmit={handleSubmit}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl mx-auto pb-12 px-4 sm:px-6"
        noValidate
      >
        {/* Header */}
        <motion.div
          variants={sectionVariants}
          custom={0}
          className="text-center mb-8"
        >
          <Badge className="mb-3 bg-brand-red/10 text-brand-red border-brand-red/20 hover:bg-brand-red/15">
            {EVENT_CONFIG.name}
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-gradient-navy mb-2">
            Registration Form
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Fill in your details below to secure your spot in the marathon.
          </p>
        </motion.div>

        {/* bKash Payment Info Banner */}
        <motion.div
          variants={sectionVariants}
          custom={1}
          className="mb-8 rounded-xl border border-brand-orange/30 bg-brand-orange/5 p-4 sm:p-5"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5">
            <div className="flex items-center gap-3 flex-1">
              <div className="flex items-center justify-center w-11 h-11 rounded-full bg-brand-orange/15 shrink-0">
                <CreditCard className="w-5 h-5 text-brand-orange" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-navy">
                    bKash Payment
                  </span>
                  <Badge
                    variant="outline"
                    className="text-brand-orange border-brand-orange/40"
                  >
                    Required
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Send{" "}
                  <span className="font-semibold text-navy">
                    {EVENT_CONFIG.registrationFee} BDT
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-navy">
                    {EVENT_CONFIG.bkashNumber}
                  </span>{" "}
                  (Personal) and use the Transaction ID below.
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard?.writeText(EVENT_CONFIG.bkashNumber);
                toast({ title: "bKash number copied!" });
              }}
              className="shrink-0 w-full sm:w-auto border-brand-orange/40 text-brand-orange hover:bg-brand-orange/10"
            >
              Copy Number
            </Button>
          </div>
        </motion.div>

        {/* Section 1: Personal Info (Sky theme) */}
        <motion.div
          variants={sectionVariants}
          custom={2}
          className="rounded-xl border-t-4 border-t-sky shadow-sm mb-6 overflow-hidden"
        >
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-navy text-lg">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-sky/10">
                  <User className="w-4 h-4 text-sky" />
                </span>
                Personal Information
              </CardTitle>
              <CardDescription>
                Tell us about yourself and your academic background.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {/* Name */}
              <div className="md:col-span-2">
                <Label htmlFor="field-name" className="mb-1.5">
                  Full Name <span className="text-brand-red">*</span>
                </Label>
                <Input
                  id="field-name"
                  type="text"
                  placeholder="e.g. Mohammad Rahman"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "err-name" : undefined}
                  disabled={submitting}
                />
                {errors.name && (
                  <p
                    id="err-name"
                    role="alert"
                    className="text-xs text-brand-red mt-1.5 flex items-center gap-1"
                  >
                    <Info className="w-3 h-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Institution Name */}
              <div className="md:col-span-2">
                <Label htmlFor="field-institutionName" className="mb-1.5">
                  Institution Name <span className="text-brand-red">*</span>
                </Label>
                <Input
                  id="field-institutionName"
                  type="text"
                  placeholder="e.g. Dhaka College"
                  value={form.institutionName}
                  onChange={(e) =>
                    updateField("institutionName", e.target.value)
                  }
                  onBlur={() => handleBlur("institutionName")}
                  aria-invalid={!!errors.institutionName}
                  aria-describedby={
                    errors.institutionName ? "err-institutionName" : undefined
                  }
                  disabled={submitting}
                />
                {errors.institutionName && (
                  <p
                    id="err-institutionName"
                    role="alert"
                    className="text-xs text-brand-red mt-1.5 flex items-center gap-1"
                  >
                    <Info className="w-3 h-3" />
                    {errors.institutionName}
                  </p>
                )}
              </div>

              {/* Academic Level */}
              <div>
                <Label htmlFor="field-academicLevel" className="mb-1.5">
                  Academic Level <span className="text-brand-red">*</span>
                </Label>
                <Select
                  value={form.academicLevel}
                  onValueChange={handleAcademicLevelChange}
                  disabled={submitting}
                >
                  <SelectTrigger
                    id="field-academicLevel"
                    className="w-full"
                    aria-invalid={!!errors.academicLevel}
                    aria-describedby={
                      errors.academicLevel ? "err-academicLevel" : undefined
                    }
                  >
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACADEMIC_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.academicLevel && (
                  <p
                    id="err-academicLevel"
                    role="alert"
                    className="text-xs text-brand-red mt-1.5 flex items-center gap-1"
                  >
                    <Info className="w-3 h-3" />
                    {errors.academicLevel}
                  </p>
                )}
              </div>

              {/* Academic Value */}
              <div>
                <Label htmlFor="field-academicValue" className="mb-1.5">
                  Class / Year / Semester <span className="text-brand-red">*</span>
                </Label>
                <Select
                  value={form.academicValue}
                  onValueChange={(v) => updateField("academicValue", v)}
                  disabled={submitting || !form.academicLevel}
                >
                  <SelectTrigger
                    id="field-academicValue"
                    className="w-full"
                    aria-invalid={!!errors.academicValue}
                    aria-describedby={
                      errors.academicValue ? "err-academicValue" : undefined
                    }
                  >
                    <SelectValue
                      placeholder={
                        form.academicLevel
                          ? "Select value"
                          : "Choose level first"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {academicValueOptions.map((val) => (
                      <SelectItem key={val} value={val}>
                        {val}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.academicValue && (
                  <p
                    id="err-academicValue"
                    role="alert"
                    className="text-xs text-brand-red mt-1.5 flex items-center gap-1"
                  >
                    <Info className="w-3 h-3" />
                    {errors.academicValue}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Section 2: Payment Info (Orange theme) */}
        <motion.div
          variants={sectionVariants}
          custom={3}
          className="rounded-xl border-t-4 border-t-brand-orange shadow-sm mb-6 overflow-hidden"
        >
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-navy text-lg">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-orange/10">
                  <CreditCard className="w-4 h-4 text-brand-orange" />
                </span>
                Payment Information
              </CardTitle>
              <CardDescription>
                T-shirt size and bKash transaction details.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {/* T-Shirt Size */}
              <div>
                <Label htmlFor="field-tShirtSize" className="mb-1.5">
                  T-Shirt Size <span className="text-brand-red">*</span>
                </Label>
                <Select
                  value={form.tShirtSize}
                  onValueChange={(v) => updateField("tShirtSize", v)}
                  disabled={submitting}
                >
                  <SelectTrigger
                    id="field-tShirtSize"
                    className="w-full"
                    aria-invalid={!!errors.tShirtSize}
                    aria-describedby={
                      errors.tShirtSize ? "err-tShirtSize" : undefined
                    }
                  >
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {TSHIRT_SIZES.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.tShirtSize && (
                  <p
                    id="err-tShirtSize"
                    role="alert"
                    className="text-xs text-brand-red mt-1.5 flex items-center gap-1"
                  >
                    <Info className="w-3 h-3" />
                    {errors.tShirtSize}
                  </p>
                )}
              </div>

              {/* bKash Number */}
              <div>
                <Label htmlFor="field-bkashNumber" className="mb-1.5">
                  bKash Number (Sent From){" "}
                  <span className="text-brand-red">*</span>
                </Label>
                <Input
                  id="field-bkashNumber"
                  type="tel"
                  inputMode="numeric"
                  maxLength={11}
                  placeholder="01XXXXXXXXX"
                  value={form.bkashNumber}
                  onChange={(e) =>
                    updateField(
                      "bkashNumber",
                      e.target.value.replace(/[^0-9]/g, "")
                    )
                  }
                  onBlur={() => handleBlur("bkashNumber")}
                  aria-invalid={!!errors.bkashNumber}
                  aria-describedby={
                    errors.bkashNumber ? "err-bkashNumber" : undefined
                  }
                  disabled={submitting}
                />
                {errors.bkashNumber && (
                  <p
                    id="err-bkashNumber"
                    role="alert"
                    className="text-xs text-brand-red mt-1.5 flex items-center gap-1"
                  >
                    <Info className="w-3 h-3" />
                    {errors.bkashNumber}
                  </p>
                )}
              </div>

              {/* Transaction ID */}
              <div className="md:col-span-2">
                <Label htmlFor="field-transactionId" className="mb-1.5">
                  bKash Transaction ID <span className="text-brand-red">*</span>
                </Label>
                <Input
                  id="field-transactionId"
                  type="text"
                  placeholder="e.g. 9XQ4AB12CD"
                  value={form.transactionId}
                  onChange={(e) => updateField("transactionId", e.target.value)}
                  onBlur={() => handleBlur("transactionId")}
                  aria-invalid={!!errors.transactionId}
                  aria-describedby={
                    errors.transactionId ? "err-transactionId" : undefined
                  }
                  disabled={submitting}
                  className="uppercase tracking-wider font-mono"
                  style={{ textTransform: "uppercase" }}
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  Found in your bKash app under “Transaction History”. 6-20
                  alphanumeric characters, auto-uppercase.
                </p>
                {errors.transactionId && (
                  <p
                    id="err-transactionId"
                    role="alert"
                    className="text-xs text-brand-red mt-1.5 flex items-center gap-1"
                  >
                    <Info className="w-3 h-3" />
                    {errors.transactionId}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Section 3: Contact Info (Green theme) */}
        <motion.div
          variants={sectionVariants}
          custom={4}
          className="rounded-xl border-t-4 border-t-brand-green shadow-sm mb-6 overflow-hidden"
        >
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-navy text-lg">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-green/10">
                  <Phone className="w-4 h-4 text-brand-green" />
                </span>
                Contact Information
              </CardTitle>
              <CardDescription>
                How we reach you for updates and SMS notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {/* Phone Number */}
              <div>
                <Label htmlFor="field-phoneNumber" className="mb-1.5">
                  Phone Number <span className="text-brand-red">*</span>
                </Label>
                <Input
                  id="field-phoneNumber"
                  type="tel"
                  inputMode="numeric"
                  maxLength={11}
                  placeholder="01XXXXXXXXX"
                  value={form.phoneNumber}
                  onChange={(e) =>
                    updateField(
                      "phoneNumber",
                      e.target.value.replace(/[^0-9]/g, "")
                    )
                  }
                  onBlur={() => handleBlur("phoneNumber")}
                  aria-invalid={!!errors.phoneNumber}
                  aria-describedby={
                    errors.phoneNumber ? "err-phoneNumber" : undefined
                  }
                  disabled={submitting}
                />
                {errors.phoneNumber && (
                  <p
                    id="err-phoneNumber"
                    role="alert"
                    className="text-xs text-brand-red mt-1.5 flex items-center gap-1"
                  >
                    <Info className="w-3 h-3" />
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              {/* WhatsApp Number */}
              <div>
                <Label htmlFor="field-whatsappNumber" className="mb-1.5">
                  WhatsApp Number <span className="text-brand-red">*</span>
                </Label>
                <Input
                  id="field-whatsappNumber"
                  type="tel"
                  inputMode="numeric"
                  maxLength={11}
                  placeholder="01XXXXXXXXX"
                  value={form.whatsappNumber}
                  onChange={(e) =>
                    updateField(
                      "whatsappNumber",
                      e.target.value.replace(/[^0-9]/g, "")
                    )
                  }
                  onBlur={() => handleBlur("whatsappNumber")}
                  aria-invalid={!!errors.whatsappNumber}
                  aria-describedby={
                    errors.whatsappNumber ? "err-whatsappNumber" : undefined
                  }
                  disabled={submitting}
                />
                {errors.whatsappNumber && (
                  <p
                    id="err-whatsappNumber"
                    role="alert"
                    className="text-xs text-brand-red mt-1.5 flex items-center gap-1"
                  >
                    <Info className="w-3 h-3" />
                    {errors.whatsappNumber}
                  </p>
                )}
              </div>

              {/* Present Address */}
              <div className="md:col-span-2">
                <Label htmlFor="field-presentAddress" className="mb-1.5">
                  Present Address <span className="text-brand-red">*</span>
                </Label>
                <Textarea
                  id="field-presentAddress"
                  placeholder="House, Road, Area, Thana, District"
                  value={form.presentAddress}
                  onChange={(e) =>
                    updateField("presentAddress", e.target.value)
                  }
                  onBlur={() => handleBlur("presentAddress")}
                  aria-invalid={!!errors.presentAddress}
                  aria-describedby={
                    errors.presentAddress ? "err-presentAddress" : undefined
                  }
                  disabled={submitting}
                  className="min-h-[80px] resize-y"
                />
                {errors.presentAddress && (
                  <p
                    id="err-presentAddress"
                    role="alert"
                    className="text-xs text-brand-red mt-1.5 flex items-center gap-1"
                  >
                    <Info className="w-3 h-3" />
                    {errors.presentAddress}
                  </p>
                )}
              </div>

              {/* Same address checkbox */}
              <div className="md:col-span-2 flex items-center gap-2 -mt-1">
                <Checkbox
                  id="same-address"
                  checked={sameAddress}
                  onCheckedChange={(checked) =>
                    handleSameAddressChange(checked === true)
                  }
                  disabled={submitting}
                />
                <Label
                  htmlFor="same-address"
                  className="text-sm font-normal text-muted-foreground cursor-pointer"
                >
                  Same as Present Address
                </Label>
              </div>

              {/* Permanent Address */}
              <div className="md:col-span-2">
                <Label htmlFor="field-permanentAddress" className="mb-1.5">
                  Permanent Address <span className="text-brand-red">*</span>
                </Label>
                <Textarea
                  id="field-permanentAddress"
                  placeholder="House, Road, Village, Post Office, Thana, District"
                  value={form.permanentAddress}
                  onChange={(e) =>
                    updateField("permanentAddress", e.target.value)
                  }
                  onBlur={() => handleBlur("permanentAddress")}
                  aria-invalid={!!errors.permanentAddress}
                  aria-describedby={
                    errors.permanentAddress
                      ? "err-permanentAddress"
                      : undefined
                  }
                  disabled={submitting || sameAddress}
                  className="min-h-[80px] resize-y"
                />
                {errors.permanentAddress && (
                  <p
                    id="err-permanentAddress"
                    role="alert"
                    className="text-xs text-brand-red mt-1.5 flex items-center gap-1"
                  >
                    <Info className="w-3 h-3" />
                    {errors.permanentAddress}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Submit section */}
        <motion.div
          variants={sectionVariants}
          custom={5}
          className="flex flex-col items-center gap-3"
        >
          <p className="text-xs text-muted-foreground text-center max-w-md">
            By submitting, you confirm that all information provided is accurate
            and the bKash payment has been sent successfully.
          </p>
          <Button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto min-w-[260px] h-12 bg-gradient-navy text-white hover:opacity-90 shadow-navy text-base font-semibold"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Complete Registration
              </>
            )}
          </Button>
          <button
            type="button"
            onClick={() => navigate("home")}
            className="text-sm text-muted-foreground hover:text-navy transition-colors mt-1"
          >
            ← Back to home
          </button>
        </motion.div>
      </motion.form>

      <SuccessModal open={showSuccess} onClose={() => setShowSuccess(false)} />
    </>
  );
}
