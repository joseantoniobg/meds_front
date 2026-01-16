"use client";

import Holidays from "@/components/Holidays/Holidays";
import StPage from "@/components/StPage/StPage";

const HolidaysPage: React.FC = () => {
  return (
    <StPage title="Feriados">
      <Holidays />
    </StPage>
  );
};

export default HolidaysPage;
