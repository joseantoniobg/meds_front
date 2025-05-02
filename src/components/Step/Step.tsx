import { Box } from "@chakra-ui/react";
import { FaCheck } from "react-icons/fa";

type Props = {
  step: number;
  title: string;
  checked?: boolean;
}

export const Step = ({ step, title, checked }: Props) => (
  <Box display={"flex"} alignItems={"center"} justifyContent={"flex-start"} gap={"10px"}>
    <Box style={{ backgroundColor: "rgba(49, 127, 216, 0.5)", fontWeight: "bold", padding: "3px 13px 10px 10px", borderRadius: "50%", width: "30px", height: "30px" }}>{step}</Box> {title}
    {checked && <FaCheck style={{ color: "green", marginLeft: "5px" }} />}
  </Box>
)