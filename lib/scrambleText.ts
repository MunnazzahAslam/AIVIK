export const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

// One frame of a character-by-character reveal: characters before `revealedCount`
// show their final value, characters in `skipChars` (spaces, punctuation) always
// pass through, everything else gets a random character from SCRAMBLE_CHARS.
export function scrambleFrame(
  text: string,
  revealedCount: number,
  skipChars: string
): string {
  return text
    .split("")
    .map((char, index) => {
      if (skipChars.includes(char)) return char;
      if (index < revealedCount) return char;
      return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
    })
    .join("");
}
