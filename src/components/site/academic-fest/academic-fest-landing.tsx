"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HSC27_AF_CONFIG } from "@/lib/constants";
import { navigate } from "@/lib/nav";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(target: number): TimeLeft {
  const diff = target - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export function AcademicFestLanding() {
  const target = React.useMemo(
    () => new Date(HSC27_AF_CONFIG.registrationDeadline).getTime(),
    []
  );
  const [timeLeft, setTimeLeft] = React.useState<TimeLeft>(() =>
    getTimeLeft(target)
  );
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    setTimeLeft(getTimeLeft(target));
    const id = setInterval(() => {
      setTimeLeft(getTimeLeft(target));
    }, 1000);
    return () => clearInterval(id);
  }, [target]);

  const isClosed = mounted && target - Date.now() <= 0;

  return (
    <div className="min-h-screen bg-slate-900 text-white selection:bg-emerald-500 selection:text-white">
      {/* Hero Section with Poster Theme */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-slate-900 pt-24 pb-16 sm:pt-32 sm:pb-24">
        {/* Background Decorative Blur circles */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-emerald-500/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-0 -z-10 h-[400px] w-[400px] rounded-full bg-yellow-500/15 blur-3xl"
        />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            {/* Bismillah & Organizer Badge */}
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg font-semibold tracking-wider text-emerald-300 font-serif mb-2"
            >
              بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-950/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-300 backdrop-blur-md"
            >
              <Sparkles className="size-3.5 text-yellow-400" />
              {HSC27_AF_CONFIG.organizer}
            </motion.div>

            {/* Event Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <span className="inline-block bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-5xl font-black tracking-tight text-transparent sm:text-7xl md:text-8xl drop-shadow-sm">
                HSC&apos;27
              </span>
              <h1 className="mt-1 text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
                ACADEMIC FEST
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-2xl text-base text-emerald-100/90 sm:text-xl font-medium"
            >
              Honoring academic brilliant achievers of HSC 2027 batch. Register now to participate and receive exclusive gift hampers!
            </motion.p>

            {/* Quick Event Meta Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-10 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3"
            >
              <div className="flex items-center gap-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-4 text-left backdrop-blur-md">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-yellow-400">
                  <Calendar className="size-6" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-emerald-300/80">Event Date</p>
                  <p className="text-base font-bold text-white">5th Sept 2026</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-4 text-left backdrop-blur-md">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-yellow-400">
                  <MapPin className="size-6" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-emerald-300/80">Venue</p>
                  <p className="text-base font-bold text-white">Chattogram Press Club</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-4 text-left backdrop-blur-md">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-yellow-400">
                  <Clock className="size-6" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-emerald-300/80">Reg Deadline</p>
                  <p className="text-base font-bold text-white">20th August 2026</p>
                </div>
              </div>
            </motion.div>

            {/* Main Call to Action Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-10"
            >
              <Button
                size="lg"
                disabled={isClosed}
                onClick={() => navigate("event/hsc27-af/registration")}
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 px-10 py-7 text-lg font-bold text-slate-950 shadow-xl shadow-yellow-500/25 transition-all hover:scale-105 hover:shadow-yellow-500/40 disabled:opacity-50"
              >
                {isClosed ? "Registration Closed" : "Click for Registration"}
                <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Countdown Timer Section */}
      <section className="relative border-y border-emerald-800/40 bg-emerald-950/40 py-16">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <div className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-yellow-400">
            <Clock className="size-4" />
            Registration Timer
          </div>

          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            {isClosed ? "Registration Has Ended" : "Time Left to Register"}
          </h2>

          {!isClosed ? (
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Days", value: timeLeft.days },
                { label: "Hours", value: timeLeft.hours },
                { label: "Minutes", value: timeLeft.minutes },
                { label: "Seconds", value: timeLeft.seconds },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-emerald-500/30 bg-emerald-900/30 p-5 backdrop-blur-sm"
                >
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={item.value}
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 10, opacity: 0 }}
                      className="font-mono text-4xl font-extrabold text-yellow-400 sm:text-5xl"
                    >
                      {mounted ? pad(item.value) : "00"}
                    </motion.div>
                  </AnimatePresence>
                  <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-emerald-200/70">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-emerald-200/80">
              The registration deadline (20th August) has passed. Thank you for your interest!
            </p>
          )}
        </div>
      </section>

      {/* Details Section: Gift Hampers & Eligibility */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Gift Hamper Card */}
            <Card className="border-emerald-500/30 bg-slate-800/80 text-white shadow-2xl backdrop-blur-md">
              <CardContent className="p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-yellow-400/20 text-yellow-400">
                    <Gift className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Gift Hamper</h3>
                    <p className="text-xs text-emerald-300">Included for all registered participants</p>
                  </div>
                </div>

                <ul className="space-y-4">
                  <li className="flex items-center gap-4 rounded-xl bg-emerald-950/40 p-4 border border-emerald-500/20">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/20 text-yellow-400">
                      <Shirt className="size-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Event T-Shirt</h4>
                      <p className="text-xs text-slate-400">Custom branded HSC&apos;27 Fest T-shirt</p>
                    </div>
                  </li>

                  <li className="flex items-center gap-4 rounded-xl bg-emerald-950/40 p-4 border border-emerald-500/20">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/20 text-yellow-400">
                      <BookOpen className="size-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Academic Notebook</h4>
                      <p className="text-xs text-slate-400">High quality note book</p>
                    </div>
                  </li>

                  <li className="flex items-center gap-4 rounded-xl bg-emerald-950/40 p-4 border border-emerald-500/20">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/20 text-yellow-400">
                      <Utensils className="size-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Snacks & Refreshment</h4>
                      <p className="text-xs text-slate-400">Event day snacks packet</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Eligibility Card */}
            <Card className="border-emerald-500/30 bg-slate-800/80 text-white shadow-2xl backdrop-blur-md">
              <CardContent className="p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-400">
                    <Award className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Eligibility Criteria</h3>
                    <p className="text-xs text-emerald-300">SSC Result criteria for HSC&apos;27 batch</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/50 p-5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-emerald-300">Science Group</span>
                      <span className="rounded-full bg-yellow-400/20 px-3 py-1 text-sm font-bold text-yellow-400">
                        GPA 5.00
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-400">
                      Must have achieved GPA 5.00 in SSC/Equiv examination.
                    </p>
                  </div>

                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/50 p-5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-emerald-300">Arts & Commerce Group</span>
                      <span className="rounded-full bg-yellow-400/20 px-3 py-1 text-sm font-bold text-yellow-400">
                        GPA 4.50
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-400">
                      Must have achieved minimum GPA 4.50 in SSC/Equiv examination.
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
                    <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                    <span>Proof of SSC Registration Number & Result required during registration.</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Action Footer Banner */}
          <div className="mt-12 text-center">
            <Button
              size="lg"
              disabled={isClosed}
              onClick={() => navigate("event/hsc27-af/registration")}
              className="rounded-full bg-yellow-400 px-10 py-6 text-base font-bold text-slate-950 hover:bg-yellow-300 shadow-lg shadow-yellow-400/20"
            >
              Go to Registration Form
              <ArrowRight className="ml-2 size-5" />
            </Button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-emerald-300/80">
              <Phone className="size-3.5" />
              <span>Contact Helpline: {HSC27_AF_CONFIG.contactPhone}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
