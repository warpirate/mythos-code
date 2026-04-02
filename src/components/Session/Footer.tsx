/**
 * Session Footer — bottom bar with keybind hints matching OpenCode layout.
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │ ctrl+x h help · Tab switch agent · ctrl+c interrupt                │
 * └─────────────────────────────────────────────────────────────────────┘
 */
import React from 'react'
import { Box, Text } from '../../ink.js'
import { useMythosTheme } from '../../utils/theme/index.js'

type KeyHint = {
  key: string
  label: string
}

type Props = {
  /** Active agent name */
  agent?: string
  /** Number of connected MCP servers */
  mcpCount?: number
  /** Extra hints to show */
  extraHints?: KeyHint[]
}

const BASE_HINTS: KeyHint[] = [
  { key: 'ctrl+x h', label: 'help' },
  { key: 'Tab', label: 'switch agent' },
  { key: 'ctrl+c', label: 'interrupt' },
  { key: 'ctrl+k', label: 'commands' },
]

export function Footer({
  agent,
  mcpCount = 0,
  extraHints,
}: Props): React.ReactNode {
  const { theme } = useMythosTheme()
  const hints = extraHints ? [...BASE_HINTS, ...extraHints] : BASE_HINTS

  return (
    <Box
      flexDirection="row"
      justifyContent="space-between"
      width="100%"
      paddingX={2}
    >
      {/* Left: keybind hints */}
      <Box flexDirection="row" gap={1}>
        {hints.map((hint, i) => (
          <React.Fragment key={hint.key}>
            {i > 0 && <Text color={theme.border}>·</Text>}
            <Text>
              <Text color={theme.textMuted}>{hint.key}</Text>
              <Text color={theme.text}>{` ${hint.label}`}</Text>
            </Text>
          </React.Fragment>
        ))}
      </Box>

      {/* Right: MCP + agent status */}
      <Box flexDirection="row" gap={2} flexShrink={0}>
        {mcpCount > 0 && (
          <Text>
            <Text color={theme.success}>{'⊙'}</Text>
            <Text color={theme.textMuted}>{` ${mcpCount} MCP`}</Text>
          </Text>
        )}
        {agent && (
          <Text color={theme.primary} bold>{agent}</Text>
        )}
      </Box>
    </Box>
  )
}
