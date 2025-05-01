import { Box } from "@chakra-ui/react";

type Props = {
  step: number;
  title: string;
}

export const Step = ({ step, title }: Props) => (
  <Box display={"flex"} alignItems={"center"} justifyContent={"flex-start"} gap={"10px"}>
    <div style={{ backgroundColor: "blue", padding: "3px 13px 10px 10px", borderRadius: "50%", width: "30px", height: "30px" }}>{step}</div> {title}
  </Box>
)