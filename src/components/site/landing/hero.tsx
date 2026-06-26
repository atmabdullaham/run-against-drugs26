"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import {
  CalendarDays,
  MapPin,
  Users,
  Route,
  ShieldCheck,
  ArrowRight,
  ChevronDown,
  Activity,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EVENT_CONFIG } from "@/lib/constants";
import { navigate } from "@/lib/nav";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const stats = [
  { icon: Users, label: "Participants", value: "500+" },
  { icon: Route, label: "Marathon", value: "5 KM" },
  { icon: ShieldCheck, label: "Pledge", value: "Drug-Free" },
];

function formatEventDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "December 16, 2026";
  }
}

export function Hero() {
  const onLearnMore = React.useCallback(() => {
    const el = document.getElementById("about");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <section
      id="hero"
      aria-label="Hero"
      className="relative isolate flex min-h-screen w-full items-center overflow-hidden bg-gradient-navy text-white"
    >
      {/* Pattern overlay */}
      <div
        aria-hidden
        className="bg-pattern absolute inset-0 opacity-60"
      />
      {/* Decorative gradient blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#1e90ff]/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-[#dc143c]/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-1/3 top-1/4 h-40 w-40 rounded-full bg-[#ffa500]/20 blur-3xl"
      />

      {/* Running track motif (decorative concentric rings, bottom-right) */}
      <svg
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 hidden h-[28rem] w-[28rem] text-white/10 md:block"
        viewBox="0 0 200 200"
        fill="none"
      >
        <circle cx="100" cy="100" r="95" stroke="currentColor" strokeWidth="1" />
        <circle cx="100" cy="100" r="75" stroke="currentColor" strokeWidth="1" />
        <circle cx="100" cy="100" r="55" stroke="currentColor" strokeWidth="1" />
        <circle cx="100" cy="100" r="35" stroke="currentColor" strokeWidth="1" />
        <circle cx="100" cy="100" r="15" stroke="currentColor" strokeWidth="1" />
      </svg>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center"
        >
          {/* Tagline pill */}
          <motion.div variants={itemVariants}>
            <Badge
              variant="secondary"
              className="mb-6 gap-2 rounded-full border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md"
            >
              <Activity className="size-3.5 text-[#ffa500]" />
              {EVENT_CONFIG.tagline}
            </Badge>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className="text-balance text-4xl font-extrabold leading-tight tracking-tight drop-shadow-md sm:text-5xl md:text-6xl lg:text-7xl"
          >
            <span className="block bg-gradient-to-r from-white via-[#87ceeb] to-[#1e90ff] bg-clip-text text-transparent">
              Run Against
            </span>
            <span className="mt-1 block bg-gradient-to-r from-[#ffa500] via-[#dc143c] to-[#dc143c] bg-clip-text text-transparent">
              Drugs 2025
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-2xl text-pretty text-base text-white/85 sm:text-lg md:text-xl"
          >
            {EVENT_CONFIG.subtitle}. Lace up your shoes and join hundreds of
            young changemakers running for a healthier, drug-free Bangladesh.
          </motion.p>

          {/* Date + location badges */}
          <motion.div
            variants={itemVariants}
            className="mt-6 flex flex-wrap items-center justify-center gap-2"
          >
            <Badge className="gap-2 rounded-full border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md sm:text-sm">
              <CalendarDays className="size-4 text-[#87ceeb]" />
              {formatEventDate(EVENT_CONFIG.eventDate)}
            </Badge>
            <Badge className="gap-2 rounded-full border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md sm:text-sm">
              <MapPin className="size-4 text-[#ffa500]" />
              {EVENT_CONFIG.location}
            </Badge>
          </motion.div>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="mt-9 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row"
          >
            <Button
              size="lg"
              onClick={() => navigate("register")}
              className="bg-gradient-red w-full rounded-full px-8 py-3 text-base font-semibold text-white shadow-red transition-transform hover:scale-105 hover:text-white sm:w-auto"
            >
              Register Now
              <ArrowRight className="size-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onLearnMore}
              className="w-full rounded-full border-white/40 bg-white/5 px-8 py-3 text-base font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/15 hover:text-white sm:w-auto"
            >
              Learn More
              <ChevronDown className="size-5" />
            </Button>
          </motion.div>

          {/* Stats badges */}
          <motion.div
            variants={itemVariants}
            className="mt-12 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3"
          >
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-md transition-transform hover:-translate-y-1"
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-gradient-sky text-white shadow-md">
                  <s.icon className="size-5" />
                </span>
                <div className="text-left">
                  <div className="text-lg font-bold leading-tight text-white">
                    {s.value}
                  </div>
                  <div className="text-xs uppercase tracking-wide text-white/70">
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade into next section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#f8fafc] to-transparent dark:from-[#0b1120]"
      />
    </section>
  );
}

export default Hero;
