/**
 * ToolCallBox — collapsible bordered box for tool call rendering.
 *
 * Matches OpenCode's tool call display:
 *
 * ┌─ Read src/auth/jwt.ts (lines 1-45) ──────────┐
 * │ // JWT verification middleware                  │
 * │ export function verifyToken(req, res, next) {   │
 * └─────────────────────────────────────────────────┘
 *
 * Collapsed state shows just the header line.
 */
import React, { useState } from 'react'
import { Box, Text } from '../../ink.js'
import { useMythosTheme } from '../../utils/theme/index.js'

export type ToolCallType = 'read' | 'write' | 'bash' | 'search' | 'mcp' | 'other'

type Props = {
  /** Tool name for the label */
  label: string
  /** Tool type determines border color */
  type?: ToolCallType
  /** Whether initially collapsed */
  defaultCollapsed?: boolean
  /** Summary shown when collapsed */
  summary?: string
  /** Content shown when expanded */
  children?: React.ReactNode
}

function typeToIcon(type: ToolCallType): string {
  switch (type) {
    case 'read':
      return '📄'
    case 'write':
      return '✏️'
    case 'bash':
      return '⚡'
    case 'search':
      return '🔍'
    case 'mcp':
      return '🔌'
    default:
      return '⚙️'
  }
}

export function ToolCallBox({
  label,
  type = 'other',
  defaultCollapsed = true,
  summary,
  children,
}: Props): React.ReactNode {
  const { theme } = useMythosTheme()
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  const icon = typeToIcon(type)

  const borderColor = type === 'write' ? theme.warning
    : type === 'bash' ? theme.info
    : type === 'search' ? theme.accent
    : theme.border

  if (collapsed) {
    return (
      <Box paddingLeft={2} marginY={0}>
        <Text color={theme.textMuted}>
          {icon} {label}
          {summary ? ` — ${summary}` : ''}
        </Text>
      </Box>
    )
  }

  return (
    <Box
      flexDirection="column"
      marginLeft={2}
      marginY={0}
      borderStyle="round"
      borderColor={borderColor}
      paddingX={1}
      borderText={{
        content: ` ${icon} ${label} `,
        position: 'top',
        align: 'start',
        offset: 1,
      }}
    >
      {children}
    </Box>
  )
}
