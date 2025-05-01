"use client";

import { Field, FieldLabel, Input } from "@chakra-ui/react";

interface CustomInputProps {
  id: string;
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  maxLength?: number;
  type?: string;
  errorText?: string;
  style?: React.CSSProperties;
  rootStyle?: React.CSSProperties;
  mask?: string;
}

export default function StInput({ value, onChange, placeholder, onKeyDown, maxLength, type, id, label, errorText, style, mask, rootStyle }: CustomInputProps) {
  return (
    <Field.Root style={rootStyle} id={id}>
      <FieldLabel>{label}</FieldLabel>
      <Input
        value={value}
        onChange={onChange}
        type={type ?? 'text'}
        placeholder={placeholder}
        maxLength={maxLength}
        onKeyDown={onKeyDown}
        style={style}
        mask={mask}
      />
      <Field.ErrorText>{errorText}</Field.ErrorText>
  </Field.Root>
  );
}