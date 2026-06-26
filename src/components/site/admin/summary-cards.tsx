"use client";

import { motion } from "framer-motion";
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Shirt,
  GraduationCap,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Summary, TShirtSize, AcademicLevel } from "@/types";

interface SummaryCardsProps {
  summary: Summary | null;
  loading?: boolean;
}

const ALL_SIZES: TShirtSize[] = ["S", "M", "L", "XL", "XXL", "3XL"];
const ALL_LEVELS: { value: AcademicLevel; label: string }[] = [
  { value: "school", label: "School" },
  { value: "college", label: "College" },
  { value: "university", label: "University" },
];

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  tint: string;
  delay: number;
  loading?: boolean;
}

function StatCard({
  label,
  value,
  icon,
  iconBg,
  iconColor,
  tint,
  delay,
  loading,
}: StatCardProps) {
  if (loading) {
    return (
      <Card className={cn("gap-0 overflow-hidden py-0", tint)}>
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-7 w-12" />
            </div>
            <Skeleton className="h-12 w-12 rounded-full" />
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
      <Card className={cn("gap-0 overflow-hidden py-0 transition-shadow hover:shadow-md", tint)}>
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-muted-foreground truncate text-xs font-medium uppercase tracking-wide">
                {label}
              </p>
              <p className="text-foreground mt-1 text-2xl font-bold sm:text-3xl">{value}</p>
            </div>
            <div
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-full shadow-sm sm:size-12",
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
}

function BreakdownRow({
  label,
  total,
  accepted,
  maxTotal,
  accentClass,
}: BreakdownRowProps) {
  const pct = maxTotal > 0 ? Math.min(100, Math.round((total / maxTotal) * 100)) : 0;
  const acceptedPct = total > 0 ? Math.min(100, Math.round((accepted / total) * 100)) : 0;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="text-foreground font-medium">{label}</span>
        <span className="text-muted-foreground font-mono text-xs">
          <span className="text-brand-green font-semibold">{accepted}</span>
          <span className="mx-0.5">/</span>
          <span className="text-foreground">{total}</span>
        </span>
      </div>
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("absolute inset-y-0 left-0 rounded-full opacity-30", accentClass)}
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

export function SummaryCards({ summary, loading = false }: SummaryCardsProps) {
  const tshirtMax = summary
    ? Math.max(1, ...ALL_SIZES.map((s) => summary.byTShirtSize[s] || 0))
    : 1;
  const levelMax = summary
    ? Math.max(1, ...ALL_LEVELS.map((l) => summary.byAcademicLevel[l.value] || 0))
    : 1;

  return (
    <div className="flex flex-col gap-6">
      {/* Top stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          label="Total"
          value={summary?.total ?? 0}
          icon={<Users className="h-5 w-5 sm:h-6 sm:w-6" />}
          iconBg="bg-navy/10"
          iconColor="text-navy"
          tint="bg-navy/[0.03]"
          delay={0}
          loading={loading}
        />
        <StatCard
          label="Pending"
          value={summary?.pending ?? 0}
          icon={<Clock className="h-5 w-5 sm:h-6 sm:w-6" />}
          iconBg="bg-amber-500/10"
          iconColor="text-amber-600"
          tint="bg-amber-500/[0.04]"
          delay={0.06}
          loading={loading}
        />
        <StatCard
          label="Accepted"
          value={summary?.accepted ?? 0}
          icon={<CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6" />}
          iconBg="bg-brand-green/10"
          iconColor="text-brand-green"
          tint="bg-brand-green/[0.04]"
          delay={0.12}
          loading={loading}
        />
        <StatCard
          label="Rejected"
          value={summary?.rejected ?? 0}
          icon={<XCircle className="h-5 w-5 sm:h-6 sm:w-6" />}
          iconBg="bg-brand-red/10"
          iconColor="text-brand-red"
          tint="bg-brand-red/[0.04]"
          delay={0.18}
          loading={loading}
        />
      </div>

      {/* Breakdown sections */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.24 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="bg-sky/10 text-sky flex size-8 items-center justify-center rounded-lg">
                  <Shirt className="h-4 w-4" />
                </span>
                By T-Shirt Size
                <span className="text-muted-foreground ml-auto text-xs font-normal">
                  Accepted / Total
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3.5">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-1.5">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-2.5 w-full rounded-full" />
                  </div>
                ))
              ) : (
                ALL_SIZES.map((size) => (
                  <BreakdownRow
                    key={size}
                    label={size}
                    total={summary?.byTShirtSize[size] || 0}
                    accepted={summary?.acceptedByTShirtSize[size] || 0}
                    maxTotal={tshirtMax}
                    accentClass="bg-navy"
                  />
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="bg-brand-orange/10 text-brand-orange flex size-8 items-center justify-center rounded-lg">
                  <GraduationCap className="h-4 w-4" />
                </span>
                By Academic Level
                <span className="text-muted-foreground ml-auto text-xs font-normal">
                  Accepted / Total
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3.5">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-1.5">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-2.5 w-full rounded-full" />
                  </div>
                ))
              ) : (
                ALL_LEVELS.map(({ value, label }) => (
                  <BreakdownRow
                    key={value}
                    label={label}
                    total={summary?.byAcademicLevel[value] || 0}
                    accepted={summary?.acceptedByAcademicLevel[value] || 0}
                    maxTotal={levelMax}
                    accentClass="bg-brand-red"
                  />
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default SummaryCards;
