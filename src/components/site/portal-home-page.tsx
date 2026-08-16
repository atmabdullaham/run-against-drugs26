"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  Activity,
  Award,
  BookOpen,
  Search,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { navigate } from "@/lib/nav";
import { EVENT_CONFIG, HSC27_AF_CONFIG } from "@/lib/constants";

export function PortalHomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 pt-24 pb-16 sm:pt-32 sm:pb-24">
        {/* Background Gradients */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-emerald-600/10 blur-3xl sm:w-[800px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/3 right-10 -z-10 h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-3xl"
        />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            {/* Organization Tag */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-300 backdrop-blur-md"
            >
              <Sparkles className="size-3.5 text-amber-400" />
              Bangladesh Islami Chhatrashibir - Chattogram City North
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-4xl text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl"
            >
              Official <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">Event Portal</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 max-w-2xl text-base text-slate-300 sm:text-lg"
            >
              Explore ongoing academic fests, awareness marathons, and youth programs. Register online, track status, and get event updates.
            </motion.p>

            {/* Quick Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-4"
            >
              <Button
                size="lg"
                onClick={() => navigate("event/hsc27-af")}
                className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-6 text-base font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400"
              >
                Featured Event: HSC&apos;27 Fest
                <ArrowRight className="ml-2 size-5" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("my-registration")}
                className="rounded-full border-slate-700 bg-slate-900/80 px-8 py-6 text-base font-semibold text-white hover:bg-slate-800"
              >
                <Search className="mr-2 size-5 text-amber-400" />
                Check My Registration Status
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Events Grid Section */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Organized Events
            </h2>
            <p className="mt-2 text-sm text-slate-400 sm:text-base">
              Select an event below to view complete details, schedules, and registration options.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Event 1: HSC'27 Academic Fest (Active) */}
            <Card className="group relative overflow-hidden border-emerald-500/40 bg-slate-900/90 text-white shadow-2xl transition-all duration-300 hover:border-emerald-400 hover:shadow-emerald-500/10">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-yellow-400 via-emerald-400 to-teal-400" />
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 px-3 py-1 font-semibold">
                    🟢 ACTIVE REGISTRATION
                  </Badge>
                  <span className="text-xs text-amber-400 font-mono font-semibold">Reg Deadline: 20th Aug</span>
                </div>

                <h3 className="text-2xl font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                  {HSC27_AF_CONFIG.name}
                </h3>
                <p className="mt-1 text-xs text-emerald-400 font-medium">
                  {HSC27_AF_CONFIG.tagline}
                </p>

                <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                  Honoring academic brilliant achievers of HSC 2027 batch in Chattogram. Special gift hampers (T-shirt, Notebook, Snacks) included for participants.
                </p>

                <div className="mt-6 space-y-2 border-t border-slate-800 pt-4 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-amber-400" />
                    <span>Event Date: <strong className="text-white">5th September 2026</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-emerald-400" />
                    <span>Venue: <strong className="text-white">{HSC27_AF_CONFIG.location}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="size-4 text-teal-400" />
                    <span>Eligibility: <strong className="text-white">Science GPA 5.00 | Arts & Commerce GPA 4.50</strong></span>
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-3">
                  <Button
                    onClick={() => navigate("event/hsc27-af")}
                    className="w-full rounded-xl bg-emerald-500 font-bold text-slate-950 hover:bg-emerald-400 shadow-md"
                  >
                    View Details & Register
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Event 2: Run Against Drugs 2026 (Ended) */}
            <Card className="group relative overflow-hidden border-slate-800 bg-slate-900/60 text-white shadow-xl transition-all duration-300 hover:border-slate-700">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-500 to-navy" />
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline" className="border-red-500/40 text-red-400 bg-red-950/20 px-3 py-1 font-semibold">
                    🔴 EVENT COMPLETED
                  </Badge>
                  <span className="text-xs text-slate-500 font-mono">3 KM Run</span>
                </div>

                <h3 className="text-2xl font-extrabold text-white group-hover:text-slate-200 transition-colors">
                  {EVENT_CONFIG.name}
                </h3>
                <p className="mt-1 text-xs text-slate-400 font-medium">
                  {EVENT_CONFIG.subtitle}
                </p>

                <p className="mt-4 text-sm text-slate-400 leading-relaxed">
                  A massive youth awareness marathon for a drug-free Bangladesh. Successfully held in Chawkbazar, Chittagong.
                </p>

                <div className="mt-6 space-y-2 border-t border-slate-800/80 pt-4 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-slate-500" />
                    <span>Event Date: 30th June 2026</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-slate-500" />
                    <span>Venue: {EVENT_CONFIG.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-500" />
                    <span>Status: Registration Closed (Event Ended)</span>
                  </div>
                </div>

                <div className="mt-8">
                  <Button
                    variant="outline"
                    onClick={() => navigate("event/run26-agains-drugs")}
                    className="w-full rounded-xl border-slate-700 bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    View Event Archive
                    <ExternalLink className="ml-2 size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Organization Mission Highlight */}
      <section className="border-t border-slate-800/60 bg-slate-900/40 py-16">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h3 className="text-2xl font-bold text-white sm:text-3xl">
            About Our Organization
          </h3>
          <p className="mt-3 max-w-2xl mx-auto text-sm text-slate-300 sm:text-base leading-relaxed">
            <strong className="text-emerald-400">Bangladesh Islami Chhatrashibir - Chattogram City North</strong> organizes youth DEVELOPMENT programs, academic receptions, and social awareness campaigns to empower the next generation of students.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
              <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                <BookOpen className="size-6" />
              </div>
              <h4 className="font-bold text-white">Academic Excellence</h4>
              <p className="mt-1 text-xs text-slate-400">Honoring meritorious students & supporting educational growth.</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
              <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                <ShieldAlert className="size-6" />
              </div>
              <h4 className="font-bold text-white">Social Awareness</h4>
              <p className="mt-1 text-xs text-slate-400">Campaigns against drug abuse, corruption, and social degradation.</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
              <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400">
                <Activity className="size-6" />
              </div>
              <h4 className="font-bold text-white">Youth Engagement</h4>
              <p className="mt-1 text-xs text-slate-400">Sports, cultural events, and leadership development workshops.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
