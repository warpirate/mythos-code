import * as React from 'react';
import { Box, Text } from 'src/ink.js';

const WELCOME_V2_WIDTH = 58;

// Block-character logo for "MYTHOS CLI" in OpenCode style
// Left part (MYTHOS) renders in muted color, right part (CLI) in bold primary
const LOGO_LEFT = [
  '█▀▄▀█ █  █ ▀█▀ █  █ █▀▀█ █▀▀▀',
  '█ ▀ █  ▀█   █  █▀▀█ █  █ ▀▀▀█',
  '▀   ▀   ▀   ▀  ▀  ▀ ▀▀▀▀ ▀▀▀▀',
];

const LOGO_RIGHT = [
  ' █▀▀ █   █▀█',
  ' █   █    █ ',
  ' ▀▀▀ ▀▀▀  ▀ ',
];

export function WelcomeV2(): React.ReactNode {
  return (
    <Box width={WELCOME_V2_WIDTH} flexDirection="column" alignItems="center">
      <Text>
        <Text color="claude">{'Welcome to MYTHOS-CLI'} </Text>
        <Text dimColor={true}>v{MACRO.VERSION} </Text>
      </Text>
      <Text>{' '}</Text>
      {LOGO_LEFT.map((leftLine, i) => (
        <Text key={i}>
          <Text dimColor={true}>{leftLine}</Text>
          <Text color="claude" bold={true}>{LOGO_RIGHT[i]}</Text>
        </Text>
      ))}
      <Text>{' '}</Text>
    </Box>
  );
}
