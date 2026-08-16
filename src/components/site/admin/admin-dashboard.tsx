"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LogOut,
  ShieldCheck,
  RefreshCw,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  Sparkles,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { api, ApiError } from "@/lib/api";
import type { Registration, AcademicFestRegistration, Summary } from "@/types";

import { AdminLogin } from "./admin-login";
import { SummaryCards } from "./summary-cards";
import { RegistrationTable } from "./registration-table";

type TabKey = "all" | "pending" | "accepted" | "rejected";
type AdminEventType = "hsc27-af" | "run26-against-drugs";

interface SessionResponse {
  success: boolean;
  authenticated: boolean;
}

interface ActionResponse {
  success: boolean;
  registration?: any;
  idNo?: string;
  smsSent?: boolean;
  smsMessage?: string;
  error?: string;
}

interface DeleteResponse {
  success: boolean;
  error?: string;
}

const TAB_CONFIG: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "all", label: "All", icon: <Users className="h-3.5 w-3.5" /> },
  { key: "pending", label: "Pending", icon: <Clock className="h-3.5 w-3.5" /> },
  { key: "accepted", label: "Accepted", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  { key: "rejected", label: "Rejected", icon: <XCircle className="h-3.5 w-3.5" /> },
];

export function AdminDashboard() {
  const { toast } = useToast();

  const [authed, setAuthed] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState<boolean>(true);

  const [selectedEvent, setSelectedEvent] = useState<AdminEventType>("hsc27-af");
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [regsLoading, setRegsLoading] = useState<boolean>(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<TabKey>("pending");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // ---- Auth check on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get<SessionResponse>("/api/admin/session");
        if (!cancelled) setAuthed(res.authenticated === true);
      } catch {
        if (!cancelled) setAuthed(false);
      } finally {
        if (!cancelled) setAuthChecking(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // ---- Fetchers
  const fetchRegistrations = useCallback(async (event: AdminEventType, tab: TabKey) => {
    setRegsLoading(true);
    try {
      const endpoint = event === "hsc27-af"
        ? `/api/admin/academic-fest/registrations?status=${tab}`
        : `/api/admin/registrations?status=${tab}`;
      const res = await api.get<{ success: boolean; registrations: any[] }>(endpoint);
      setRegistrations(res.registrations || []);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to load registrations";
      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      });
      setRegistrations([]);
    } finally {
      setRegsLoading(false);
    }
  }, [toast]);

  const fetchSummary = useCallback(async (event: AdminEventType) => {
    setSummaryLoading(true);
    try {
      if (event === "hsc27-af") {
        const res = await api.get<{ success: boolean; registrations: any[] }>(
          "/api/admin/academic-fest/registrations?status=all"
        );
        const all = res.registrations || [];
        setSummary({
          total: all.length,
          pending: all.filter((r) => r.status === "pending").length,
          accepted: all.filter((r) => r.status === "accepted").length,
          rejected: all.filter((r) => r.status === "rejected").length,
          byTShirtSize: {},
          byAcademicLevel: {},
          acceptedByTShirtSize: {},
          acceptedByAcademicLevel: {},
        });
      } else {
        const res = await api.get<{ success: boolean; summary: Summary }>("/api/admin/summary");
        setSummary(res.summary);
      }
    } catch {
      // silent fallback
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  // ---- Load data when authed or event changes
  useEffect(() => {
    if (!authed) return;
    fetchSummary(selectedEvent);
    fetchRegistrations(selectedEvent, activeTab);
  }, [authed, selectedEvent, activeTab, fetchRegistrations, fetchSummary]);

  function handleLogin() {
    setAuthed(true);
    setActiveTab("pending");
  }

  async function handleLogout() {
    try {
      await api.post<{ success: boolean }>("/api/admin/logout");
    } catch {
      // ignore
    }
    setAuthed(false);
    setRegistrations([]);
    setSummary(null);
    toast({
      title: "Signed out",
      description: "You have been logged out.",
    });
  }

  async function handleRefresh() {
    await Promise.all([fetchSummary(selectedEvent), fetchRegistrations(selectedEvent, activeTab)]);
    toast({
      title: "Refreshed",
      description: "Latest registrations loaded.",
    });
  }

  async function handleAction(
    id: string,
    action: "accept" | "reject" | "delete"
  ) {
    setActionLoading(id);
    const baseApi = selectedEvent === "hsc27-af" ? "/api/admin/academic-fest/registrations" : "/api/admin/registrations";
    try {
      if (action === "delete") {
        const res = await api.delete<DeleteResponse>(`${baseApi}/${id}`);
        if (res.success) {
          toast({
            title: "Registration deleted",
            description: "The registration has been removed.",
            variant: "destructive",
          });
        }
      } else {
        const res = await api.patch<ActionResponse>(`${baseApi}/${id}`, { action });
        if (res.success) {
          if (action === "accept") {
            const idNo = res.idNo || "—";
            const smsNote = res.smsSent === false ? " (SMS delivery pending/failed)." : " Confirmation SMS sent!";
            toast({
              title: "Registration Accepted 🎉",
              description: `ID: ${idNo}.${smsNote}`,
            });
          } else {
            toast({
              title: "Registration Rejected",
              description: "The registrant has been marked as rejected.",
              variant: "destructive",
            });
          }
        }
      }

      await Promise.all([fetchSummary(selectedEvent), fetchRegistrations(selectedEvent, activeTab)]);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Action failed";
      toast({
        title: "Action failed",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  }

  const handleExportCSV = useCallback(() => {
    if (!registrations.length) {
      toast({
        title: "No Data to Export",
        description: "There are no registrations to download.",
        variant: "destructive",
      });
      return;
    }

    const headers = selectedEvent === "hsc27-af"
      ? ["ID No", "Status", "Full Name", "Institution", "T-Shirt Size", "Group", "SSC Roll", "SSC Reg No", "Board", "Phone", "WhatsApp", "Present Address", "Permanent Address", "Question to Panelist", "Registered Date"]
      : ["ID No", "Status", "Full Name", "Institution", "Level", "Class/Year", "T-Shirt", "bKash", "TrxID", "Phone", "WhatsApp", "Present Address", "Permanent Address", "Registered Date"];

    const rows = registrations.map((r) => {
      if (selectedEvent === "hsc27-af") {
        return [
          r.idNo || "",
          r.status || "",
          r.name || "",
          r.institutionName || "",
          r.tShirtSize || "",
          r.group || "",
          r.rollNumber || "",
          r.regNumber || "",
          r.board || "",
          r.phoneNumber || "",
          r.whatsappNumber || "",
          r.presentAddress || "",
          r.permanentAddress || "",
          r.guestQuestion || "",
          r.createdAt || "",
        ];
      }
      return [
        r.idNo || "",
        r.status || "",
        r.name || "",
        r.institutionName || "",
        r.academicLevel || "",
        r.academicValue || "",
        r.tShirtSize || "",
        r.bkashNumber || "",
        r.transactionId || "",
        r.phoneNumber || "",
        r.whatsappNumber || "",
        r.presentAddress || "",
        r.permanentAddress || "",
        r.createdAt || "",
      ];
    });

    const csvContent = [headers, ...rows]
      .map((row) => row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${selectedEvent}_registrations_${activeTab}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: `Downloaded ${registrations.length} registrations to CSV.`,
    });
  }, [registrations, selectedEvent, activeTab, toast]);

  if (authChecking) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  if (!authed) {
    return <AdminLogin onSuccess={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-base leading-none text-white">
                Admin Control Center
              </h1>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                Chhatrashibir Chattogram City North
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Refresh
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-red-400 hover:bg-red-950/40 hover:text-red-300"
            >
              <LogOut className="mr-1.5 h-3.5 w-3.5" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Event Selection Switcher Bar */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-2 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3">
              Select Event:
            </span>
            <div className="grid grid-cols-2 gap-2 flex-1 sm:flex-initial">
              <button
                type="button"
                onClick={() => setSelectedEvent("hsc27-af")}
                className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-bold transition-all ${
                  selectedEvent === "hsc27-af"
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                    : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                <Sparkles className="size-3.5 text-amber-300" />
                HSC&apos;27 Academic Fest
              </button>

              <button
                type="button"
                onClick={() => setSelectedEvent("run26-against-drugs")}
                className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-bold transition-all ${
                  selectedEvent === "run26-against-drugs"
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                    : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                Run Against Drugs 2026
              </button>
            </div>
          </div>

          <Button
            size="sm"
            onClick={handleExportCSV}
            className="w-full sm:w-auto rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 font-semibold text-xs"
          >
            <Download className="mr-1.5 h-3.5 w-3.5 text-emerald-400" />
            Export CSV
          </Button>
        </div>

        {/* Summary Metric Cards */}
        {summary && <SummaryCards summary={summary} loading={summaryLoading} />}

        {/* Status Filter Tabs */}
        <div className="space-y-4">
          <Tabs
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as TabKey)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 bg-slate-900 border border-slate-800 p-1">
              {TAB_CONFIG.map((t) => (
                <TabsTrigger
                  key={t.key}
                  value={t.key}
                  className="data-[state=active]:bg-emerald-500 data-[state=active]:text-slate-950 font-bold text-xs"
                >
                  <span className="mr-1.5 hidden sm:inline">{t.icon}</span>
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Registrations Table Component */}
          <RegistrationTable
            registrations={registrations}
            loading={regsLoading}
            onAction={handleAction}
            actionLoading={actionLoading}
          />
        </div>
      </main>
    </div>
  );
}
