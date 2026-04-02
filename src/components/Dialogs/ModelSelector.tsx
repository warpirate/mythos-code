/**
 * ModelSelector — modal dialog for picking the active model.
 *
 * Shows available models in a navigable list.
 */
import React, { useState } from 'react'
import { Box, Text, useInput } from '../../ink.js'
import { useMythosTheme } from '../../utils/theme/index.js'

type ModelOption = {
  id: string
  name: string
  description?: string
}

type Props = {
  models: ModelOption[]
  currentModel: string
  onSelect: (modelId: string) => void
  onClose: () => void
  width?: number
}

export function ModelSelector({
  models,
  currentModel,
  onSelect,
  onClose,
  width = 50,
}: Props): React.ReactNode {
  const { theme } = useMythosTheme()
  const currentIdx = models.findIndex((m) => m.id === currentModel)
  const [selected, setSelected] = useState(Math.max(0, currentIdx))

  useInput((_input, key) => {
    if (key.escape) {
      onClose()
      return
    }
    if (key.return) {
      const model = models[selected]
      if (model) {
        onSelect(model.id)
        onClose()
      }
      return
    }
    if (key.upArrow) {
      setSelected((s) => Math.max(0, s - 1))
      return
    }
    if (key.downArrow) {
      setSelected((s) => Math.min(models.length - 1, s + 1))
    }
  })

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={theme.primary}
      width={width}
      paddingX={1}
      borderText={{
        content: ' Models ',
        position: 'top',
        align: 'start',
        offset: 1,
      }}
    >
      {models.map((model, i) => {
        const isSelected = i === selected
        const isCurrent = model.id === currentModel
        return (
          <Box
            key={model.id}
            flexDirection="row"
            justifyContent="space-between"
            width="100%"
          >
            <Text
              color={isSelected ? theme.primary : theme.text}
              bold={isSelected}
            >
              {isSelected ? '› ' : '  '}
              {model.name}
            </Text>
            {isCurrent && (
              <Text color={theme.success}>current</Text>
            )}
          </Box>
        )
      })}
    </Box>
  )
}
