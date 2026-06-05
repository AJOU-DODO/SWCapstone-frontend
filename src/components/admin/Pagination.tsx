"use client"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { useSearchParams, usePathname } from "next/navigation";

interface PaginationProps {
  totalPages: number;
  currentPage?: number;
  onPageChange?: (pageNumber: number) => void;
}

export default function Paginaition({ totalPages, currentPage: modalCurrentPage, onPageChange }: PaginationProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentPage = modalCurrentPage ?? (Number(searchParams.get("page")) || 1)

  //페이지 버튼은 5개씩 보여준다
  const displayRange = 5;
  const startPage = Math.floor((currentPage - 1) / displayRange) * displayRange + 1;
  const endPage = Math.min(startPage + displayRange - 1, totalPages);

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const createPageURL = (pageNumber: number | string) => {
    if (onPageChange) return "#";

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`; 
  };

  const handlePageClick = (e: React.MouseEvent, pageTarget: number) => {
    if (onPageChange) {
      e.preventDefault();
      onPageChange(pageTarget);
    }
  };

  return (
    <Pagination>
      <PaginationContent>
        {/* 이전 페이지 버튼 */}
        <PaginationItem>
          <PaginationPrevious 
            href={createPageURL(startPage - 1)}
            onClick={(e) => handlePageClick(e, startPage - 1)}
            className={startPage === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink 
              href={createPageURL(page)}
              isActive={page === currentPage}
              onClick={(e) => handlePageClick(e, page)}
              className={page === currentPage ? "bg-[#2B6340] text-white hover:bg-green-700 hover:text-white" : "hover:bg-transparent"}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* 다음 페이지 버튼 */}
        <PaginationItem>
          <PaginationNext 
            href={createPageURL(endPage + 1)}
            onClick={(e) => handlePageClick(e, endPage + 1)}
            className={endPage >= totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}