"use client"; // Ensure this is added to mark the file as a client component

import Patients from "@/components/Patients/Patients";
import StPage from "@/components/StPage/StPage";
import { useState } from "react";

const PatientsPage: React.FC = () => {
  const [updatePatients, setUpdatePatients] = useState<boolean>(false);

  return (
    <StPage title="Pacientes">
      <Patients updatePatients={updatePatients} setUpdatePatients={setUpdatePatients} />
    </StPage>
  );
};

export default PatientsPage;
