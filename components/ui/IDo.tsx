/**
 * Sets every "I do" in a line of text apart — gold script on a soft
 * candle-yellow swipe (`.i-do` in globals.css). Other text is left as is.
 *
 *   withIDo("On our tenth year together, we say I do.")
 */
export function withIDo(text: string): React.ReactNode {
  const parts = text.split(/\b(I do)\b/);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="i-do">
        {part}
      </span>
    ) : (
      part
    ),
  );
}
