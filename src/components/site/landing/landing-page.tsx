"use client";

import * as React from "react";

import { Hero } from "@/components/site/landing/hero";
import { Highlights } from "@/components/site/landing/highlights";
import { Countdown } from "@/components/site/landing/countdown";
import { EventInfo } from "@/components/site/landing/event-info";
import { Faq } from "@/components/site/landing/faq";

export function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-background">
      <Hero />
      <Highlights />
      <Countdown />
      <EventInfo />
      <Faq />
    </div>
  );
}

export default LandingPage;
