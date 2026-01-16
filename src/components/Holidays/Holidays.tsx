import { useAuth } from "@/contexts/auth.context";
import performRequest from "@/lib/handleRequest";
import { useEffect, useRef, useState } from "react";
import { toaster } from "../ui/toaster";
import { Box, CloseButton, Dialog, Portal, Spinner, Table, useDialog } from "@chakra-ui/react";
import StForm from "../Form/StForm";
import StInput from "../Input/StInput";
import StButton from "../Button/StButton";
import StPagination from "../Pagination/StPagination";
import { formatDate, formatStringDate, formatStringDateToISO } from "@/lib/utils";
import { FaPlus, FaSearch } from "react-icons/fa";
import { FaPencil, FaTrashCan } from "react-icons/fa6";
import ItemsPerPage from "../ItemsPerPage/ItemsPerPage";
import ConfirmDialog from "../confirmDialog/ConfirmDialog";

export default function Holidays() {
  const [description, setDescription] = useState<string>("");
  const [filterDate, setFilterDate] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);

  const [editingDate, setEditingDate] = useState<string>("");
  const [newDate, setNewDate] = useState<string>("");
  const [newDescription, setNewDescription] = useState<string>("");

  const dialog = useDialog();
  const user = useAuth().user;
  const { logout } = useAuth();

  const [holidays, setHolidays] = useState<any>({
    content: [],
    totalRecords: 0,
    totalPages: 0,
    page: 1,
    size: 10,
  });

  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async () => {
    setLoading(true);

    const dateParam = filterDate.length === 10 ? formatStringDateToISO(filterDate) : '';

    const res = await performRequest("GET", `/api/holidays?page=${page}&size=${size}&description=${description}&date=${dateParam}`, {
      "Content-Type": "application/json",
    }, setLoading,
    "Dados carregados com sucesso",
    toaster,
    logout);

    setHolidays(res.data);
    setLoading(false);
  };

  useEffect(() => {
    handleRequest();
  }, [page, size]);

  const handleSave = async () => {
    if (newDescription.trim() === '') {
      toaster.create({
        title: "Erro",
        description: "Informe a descrição do feriado",
        type: "error",
        duration: 1500,
      });
      return;
    }

    const dateValue = editingDate !== '' ? editingDate : formatStringDateToISO(newDate);

    if (!dateValue || dateValue.length < 10) {
      toaster.create({
        title: "Erro",
        description: "Informe a data do feriado",
        type: "error",
        duration: 1500,
      });
      return;
    }

    const res = await performRequest(editingDate === '' ? "POST" : "PATCH", `/api/holidays`, {
      "Content-Type": "application/json",
    }, setLoading,
    `Feriado ${editingDate === '' ? 'salvo' : 'atualizado'} com sucesso`,
    toaster,
    logout,
    {
      date: dateValue,
      description: newDescription,
    });

    if (res.status !== 200) {
      return;
    }

    dialog.setOpen(false);
    setEditingDate('');
    setNewDate('');
    setNewDescription('');
    handleRequest();
  };

  const handleEdit = async (date: string, description: string) => {
    setEditingDate(date);
    setNewDate(formatDate(date));
    setNewDescription(description);
    dialog.setOpen(true);
  };

  const handleDelete = async (date: string) => {
    const res = await performRequest("DELETE", `/api/holidays`, {
      "Content-Type": "application/json",
    }, setLoading,
    "Feriado removido com sucesso",
    toaster,
    logout,
    { date });

    if (res.status !== 200) {
      return;
    }

    handleRequest();
  };

  const contentRef = useRef<HTMLDivElement>(null);

  const columns = ["Data", "Descrição", "Ações"];

  return (
    <Box display={"contents"} width={"100%"}>
      <StForm horizontal label="" icon={<FaSearch />} onClick={() => page !== 1 ? setPage(1) : handleRequest()} loading={loading}>
        <StInput id="filterDate" label="Data" value={filterDate} onKeyDown={(e) => { if (e.key === 'Enter') page !== 1 ? setPage(1) : handleRequest(); }} onChange={(e) => setFilterDate(formatStringDate(e.target.value))} placeholder="Data do Feriado" mask="99/99/9999" />
        <StInput id="description" label="Descrição" value={description} onKeyDown={(e) => { if (e.key === 'Enter') page !== 1 ? setPage(1) : handleRequest(); }} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição do Feriado" maxLength={50} />
      </StForm>

      {loading &&
        <Box display={"flex"} justifyContent={"center"} alignItems={"center"} height={"50vh"}>
          <Spinner color="colorPalette.600" colorPalette={"teal"} size={"lg"} />
        </Box>}

      {!loading && <>
        <div style={{ display: "flex", margin: "10px 0", justifyContent: "space-between", alignItems: "end" }}>
          <Dialog.RootProvider value={dialog}>
            {!user?.readOnly && <Dialog.Trigger asChild>
              <StButton icon={<FaPlus />} colorPalette="green" label="Feriado" loading={false} type="button" />
            </Dialog.Trigger>}
            <Portal>
              <Dialog.Backdrop />
              <Dialog.Positioner>
                <Dialog.Content ref={contentRef}>
                  <Dialog.Header>
                    <Dialog.Title>Novo Feriado</Dialog.Title>
                  </Dialog.Header>
                  <Dialog.Body>
                    <StInput
                      id="holidayDate"
                      label="Data"
                      value={newDate}
                      onChange={(e) => {
                        if (editingDate !== '') return;
                        setNewDate(formatStringDate(e.target.value));
                      }}
                      placeholder="Data do Feriado"
                      mask="99/99/9999"
                      style={editingDate !== '' ? { background: '#f5f5f5', cursor: 'not-allowed' } : undefined}
                    />
                    <StInput
                      id="holidayDesc"
                      label="Descrição"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Descrição do Feriado"
                      maxLength={50}
                    />
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
          <Box display={"flex"} gap={"10px"} alignItems={"center"} justifyContent={"center"}>
            <h4 style={{ textAlign: "right" }}>Exibindo página {holidays.page} - Total: {holidays.totalRecords} Feriados</h4>
            <ItemsPerPage value={size} onChange={setSize} />
          </Box>
        </div>
        <Table.Root key={"HolidaysTable"} size="sm" variant={"outline"}>
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
            {holidays.content.map((holiday) => (
              <Table.Row key={holiday.date}>
                <Table.Cell>{formatDate(holiday.date)}</Table.Cell>
                <Table.Cell>{holiday.description}</Table.Cell>
                <Table.Cell>
                  {!user?.readOnly && <Box display={"flex"} gap={"8px"}>
                    <StButton label="" icon={<FaPencil />} colorPalette="blue" loading={false} onClick={() => handleEdit(holiday.date, holiday.description)} type="button" />
                    <ConfirmDialog
                      keyName={holiday.date + 'del'}
                      handleConfirm={() => handleDelete(holiday.date)}
                      title="Remover Feriado"
                      question="Deseja realmente remover este feriado?"
                      loading={loading}
                    >
                      <StButton label="" icon={<FaTrashCan />} colorPalette="red" loading={false} type="button" />
                    </ConfirmDialog>
                  </Box>}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        <StPagination page={page} setPage={setPage} totalRecords={holidays.totalRecords} size={size} siblingCount={4} />
      </>}
    </Box>
  );
}
