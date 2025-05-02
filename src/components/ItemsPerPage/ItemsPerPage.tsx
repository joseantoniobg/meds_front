"use client"

import { Portal, Select, createListCollection } from "@chakra-ui/react"
import { useState } from "react"

type Props = {
  onChange: (value: number) => void
  value: number
}

const ItemsPerPage = ({ value, onChange }: Props) => {
  return (
    <Select.Root
      collection={frameworks}
      width="100px"
      value={[value.toString()]}
      onValueChange={(e) => onChange(+e.value[0])}
    >
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Selecione a quantidade de itens" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {frameworks.items.map((framework) => (
              <Select.Item item={framework} key={framework.value}>
                {framework.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  )
}

const frameworks = createListCollection({
  items: [
    { label: "5 Itens", value: "5" },
    { label: "10 Itens", value: "10" },
    { label: "25 Itens", value: "25" },
    { label: "50 Itens", value: "50" },
  ],
})

export default ItemsPerPage;