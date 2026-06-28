"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navigate } from "@/lib/nav";
import { EVENT_CONFIG } from "@/lib/constants";
import { useViewRouter } from "@/hooks/use-view-router";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { view } = useViewRouter();

  const isClosed = Date.now() > new Date(EVENT_CONFIG.registrationDeadline).getTime();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isNavbarScrolled = scrolled || view !== "home";

  const navLinks = [
    { label: "Home", view: "home" as const, hash: "hero" },
    { label: "About", view: "home" as const, hash: "about" },
    { label: "Countdown", view: "home" as const, hash: "countdown" },
    { label: "Details", view: "home" as const, hash: "details" },
    { label: "FAQ", view: "home" as const, hash: "faq" },
  ];

  const handleNavClick = (view: "home", hash: string) => {
    setMobileOpen(false);
    if (window.location.hash !== "#/" && window.location.hash !== "") {
      navigate(view);
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isNavbarScrolled
            ? "bg-white/90 backdrop-blur-md shadow-lg shadow-navy/5"
            : "bg-transparent"
        }`}
      >
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <button
              onClick={() => handleNavClick("home", "hero")}
              className="flex items-center gap-2 group"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-navy shadow-navy group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div
                  className={`font-bold text-sm sm:text-base leading-tight transition-colors duration-300 ${
                    isNavbarScrolled ? "text-navy" : "text-white"
                  }`}
                >
                  {EVENT_CONFIG.name}
                </div>
                <div
                  className={`text-[10px] sm:text-xs leading-tight transition-colors duration-300 ${
                    isNavbarScrolled ? "text-muted-foreground" : "text-white/60"
                  }`}
                >
                  {EVENT_CONFIG.tagline}
                </div>
              </div>
            </button>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.view, link.hash)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                    isNavbarScrolled
                      ? "text-navy/80 hover:text-navy hover:bg-accent/50"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-2">
              {isClosed ? (
                <Button
                  onClick={() => navigate("my-registration")}
                  className="bg-gradient-navy text-white hover:opacity-90 shadow-navy"
                >
                  My Registration
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => navigate("my-registration")}
                    className={`transition-all duration-300 ${
                      isNavbarScrolled
                        ? "text-navy hover:bg-accent/50"
                        : "text-white hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    My Registration
                  </Button>
                  <Button
                    onClick={() => navigate("register")}
                    className="bg-gradient-red text-white hover:opacity-90 shadow-red"
                  >
                    Register Now
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2 transition-colors duration-300 ${
                isNavbarScrolled ? "text-navy" : "text-white"
              }`}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl p-6 pt-24 overflow-y-auto"
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link.view, link.hash)}
                    className="text-left px-4 py-3 text-sm font-medium text-navy hover:bg-accent/50 rounded-lg transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
                <div className="h-px bg-border my-2" />
                <Button
                  variant={isClosed ? "default" : "outline"}
                  onClick={() => {
                    setMobileOpen(false);
                    navigate("my-registration");
                  }}
                  className={`w-full justify-center ${isClosed ? "bg-gradient-navy text-white hover:opacity-90" : ""}`}
                >
                  My Registration
                </Button>
                {!isClosed && (
                  <Button
                    onClick={() => {
                      setMobileOpen(false);
                      navigate("register");
                    }}
                    className="w-full justify-center bg-gradient-red text-white"
                  >
                    Register Now
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
