"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { HelpCircle, MessageCircleQuestion } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EVENT_CONFIG } from "@/lib/constants";

interface FaqItem {
  question: string;
  answer: React.ReactNode;
}

const faqs: FaqItem[] = [
  {
    question: "How do I register?",
    answer: (
      <>
        Click the{" "}
        <span className="font-semibold text-foreground">Register Now</span>{" "}
        button, fill out the registration form with your personal details,
        academic information, T-shirt size, and your bKash Transaction ID. Once
        submitted, our admin team will verify your payment.
      </>
    ),
  },
  {
    question: "What is the registration fee?",
    answer: (
      <>
        The registration fee is{" "}
        <span className="font-semibold text-foreground">
          {EVENT_CONFIG.registrationFee} BDT
        </span>
        , payable via bKash (Send Money) to{" "}
        <span className="rounded bg-[#dc143c]/10 px-1.5 py-0.5 font-mono font-semibold text-[#dc143c]">
          {EVENT_CONFIG.bkashNumber}
        </span>
        . Please keep the Transaction ID — you will need it for the form.
      </>
    ),
  },
  {
    question: "How do I check my registration status?",
    answer: (
      <>
        Go to the{" "}
        <span className="font-semibold text-foreground">My Registration</span>{" "}
        page, enter the phone number you used during registration, and you will
        instantly see your current status (pending, accepted, or rejected)
        along with your ID number once approved.
      </>
    ),
  },
  {
    question: "When will I get my ID number?",
    answer: (
      <>
        After our admin verifies your bKash payment, your registration is
        accepted and a unique ID (e.g.{" "}
        <span className="font-mono font-semibold text-foreground">RD001</span>)
        is auto-generated. You will receive an SMS at your registered phone
        number with the confirmation and your ID.
      </>
    ),
  },
  {
    question: "Is there a T-shirt included?",
    answer: (
      <>
        Yes! All confirmed (accepted) participants receive a free official{" "}
        <span className="font-semibold text-foreground">
          Run Against Drugs 2026
        </span>{" "}
        event T-shirt. Make sure to select the correct size (S, M, L, XL, XXL,
        or 3XL) in the registration form.
      </>
    ),
  },
  {
    question: "How can I join the WhatsApp group?",
    answer: (
      <>
        Once your registration is accepted, the{" "}
        <span className="font-semibold text-foreground">
          Join WhatsApp
        </span>{" "}
        button on the My Registration page will activate. Click it to join the
        official event group for updates, instructions, and coordination.
      </>
    ),
  },
];

export function Faq() {
  return (
    <section
      id="faq"
      aria-label="Frequently asked questions"
      className="relative w-full bg-muted/30 py-20 sm:py-24"
    >
      <div aria-hidden className="bg-pattern absolute inset-0 opacity-50" />
      <div className="relative mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-10 max-w-2xl text-center"
        >
          <Badge className="mb-3 gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
            <MessageCircleQuestion className="size-3.5 text-[#1e90ff]" />
            Got Questions?
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight text-gradient-navy sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            Quick answers to the most common questions about registering for
            and participating in the marathon.
          </p>
        </motion.div>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden rounded-2xl border-border/60 bg-card shadow-sm">
            <CardContent className="p-2 sm:p-4">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, idx) => (
                  <AccordionItem
                    key={faq.question}
                    value={`item-${idx}`}
                    className="px-2 sm:px-3"
                  >
                    <AccordionTrigger className="text-left text-base font-semibold text-foreground hover:no-underline sm:text-lg">
                      <span className="flex items-start gap-3">
                        <HelpCircle className="mt-0.5 size-5 shrink-0 text-[#1e90ff]" />
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pl-8 text-sm leading-relaxed text-muted-foreground sm:text-base sm:pl-9">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
