import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ParentModeProvider } from "@/context/ParentModeContext";
import { ThemeProvider } from "@/context/ThemeContext";
import NavMenu from "@/components/NavMenu";
import IntroductionMessageButton from "@/components/IntroductionMessageButton";
import SiteHeader from "@/components/SiteHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider>
          <ParentModeProvider>
            <SiteHeader />
            <NavMenu />
            {children}
            <IntroductionMessageButton />
          </ParentModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}