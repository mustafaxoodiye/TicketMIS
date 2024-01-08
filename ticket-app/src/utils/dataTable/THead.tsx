import React, { useState } from "react";

import { ComplexHeader } from "./types";

interface Props {
  headers: ComplexHeader[];
  hasActions?: boolean;
  onSort?: (key: string, asc: boolean) => void;
  showCounter?: boolean;
}

export const THead: React.FC<Props> = (props) => {
  const [sortingKey, setSortingKey] = useState("");
  const [sortingAsc, setSortingAsc] = useState(true);

  const handleSort = (header: ComplexHeader) => {
    // if (!header.sortable) {
    //     return;
    // }

    const desc = header.key === sortingKey && !sortingAsc;
    setSortingAsc(desc);
    setSortingKey(header.key);

    props.onSort && props.onSort(header.key, desc);
  };

  const renderCell = (header: ComplexHeader, index: number) => {
    const className =
      header.format === "currency" ||
      header.format === "number" ||
      header.format === "percent"
        ? "text-center"
        : "";

    if (typeof header == "string") {
      return (
        <th
          key={`heading-${index}`}
          className={sortingKey === header ? "sorting" : ""}
          onClick={() => handleSort(header)}
        >
          {header}
        </th>
      );
    }

    return (
      <th
        key={`heading-${header.key}`}
        onClick={() => handleSort(header)}
        className={
          className + " " + (sortingKey === header.key ? "sorting" : "")
        }
      >
        {header.title ? header.title?.capitalize() : header.key}
      </th>
    );
  };

  return (
    <thead
      style={{
        position: "sticky",
        insetBlockStart: 0,
        backgroundColor: "white",
      }}
    >
      <tr>
        {props.showCounter && <th className="text-center">#</th>}

        {props.headers.map((header, index) => renderCell(header, index))}

        {props.hasActions && <th className="text-center actions">Actions</th>}
      </tr>
    </thead>
  );
};
