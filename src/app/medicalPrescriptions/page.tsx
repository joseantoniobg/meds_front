"use client";

import { useAuth } from "@/contexts/auth.context";
import performRequest from "@/lib/handleRequest";
import { useEffect, useRef, useState } from "react";
import { toaster } from "@/components/ui/toaster";
import { Badge, Box, CloseButton, createListCollection, Dialog, Field, NumberInput, Portal, Select, Table, useDialog, useSelect } from "@chakra-ui/react";
import StForm from "@/components/Form/StForm";
import StInput from "@/components/Input/StInput";
import Patients from "@/components/Patients/Patients";
import Meds from "@/components/Meds/Meds";
import StPage from "@/components/StPage/StPage";
import { formatStringDate, formatStringDateToISO, getCurrentDateDDMMYYYY } from "@/lib/utils";
import StButton from "@/components/Button/StButton";
import { Step } from "@/components/Step/Step";
import { StepBox } from "@/components/StepBox/StepBox";
import ConfirmDialog from "@/components/confirmDialog/ConfirmDialog";
import { FaBookMedical, FaEye, FaEyeDropper, FaPrint, FaReceipt, FaRegWindowClose } from "react-icons/fa";
import { FaEyeLowVision, FaFloppyDisk, FaTrashCan } from "react-icons/fa6";
import styles from "./MedicalPrescriptions.module.scss";
import StNumberInput from "@/components/StNumberInput/StNumberInput";
import { StCheckBox } from "@/components/StCheckBox/StCheckBox";
import { StTextArea } from "@/components/TextArea/StTextArea";

