"use client";

import { Button } from "@chakra-ui/react";

interface CustomInputProps {
  label: string;
  type?: "button" | "submit" | "reset" | undefined;
  title?: string;
  subtitle?: string;
  onClick?: () => void;
  loading: boolean;
  style?: React.CSSProperties;
  disabled?: boolean;
  colorPalette?: string;
}

export default function StButton({ label, type, onClick, loading, style, disabled, colorPalette }: CustomInputProps) {
  return (
    <Button type={type} onClick={onClick} loading={loading} style={style} disabled={disabled} colorPalette={colorPalette}>
      {label}
    </Button>
  );
}