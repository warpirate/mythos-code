/**
 * Toast — non-blocking notification in the top-right corner.
 * Auto-dismisses after 3 seconds. Matches OpenCode toast style.
 *
 * Types: success (green), error (red), warning (yellow), info (blue).
 */
import React, { useEffect, useState } from 'react'
import { Box, Text } from '../../ink.js'
import { useMythosTheme } from '../../utils/theme/index.js'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export type ToastMessage = {
  id: string
  type: ToastType
  text: string
  duration?: number
}

const ICONS: Record<ToastType, string> = {
  success: '✓',
  error: '✗',
  warning: '⚠',
  info: 'ℹ',
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastMessage
  onDismiss: (id: string) => void
}): React.ReactNode {
  const { theme } = useMythosTheme()

  useEffect(() => {
    const timer = setTimeout(
      () => onDismiss(toast.id),
      toast.duration ?? 3000,
    )
    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onDismiss])

  const colorMap: Record<ToastType, string> = {
    success: theme.success,
    error: theme.error,
    warning: theme.warning,
    info: theme.info,
  }
  const color = colorMap[toast.type]

  return (
    <Box
      borderStyle="round"
      borderColor={color}
      paddingX={1}
    >
      <Text color={color}>{ICONS[toast.type]}</Text>
      <Text color={theme.text}>{` ${toast.text}`}</Text>
    </Box>
  )
}

type Props = {
  toasts: ToastMessage[]
  onDismiss: (id: string) => void
}

export function ToastContainer({ toasts, onDismiss }: Props): React.ReactNode {
  if (toasts.length === 0) return null

  return (
    <Box
      position="absolute"
      right={1}
      top={1}
      flexDirection="column"
      gap={0}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </Box>
  )
}

/**
 * Hook to manage toast state. Returns [toasts, addToast, dismissToast].
 */
export function useToasts() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = (type: ToastType, text: string, duration?: number) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    setToasts((prev) => [...prev, { id, type, text, duration }])
  }

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return { toasts, addToast, dismissToast } as const
}