export default function MedicalPrescriptions() {
  const { logout } = useAuth();

  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [patientName, setPatientName] = useState<string>("");

  const [initialDate, setInitialDate] = useState<string>(getCurrentDateDDMMYYYY());
  const [renewal, setRenewal] = useState<number>(28);
  const [medications, setMedications] = useState<{ id: string, name: string, quantity: string, instructionOfUse: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [idMedicalPrescriptions, setIdMedicalPrescriptions] = useState<string[]>([]);
  const [blue, isBlue] = useState<boolean>(false);
  const [showMeds, setShowMeds] = useState<boolean>(false);

  const handleSelectedPatient = (patient: string) => {
    if (patient === selectedPatient) {
      setSelectedPatient("");
      setPatientName("");
      return;
    }
    setSelectedPatient(patient);
  }

  const handleMedications = (id :string, name: string) =>{
    if (medications.some(med => med.id === id)) {
      setMedications((prev) => prev.filter(med => med.id !== id));
      return;
    }

    setMedications((prev) => [...prev, { id, name, quantity: "", instructionOfUse: "" }]);
  }

  const removeMed = (id: string) => {
    setMedications((prev) => prev.filter(med => med.id !== id));
  }

  const alterMedData = (id: string, quantity: string, instructionOfUse: string) => {
    const med = medications.find(med2 => med2.id === id);
    if (!med) return;
    setMedications((prev) => [...prev.filter(med2 => med2.id !== id), { id, name: med.name, quantity, instructionOfUse }]);
  }

  const handleSave = async () => {
      if (selectedPatient === '') {
        toaster.create({
          title: "Erro",
          description: "Selecione o paciente",
          type: "error",
          duration: 1500,
        })
        return;
      }

      if (medications.length === 0) {
        toaster.create({
          title: "Erro",
          description: "Selecione algum medicamento",
          type: "error",
          duration: 1500,
        })
        return;
      }

      if (medications.some(med => med.quantity === '' || med.instructionOfUse === '')) {
        toaster.create({
          title: "Erro",
          description: "Preencha todos os campos de medicação",
          type: "error",
          duration: 1500,
        })
        return;
      }

      if (initialDate.length < 10) {
        toaster.create({
          title: "Erro",
          description: "Informe a data de emissão",
          type: "error",
          duration: 1500,
        })
        return;
      }

      const res = await performRequest("POST", `/api/mps`, {
        "Content-Type": "application/json",
      }, setLoading,
      `Receita salva com sucesso`,
      toaster,
      logout,
      {
        patientId: selectedPatient,
        initialDate: formatStringDateToISO(initialDate),
        renewal,
        medicines: medications,
        blue,
      });

    if (res.status !== 200) {
      return;
    }

    setIdMedicalPrescriptions((prev) => [...prev, res.data.id]);
  }

  const handlePrint = async () => {
    if (idMedicalPrescriptions.length === 0) {
      toaster.create({
        title: "Erro",
        description: "Crie ao menos uma receita médica",
        type: "error",
        duration: 1500,
      })
      return;
    }

    if (initialDate.length < 10) {
      toaster.create({
        title: "Erro",
        description: "Informe a data de emissão",
        type: "error",
        duration: 1500,
      })
      return;
    }

    window.open(`/api/mps/print?medicalPrescriptionIds=${idMedicalPrescriptions.join(",")}&date=${formatStringDateToISO(initialDate)}`, '_blank');
  }

  const handleDailyPrint = async (print: boolean) => {
    window.open(`/api/mps/print?dailyEmission=true&print=${print}`, '_blank');
  }

  return (
    <StPage>
      <h1 style={{ fontSize: "16px" }}>Receita Médica</h1>
      <hr style={{ margin: "10px 0" }}/>
      <Box display={"contents"} width={"100%"}>
          <Box className={styles.mainBox}>
            <Box className={styles.halfContent}>
              <Box padding={"7px"} style={{border: "1px solid #222", borderRadius: "8px"}}>
                <Box className={styles.scrollable} style={{ height: showMeds ? "380px" : "700px", overflowY: "scroll", "overflowX": "hidden", padding: "20px" }}>
                  <Box marginTop={"-30px"}>
                    <Patients selectedPatient={selectedPatient} setSelectedPatient={handleSelectedPatient} setPatientName={setPatientName} />
                  </Box>
                </Box>
              </Box>
              {showMeds &&
              <Box className={showMeds ? styles.medsBox : ''} padding={"7px"} style={{border: "1px solid #222", borderRadius: "8px"}}>
                <Box className={styles.scrollable} style={{ height: "300px", width: "100%", overflowY: "scroll", "overflowX": "hidden", padding: "20px" }}>
                  <Box marginTop={"-30px"}>
                    <Meds selectedMeds={medications} setSelectedMeds={handleMedications} />
                  </Box>
                </Box>
              </Box>}
              <Box display={"flex"} gap={"10px"} marginTop={"-25px"} alignItems={"center"} justifyContent={"space-between"}>

                <StButton style={{ marginTop: "15px" }} colorPalette={"cyan"} icon={showMeds ? <FaEyeLowVision /> : <FaEye />} label={`${!showMeds ? 'Exibir' : 'Ocultar'} Medicamentos`} loading={false} onClick={() => setShowMeds(!showMeds)} type="button" />
                <Box display={"flex"} gap={"10px"} alignItems={"center"}>
                  <ConfirmDialog keyName="confirmConference" handleConfirm={() => handleDailyPrint(false)} loading={loading} title="Conferência de Receitas" question="Deseja conferir as receitas do dia?" >
                    <StButton colorPalette={"blue"} icon={<FaEyeDropper />} label="Conferir Receitas do Dia" loading={false} />
                  </ConfirmDialog>
                  <ConfirmDialog keyName="printDaily" handleConfirm={() => handleDailyPrint(true)} loading={loading} title="Impresso de Receitas" question="Deseja imprimir as receitas do dia? Essa ação não pode ser executada novamente!" >
                    <StButton colorPalette={"orange"} icon={<FaBookMedical />} label="Imprimir Receitas do Dia" loading={false} />
                  </ConfirmDialog>
                </Box>
              </Box>
            </Box>
            <Box className={styles.halfContentRight}>
              <Box>
                <Box marginBottom={"15px"}>
                  <Box display={"flex"} flexDirection={"row"} alignItems={"center"} justifyContent={"flex-start"} gap={"10px"} marginBottom={"20px"}>
                    <Badge colorPalette={"green"} size={"lg"} style={{ marginTop: "10px" }}>{`${idMedicalPrescriptions.length} Receita(s) Emitida(s) prontas para impressão`}</Badge>
                    <StButton style={{ marginTop: "12px" }} colorPalette="red" icon={<FaTrashCan />} label="" loading={loading} onClick={() => setIdMedicalPrescriptions([])} type="button" />
                  </Box>
                  <hr style={{ margin: "0 -17px" }} />
                </Box>
                <Box display={"flex"} flexDirection={"column"} alignItems={"flex-start"} justifyContent={"center"} gap={"10px"}>
                  <StepBox>
                    <Step step={1} title="Selecione o Paciente" checked={selectedPatient !== ''} />
                    <Box display={"flex"} alignItems={"center"} flexDirection={"row"} gap={"10px"}>
                      <h3>Paciente Selecionado: {selectedPatient === '' ? 'NENHUM' : patientName}</h3>
                      {selectedPatient !== '' && <StButton variant="ghost" colorPalette={"red"} icon={<FaRegWindowClose />} label="" loading={loading} onClick={() => setSelectedPatient('')} type="button" />}
                    </Box>
                  </StepBox>
                  <Step step={2} title="Informe as medicações e formas de uso" checked={medications.some((m) => m.instructionOfUse !== '' && m.quantity !== '')} />
                  <StepBox>
                  <h3>Medicações:</h3>
                  <Box className={`${styles.medsTable} ${styles.scrollable}`}>
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
                              Instruções
                            </Table.ColumnHeader>
                            <Table.ColumnHeader key="acoes">
                              Ações
                            </Table.ColumnHeader>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                      {medications.map((med, index) => (
                        <Table.Row key={med.id}>
                          <Table.Cell>{med.name}</Table.Cell>
                          <Table.Cell><StInput id={`${index}a`} value={med.quantity} onChange={(e) => alterMedData(med.id, e.target.value, med.instructionOfUse)} placeholder="Quantidade..." label="" /></Table.Cell>
                          <Table.Cell><StTextArea id={`${index}b`} value={med.instructionOfUse} onChange={(e) => alterMedData(med.id, med.quantity, e.target.value)}  placeholder="Forma de Uso..." label="" /></Table.Cell>
                          <Table.Cell>
                            <CloseButton key={med.id+"rm"} colorPalette={"red"} size="sm" onClick={() => removeMed(med.id)} />
                          </Table.Cell>
                        </Table.Row>
                      ))}
                      </Table.Body>
                    </Table.Root>
                  </Box>
                  </StepBox>
                  <StepBox>
                    <Step step={3} title="Informe os dados da receita" checked={initialDate.length === 10} />
                    <Box display={"flex"} flexDirection={"row"} alignItems={"flex-start"} justifyContent={"center"} gap={"20px"}>
                      <StInput rootStyle={{ width: "120px" }} id="date" label="Data de Emissão:" value={initialDate} onChange={(e) => setInitialDate(formatStringDate(e.target.value))} mask="99/99/9999" />
                      <StNumberInput style={{ maxWidth: "120px" }} value={renewal} setValue={setRenewal} label="Dias renovação:" />
                      <StCheckBox marginTop="35px" label="Receita Azul" value={blue} setValue={isBlue} />
                    </Box>
                  </StepBox>
                </Box>
              </Box>
              <Box>
                <hr style={{ margin: "0 -17px" }} />
                <Box display={"flex"} alignItems={"center"} gap={"10px"}>
                    <ConfirmDialog keyName="confirm" handleConfirm={handleSave} loading={loading} title="Salvar Receita" question="Deseja salvar a receita?" >
                      <StButton colorPalette="green" icon={<FaFloppyDisk />} label="Salvar" loading={loading} type="button" />
                    </ConfirmDialog>
                    <StButton style={{ marginTop: "12px" }} colorPalette="blue" icon={<FaPrint />} label="Imprimir" loading={loading} onClick={handlePrint} type="button" />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
    </StPage>
  );
}