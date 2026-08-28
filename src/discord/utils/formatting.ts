/**
 * Splits a long response into Discord-safe chunks (under 2000 characters).
 * Attempts to break cleanly at paragraphs or codeblock boundaries.
 */
export function splitDiscordMessage(text: string, maxLength: number = 1950): string[] {
  if (text.length <= maxLength) {
    return [text];
  }

  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= maxLength) {
      chunks.push(remaining);
      break;
    }

    // Try finding the last paragraph break within maxLength
    let splitIndex = remaining.lastIndexOf('\n\n', maxLength);

    // Fallback to line break
    if (splitIndex === -1 || splitIndex < maxLength * 0.5) {
      splitIndex = remaining.lastIndexOf('\n', maxLength);
    }

    // Fallback to space
    if (splitIndex === -1 || splitIndex < maxLength * 0.5) {
      splitIndex = remaining.lastIndexOf(' ', maxLength);
    }

    // Hard cut if no clean separator found
    if (splitIndex === -1) {
      splitIndex = maxLength;
    }

    const chunk = remaining.slice(0, splitIndex).trim();
    if (chunk.length > 0) {
      chunks.push(chunk);
    }
    remaining = remaining.slice(splitIndex).trim();
  }

  return chunks;
}
