"use client";
import Link from "next/link";
import NavMenu from "@/components/NavMenu";
import AccountBadge from "@/components/AccountBadge";
import IntroductionMessageButton from "@/components/IntroductionMessageButton";
import "./SiteHeader.css";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="site-header__title">
        My Words Matter
      </Link>
      <div className="site-header__buttons">
        <NavMenu />
        <AccountBadge />
      </div>
      <IntroductionMessageButton />
    </header>
  );
}
