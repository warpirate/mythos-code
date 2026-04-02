/**
 * CommandPalette — ctrl+k overlay with fuzzy search.
 *
 * Centered modal dialog listing available commands with keybind hints.
 * Typing filters the list. Enter executes, Escape closes.
 *
 * ┌─ Commands ──────────────────────────────────┐
 * │ > search...                                 │
 * │                                             │
 * │   New Session              ctrl+x n         │
 * │   Session List             ctrl+x s         │
 * │   Switch Model             ctrl+x m         │
 * │   Toggle Sidebar           ctrl+x b         │
 * │   Export Session            —                │
 * │   Toggle Theme              —                │
 * └─────────────────────────────────────────────┘
 */
import React, { useMemo, useState } from 'react'
import { Box, Text, useInput } from '../../ink.js'
import { useMythosTheme } from '../../utils/theme/index.js'

export type PaletteCommand = {
  name: string
  description?: string
  shortcut?: string
  action: () => void
}

type Props = {
  commands: PaletteCommand[]
  onClose: () => void
  width?: number
}

export function CommandPalette({
  commands,
  onClose,
  width = 50,
}: Props): React.ReactNode {
  const { theme } = useMythosTheme()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)

  const filtered = useMemo(() => {
    if (!query) return commands
    const lower = query.toLowerCase()
    return commands.filter(
      (cmd) =>
        cmd.name.toLowerCase().includes(lower) ||
        cmd.description?.toLowerCase().includes(lower),
    )
  }, [commands, query])

  useInput((input, key) => {
    if (key.escape) {
      onClose()
      return
    }
    if (key.return) {
      const cmd = filtered[selected]
      if (cmd) {
        cmd.action()
        onClose()
      }
      return
    }
    if (key.upArrow) {
      setSelected((s) => Math.max(0, s - 1))
      return
    }
    if (key.downArrow) {
      setSelected((s) => Math.min(filtered.length - 1, s + 1))
      return
    }
    if (key.backspace || key.delete) {
      setQuery((q) => q.slice(0, -1))
      setSelected(0)
      return
    }
    if (input && !key.ctrl && !key.meta) {
      setQuery((q) => q + input)
      setSelected(0)
    }
  })

  const maxVisible = 10

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={theme.primary}
      width={width}
      paddingX={1}
      paddingY={0}
      borderText={{
        content: ' Commands ',
        position: 'top',
        align: 'start',
        offset: 1,
      }}
    >
      {/* Search input */}
      <Box paddingBottom={0}>
        <Text color={theme.primary}>{'> '}</Text>
        <Text color={theme.text}>{query || ''}</Text>
        <Text color={theme.textMuted}>{query ? '' : 'search...'}</Text>
      </Box>

      {/* Empty line */}
      <Text>{' '}</Text>

      {/* Command list */}
      {filtered.slice(0, maxVisible).map((cmd, i) => {
        const isSelected = i === selected
        return (
          <Box
            key={cmd.name}
            flexDirection="row"
            justifyContent="space-between"
            width="100%"
          >
            <Text
              color={isSelected ? theme.primary : theme.text}
              bold={isSelected}
            >
              {isSelected ? '› ' : '  '}
              {cmd.name}
            </Text>
            <Text color={theme.textMuted}>
              {cmd.shortcut ?? '—'}
            </Text>
          </Box>
        )
      })}

      {filtered.length === 0 && (
        <Text color={theme.textMuted}>  No matching commands</Text>
      )}
    </Box>
  )
}
