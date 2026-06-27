"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  ShieldCheck,
  RefreshCw,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Download,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { api, ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Registration, Summary } from "@/types";

import { AdminLogin } from "./admin-login";
import { SummaryCards } from "./summary-cards";
import { RegistrationTable } from "./registration-table";

type TabKey = "all" | "pending" | "accepted" | "rejected";

interface SessionResponse {
  success: boolean;
  authenticated: boolean;
}

interface RegistrationsResponse {
  success: boolean;
  registrations: Registration[];
}

interface SummaryResponse {
  success: boolean;
  summary: Summary;
}

interface ActionResponse {
  success: boolean;
  registration?: Registration;
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

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [regsLoading, setRegsLoading] = useState<boolean>(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<TabKey>("pending");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [searchTxnId, setSearchTxnId] = useState("");
  const [searchBkash, setSearchBkash] = useState("");
  const [searchActive, setSearchActive] = useState(false);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
      const res = await api.get<RegistrationsResponse>(
        `/api/admin/registrations?status=${tab}`
      );
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
      const res = await api.get<SummaryResponse>("/api/admin/summary");
      setSummary(res.summary);
    } catch {
      // silent — top stat cards will just show 0
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  // ---- Load data when authed
  useEffect(() => {
    if (!authed) return;
    fetchSummary();
    if (!searchActive) {
      fetchRegistrations(activeTab);
    }
  }, [authed, activeTab, fetchRegistrations, fetchSummary, searchActive]);

  // ---- Optional auto-poll every 30s for fresh data
  useEffect(() => {
    if (!authed) return;
    pollRef.current = setInterval(() => {
      fetchSummary();
      // only refresh the current tab silently
      api
        .get<RegistrationsResponse>(`/api/admin/registrations?status=${activeTab}`)
        .then((res) => setRegistrations(res.registrations || []))
        .catch(() => {});
    }, 30000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [authed, activeTab, fetchSummary]);

  // ---- Handlers
  const handleSearch = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const txn = searchTxnId.trim().toUpperCase();
    const bkash = searchBkash.trim();
    
    if (!txn && !bkash) {
      setSearchActive(false);
      fetchRegistrations(activeTab);
      return;
    }

    setRegsLoading(true);
    setSearchActive(true);
    try {
      const res = await api.get<RegistrationsResponse>("/api/admin/registrations?status=all");
      const allRegs = res.registrations || [];
      
      const filtered = allRegs.filter((r) => {
        const matchTxn = txn ? r.transactionId.toUpperCase().includes(txn) : true;
        const matchBkash = bkash ? r.bkashNumber.includes(bkash) : true;
        return matchTxn && matchBkash;
      });
      
      setRegistrations(filtered);
      toast({
        title: "Search completed",
        description: `Found ${filtered.length} matching registration(s) globally.`,
      });
    } catch (err) {
      toast({
        title: "Search failed",
        description: "Could not perform global search.",
        variant: "destructive",
      });
    } finally {
      setRegsLoading(false);
    }
  }, [searchTxnId, searchBkash, activeTab, fetchRegistrations, toast]);

  const handleClearSearch = useCallback(() => {
    setSearchTxnId("");
    setSearchBkash("");
    setSearchActive(false);
    fetchRegistrations(activeTab);
  }, [activeTab, fetchRegistrations]);

  const handleExportCSV = useCallback(() => {
    if (registrations.length === 0) {
      toast({
        title: "No data",
        description: "There are no registrations to export.",
        variant: "destructive",
      });
      return;
    }

    const headers = [
      "ID No",
      "Name",
      "Phone Number",
      "WhatsApp Number",
      "Institution",
      "Academic Level",
      "Class/Year/Semester",
      "T-Shirt Size",
      "bKash Number",
      "Transaction ID",
      "Present Address",
      "Permanent Address",
      "Status",
      "Registered Date"
    ];

    const rows = registrations.map((r) => [
      r.idNo || "",
      r.name,
      r.phoneNumber,
      r.whatsappNumber,
      r.institutionName,
      r.academicLevel,
      r.academicValue,
      r.tShirtSize,
      r.bkashNumber,
      r.transactionId,
      r.presentAddress,
      r.permanentAddress,
      r.status,
      new Date(r.createdAt).toLocaleString()
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((val) => {
            const strVal = String(val).replace(/"/g, '""');
            return `"${strVal}"`;
          })
          .join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `registrations_${activeTab}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: `Downloaded CSV containing ${registrations.length} registration(s).`,
    });
  }, [registrations, activeTab, toast]);

  function handleLogin() {
    setAuthed(true);
    setActiveTab("pending");
    setSearchTxnId("");
    setSearchBkash("");
    setSearchActive(false);
  }

  async function handleLogout() {
    try {
      await api.post<{ success: boolean }>("/api/admin/logout");
    } catch {
      // ignore — proceed with client-side logout
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
    try {
      if (action === "delete") {
        const res = await api.delete<DeleteResponse>(
          `/api/admin/registrations/${id}`
        );
        if (res.success) {
          toast({
            title: "Registration deleted",
            description: "The registration has been removed.",
            variant: "destructive",
          });
        }
      } else {
        const res = await api.patch<ActionResponse>(
          `/api/admin/registrations/${id}`,
          { action }
        );
        if (res.success) {
          if (action === "accept") {
            const idNo = res.idNo || "—";
            const smsNote =
              res.smsSent === false
                ? " (SMS could not be sent — check logs.)"
                : " SMS notification sent.";
            toast({
              title: "Registration accepted",
              description: `ID: ${idNo}.${smsNote}`,
            });
          } else {
            toast({
              title: "Registration rejected",
              description: "The registrant has been marked as rejected.",
              variant: "destructive",
            });
          }
        }
      }

      // Refresh both summary + current tab list
      await Promise.all([fetchSummary(), fetchRegistrations(activeTab)]);
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

  // ---- Render
  if (authChecking) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="text-navy h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">Loading admin console...</p>
        </div>
      </div>
    );
  }

  if (!authed) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  // Tab counts from summary
  const tabCounts: Record<TabKey, number> = {
    all: summary?.total ?? 0,
    pending: summary?.pending ?? 0,
    accepted: summary?.accepted ?? 0,
    rejected: summary?.rejected ?? 0,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-background flex min-h-screen flex-col"
    >
      {/* Sticky top bar */}
      <header className="bg-gradient-navy shadow-navy sticky top-0 z-30">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/15 backdrop-blur">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-semibold text-white sm:text-lg">
                Admin Dashboard
              </h1>
              <p className="hidden text-xs text-white/70 sm:block">
                Run Against Drugs 2025 &middot; Registration Management
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={regsLoading || summaryLoading}
              className="text-white/90 hover:bg-white/10 hover:text-white"
            >
              <RefreshCw
                className={cn(
                  "h-4 w-4",
                  (regsLoading || summaryLoading) && "animate-spin"
                )}
              />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleLogout}
              className="bg-white/15 text-white hover:bg-white/25"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key="dashboard-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-6"
          >
            <SummaryCards summary={summary} loading={summaryLoading} />

            {/* Search Box */}
            <div className="bg-card rounded-xl border p-4 shadow-sm">
              <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="flex-1 space-y-1.5">
                  <label htmlFor="search-txnid" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Transaction ID
                  </label>
                  <input
                    id="search-txnid"
                    type="text"
                    placeholder="e.g. 9XQ4AB12CD"
                    value={searchTxnId}
                    onChange={(e) => setSearchTxnId(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 uppercase font-mono"
                  />
                </div>
                <div className="flex-1 space-y-1.5">
                  <label htmlFor="search-bkash" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    bKash Number
                  </label>
                  <input
                    id="search-bkash"
                    type="tel"
                    placeholder="e.g. 018XXXXXXXX"
                    value={searchBkash}
                    onChange={(e) => setSearchBkash(e.target.value.replace(/[^0-9]/g, ""))}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                  />
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    type="submit"
                    disabled={regsLoading || (!searchTxnId.trim() && !searchBkash.trim())}
                    className="bg-gradient-navy text-white hover:opacity-90 shadow-navy h-9 px-4 py-2"
                  >
                    Search
                  </Button>
                  {searchActive && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClearSearch}
                      className="h-9 px-4 py-2"
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </form>
            </div>

            {/* Tabs + Table */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div>
                    <h2 className="text-foreground text-lg font-semibold">
                      Registrations
                    </h2>
                    <p className="text-muted-foreground text-xs">
                      Review and manage participant submissions
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportCSV}
                    disabled={registrations.length === 0}
                    className="h-8 gap-1.5 text-xs border-navy/35 text-navy hover:bg-navy/10 sm:ml-2 mt-1 sm:mt-0"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Export CSV</span>
                  </Button>
                </div>
                <Tabs
                  value={activeTab}
                  onValueChange={(v) => {
                    setActiveTab(v as TabKey);
                    setSearchTxnId("");
                    setSearchBkash("");
                    setSearchActive(false);
                  }}
                >
                  <TabsList className="bg-muted h-9">
                    {TAB_CONFIG.map((t) => (
                      <TabsTrigger
                        key={t.key}
                        value={t.key}
                        className="gap-1.5 px-3"
                      >
                        {t.icon}
                        <span className="hidden sm:inline">{t.label}</span>
                        <span className="sm:hidden">{t.label}</span>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "ml-1 h-5 min-w-[20px] justify-center px-1.5 text-[10px] font-semibold",
                            activeTab === t.key
                              ? "bg-navy text-white"
                              : "bg-background text-muted-foreground"
                          )}
                        >
                          {tabCounts[t.key]}
                        </Badge>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              <RegistrationTable
                registrations={registrations}
                loading={regsLoading}
                onAction={handleAction}
                actionLoading={actionLoading}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="bg-muted/30 border-t mt-auto py-4">
        <div className="mx-auto w-full max-w-7xl px-4 text-center sm:px-6">
          <p className="text-muted-foreground text-xs">
            &copy; 2025 Run Against Drugs &middot; Admin Console
          </p>
        </div>
      </footer>
    </motion.div>
  );
}

export default AdminDashboard;
