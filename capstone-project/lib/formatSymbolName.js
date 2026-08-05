// OpenSymbols' underlying library sometimes stores names in ways that read
// oddly out loud or in a UI label:
//   - Entries in "core word(s), phrase" order (e.g. "feed dog, to",
//     "toilet, go to the") so they alphabetize by the core word instead
//     of the full phrase. Swapping the comma-separated halves back into
//     natural reading order fixes this generally, rather than hunting
//     down every specific phrase one at a time.
//   - Trailing variant numbers to disambiguate multiple versions of the
//     same symbol (e.g. "trampoline 1", "trampoline 2").
// This cleans both up before the name is ever shown or spoken.
export function cleanSymbolName(rawName) {
  if (!rawName) return rawName;

  let name = rawName.trim();

  if (name.includes(",")) {
    const parts = name
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    if (parts.length === 2) {
      // "toilet, go to the" -> "go to the toilet"
      name = `${parts[1]} ${parts[0]}`;
    } else {
      // Unexpected multi-comma name — safest fallback is just dropping
      // the commas rather than guessing at reordering.
      name = parts.join(" ");
    }
  }

  // "trampoline 1" -> "trampoline"
  name = name.replace(/\s+\d+$/, "");

  // Collapse any double spaces left over from the swap above
  name = name.replace(/\s{2,}/g, " ").trim();

  return name;
}