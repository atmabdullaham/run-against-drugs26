"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import {
  CalendarDays,
  MapPin,
  Route,
  Banknote,
  Phone,
  Smartphone,
  ClipboardList,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EVENT_CONFIG } from "@/lib/constants";
import { navigate } from "@/lib/nav";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

interface InfoItem {
  icon: LucideIcon;
  title: string;
  value: string;
  hint?: string;
  iconClass: string;
  badgeClass: string;
}

const infoItems: InfoItem[] = [
  {
    icon: CalendarDays,
    title: "Date & Time",
    value: "June 30, 2026",
    hint: "Deadline: June 28, 2026 (11:59 PM)",
    iconClass: "text-[#1e90ff]",
    badgeClass: "bg-gradient-sky text-white",
  },
  {
    icon: MapPin,
    title: "Location",
    value: "Chawkbazar (Gulzar Mor)",
    hint: "Chittagong",
    iconClass: "text-[#dc143c]",
    badgeClass: "bg-gradient-red text-white",
  },
  {
    icon: Route,
    title: "Distance",
    value: "3 KM Run",
    hint: "For male students only",
    iconClass: "text-[#228b22]",
    badgeClass: "bg-[#228b22] text-white",
  },
  {
    icon: Banknote,
    title: "Registration Fee",
    value: `${EVENT_CONFIG.registrationFee} BDT`,
    hint: "Includes T-shirt & snacks",
    iconClass: "text-[#ffa500]",
    badgeClass: "bg-gradient-orange text-white",
  },
  {
    icon: Smartphone,
    title: "bKash Number",
    value: EVENT_CONFIG.bkashNumber,
    hint: "Send Money (Personal)",
    iconClass: "text-[#173083]",
    badgeClass: "bg-gradient-navy text-white",
  },
  {
    icon: Phone,
    title: "Contact",
    value: EVENT_CONFIG.contactPhone,
    hint: "Call for any query",
    iconClass: "text-[#1e90ff]",
    badgeClass: "bg-gradient-sky text-white",
  },
];

const steps = [
  {
    title: "Pay via bKash",
    description: `Send ${EVENT_CONFIG.registrationFee} BDT to ${EVENT_CONFIG.bkashNumber} (Send Money). Keep your Transaction ID safe.`,
  },
  {
    title: "Fill the registration form",
    description:
      "Click Register Now and submit your personal, academic, and T-shirt details along with the bKash Transaction ID.",
  },
  {
    title: "Get confirmation",
    description:
      "Once our admin verifies your payment, you will receive an SMS with your unique ID number (e.g. RD001).",
  },
];

export function EventInfo() {
  return (
    <section
      id="details"
      aria-label="Event details and registration instructions"
      className="relative w-full bg-background py-20 sm:py-24"
    >
      <div aria-hidden className="bg-pattern absolute inset-0 opacity-60" />
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <Badge className="mb-3 gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
            <ClipboardList className="size-3.5" />
            Event Details
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight text-gradient-navy sm:text-4xl">
            Everything You Need to Know
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            Date, location, distance, fees and a step-by-step guide to register
            for the Run Against Drugs 2026 run.
          </p>
        </motion.div>

        {/* Info cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {infoItems.map((item) => (
            <motion.div key={item.title} variants={itemVariants}>
              <Card className="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-navy">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex size-11 items-center justify-center rounded-xl ${item.badgeClass} shadow-sm`}
                    >
                      <item.icon className="size-5" />
                    </div>
                  </div>
                  <CardTitle className="mt-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="text-lg font-bold text-foreground">
                    {item.value}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {item.hint && (
                    <p className="text-sm text-muted-foreground">{item.hint}</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* How to Register */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mt-16"
        >
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <h3 className="text-2xl font-bold text-gradient-navy sm:text-3xl">
              How to Register
            </h3>
            <p className="mt-2 text-muted-foreground">
              Three simple steps to secure your spot in the marathon.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {steps.map((step, idx) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative rounded-2xl border bg-card p-6 shadow-sm transition-transform hover:-translate-y-1"
              >
                <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-gradient-navy text-base font-bold text-white shadow-navy">
                  {idx + 1}
                </div>
                <h4 className="text-lg font-semibold text-foreground">
                  {step.title}
                </h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* bKash payment callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mt-10 overflow-hidden rounded-2xl border border-[#dc143c]/30 bg-gradient-to-br from-[#dc143c]/10 via-[#ffa500]/10 to-[#ffa500]/5 p-6 sm:p-8"
        >
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-red text-white shadow-red">
                <Smartphone className="size-6" />
              </div>
              <div>
                <h4 className="flex items-center gap-2 text-lg font-bold text-foreground">
                  bKash Payment Instructions
                  <CheckCircle2 className="size-5 text-[#228b22]" />
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Send{" "}
                  <span className="font-semibold text-foreground">
                    {EVENT_CONFIG.registrationFee} BDT
                  </span>{" "}
                  via{" "}
                  <span className="font-semibold text-foreground">
                    Send Money
                  </span>{" "}
                  to{" "}
                  <span className="rounded-md bg-[#dc143c]/10 px-2 py-0.5 font-mono font-semibold text-[#dc143c]">
                    {EVENT_CONFIG.bkashNumber}
                  </span>{" "}
                  and use the Transaction ID in the registration form.
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate("register")}
              className="bg-gradient-red shrink-0 rounded-full px-6 py-3 font-semibold text-white shadow-red hover:text-white"
            >
              Register Now
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default EventInfo;
