"use client";
import { useParams, notFound } from "next/navigation";
import { getCategory } from "@/lib/categories";
import DualBoxTemplate from "@/components/templates/DualBoxTemplate";
import TodayScheduleTemplate from "@/components/templates/TodayScheduleTemplate";
import GridTemplate from "@/components/templates/GridTemplate";
import SingleSelectorTemplate from "@/components/templates/SingleSelectorTemplate";
import SentenceCreatorTemplate from "@/components/templates/SentenceCreatorTemplate";
import WeeklyChoreListTemplate from "@/components/templates/WeeklyChoreListTemplate";
// Not built yet — placeholder below renders a friendly "coming soon" message
// instead of crashing until this exists.
// import EmergencyCardTemplate from "@/components/templates/EmergencyCardTemplate";

export default function CategoryPage() {
  const params = useParams();
  const category = getCategory(params.id);

  if (!category) {
    notFound();
  }

  switch (category.template) {
    case "dual-box":
      return <DualBoxTemplate category={category} />;

    case "schedule":
      return <TodayScheduleTemplate category={category} />;

    case "grid":
      return <GridTemplate category={category} />;

    case "single-select":
      return <SingleSelectorTemplate category={category} />;

    case "sentence-creator":
      return <SentenceCreatorTemplate category={category} />;

    case "weekly-chore":
      return <WeeklyChoreListTemplate category={category} />;

    case "emergency":
      return <ComingSoon category={category} />;

    default:
      return <ComingSoon category={category} />;
  }
}

function ComingSoon({ category }) {
  return (
    <main className="category-coming-soon">
      <h1>{category.name}</h1>
      <p>This category's page is still being built. Check back soon.</p>
    </main>
  );
}