"use client";

import { Box, Button, Fieldset, Stack } from "@chakra-ui/react";
import StButton from "../Button/StButton";

interface CustomInputProps {
  label: string;
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  onClick?: () => void;
  loading: boolean;
  horizontal?: boolean;
}

export default function StForm({ children, label, title, subtitle, onClick, loading, horizontal }: CustomInputProps) {
  return (
    <Fieldset.Root size="lg" >
    <Stack>
      {title && <Fieldset.Legend>{title}</Fieldset.Legend>}
      {subtitle && <Fieldset.HelperText>
        {subtitle}
      </Fieldset.HelperText>}
    </Stack>
    <Box display={horizontal ? "flex" : "contents"} alignItems={"center"} width={"100%"}>
      <Fieldset.Content>
      {children}
      </Fieldset.Content>
      <StButton type="submit" onClick={onClick} label={label} loading={loading} />
    </Box>
  </Fieldset.Root>
  );
}