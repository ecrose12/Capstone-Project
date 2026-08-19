// A second, independent layer of content filtering for Child Mode —
// applied on top of (not instead of) OpenSymbols' own `safe` parameter.
// This protects against the third-party API's own filtering being
// incomplete, especially important for browse-by-category results,
// which are broader and less predictable than a specific typed search.
//
// This list intentionally covers common profanity/explicit-content
// terms at a moderate level of coverage — extend it as needed. Matching
// is whole-word and case-insensitive to reduce false positives on
// unrelated words that merely contain a blocked substring.
const BLOCKED_TERMS = [
  "sex", "sexual", "porn", "nude", "naked", "penis", "vagina", "breast",
  "fuck", "shit", "bitch", "damn", "ass", "asshole", "bastard", "crap",
  "cock", "dick", "pussy", "whore", "slut", "cunt",
  "kill", "murder", "suicide", "rape", "molest",
  "drug", "cocaine", "heroin", "meth", "weed", "marijuana",
  "gun", "weapon", "bomb", "terrorist",
  "nazi", "hitler",
];

const BLOCKED_PATTERN = new RegExp(
  `\\b(${BLOCKED_TERMS.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`,
  "i"
);

// Returns true if the given text is safe to show to a child. Checks
// against the blocklist above; callers combine this with OpenSymbols'
// own `safe` flag for two independent layers of filtering.
export function isChildSafeText(text) {
  if (!text) return true;
  return !BLOCKED_PATTERN.test(text);
}

// Filters an array of symbol objects (each with a `name`), keeping only
// those that pass the child-safety check.
export function filterChildSafeSymbols(symbols) {
  return symbols.filter((s) => isChildSafeText(s.name));
}