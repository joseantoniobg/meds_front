import { useAuth } from "@/contexts/auth.context";
import performRequest from "@/lib/handleRequest";
import { useEffect, useRef, useState } from "react";
import { toaster } from "../ui/toaster";
import { Box, CloseButton, createListCollection, Dialog, Portal, Select, Table, useDialog, useSelect } from "@chakra-ui/react";
import StForm from "../Form/StForm";
import StInput from "../Input/StInput";
import StButton from "../Button/StButton";
import StPagination from "../Pagination/StPagination";

export default function Meds() {
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
    <Box display={"contents"}
    width={"100%"}>
      <StForm horizontal label="Pesquisar" onClick={() => page != 1 ? setPage(1) : handleRequest()} loading={loading}>
        <StInput id="name" label="Nome" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do Medicamento" />
      </StForm>
         <div style={{ display: "flex", marginBottom: "10px", justifyContent: "space-between", alignItems: "center" }}>
                <Dialog.RootProvider value={dialog}>
                  <Dialog.Trigger asChild>
                    <StButton label="Novo Medicamento" loading={false} type="button" />
                  </Dialog.Trigger>
                  <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                      <Dialog.Content ref={contentRef}>
                        <Dialog.Header>
                          <Dialog.Title>Novo Medicamento</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                          <StInput id="mewMed" label="Nome" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nome do Medicamento" />
                          <Select.RootProvider value={useMethodSelect} size="sm" width="320px">
                            <Select.HiddenSelect />
                            <Select.Label>Modo de uso</Select.Label>
                            <Select.Control>
                              <Select.Trigger>
                                <Select.ValueText placeholder="Selecione o modo de uso" />
                              </Select.Trigger>
                              <Select.IndicatorGroup>
                                <Select.Indicator />
                              </Select.IndicatorGroup>
                            </Select.Control>
                            <Portal container={contentRef}>
                              <Select.Positioner>
                                <Select.Content>
                                  {useMethods.items.map((um) => (
                                    <Select.Item item={um} key={um.value}>
                                      {um.label}
                                      <Select.ItemIndicator />
                                    </Select.Item>
                                  ))}
                                </Select.Content>
                              </Select.Positioner>
                            </Portal>
                          </Select.RootProvider>
                        </Dialog.Body>
                        <Dialog.Footer>
                          <StButton label="Salvar" loading={loading} onClick={handleSave} type="button" />
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                          <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                      </Dialog.Content>
                    </Dialog.Positioner>
                  </Portal>
                </Dialog.RootProvider>
                  <h4 style={{ textAlign: "right", paddingBottom: "10px" }}>Exibindo página {meds.page} - Total: {meds.totalRecords} Medicamentos</h4>
                </div>
        <Table.Root key={"MedsTable"} size="sm" variant={"outline"}>
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
            {meds.content.map((med) => (
              <Table.Row key={med.id}>
                <Table.Cell>{med.name}</Table.Cell>
                <Table.Cell>{med.useMethod}</Table.Cell>
                <Table.Cell><StButton label="Editar" loading={false} onClick={() => handleEdit(med.id, med.name, med.useMethod)} type="button" /></Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        <StPagination page={page} setPage={setPage} totalRecords={meds.totalRecords} size={size} />
    </Box>
  );
}