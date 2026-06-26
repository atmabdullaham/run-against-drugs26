"use client";

import * as React from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Clock, ArrowRight, Flag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EVENT_CONFIG } from "@/lib/constants";
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

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export function Countdown() {
  const target = React.useMemo(
    () => new Date(EVENT_CONFIG.eventDate).getTime(),
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

  const eventStarted = mounted && target - Date.now() <= 0;

  const units: { label: string; value: number }[] = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <section
      id="countdown"
      aria-label="Countdown to event start"
      className="relative isolate w-full overflow-hidden bg-gradient-navy py-20 text-white sm:py-24"
    >
      <div aria-hidden className="bg-pattern absolute inset-0 opacity-50" />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-[#1e90ff]/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-[#dc143c]/20 blur-3xl"
      />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col items-center text-center"
        >
          <motion.div
            variants={itemVariants}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md"
          >
            <Clock className="size-3.5 text-[#ffa500]" />
            Mark Your Calendar
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl"
          >
            {eventStarted ? "Event Has Started!" : "Event Starts In"}
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mt-3 max-w-xl text-pretty text-sm text-white/80 sm:text-base"
          >
            {eventStarted
              ? "The Run Against Drugs 2025 marathon has officially kicked off. Head to the venue and be part of the movement!"
              : "Don&apos;t miss your chance to be part of the largest youth marathon for a drug-free Bangladesh."}
          </motion.p>

          {eventStarted ? (
            <motion.div
              variants={itemVariants}
              className="mt-10 flex items-center gap-3 rounded-2xl border border-[#ffa500]/40 bg-[#ffa500]/15 px-6 py-4 text-white"
            >
              <Flag className="size-6 text-[#ffa500]" />
              <span className="text-lg font-semibold">
                The marathon is live — join us at {EVENT_CONFIG.location}!
              </span>
            </motion.div>
          ) : (
            <motion.div
              variants={itemVariants}
              className="mt-10 grid w-full grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4"
            >
              {units.map((u) => (
                <div
                  key={u.label}
                  className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/10 px-3 py-6 backdrop-blur-md sm:px-5"
                >
                  <div
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#ffa500] via-[#dc143c] to-[#1e90ff]"
                  />
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={u.value}
                      initial={{ y: -12, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 12, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-center font-mono text-4xl font-bold tabular-nums text-white sm:text-5xl md:text-6xl"
                      aria-live="polite"
                    >
                      {mounted ? pad(u.value) : "00"}
                    </motion.div>
                  </AnimatePresence>
                  <div className="mt-2 text-center text-xs font-medium uppercase tracking-widest text-white/70 sm:text-sm">
                    {u.label}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {!eventStarted && (
            <motion.div variants={itemVariants} className="mt-10">
              <Button
                size="lg"
                onClick={() => navigate("register")}
                className="bg-gradient-red rounded-full px-8 py-3 text-base font-semibold text-white shadow-red transition-transform hover:scale-105 hover:text-white"
              >
                Register Before It&apos;s Too Late
                <ArrowRight className="size-5" />
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

export default Countdown;
