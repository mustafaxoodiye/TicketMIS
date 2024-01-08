import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";

import { THead } from "./THead";
import { TBody } from "./TBody";

import {
  ComplexHeader,
  Action,
  getKeyValue,
  DropDownAction,
  RowModifier,
} from "./types";
import { TFoot } from "./TFoot";
import { CgMoreO } from "react-icons/cg";
import Swal from "sweetalert2";
import { APP_TITLE, PaginatedResult, PagingOptions, TableDefaults } from "@api";

import Pagination from "react-responsive-pagination";

interface Props {
  data: PaginatedResult<unknown> | unknown[];
  pagination?: PagingOptions;
  hidePagination?: boolean;
  aboveTablePaination?: boolean;
  isFetchingPage?: boolean;
  class?: string;
  headers: ComplexHeader[];
  actions?: Action[];
  dropDownActions?: DropDownAction[];
  showTotals?: boolean;
  showCounter?: boolean;
  customizable?: boolean;
  onPageChange?: (page: number, size: number) => void;
  paginationClass?: string;
  rowModifier?: RowModifier;
}

export const Table: React.FC<Props> = (props) => {
  const [items, setItems] = useState<unknown[]>([]);
  const [totals, setTotals] = useState<{ [key: string]: number }>({});
  const [headers, setHeaders] = useState<ComplexHeader[]>(
    props.headers.filter((h) => h.hideCol !== true)
  );
  const [isCustomizing, setIsCustomizing] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);

  let queryStrings = new URLSearchParams();

  try {
    [queryStrings] = useSearchParams({
      page: TableDefaults.page.toString(),
      size: TableDefaults.size.toString(),
    });
  } catch (e) {
    // Silence is gold! :)
  }

  useEffect(() => {
    var currentPage = +queryStrings.get("page")! ?? 0;
    currentPage === 0 && setCurrentPage(1);
  }, [queryStrings]);

  const className = props.class ?? "table table-sm "; // default table styling

  useEffect(() => {
    let tempItems: unknown[] = [];
    if (Array.isArray(props.data)) {
      tempItems = props.data;
    } else {
      tempItems = props.data.items;
    }

    setItems(tempItems);

    if (props.showTotals) {
      const totalFields = props.headers.filter((f) => f.total) ?? [];
      let tempTotals: { [key: string]: number } = {};
      totalFields
        .map((f) => {
          if (f.total?.format === "counter") {
            return { key: f.key, total: tempItems.length };
          }

          const total = tempItems.reduce((p: number, c) => {
            const value = f.compute ? f.compute(c) : getKeyValue(c, f.key);
            if (typeof value === "number") {
              p += value;
            }

            return p;
          }, 0);

          return { key: f.key, total: total as number };
        })
        .forEach((t) => (tempTotals[t.key] = t.total));

      setTotals(tempTotals);
    }
  }, [setItems, props]);

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    props?.onPageChange?.(page, size);
    // queryStrings.set('size', size.toString());
    // queryStrings.set('page', (page - 1).toString());

    // navigate({ search: `?${queryStrings.toString()}` });
  };

  const sort = (key: string, desc: boolean) => {
    let items: unknown[] = [];
    if (Array.isArray(props.data)) {
      items = props.data;
    } else {
      items = props.data.items;
    }

    items = items.sort((a: any, b: any) => (desc && a[key] > b[key] ? 1 : -1));
    setItems([...items]);
  };

  const customize = () => {
    console.log("Headers count: ", props.headers.length);
    setIsCustomizing(!isCustomizing);
  };

  const toggle = (key: string, isVisible: boolean) => {
    // Is already visible and set as visible.
    // if (isVisible && headers.findIndex(h => h.key === key) >= 0) {
    //     return;
    // }

    const header = headers.find((h) => h.key === key);
    if (header) {
      const hs = headers.filter((h) => h.key !== key);
      console.log("New headers", hs);
      const headersStr = JSON.stringify(hs);
      setHeaders(JSON.parse(headersStr));
    } else {
      setHeaders([...headers, props.headers.find((h) => h.key === key)!]);
    }

    console.log({ headers });
    Swal.close();
  };

  // TODO: We don't wanna navigate to next page if there is no next page.
  // TODO: Fix navigation to the same current page! Is that a thing in the first place?! 🤔

  return (
    <>
      <Helmet>
        <title>{APP_TITLE}</title>
      </Helmet>
      {props.customizable && (
        <div className="row">
          <div className="col mb-1">
            <a
              className="dropdown-toggle float-right"
              href="#!"
              role="button"
              onClick={customize}
            >
              <CgMoreO size="25" color="#191E3A" />
            </a>
          </div>
        </div>
      )}
      {isCustomizing && (
        <div className="row mt-3">
          {props.headers.map((h) => {
            const isVisible = headers.findIndex((vh) => vh.key === h.key) >= 0;
            return (
              <div key={h.key} className="col-4 text-left mb-1">
                <label>
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={(e) => toggle(h.key, e.target.checked)}
                  />{" "}
                  {h.title}
                </label>
              </div>
            );
          })}
        </div>
      )}
      {!props.hidePagination && props.aboveTablePaination && (
        <>
          <div className="row justify-content-center mb-1">
            <small
              style={{ color: "black", fontWeight: "bold", fontSize: "0.9rem" }}
            >
              {props.isFetchingPage ? (
                <>Fetching data...</>
              ) : (
                <>
                  Page {currentPage} of{" "}
                  {(props?.data as PaginatedResult<unknown>)?.totalPages}
                </>
              )}
            </small>
          </div>
          <Pagination
            total={(props?.data as PaginatedResult<unknown>)?.totalPages ?? 0}
            current={currentPage}
            maxWidth={10}
            onPageChange={(page) =>
              handlePageChange(
                page,
                (props?.data as PaginatedResult<unknown>)?.size
              )
            }
          />
        </>
      )}

      <div id="tableRow" className=" row">
        <table className={` ${className}`} style={{ width: "100%" }}>
          <THead
            headers={headers}
            onSort={sort}
            showCounter={props.showCounter}
            hasActions={props.actions && props.actions.length > 0}
          />

          <TBody
            data={items}
            headers={headers}
            actions={props.actions}
            dropDownActions={props.dropDownActions}
            showCounter={props.showCounter}
            isFetchingPage={props.isFetchingPage}
            rowModifier={props.rowModifier}
          />

          {props.showTotals && (
            <TFoot
              headers={headers}
              totals={totals}
              showCounter={props.showCounter}
            />
          )}
        </table>
      </div>
      <div id="bottomPagination" className={props?.paginationClass ?? ""}>
        {!props.hidePagination && !props.aboveTablePaination && (
          <Pagination
            total={(props?.data as PaginatedResult<unknown>)?.totalPages ?? 0}
            current={currentPage}
            maxWidth={10}
            onPageChange={(page) =>
              handlePageChange(
                page,
                (props?.data as PaginatedResult<unknown>)?.size
              )
            }
          />
        )}
      </div>
    </>
  );
};
