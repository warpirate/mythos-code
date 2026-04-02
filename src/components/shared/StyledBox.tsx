/**
 * StyledBox — a Box with Mythos theme-aware border styling.
 *
 * Replaces manual border color wiring with a single `variant` prop
 * and optional `focused` state. Uses the Mythos theme system.
 */
import React from 'react'
import { Box, Text } from '../../ink.js'
import { useMythosTheme } from '../../utils/theme/index.js'
import type { BoxProps } from '../../ink.js'

type Variant = 'default' | 'focused' | 'primary' | 'success' | 'error' | 'warning'

type Props = Omit<BoxProps, 'borderColor'> & {
  /** Border style variant */
  variant?: Variant
  /** Override: treat as focused (uses borderActive color) */
  focused?: boolean
  /** Label rendered inside the top border, e.g. "─ build ─" */
  label?: string
  /** Label color override */
  labelColor?: string
}

function variantToColor(
  variant: Variant,
  focused: boolean,
  theme: ReturnType<typeof useMythosTheme>['theme'],
): string {
  if (focused) return theme.primary
  switch (variant) {
    case 'focused':
      return theme.primary
    case 'primary':
      return theme.primary
    case 'success':
      return theme.success
    case 'error':
      return theme.error
    case 'warning':
      return theme.warning
    default:
      return theme.border
  }
}

export function StyledBox({
  variant = 'default',
  focused = false,
  label,
  labelColor,
  children,
  ...boxProps
}: React.PropsWithChildren<Props>): React.ReactNode {
  const { theme } = useMythosTheme()
  const borderColor = variantToColor(variant, focused, theme)

  return (
    <Box
      borderStyle="round"
      borderColor={borderColor}
      {...boxProps}
    >
      {label && (
        <Box position="absolute" marginLeft={2} marginTop={-1}>
          <Text color={labelColor ?? borderColor}>{` ${label} `}</Text>
        </Box>
      )}
      {children}
    </Box>
  )
}
