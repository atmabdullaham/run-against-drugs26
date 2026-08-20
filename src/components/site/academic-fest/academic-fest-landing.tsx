"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Gift,
  Award,
  Clock,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Shirt,
  Utensils,
  Sparkles,
  Phone,
  GraduationCap,
  Lightbulb,
  Search,
  Archive,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HSC27_AF_CONFIG } from "@/lib/constants";
import { navigate } from "@/lib/nav";

export function AcademicFestLanding() {
  return (
    <div className="min-h-screen bg-slate-900 text-white selection:bg-emerald-500 selection:text-white">
      {/* Hero Section with Poster Theme */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-[#146b3a] via-[#105b31] to-slate-900 pt-20 pb-16 sm:pt-28 sm:pb-20">
        {/* Background Decorative Glows */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-emerald-400/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-0 -z-10 h-[400px] w-[400px] rounded-full bg-yellow-400/15 blur-3xl"
        />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            {/* Bismillah */}
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg sm:text-xl font-semibold tracking-wider text-emerald-200 font-serif mb-3"
            >
              بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </motion.p>



            {/* Main Poster Typography */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative mb-6"
            >
              <div className="flex items-center justify-center gap-3 sm:gap-4">
                <span className="bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-400 bg-clip-text text-5xl font-black tracking-tight text-transparent sm:text-7xl md:text-8xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)] font-sans">
                  HSC&apos;27
                </span>
                <span className="hidden sm:inline-flex items-center justify-center p-3 rounded-2xl bg-yellow-400/20 text-yellow-300 border border-yellow-400/30">
                  <BookOpen className="size-8 md:size-12" />
                </span>
              </div>
              <h1 className="mt-1 text-4xl font-black tracking-tight text-white sm:text-6xl md:text-7xl uppercase drop-shadow-md">
                ACADEMIC FEST
              </h1>
            </motion.div>

            {/* Event Status Banner (Upcoming Event • Registration Closed) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-950/50 px-5 py-2 text-xs sm:text-sm font-bold text-amber-300 shadow-lg backdrop-blur-md"
            >
              <span className="flex size-2 rounded-full bg-amber-400 animate-pulse" />
              REGISTRATION CLOSED • EVENT ON 5TH SEPTEMBER 2026
            </motion.div>

            {/* Poster Highlight: Special Guests from BUET, DMC, DU */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-2 max-w-3xl rounded-2xl border border-yellow-400/30 bg-emerald-950/80 p-5 sm:p-6 backdrop-blur-md shadow-2xl shadow-emerald-950/60"
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-center">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-yellow-400/20 text-yellow-400 border border-yellow-400/30">
                  <GraduationCap className="size-6" />
                </div>
                <div>
                  <p className="text-base sm:text-lg font-bold text-white leading-snug">
                    Meet the brilliant minds of{" "}
                    <span className="text-yellow-300 font-extrabold underline decoration-yellow-400/60 underline-offset-4">
                      BUET, DMC, DU
                    </span>{" "}
                    and top career specialists at Academic Fest
                  </p>
                  <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-800/80 px-3 py-1 text-xs font-extrabold text-emerald-200 border border-emerald-500/40">
                      <Lightbulb className="size-3 text-yellow-400" /> Get inspired
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-800/80 px-3 py-1 text-xs font-extrabold text-yellow-300 border border-emerald-500/40">
                      <Sparkles className="size-3 text-yellow-400" /> Dream bigger!
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Event Meta Cards (Date, Time, Venue, Status) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 grid w-full max-w-4xl grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4 text-left"
            >
              {/* Event Date */}
              <div className="flex items-center gap-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-950/60 p-4 backdrop-blur-md">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-yellow-400">
                  <Calendar className="size-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-300/80">Event Date</p>
                  <p className="text-sm sm:text-base font-extrabold text-white">5th Sep. 2026</p>
                </div>
              </div>

              {/* Event Time */}
              <div className="flex items-center gap-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-950/60 p-4 backdrop-blur-md">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-yellow-400">
                  <Clock className="size-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-300/80">Time</p>
                  <p className="text-sm sm:text-base font-extrabold text-white">8:30 AM</p>
                </div>
              </div>

              {/* Venue */}
              <div className="flex items-center gap-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-950/60 p-4 backdrop-blur-md">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-yellow-400">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-300/80">Venue</p>
                  <p className="text-sm sm:text-base font-extrabold text-white">Chattogram Press Club</p>
                </div>
              </div>

              {/* Registration Status */}
              <div className="flex items-center gap-3.5 rounded-2xl border border-amber-500/30 bg-emerald-950/60 p-4 backdrop-blur-md">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                  <Clock className="size-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-amber-300/90">Registration</p>
                  <p className="text-sm sm:text-base font-extrabold text-amber-300">Closed</p>
                </div>
              </div>
            </motion.div>

            {/* Call to Action Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-4"
            >
              <Button
                size="lg"
                onClick={() => navigate("my-registration")}
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 px-8 py-6 text-base font-extrabold text-slate-950 shadow-xl shadow-yellow-500/25 transition-all hover:scale-105 hover:shadow-yellow-500/40"
              >
                <Search className="mr-2 size-5 text-slate-950" />
                Check Registration Status
                <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("home")}
                className="rounded-full border-slate-700 bg-slate-900/80 px-8 py-6 text-base font-semibold text-white hover:bg-slate-800"
              >
                <ArrowLeft className="mr-2 size-5 text-emerald-400" />
                Back to Portal Home
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Event Registration Closed Section (Replaces Countdown Timer) */}
      <section className="relative border-y border-emerald-800/40 bg-emerald-950/60 py-14">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-950/50 px-4 py-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300 mb-4">
            <Clock className="size-4 text-amber-400" />
            Registration Closed • Event On 5th September 2026
          </div>

          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Registration Has Closed
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The registration window for the <strong className="text-yellow-300">HSC&apos;27 Academic Fest</strong> has officially closed. Thank you to all students who submitted their applications. Our team is actively reviewing and verifying applications.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-900/40 p-5 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="size-5 text-emerald-400 shrink-0" />
                <h3 className="font-bold text-white text-base">Check Your Status</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                If you have already submitted your form, you can look up your registration and verification status anytime.
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-900/40 p-5 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-2">
                <Phone className="size-5 text-yellow-400 shrink-0" />
                <h3 className="font-bold text-white text-base">SMS Confirmation</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Accepted participants will receive a confirmation SMS on their provided mobile number prior to the event date.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <Button
              onClick={() => navigate("my-registration")}
              className="rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 py-5 text-sm sm:text-base shadow-lg shadow-emerald-500/20"
            >
              <Search className="mr-2 size-4" />
              Look Up My Registration Record
            </Button>
          </div>
        </div>
      </section>

      {/* Details Section: Gift Hamper & Eligibility */}
      <section className="py-20 bg-slate-900">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Gift Hamper Card */}
            <Card className="border-emerald-500/30 bg-slate-800/90 text-white shadow-2xl backdrop-blur-md rounded-3xl overflow-hidden">
              <CardContent className="p-7 sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-yellow-400/20 text-yellow-400 border border-yellow-400/30">
                    <Gift className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold text-white">Gift Hamper</h3>
                    <p className="text-xs text-emerald-300 font-medium">Included for all accepted participants</p>
                  </div>
                </div>

                <ul className="space-y-3.5">
                  <li className="flex items-center gap-4 rounded-2xl bg-emerald-950/50 p-4 border border-emerald-500/20">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/20 text-yellow-400">
                      <Shirt className="size-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">T-shirt</h4>
                      <p className="text-xs text-slate-400">Custom branded event T-shirt</p>
                    </div>
                  </li>

                  <li className="flex items-center gap-4 rounded-2xl bg-emerald-950/50 p-4 border border-emerald-500/20">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/20 text-yellow-400">
                      <BookOpen className="size-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">Note Book</h4>
                      <p className="text-xs text-slate-400">Quality academic note book</p>
                    </div>
                  </li>

                  <li className="flex items-center gap-4 rounded-2xl bg-emerald-950/50 p-4 border border-emerald-500/20">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/20 text-yellow-400">
                      <Utensils className="size-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">Snacks</h4>
                      <p className="text-xs text-slate-400">Event day refreshment packet</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Eligibility Card */}
            <Card className="border-emerald-500/30 bg-slate-800/90 text-white shadow-2xl backdrop-blur-md rounded-3xl overflow-hidden">
              <CardContent className="p-7 sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-400/20 text-emerald-400 border border-emerald-400/30">
                    <Award className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold text-white">Eligibility Criteria</h3>
                    <p className="text-xs text-emerald-300 font-medium">SSC Result criteria for HSC&apos;27 batch</p>
                  </div>
                </div>

                <div className="space-y-3.5">
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/50 p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-300 text-base">Science Group</span>
                      <span className="rounded-full bg-yellow-400/20 px-3.5 py-1 text-sm font-extrabold text-yellow-400 border border-yellow-400/30">
                        GPA 5.00
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-400 font-medium">
                      Minimum GPA 5.00 in SSC examination.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/50 p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-300 text-base">Commerce Group</span>
                      <span className="rounded-full bg-yellow-400/20 px-3.5 py-1 text-sm font-extrabold text-yellow-400 border border-yellow-400/30">
                        GPA 4.50
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-400 font-medium">
                      Minimum GPA 4.50 in SSC examination.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/50 p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-300 text-base">Arts Group</span>
                      <span className="rounded-full bg-yellow-400/20 px-3.5 py-1 text-sm font-extrabold text-yellow-400 border border-yellow-400/30">
                        GPA 4.50
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-400 font-medium">
                      Minimum GPA 4.50 in SSC examination.
                    </p>
                  </div>

                  <div className="mt-5 flex items-center gap-2 text-xs text-slate-400 font-medium">
                    <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                    <span>Selected students will receive SMS notification with ID.</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Important Verification & Selection Policy Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-10 rounded-3xl border border-amber-400/40 bg-gradient-to-br from-amber-950/40 via-slate-800/90 to-emerald-950/40 p-6 sm:p-8 backdrop-blur-md shadow-2xl"
          >
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400/20 text-yellow-300 border border-amber-400/30 shadow-lg">
                <Sparkles className="size-6 text-yellow-400" />
              </div>
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                    Registration &amp; Verification Policy
                  </h3>
                  <span className="hidden sm:inline-flex rounded-full bg-amber-400/20 px-2.5 py-0.5 text-[11px] font-bold text-yellow-300 border border-amber-400/30">
                    Policy
                  </span>
                </div>

                <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                  After verifying information, the organizing team processes the registered participants. The team reserves the right to accept or reject any application without stating a reason. Seats are limited. Only accepted students will receive a confirmation message on their provided phone number.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="flex items-center gap-2.5 rounded-xl bg-slate-900/60 p-3 border border-slate-700/60 text-xs text-slate-300">
                    <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                    <span>Thorough info verification</span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl bg-slate-900/60 p-3 border border-slate-700/60 text-xs text-slate-300">
                    <Clock className="size-4 text-amber-400 shrink-0" />
                    <span>Limited capacity (300 seats)</span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl bg-slate-900/60 p-3 border border-slate-700/60 text-xs text-slate-300">
                    <Phone className="size-4 text-sky-400 shrink-0" />
                    <span>SMS sent to accepted students</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bottom Action Footer Banner */}
          <div className="mt-14 text-center">
            <Button
              size="lg"
              onClick={() => navigate("my-registration")}
              className="rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-10 py-6 text-base font-extrabold text-slate-950 hover:bg-yellow-300 shadow-xl shadow-yellow-400/20"
            >
              <Search className="mr-2 size-5" />
              Check Registration Status
            </Button>

            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-emerald-300/80 font-medium">
              <Phone className="size-3.5 text-yellow-400" />
              <span>Contact Helpline: <strong className="text-white">{HSC27_AF_CONFIG.contactPhone}</strong></span>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              {HSC27_AF_CONFIG.organizer}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AcademicFestLanding;
