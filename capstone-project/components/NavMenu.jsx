"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParentMode } from "@/context/ParentModeContext";
import { useTheme } from "@/context/ThemeContext";
import { createClient } from "@/lib/supabase/client";
import "./NavMenu.css";

function BulbIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M12 2a7 7 0 0 0-4 12.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26A7 7 0 0 0 12 2zm-2 17h4v1a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1z" />
    </svg>
  );
}

export default function NavMenu() {
  const { mode, familyType, loading: modeLoading } = useParentMode();
  const { theme, toggleTheme, loading: themeLoading } = useTheme();
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const supabase = createClient();

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

  useEffect(() => {
    if (!open) {
      setAccountOpen(false);
      setAboutOpen(false);
    }
  }, [open]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setOpen(false);
  }

  const isParent = mode === "parent";
  const isFamilyAccount = familyType === "family";
  const isSchoolAccount = familyType === "school";

  const signOutLabel = isSchoolAccount
    ? "Exit Teacher Mode"
    : isFamilyAccount
    ? "Exit Parent/Caregiver Mode"
    : "Sign Out";

  return (
    <nav className="nav-menu">
      <div className="nav-menu__buttons">
                <button
          id="tour-nav-trigger"
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

                <button
          id="tour-theme-toggle"
          type="button"
          className={`nav-menu__theme-toggle nav-menu__theme-toggle--${theme}`}
          onClick={toggleTheme}
          disabled={themeLoading}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          <BulbIcon />
        </button>
      </div>

      {open && (
        <div id="nav-menu-dropdown" ref={menuRef} className="nav-menu__dropdown" role="menu">
                   <div className="nav-menu__section" role="none">
            <Link href="/" role="menuitem" className="nav-menu__item" onClick={() => setOpen(false)}>
              Home
            </Link>
          </div>

          <hr className="nav-menu__divider" />

          <div className="nav-menu__section" role="none">
            <button
              type="button"
              role="menuitem"
              className="nav-menu__item"
              onClick={() => {
                setOpen(false);
                window.dispatchEvent(new Event("mwm-open-tour"));
              }}
            >
              Take a Tour
            </button>
          </div>

          <hr className="nav-menu__divider" />

          <div className="nav-menu__section" role="none">
                        <button
              id="tour-nav-about-toggle"
              type="button"
              className="nav-menu__item nav-menu__account-toggle"
              aria-expanded={aboutOpen}
              aria-controls="nav-menu-about-submenu"
              onClick={() => setAboutOpen((prev) => !prev)}
            >
              About
              <span className="nav-menu__account-caret" aria-hidden="true">
                {aboutOpen ? "▲" : "▼"}
              </span>
            </button>

            {aboutOpen && (
              <div id="nav-menu-about-submenu" className="nav-menu__submenu" role="none">
                                <Link
                  id="tour-about-page"
                  href="/about"
                  role="menuitem"
                  className="nav-menu__item nav-menu__subitem"
                  onClick={() => setOpen(false)}
                >
                  About My Words Matter
                </Link>
                <Link
                  id="tour-about-team"
                  href="/team"
                  role="menuitem"
                  className="nav-menu__item nav-menu__subitem"
                  onClick={() => setOpen(false)}
                >
                  Meet the Creators
                </Link>
                <Link
                  id="tour-about-coming-soon"
                  href="/coming-soon"
                  role="menuitem"
                  className="nav-menu__item nav-menu__subitem"
                  onClick={() => setOpen(false)}
                >
                  Coming Soon
                </Link>
              </div>
            )}
          </div>

          <hr className="nav-menu__divider" />

          <div className="nav-menu__section" role="none">
            <Link href="/resources" role="menuitem" className="nav-menu__item" onClick={() => setOpen(false)}>
              Resource Links
            </Link>
          </div>

          <hr className="nav-menu__divider" />

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
                          {signOutLabel}
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

          <div className="nav-menu__section" role="none">
            <Link href="/settings" role="menuitem" className="nav-menu__item" onClick={() => setOpen(false)}>
              Settings
            </Link>
          </div>

          <hr className="nav-menu__divider" />

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