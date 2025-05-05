import { useAuth } from "@/contexts/auth.context";
import performRequest from "@/lib/handleRequest";
import { useEffect, useState } from "react";
import { toaster } from "../ui/toaster";
import { Accordion, Avatar, Badge, Box, Button, Card, Checkbox, CloseButton, Dialog, Portal, Span, Spinner, Table, useDialog } from "@chakra-ui/react";
import StForm from "../Form/StForm";
import StInput from "../Input/StInput";
import StButton from "../Button/StButton";
import StPagination from "../Pagination/StPagination";
import { daysBetween, formatDate, formatStringDate, formatStringDateToISO, getCurrentDateDDMMYYYY, getCurrentDateYYYYMMDD } from "@/lib/utils";
import ConfirmDialog from "../confirmDialog/ConfirmDialog";
import { StCheckBox } from "../StCheckBox/StCheckBox";
import { FaAt, FaBan, FaCalendarTimes, FaPlus, FaPrint, FaSearch } from "react-icons/fa";
import { FaPencil, FaVirusCovid, FaVirusCovidSlash } from "react-icons/fa6";
import ItemsPerPage from "../ItemsPerPage/ItemsPerPage";
import styles from "./Patients.module.scss";
import StNumberInput from "../StNumberInput/StNumberInput";

type Props = {
  selectedPatient?: string;
  setSelectedPatient?: (patient: string) => void;
  patientName?: string;
  setPatientName?: (name: string) => void;
};

