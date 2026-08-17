"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Loader2, Lock, User, ArrowLeft, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { api, ApiError } from "@/lib/api";
import { navigate } from "@/lib/nav";

interface AdminLoginProps {
  onLogin: () => void;
}

interface LoginResponse {
  success: boolean;
  data?: { username: string };
  error?: string;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setLoading(true);

    try {
      const res = await api.post<LoginResponse>("/api/admin/login", {
        username: username.trim(),
        password,
      });

      if (res.success) {
        setUsername("");
        setPassword("");
        onLogin();
      } else {
        setError(res.error || "Login failed. Please try again.");
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Network error. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-12">
      {/* Subtle decorative background gradients */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        <Card className="border-slate-200 bg-white shadow-2xl rounded-2xl">
          <CardHeader className="items-center text-center pb-2">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 14 }}
              className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/25"
            >
              <ShieldCheck className="h-8 w-8" />
            </motion.div>
            <CardTitle className="text-2xl font-extrabold text-slate-900">Admin Login</CardTitle>
            <CardDescription className="text-slate-500 text-xs font-medium">
              Sign in to manage event registrations
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              <div className="flex flex-col gap-2">
                <Label htmlFor="admin-username" className="text-slate-700 font-semibold text-xs uppercase tracking-wider">
                  Username
                </Label>
                <div className="relative">
                  <User className="text-slate-400 pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                  <Input
                    id="admin-username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    disabled={loading}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="pl-9 h-11 bg-white border-slate-300 text-slate-900 focus:border-emerald-600 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="admin-password" className="text-slate-700 font-semibold text-xs uppercase tracking-wider">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="text-slate-400 pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                  <Input
                    id="admin-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    disabled={loading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-9 h-11 bg-white border-slate-300 text-slate-900 focus:border-emerald-600 rounded-xl"
                  />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Alert variant="destructive" className="rounded-xl border-rose-200 bg-rose-50 text-rose-800">
                    <AlertCircle className="h-4 w-4 text-rose-600" />
                    <AlertDescription className="text-xs font-semibold">{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <Button
                type="submit"
                disabled={loading || !username.trim() || !password}
                className="mt-2 h-11 w-full bg-emerald-600 text-white font-bold transition-all hover:bg-emerald-700 shadow-md shadow-emerald-600/20 rounded-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Sign In to Dashboard
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 flex flex-col items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => navigate("home")}
                className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
              >
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Back to Portal Home
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-slate-400 font-medium">
          Bangladesh Islami Chhatrashibir &middot; Chattogram City North
        </p>
      </motion.div>
    </div>
  );
}

export default AdminLogin;
