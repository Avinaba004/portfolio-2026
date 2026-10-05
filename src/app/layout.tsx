import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Unbounded } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/components/system/AppProvider";
import { Dock } from "@/components/system/Dock";
import { CommandPalette } from "@/components/system/CommandPalette";
import { StatusBar } from "@/components/system/StatusBar";
import { EasterEggs } from "@/components/system/EasterEggs";
import { BOOT_SCRIPT } from "@/lib/boot";
import { SmoothScroll } from "@/components/system/SmoothScroll";
import { SITE_URL } from "@/lib/site";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const display = Unbounded({ variable: "--font-display", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Avinaba Ghosh — Software Engineer · Full-Stack × AI × Cloud",
    template: "%s · Avinaba Ghosh",
  },
  description:
    "Software Engineer building full-stack enterprise systems, AI-powered workflows, cloud applications and real-world integrations. An interactive engineering system.",
  keywords: ["Avinaba Ghosh", "Software Engineer", "Full-Stack", "Forward Deployed Engineer", "Next.js", "Python", "GCP", "Gemini", "OAuth"],
  authors: [{ name: "Avinaba Ghosh" }],
  openGraph: {
    title: "Avinaba Ghosh — Building Systems",
    description: "Full-stack enterprise systems, AI workflows, cloud applications and integrations — as an interactive engineering OS.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f4f2ed",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${display.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <AppProvider>
          <SmoothScroll />
          <Dock />
          {children}
          <StatusBar />
          <CommandPalette />
          <EasterEggs />
        </AppProvider>
      </body>
    </html>
  );
}
