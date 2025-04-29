import { useAuth } from "@/contexts/auth.context";
import performRequest from "@/lib/handleRequest";
import { useEffect, useState } from "react";
import { toaster } from "../ui/toaster";
import { Box, Table } from "@chakra-ui/react";
import StForm from "../Form/StForm";
import StInput from "../Input/StInput";
import StButton from "../Button/StButton";
import StPagination from "../Pagination/StPagination";

export default function Meds() {
  const [name, setName] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
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

  const handleEdit = (id: string) => {

  }

  const columns = ["Nome", "Modo de Uso", "Ações"];

  return (
    <Box display={"contents"}
    width={"100%"}>
      <StForm horizontal label="Pesquisar" onClick={() => page != 1 ? setPage(1) : handleRequest()} loading={loading}>
        <StInput id="name" label="Nome" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do Medicamento" />
      </StForm>
        <h4 style={{ textAlign: "right", paddingBottom: "20px" }}>Exibindo página {meds.page} - Total: {meds.totalRecords} Medicamentos</h4>
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
                <Table.Cell><StButton label="Editar" loading={false} onClick={() => handleEdit(med.id)} type="button" /></Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        <StPagination page={page} setPage={setPage} totalRecords={meds.totalRecords} size={size} />
    </Box>
  );
}