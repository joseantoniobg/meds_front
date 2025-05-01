'use client'
import { ButtonGroup, IconButton, Pagination } from '@chakra-ui/react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

type Props = {
  totalRecords: number;
  size: number;
  setPage: (page: number) => void;
  page: number;
}

export default function StPagination({ totalRecords, size, setPage, page }: Props) {
  return (
    <div style={{ display: "flex", justifyContent: "center", paddingTop: "20px" }}>
      <Pagination.Root count={totalRecords} pageSize={size} defaultPage={1}>
        <ButtonGroup variant="ghost" size="sm">
          <Pagination.PrevTrigger asChild>
            <IconButton onClick={() => setPage(page - 1)}>
              <LuChevronLeft />
            </IconButton>
          </Pagination.PrevTrigger>

          <Pagination.Items
            render={(page) => (
              <IconButton onClick={() => setPage(page.value)} variant={{ base: "ghost", _selected: "outline" }}>
                {page.value}
              </IconButton>
            )}
          />
          <Pagination.NextTrigger asChild>
            <IconButton onClick={() => setPage(page + 1)}>
              <LuChevronRight />
            </IconButton>
          </Pagination.NextTrigger>
        </ButtonGroup>
    </Pagination.Root>
  </div>
  );
}
