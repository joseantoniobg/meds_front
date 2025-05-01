"use client";

import { Field, Textarea } from "@chakra-ui/react"

type Props = {
  id: string,
  label: string,
  required?: boolean,
  placeholder?: string,
  helperText?: string,
  value: string,
  setValue: (value: string) => void,
}

export const StTextArea = ({ id, label, required, helperText, placeholder, value, setValue }: Props) => {
  return (
      <Field.Root required={required}>
        <Field.Label>
          {label} {required && <Field.RequiredIndicator />}
        </Field.Label>
        <Textarea id={id} value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} variant="subtle" />
        <Field.HelperText>{helperText}</Field.HelperText>
      </Field.Root>
  )
}