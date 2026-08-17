"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  Trash2,
  ChevronDown,
  Inbox,
  Loader2,
  Phone,
  MessageSquare,
  MapPin,
  Hash,
  Shirt,
  User as UserIcon,
  Award,
  BookOpen,
  HelpCircle,
  Calendar,
  Building2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import type { AcademicFestRegistration, RegistrationStatus } from "@/types";

interface RegistrationTableProps {
  registrations: AcademicFestRegistration[];
  loading?: boolean;
  onAction: (id: string, action: "accept" | "reject" | "delete") => void;
  actionLoading?: string | null;
}

const STATUS_CONFIG: Record<
  RegistrationStatus,
  { label: string; badge: string; dot: string }
> = {
  pending: {
    label: "Pending",
    badge: "border-amber-200 bg-amber-50 text-amber-800",
    dot: "bg-amber-500",
  },
  accepted: {
    label: "Accepted",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-800",
    dot: "bg-emerald-600",
  },
  rejected: {
    label: "Rejected",
    badge: "border-rose-200 bg-rose-50 text-rose-800",
    dot: "bg-rose-600",
  },
};

interface ConfirmState {
  type: "accept" | "reject" | "delete";
  reg: AcademicFestRegistration;
}

import { ACADEMIC_FEST_GROUPS, TSHIRT_SIZES } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, RotateCcw } from "lucide-react";

