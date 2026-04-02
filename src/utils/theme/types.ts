/**
 * Mythos Theme System — types
 *
 * Follows the OpenCode theme format: each theme has `defs` (color palette)
 * and `theme` (semantic mapping with dark/light variants). A resolved
 * MythosTheme is a flat object with hex colors ready for rendering.
 */

/** Raw theme definition file format (matches OpenCode JSON schema) */
export interface ThemeDefinition {
  $schema?: string
  defs: Record<string, string>
  theme: Record<string, { dark: string; light: string }>
}

/** Resolved theme — all values are hex color strings */
export interface MythosTheme {
  name: string
  isDark: boolean

  // Core
  primary: string
  secondary: string
  accent: string

  // Semantic
  error: string
  warning: string
  success: string
  info: string

  // Text
  text: string
  textMuted: string

  // Backgrounds
  background: string
  backgroundPanel: string
  backgroundElement: string

  // Borders
  border: string
  borderActive: string
  borderSubtle: string

  // Diff
  diffAdded: string
  diffRemoved: string
  diffContext: string
  diffHunkHeader: string
  diffHighlightAdded: string
  diffHighlightRemoved: string
  diffAddedBg: string
  diffRemovedBg: string
  diffContextBg: string
  diffLineNumber: string
  diffAddedLineNumberBg: string
  diffRemovedLineNumberBg: string

  // Markdown
  markdownText: string
  markdownHeading: string
  markdownLink: string
  markdownLinkText: string
  markdownCode: string
  markdownBlockQuote: string
  markdownEmph: string
  markdownStrong: string
  markdownHorizontalRule: string
  markdownListItem: string
  markdownListEnumeration: string
  markdownImage: string
  markdownImageText: string
  markdownCodeBlock: string

  // Syntax highlighting
  syntaxComment: string
  syntaxKeyword: string
  syntaxFunction: string
  syntaxVariable: string
  syntaxString: string
  syntaxNumber: string
  syntaxType: string
  syntaxOperator: string
  syntaxPunctuation: string
}

export const MYTHOS_THEME_NAMES = [
  'opencode',
  'catppuccin-mocha',
  'catppuccin-latte',
  'dracula',
  'tokyonight',
  'gruvbox',
  'solarized',
  'nord',
] as const

export type MythosThemeName = (typeof MYTHOS_THEME_NAMES)[number]