export default function Patients({ selectedPatient, setSelectedPatient, patientName, setPatientName }:Props) {
  const [name, setName] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [id, setId] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [selectedMedicalPrescriptions, setSelectedMedicalPrescriptions] = useState<string[]>([]);
  const [date, setDate] = useState<string>(getCurrentDateDDMMYYYY());
  const [onlyValid, setOnlyValid] = useState<boolean>(false);
  const [renewal, setRenewal] = useState<number>(0);

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

    const res = await performRequest("GET",`/api/patients?page=${page}&size=${size}&name=${name}${onlyValid ? '&status=1' : ''}`, {
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
      id: id === '' ? undefined : id,
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

    if (selectedMedicalPrescriptions.length === 0 && medicalPrescriptionId === '') {
      filters.push(`status=1`);
    }

    if (renewal > 0) {
      filters.push(`renewal=${renewal}`);
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
    setDate(getCurrentDateDDMMYYYY());
    setRenewal(0);
  }

  return (
    <Box display={"contents"}>
      <StForm horizontal label="" icon={<FaSearch />}  onClick={() => page != 1 ? setPage(1) : handleRequest()} loading={loading}>
        <StInput id="name" label="Nome" value={name} onKeyDown={(e) => { if(e.key === 'Enter') page != 1 ? setPage(1) : handleRequest()}} onChange={(e) => setName(e.target.value)} placeholder="Nome do Paciente" />
        <StCheckBox label="Mostrar Apenas Receitas Válidas" value={onlyValid} setValue={setOnlyValid} marginTop="20px" />
      </StForm>
      {loading &&
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} height={"50vh"}>
              <Spinner color="colorPalette.600" colorPalette={"teal"} size={"lg"} />
            </Box>}
        {!loading && <><div style={{ display: "flex", gap: "10px", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
        <div style={{ display: "flex", marginBottom: "10px", justifyContent: "space-between", gap: "10px", alignItems: "center" }}>
            <Dialog.RootProvider value={dialog}>
              <Dialog.Trigger style={{ marginTop: "15px" }} asChild>
                <StButton style={{ marginTop: "25px" }} label="Paciente" colorPalette="green" loading={false} type="button" icon={<FaPlus />} />
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
            <>
              <Badge colorPalette={"blue"} size={"lg"} style={{ marginLeft: "20px", marginTop: "25px" }}>{`${selectedMedicalPrescriptions.length} Receita(s) Selecionada(s)`}</Badge>
              <StInput rootStyle={{ width: "120px" }} id="date" label="Data de Emissão:" value={date} onChange={(e) => setDate(formatStringDate(e.target.value))} mask="99/99/9999" />
              <StNumberInput style={{ width: "130px" }} value={renewal} setValue={setRenewal} label="Dias Renovação:" />
              <StButton label="" icon={<FaPrint />} loading={false} style={{ marginTop: "24px" }} type="button" onClick={() => handlePrint('', '')} disabled={selectedMedicalPrescriptions.length === 0} />
            </>
          </div>
          <Box display={"flex"} gap={"10px"} alignItems={"center"} justifyContent={"center"}>
            <h4 style={{ textAlign: "right" }}>Exibindo página {patients.page} - Total: {patients.totalRecords} Pacientes</h4>
            <ItemsPerPage value={size} onChange={setSize} />
          </Box>
        </div>
        <Accordion.Root collapsible>
            {patients?.content && patients.content.map((patient) => (
                      <Accordion.Item key={patient.id} value={patient.name}>
                        <Box display="flex" gap="10px" alignItems="center" justifyContent="space-between" padding={"10px 20px"}>
                              {setSelectedPatient && <StCheckBox label={""} value={selectedPatient === patient.id} setValue={() => {
                                if(setSelectedPatient) setSelectedPatient(patient.id)
                                if(setPatientName) setPatientName(patient.name)
                              }} />}
                          <Accordion.ItemTrigger>
                              <Span>{patient.name}</Span>
                            <Accordion.ItemIndicator />
                          </Accordion.ItemTrigger>
                          <StButton label="" icon={<FaPencil />}  loading={false} onClick={() => handleEdit(patient.id, patient.name)} type="button" />
                          <StButton label="" icon={<FaPrint />}  colorPalette="blue" loading={false} onClick={() => handlePrint(patient.id, '')} type="button" />
                        </Box>
                        <Accordion.ItemContent>
                            {patient.prescriptions.length === 0 && <p style={{margin: "30px" }}>Paciente sem receitas</p>}
                            {patient.prescriptions.some((p) => p.type.id === 2) && <Badge style={{ marginLeft: "10px" }} size={"lg"} colorPalette={"yellow"}><FaVirusCovid/> Atenção: Paciente com Receita Azul</Badge>}
                            {patient.prescriptions.length > 0 && <Box className={styles.mps}>
                                {patient.prescriptions.map((p, index: number) => (<Card.Root key={p.id}>
                                  <Card.Body gap="2">
                                    <Card.Title mt="2">
                                       <Checkbox.Root onChange={(e) => handleSelectMP(p.id, e)} colorPalette={"green"} checked={selectedMedicalPrescriptions.includes(p.id)}>
                                          <Checkbox.HiddenInput />
                                          <Checkbox.Control style={{ margin: "3px 5px 0 0", border: "1px solid #aaa" }} />
                                        </Checkbox.Root> Receita #{index + 1}
                                      </Card.Title>
                                      <Box display="flex" gap="10px" alignItems="flex-start" flexDirection={"column"} paddingBottom={"25px"} paddingTop={"5px"}>
                                        <Box display="flex" gap="10px" alignItems="center">
                                          <Badge style={{ flexGrow: 0 }} colorPalette={p.status.id === 1 ? "green" : "red"}>{p.status.description}</Badge>
                                          {p.type.id === 2 && <Badge style={{ flexGrow: 0 }} colorPalette={"blue"}>Receita Azul</Badge>}
                                          {p.renewalDate && <Badge style={{ flexGrow: 0 }} colorPalette="yellow"><FaPrint />{`Renova em ${daysBetween(getCurrentDateYYYYMMDD(), p.renewalDate)} dias`}</Badge>}
                                        </Box>
                                        <p>Última Impressão: {formatDate(p.lastPrinted)}</p>
                                        <p>Renovação: {p.renewal} dias</p>
                                        <p>Renova em: {formatDate(p.renewalDate, true)}</p>
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
                                          <Table.Row key={p.id + m.idMedicine}>
                                            <Table.Cell>{m.medicine.name}</Table.Cell>
                                            <Table.Cell>{m.quantity}</Table.Cell>
                                            <Table.Cell>{m.instructionOfUse}</Table.Cell>
                                        </Table.Row>))}
                                        </Table.Body>
                                      </Table.Root>
                                  </Card.Body>
                                  <Card.Footer justifyContent="flex-end">
                                    <ConfirmDialog key={p.id + 'dia'} handleConfirm={() => handleCancel(p.id)} title="Cancelar Receita" question="Deseja realmente cancelar a receita?" loading={loading}>
                                      <StButton key={p.id + 'btnCancel'} icon={<FaBan />} label="Cancelar" loading={loading} colorPalette={"red"} onClick={() => {}} />
                                    </ConfirmDialog>
                                    <StButton key={p.id + 'btnPrint'} style={{ marginTop: "12px" }} label="Imprimir" loading={false} icon={<FaPrint />} onClick={() => handlePrint('', p.id)} />
                                  </Card.Footer>
                              </Card.Root>))}
                            </Box>}
                        </Accordion.ItemContent>
                      </Accordion.Item>
            ))}
        </Accordion.Root>
        <StPagination page={page} setPage={setPage} totalRecords={patients.totalRecords} size={size} siblingCount={setSelectedPatient ? 1 : 4} /></>}
    </Box>
  );
}