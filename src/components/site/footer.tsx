"use client";

import { Activity, Phone, MapPin, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navigate } from "@/lib/nav";
import { HSC27_AF_CONFIG } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800/80 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand & Organization */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="font-bold text-base text-white">Event Management Portal</div>
                <div className="text-xs text-emerald-400 font-medium">Chhatrashibir Chattogram City North</div>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Organizing academic receptions, youth awareness marathons, and educational development programs across Chattogram City North.
            </p>
          </div>

          {/* Events Navigation */}
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-wider mb-4 text-emerald-400">
              Event Navigation
            </h3>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => navigate("home")}
                className="text-sm text-slate-300 hover:text-emerald-400 transition-colors text-left font-medium"
              >
                🏠 Main Event Portal (Home)
              </button>
              <button
                onClick={() => navigate("event/hsc27-af")}
                className="text-sm text-slate-300 hover:text-emerald-400 transition-colors text-left flex items-center gap-1.5"
              >
                <span>✨ HSC&apos;27 Academic Fest</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">5TH SEP</span>
              </button>
              <button
                onClick={() => navigate("event/run26-agains-drugs")}
                className="text-sm text-slate-300 hover:text-slate-100 transition-colors text-left flex items-center gap-1.5"
              >
                <span>🏃 Run Against Drugs 2026</span>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">ENDED</span>
              </button>
              <button
                onClick={() => navigate("my-registration")}
                className="text-sm text-slate-300 hover:text-emerald-400 transition-colors text-left"
              >
                🔍 Check Registration Status
              </button>

            </div>
          </div>

          {/* Helpline & Location */}
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-wider mb-4 text-emerald-400">
              Helpline & Contact
            </h3>
            <div className="flex flex-col gap-3">
              <a
                href={`tel:${HSC27_AF_CONFIG.contactPhone}`}
                className="flex items-center gap-2 text-sm text-slate-300 hover:text-emerald-400 transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                {HSC27_AF_CONFIG.contactPhone}
              </a>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <MapPin className="w-4 h-4 text-emerald-400" />
                Chattogram City North, Bangladesh
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Bangladesh Islami Chhatrashibir - Chattogram City North. All rights reserved.
          </p>
          <Button
            onClick={() => navigate("my-registration")}
            className="bg-gradient-to-r from-amber-400 to-yellow-500 font-bold text-slate-950 hover:bg-yellow-300 rounded-full px-6 text-xs"
          >
            Check Registration Status
          </Button>
        </div>
      </div>
    </footer>
  );
}
