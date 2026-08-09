"use client";

const STROKE = 4;

function IconWrapper({ children, accent }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width="40"
      height="40"
      fill="none"
      stroke={accent || "currentColor"}
      strokeWidth={STROKE}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function SinglePecIcon() {
  return (
    <IconWrapper>
      <rect x="12" y="12" width="40" height="40" rx="6" />
      <line x1="32" y1="24" x2="32" y2="40" />
      <line x1="24" y1="32" x2="40" y2="32" />
    </IconWrapper>
  );
}

function SentenceCreatorIcon() {
  return (
    <IconWrapper>
      <rect x="6" y="22" width="14" height="14" rx="3" />
      <rect x="25" y="22" width="14" height="14" rx="3" />
      <rect x="44" y="22" width="14" height="14" rx="3" />
      <line x1="20" y1="29" x2="25" y2="29" />
      <line x1="39" y1="29" x2="44" y2="29" />
    </IconWrapper>
  );
}

function EmergencyIcon() {
  return (
    <IconWrapper accent="var(--color-error, currentColor)">
      <path d="M32 8 L58 54 L6 54 Z" strokeLinejoin="round" />
      <line x1="32" y1="24" x2="32" y2="38" />
      <circle cx="32" cy="46" r="1.5" fill="var(--color-error, currentColor)" stroke="none" />
    </IconWrapper>
  );
}

function TodaysScheduleIcon() {
  return (
    <IconWrapper>
      <circle cx="32" cy="32" r="22" />
      <line x1="32" y1="32" x2="32" y2="19" />
      <line x1="32" y1="32" x2="42" y2="36" />
    </IconWrapper>
  );
}

function DailyChecklistIcon() {
  return (
    <IconWrapper>
      <rect x="8" y="8" width="48" height="48" rx="6" />
      <rect x="16" y="18" width="7" height="7" rx="1.5" />
      <line x1="27" y1="21.5" x2="48" y2="21.5" />
      <path d="M16.5 33 L19 35.5 L23.5 30" />
      <line x1="27" y1="33" x2="48" y2="33" />
      <rect x="16" y="42" width="7" height="7" rx="1.5" />
      <line x1="27" y1="45.5" x2="48" y2="45.5" />
    </IconWrapper>
  );
}

function ChoreListIcon() {
  return (
    <IconWrapper>
      <rect x="12" y="10" width="40" height="46" rx="5" />
      <rect x="24" y="6" width="16" height="8" rx="2" />
      <line x1="20" y1="26" x2="44" y2="26" />
      <line x1="20" y1="36" x2="44" y2="36" />
      <line x1="20" y1="46" x2="38" y2="46" />
    </IconWrapper>
  );
}

function WeeklyChoreIcon() {
  return (
    <IconWrapper>
      <rect x="8" y="12" width="48" height="42" rx="5" />
      <line x1="8" y1="24" x2="56" y2="24" />
      <line x1="21" y1="12" x2="21" y2="54" />
      <line x1="34" y1="12" x2="34" y2="54" />
      <line x1="47" y1="12" x2="47" y2="54" />
      <line x1="18" y1="6" x2="18" y2="16" />
      <line x1="46" y1="6" x2="46" y2="16" />
    </IconWrapper>
  );
}

function FirstThenIcon() {
  return (
    <IconWrapper>
      <rect x="6" y="20" width="20" height="20" rx="4" />
      <rect x="38" y="20" width="20" height="20" rx="4" />
      <line x1="28" y1="30" x2="36" y2="30" />
      <path d="M33 26 L38 30 L33 34" strokeLinejoin="round" />
    </IconWrapper>
  );
}

function ConsequenceRewardIcon() {
  return (
    <IconWrapper>
      <rect x="6" y="20" width="20" height="20" rx="4" />
      <rect x="38" y="20" width="20" height="20" rx="4" />
      <line x1="28" y1="30" x2="36" y2="30" />
      <path d="M33 26 L38 30 L33 34" strokeLinejoin="round" />
      <path
        d="M48 25 L49.4 28.2 L53 28.6 L50.3 31 L51.1 34.6 L48 32.8 L44.9 34.6 L45.7 31 L43 28.6 L46.6 28.2 Z"
        strokeLinejoin="round"
      />
    </IconWrapper>
  );
}

const ICONS = {
  "single-pec-selector": SinglePecIcon,
  "sentence-creator": SentenceCreatorIcon,
  "emergency-cards": EmergencyIcon,
  "todays-schedule": TodaysScheduleIcon,
  "daily-schedule": DailyChecklistIcon,
  "chore-list": ChoreListIcon,
  "weekly-chore-list": WeeklyChoreIcon,
  "first-then": FirstThenIcon,
  "consequence-reward": ConsequenceRewardIcon,
};

export default function CategoryIcon({ id }) {
  const IconComponent = ICONS[id] || SinglePecIcon;
  return <IconComponent />;
}