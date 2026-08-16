"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Search, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navigate } from "@/lib/nav";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-slate-950/90 backdrop-blur-md shadow-lg shadow-black/40 border-b border-slate-800/60 py-3"
        : "bg-slate-950/80 backdrop-blur-sm border-b border-slate-800/40 py-4"
        }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Organization Title */}
          <button
            onClick={() => navigate("home")}
            className="flex items-center gap-3 text-left group"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="font-extrabold text-sm sm:text-base leading-tight text-white group-hover:text-emerald-300 transition-colors">
                Chhatrashibir
              </div>
              <div className="text-[10px] sm:text-xs font-semibold text-emerald-400/90 leading-tight">
                Chattogram City North
              </div>
            </div>
          </button>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("home")}
              className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60"
            >

              Home
            </Button>

            <Button
              size="sm"
              onClick={() => navigate("my-registration")}
              className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm px-4 py-2 shadow-md shadow-emerald-500/20"
            >

              My Registration
            </Button>
          </div>
        </div>
      </nav>
    </motion.header>
  );
}
