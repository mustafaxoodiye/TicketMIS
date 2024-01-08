import { PaginatedResult } from "@api";
import React, { useEffect, useState } from "react";
import Pagination from "react-responsive-pagination";

interface Props {
  totalPages: number;
  size: number;
  onPageChange?: (page: number, size: number) => void;
}

export const PaginationHandler = ({
  totalPages,
  size,
  onPageChange,
}: Props) => {
  let queryStrings = new URLSearchParams();

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const queryString = window.location.search;
    const parameters = new URLSearchParams(queryString);
    const value = +parameters.get("page")! ?? 0;

    +value === 0 ? setCurrentPage(1) : setCurrentPage(+value + 1);
  }, [queryStrings]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPageChange?.(page, size);
  };

  return (
    <Pagination
      current={currentPage}
      total={totalPages ?? 0}
      maxWidth={10}
      onPageChange={handlePageChange}
    />
  );
};
