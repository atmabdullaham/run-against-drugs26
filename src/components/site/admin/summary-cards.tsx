"use client";

import { motion } from "framer-motion";
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Award,
  Shirt,
  Sparkles,
  UserCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ACADEMIC_FEST_QUOTAS, ACADEMIC_FEST_GROUPS, TSHIRT_SIZES } from "@/lib/constants";
import type { TShirtSize } from "@/types";

export interface AcademicFestSummaryData {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  totalMale: number;
  acceptedMale: number;
  totalFemale: number;
  acceptedFemale: number;
  byGroup: Record<string, { total: number; accepted: number }>;
  byTShirtSize: Record<string, { total: number; accepted: number }>;
}

interface SummaryCardsProps {
  summary: AcademicFestSummaryData | null;
  loading?: boolean;
}

interface StatCardProps {
  label: string;
  value: number;
  subtext?: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  cardBg: string;
  borderClass: string;
  delay: number;
  loading?: boolean;
}

function StatCard({
  label,
  value,
  subtext,
  icon,
  iconBg,
  iconColor,
  cardBg,
  borderClass,
  delay,
  loading,
}: StatCardProps) {
  if (loading) {
    return (
      <Card className="border border-slate-200 bg-white shadow-sm rounded-2xl">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-7 w-12" />
            </div>
            <Skeleton className="h-12 w-12 rounded-xl" />
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
    >
      <Card className={cn("border bg-white shadow-sm rounded-2xl transition-all hover:shadow-md", borderClass, cardBg)}>
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-slate-500 truncate text-xs font-bold uppercase tracking-wider">
                {label}
              </p>
              <p className="text-slate-900 mt-1 text-2xl font-extrabold sm:text-3xl">{value}</p>
              {subtext && (
                <p className="text-[11px] font-medium text-slate-500 mt-0.5">{subtext}</p>
              )}
            </div>
            <div
              className={cn(
                "flex size-12 shrink-0 items-center justify-center rounded-2xl shadow-sm border",
                iconBg
              )}
            >
              <span className={iconColor}>{icon}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface BreakdownRowProps {
  label: string;
  total: number;
  accepted: number;
  maxTotal: number;
  accentClass: string;
  badge?: string;
}

function BreakdownRow({
  label,
  total,
  accepted,
  maxTotal,
  accentClass,
  badge,
}: BreakdownRowProps) {
  const pct = maxTotal > 0 ? Math.min(100, Math.round((total / maxTotal) * 100)) : 0;
  const acceptedPct = total > 0 ? Math.min(100, Math.round((accepted / total) * 100)) : 0;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-slate-800 font-semibold">{label}</span>
          {badge && (
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 font-bold border border-slate-200">
              {badge}
            </span>
          )}
        </div>
        <span className="text-slate-500 font-mono text-xs">
          <span className="text-emerald-600 font-bold">{accepted} Accepted</span>
          <span className="mx-1 text-slate-300">/</span>
          <span className="text-slate-700 font-medium">{total} Total</span>
        </span>
      </div>
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={cn("absolute inset-y-0 left-0 rounded-full opacity-25", accentClass)}
          style={{ width: `${pct}%` }}
        />
        <div
          className={cn("absolute inset-y-0 left-0 rounded-full", accentClass)}
          style={{ width: `${(pct * acceptedPct) / 100}%` }}
        />
      </div>
    </div>
  );
}

export function SummaryCards({
  summary,
  loading = false,
}: SummaryCardsProps) {
  const totalAccepted = summary?.accepted ?? 0;
  const acceptedQuotaPct = Math.min(
    100,
    Math.round((totalAccepted / ACADEMIC_FEST_QUOTAS.MAX_TOTAL_CAPACITY) * 100)
  );

  const femaleAccepted = summary?.acceptedFemale ?? 0;
  const maleAccepted = summary?.acceptedMale ?? 0;
  const femaleTotal = summary?.totalFemale ?? 0;
  const maleTotal = summary?.totalMale ?? 0;

  // Max for Group scaling
  const groupMax = summary?.byGroup
    ? Math.max(1, ...Object.values(summary.byGroup).map((g) => g.total))
    : 1;

  // Max for T-Shirt scaling
  const tshirtMax = summary?.byTShirtSize
    ? Math.max(1, ...Object.values(summary.byTShirtSize).map((s) => s.total))
    : 1;

  // Max for Gender scaling
  const genderMax = Math.max(1, femaleTotal, maleTotal);

  return (
    <div className="flex flex-col gap-6">
      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Registrations"
          value={summary?.total ?? 0}
          subtext="All applicants"
          icon={<Users className="h-6 w-6" />}
          iconBg="bg-blue-50 border-blue-100"
          iconColor="text-blue-600"
          cardBg="hover:border-blue-200"
          borderClass="border-slate-200"
          delay={0}
          loading={loading}
        />
        <StatCard
          label="Pending Review"
          value={summary?.pending ?? 0}
          subtext="Awaiting verification"
          icon={<Clock className="h-6 w-6" />}
          iconBg="bg-amber-50 border-amber-100"
          iconColor="text-amber-600"
          cardBg="hover:border-amber-200"
          borderClass="border-slate-200"
          delay={0.06}
          loading={loading}
        />
        <StatCard
          label="Accepted"
          value={summary?.accepted ?? 0}
          subtext={`Capacity: ${totalAccepted}/${ACADEMIC_FEST_QUOTAS.MAX_TOTAL_CAPACITY}`}
          icon={<CheckCircle2 className="h-6 w-6" />}
          iconBg="bg-emerald-50 border-emerald-100"
          iconColor="text-emerald-600"
          cardBg="hover:border-emerald-200"
          borderClass="border-slate-200"
          delay={0.12}
          loading={loading}
        />
        <StatCard
          label="Rejected"
          value={summary?.rejected ?? 0}
          subtext="Not approved"
          icon={<XCircle className="h-6 w-6" />}
          iconBg="bg-rose-50 border-rose-100"
          iconColor="text-rose-600"
          cardBg="hover:border-rose-200"
          borderClass="border-slate-200"
          delay={0.18}
          loading={loading}
        />
      </div>

      {/* Quota & Capacity Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50/80 via-teal-50/40 to-white p-5 shadow-sm"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
                <Sparkles className="size-4" />
              </span>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                Capacity Limit &amp; Serial ID Policy
              </h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
              Programme capacity: <strong className="text-slate-900 font-bold">300 students maximum</strong>.
              Serials are automatically allocated on acceptance based on gender:
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <div className="flex items-center gap-2.5 rounded-xl bg-pink-50 border border-pink-200/80 px-3.5 py-2">
              <span className="size-2 rounded-full bg-pink-500" />
              <div>
                <div className="text-[10px] uppercase font-bold text-pink-700">Female (AF001 – AF200)</div>
                <div className="font-mono font-extrabold text-xs text-pink-950">
                  {femaleAccepted} Accepted ({femaleTotal} Total)
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-xl bg-sky-50 border border-sky-200/80 px-3.5 py-2">
              <span className="size-2 rounded-full bg-sky-500" />
              <div>
                <div className="text-[10px] uppercase font-bold text-sky-700">Male (AF201 – AF400)</div>
                <div className="font-mono font-extrabold text-xs text-sky-950">
                  {maleAccepted} Accepted ({maleTotal} Total)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Capacity Progress Bar */}
        <div className="mt-4 pt-3 border-t border-emerald-100/80">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
            <span>Overall Programme Capacity</span>
            <span className="font-mono text-emerald-700 font-bold">
              {totalAccepted} / {ACADEMIC_FEST_QUOTAS.MAX_TOTAL_CAPACITY} Seats Filled ({acceptedQuotaPct}%)
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-slate-200/80 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
              style={{ width: `${acceptedQuotaPct}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* 3 Breakdown Group Cards: Academic Group, T-Shirt Size, and Gender */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* 1. Academic Group Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="h-full border border-slate-200 bg-white shadow-sm rounded-2xl">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-900 font-bold">
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 flex size-7 items-center justify-center rounded-lg">
                  <Award className="h-3.5 w-3.5" />
                </span>
                By Academic Group
                <span className="text-slate-400 ml-auto text-[11px] font-normal">
                  Acc / Total
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3.5 pt-4">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-1.5">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-2.5 w-full rounded-full" />
                  </div>
                ))
              ) : (
                ACADEMIC_FEST_GROUPS.map((group) => {
                  const grpData = summary?.byGroup?.[group] || { total: 0, accepted: 0 };
                  return (
                    <BreakdownRow
                      key={group}
                      label={`${group}`}
                      total={grpData.total}
                      accepted={grpData.accepted}
                      maxTotal={groupMax}
                      accentClass="bg-emerald-600"
                    />
                  );
                })
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* 2. T-Shirt Size Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <Card className="h-full border border-slate-200 bg-white shadow-sm rounded-2xl">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-900 font-bold">
                <span className="bg-amber-50 text-amber-700 border border-amber-200 flex size-7 items-center justify-center rounded-lg">
                  <Shirt className="h-3.5 w-3.5" />
                </span>
                By T-Shirt Size
                <span className="text-slate-400 ml-auto text-[11px] font-normal">
                  Acc / Total
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2.5 pt-4">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-1.5">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-2.5 w-full rounded-full" />
                  </div>
                ))
              ) : (
                TSHIRT_SIZES.map((size) => {
                  const szData = summary?.byTShirtSize?.[size] || { total: 0, accepted: 0 };
                  return (
                    <BreakdownRow
                      key={size}
                      label={`${size} Size`}
                      total={szData.total}
                      accepted={szData.accepted}
                      maxTotal={tshirtMax}
                      accentClass="bg-amber-500"
                    />
                  );
                })
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* 3. Gender Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="h-full border border-slate-200 bg-white shadow-sm rounded-2xl">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-900 font-bold">
                <span className="bg-sky-50 text-sky-700 border border-sky-200 flex size-7 items-center justify-center rounded-lg">
                  <UserCheck className="h-3.5 w-3.5" />
                </span>
                By Gender &amp; Serial Quota
                <span className="text-slate-400 ml-auto text-[11px] font-normal">
                  Acc / Total
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 pt-4">
              {loading ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-1.5">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-2.5 w-full rounded-full" />
                  </div>
                ))
              ) : (
                <>
                  <BreakdownRow
                    label="Female Students"
                    badge="AF001 – AF200"
                    total={femaleTotal}
                    accepted={femaleAccepted}
                    maxTotal={genderMax}
                    accentClass="bg-pink-500"
                  />
                  <BreakdownRow
                    label="Male Students"
                    badge="AF201 – AF400"
                    total={maleTotal}
                    accepted={maleAccepted}
                    maxTotal={genderMax}
                    accentClass="bg-sky-600"
                  />
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default SummaryCards;
