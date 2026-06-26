"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import {
  ShieldCheck,
  Users,
  Shirt,
  Trophy,
  Zap,
  Activity,
  type LucideIcon,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

interface Highlight {
  icon: LucideIcon;
  title: string;
  description: string;
  badgeClass: string;
}

const highlights: Highlight[] = [
  {
    icon: ShieldCheck,
    title: "Drug-Free Awareness",
    description:
      "Stand with hundreds of youth pledging to keep Bangladesh free from drugs and addiction.",
    badgeClass: "bg-gradient-red text-white",
  },
  {
    icon: Users,
    title: "Community Marathon",
    description:
      "Run alongside students, athletes, and changemakers from across the country in a unified movement.",
    badgeClass: "bg-gradient-sky text-white",
  },
  {
    icon: Shirt,
    title: "Free Event T-Shirt",
    description:
      "Every confirmed participant receives an official Run Against Drugs 2026 event T-shirt.",
    badgeClass: "bg-gradient-orange text-white",
  },

  {
    icon: Zap,
    title: "Youth Empowerment",
    description:
      "Channel your energy into a cause that empowers your generation to lead with purpose.",
    badgeClass: "bg-gradient-navy text-white",
  },
  {
    icon: Activity,
    title: "Health & Fitness",
    description:
      "Kickstart or strengthen your fitness journey with a 3KM route designed for all levels.",
    badgeClass: "bg-gradient-to-br from-[#1e90ff] to-[#228b22] text-white",
  },
];

export function Highlights() {
  return (
    <section
      id="about"
      aria-label="Event highlights"
      className="relative w-full bg-background py-20 sm:py-24"
    >
      <div aria-hidden className="bg-pattern absolute inset-0 opacity-50" />
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <Badge className="mb-3 gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
            <Zap className="size-3.5 text-[#ffa500]" />
            Why Join
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight text-gradient-navy sm:text-4xl">
            Event Highlights
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            More than just a marathon — a movement to build a healthier,
            drug-free Bangladesh led by its youth.
          </p>
        </motion.div>

        {/* Highlights grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {highlights.map((h) => (
            <motion.div key={h.title} variants={itemVariants}>
              <Card className="group h-full overflow-hidden border-border/60 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#173083]/40 hover:shadow-navy">
                <CardContent className="flex h-full flex-col items-start gap-4 p-6">
                  <div
                    className={`flex size-14 items-center justify-center rounded-2xl ${h.badgeClass} shadow-sm transition-transform duration-300 group-hover:scale-110`}
                  >
                    <h.icon className="size-7" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-foreground">
                      {h.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {h.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Highlights;
