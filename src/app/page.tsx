"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useViewRouter } from "@/hooks/use-view-router";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { LandingPage } from "@/components/site/landing/landing-page";
import { RegistrationForm } from "@/components/site/registration-form";
import { MyRegistration } from "@/components/site/my-registration";
import { AdminDashboard } from "@/components/site/admin/admin-dashboard";

export default function Home() {
  const { view } = useViewRouter();

  // Update document title based on view
  useEffect(() => {
    const titles: Record<string, string> = {
      home: "Run Against Drugs 2025 | Register Now",
      register: "Registration | Run Against Drugs 2025",
      "my-registration": "My Registration | Run Against Drugs 2025",
      admin: "Admin Dashboard | Run Against Drugs 2025",
    };
    document.title = titles[view] || "Run Against Drugs 2025";
  }, [view]);

  // Admin view: full-screen, no navbar/footer
  if (view === "admin") {
    return (
      <div className="min-h-screen bg-background">
        <AdminDashboard />
      </div>
    );
  }

  // Public views: navbar + content + sticky footer
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {view === "home" && <LandingPage />}
            {view === "register" && (
              <div className="pt-16 sm:pt-20">
                <RegistrationForm />
              </div>
            )}
            {view === "my-registration" && (
              <div className="pt-16 sm:pt-20">
                <MyRegistration />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
