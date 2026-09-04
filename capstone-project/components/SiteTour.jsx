"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { QUICK_TOUR_STEPS, FULL_TOUR_STEPS } from "@/lib/tourSteps";
import "./SiteTour.css";
import { useParentMode } from "@/context/ParentModeContext";

const SEEN_KEY = "mwm-tour-seen";
const PROGRESS_KEY = "mwm-tour-progress"; // sessionStorage: { type, index }

export default function SiteTour() {
  const pathname = usePathname();
  const router = useRouter();
  const { mode } = useParentMode();
  const isAuthed = mode === "parent";
  const [showChoice, setShowChoice] = useState(false);
  const driverRef = useRef(null);

  const getSteps = useCallback(
    (type) => {
      const steps = type === "full" ? FULL_TOUR_STEPS : QUICK_TOUR_STEPS;
      // Skip any step that needs a signed-in parent (like Account page
      // content) if the person taking the tour isn't actually logged in —
      // those pages redirect away otherwise, breaking the tour.
      return steps.filter((step) => !step.requiresAuth || isAuthed);
    },
    [isAuthed]
  );

  function finishTour() {
    sessionStorage.removeItem(PROGRESS_KEY);
    localStorage.setItem(SEEN_KEY, "1");
  }

  const startTour = useCallback(
    (type, startIndex = 0) => {
      const steps = getSteps(type);

      // Collect this page's consecutive steps starting at startIndex.
      const pageSteps = [];
      let i = startIndex;
      while (i < steps.length && steps[i].path === pathname) {
        pageSteps.push(steps[i]);
        i++;
      }
      const nextPagePath = i < steps.length ? steps[i].path : null;
      const isLastOverall = i >= steps.length;

      if (pageSteps.length === 0) {
        // Nothing for this tour on the current page — skip straight to
        // wherever the next step actually is, or finish if there isn't one.
        if (nextPagePath) {
          sessionStorage.setItem(PROGRESS_KEY, JSON.stringify({ type, index: i }));
          router.push(nextPagePath);
        } else {
          finishTour();
        }
        return;
      }

      let d;
      const driverSteps = pageSteps.map((step, idx) => {
        const isLastOnPage = idx === pageSteps.length - 1;
        const popover = {
          title: step.popover.title,
          description: step.popover.description,
        };

        if (isLastOnPage && nextPagePath) {
          popover.nextBtnText = "Next →";
          popover.onNextClick = () => {
            sessionStorage.setItem(PROGRESS_KEY, JSON.stringify({ type, index: i }));
            d.destroy();
            router.push(nextPagePath);
          };
        }
        if (isLastOnPage && isLastOverall) {
          popover.doneBtnText = "Finish!";
        }

        return { element: step.element, popover };
      });

            d = driver({
        showProgress: true,
        allowClose: true,
        onCloseClick: () => {
          d.destroy();
          finishTour();
        },
        onDoneClick: () => {
          d.destroy();
          finishTour();
        },
        onDestroyed: () => {
          driverRef.current = null;
        },
        steps: driverSteps,
      });

      driverRef.current = d;
      d.drive();
    },
    [pathname, router, getSteps]
  );

  // Resume an in-progress tour after navigating to a new page.
  useEffect(() => {
    const raw = sessionStorage.getItem(PROGRESS_KEY);
    if (!raw) return;
    try {
      const { type, index } = JSON.parse(raw);
      const timer = setTimeout(() => startTour(type, index), 300);
      return () => clearTimeout(timer);
    } catch {
      sessionStorage.removeItem(PROGRESS_KEY);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Auto-prompt once, on the home page, if never seen before.
  useEffect(() => {
    if (pathname !== "/") return;
    if (localStorage.getItem(SEEN_KEY)) return;
    if (sessionStorage.getItem(PROGRESS_KEY)) return;
    const timer = setTimeout(() => setShowChoice(true), 800);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Lets other components (the nav menu's "Take a Tour" link) reopen
  // the choice prompt on demand.
  useEffect(() => {
    function handleOpenRequest() {
      setShowChoice(true);
    }
    window.addEventListener("mwm-open-tour", handleOpenRequest);
    return () => window.removeEventListener("mwm-open-tour", handleOpenRequest);
  }, []);

  function handleChoice(type) {
    setShowChoice(false);
    sessionStorage.setItem(PROGRESS_KEY, JSON.stringify({ type, index: 0 }));
    startTour(type, 0);
  }

  function handleSkip() {
    setShowChoice(false);
    finishTour();
  }

  if (!showChoice) return null;

  return (
    <div className="site-tour-choice" role="dialog" aria-modal="true" aria-label="Take a tour">
      <div className="site-tour-choice__card">
        <h2>Take a Tour?</h2>
        <p>See how My Words Matter works — pick whichever fits your time:</p>
        <button type="button" onClick={() => handleChoice("quick")} className="site-tour-choice__option">
          Quick Tour
          <span>A few key features, fast</span>
        </button>
        <button type="button" onClick={() => handleChoice("full")} className="site-tour-choice__option">
          Full Tour
          <span>Everything the app can do</span>
        </button>
        <button type="button" onClick={handleSkip} className="site-tour-choice__skip">
          Skip for now
        </button>
      </div>
    </div>
  );
}