import { ReactNode } from "react";
import styles from "./Table.module.css";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import TableCell from "./TableCell";

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
}: Props<T>) {
  if (data.length === 0) {
    return (
      <div className={styles.empty}>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${className}`}>
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
          {renderRow
            ? data.map((item, index) => (
                <TableRow key={item.id || index}>
                  {renderRow(item)}
                </TableRow>
              ))
            : data.map((item, index) => (
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
              ))}
        </tbody>
      </table>
    </div>
  );
}


export { default as TableCell } from "./TableCell";
export { default as TableHeader } from "./TableHeader";
export { default as TableRow } from "./TableRow";
