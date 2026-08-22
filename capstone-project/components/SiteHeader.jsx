"use client";
import Link from "next/link";
import IntroductionMessageButton from "@/components/IntroductionMessageButton";
import "./SiteHeader.css";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="site-header__title">
        My Words Matter
      </Link>
      <IntroductionMessageButton />
    </header>
  );
}