"use client"; // Ensure this is added to mark the file as a client component

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Button, Box, Heading, Field, FieldLabel } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster"
import { useAuth } from "../contexts/auth.context";
import StInput from "../components/Input/StInput";
import StForm from "../components/Form/StForm";
import performRequest from "../utils/handleRequest";
import { jwtDecode } from "jwt-decode";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useAuth();
  const router = useRouter();

  type TokenPayload = { id: string, name: string, login: string, token: string };

  const handleLogin = async () => {
    setLoading(true);
    if (username && password) {
      const res = await performRequest("POST", "/api/auth", {
        "Content-Type": "application/x-www-form-urlencoded",
      }, setLoading, {
        client_id: username,
        client_secret: password,
        grant_type: "client_credentials",
      });

      if (res.status === 200) {
        const decoded = jwtDecode<TokenPayload>(res.data.access_token);
        login({ id: decoded.id, name: decoded.name, login: decoded.login, token: res.data.access_token });
        toaster.create({
          title: "Ok!",
          description: "Login realizado com sucesso",
          type: "success",
          duration: 3000,
        })
      }

      toaster.create({
        title: "Erro",
        description: res.data.message,
        type: "error",
        duration: 3000,
      })
    } else {
      toaster.create({
        title: "Erro",
        description: "Usuário ou senha inválidos",
        type: "error",
        duration: 3000,
      })
    }
    setLoading(false);
  };

  return (
    <Box display={"flex"}
      alignItems={"center"}
      height={"100vh"}
      justifyContent={"center"}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width="300px"
        p={4}
      >
        <Heading as="h1" size="2xl" mb={6}>
          Login
        </Heading>
        <StForm subtitle="Acesse sua conta" label="Entrar" onClick={handleLogin} loading={loading}>
          <StInput id="username" label="Usuário" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Digite seu usuário" />
          <StInput id="password" label="Senha" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Digite sua senha" />
        </StForm>
      </Box>
    </Box>
  );
};

export default Login;
