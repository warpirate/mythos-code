/**
 * ThemeSelector — modal dialog for picking the visual theme.
 *
 * Shows available Mythos themes in a navigable list with live preview.
 */
import React, { useState } from 'react'
import { Box, Text, useInput } from '../../ink.js'
import { useMythosTheme } from '../../utils/theme/index.js'
import { MYTHOS_THEME_NAMES, type MythosThemeName } from '../../utils/theme/types.js'
import { getMythosTheme } from '../../utils/theme/themes.js'

type Props = {
  onClose: () => void
  width?: number
}

export function ThemeSelector({
  onClose,
  width = 40,
}: Props): React.ReactNode {
  const { theme, themeName, setThemeName, isDark } = useMythosTheme()
  const currentIdx = MYTHOS_THEME_NAMES.indexOf(themeName)
  const [selected, setSelected] = useState(Math.max(0, currentIdx))

  useInput((_input, key) => {
    if (key.escape) {
      onClose()
      return
    }
    if (key.return) {
      const name = MYTHOS_THEME_NAMES[selected]
      if (name) {
        setThemeName(name)
        onClose()
      }
      return
    }
    if (key.upArrow) {
      setSelected((s) => Math.max(0, s - 1))
      return
    }
    if (key.downArrow) {
      setSelected((s) => Math.min(MYTHOS_THEME_NAMES.length - 1, s + 1))
    }
  })

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={theme.primary}
      width={width}
      paddingX={1}
      borderText={{
        content: ' Themes ',
        position: 'top',
        align: 'start',
        offset: 1,
      }}
    >
      {MYTHOS_THEME_NAMES.map((name, i) => {
        const isSelected = i === selected
        const isCurrent = name === themeName
        const preview = getMythosTheme(name, isDark)
        return (
          <Box
            key={name}
            flexDirection="row"
            justifyContent="space-between"
            width="100%"
          >
            <Box flexDirection="row" gap={1}>
              <Text
                color={isSelected ? theme.primary : theme.text}
                bold={isSelected}
              >
                {isSelected ? '› ' : '  '}
                {name}
              </Text>
              {/* Color preview swatches */}
              <Text>
                <Text color={preview.primary}>●</Text>
                <Text color={preview.secondary}>●</Text>
                <Text color={preview.accent}>●</Text>
                <Text color={preview.success}>●</Text>
                <Text color={preview.error}>●</Text>
              </Text>
            </Box>
            {isCurrent && (
              <Text color={theme.success}>✓</Text>
            )}
          </Box>
        )
      })}

      <Text>{' '}</Text>
      <Text color={theme.textMuted}>  Enter to select · Esc to cancel</Text>
    </Box>
  )
}
