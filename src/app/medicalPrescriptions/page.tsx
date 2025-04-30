"use client";

import { useAuth } from "@/contexts/auth.context";
import performRequest from "@/lib/handleRequest";
import { useEffect, useRef, useState } from "react";
import { toaster } from "@/components/ui/toaster";
import { Box, CloseButton, createListCollection, Dialog, Portal, Select, Table, useDialog, useSelect } from "@chakra-ui/react";
import StForm from "@/components/Form/StForm";
import StInput from "@/components/Input/StInput";
import Patients from "@/components/Patients/Patients";
import Meds from "@/components/Meds/Meds";
import StPage from "@/components/StPage/StPage";

export default function MedicalPrescriptions() {
  const [name, setName] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);

  const [id, setId] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [useMethod, setUseMethod] = useState<string>('');

  const dialog = useDialog();

  const [meds, setMeds] = useState<any>({
    content: [],
    totalRecords: 0,
    totalPages: 0,
    page: 1,
    size: 10
  });

  const [loading, setLoading] = useState<boolean>(false);
  const { logout } = useAuth();

  const handleRequest = async () => {
    setLoading(true);

    const res = await performRequest("GET",`/api/meds?page=${page}&size=${size}&name=${name}`, {
            "Content-Type": "application/json",
          }, setLoading,
          "Dados carregados com sucesso",
          toaster,
          logout);

    setMeds(res.data);
    setLoading(false);
  };

  useEffect(() => {
    handleRequest();
  }
  , [page, size]);

  const columns = ["Nome", "Modo de Uso", "Ações"];

  const useMethods = createListCollection({
    items: [
      { label: "USO ORAL", value: "USO ORAL" },
      { label: "USO TOPICO", value: "USO TOPICO" },
      { label: "USO OFTALMICO", value: "USO OFTALMICO" },
      { label: "USO INALATORIO", value: "USO INALATORIO" },
      { label: "USO SUBCUTANEO", value: "USO SUBCUTANEO" },
      { label: "USO INTRAMUSCULAR", value: "USO INTRAMUSCULAR" },
    ],
  });

  const useMethodSelect = useSelect({
    collection: useMethods,
    onValueChange: (value) => {
      setUseMethod(value.value[0]);
    },
  });

  const handleSave = async () => {
    if (newName === '') {
      toaster.create({
        title: "Erro",
        description: "Informe o nome do medicamento",
        type: "error",
        duration: 1500,
      })
      return;
    }

    if (useMethod === '') {
      toaster.create({
        title: "Erro",
        description: "Selecione a forma de uso do medicamento",
        type: "error",
        duration: 1500,
      })
      return;
    }

    const res = await performRequest(id === '' ? "POST" : "PATCH",`/api/meds`, {
      "Content-Type": "application/json",
    }, setLoading,
    `Medicamento ${id === '' ? 'salvo' : 'atualizado'} com sucesso`,
    toaster,
    logout,
    {
      id,
      name: newName,
      useMethod,
    });

  if (res.status !== 200) {
    return;
  }

  dialog.setOpen(false);
  useMethodSelect.clearValue();
  setId('');
  setNewName('');
  setUseMethod('');
  handleRequest();
}

  const handleEdit = async (id: string, name: string, useMethod: string) => {
    setId(id);
    setNewName(name);
    setUseMethod(useMethod);
    useMethodSelect.value[0] = useMethod;
    dialog.setOpen(true);
  }

  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <StPage>
      <Box display={"contents"} width={"100%"}>
        <StForm horizontal label="Pesquisar" onClick={() => page != 1 ? setPage(1) : handleRequest()} loading={loading}>
          <StInput id="name" label="Nome" value={name} onChange={(e) => setName(e.target.value)} placeholder="Paciente" />
        </StForm>
          {/* <Box style={{ display: "flex", marginBottom: "10px", alignItems: "top", justifyContent: "center", gap: "20px" }}>
            <Box style={{ maxHeight: "300px", overflowY: "scroll", padding: "20px", flexGrow: 1, border: "1px solid #222", borderRadius: "8px" }}>
                <Meds />
              </Box>
              <Box style={{ maxHeight: "300px", overflowY: "scroll", padding: "10px", flexGrow: 1 }}>
                <Patients />
              </Box>
          </Box> */}
        </Box>
    </StPage>
  );
}