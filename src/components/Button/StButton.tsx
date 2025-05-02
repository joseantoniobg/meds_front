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
  disabled?: boolean;
  colorPalette?: string;
  icon?: React.ReactNode;
  variant?: "outline" | "subtle" | "solid" | "surface" | "ghost" | "plain" | undefined;
}

export default function StButton({ label, type, onClick, loading, style, disabled, colorPalette, icon, variant }: CustomInputProps) {
  return (
    <Button variant={variant ?? "subtle"} type={type} onClick={onClick} loading={loading} style={style} disabled={disabled} colorPalette={colorPalette}>
     {icon} {label}
    </Button>
  );
}