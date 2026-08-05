"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParentMode } from "@/context/ParentModeContext";
import { useTheme } from "@/context/ThemeContext";
import { createClient } from "@/lib/supabase/client";

export default function NavMenu() {
  const { mode, loading: modeLoading } = useParentMode();
  const { theme, toggleTheme, loading: themeLoading } = useTheme();
  const [open, setOpen] = useState(false);
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

  async function handleSignOut() {
    await supabase.auth.signOut();
    setOpen(false);
  }

  const isParent = mode === "parent";

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
        <div
          id="nav-menu-dropdown"
          ref={menuRef}
          className="nav-menu__dropdown"
          role="menu"
        >
          {/* Home / Categories navigation */}
          <div className="nav-menu__section" role="none">
            <Link href="/" role="menuitem" className="nav-menu__item" onClick={() => setOpen(false)}>
              Home
            </Link>
            <Link href="/" role="menuitem" className="nav-menu__item" onClick={() => setOpen(false)}>
              Categories
            </Link>
          </div>

          <hr className="nav-menu__divider" />

          {/* Account section */}
          <div className="nav-menu__section" role="none">
            {modeLoading ? null : isParent ? (
              <>
                <span className="nav-menu__section-label">Account</span>
                <Link href="/account" role="menuitem" className="nav-menu__item">
                  My Account
                </Link>
                <button
                  type="button"
                  role="menuitem"
                  className="nav-menu__item"
                  onClick={handleSignOut}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" role="menuitem" className="nav-menu__item">
                  Log In
                </Link>
                <Link href="/signup" role="menuitem" className="nav-menu__item">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <hr className="nav-menu__divider" />

          {/* Settings */}
          <div className="nav-menu__section" role="none">
            <Link href="/settings" role="menuitem" className="nav-menu__item">
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
            <Link href="/resources" role="menuitem" className="nav-menu__item">
              Resource Links
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}