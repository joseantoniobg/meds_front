"use client"

import { ChakraProvider, defaultSystem, Theme } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={defaultSystem}>
      <Theme appearance="dark" colorPalette="teal">
        <ColorModeProvider {...props} />
      </Theme>
    </ChakraProvider>
  )
}
