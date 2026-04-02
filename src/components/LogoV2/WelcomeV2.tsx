import * as React from 'react';
import { Box, Text } from 'src/ink.js';
import { useMythosTheme } from '../../utils/theme/index.js';
import { useMainLoopModel } from '../../hooks/useMainLoopModel.js';
import { renderModelSetting } from '../../utils/model/model.js';
import { getDisplayPath } from '../../utils/file.js';
import { getCwd } from '../../utils/cwd.js';

/**
 * MYTHOS welcome logo — uses ONLY █ and spaces.
 * No box-drawing chars (they glitch in many terminal fonts).
 */

const LOGO = `\
██    ██ ██    ██ ████████ ██   ██  ██████  ████████
███  ███  ██  ██     ██    ██   ██ ██    ██ ██
████████   ████      ██    ████████ ██    ██ ████████
██ ██ ██    ██       ██    ██   ██ ██    ██       ██
██    ██    ██       ██    ██   ██  ██████  ████████`;

const TAGLINE = 'T H E   T E R M I N A L   S P E A K S   I N   T O N G U E S';

export function WelcomeV2(): React.ReactNode {
  const { theme } = useMythosTheme();
  const model = useMainLoopModel();
  const modelName = renderModelSetting(model);
  const cwd = getDisplayPath(getCwd());

  return (
    <Box flexDirection="column" alignItems="center" paddingTop={2}>
      <Text color={theme.accent}>{LOGO}</Text>
      <Box height={1} />
      <Text color={theme.secondary}>{TAGLINE}</Text>
      <Box height={1} />
      <Text>
        <Text bold>Mythos CLI</Text>
        <Text dimColor> v{MACRO.VERSION}</Text>
      </Text>
      <Text dimColor>{modelName}</Text>
      <Text dimColor>{cwd}</Text>
    </Box>
  );
}
