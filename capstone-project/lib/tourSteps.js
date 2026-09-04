// Each step names the page it belongs to (`path`) and a CSS selector
// (`element`) for the real DOM element to highlight. The tour engine
// walks these in order, automatically navigating to a new page whenever
// consecutive steps' paths differ.

export const QUICK_TOUR_STEPS = [
  {
    path: "/",
    element: "#tour-nav-trigger",
    popover: {
      title: "Main Menu",
      description:
        "Tap here anytime to find Settings, your Account, Resource Links, and more.",
    },
  },
  {
    path: "/",
    element: "#tour-theme-toggle",
    popover: {
      title: "Light / Dark Mode",
      description: "Tap the light bulb to switch between light and dark themes.",
    },
  },
  {
    path: "/",
    element: "#tour-account-badge",
    popover: {
      title: "Your Account",
      description:
        "Shows whether you're signed in, and as what type of account. Tap it to go to Settings.",
    },
  },
  {
    path: "/",
    element: "#tour-intro-button",
    popover: {
      title: "Introduce Myself",
      description:
        "Tap this to speak a short introduction out loud — great for meeting someone new.",
    },
  },
  {
    path: "/",
    element: "#tour-category-grid",
    popover: {
      title: "Choose a Category",
      description:
        "Every communication tool lives here — schedules, emergency cards, sentence building, and more. Tap any card to open it.",
    },
  },
];

export const FULL_TOUR_STEPS = [
  ...QUICK_TOUR_STEPS,
  {
    path: "/settings",
    element: "#tour-settings-appearance",
    popover: {
      title: "Appearance",
      description: "Switch between light and dark mode here too, if you prefer.",
    },
  },
  {
    path: "/settings",
    element: "#tour-settings-tts",
    popover: {
      title: "Text-to-Speech Language",
      description: "Choose which language and accent is used when the app speaks out loud.",
    },
  },
  {
    path: "/settings",
    element: "#tour-settings-search-style",
    popover: {
      title: "PEC Card Search Style",
      description:
        "Choose whether picture cards are found by typing a search, or by browsing categories.",
    },
  },
  {
    path: "/settings",
    element: "#tour-settings-device-pairing",
    popover: {
      title: "Device Pairing",
      description:
        "Parents and teachers can generate a code here to link a child's or student's device — no email or login needed for them.",
    },
  },
  {
    path: "/account",
    element: "#tour-account-signed-in",
    requiresAuth: true,
    popover: {
      title: "My Account",
      description: "See which email you're signed in with, and sign out from here.",
    },
  },
  {
    path: "/account",
    element: "#tour-account-devices",
    requiresAuth: true,
    popover: {
      title: "Paired Devices & Saved Data",
      description:
        "See every device paired to your account, and exactly which saved schedules or cards belong to each one.",
    },
  },
];