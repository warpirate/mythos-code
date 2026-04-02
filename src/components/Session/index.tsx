/**
 * Session — main chat session layout container matching OpenCode.
 *
 * Arranges Header, message area, optional Sidebar, prompt, and Footer
 * into the split-pane layout described in claude.md.
 *
 * Wide (>120 cols):
 * ┌──────────────────────────────────────────┬──────────────┐
 * │ Header                                   │              │
 * ├──────────────────────────────────────────┤  SIDEBAR     │
 * │ MESSAGE AREA                             │              │
 * ├──────────────────────────────────────────┴──────────────┤
 * │ Prompt                                                   │
 * ├──────────────────────────────────────────────────────────┤
 * │ Footer                                                   │
 * └──────────────────────────────────────────────────────────┘
 *
 * Narrow (<=120 cols): same but no sidebar.
 */
import React, { useMemo } from 'react'
import { Box } from '../../ink.js'
import { useTerminalSize } from '../../hooks/useTerminalSize.js'
import { useMythosTheme } from '../../utils/theme/index.js'
import { Header } from './Header.js'
import { Footer } from './Footer.js'
import { Sidebar } from './Sidebar.js'

const SIDEBAR_THRESHOLD = 120
const SIDEBAR_WIDTH = 30

type MCPServer = {
  name: string
  status: 'connected' | 'error' | 'connecting'
}

type ModifiedFile = {
  path: string
  type: '+' | '~' | '-'
}

type Props = {
  /** Agent name */
  agent: string
  /** Model name */
  model: string
  /** Session title */
  sessionTitle?: string
  /** Whether agent is processing */
  isLoading?: boolean
  /** Number of MCP connections */
  mcpCount?: number
  /** Token context string */
  contextTokens?: string
  /** Cost string */
  cost?: string
  /** MCP servers for sidebar */
  mcpServers?: MCPServer[]
  /** Modified files for sidebar */
  modifiedFiles?: ModifiedFile[]
  /** Whether sidebar is forcefully toggled */
  sidebarVisible?: boolean
  /** The scrollable message area */
  children: React.ReactNode
  /** The prompt component */
  prompt: React.ReactNode
}

export function SessionLayout({
  agent,
  model,
  sessionTitle,
  isLoading,
  mcpCount = 0,
  contextTokens,
  cost,
  mcpServers,
  modifiedFiles,
  sidebarVisible,
  children,
  prompt,
}: Props): React.ReactNode {
  const { theme } = useMythosTheme()
  const { columns, rows } = useTerminalSize()

  const showSidebar = useMemo(() => {
    if (sidebarVisible !== undefined) return sidebarVisible
    return columns > SIDEBAR_THRESHOLD
  }, [columns, sidebarVisible])

  return (
    <Box
      flexDirection="column"
      width={columns}
      height={rows}
    >
      {/* Header */}
      <Box
        borderStyle="single"
        borderBottom
        borderTop={false}
        borderLeft={false}
        borderRight={false}
        borderColor={theme.border}
        paddingY={0}
      >
        <Header
          agent={agent}
          model={model}
          sessionTitle={sessionTitle}
          isLoading={isLoading}
        />
      </Box>

      {/* Main content: messages + optional sidebar */}
      <Box flexDirection="row" flexGrow={1}>
        {/* Message area */}
        <Box flexDirection="column" flexGrow={1}>
          {children}
        </Box>

        {/* Sidebar */}
        {showSidebar && (
          <Sidebar
            width={SIDEBAR_WIDTH}
            contextTokens={contextTokens}
            cost={cost}
            model={model}
            mcpServers={mcpServers}
            modifiedFiles={modifiedFiles}
          />
        )}
      </Box>

      {/* Prompt area */}
      <Box flexDirection="column">
        {prompt}
      </Box>

      {/* Footer */}
      <Box
        borderStyle="single"
        borderTop
        borderBottom={false}
        borderLeft={false}
        borderRight={false}
        borderColor={theme.border}
        paddingY={0}
      >
        <Footer
          agent={agent}
          mcpCount={mcpCount}
        />
      </Box>
    </Box>
  )
}

export { Header } from './Header.js'
export { Footer } from './Footer.js'
export { Sidebar } from './Sidebar.js'
