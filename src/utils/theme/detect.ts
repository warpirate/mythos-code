/**
 * Terminal background color detection via OSC 11.
 *
 * Sends the OSC 11 escape sequence to query the terminal's background color,
 * parses the response, and classifies it as dark or light.
 *
 * Falls back to $COLORFGBG environment variable, then defaults to dark.
 */

/**
 * Classify an RGB color as dark or light using relative luminance.
 * Uses the sRGB luminance formula: L = 0.2126*R + 0.7152*G + 0.0722*B
 */
function isDarkColor(r: number, g: number, b: number): boolean {
  // Normalize to 0-1 range (input is 0-255)
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255

  // Linearize sRGB
  const rl = rn <= 0.03928 ? rn / 12.92 : ((rn + 0.055) / 1.055) ** 2.4
  const gl = gn <= 0.03928 ? gn / 12.92 : ((gn + 0.055) / 1.055) ** 2.4
  const bl = bn <= 0.03928 ? bn / 12.92 : ((bn + 0.055) / 1.055) ** 2.4

  const luminance = 0.2126 * rl + 0.7152 * gl + 0.0722 * bl
  return luminance < 0.5
}

/**
 * Try to detect dark/light mode from $COLORFGBG environment variable.
 * Format: "fg;bg" where bg is an ANSI color index (0-15).
 * Returns undefined if not available.
 */
function detectFromColorFgBg(): boolean | undefined {
  const value = process.env.COLORFGBG
  if (!value) return undefined

  const parts = value.split(';')
  const bg = parseInt(parts[parts.length - 1] ?? '', 10)
  if (isNaN(bg)) return undefined

  // Standard ANSI: 0-6 are dark, 7 is light gray, 8 is dark gray, 9-15 are bright
  // Heuristic: bg <= 6 or bg === 8 → dark
  return bg <= 6 || bg === 8
}

/**
 * Detect whether the terminal has a dark or light background.
 *
 * Priority:
 * 1. $COLORFGBG environment variable
 * 2. Default to dark
 *
 * Note: OSC 11 async detection is handled by the systemThemeWatcher.
 * This function provides a synchronous initial guess.
 */
export function detectTerminalDarkMode(): boolean {
  const fromEnv = detectFromColorFgBg()
  if (fromEnv !== undefined) return fromEnv

  // Default to dark mode
  return true
}
