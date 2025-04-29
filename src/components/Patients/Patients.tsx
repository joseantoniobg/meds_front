import { useAuth } from "@/contexts/auth.context";
import performRequest from "@/lib/handleRequest";
import { useEffect, useState } from "react";
import { toaster } from "../ui/toaster";
import { Box, Button, CloseButton, Dialog, Portal, Table, useDialog } from "@chakra-ui/react";
import StForm from "../Form/StForm";
import StInput from "../Input/StInput";
import StButton from "../Button/StButton";
import StPagination from "../Pagination/StPagination";

export default function Patients() {
  const [name, setName] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [newName, setNewName] = useState<string>('');

  const [patients, setPatients] = useState<any>({
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

    const res = await performRequest("GET",`/api/patients?page=${page}&size=${size}&name=${name}`, {
            "Content-Type": "application/json",
          }, setLoading,
          "Dados carregados com sucesso",
          toaster,
          logout);

    setPatients(res.data);
    setLoading(false);
  };

  useEffect(() => {
    handleRequest();
  }
  , [page, size]);

  const columns = ["Nome", "Ações"];
  const dialog = useDialog();

  const handleEdit = async (id: string) => {
    if (newName === '') {
      toaster.create({
        title: "Erro",
        description: "Informe o nome do paciente",
        type: "error",
        duration: 3000,
      })
      return;
    }

    if (id === '') {
        const res = await performRequest("POST",`/api/patients`, {
          "Content-Type": "application/json",
        }, setLoading,
        "Paciente adicionado com sucesso",
        toaster,
        logout,
      {
        name: newName
      });

      dialog.setOpen(false);
      setNewName('');
      handleRequest();
    }
  }

  return (
    <Box display={"contents"}
    width={"100%"}>
      <StForm horizontal label="Pesquisar" onClick={() => page != 1 ? setPage(1) : handleRequest()} loading={loading}>
        <StInput id="name" label="Nome" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do Paciente" />
      </StForm>
        <div style={{ display: "flex", marginBottom: "10px", justifyContent: "space-between", alignItems: "center" }}>
        <Dialog.RootProvider value={dialog}>
          <Dialog.Trigger asChild>
            <StButton label="Novo Paciente" loading={false} type="button" />
          </Dialog.Trigger>
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>Novo Paciente</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                  <StInput id="newPatient" label="Nome" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nome do Paciente" />
                </Dialog.Body>
                <Dialog.Footer>
                  <StButton label="Salvar" loading={loading} onClick={() => handleEdit('')} type="button" />
                </Dialog.Footer>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Dialog.CloseTrigger>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.RootProvider>
          <h4 style={{ textAlign: "right", paddingBottom: "10px" }}>Exibindo página {patients.page} - Total: {patients.totalRecords} Pacientes</h4>
        </div>
        <Table.Root key={"patientsTable"} size="sm" variant={"outline"}>
          <Table.Header>
            <Table.Row>
              {columns.map((column) => (
                <Table.ColumnHeader key={column}>
                  {column}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {patients.content.map((patient) => (
              <Table.Row key={patient.id}>
                <Table.Cell>{patient.name}</Table.Cell>
                <Table.Cell><StButton label="Editar" loading={false} onClick={() => handleEdit(patient.id)} type="button" /></Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        <StPagination page={page} setPage={setPage} totalRecords={patients.totalRecords} size={size} />
    </Box>
  );
}