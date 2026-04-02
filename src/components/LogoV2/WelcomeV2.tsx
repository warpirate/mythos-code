import * as React from 'react';
import { Box, Text } from 'src/ink.js';
import { useMainLoopModel } from '../../hooks/useMainLoopModel.js';
import { renderModelSetting } from '../../utils/model/model.js';
import { getDisplayPath } from '../../utils/file.js';
import { getCwd } from '../../utils/cwd.js';

const LOGO = `\
███╗   ███╗██╗   ██╗████████╗██╗  ██╗ ██████╗ ███████╗
████╗ ████║╚██╗ ██╔╝╚══██╔══╝██║  ██║██╔═══██╗██╔════╝
██╔████╔██║ ╚████╔╝    ██║   ███████║██║   ██║███████╗
██║╚██╔╝██║  ╚██╔╝     ██║   ██╔══██║██║   ██║╚════██║
██║ ╚═╝ ██║   ██║      ██║   ██║  ██║╚██████╔╝███████║
╚═╝     ╚═╝   ╚═╝      ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚══════╝`;

const TAGLINE = 'THE TERMINAL SPEAKS IN TONGUES';

export function WelcomeV2(): React.ReactNode {
  const model = useMainLoopModel();
  const modelName = renderModelSetting(model);
  const cwd = getDisplayPath(getCwd());

  return (
    <Box flexDirection="column" alignItems="center" paddingTop={2}>
      <Text color="#6C3FC7">{LOGO}</Text>
      <Box height={1} />
      <Text color="#8B5CF6">{TAGLINE}</Text>
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
