"use client";

import { Field, HStack, Textarea } from "@chakra-ui/react"

type Props = {
  id: string,
  label: string,
  required?: boolean,
  placeholder?: string,
  helperText?: string,
  value: string,
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void,
}

export const StTextArea = ({ id, label, required, helperText, placeholder, value, onChange }: Props) => {
  return (
      <Field.Root required={required}>
        <Field.Label>
          {label} {required && <Field.RequiredIndicator />}
        </Field.Label>
        <Textarea id={id} value={value} onChange={onChange} placeholder={placeholder} variant="subtle" />
        <Field.HelperText>{helperText}</Field.HelperText>
      </Field.Root>
  )
}