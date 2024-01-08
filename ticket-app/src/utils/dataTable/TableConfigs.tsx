import { BaseModel } from "@models";
import { Operation, PagingOptions } from "@api";
import { Filterable, FilterableType } from "@utils";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FiFilter } from "react-icons/fi";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { TableDefaults } from "@api";

interface Props<T extends BaseModel> {
  callback: (options: PagingOptions) => void;
  filters?: Filterable<T>[];
}

export const TableConfigs = <T extends BaseModel>({
  callback,
  filters,
}: Props<T>) => {
  const MySwal = withReactContent(Swal);

  const showFiltersOnClickHandler = () => {
    MySwal.fire({
      showConfirmButton: false,
      allowOutsideClick: false,
      showCloseButton: true,
      width: 900,
      html: (
        <ShowFilters
          callback={applyFilter}
          fields={
            filters! as {
              key: string;
              format: string;
              data?: { id: number; name: string }[];
            }[]
          }
        />
      ),
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

    callback(options);
  };

  return (
    <button
      className="btn btn-sm btn-outline-dark rounded-circle m-1 float-right"
      onClick={showFiltersOnClickHandler}
    >
      <FiFilter />
    </button>
  );
};

interface miniProps {
  callback: (filters: {}[]) => void;
  fields: {
    key: string;
    format: string;
    data?: { id: number; name: string }[];
  }[];
}

export const ShowFilters: React.FC<miniProps> = ({ callback, fields }) => {
  const [inputType, setInputType] = useState<FilterableType>("text");
  const [selectBoxData, setSelectBoxData] = useState<
    { id: number; name: string }[] | undefined
  >();
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any, e: any) => {
    e.preventDefault();
    console.log({ data });

    const filters: {}[] = [];

    if (data.filterField && data.filterOperation && data.filterValue) {
      filters.push({
        type: "filter",
        field: data.filterField,
        operation: data.filterOperation,
        value: data.filterValue,
      });
    }

    data.SortField &&
      filters.push({
        type: "sort",
        field: data.SortField,
        ascending: data.sortDirection ?? true,
      });
    // data.SelectedFields.length && filters.push({ type: 'select', fields: data.SelectedFields });
    data.beginningPage &&
      filters.push({ type: "page", value: data.beginningPage });
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

  const handleChange = (val: string) => {
    const x = fields.filter((f) => f.key === val)[0].format as FilterableType;
    setInputType(x);

    const data = fields.filter((f) => f.key === val)[0].data;
    setSelectBoxData(data);
  };

  const renderInputType = () => {
    if (
      inputType === "text" ||
      inputType === "date" ||
      inputType === "number"
    ) {
      return (
        <input
          className="form-control form-control-sm"
          type={inputType}
          name="filterValue"
          ref={register()}
        />
      );
    }
    if (inputType === "select") {
      return (
        <select className="custom-select" name="filterValue" ref={register()}>
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
      );
    }
  };

  return (
    <>
      <h5>Table filtering dashboard</h5>
      <hr />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-3">
            <h6 className="font-weight-bold mt-2">Filter</h6>
          </div>
          <div className="col-9">
            <div className="row">
              <div className="col">
                <select
                  className="custom-select"
                  name="filterField"
                  ref={register()}
                  onChange={(e) => handleChange(e.target.value)}
                >
                  <option value=""> </option>
                  {fields.map((f, i) => {
                    return (
                      <option key={i} value={f.key}>
                        {f.key}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="col">
                <select
                  className="custom-select"
                  name="filterOperation"
                  ref={register()}
                >
                  <option value=""> </option>
                  {Object.keys(Operation).map((o, i) => {
                    return (
                      <option key={i} value={o}>
                        {displayOperation(Operation[o as unknown as Operation])}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="col">
                <div className="form-group">
                  {/* <input className="form-control form-control-sm" type={inputType} name="filterValue" ref={register()} /> */}
                  {renderInputType()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-4"></div>
          <div className="col">
            <hr style={{ borderTop: "1px solid #D6D8D9" }} />
          </div>
          <div className="col-1"></div>
        </div>

        <div className="row">
          <div className="col-3">
            <h6 className="font-weight-bold mt-2">Sort</h6>
          </div>
          <div className="col-9">
            <div className="row">
              <div className="col">
                <select
                  className="custom-select custom-select-sm"
                  name="SortField"
                  ref={register()}
                >
                  <option value=""> </option>
                  {fields.map((f, i) => {
                    return (
                      <option key={i} value={f.key}>
                        {f.key}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="col">
                <select
                  className="custom-select custom-select-sm"
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

        <div className="row">
          <div className="col-4"></div>
          <div className="col">
            <hr style={{ borderTop: "1px solid #D6D8D9" }} />
          </div>
          <div className="col-1"></div>
        </div>

        {/* <div className="row">
                    <div className="col-3">
                        <h6 className="font-weight-bold mt-2">Select</h6>
                    </div>
                    <div className="col-9">
                        <div className="row">
                            <div className="col">
                                <select className="custom-select custom-select-sm" multiple name="SelectedFields" ref={register()}>
                                    <option value=""> </option>
                                    {
                                        fields.map((f, i) => {
                                            return (
                                                <option key={i} value={f}>{f}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>

                        </div>
                    </div>
                </div> */}

        <div className="row mt-3 pt-1">
          <div className="col-3"></div>
          <div className="col-4">
            <div className="form-group row  ">
              <div className="col-sm-10">
                <input
                  type="number"
                  className="form-control form-control-sm"
                  placeholder="start from page"
                  name="beginningPage"
                  ref={register()}
                />
              </div>
            </div>
          </div>

          <div className="col-4">
            <div className="form-group row  ">
              <div className="col-sm-10">
                <input
                  type="number"
                  className="form-control form-control-sm"
                  placeholder="page size"
                  name="pageSize"
                  ref={register()}
                />
              </div>
            </div>
          </div>

          <div className="col-1">
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