export function RegistrationTable({
  registrations,
  loading = false,
  onAction,
  actionLoading = null,
}: RegistrationTableProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);

  // Group Filters
  const [groupFilter, setGroupFilter] = useState<string>("all");
  const [tShirtFilter, setTShirtFilter] = useState<string>("all");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleConfirm() {
    if (!confirm) return;
    onAction(confirm.reg.id, confirm.type);
    setConfirm(null);
  }

  // Filtered registrations based on Group, T-Shirt, Gender, and Search Query
  const filteredRegistrations = registrations.filter((r) => {
    // Group filter
    if (groupFilter !== "all" && r.group !== groupFilter) return false;
    // T-Shirt filter
    if (tShirtFilter !== "all" && r.tShirtSize !== tShirtFilter) return false;
    // Gender filter
    if (genderFilter !== "all" && (r.gender || "").toLowerCase() !== genderFilter) return false;
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const matchName = (r.name || "").toLowerCase().includes(q);
      const matchRoll = (r.rollNumber || "").toLowerCase().includes(q);
      const matchReg = (r.regNumber || "").toLowerCase().includes(q);
      const matchPhone = (r.phoneNumber || "").toLowerCase().includes(q);
      const matchInst = (r.institutionName || "").toLowerCase().includes(q);
      const matchIdNo = (r.idNo || "").toLowerCase().includes(q);
      if (!matchName && !matchRoll && !matchReg && !matchPhone && !matchInst && !matchIdNo) {
        return false;
      }
    }
    return true;
  });

  const hasActiveFilters = groupFilter !== "all" || tShirtFilter !== "all" || genderFilter !== "all" || searchQuery.trim() !== "";

  function handleResetFilters() {
    setGroupFilter("all");
    setTShirtFilter("all");
    setGenderFilter("all");
    setSearchQuery("");
  }

  const confirmTitle =
    confirm?.type === "accept"
      ? "Accept Registration"
      : confirm?.type === "reject"
        ? "Reject Registration"
        : "Delete Registration";

  const isFemale = (confirm?.reg?.gender || "").toLowerCase() === "female";
  const quotaRangeText = isFemale ? "AF001–AF200 (Female Range)" : "AF201–AF400 (Male Range)";

  const confirmDescription =
    confirm?.type === "accept"
      ? `Accept registration for "${confirm?.reg?.name || ""}"? A serial number from ${quotaRangeText} will be assigned and confirmation SMS sent to ${confirm?.reg?.phoneNumber || ""}.`
      : confirm?.type === "reject"
        ? `Reject registration for "${confirm?.reg?.name || ""}"?`
        : `Permanently delete registration for "${confirm?.reg?.name || ""}"? This cannot be undone.`;

  const confirmActionLabel =
    confirm?.type === "accept"
      ? "Accept & Send SMS"
      : confirm?.type === "reject"
        ? "Reject"
        : "Delete";

  const confirmActionClass =
    confirm?.type === "accept"
      ? "bg-emerald-600 text-white hover:bg-emerald-700 font-bold"
      : confirm?.type === "reject"
        ? "bg-amber-600 text-white hover:bg-amber-700 font-bold"
        : "bg-rose-600 text-white hover:bg-rose-700 font-bold";

  const headers = [
    "",
    "ID No",
    "Full Name",
    "Gender",
    "Institution",
    "Group",
    "T-Shirt",
    "Roll No",
    "Reg No",
    "Board",
    "Status",
    "Actions",
  ];

  return (
    <>
      <div className="space-y-4">
        {/* Quick Filter Bar by Academic Group, T-Shirt Size, and Gender */}
        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                placeholder="Search by Name, Roll, Reg No, Phone, Institution..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 bg-slate-50 border-slate-200 text-slate-900 text-xs rounded-xl focus:border-emerald-500"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Group Filter */}
              <div className="w-[140px]">
                <Select value={groupFilter} onValueChange={setGroupFilter}>
                  <SelectTrigger className="h-10 text-xs bg-slate-50 border-slate-200 rounded-xl font-semibold text-slate-700">
                    <SelectValue placeholder="Group" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200 text-slate-800">
                    <SelectItem value="all">All Groups</SelectItem>
                    {ACADEMIC_FEST_GROUPS.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g} Group
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* T-Shirt Filter */}
              <div className="w-[130px]">
                <Select value={tShirtFilter} onValueChange={setTShirtFilter}>
                  <SelectTrigger className="h-10 text-xs bg-slate-50 border-slate-200 rounded-xl font-semibold text-slate-700">
                    <SelectValue placeholder="T-Shirt" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200 text-slate-800">
                    <SelectItem value="all">All Sizes</SelectItem>
                    {TSHIRT_SIZES.map((sz) => (
                      <SelectItem key={sz} value={sz}>
                        {sz} Size
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Gender Filter */}
              <div className="w-[125px]">
                <Select value={genderFilter} onValueChange={setGenderFilter}>
                  <SelectTrigger className="h-10 text-xs bg-slate-50 border-slate-200 rounded-xl font-semibold text-slate-700">
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200 text-slate-800">
                    <SelectItem value="all">All Genders</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reset Filters */}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetFilters}
                  className="h-10 px-3 text-xs text-slate-500 hover:text-slate-900 rounded-xl"
                  title="Reset all filters"
                >
                  <RotateCcw className="size-3.5 mr-1" /> Reset
                </Button>
              )}
            </div>
          </div>

          {/* Results count info */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
            <span>
              Showing <strong className="text-slate-800">{filteredRegistrations.length}</strong> of{" "}
              <strong className="text-slate-800">{registrations.length}</strong> applicants
            </span>
            {hasActiveFilters && (
              <span className="text-emerald-700 font-semibold">
                Filters active
              </span>
            )}
          </div>
        </div>

        {/* Desktop / tablet: full table */}
        <div className="hidden max-h-[700px] overflow-auto rounded-2xl border border-slate-200 bg-white shadow-sm scrollbar-thin md:block">
          <Table className="min-w-[1020px]">
            <TableHeader className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-sm border-b border-slate-200">
              <TableRow className="hover:bg-transparent">
                {headers.map((h, i) => (
                  <TableHead
                    key={i}
                    className={cn(
                      "text-slate-600 font-bold text-xs uppercase tracking-wider py-3.5",
                      i === 0 && "w-[48px] text-center",
                      i === 1 && "w-[95px]",
                      i === headers.length - 2 && "text-center",
                      i === headers.length - 1 && "text-right pr-6"
                    )}
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={`skel-${i}`}>
                    <TableCell colSpan={headers.length} className="py-3.5">
                      <Skeleton className="h-8 w-full rounded-lg" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredRegistrations.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={headers.length} className="h-48">
                    <EmptyState />
                  </TableCell>
                </TableRow>
              ) : (
                filteredRegistrations.map((reg, idx) => (
                  <DesktopRow
                    key={reg.id || idx}
                    reg={reg}
                    expanded={expanded.has(reg.id)}
                    onToggle={() => toggleExpand(reg.id)}
                    onAction={(type) => setConfirm({ type, reg })}
                    actionLoading={actionLoading === reg.id}
                    colSpan={headers.length}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile: stacked cards */}
        <div className="flex flex-col gap-3 md:hidden">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={`ms-${i}`} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                <Skeleton className="mb-3 h-5 w-2/3" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))
          ) : filteredRegistrations.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <EmptyState />
            </div>
          ) : (
            filteredRegistrations.map((reg) => (
              <MobileCard
                key={reg.id}
                reg={reg}
                onAction={(type) => setConfirm({ type, reg })}
                actionLoading={actionLoading === reg.id}
              />
            ))
          )}
        </div>
      </div>

      {/* Confirmation dialog */}
      <AlertDialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent className="bg-white border border-slate-200 text-slate-900 shadow-xl rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-extrabold text-slate-900">
              {confirmTitle}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-slate-600">
              {confirmDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {confirm?.type === "accept" && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 text-xs text-slate-700">
              <div className="text-emerald-800 mb-1 text-[11px] font-bold uppercase tracking-wider">
                SMS Notification Preview
              </div>
              <p className="font-mono text-xs leading-relaxed text-slate-900">
                To: <span className="font-bold text-emerald-800">{confirm?.reg?.phoneNumber}</span>
                <br />
                Assalamu Alaikum {confirm?.reg?.name}! Your registration for HSC&apos;27 Academic Fest is CONFIRMED. ID No: [Generated Serial]. Venue: Chattogram Press Club, Date: 5th Sept 2026. ShibirCCN
              </p>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className={cn("rounded-xl shadow-sm", confirmActionClass)}
            >
              {confirmActionLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <div className="bg-slate-100 flex size-14 items-center justify-center rounded-2xl text-slate-400">
        <Inbox className="h-7 w-7" />
      </div>
      <div>
        <p className="text-slate-800 text-sm font-bold">No registrations found</p>
        <p className="text-slate-500 text-xs mt-0.5">
          Try selecting a different status filter or check back later.
        </p>
      </div>
    </div>
  );
}

// --- Desktop Row ---

interface DesktopRowProps {
  reg: AcademicFestRegistration;
  expanded: boolean;
  onToggle: () => void;
  onAction: (type: "accept" | "reject" | "delete") => void;
  actionLoading: boolean;
  colSpan: number;
}

function DesktopRow({
  reg,
  expanded,
  onToggle,
  onAction,
  actionLoading,
  colSpan,
}: DesktopRowProps) {
  const statusMeta = STATUS_CONFIG[reg.status as RegistrationStatus] || STATUS_CONFIG.pending;
  const isFemale = (reg.gender || "").toLowerCase() === "female";

  return (
    <>
      <TableRow
        className={cn(
          "group cursor-pointer border-b border-slate-100 transition-colors hover:bg-slate-50/80",
          expanded && "bg-slate-50/90"
        )}
        onClick={onToggle}
      >
        <TableCell className="w-[48px] text-center" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
            onClick={onToggle}
            aria-label={expanded ? "Collapse row" : "Expand row"}
          >
            <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="h-4 w-4" />
            </motion.span>
          </Button>
        </TableCell>
        <TableCell>
          {reg.idNo ? (
            <Badge
              variant="outline"
              className="border-emerald-300 bg-emerald-100 text-emerald-900 font-mono font-extrabold text-xs px-2 py-0.5 shadow-sm"
            >
              {reg.idNo}
            </Badge>
          ) : (
            <span className="text-slate-400 font-mono text-xs">&mdash;</span>
          )}
        </TableCell>
        <TableCell className="font-bold text-slate-900">{reg.name}</TableCell>
        <TableCell>
          <span
            className={cn(
              "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold border",
              isFemale
                ? "bg-pink-50 text-pink-700 border-pink-200"
                : "bg-sky-50 text-sky-700 border-sky-200"
            )}
          >
            {isFemale ? "Female" : "Male"}
          </span>
        </TableCell>
        <TableCell className="max-w-[160px] truncate text-slate-700 font-medium" title={reg.institutionName}>
          {reg.institutionName}
        </TableCell>
        <TableCell className="text-xs text-slate-700 font-semibold">{reg.group}</TableCell>
        <TableCell>
          <span className="inline-flex items-center rounded px-1.5 py-0.5 text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            {reg.tShirtSize}
          </span>
        </TableCell>
        <TableCell className="font-mono text-xs text-slate-700 font-medium">{reg.rollNumber}</TableCell>
        <TableCell className="font-mono text-xs text-slate-500">{reg.regNumber}</TableCell>
        <TableCell className="text-xs text-slate-600">{reg.board}</TableCell>
        <TableCell className="text-center">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
              statusMeta.badge
            )}
          >
            <span className={cn("size-1.5 rounded-full", statusMeta.dot)} />
            <span className="capitalize">{statusMeta.label}</span>
          </span>
        </TableCell>
        <TableCell className="text-right pr-6" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-end gap-1.5">
            {actionLoading ? (
              <Loader2 className="text-slate-400 h-4 w-4 animate-spin" />
            ) : (
              <RowActions reg={reg} onAction={onAction} />
            )}
          </div>
        </TableCell>
      </TableRow>
      <TableRow className={cn("hover:bg-transparent", expanded && "bg-slate-50/50")}>
        <TableCell colSpan={colSpan} className="p-0">
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="border-t border-b border-slate-200/80 bg-slate-50/80 px-6 py-5">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-3 lg:grid-cols-4">
                    <DetailItem icon={<UserIcon className="h-3.5 w-3.5" />} label="Gender" value={reg.gender ? (reg.gender === "female" ? "Female" : "Male") : "—"} />
                    <DetailItem icon={<Award className="h-3.5 w-3.5" />} label="Academic Group" value={`${reg.group} Group`} />
                    <DetailItem icon={<Hash className="h-3.5 w-3.5" />} label="SSC Roll No" value={reg.rollNumber} mono />
                    <DetailItem icon={<Hash className="h-3.5 w-3.5" />} label="SSC Reg No" value={reg.regNumber} mono />
                    <DetailItem icon={<BookOpen className="h-3.5 w-3.5" />} label="Education Board" value={`${reg.board} Board`} />
                    <DetailItem icon={<Shirt className="h-3.5 w-3.5" />} label="T-Shirt Size" value={reg.tShirtSize} />
                    <DetailItem icon={<Phone className="h-3.5 w-3.5" />} label="Phone Number" value={reg.phoneNumber} mono />
                    <DetailItem icon={<MessageSquare className="h-3.5 w-3.5" />} label="WhatsApp Number" value={reg.whatsappNumber} mono />
                    <DetailItem icon={<MapPin className="h-3.5 w-3.5" />} label="Present Address" value={reg.presentAddress} span={2} />
                    <DetailItem icon={<MapPin className="h-3.5 w-3.5" />} label="Permanent Address" value={reg.permanentAddress} span={2} />
                    {reg.guestQuestion && (
                      <div className="col-span-2 sm:col-span-3 lg:col-span-4 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-900">
                        <div className="font-bold flex items-center gap-1.5 text-amber-800 mb-1">
                          <HelpCircle className="size-3.5" /> Question to Panelist / Guest:
                        </div>
                        <p className="text-slate-800 text-sm font-medium leading-relaxed">{reg.guestQuestion}</p>
                      </div>
                    )}
                    <DetailItem icon={<Calendar className="h-3.5 w-3.5" />} label="Registration Time" value={new Date(reg.createdAt).toLocaleString()} span={2} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </TableCell>
      </TableRow>
    </>
  );
}

