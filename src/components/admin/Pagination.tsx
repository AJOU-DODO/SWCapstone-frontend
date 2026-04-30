import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Props {
  totalPages: number;
  currentPage: number;
}

export default function Paginaition({ totalPages, currentPage }: Props) {
  //페이지 버튼은 5개씩 보여준다
  const displayRange = 5;
  const startPage = Math.floor((currentPage - 1) / displayRange) * displayRange + 1;
  const endPage = Math.min(startPage + displayRange - 1, totalPages);

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <Pagination>
      <PaginationContent>
        {/* 이전 페이지 버튼 */}
        <PaginationItem>
          <PaginationPrevious 
            href={`/admin/users?page=${startPage - 1}`} 
            className={startPage === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink 
              href={`/admin/users?page=${page}`} 
              isActive={page === currentPage}
              className={page === currentPage ? "bg-[#2B6340] text-white hover:bg-green-700 hover:text-white" : "hover:bg-transparent"}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* 다음 페이지 버튼 */}
        <PaginationItem>
          <PaginationNext 
            href={`/admin/users?page=${endPage + 1}`}
            className={endPage >= totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}