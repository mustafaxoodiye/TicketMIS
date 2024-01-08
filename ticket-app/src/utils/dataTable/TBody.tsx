import { DateHelpers, DropDownAction, MyBarLoader } from "@utils";
import React from "react";

import {
  Action,
  ColumnValueType,
  ComplexHeader,
  getKeyValue,
  RowModifier,
} from "./types";

interface Props {
  data: unknown[];
  headers: ComplexHeader[];
  actions?: Action[];
  dropDownActions?: DropDownAction[];
  showCounter?: boolean;
  isFetchingPage?: boolean;
  rowModifier?: RowModifier;
}

export const TBody: React.FC<Props> = (props) => {
  if (props.isFetchingPage) {
    return (
      <tbody>
        <tr>
          <td
            colSpan={
              (props.showCounter ? 1 : 0) +
              props.headers.length +
              (props.actions?.length ?? 0)
            }
          >
            <div className="row justify-content-center">
              <MyBarLoader />
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  if (!props.data || props.data.length < 1) {
    return (
      <tbody>
        <tr>
          <td
            colSpan={
              (props.showCounter ? 1 : 0) +
              props.headers.length +
              (props.actions?.length ?? 0)
            }
          >
            <div className="row justify-content-center">No data...</div>
          </td>
        </tr>
      </tbody>
    );
  }

  const renderRow = (currentRow: any, index: number) => {
    const headers = props.headers;

    return (
      <tr
        className={props?.rowModifier?.style?.(currentRow) ?? ""}
        key={`row-${index}`}
      >
        {props.showCounter && <td className="text-center">{index + 1}</td>}

        {headers.map((header) => {
          let data = header.compute
            ? header.compute(currentRow)
            : getKeyValue(currentRow, header.key);
          data = header.formatter ? header.formatter(data) : data;

          let classes =
            header.renderer && header.renderer.condition(currentRow)
              ? header.renderer.ifTrue
              : header.renderer?.ifFalse;
          classes = header.cellClass && header.cellClass(currentRow);
          return renderCell(data, header, currentRow, classes);
        })}

        {props.actions && (
          <td className="text-center actions">
            <ul
              className="d-flex justify-content-center"
              style={{ listStyle: "none", gap: 5 }}
            >
              {props.actions.map((action: Action, idx: number) =>
                renderAction(action, currentRow, index + "-" + idx)
              )}
            </ul>
          </td>
        )}

        {props.dropDownActions && (
          <td className="text-center">
            <ul className="table-controls">
              <div className="dropdown  custom-dropdown">
                <a
                  className="dropdown-toggle"
                  href="!#"
                  role="button"
                  id="dropdownMenuLink-2"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-more-horizontal"
                  >
                    <circle cx={12} cy={12} r={1} />
                    <circle cx={19} cy={12} r={1} />
                    <circle cx={5} cy={12} r={1} />
                  </svg>
                </a>
                <div
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuLink-2"
                >
                  {props.dropDownActions.map(
                    (action: DropDownAction, idx: number) =>
                      renderDropDownActions(
                        action,
                        currentRow,
                        index + "-" + idx
                      )
                  )}
                </div>
              </div>
            </ul>
          </td>
        )}
      </tr>
    );
  };

  const renderCell = (
    value: any,
    header: ComplexHeader,
    row: any,
    classes?: string,
    colSpan?: number
  ) => {
    const currency = header.currency && header.currency(row);
    const key = "column-" + Math.random();
    const className =
      header.format === "currency" ||
      header.format === "number" ||
      header.format === "percent"
        ? "text-center"
        : "";
    if (header.format === "currency") {
      let val = parseFloat(value) || 0;
      if (val < 0 && val > -0.01) {
        val = 0;
      }

      if (currency) value = val.toCurrency(currency);
      else value = val.toCurrency();
    }

    if (header.format === "number") {
      value =
        (value as number).toFixed && true ? (value as number).format() : value;
    }

    if (header.format === "percent") {
      value = "%" + value;
    }

    if (header.format === "dateTime") {
      value = new Date(value).toLocaleString();
    }

    if (header.format === "date") {
      value = DateHelpers.dashedDate(new Date(value));
    }

    let endResult = (
      <span className={classes}>
        {typeof value === "boolean" ? value?.toString() : value}
      </span>
    );

    if (header.input) {
      endResult = (
        <input
          type={header.input.type}
          defaultValue={header.input.value?.(row)}
          name={`input-${value}`}
          id={`input-${value}`}
          style={{ width: "100px" }}
          onBlur={(e) => header?.input?.callback?.(e, props.data)}
        />
      );
    }

    return (
      <td key={key} className={className} colSpan={colSpan}>
        {endResult}
      </td>
    );
  };

  const renderDropDownActions = (
    action: DropDownAction,
    row: any,
    idx: string
  ) => {
    return (
      <li key={idx}>
        {/* <button type="button" onClick={(e: any) => handleClick(e, action, row)}
                    className={"btn btn-sm btn-" + action.color}>
                    {action.title}
                </button> */}
        <a
          href="/#"
          className="dropdown-item"
          onClick={(e: any) => handleDropDownItemClick(e, action, row)}
        >
          {action.title}
        </a>
      </li>
    );
  };

  const renderAction = (action: Action, row: any, idx: string) => {
    const isHidden = action.hide && action.hide(row);
    const isDisabled = action.disable && action.disable(row);

    if (isHidden) {
      return <></>;
    }

    // if (isDisabled) {
    //   return (
    //     <li key={idx}>
    //       <button
    //         type="button"
    //         className={"btn btn-sm btn-" + action.color}
    //         disabled
    //       >
    //         {action.title}
    //       </button>
    //     </li>
    //   );
    // }

    if (action.icon) {
      // Render an icon button.
      return (
        <li key={idx}>
          <a
            href="#!"
            role="button"
            onClick={(e) => handleClick(e, action, row)}
            data-toggle="tooltip"
            data-placement="top"
            title={action.title}
            className={"text-" + action.color}
          >
            <action.icon />
          </a>
        </li>
      );
    }

    if (action.actionType === "button") {
      return (
        <li key={idx}>
          <button
            type="button"
            onClick={(e: any) => {
              if (isDisabled) return;
              return handleClick(e, action, row);
            }}
            className={"btn btn-sm btn-" + action.color}
            disabled={isDisabled}
          >
            {action.title}
          </button>
        </li>
      );
    }

    if (action.actionType === "badge") {
      let txtColor = "white";
      if (action.color === "warning" || action.color === "light" || isDisabled)
        txtColor = "black";
      return (
        <li key={idx}>
          <a
            href="#!"
            onClick={(e) => {
              if (isDisabled) return console.log("diabled button");
              return handleClick(e, action, row);
            }}
            className={
              isDisabled ? "badge bg-light" : "badge bg-" + action.color
            }
          >
            <span className={`text-${txtColor}`} id={"badge-" + idx}>
              {action.title}
            </span>
          </a>
        </li>
      );
    }
  };

  const handleClick = (e: any, action: Action, row: any) => {
    action.click(row, e);
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDropDownItemClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    action: DropDownAction,
    row: any
  ) => {
    action.click(row);
    e.preventDefault();
    e.stopPropagation();
  };

  return <tbody>{props.data.map((row, index) => renderRow(row, index))}</tbody>;
};
