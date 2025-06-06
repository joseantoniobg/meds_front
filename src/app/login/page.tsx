"use client"; // Ensure this is added to mark the file as a client component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Button, Box, Heading, Field, FieldLabel, useEditable } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster"
import { useAuth } from "@/contexts/auth.context";
import StInput from "@/components/Input/StInput";
import StForm from "@/components/Form/StForm";
import performRequest, { performRequestSimple } from "@/lib/handleRequest";
import ReCAPTCHA from "react-google-recaptcha";

const Login: React.FC = () => {
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { login, logout } = useAuth();
  const router = useRouter();

  const enableRecaptcha = process.env.NEXT_PUBLIC_ENABLE_RECAPTCHA === "true";

  const recaptchaValidation = async () => {
    return await performRequestSimple("POST", "/api/recaptcha", {
      "Content-Type": "application/json",
    }, {
      recaptcha: recaptchaValue,
    });
  }

  const handleLogin = async () => {
    setLoading(true);
    if (username && password) {

      if (enableRecaptcha) {
        const validRecaptcha = await recaptchaValidation();

        if (!validRecaptcha || validRecaptcha.data.ok === false) {
          toaster.create({
            title: "Erro",
            description: "Recaptcha inválido",
            type: "error",
            duration: 1500,
          })
          setLoading(false);
          return;
        }
      }

      const res = await performRequest("POST", "/api/auth", {
        "Content-Type": "application/x-www-form-urlencoded",
      }, setLoading,
      "Login realizado com sucesso",
      toaster,
      logout, {
        client_id: username,
        client_secret: password,
        grant_type: "client_credentials",
      });

      if (res.status === 200) {
        login(res.data);
      }
    } else {
      toaster.create({
        title: "Erro",
        description: "Usuário ou senha inválidos",
        type: "error",
        duration: 1500,
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
        <StForm label="Entrar" onClick={handleLogin} loading={loading}>
          <StInput id="username" label="Usuário" style={{ marginBottom: "15px" }} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Digite seu usuário" />
          <StInput id="password" label="Senha" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Digite sua senha" />
          {enableRecaptcha && <ReCAPTCHA style={{ marginTop: "20px" }}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            onChange={setRecaptchaValue}
          />}
          <div style={{ marginTop: "20px" }}></div>
        </StForm>
      </Box>
    </Box>
  );
};

export default Login;
