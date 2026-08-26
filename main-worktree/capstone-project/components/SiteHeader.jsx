"use client";
import Link from "next/link";
import NavMenu from "@/components/NavMenu";
import AccountBadge from "@/components/AccountBadge";
import IntroductionMessageButton from "@/components/IntroductionMessageButton";
import "./SiteHeader.css";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__row">
        <NavMenu />
        <Link href="/" className="site-header__title">
          My Words Matter
        </Link>
        <AccountBadge />
      </div>
      <IntroductionMessageButton />
    </header>
  );
}
