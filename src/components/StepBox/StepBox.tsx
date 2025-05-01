import { Box } from "@chakra-ui/react";

export const StepBox = ({ children }: { children: React.ReactNode}) => (
  <Box display={"flex"} flexDirection={"column"} alignItems={"flex-start"} justifyContent={"center"} gap={"10px"} style={{ marginBottom: "30px" }}>
    {children}
  </Box>
)