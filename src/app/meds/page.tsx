"use client"; // Ensure this is added to mark the file as a client component

import Meds from "@/components/Meds/Meds";
import StPage from "@/components/StPage/StPage";

const MedsPage: React.FC = () => {
  return (
    <StPage title="Medicamentos">
      <Meds />
    </StPage>
  );
};

export default MedsPage;
