import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "./Table";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  headerClassName?: string;
  cellClassName?: string;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowKey: (row: T) => string;
  /** Render kartu mobile custom. Jika tidak diisi, fallback ke daftar key/value dari `columns`. */
  renderMobileCard?: (row: T) => ReactNode;
}

/**
 * DataTable generik — didorong lewat konfigurasi `columns` + tipe generik `T`,
 * BUKAN dibuat khusus untuk satu entitas. Dipakai ulang untuk User sekarang,
 * dan untuk Program/Activity/Output/Report/Partner/Budget nanti tanpa
 * mengubah komponen ini — hanya beda `columns` yang dipakai per halaman.
 *
 * Desktop: <table> semantik. Mobile (<sm): card list — tabel lebar berisiko
 * overflow di layar kecil (kaidah UX "Table Handling").
 */
export function DataTable<T>({
  columns,
  data,
  getRowKey,
  renderMobileCard,
}: DataTableProps<T>) {
  return (
    <>
      {/* Desktop */}
      <div className="hidden sm:block">
        <Table>
          <TableHead>
            <TableRow className="hover:bg-transparent">
              {columns.map((col) => (
                <TableHeaderCell key={col.key} scope="col" className={col.headerClassName}>
                  {col.header}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={getRowKey(row)}>
                {columns.map((col) => (
                  <TableCell key={col.key} className={col.cellClassName}>
                    {col.render(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile */}
      <div className="flex flex-col gap-3 sm:hidden">
        {data.map((row) => (
          <div
            key={getRowKey(row)}
            className="rounded-lg border border-[var(--color-border)] p-4"
          >
            {renderMobileCard
              ? renderMobileCard(row)
              : columns.map((col) => (
                  <div key={col.key} className="flex justify-between gap-2 py-1 text-sm">
                    <span className="text-[var(--color-muted-foreground)]">{col.header}</span>
                    <span className="text-right">{col.render(row)}</span>
                  </div>
                ))}
          </div>
        ))}
      </div>
    </>
  );
}
