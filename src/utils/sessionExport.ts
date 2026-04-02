/**
 * Session Export — exports a conversation session to markdown format.
 *
 * Converts messages to a clean markdown document with:
 * - Session metadata header
 * - User/assistant message blocks
 * - Tool call summaries
 * - Code blocks preserved
 */

type ExportMessage = {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: number
}

type ExportOptions = {
  title?: string
  model?: string
  sessionId?: string
  includeToolCalls?: boolean
}

/**
 * Export messages to a markdown string.
 */
export function exportSessionToMarkdown(
  messages: ExportMessage[],
  options: ExportOptions = {},
): string {
  const lines: string[] = []

  // Header
  lines.push(`# ${options.title ?? 'Mythos Session'}`)
  lines.push('')

  if (options.model) {
    lines.push(`**Model:** ${options.model}`)
  }
  if (options.sessionId) {
    lines.push(`**Session:** ${options.sessionId}`)
  }
  lines.push(`**Exported:** ${new Date().toISOString()}`)
  lines.push('')
  lines.push('---')
  lines.push('')

  // Messages
  for (const msg of messages) {
    const roleLabel =
      msg.role === 'user'
        ? '## You'
        : msg.role === 'assistant'
          ? '## Assistant'
          : '## System'

    lines.push(roleLabel)
    lines.push('')
    lines.push(msg.content)
    lines.push('')
  }

  return lines.join('\n')
}
