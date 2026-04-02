/**
 * Spinner — themed loading indicator.
 */
import React, { useState } from 'react'
import { Text, useInterval } from '../../ink.js'
import { useMythosTheme } from '../../utils/theme/index.js'

const FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

type Props = {
  /** Text shown after the spinner */
  label?: string
  /** Color override (defaults to theme.primary) */
  color?: string
}

export function Spinner({ label, color }: Props): React.ReactNode {
  const { theme } = useMythosTheme()
  const [frame, setFrame] = useState(0)

  useInterval(() => {
    setFrame(f => (f + 1) % FRAMES.length)
  }, 80)

  return (
    <Text>
      <Text color={color ?? theme.primary}>{FRAMES[frame]}</Text>
      {label && <Text color={theme.textMuted}>{` ${label}`}</Text>}
    </Text>
  )
}
