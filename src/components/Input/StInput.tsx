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
}

export default function StInput({ value, onChange, placeholder, onKeyDown, maxLength, type, id, label, errorText }: CustomInputProps) {
  return (
    <Field.Root id={id} mb={4}>
    <FieldLabel>{label}</FieldLabel>
    <Input
      value={value}
      onChange={onChange}
      type={type ?? 'text'}
      placeholder={placeholder}
      maxLength={maxLength}
      onKeyDown={onKeyDown}
    />
    <Field.ErrorText>{errorText}</Field.ErrorText>
  </Field.Root>
  );
}