"use client";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { useParentMode } from "@/context/ParentModeContext";
import CategoryIcon from "@/components/CategoryIcon";
import "./home-page.css";

export default function HomePage() {
  const { mode, familyType, loading } = useParentMode();
  if (loading) return null;

  const isFamilyAccount = familyType === "family";

  return (
    <main className="home-page">
      <h1 className="home-page__title">Choose a Category</h1>

      <div className="home-page__grid" role="list">
        {CATEGORIES.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.id}`}
            role="listitem"
            className="home-page__category-button"
            aria-label={category.name}
          >
            <span className="home-page__category-icon">
              <CategoryIcon id={category.id} />
            </span>
            <span className="home-page__category-name">{category.name}</span>
          </Link>
        ))}
      </div>

      {mode === "parent" && (
        <p className="home-page__mode-notice" role="status">
          {isFamilyAccount ? "Parent/Caregiver Mode is active." : "You're signed in."}
        </p>
      )}
    </main>
  );
}