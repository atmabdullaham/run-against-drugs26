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
  CreditCard,
  Shirt,
  GraduationCap,
  User as UserIcon,
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
import type { Registration, RegistrationStatus, AcademicLevel } from "@/types";

interface RegistrationTableProps {
  registrations: Registration[];
  loading?: boolean;
  onAction: (id: string, action: "accept" | "reject" | "delete") => void;
  actionLoading?: string | null;
}

const LEVEL_LABELS: Record<AcademicLevel, string> = {
  school: "School",
  college: "College",
  university: "University",
};

const STATUS_BADGE: Record<RegistrationStatus, string> = {
  pending: "border-amber-200 bg-amber-100 text-amber-700",
  accepted: "border-green-200 bg-green-100 text-brand-green",
  rejected: "border-red-200 bg-red-100 text-brand-red",
};

const STATUS_DOT: Record<RegistrationStatus, string> = {
  pending: "bg-amber-500",
  accepted: "bg-brand-green",
  rejected: "bg-brand-red",
};

interface ConfirmState {
  type: "accept" | "reject" | "delete";
  reg: Registration;
}

export function RegistrationTable({
  registrations,
  loading = false,
  onAction,
  actionLoading = null,
}: RegistrationTableProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);

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

  const confirmTitle =
    confirm?.type === "accept"
      ? "Accept Registration"
      : confirm?.type === "reject"
        ? "Reject Registration"
        : "Delete Registration";

  const confirmDescription =
    confirm?.type === "accept"
      ? `Accept this registration? An SMS with ID number will be sent to ${confirm.reg.phoneNumber}.`
      : confirm?.type === "reject"
        ? `Reject this registration for ${confirm.reg.name}? They will not be able to participate unless re-accepted.`
        : "Are you sure you want to delete this registration? This cannot be undone.";

  const confirmActionLabel =
    confirm?.type === "accept"
      ? "Accept & Send SMS"
      : confirm?.type === "reject"
        ? "Reject"
        : "Delete";

  const confirmActionClass =
    confirm?.type === "accept"
      ? "bg-brand-green text-white hover:bg-brand-green/90"
      : confirm?.type === "reject"
        ? "bg-amber-600 text-white hover:bg-amber-700"
        : "bg-destructive text-destructive-foreground hover:bg-destructive/90";

  return (
    <>
      <div className="relative">
        {/* Desktop / tablet: full table */}
        <div className="hidden max-h-[600px] overflow-auto rounded-lg border scrollbar-thin md:block">
          <Table className="min-w-[1100px]">
            <TableHeader className="sticky top-0 z-10 bg-card shadow-sm">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[60px]"></TableHead>
                <TableHead className="w-[90px]">ID No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Institution</TableHead>
                <TableHead>Class / Year</TableHead>
                <TableHead className="text-center">T-Shirt</TableHead>
                <TableHead>bKash Number</TableHead>
                <TableHead>TrxID</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={`skel-${i}`}>
                    <TableCell colSpan={11} className="py-3">
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : registrations.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={11} className="h-40">
                    <EmptyState />
                  </TableCell>
                </TableRow>
              ) : (
                registrations.map((reg) => (
                  <DesktopRow
                    key={reg.id}
                    reg={reg}
                    expanded={expanded.has(reg.id)}
                    onToggle={() => toggleExpand(reg.id)}
                    onAction={(type) => setConfirm({ type, reg })}
                    actionLoading={actionLoading === reg.id}
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
              <div key={`ms-${i}`} className="bg-card rounded-lg border p-4">
                <Skeleton className="mb-3 h-5 w-2/3" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))
          ) : registrations.length === 0 ? (
            <EmptyState />
          ) : (
            registrations.map((reg) => (
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>{confirmDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          {confirm?.type === "accept" && (
            <div className="rounded-md border bg-muted/50 p-3 text-sm">
              <div className="text-muted-foreground mb-1 text-xs font-medium uppercase">
                SMS preview
              </div>
              <p className="text-foreground font-mono text-xs leading-relaxed">
                To: <span className="font-semibold">{confirm.reg.phoneNumber}</span>
                <br />
                A confirmation SMS with the runner ID number will be delivered.
              </p>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className={confirmActionClass}
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
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
      <div className="bg-muted flex size-14 items-center justify-center rounded-full">
        <Inbox className="text-muted-foreground h-7 w-7" />
      </div>
      <div>
        <p className="text-foreground text-sm font-medium">No registrations found</p>
        <p className="text-muted-foreground text-xs">
          Try a different filter or check back later.
        </p>
      </div>
    </div>
  );
}

interface DesktopRowProps {
  reg: Registration;
  expanded: boolean;
  onToggle: () => void;
  onAction: (type: "accept" | "reject" | "delete") => void;
  actionLoading: boolean;
}

function DesktopRow({
  reg,
  expanded,
  onToggle,
  onAction,
  actionLoading,
}: DesktopRowProps) {
  return (
    <>
      <TableRow className={cn("group", expanded && "bg-muted/30")}>
        <TableCell className="w-[60px]">
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
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
              className="border-navy/30 bg-navy/10 text-navy font-mono font-semibold"
            >
              {reg.idNo}
            </Badge>
          ) : (
            <span className="text-muted-foreground">&mdash;</span>
          )}
        </TableCell>
        <TableCell className="font-medium">{reg.name}</TableCell>
        <TableCell className="max-w-[180px] truncate" title={reg.institutionName}>
          {reg.institutionName}
        </TableCell>
        <TableCell>
          <span className="text-muted-foreground">
            {LEVEL_LABELS[reg.academicLevel]}
          </span>
          <span className="text-foreground ml-1.5 text-xs">{reg.academicValue}</span>
        </TableCell>
        <TableCell className="text-center">
          <Badge variant="secondary" className="font-mono">
            {reg.tShirtSize}
          </Badge>
        </TableCell>
        <TableCell className="font-mono text-xs">{reg.bkashNumber}</TableCell>
        <TableCell className="font-mono text-xs">{reg.transactionId}</TableCell>
        <TableCell className="font-mono text-xs">{reg.phoneNumber}</TableCell>
        <TableCell className="text-center">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
              STATUS_BADGE[reg.status]
            )}
          >
            <span className={cn("size-1.5 rounded-full", STATUS_DOT[reg.status])} />
            <span className="capitalize">{reg.status}</span>
          </span>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex items-center justify-end gap-1">
            {actionLoading ? (
              <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
            ) : (
              <RowActions reg={reg} onAction={onAction} />
            )}
          </div>
        </TableCell>
      </TableRow>
      <TableRow className={cn("hover:bg-transparent", expanded && "bg-muted/20")}>
        <TableCell colSpan={11} className="p-0">
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 bg-muted/20 px-6 py-4 text-sm md:grid-cols-3">
                  <DetailItem icon={<MessageSquare className="h-3.5 w-3.5" />} label="WhatsApp" value={reg.whatsappNumber} mono />
                  <DetailItem icon={<Phone className="h-3.5 w-3.5" />} label="Phone" value={reg.phoneNumber} mono />
                  <DetailItem icon={<CreditCard className="h-3.5 w-3.5" />} label="bKash Number" value={reg.bkashNumber} mono />
                  <DetailItem icon={<Hash className="h-3.5 w-3.5" />} label="Transaction ID" value={reg.transactionId} mono />
                  <DetailItem icon={<Shirt className="h-3.5 w-3.5" />} label="T-Shirt Size" value={reg.tShirtSize} />
                  <DetailItem icon={<GraduationCap className="h-3.5 w-3.5" />} label="Academic Level" value={`${LEVEL_LABELS[reg.academicLevel]} - ${reg.academicValue}`} />
                  <DetailItem icon={<MapPin className="h-3.5 w-3.5" />} label="Present Address" value={reg.presentAddress} span={2} />
                  <DetailItem icon={<MapPin className="h-3.5 w-3.5" />} label="Permanent Address" value={reg.permanentAddress} span={2} />
                  <DetailItem icon={<UserIcon className="h-3.5 w-3.5" />} label="Registered" value={new Date(reg.createdAt).toLocaleString()} span={2} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </TableCell>
      </TableRow>
    </>
  );
}

