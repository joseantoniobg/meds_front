import { Box, Field, NumberInput } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";

type Props = {
  value: number,
  setValue: Dispatch<SetStateAction<number>>,
  min?: number,
  max?: number,
  label: string,
  style?: React.CSSProperties,
}

const StNumberInput = ({ value, setValue, min, max, label, style }: Props) => {
  return (
    <Box style={style}>
      <Field.Root>
        <Field.Label>{label}</Field.Label>
        <NumberInput.Root value={`${value}`} onValueChange={({ value }) => setValue(+value)} min={min} max={max}>
          <NumberInput.Control />
          <NumberInput.Input />
        </NumberInput.Root>
      </Field.Root>
    </Box>
  );
}
export default StNumberInput;