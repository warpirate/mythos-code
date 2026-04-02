/**
 * MythosChrome — wraps the existing FullscreenLayout with OpenCode-style
 * chrome: a minimal footer bar, optional sidebar, and centered logo
 * on empty sessions (like OpenCode's home screen).
 */
import React, { useMemo } from 'react'
import { Box, Text } from '../../ink.js'
import { useTerminalSize } from '../../hooks/useTerminalSize.js'
import { useMythosTheme } from '../../utils/theme/index.js'
import { Sidebar } from './Sidebar.js'
import { getCwd } from '../../utils/cwd.js'
import { getDisplayPath } from '../../utils/file.js'

const SIDEBAR_THRESHOLD = 120
const SIDEBAR_WIDTH = 42

type MCPServer = {
  name: string
  status: 'connected' | 'error' | 'connecting'
}

type ModifiedFile = {
  path: string
  type: '+' | '~' | '-'
}

type Props = {
  agent?: string
  model?: string
  sessionTitle?: string
  isLoading?: boolean
  mcpClients?: ReadonlyArray<{ name: string }>
  mcpServers?: MCPServer[]
  contextTokens?: string
  cost?: string
  modifiedFiles?: ModifiedFile[]
  sidebarVisible?: boolean
  /** Whether the session has any messages yet */
  hasMessages?: boolean
  children: React.ReactNode
}

export function MythosChrome({
  agent = 'build',
  model = '',
  sessionTitle,
  isLoading,
  mcpClients,
  mcpServers,
  contextTokens,
  cost,
  modifiedFiles,
  sidebarVisible,
  hasMessages = false,
  children,
}: Props): React.ReactNode {
  const { theme } = useMythosTheme()
  const { columns } = useTerminalSize()

  // Sidebar hidden by default — only show when explicitly toggled
  const showSidebar = sidebarVisible === true

  const mcpCount = mcpClients?.length ?? 0

  const sidebarMcpServers = useMemo(() => {
    if (mcpServers) return mcpServers
    if (!mcpClients) return undefined
    return mcpClients.map((c) => ({
      name: c.name,
      status: 'connected' as const,
    }))
  }, [mcpServers, mcpClients])

  const mcpHasError = sidebarMcpServers?.some(s => s.status === 'error') ?? false

  const cwd = getCwd()
  const displayPath = getDisplayPath(cwd)

  return (
    <Box flexDirection="column" width="100%" height="100%" backgroundColor={theme.background}>
      {/* ── Main content row: children + sidebar ── */}
      <Box flexDirection="row" flexGrow={1} overflow="hidden">
        {/* Main content area */}
        <Box flexDirection="column" flexGrow={1} overflow="hidden" backgroundColor={theme.background}>
          {children}
        </Box>

        {/* Sidebar */}
        {showSidebar && (
          <Sidebar
            width={SIDEBAR_WIDTH}
            sessionTitle={sessionTitle}
            contextTokens={contextTokens}
            cost={cost}
            model={model}
            mcpServers={sidebarMcpServers}
            modifiedFiles={modifiedFiles}
          />
        )}
      </Box>

      {/* ── Footer ── */}
      <Box
        flexDirection="row"
        justifyContent="space-between"
        gap={1}
        flexShrink={0}
        paddingX={2}
      >
        <Text color={theme.textMuted}>{displayPath}</Text>
        <Box gap={2} flexDirection="row" flexShrink={0}>
          {mcpCount > 0 && (
            <Text color={theme.text}>
              <Text color={mcpHasError ? theme.error : theme.success}>{'⊙ '}</Text>
              {mcpCount} MCP
            </Text>
          )}
          <Text color={theme.textMuted}>/status</Text>
        </Box>
      </Box>
    </Box>
  )
}