interface RowActionsProps {
  reg: Registration;
  onAction: (type: "accept" | "reject" | "delete") => void;
}

function RowActions({ reg, onAction }: RowActionsProps) {
  if (reg.status === "pending") {
    return (
      <>
        <Button
          size="sm"
          variant="default"
          className="bg-brand-green text-white hover:bg-brand-green/90"
          onClick={() => onAction("accept")}
        >
          <Check className="h-3.5 w-3.5" />
          Accept
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-brand-red/40 text-brand-red hover:bg-brand-red/10 hover:text-brand-red"
          onClick={() => onAction("reject")}
        >
          <X className="h-3.5 w-3.5" />
          Reject
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          onClick={() => onAction("delete")}
          aria-label="Delete registration"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </>
    );
  }
  if (reg.status === "accepted") {
    return (
      <>
        <Button
          size="sm"
          variant="outline"
          className="border-amber-500/40 text-amber-600 hover:bg-amber-500/10 hover:text-amber-700"
          onClick={() => onAction("reject")}
        >
          <X className="h-3.5 w-3.5" />
          Reject
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          onClick={() => onAction("delete")}
          aria-label="Delete registration"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </>
    );
  }
  // rejected
  return (
    <>
      <Button
        size="sm"
        variant="default"
        className="bg-brand-green text-white hover:bg-brand-green/90"
        onClick={() => onAction("accept")}
      >
        <Check className="h-3.5 w-3.5" />
        Accept
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        onClick={() => onAction("delete")}
        aria-label="Delete registration"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </>
  );
}

