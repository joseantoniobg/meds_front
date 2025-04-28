"use client"

import { ChakraProvider, defaultSystem, Theme } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"
import { useAuth } from "@/app/contexts/auth.context"

export function Provider(props: ColorModeProviderProps) {
  const { theme } = useAuth();

  return (
    <ChakraProvider value={defaultSystem}>
      <Theme appearance={theme} colorPalette="teal">
        <ColorModeProvider {...props} />
      </Theme>
    </ChakraProvider>
  )
}
