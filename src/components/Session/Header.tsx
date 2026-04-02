/**
 * Session Header — top bar matching OpenCode layout.
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │ [agent_icon] build · model_name              session_title          │
 * └─────────────────────────────────────────────────────────────────────┘
 */
import React from 'react'
import { Box, Text } from '../../ink.js'
import { useMythosTheme } from '../../utils/theme/index.js'

type Props = {
  /** Active agent name (e.g. "build", "plan") */
  agent: string
  /** Current model name (e.g. "claude-sonnet-4-20250514") */
  model: string
  /** Session title (optional) */
  sessionTitle?: string
  /** Whether the agent is currently processing */
  isLoading?: boolean
}

const AGENT_ICONS: Record<string, string> = {
  build: '⚡',
  plan: '📋',
}

export function Header({
  agent,
  model,
  sessionTitle,
  isLoading,
}: Props): React.ReactNode {
  const { theme } = useMythosTheme()
  const icon = AGENT_ICONS[agent] ?? '●'

  return (
    <Box
      flexDirection="row"
      justifyContent="space-between"
      width="100%"
      paddingX={2}
    >
      {/* Left: agent + model */}
      <Box flexDirection="row" gap={1}>
        <Text color={theme.primary}>{icon}</Text>
        <Text color={theme.primary} bold>{agent}</Text>
        <Text color={theme.textMuted}>·</Text>
        <Text color={theme.textMuted}>{model}</Text>
        {isLoading && (
          <Text color={theme.warning}> ●</Text>
        )}
      </Box>

      {/* Right: session title */}
      {sessionTitle && (
        <Text color={theme.textMuted} wrap="truncate-end">
          {sessionTitle}
        </Text>
      )}
    </Box>
  )
}
