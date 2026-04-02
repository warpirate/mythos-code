import * as React from 'react';
import { useMemo } from 'react';
import { Box, Text } from '../ink.js';
import { getCwd } from '../utils/cwd.js';
import { getDisplayPath } from '../utils/file.js';
import type { MCPServerConnection } from '../services/mcp/types.js';

type Props = {
  mcpClients?: ReadonlyArray<{ name: string }>;
};

/**
 * OpenCode-style minimal footer.
 * Left: current directory path (dimmed)
 * Right: MCP connection count + /status hint
 */
export function OpenCodeFooter({ mcpClients }: Props): React.ReactNode {
  const cwd = getCwd();
  const displayPath = getDisplayPath(cwd);
  const mcpCount = mcpClients?.length ?? 0;

  return (
    <Box
      flexDirection="row"
      justifyContent="space-between"
      gap={1}
      width="100%"
      paddingX={2}
    >
      <Text dimColor wrap="truncate-end">{displayPath}</Text>
      <Box gap={2} flexDirection="row" flexShrink={0}>
        {mcpCount > 0 && (
          <Text>
            <Text color="success">{'⊙'}</Text>
            <Text>{` ${mcpCount} MCP`}</Text>
          </Text>
        )}
        <Text dimColor>/status</Text>
      </Box>
    </Box>
  );
}
