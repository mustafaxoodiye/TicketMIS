import { BaseModel } from "@models";
import { Operation, PagingOptions, TableDefaults } from "@api";
import { Filterable, FilterableType, MyRingLoader } from "@utils";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { ExportData, PrintComponent } from ".";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  RiFileExcel2Fill,
  RiFilterLine,
  RiFilterOffFill,
  RiPrinterFill,
} from "react-icons/ri";
import * as XLSX from "xlsx";

import "./Table.css";

interface Props<T extends BaseModel> {
  callback?: (options: PagingOptions) => void;
  filters?: Filterable<T>[];
  exportAsXSLS?: ExportData;
  onPrint?: PrintComponent;
  className?: string;
  color?: string;
}

export const TableVerticalConfigs = <T extends BaseModel>({
  callback,
  filters,
  exportAsXSLS,
  onPrint,
  className,
  color,
}: Props<T>) => {
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();
  const [queryStrings] = useSearchParams();

  const [queryStringsExist, setQueryStringsExist] = useState(false);

  useEffect(() => {
    var queryString = queryStrings.get("size");
    if (queryString) {
      setQueryStringsExist(true);
    } else {
      setQueryStringsExist(false);
    }
  }, [queryStrings]);

  const showFiltersOnClickHandler = () => {
    MySwal.fire({
      showConfirmButton: false,
      allowOutsideClick: false,
      showCloseButton: true,
      width: 900,
      html: <ShowVerticalFilters callback={applyFilter} fields={filters!} />,
    });
  };

  const applyFilter = (params: {}[]) => {
    const options = new PagingOptions(TableDefaults.page, TableDefaults.size);

    params.forEach((param: any) => {
      // param.type === 'select' && Object.assign(options, options.select(s => s.select<T>(...param.fields)));
      param.type === "filter" &&
        Object.assign(
          options,
          options.filter<T>((f) =>
            f[param.operation as Operation](param.field, param.value)
          )
        );
      param.type === "sort" &&
        Object.assign(options, options.sort<T>(param.field, param.ascending));
      param.type === "page" &&
        Object.assign(options, (options.page = param.value));
      param.type === "size" &&
        Object.assign(options, (options.size = param.value));
    });

    navigate({ search: `?${options.format()}` });
    callback?.(options);
  };

  const onResetClickHandler = () => {
    navigate({ search: `` });
  };

  const handleOnExport = async () => {
    var readyData = await exportAsXSLS?.data();
    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(readyData ?? []);
    XLSX.utils.book_append_sheet(
      wb,
      ws,
      `${exportAsXSLS?.sheetName ?? "Sheet 01"}`
    );
    XLSX.writeFile(wb, `${exportAsXSLS?.fileName}.xlsx`);
  };

  const onPrintTbl = () => {
    var originalContents = document.body.innerHTML;

    // Remove the bottom pagination if exists
    var bottomPagination = document.getElementById("bottomPagination");
    bottomPagination && bottomPagination?.classList.add("d-none");

    var element = document.getElementById(onPrint?.ref ?? "") as HTMLElement;

    onPrint?.prePrint?.(element);

    let printContents = element.innerHTML;
    document.body.innerHTML = printContents;
    setTimeout(function () {
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }, 500);
  };

  return (
    <>
      {(filters ?? []).length > 0 && (
        <button
          className={`btn btn-sm btn-outline-dark rounded-circle m-1 float-right ${className}`}
          onClick={showFiltersOnClickHandler}
        >
          <RiFilterLine color={`${color || ""}`} />
        </button>
      )}
      {queryStringsExist && (
        <button
          className="btn btn-sm btn-outline-danger rounded-circle m-1 float-right"
          onClick={onResetClickHandler}
        >
          <RiFilterOffFill />
        </button>
      )}
      {Object.keys(exportAsXSLS ?? {}).length > 0 && (
        <button
          className="btn btn-sm btn-outline-success rounded-circle m-1 float-right"
          onClick={handleOnExport}
        >
          <RiFileExcel2Fill />
        </button>
      )}
      {onPrint && (
        <button
          className="btn btn-sm btn-outline-warning rounded-circle m-1 float-right"
          onClick={onPrintTbl}
        >
          <RiPrinterFill />
        </button>
      )}
    </>
  );
};

interface miniProps<T extends BaseModel> {
  callback: (filters: {}[]) => void;
  fields: Filterable<T>[];
}

