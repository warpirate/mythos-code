/**
 * Session Sidebar — right panel matching OpenCode's sidebar.
 *
 * OpenCode sidebar:
 * - width={42}, backgroundColor={theme.backgroundPanel}
 * - paddingTop={1} paddingBottom={1} paddingLeft={2} paddingRight={2}
 * - Scrollable content area with session title, context info, MCP servers
 * - Footer with "• Mythos" branding at bottom
 */
import React from 'react'
import { Box, Text } from '../../ink.js'
import { useMythosTheme } from '../../utils/theme/index.js'

type MCPServer = {
  name: string
  status: 'connected' | 'error' | 'connecting'
}

type ModifiedFile = {
  path: string
  /** +added, ~modified, -deleted */
  type: '+' | '~' | '-'
}

type Props = {
  /** Session title */
  sessionTitle?: string
  /** Token usage string, e.g. "45.2k / 200k" */
  contextTokens?: string
  /** Running cost string, e.g. "$0.23" */
  cost?: string
  /** Current model name */
  model?: string
  /** MCP server statuses */
  mcpServers?: MCPServer[]
  /** Files modified in session */
  modifiedFiles?: ModifiedFile[]
  /** Width of the sidebar */
  width: number
}

function SidebarSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}): React.ReactNode {
  const { theme } = useMythosTheme()
  return (
    <Box flexDirection="column">
      <Text color={theme.textMuted} bold>{title}</Text>
      {children}
    </Box>
  )
}

export function Sidebar({
  sessionTitle,
  contextTokens,
  cost,
  model,
  mcpServers,
  modifiedFiles,
  width,
}: Props): React.ReactNode {
  const { theme } = useMythosTheme()

  return (
    <Box
      flexDirection="column"
      width={width}
      height="100%"
      paddingTop={1}
      paddingBottom={1}
      paddingLeft={2}
      paddingRight={2}
      backgroundColor={theme.backgroundPanel}
    >
      {/* Scrollable content area */}
      <Box flexDirection="column" flexGrow={1} gap={1} overflow="hidden">
        {/* Session title */}
        {sessionTitle && (
          <Box paddingRight={1}>
            <Text color={theme.text} bold wrap="truncate-end">{sessionTitle}</Text>
          </Box>
        )}

        {/* Context tokens */}
        {contextTokens && (
          <SidebarSection title="Context">
            <Text color={theme.text}>{contextTokens}</Text>
          </SidebarSection>
        )}

        {/* Cost */}
        {cost && (
          <SidebarSection title="Cost">
            <Text color={theme.text}>{cost}</Text>
          </SidebarSection>
        )}

        {/* Model */}
        {model && (
          <SidebarSection title="Model">
            <Text color={theme.text}>{model}</Text>
          </SidebarSection>
        )}

        {/* MCP Servers */}
        {mcpServers && mcpServers.length > 0 && (
          <SidebarSection title="MCP Servers">
            {mcpServers.map((server) => {
              const dotColor =
                server.status === 'connected'
                  ? theme.success
                  : server.status === 'error'
                    ? theme.error
                    : theme.warning
              return (
                <Box key={server.name} flexDirection="row" gap={1}>
                  <Text color={dotColor}>{'•'}</Text>
                  <Text color={theme.text} wrap="truncate-end">{server.name}</Text>
                </Box>
              )
            })}
          </SidebarSection>
        )}

        {/* Modified Files */}
        {modifiedFiles && modifiedFiles.length > 0 && (
          <SidebarSection title="Modified Files">
            {modifiedFiles.map((file) => {
              const color =
                file.type === '+'
                  ? theme.success
                  : file.type === '-'
                    ? theme.error
                    : theme.warning
              return (
                <Box key={file.path} flexDirection="row" gap={1}>
                  <Text color={color}>{file.type}</Text>
                  <Text color={theme.text} wrap="truncate-end">{file.path}</Text>
                </Box>
              )
            })}
          </SidebarSection>
        )}
      </Box>

      {/* Footer — OpenCode style branding */}
      <Box flexShrink={0} paddingTop={1}>
        <Text color={theme.textMuted}>
          <Text color={theme.success}>{'•'}</Text>
          {' '}
          <Text bold>Mythos</Text>
        </Text>
      </Box>
    </Box>
  )
}
