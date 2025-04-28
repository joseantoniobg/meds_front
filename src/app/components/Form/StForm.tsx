"use client";

import { Button, Fieldset, Stack } from "@chakra-ui/react";
import StButton from "../Button/StButton";

interface CustomInputProps {
  label: string;
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  onClick?: () => void;
  loading: boolean;
}

export default function StForm({ children, label, title, subtitle, onClick, loading }: CustomInputProps) {
  return (
    <Fieldset.Root size="lg" maxW="md">
    <Stack>
      {title && <Fieldset.Legend>{title}</Fieldset.Legend>}
      {subtitle && <Fieldset.HelperText>
        {subtitle}
      </Fieldset.HelperText>}
    </Stack>
    <Fieldset.Content>
     {children}
    </Fieldset.Content>
    <StButton type="submit" onClick={onClick} label={label} loading={loading} />
  </Fieldset.Root>
  );
}