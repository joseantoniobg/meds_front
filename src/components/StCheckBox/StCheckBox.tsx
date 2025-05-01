"use client";

import { Box, Checkbox } from "@chakra-ui/react"

type Props = {
  label: any;
  setValue: (value: any) => void;
  value: any;
  style?: React.CSSProperties;
  marginTop?: string;
}

export const StCheckBox = ({ label, setValue, value, style, marginTop }:Props) => {
  return (
    <Box display={"flex"} alignItems={"center"} justifyContent={"flex-start"} gap={"10px"} marginTop={marginTop}>
      <Checkbox.Root onChange={(e: any) => setValue(e.target.checked)} colorPalette={"green"} checked={value}>
        <Checkbox.HiddenInput />
        <Checkbox.Control style={style} />
      </Checkbox.Root> {label}
    </Box>
  )
}