"use client";

import { CloseButton, Dialog, Portal } from "@chakra-ui/react";
import StButton from "../Button/StButton";
import { useState } from "react";

interface CustomInputProps {
  key: string;
  label: string;
  children: React.ReactNode;
  handleConfirm: () => void;
  title: string;
  question: string;
  loading: boolean;
}

export default function ConfirmDialog({ key, label, children, handleConfirm, title, question, loading }: CustomInputProps) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root key={key} open={open} onOpenChange={(d) => setOpen(d.open)}>
    <Dialog.Trigger style={{ marginTop: "15px" }} asChild>
      {children}
    </Dialog.Trigger>
    <Portal>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>{title}</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            {question}
          </Dialog.Body>
          <Dialog.Footer>
            <StButton loading={loading} label="Confirmar" onClick={async () => {
              await handleConfirm();
              setOpen(false);
            }} type="button" />
          </Dialog.Footer>
          <Dialog.CloseTrigger asChild>
            <CloseButton size="sm" />
          </Dialog.CloseTrigger>
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  </Dialog.Root>
  );
}
