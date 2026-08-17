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
  title: "Event Portal | Bangladesh Islami Chhatrashibir Chattogram City North",
  description:
    "Event Portal | Bangladesh Islami Chhatrashibir Chattogram City North",
  keywords: [
    "Event Portal",
    "Chhatrashibir",
    "Bangladesh",
    "Chattogram City North",
    "Registration",
  ],
  authors: [{ name: "Event Organizers" }],
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "Event Portal | Bangladesh Islami Chhatrashibir Chattogram City North",
    description: "Event Portal for Bangladesh Islami Chhatrashibir, Chattogram City North.",
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
        suppressHydrationWarning
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
