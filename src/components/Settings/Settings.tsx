"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth.context";
import performRequest from "@/lib/handleRequest";
import { toaster } from "../ui/toaster";
import { StCheckBox } from "../StCheckBox/StCheckBox";

export default function Settings() {
  const { user, logout, settings, refreshSettings } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  if (user?.readOnly) {
    return <p>Você não tem permissão para acessar essa página.</p>;
  }

  const handleToggleRestrictReadOnlyPrint = async (checked: boolean) => {
    const { status } = await performRequest("PATCH", "/api/settings", {
      "Content-Type": "application/json",
    }, setLoading,
    "Configuração atualizada com sucesso",
    toaster,
    logout,
    { restrictReadOnlyPrint: checked });

    if (status >= 200 && status < 300) await refreshSettings();
  };

  return (
    <StCheckBox
      label="Restringir impressão para usuários somente leitura"
      value={!!settings?.restrictReadOnlyPrint}
      setValue={handleToggleRestrictReadOnlyPrint}
      marginTop="20px"
    />
  );
}
