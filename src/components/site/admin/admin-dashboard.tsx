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
import { useToast } from "@/hooks/use-toast";
import { api, ApiError } from "@/lib/api";
import type { AcademicFestRegistration } from "@/types";

import { AdminLogin } from "./admin-login";
import { SummaryCards, type AcademicFestSummaryData } from "./summary-cards";
import { RegistrationTable } from "./registration-table";
import { HSC27_AF_CONFIG } from "@/lib/constants";

type TabKey = "all" | "pending" | "accepted" | "rejected";

interface SessionResponse {
  success: boolean;
  authenticated: boolean;
}

interface ActionResponse {
  success: boolean;
  registration?: AcademicFestRegistration;
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
  { key: "all", label: "All Applicants", icon: <Users className="h-3.5 w-3.5" /> },
  { key: "pending", label: "Pending", icon: <Clock className="h-3.5 w-3.5" /> },
  { key: "accepted", label: "Accepted", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  { key: "rejected", label: "Rejected", icon: <XCircle className="h-3.5 w-3.5" /> },
];

export function AdminDashboard() {
  const { toast } = useToast();

  const [authed, setAuthed] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState<boolean>(true);

  const [registrations, setRegistrations] = useState<AcademicFestRegistration[]>([]);
  const [regsLoading, setRegsLoading] = useState<boolean>(false);
  const [summary, setSummary] = useState<AcademicFestSummaryData | null>(null);
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
  const fetchRegistrations = useCallback(async (tab: TabKey) => {
    setRegsLoading(true);
    try {
      const endpoint = `/api/admin/academic-fest/registrations?status=${tab}`;
      const res = await api.get<{ success: boolean; registrations: AcademicFestRegistration[] }>(endpoint);
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

  const fetchSummary = useCallback(async () => {
    setSummaryLoading(true);
    try {
      const res = await api.get<{ success: boolean; registrations: AcademicFestRegistration[] }>(
        "/api/admin/academic-fest/registrations?status=all"
      );
      const all = res.registrations || [];

      // Calculate Academic Fest breakdown metrics
      const byGroup: Record<string, { total: number; accepted: number }> = {};
      const byTShirtSize: Record<string, { total: number; accepted: number }> = {};

      let totalMale = 0;
      let acceptedMale = 0;
      let totalFemale = 0;
      let acceptedFemale = 0;

      all.forEach((r) => {
        const isAcc = r.status === "accepted";
        const isFem = (r.gender || "").toLowerCase() === "female";

        if (isFem) {
          totalFemale++;
          if (isAcc) acceptedFemale++;
        } else {
          totalMale++;
          if (isAcc) acceptedMale++;
        }

        // Academic Group
        if (r.group) {
          if (!byGroup[r.group]) byGroup[r.group] = { total: 0, accepted: 0 };
          byGroup[r.group].total++;
          if (isAcc) byGroup[r.group].accepted++;
        }

        // T-Shirt Size
        if (r.tShirtSize) {
          if (!byTShirtSize[r.tShirtSize]) byTShirtSize[r.tShirtSize] = { total: 0, accepted: 0 };
          byTShirtSize[r.tShirtSize].total++;
          if (isAcc) byTShirtSize[r.tShirtSize].accepted++;
        }
      });

      setSummary({
        total: all.length,
        pending: all.filter((r) => r.status === "pending").length,
        accepted: all.filter((r) => r.status === "accepted").length,
        rejected: all.filter((r) => r.status === "rejected").length,
        totalMale,
        acceptedMale,
        totalFemale,
        acceptedFemale,
        byGroup,
        byTShirtSize,
      });
    } catch {
      // silent fallback
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  // ---- Load data when authed
  useEffect(() => {
    if (!authed) return;
    fetchSummary();
    fetchRegistrations(activeTab);
  }, [authed, activeTab, fetchRegistrations, fetchSummary]);

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
    await Promise.all([fetchSummary(), fetchRegistrations(activeTab)]);
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
    const baseApi = "/api/admin/academic-fest/registrations";
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
              description: `Serial ID: ${idNo}.${smsNote}`,
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

      await Promise.all([fetchSummary(), fetchRegistrations(activeTab)]);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Action failed";
      toast({
        title: "Action Failed",
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
        description: "There are no registrations to download in the current filter.",
        variant: "destructive",
      });
      return;
    }

    const headers = [
      "ID No",
      "Status",
      "Full Name",
      "Gender",
      "Institution",
      "T-Shirt Size",
      "Academic Group",
      "SSC Roll Number",
      "SSC Reg Number",
      "Education Board",
      "Phone Number",
      "WhatsApp Number",
      "Present Address",
      "Permanent Address",
      "Question to Panelist",
      "Submitted Date",
    ];

    const rows = registrations.map((r) => [
      r.idNo || "",
      r.status || "",
      r.name || "",
      r.gender ? (r.gender === "female" ? "Female" : "Male") : "",
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
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `hsc27_academic_fest_registrations_${activeTab}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: `Downloaded ${registrations.length} registrations to CSV.`,
    });
  }, [registrations, activeTab, toast]);

  if (authChecking) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 text-slate-800">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!authed) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base leading-none text-slate-900">
                  {HSC27_AF_CONFIG.name}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 border border-emerald-200">
                  <Sparkles className="size-2.5" /> Admin Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                {HSC27_AF_CONFIG.organizer}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="hidden sm:inline-flex rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-100 font-bold text-xs shadow-sm"
            >
              <Download className="mr-1.5 h-3.5 w-3.5 text-emerald-600" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 shadow-sm"
            >
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Refresh
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            >
              <LogOut className="mr-1.5 h-3.5 w-3.5" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Summary Metric Cards */}
        {summary && (
          <SummaryCards
            summary={summary}
            loading={summaryLoading}
          />
        )}

        {/* Status Filter Tabs & Table */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <Tabs
              value={activeTab}
              onValueChange={(val) => setActiveTab(val as TabKey)}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid w-full sm:w-[480px] grid-cols-4 bg-slate-200/80 border border-slate-200 p-1 rounded-xl h-11">
                {TAB_CONFIG.map((t) => (
                  <TabsTrigger
                    key={t.key}
                    value={t.key}
                    className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm font-bold text-xs rounded-lg transition-all"
                  >
                    <span className="mr-1.5 hidden sm:inline">{t.icon}</span>
                    {t.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <Button
              size="sm"
              onClick={handleExportCSV}
              className="sm:hidden w-full rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs shadow-sm"
            >
              <Download className="mr-1.5 h-3.5 w-3.5 text-emerald-400" />
              Export CSV ({registrations.length})
            </Button>
          </div>

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

export default AdminDashboard;
