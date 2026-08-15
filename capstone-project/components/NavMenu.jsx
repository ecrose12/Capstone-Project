"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParentMode } from "@/context/ParentModeContext";
import { useTheme } from "@/context/ThemeContext";
import { createClient } from "@/lib/supabase/client";
import "./NavMenu.css";

export default function NavMenu() {
  const { mode, familyType, loading: modeLoading } = useParentMode();
  const { theme, toggleTheme, loading: themeLoading } = useTheme();
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const supabase = createClient();

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Close on Escape, return focus to the trigger button
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Collapse the Account submenu whenever the whole menu closes, so it
  // doesn't reopen already-expanded next time.
  useEffect(() => {
    if (!open) setAccountOpen(false);
  }, [open]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setOpen(false);
  }

  const isParent = mode === "parent";
  const isFamilyAccount = familyType === "family";

  return (
    <nav className="nav-menu">
      <button
        ref={buttonRef}
        type="button"
        className="nav-menu__trigger"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="nav-menu-dropdown"
        aria-label="Menu"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span aria-hidden="true">☰</span>
      </button>

      {open && (
        <div id="nav-menu-dropdown" ref={menuRef} className="nav-menu__dropdown" role="menu">
          {/* Home navigation */}
          <div className="nav-menu__section" role="none">
            <Link href="/" role="menuitem" className="nav-menu__item" onClick={() => setOpen(false)}>
              Home
            </Link>
          </div>

          <hr className="nav-menu__divider" />

          {/* Account section — collapsed submenu */}
          <div className="nav-menu__section" role="none">
            {!modeLoading && (
              <>
                <button
                  type="button"
                  className="nav-menu__item nav-menu__account-toggle"
                  aria-expanded={accountOpen}
                  aria-controls="nav-menu-account-submenu"
                  onClick={() => setAccountOpen((prev) => !prev)}
                >
                  Account
                  <span className="nav-menu__account-caret" aria-hidden="true">
                    {accountOpen ? "▲" : "▼"}
                  </span>
                </button>

                {accountOpen && (
                  <div id="nav-menu-account-submenu" className="nav-menu__submenu" role="none">
                    {isParent ? (
                      <>
                        <Link
                          href="/account"
                          role="menuitem"
                          className="nav-menu__item nav-menu__subitem"
                          onClick={() => setOpen(false)}
                        >
                          My Account
                        </Link>
                        <button
                          type="button"
                          role="menuitem"
                          className="nav-menu__item nav-menu__subitem"
                          onClick={handleSignOut}
                        >
                          {isFamilyAccount ? "Exit Parent/Caregiver Mode" : "Sign Out"}
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          role="menuitem"
                          className="nav-menu__item nav-menu__subitem"
                          onClick={() => setOpen(false)}
                        >
                          Log In
                        </Link>
                        <Link
                          href="/signup"
                          role="menuitem"
                          className="nav-menu__item nav-menu__subitem"
                          onClick={() => setOpen(false)}
                        >
                          Sign Up
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          <hr className="nav-menu__divider" />

          {/* Settings */}
          <div className="nav-menu__section" role="none">
            <Link href="/settings" role="menuitem" className="nav-menu__item" onClick={() => setOpen(false)}>
              Settings
            </Link>
          </div>

          <hr className="nav-menu__divider" />

          {/* Light/Dark toggle */}
          <div className="nav-menu__section" role="none">
            <button
              type="button"
              role="menuitemcheckbox"
              aria-checked={theme === "dark"}
              className="nav-menu__item nav-menu__toggle"
              onClick={toggleTheme}
              disabled={themeLoading}
            >
              {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </button>
          </div>

          <hr className="nav-menu__divider" />

          {/* Resources */}
          <div className="nav-menu__section" role="none">
            <Link href="/resources" role="menuitem" className="nav-menu__item" onClick={() => setOpen(false)}>
              Resource Links
            </Link>
          </div>

          <hr className="nav-menu__divider" />

          {/* Support */}
          <div className="nav-menu__section" role="none">
            <Link href="/support" role="menuitem" className="nav-menu__item" onClick={() => setOpen(false)}>
              Contact Support
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}