export const ShowVerticalFilters = <T extends BaseModel>({
  callback,
  fields,
}: miniProps<T>) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any, e: any) => {
    e.preventDefault();

    const filters: {}[] = [];

    fields.forEach((f) => {
      const filterOperation = data[`${f.key! as string}filterOperation`];
      const filterValue = data[`${f.key! as string}filterValue`];

      if (filterValue) {
        filters.push({
          type: "filter",
          field: f.key,
          operation: filterOperation ?? f?.operation ?? Operation.eq,
          value: filterValue,
        });
      }

      // for date ranges
      let from = data[`${f.key! as string}From`];
      let to = data[`${f.key! as string}To`];

      if (from && to) {
        // from = new Date(new Date(from).setHours(0, 0, 0, 1)).toISOString();
        // to = new Date(new Date(to).setHours(23, 59, 59, 999)).toISOString();
        from = from + "T00:00:00.001Z";
        to = to + "T23:59:59.999Z";
        filters.push({
          type: "filter",
          field: f.key,
          operation: Operation.gte,
          value: from,
        });
        filters.push({
          type: "filter",
          field: f.key,
          operation: Operation.lte,
          value: to,
        });
      }
    });

    data.SortField &&
      filters.push({
        type: "sort",
        field: data.SortField,
        ascending: data.sortDirection ?? true,
      });
    data.pageSize && filters.push({ type: "size", value: data.pageSize });

    callback(filters);

    e.target.reset();
    Swal.close();
  };

  const displayOperation = (o: Operation): string => {
    switch (o) {
      case Operation.eq:
        return "Equal";
      case Operation.gte:
        return "Greater than or Equal";
      case Operation.lte:
        return "Less than or Equal";
      case Operation.gt:
        return "Greater than";
      case Operation.lt:
        return "Less than";

      default:
        return "";
    }
  };

  const renderInputType = (field: string) => {
    const inputType = fields.filter((f) => f.key === field)[0]
      .format as FilterableType;

    const selectBoxData = fields?.filter((f) => f.key === field)[0]?.data;

    if (
      inputType === "text" ||
      inputType === "date" ||
      inputType === "number"
    ) {
      return (
        <div className="col">
          {/* <div className="form-group"> */}
          <input
            className="css-input"
            type={inputType}
            name={`${field}filterValue`}
            ref={register()}
          />
          {/* </div> */}
        </div>
      );
    }
    if (inputType === "select") {
      return (
        <div className="col">
          {/* <div className="form-group"> */}
          <select
            className="css-input"
            name={`${field}filterValue`}
            ref={register()}
          >
            <option value=""> </option>
            {selectBoxData ? (
              selectBoxData.map((f, i) => {
                return (
                  <option key={i} value={f.id}>
                    {f.name}
                  </option>
                );
              })
            ) : (
              <option value="">no Data</option>
            )}
          </select>
          {/* </div> */}
        </div>
      );
    }
    if (inputType === "dateRange") {
      return (
        <>
          <div className="col">
            {/* <div className="form-group"> */}
            <input
              className="css-input"
              type="date"
              name={`${field}From`}
              ref={register()}
            />
            {/* </div> */}
          </div>
          <div className="col">
            {/* <div className="form-group"> */}
            <input
              className="css-input"
              type="date"
              name={`${field}To`}
              ref={register()}
            />
            {/* </div> */}
          </div>
        </>
      );
    }
  };

  return (
    <>
      <Helmet>
        <title>Filtering</title>
        {/* <link href="/assets/customInput.css" rel="stylesheet" type="text/css" /> */}
      </Helmet>

      <h5>Table filtering dashboard</h5>
      <hr />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="d-flex">
          <div className="col-2">
            <h4 className="font-weight-bold mt-3">Filter</h4>
          </div>
          <div className="col-10">
            {fields.map((f, i) => {
              return (
                <div className="d-flex align-items-center mb-3 mt-1">
                  <div className="col-3 text-left mt-1">
                    <h6>{f.title.capitalize()}</h6>
                  </div>
                  {f?.showOperations && (
                    <div className="col">
                      <select
                        className="css-input"
                        name={`${f.key! as string}filterOperation`}
                        ref={register()}
                      >
                        <option value=""> </option>
                        {Object.keys(Operation).map((o, i) => {
                          return (
                            <option key={i} value={o}>
                              {displayOperation(
                                Operation[o as unknown as Operation]
                              )}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  )}
                  {renderInputType(f.key! as string)}
                </div>
              );
            })}
          </div>
        </div>

        <div className="d-flex">
          <div className="col-4"></div>
          <div className="col">
            <hr style={{ borderTop: "1px solid #D6D8D9" }} />
          </div>
          <div className="col-1"></div>
        </div>

        <div className="d-flex align-items-center">
          <div className="col-2">
            <h4 className="font-weight-bold mt-3">Sort</h4>
          </div>
          <div className="col-10">
            <div className="row">
              <div className="col-2"></div>
              <div className="col">
                <select className="css-input" name="SortField" ref={register()}>
                  <option value=""> </option>
                  {fields.map((f, i) => {
                    return (
                      <option key={i} value={f.key! as string}>
                        {f.title}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="col">
                <select
                  className="css-input"
                  name="sortDirection"
                  ref={register()}
                >
                  <option value=""> </option>
                  <option value="true">Ascending</option>
                  <option value="false">Descending</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex">
          <div className="col-4"></div>
          <div className="col">
            <hr style={{ borderTop: "1px solid #D6D8D9" }} />
          </div>
          <div className="col-1"></div>
        </div>

        <div className="d-flex align-items-start">
          {/* <div className="col-3">
            <h4 className="font-weight-bold">Page size</h4>
          </div> */}
          <div className="col-4"></div>
          <div className="col-4 mb-1">
            {/* <div className="form-group row  "> */}
            <input
              className="css-input"
              type="number"
              placeholder="page size"
              name="pageSize"
              ref={register()}
            />
            {/* </div> */}
          </div>
          <div className="col-2"></div>
          <div className="col-2 mb-1">
            <input
              type="submit"
              id="submit"
              className="btn btn-dark float-right"
            />
          </div>
        </div>
      </form>
    </>
  );
};
