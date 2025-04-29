"use client"; // Ensure this is added to mark the file as a client component

import Patients from "@/components/Patients/Patients";
import StPage from "@/components/StPage/StPage";

const PatientsPage: React.FC = () => {
  return (
    <StPage title="Pacientes">
      <Patients />
    </StPage>
  );
};

export default PatientsPage;
