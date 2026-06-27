"use client";

import { Activity, Phone, MapPin, Mail, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navigate } from "@/lib/nav";
import { EVENT_CONFIG } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-navy-dark text-white mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10">
                <Activity className="w-5 h-5 text-sky" />
              </div>
              <div>
                <div className="font-bold text-base">{EVENT_CONFIG.name}</div>
                <div className="text-xs text-white/60">{EVENT_CONFIG.tagline}</div>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              {EVENT_CONFIG.subtitle}. Join thousands of youth running for a
              healthier, drug-free nation.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-white/90">
              Quick Links
            </h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate("home")}
                className="text-sm text-white/70 hover:text-sky transition-colors text-left"
              >
                Home
              </button>
              <button
                onClick={() => navigate("register")}
                className="text-sm text-white/70 hover:text-sky transition-colors text-left"
              >
                Register Now
              </button>
              <button
                onClick={() => navigate("my-registration")}
                className="text-sm text-white/70 hover:text-sky transition-colors text-left"
              >
                Check Registration Status
              </button>
              <button
                onClick={() => navigate("admin")}
                className="text-sm text-white/70 hover:text-sky transition-colors text-left"
              >
                Admin Login
              </button>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-white/90">Contact</h3>
            <div className="flex flex-col gap-3">
              <a
                href={`tel:${EVENT_CONFIG.contactPhone}`}
                className="flex items-center gap-2 text-sm text-white/70 hover:text-sky transition-colors"
              >
                <Phone className="w-4 h-4" />
                {EVENT_CONFIG.contactPhone}
              </a>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <MapPin className="w-4 h-4" />
                {EVENT_CONFIG.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Mail className="w-4 h-4" />
                bKash: {EVENT_CONFIG.bkashNumber}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} {EVENT_CONFIG.name}. All rights reserved.
          </p>
          <Button
            onClick={() => navigate("register")}
            className="bg-gradient-red text-white hover:opacity-90 shadow-red"
          >
            Register Now
          </Button>
        </div>
        <div className="text-center text-xs text-white/40 mt-4 flex flex-col items-center justify-center gap-1">
          <p className="flex items-center gap-1 justify-center">
            Made with <Heart className="w-3 h-3 text-brand-red fill-brand-red" /> for a drug-free Bangladesh
          </p>
          <p className="mt-1 font-medium text-white/60">
            Organized by Bangladesh Islami Chhatrashibir, Chittagong City North (চট্টগ্রাম মহানগর উত্তর)
          </p>
        </div>
      </div>

    </footer>
  );
}
