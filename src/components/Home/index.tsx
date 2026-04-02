/**
 * Home Screen — session list / welcome screen shown when Mythos starts.
 *
 * ┌─────────────────────────────────────────────┐
 * │                                             │
 * │           M Y T H O S                       │
 * │                                             │
 * │   Recent Sessions                           │
 * │                                             │
 * │   > Fix auth middleware bug     2 min ago   │
 * │     Add rate limiting to API    1 hour ago  │
 * │     Refactor database queries   yesterday   │
 * │                                             │
 * │   ctrl+n new · ctrl+s sessions · ? help     │
 * │                                             │
 * └─────────────────────────────────────────────┘
 */
import React, { useState } from 'react'
import { Box, Text, useInput } from '../../ink.js'
import { useMythosTheme } from '../../utils/theme/index.js'

export type SessionEntry = {
  id: string
  title: string
  lastActive: string // relative time string, e.g. "2 min ago"
}

type Props = {
  sessions: SessionEntry[]
  onSelectSession: (id: string) => void
  onNewSession: () => void
  width?: number
}

const LOGO = `
 M Y T H O S
`

export function HomeScreen({
  sessions,
  onSelectSession,
  onNewSession,
  width,
}: Props): React.ReactNode {
  const { theme } = useMythosTheme()
  const [selected, setSelected] = useState(0)

  useInput((_input, key) => {
    if (key.return) {
      const session = sessions[selected]
      if (session) {
        onSelectSession(session.id)
      }
      return
    }
    if (key.upArrow) {
      setSelected((s) => Math.max(0, s - 1))
      return
    }
    if (key.downArrow) {
      setSelected((s) => Math.min(sessions.length - 1, s + 1))
      return
    }
    if (_input === 'n' && key.ctrl) {
      onNewSession()
    }
  })

  return (
    <Box
      flexDirection="column"
      alignItems="center"
      width={width ?? '100%'}
      paddingY={2}
    >
      {/* Logo */}
      <Text color={theme.primary} bold>
        {LOGO.trim()}
      </Text>

      <Text>{' '}</Text>

      {/* Recent Sessions */}
      {sessions.length > 0 ? (
        <Box flexDirection="column" width={60}>
          <Text color={theme.textMuted} bold>
            {'  Recent Sessions'}
          </Text>
          <Text>{' '}</Text>
          {sessions.slice(0, 10).map((session, i) => {
            const isSelected = i === selected
            return (
              <Box
                key={session.id}
                flexDirection="row"
                justifyContent="space-between"
                width="100%"
              >
                <Text
                  color={isSelected ? theme.primary : theme.text}
                  bold={isSelected}
                >
                  {isSelected ? '  > ' : '    '}
                  {session.title}
                </Text>
                <Text color={theme.textMuted}>
                  {session.lastActive}
                </Text>
              </Box>
            )
          })}
        </Box>
      ) : (
        <Box flexDirection="column" alignItems="center">
          <Text color={theme.textMuted}>No recent sessions</Text>
          <Text>{' '}</Text>
          <Text color={theme.textMuted}>
            Start typing to begin a new session
          </Text>
        </Box>
      )}

      <Text>{' '}</Text>

      {/* Keybind hints */}
      <Box flexDirection="row" gap={1}>
        <Text>
          <Text color={theme.textMuted}>ctrl+n</Text>
          <Text color={theme.text}> new</Text>
        </Text>
        <Text color={theme.border}>·</Text>
        <Text>
          <Text color={theme.textMuted}>Enter</Text>
          <Text color={theme.text}> resume</Text>
        </Text>
        <Text color={theme.border}>·</Text>
        <Text>
          <Text color={theme.textMuted}>?</Text>
          <Text color={theme.text}> help</Text>
        </Text>
      </Box>
    </Box>
  )
}
