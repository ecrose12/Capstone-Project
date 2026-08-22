import type { Metadata, Viewport } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import { ParentModeProvider } from "@/context/ParentModeContext";
import { ThemeProvider } from "@/context/ThemeContext";
import NavMenu from "@/components/NavMenu";
import SiteHeader from "@/components/SiteHeader";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mywordsmatter.app"),
  title: "My Words Matter",
  description:
    "My Words Matter is a picture-based communication app that helps individuals express themselves through PEC cards, schedules, and more.",
  openGraph: {
    title: "My Words Matter",
    description:
      "A picture-based communication app that helps individuals express themselves through PEC cards, schedules, and more.",
    url: "https://mywordsmatter.app",
    siteName: "My Words Matter",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b5fb0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lexend.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider>
          <ParentModeProvider>
            <SiteHeader />
            <NavMenu />
            <main className="flex-1 w-full page-content">
              {children}
            </main>
            <ServiceWorkerRegister />
          </ParentModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}