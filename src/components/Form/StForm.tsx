"use client";

import { Box, Button, Fieldset, Stack } from "@chakra-ui/react";
import StButton from "../Button/StButton";

interface CustomInputProps {
  label: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  onClick?: () => void;
  loading: boolean;
  horizontal?: boolean;
}

export default function StForm({ children, label, title, subtitle, onClick, loading, horizontal, icon }: CustomInputProps) {
  return (
    <Fieldset.Root size="lg" >
    <Stack>
      {title && <Fieldset.Legend>{title}</Fieldset.Legend>}
      {subtitle && <Fieldset.HelperText>
        {subtitle}
      </Fieldset.HelperText>}
    </Stack>
    <Box display={horizontal ? "flex" : "contents"} alignItems={"center"} justifyContent={"flex-start"} gap={horizontal ? "10px" : "0px"} >
      <Fieldset.Content display={horizontal ? "flex" : "contents"} flexDirection={"row"} alignItems={"flex-start"} justifyContent={"center"} gap={horizontal ? "10px" : "0px"} >
      {children}
      </Fieldset.Content>
      <StButton style={{ marginBottom: horizontal ? '-24px' : 0 }} type="submit" onClick={onClick} label={label} loading={loading} icon={icon} />
    </Box>
  </Fieldset.Root>
  );
}