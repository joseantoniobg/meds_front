import { useAuth } from "@/contexts/auth.context";
import performRequest from "@/lib/handleRequest";
import { useEffect, useState } from "react";
import { toaster } from "../ui/toaster";
import { Accordion, Avatar, Badge, Box, Button, Card, Checkbox, CloseButton, Dialog, Portal, Span, Table, useDialog } from "@chakra-ui/react";
import StForm from "../Form/StForm";
import StInput from "../Input/StInput";
import StButton from "../Button/StButton";
import StPagination from "../Pagination/StPagination";
import { formatDate, formatStringDate } from "@/lib/utils";
import ConfirmDialog from "../confirmDialog/ConfirmDialog";

export default function Patients() {
  const [name, setName] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [id, setId] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [selectedMedicalPrescriptions, setSelectedMedicalPrescriptions] = useState<string[]>([]);
  const [openedPatients, setOpenedPatients] = useState<string[]>(['']);
  const [date, setDate] = useState<string>(new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }));

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

  const handleSave = async () => {
    if (newName === '') {
      toaster.create({
        title: "Erro",
        description: "Informe o nome do paciente",
        type: "error",
        duration: 1500,
      })
      return;
    }

    const res = await performRequest(id === '' ? "POST" : "PATCH", `/api/patients`, {
      "Content-Type": "application/json",
    }, setLoading,
    `Paciente ${id === '' ? 'criado' : 'alterado'} com sucesso`,
    toaster,
    logout,
    {
      id,
      name: newName
    });

    if (res.status !== 200) {
      return;
    }

    dialog.setOpen(false);
    setId('');
    setNewName('');
    handleRequest();
  }

  const handleSelectMP = (id: string, e) => {
    const newMPs = [...selectedMedicalPrescriptions];
    if (e.target.checked) {
      newMPs.push(id);
    } else {
      const index = newMPs.indexOf(id);
      if (index > -1) {
        newMPs.splice(index, 1);
      }
    }
    setSelectedMedicalPrescriptions(newMPs);
  }

  const handleEdit = async (id: string, name: string) => {
    setId(id);
    setNewName(name);
    dialog.setOpen(true);
  }

  const handleCancel = async (id: string) => {
    const res = await performRequest("PATCH", `/api/mps/cancel`, {
      "Content-Type": "application/json",
    }, setLoading,
    `Receita cancelada com sucesso`,
    toaster,
    logout,
    {
      id,
      name: newName
    });
    handleRequest();
  }

  const handlePrint = async (patientId: string, medicalPrescriptionId: string) => {
    const filters = [];

    if (patientId !== '') {
      filters.push(`patientId=${patientId}`);
    }

    if (selectedMedicalPrescriptions.length > 0) {
      filters.push(`medicalPrescriptionIds=${selectedMedicalPrescriptions.join(',')}`);
    }

    if (medicalPrescriptionId !== '') {
      filters.push(`medicalPrescriptionIds=${medicalPrescriptionId}`);
      setSelectedMedicalPrescriptions([]);
    }

    if (date !== '') {
      filters.push(`date=${date.split('/').reverse().join('-')}`);
    }

    window.open(`/api/mps/print?${filters.join('&')}`, '_blank');
    setSelectedMedicalPrescriptions([]);
    setDate(new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }));
  }

  return (
    <Box display={"contents"}>
      <StForm horizontal label="Pesquisar" onClick={() => page != 1 ? setPage(1) : handleRequest()} loading={loading}>
        <StInput id="name" label="Nome" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do Paciente" />
      </StForm>
        <div style={{ display: "flex", marginBottom: "10px", justifyContent: "space-between", gap: "10px", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-start", alignItems: "center", marginTop: "10px" }}>
            <Dialog.RootProvider value={dialog}>
              <Dialog.Trigger style={{ marginTop: "15px" }} asChild>
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
                      <StButton label="Salvar" loading={loading} onClick={handleSave} type="button" />
                    </Dialog.Footer>
                    <Dialog.CloseTrigger asChild>
                      <CloseButton size="sm" />
                    </Dialog.CloseTrigger>
                  </Dialog.Content>
                </Dialog.Positioner>
              </Portal>
            </Dialog.RootProvider>
            <Badge colorPalette={"blue"} size={"lg"} style={{ marginLeft: "40px", marginTop: "25px" }}>{`${selectedMedicalPrescriptions.length} Receita(s) Selecionada(s)`}</Badge>
            <StInput rootStyle={{ width: "130px" }} id="date" label="Data de Emissão:" value={date} onChange={(e) => setDate(formatStringDate(e.target.value))} mask="99/99/9999" />
            <StButton label="Imprimir" loading={false} style={{ marginTop: "20px" }} type="button" onClick={() => handlePrint('', '')} disabled={selectedMedicalPrescriptions.length === 0} />
          </div>
          <h4 style={{ textAlign: "right", paddingTop: "25px" }}>Exibindo página {patients.page} - Total: {patients.totalRecords} Pacientes</h4>
        </div>
        <Accordion.Root collapsible onValueChange={(e) => setOpenedPatients(e.value)}>
            {patients.content.map((patient) => (
                      <Accordion.Item key={patient.id} value={patient.name}>
                        <Accordion.ItemTrigger>
                            <Span flex="1">{patient.name}</Span>
                            <StButton label="Editar" loading={false} onClick={() => handleEdit(patient.id, patient.name)} type="button" />
                            <StButton label="Imprimir" colorPalette="blue" loading={false} onClick={() => handlePrint(patient.id, '')} type="button" />
                          <Accordion.ItemIndicator />
                        </Accordion.ItemTrigger>
                        <Accordion.ItemContent>
                            {patient.prescriptions.length === 0 && <p>Paciente sem receitas</p>}
                            {(patient.prescriptions.length > 0 && patient.name === openedPatients[0]) && <Box style={{ display: "grid", gap: "10px", padding: "10px", gridTemplateColumns: "repeat(3, minmax(500px, auto)" }}>
                                {patient.prescriptions.map((p, index: number) => (<Card.Root key={p.id}>
                                  <Card.Body gap="2">
                                    <Card.Title mt="2">
                                       <Checkbox.Root onChange={(e) => handleSelectMP(p.id, e)} colorPalette={"green"} checked={selectedMedicalPrescriptions.includes(p.id)}>
                                          <Checkbox.HiddenInput />
                                          <Checkbox.Control style={{ margin: "3px 5px 0 0", border: "1px solid #aaa" }} />
                                        </Checkbox.Root> Receita #{index + 1}
                                      </Card.Title>
                                      <Box display="flex" gap="10px" alignItems="flex-start" flexDirection={"column"} paddingBottom={"20px"}>
                                        <Badge style={{ flexGrow: 0 }} colorPalette={p.status.id === 1 ? "green" : "red"}>{p.status.description}</Badge>
                                        <p>Data Inicial: {formatDate(p.initialDate)}</p>
                                        <p>Renovação: {p.renewal} dias</p>
                                      </Box>
                                      <Table.Root key={"patientsTable"} size="sm" variant={"outline"}>
                                                          <Table.Header>
                                                            <Table.Row>
                                                                <Table.ColumnHeader key="medicamento">
                                                                  Medicamento
                                                                </Table.ColumnHeader>
                                                                <Table.ColumnHeader key="qtd">
                                                                  Quantidade
                                                                </Table.ColumnHeader>
                                                                <Table.ColumnHeader key="uso">
                                                                  Forma de Uso
                                                                </Table.ColumnHeader>
                                                            </Table.Row>
                                                          </Table.Header>
                                                          <Table.Body>
                                        {p.medicines.map((m: any) => (
                                          <Table.Row key={p.id + m.id}>
                                            <Table.Cell>{m.medicine.name}</Table.Cell>
                                            <Table.Cell>{m.quantity}</Table.Cell>
                                            <Table.Cell>{m.instructionOfUse}</Table.Cell>
                                        </Table.Row>))}
                                        </Table.Body>
                                      </Table.Root>
                                  </Card.Body>
                                  <Card.Footer justifyContent="flex-end">
                                    <ConfirmDialog key={p.id + 'dia'} label="Cancelar" handleConfirm={() => handleCancel(p.id)} title="Cancelar Receita" question="Deseja realmente cancelar a receita?" loading={loading}>
                                      <Button key={p.id+'cancb'} loading={loading} colorPalette={"red"}>Cancelar</Button>
                                    </ConfirmDialog>
                                    <Button style={{ marginTop: "12px" }} onClick={() => handlePrint('', p.id)}>Imprimir</Button>
                                  </Card.Footer>
                              </Card.Root>))}
                            </Box>}
                        </Accordion.ItemContent>
                      </Accordion.Item>
            ))}
        </Accordion.Root>
        <StPagination page={page} setPage={setPage} totalRecords={patients.totalRecords} size={size} />
    </Box>
  );
}