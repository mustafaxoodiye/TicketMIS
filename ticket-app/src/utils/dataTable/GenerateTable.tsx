import { PaginatedResult } from "@api";
import { ComplexHeader, MyBarLoader, Table } from "@utils";
import React, { useEffect, useRef, useState } from "react";

interface Props {
  data: PaginatedResult<any>;
}

export const GenerateTable: React.FC<Props> = ({ data }) => {
  const [dynamicHeaders, setDynamicHeaders] = useState<ComplexHeader[]>([]);

  useEffect(() => {
    if (data.items.length > 0) {
      const headers = Object.keys(data.items[0]);
      const temp: any[] = [];

      headers.forEach(function (h) {
        const result = h.replace(/([A-Z])/g, " $1");
        const finalResult = result.charAt(0).toUpperCase() + result.slice(1);

        temp.push({ key: h, title: finalResult });
      });

      setDynamicHeaders(temp);
    }
    return () => {
      setDynamicHeaders([]);
    };
  }, [data]);

  return (
    <>
      {!dynamicHeaders ? (
        <MyBarLoader />
      ) : (
        <Table data={data} headers={dynamicHeaders} hidePagination={true} />
      )}
    </>
  );
};
