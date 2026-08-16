"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useViewRouter } from "@/hooks/use-view-router";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { LandingPage } from "@/components/site/landing/landing-page";
import { RegistrationForm } from "@/components/site/registration-form";
import { MyRegistration } from "@/components/site/my-registration";
import { AdminDashboard } from "@/components/site/admin/admin-dashboard";
import { AcademicFestLanding } from "@/components/site/academic-fest/academic-fest-landing";
import { AcademicFestRegistrationForm } from "@/components/site/academic-fest/academic-fest-registration-form";
import { PortalHomePage } from "@/components/site/portal-home-page";

export default function Home() {
  const { view } = useViewRouter();
  const [mounted, setMounted] = useState(false);

  // Update document title based on view
  useEffect(() => {
    setMounted(true);
    const titles: Record<string, string> = {
      home: "Event Portal | Bangladesh Islami Chhatrashibir Chattogram City North",
      register: "Registration | Run Against Drugs 2026",
      "my-registration": "My Registration Status",
      admin: "Admin Dashboard",
      "event/hsc27-af": "HSC'27 Academic Fest | Chattogram City North",
      "event/hsc27-af/registration": "Registration | HSC'27 Academic Fest",
      "event/run26-agains-drugs": "Run Against Drugs 2026 | Youth Awareness",
    };
    document.title = titles[view] || "Chhatrashibir Chattogram City North Event Portal";
  }, [view]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="size-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  // Admin view: full-screen, no navbar/footer
  if (view === "admin") {
    return (
      <div className="min-h-screen bg-background">
        <AdminDashboard />
      </div>
    );
  }

  // Academic Fest event landing view (has its own hero/theme)
  if (view === "event/hsc27-af") {
    return (
      <div className="min-h-screen flex flex-col bg-slate-900">
        <Navbar />
        <main className="flex-1">
          <AcademicFestLanding />
        </main>
        <Footer />
      </div>
    );
  }

  // Academic Fest registration view
  if (view === "event/hsc27-af/registration") {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950">
        <Navbar />
        <main className="flex-1 pt-16 sm:pt-20">
          <AcademicFestRegistrationForm />
        </main>
        <Footer />
      </div>
    );
  }

  // Run Against Drugs 2026 event view
  if (view === "event/run26-agains-drugs") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1">
          <LandingPage />
        </main>
        <Footer />
      </div>
    );
  }

  // Central Portal Main Home View (home / #/)
  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
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
            {view === "home" && <PortalHomePage />}
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
