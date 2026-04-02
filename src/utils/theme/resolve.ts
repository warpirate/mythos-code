/**
 * Resolves an OpenCode-format ThemeDefinition into a flat MythosTheme.
 */
import type { MythosTheme, ThemeDefinition } from './types.js'

/**
 * Resolve a single color reference. If the value is a key in `defs`, return
 * the def's hex value. Otherwise treat it as a literal hex color.
 */
function resolveColor(value: string, defs: Record<string, string>): string {
  return defs[value] ?? value
}

/**
 * Resolve a full ThemeDefinition into a MythosTheme for the given mode.
 */
export function resolveTheme(
  name: string,
  def: ThemeDefinition,
  isDark: boolean,
): MythosTheme {
  const mode = isDark ? 'dark' : 'light'
  const resolved: Record<string, string> = {}

  for (const [key, variants] of Object.entries(def.theme)) {
    resolved[key] = resolveColor(variants[mode], def.defs)
  }

  return {
    name,
    isDark,
    // Core
    primary: resolved.primary!,
    secondary: resolved.secondary!,
    accent: resolved.accent!,
    // Semantic
    error: resolved.error!,
    warning: resolved.warning!,
    success: resolved.success!,
    info: resolved.info!,
    // Text
    text: resolved.text!,
    textMuted: resolved.textMuted!,
    // Backgrounds
    background: resolved.background!,
    backgroundPanel: resolved.backgroundPanel!,
    backgroundElement: resolved.backgroundElement!,
    // Borders
    border: resolved.border!,
    borderActive: resolved.borderActive!,
    borderSubtle: resolved.borderSubtle!,
    // Diff
    diffAdded: resolved.diffAdded!,
    diffRemoved: resolved.diffRemoved!,
    diffContext: resolved.diffContext!,
    diffHunkHeader: resolved.diffHunkHeader!,
    diffHighlightAdded: resolved.diffHighlightAdded!,
    diffHighlightRemoved: resolved.diffHighlightRemoved!,
    diffAddedBg: resolved.diffAddedBg!,
    diffRemovedBg: resolved.diffRemovedBg!,
    diffContextBg: resolved.diffContextBg!,
    diffLineNumber: resolved.diffLineNumber!,
    diffAddedLineNumberBg: resolved.diffAddedLineNumberBg!,
    diffRemovedLineNumberBg: resolved.diffRemovedLineNumberBg!,
    // Markdown
    markdownText: resolved.markdownText!,
    markdownHeading: resolved.markdownHeading!,
    markdownLink: resolved.markdownLink!,
    markdownLinkText: resolved.markdownLinkText!,
    markdownCode: resolved.markdownCode!,
    markdownBlockQuote: resolved.markdownBlockQuote!,
    markdownEmph: resolved.markdownEmph!,
    markdownStrong: resolved.markdownStrong!,
    markdownHorizontalRule: resolved.markdownHorizontalRule!,
    markdownListItem: resolved.markdownListItem!,
    markdownListEnumeration: resolved.markdownListEnumeration!,
    markdownImage: resolved.markdownImage!,
    markdownImageText: resolved.markdownImageText!,
    markdownCodeBlock: resolved.markdownCodeBlock!,
    // Syntax
    syntaxComment: resolved.syntaxComment!,
    syntaxKeyword: resolved.syntaxKeyword!,
    syntaxFunction: resolved.syntaxFunction!,
    syntaxVariable: resolved.syntaxVariable!,
    syntaxString: resolved.syntaxString!,
    syntaxNumber: resolved.syntaxNumber!,
    syntaxType: resolved.syntaxType!,
    syntaxOperator: resolved.syntaxOperator!,
    syntaxPunctuation: resolved.syntaxPunctuation!,
  }
}