// --- Row Actions ---

interface RowActionsProps {
  reg: AcademicFestRegistration;
  onAction: (type: "accept" | "reject" | "delete") => void;
}

function RowActions({ reg, onAction }: RowActionsProps) {
  if (reg.status === "pending") {
    return (
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          className="bg-emerald-600 text-white hover:bg-emerald-700 font-bold h-8 text-xs px-2.5 rounded-lg shadow-sm"
          onClick={() => onAction("accept")}
        >
          <Check className="h-3.5 w-3.5 mr-1" />
          Accept
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-rose-200 text-rose-700 hover:bg-rose-50 h-8 text-xs px-2 rounded-lg"
          onClick={() => onAction("reject")}
          title="Reject"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="text-slate-400 hover:bg-rose-50 hover:text-rose-600 size-8 rounded-lg"
          onClick={() => onAction("delete")}
          aria-label="Delete registration"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    );
  }
  if (reg.status === "accepted") {
    return (
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="outline"
          className="border-amber-200 text-amber-700 hover:bg-amber-50 h-8 text-xs px-2.5 rounded-lg font-semibold"
          onClick={() => onAction("reject")}
        >
          <X className="h-3.5 w-3.5 mr-1" />
          Reject
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="text-slate-400 hover:bg-rose-50 hover:text-rose-600 size-8 rounded-lg"
          onClick={() => onAction("delete")}
          aria-label="Delete registration"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    );
  }
  // rejected
  return (
    <div className="flex items-center gap-1">
      <Button
        size="sm"
        className="bg-emerald-600 text-white hover:bg-emerald-700 font-bold h-8 text-xs px-2.5 rounded-lg shadow-sm"
        onClick={() => onAction("accept")}
      >
        <Check className="h-3.5 w-3.5 mr-1" />
        Accept
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="text-slate-400 hover:bg-rose-50 hover:text-rose-600 size-8 rounded-lg"
        onClick={() => onAction("delete")}
        aria-label="Delete registration"
        title="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

// --- Mobile Card ---

interface MobileCardProps {
  reg: AcademicFestRegistration;
  onAction: (type: "accept" | "reject" | "delete") => void;
  actionLoading: boolean;
}

function MobileCard({ reg, onAction, actionLoading }: MobileCardProps) {
  const statusMeta = STATUS_CONFIG[reg.status as RegistrationStatus] || STATUS_CONFIG.pending;
  const isFemale = (reg.gender || "").toLowerCase() === "female";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-start justify-between gap-2 border-b border-slate-100 p-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-slate-900 font-bold text-base truncate">{reg.name}</p>
            <span
              className={cn(
                "inline-flex items-center rounded px-1.5 py-0.2 text-[10px] font-bold border",
                isFemale
                  ? "bg-pink-50 text-pink-700 border-pink-200"
                  : "bg-sky-50 text-sky-700 border-sky-200"
              )}
            >
              {isFemale ? "Female" : "Male"}
            </span>
          </div>
          <p className="text-slate-500 truncate text-xs mt-0.5 font-medium">{reg.institutionName}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          {reg.idNo ? (
            <Badge variant="outline" className="border-emerald-300 bg-emerald-100 text-emerald-900 font-mono font-extrabold text-xs">
              {reg.idNo}
            </Badge>
          ) : (
            <span className="text-slate-400 text-xs font-mono">&mdash;</span>
          )}
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold",
              statusMeta.badge
            )}
          >
            <span className={cn("size-1.5 rounded-full", statusMeta.dot)} />
            <span className="capitalize">{statusMeta.label}</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-2 p-4 text-xs bg-slate-50/50">
        <MobileField label="Group" value={reg.group} />
        <MobileField label="T-Shirt" value={reg.tShirtSize} />
        <MobileField label="SSC Roll No" value={reg.rollNumber} mono />
        <MobileField label="SSC Reg No" value={reg.regNumber} mono />
        <MobileField label="Board" value={reg.board} />
        <MobileField label="Phone" value={reg.phoneNumber} mono />
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-white p-3">
        {actionLoading ? (
          <div className="flex flex-1 items-center justify-center gap-2 text-slate-500 text-xs">
            <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
            Processing...
          </div>
        ) : (
          <RowActions reg={reg} onAction={onAction} />
        )}
      </div>
    </div>
  );
}

// --- Shared Detail Components ---

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
  span?: number;
}

function DetailItem({ icon, label, value, mono, span = 1 }: DetailItemProps) {
  return (
    <div className={cn(span === 2 && "col-span-2", span === 3 && "col-span-3")}>
      <div className="text-slate-500 mb-0.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider">
        {icon}
        {label}
      </div>
      <div className={cn("text-slate-900 text-sm font-semibold", mono && "font-mono font-medium")}>
        {value || "—"}
      </div>
    </div>
  );
}

function MobileField({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
        {label}
      </span>
      <span className={cn("text-slate-800 text-xs font-semibold", mono && "font-mono")}>
        {value || "—"}
      </span>
    </div>
  );
}

export default RegistrationTable;
