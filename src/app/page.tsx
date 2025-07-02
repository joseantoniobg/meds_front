"use client";

import StPage from "@/components/StPage/StPage";
import { useAuth } from "@/contexts/auth.context";
import { Blockquote, Box, Heading } from "@chakra-ui/react";

export default function Home() {
  const { user } = useAuth();

  return (
    <StPage>
      <Box style={{ fontFamily: "monospace" }} maxHeight={"80vh"} display={"flex"} flexDirection="column" alignItems="center" justifyContent="space-between" height="100vh">
        <Heading style={{ fontFamily: "monospace", fontSize: "32px" }}>Bem-vindo!</Heading>
        <Blockquote.Root>
          <Blockquote.Content>
          {!user?.readOnly && <p style={{ width: "400px", fontSize: "18px", textAlign: "left" }}>Amor, saiba que fiz esse sistema especialmente pra você, pode não ter ficado perfeito (principalmente as telas rsrs) mas fiz de coração. Espero que ajude muito no seu dia a dia!</p>}
          {user?.readOnly && <p style={{ width: "400px", fontSize: "18px", textAlign: "left" }}>Seu usuário somente visualiza os dados presentes nesse sistema. Os dados presentes são sensíveis e estão seguindo as normas e regulações da LGPD. Somente pessoas autorizadas podem acessar. Nunca repasse a senha ou usuário a terceiros ou desconhecidos. O sistema loga todos os acessos realizados. Use com ética e responsabilidade.</p>}
          </Blockquote.Content>
        </Blockquote.Root>
        {!user?.readOnly && <p style={{ color: "#999" }}>Qualquer melhoria ou bug, só me falar</p>}
        {user?.readOnly && <p style={{ color: "#999" }}>JABG - 2025</p>}
      </Box>
    </StPage>
  );
}