interface MobileCardProps {
  reg: Registration;
  onAction: (type: "accept" | "reject" | "delete") => void;
  actionLoading: boolean;
}

function MobileCard({ reg, onAction, actionLoading }: MobileCardProps) {
  return (
    <div className="bg-card rounded-lg border shadow-sm">
      <div className="flex items-start justify-between gap-2 border-b p-3">
        <div className="min-w-0 flex-1">
          <p className="text-foreground truncate font-semibold">{reg.name}</p>
          <p className="text-muted-foreground truncate text-xs">{reg.institutionName}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          {reg.idNo ? (
            <Badge variant="outline" className="border-navy/30 bg-navy/10 text-navy font-mono font-semibold">
              {reg.idNo}
            </Badge>
          ) : (
            <span className="text-muted-foreground text-xs">&mdash;</span>
          )}
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium",
              STATUS_BADGE[reg.status]
            )}
          >
            <span className={cn("size-1.5 rounded-full", STATUS_DOT[reg.status])} />
            <span className="capitalize">{reg.status}</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-2 p-3 text-xs">
        <MobileField label="Class / Year" value={`${LEVEL_LABELS[reg.academicLevel]} - ${reg.academicValue}`} />
        <MobileField label="T-Shirt" value={reg.tShirtSize} />
        <MobileField label="bKash" value={reg.bkashNumber} mono />
        <MobileField label="TrxID" value={reg.transactionId} mono />
        <MobileField label="Phone" value={reg.phoneNumber} mono />
        <MobileField label="WhatsApp" value={reg.whatsappNumber} mono />
      </div>

      <div className="flex items-center gap-2 border-t bg-muted/30 p-3">
        {actionLoading ? (
          <div className="flex flex-1 items-center justify-center gap-2 text-muted-foreground text-xs">
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </div>
        ) : (
          <MobileActions reg={reg} onAction={onAction} />
        )}
      </div>
    </div>
  );
}

function MobileActions({ reg, onAction }: RowActionsProps) {
  if (reg.status === "pending") {
    return (
      <>
        <Button
          size="sm"
          className="bg-brand-green flex-1 text-white hover:bg-brand-green/90"
          onClick={() => onAction("accept")}
        >
          <Check className="h-3.5 w-3.5" />
          Accept
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-brand-red/40 text-brand-red hover:bg-brand-red/10"
          onClick={() => onAction("reject")}
        >
          <X className="h-3.5 w-3.5" />
          Reject
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          onClick={() => onAction("delete")}
          aria-label="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </>
    );
  }
  if (reg.status === "accepted") {
    return (
      <>
        <Button
          size="sm"
          variant="outline"
          className="border-amber-500/40 text-amber-600 hover:bg-amber-500/10"
          onClick={() => onAction("reject")}
        >
          <X className="h-3.5 w-3.5" />
          Reject
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          onClick={() => onAction("delete")}
          aria-label="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </>
    );
  }
  return (
    <>
      <Button
        size="sm"
        className="bg-brand-green flex-1 text-white hover:bg-brand-green/90"
        onClick={() => onAction("accept")}
      >
        <Check className="h-3.5 w-3.5" />
        Accept
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        onClick={() => onAction("delete")}
        aria-label="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </>
  );
}

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
  span?: number;
}

function DetailItem({ icon, label, value, mono, span = 1 }: DetailItemProps) {
  return (
    <div className={cn(span === 2 && "md:col-span-2")}>
      <div className="text-muted-foreground mb-0.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide">
        {icon}
        {label}
      </div>
      <div className={cn("text-foreground text-sm", mono && "font-mono text-xs")}>{value}</div>
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
      <span className="text-muted-foreground text-[10px] font-medium uppercase tracking-wide">
        {label}
      </span>
      <span className={cn("text-foreground text-xs", mono && "font-mono")}>{value}</span>
    </div>
  );
}

export default RegistrationTable;
