"use client"

import { ChakraProvider, defaultSystem, Theme } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"
import { useAuth } from "@/contexts/auth.context"

export function Provider(props: ColorModeProviderProps) {
  const { theme, colorPallete } = useAuth();

  return (
    <ChakraProvider value={defaultSystem}>
      <Theme appearance={theme} colorPalette={colorPallete}>
        {props.children}
      </Theme>
    </ChakraProvider>
  )
}
