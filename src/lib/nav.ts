"use client";

import type { ViewName } from "@/types";

// Navigate between views using hash routing
export function navigate(view: ViewName) {
  const hash = view === "home" ? "#/" : `#/${view}`;
  if (typeof window !== "undefined") {
    if (window.location.hash !== hash) {
      window.location.hash = hash;
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
}
