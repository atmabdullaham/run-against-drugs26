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
    <div className="bg-gradient-navy relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-brand-red/20 blur-3xl" />
      <div className="bg-pattern pointer-events-none absolute inset-0 opacity-30" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        <Card className="border-white/10 bg-white/95 shadow-2xl backdrop-blur-xl">
          <CardHeader className="items-center text-center">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 14 }}
              className="bg-gradient-navy shadow-navy mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-2xl"
            >
              <ShieldCheck className="h-8 w-8 text-white" />
            </motion.div>
            <CardTitle className="text-navy text-2xl font-bold">Admin Login</CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to manage registrations
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              <div className="flex flex-col gap-2">
                <Label htmlFor="admin-username" className="text-foreground">
                  Username
                </Label>
                <div className="relative">
                  <User className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
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
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="admin-password" className="text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
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
                    className="pl-9"
                  />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <Button
                type="submit"
                disabled={loading || !username.trim() || !password}
                className="bg-gradient-navy hover:shadow-navy mt-2 h-11 w-full text-white transition-all hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    Login
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
                className="text-muted-foreground hover:text-navy"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-white/60">
          Run Against Drugs 2025 &middot; Admin Console
        </p>
      </motion.div>
    </div>
  );
}

export default AdminLogin;
