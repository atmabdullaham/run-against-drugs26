import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/site/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Run Against Drugs | Registration",
  description:
    "Register for Run Against Drugs 2025 — a marathon for a drug-free Bangladesh. Organized by Bangladesh Islami Chhatrashibir.",
  keywords: [
    "Run Against Drugs",
    "Marathon",
    "Bangladesh",
    "Youth Against Drugs",
    "Registration",
  ],
  authors: [{ name: "Event Organizers" }],
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "Run Against Drugs 2025",
    description: "A marathon for a drug-free Bangladesh. Register now!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
