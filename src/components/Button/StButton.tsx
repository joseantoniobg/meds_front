"use client";

import { Button, Fieldset, Stack } from "@chakra-ui/react";

interface CustomInputProps {
  label: string;
  type?: "button" | "submit" | "reset" | undefined;
  title?: string;
  subtitle?: string;
  onClick?: () => void;
  loading: boolean;
  style?: React.CSSProperties;
}

export default function StButton({ label, type, onClick, loading, style }: CustomInputProps) {
  return (
    <Button type={type} onClick={onClick} loading={loading} style={style}>
      {label}
    </Button>
  );
}