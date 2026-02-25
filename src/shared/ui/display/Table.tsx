"use client";

import { ReactNode, useState } from "react";
import styles from "./Table.module.css";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import TableCell from "./TableCell";
import Input from "../forms/Input";

interface Column<T> {
  key: keyof T;
  label: string;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (value: any, item: T) => ReactNode;
}

interface Props<T> {
  data: T[];
  columns: Column<T>[];
  renderRow?: (item: T) => ReactNode;
  rowActions?: (item: T) => ReactNode;
  emptyMessage?: string;
  striped?: boolean;
  hoverable?: boolean;
  className?: string;
  filterable?: boolean;
  filterPlaceholder?: string;
}

export default function Table<T extends { id?: string | number }>({
  data,
  columns,
  renderRow,
  rowActions,
  emptyMessage = "No hay datos",
  striped = true,
  hoverable = true,
  className = "",
  filterable = false,
  filterPlaceholder = "Search...",
}: Props<T>) {
  const [filterText, setFilterText] = useState("");

  const filteredData = filterable && filterText
    ? data.filter((item) => 
        columns.some((col) => {
          const val = item[col.key];
          if (val === null || val === undefined) return false;
          return String(val).toLowerCase().includes(filterText.toLowerCase());
        })
      )
    : data;

  if (data.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <span className={styles.emptyIcon}>📂</span>
        <p className={styles.emptyText}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {filterable && (
        <div style={{ marginBottom: '1rem', maxWidth: '300px' }}>
          <Input 
            name="table_filter"
            placeholder={filterPlaceholder}
            value={filterText}
            onChange={(e: any) => setFilterText(e.target.value)}
          />
        </div>
      )}
      <div className={styles.container}>
        <table
          className={`${styles.table} ${striped ? styles.striped : ""} ${
            hoverable ? styles.hoverable : ""
          }`}
        >
          <thead>
            <tr className={styles.headerRow}>
              {columns.map((column) => (
                <TableHeader
                  key={String(column.key)}
                  align={column.align}
                  width={column.width}
                >
                  {column.label}
                </TableHeader>
              ))}
              {rowActions && (
                <TableHeader align="right" width="100px">
                  Acciones
                </TableHeader>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (rowActions ? 1 : 0)} className={styles.cell} style={{ textAlign: 'center', padding: '2rem' }}>
                  No matches found
                </td>
              </tr>
            ) : (
              (renderRow ? filteredData.map((item, index) => (
                <TableRow key={item.id || index}>
                  {renderRow(item)}
                </TableRow>
              )) : filteredData.map((item, index) => (
                <TableRow key={item.id || index}>
                  {columns.map((column) => (
                    <TableCell
                      key={String(column.key)}
                      align={column.align}
                    >
                      {column.render
                        ? column.render(item[column.key], item)
                        : String(item[column.key])}
                    </TableCell>
                  ))}
                  {rowActions && (
                    <TableCell align="right">
                      {rowActions(item)}
                    </TableCell>
                  )}
                </TableRow>
              )))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


export { default as TableCell } from "./TableCell";
export { default as TableHeader } from "./TableHeader";
export { default as TableRow } from "./TableRow";
