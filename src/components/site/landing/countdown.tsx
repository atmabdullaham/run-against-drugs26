"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Flag, Search, CheckCircle2, Archive } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EVENT_CONFIG } from "@/lib/constants";
import { navigate } from "@/lib/nav";

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

export function Countdown() {
  return (
    <section
      id="countdown"
      aria-label="Event status and archive notice"
      className="relative isolate w-full overflow-hidden bg-gradient-navy py-16 sm:py-20 text-white"
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

      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col items-center text-center"
        >
          <motion.div
            variants={itemVariants}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-950/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-300 backdrop-blur-md"
          >
            <Archive className="size-3.5 text-red-400" />
            Registration Closed • Event Archived
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl"
          >
            Event Concluded &amp; Registration Closed
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mt-4 max-w-2xl text-pretty text-sm text-white/80 sm:text-base leading-relaxed"
          >
            Registration for <strong className="text-white">{EVENT_CONFIG.name}</strong> has ended. The event took place in Chawkbazar, Chittagong. Thank you to hundreds of runners and youth changemakers who joined us in spreading the message of a drug-free Bangladesh!
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-col sm:flex-row items-center gap-4"
          >
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 px-6 py-4 text-white text-left backdrop-blur-md">
              <CheckCircle2 className="size-6 text-emerald-400 shrink-0" />
              <div>
                <div className="text-sm font-bold text-white">Need to check your past record?</div>
                <div className="text-xs text-slate-300">Registered runners can verify their registration ID and status.</div>
              </div>
            </div>

            <Button
              size="lg"
              onClick={() => navigate("my-registration")}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold hover:from-emerald-400 hover:to-teal-400 rounded-full px-8 py-6 shadow-lg shadow-emerald-500/20 shrink-0"
            >
              <Search className="mr-2 size-5" />
              Check Registration Status
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default Countdown;
