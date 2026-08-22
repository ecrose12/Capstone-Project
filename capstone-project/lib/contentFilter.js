const BLOCKED_WORDS = [
  "sex", "sexual", "porn", "pornographic", "nude", "nudity", "naked",
  "penis", "vagina", "breast", "genital", "orgasm", "masturbat",
  "fuck", "shit", "bitch", "damn", "ass", "asshole", "bastard", "crap",
  "cock", "dick", "pussy", "whore", "slut", "cunt", "piss",
  "kill", "murder", "suicide", "rape", "molest", "assault", "stab",
  "shoot", "shooting", "gun", "firearm", "rifle", "pistol", "ammo",
  "ammunition", "bullet", "knife", "sword", "weapon", "bomb", "explosive",
  "grenade", "terrorist", "terrorism", "massacre", "genocide", "corpse",
  "gore", "blood", "decapitat",
  "cutting", "overdose", "self-harm", "selfharm",
  "drug", "cocaine", "heroin", "meth", "methamphetamine", "weed",
  "marijuana", "cannabis", "opioid", "fentanyl", "vape", "vaping",
  "cigarette", "tobacco", "alcohol", "beer", "wine", "vodka", "whiskey",
  "drunk", "intoxicat",
  "gambling", "casino", "poker", "lottery",
  "nazi", "hitler", "kkk", "supremacist", "extremist", "racist", "slur",
  "ghost", "zombie", "demon", "devil", "satan", "occult", "horror",
  "haunted", "possessed", "exorcis",
];

const BLOCKED_PHRASES = [
  "hit by", "hit with", "hurt by", "hurt with",
  "abuse", "abused", "cruelty", "cruel to",
  "beaten", "beat with", "beat by",
  "kicked by", "kicked with", "punched", "slapped",
  "tortur", "attacked by", "stabbed by",
  "self harm", "harm to self",
  "sharp object", "in mouth", "pushing eye", "poke eye", "poking eye",
  "eye object", "throwing stick", "throw stick", "stick at animal",
  "swallow", "choking hazard",
];

const BLOCKED_WORDS_PATTERN = new RegExp(
  `\\b(${BLOCKED_WORDS.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`,
  "i"
);

export function isChildSafeText(text) {
  if (!text) return true;
  const lower = text.toLowerCase();
  if (BLOCKED_WORDS_PATTERN.test(text)) return false;
  if (BLOCKED_PHRASES.some((phrase) => lower.includes(phrase))) return false;
  return true;
}

export function filterChildSafeSymbols(symbols) {
  return symbols.filter((s) => isChildSafeText(s.name));
}