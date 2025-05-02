"use client";

import StPage from "@/components/StPage/StPage";
import { Blockquote, Box, Heading } from "@chakra-ui/react";

export default function Home() {
  return (
    <StPage>
      <Box style={{ fontFamily: "monospace" }} maxHeight={"80vh"} display={"flex"} flexDirection="column" alignItems="center" justifyContent="space-between" height="100vh">
        <Heading style={{ fontFamily: "monospace", fontSize: "32px" }}>Bem-vindo!</Heading>
        <Blockquote.Root>
          <Blockquote.Content>
          <p style={{ width: "400px", fontSize: "18px", textAlign: "left" }}>Amor, saiba que fiz esse sistema especialmente pra você, pode não ter ficado perfeito (principalmente as telas rsrs) mas fiz de coração. Espero que ajude muito no seu dia a dia!</p>
          </Blockquote.Content>
        </Blockquote.Root>
        <p style={{ color: "#999" }}>Qualquer melhoria ou bug, só me falar</p>
      </Box>
    </StPage>
  );
}
