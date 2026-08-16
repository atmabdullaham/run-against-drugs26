"use client";

import { useSyncExternalStore, useCallback } from "react";
import type { ViewName } from "@/types";

// Parse the current hash into a view name
function parseHash(): ViewName {
  if (typeof window === "undefined") return "home";
  const hash = window.location.hash.replace(/^#\/?/, "").toLowerCase();
  if (hash === "register") return "register";
  if (hash === "my-registration") return "my-registration";
  if (hash === "admin") return "admin";
  if (hash === "event/hsc27-af") return "event/hsc27-af";
  if (hash === "event/hsc27-af/registration") return "event/hsc27-af/registration";
  if (hash === "event/run26-agains-drugs") return "event/run26-agains-drugs";
  return "home";
}

// Subscribe to hashchange events (for useSyncExternalStore)
function subscribe(callback: () => void): () => void {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}

export function useViewRouter() {
  const view = useSyncExternalStore(
    subscribe,
    parseHash, // client snapshot
    () => "home" as ViewName // server snapshot
  );

  const navigate = useCallback((to: ViewName) => {
    const hash = to === "home" ? "#/" : `#/${to}`;
    if (typeof window !== "undefined") {
      if (window.location.hash !== hash) {
        window.location.hash = hash;
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, []);

  return { view, navigate };
}
