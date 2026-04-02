/**
 * Mythos Theme Context — React context + provider for the new theme system.
 *
 * This wraps alongside the existing ThemeProvider (design-system) so both
 * old and new components can coexist during the migration.
 */
import React, { createContext, useContext, useMemo, useState } from 'react'
import type { MythosTheme, MythosThemeName } from './types.js'
import { getMythosTheme } from './themes.js'

interface MythosThemeContextValue {
  /** Current resolved theme */
  theme: MythosTheme
  /** Current theme name */
  themeName: MythosThemeName
  /** Change theme */
  setThemeName: (name: MythosThemeName) => void
  /** Whether dark mode is active */
  isDark: boolean
  /** Toggle dark/light mode */
  setIsDark: (dark: boolean) => void
}

const DEFAULT_THEME_NAME: MythosThemeName = 'opencode'

const MythosThemeContext = createContext<MythosThemeContextValue>({
  theme: getMythosTheme(DEFAULT_THEME_NAME),
  themeName: DEFAULT_THEME_NAME,
  setThemeName: () => {},
  isDark: true,
  setIsDark: () => {},
})

type Props = {
  initialTheme?: MythosThemeName
  initialDark?: boolean
  children: React.ReactNode
}

export function MythosThemeProvider({
  initialTheme = DEFAULT_THEME_NAME,
  initialDark,
  children,
}: Props): React.ReactNode {
  const [themeName, setThemeName] = useState<MythosThemeName>(initialTheme)
  const [isDark, setIsDark] = useState(initialDark ?? true)

  const theme = useMemo(
    () => getMythosTheme(themeName, isDark),
    [themeName, isDark],
  )

  const value = useMemo<MythosThemeContextValue>(
    () => ({ theme, themeName, setThemeName, isDark, setIsDark }),
    [theme, themeName, isDark],
  )

  return (
    <MythosThemeContext.Provider value={value}>
      {children}
    </MythosThemeContext.Provider>
  )
}

/**
 * Access the Mythos theme. Returns resolved colors + setters.
 */
export function useMythosTheme(): MythosThemeContextValue {
  return useContext(MythosThemeContext)
}
