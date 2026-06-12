import { useMemo, useState, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Search, ArrowUpDown } from "lucide-react";
import { EmptyState } from "./EmptyState";

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  sortBy?: (row: T) => string | number;
  className?: string;
}

interface Props<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchKeys?: ((row: T) => string)[];
  pageSize?: number;
  toolbar?: ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({
  data, columns, searchPlaceholder = "Search…", searchKeys, pageSize = 8, toolbar,
  emptyTitle = "No records", emptyDescription, rowKey, onRowClick,
}: Props<T>) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);

  const filtered = useMemo(() => {
    let rows = data;
    if (q && searchKeys?.length) {
      const ql = q.toLowerCase();
      rows = rows.filter((r) => searchKeys.some((fn) => fn(r).toLowerCase().includes(ql)));
    }
    if (sort) {
      const col = columns.find((c) => c.key === sort.key);
      if (col?.sortBy) {
        rows = [...rows].sort((a, b) => {
          const av = col.sortBy!(a); const bv = col.sortBy!(b);
          if (av < bv) return sort.dir === "asc" ? -1 : 1;
          if (av > bv) return sort.dir === "asc" ? 1 : -1;
          return 0;
        });
      }
    }
    return rows;
  }, [data, q, sort, columns, searchKeys]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const pageRows = filtered.slice(safePage * pageSize, safePage * pageSize + pageSize);

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} placeholder={searchPlaceholder} className="pl-9" />
        </div>
        <div className="flex items-center gap-2 sm:ml-auto flex-wrap">{toolbar}</div>
      </div>

      <div className="rounded-lg border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                {columns.map((c) => (
                  <TableHead key={c.key} className={c.className}>
                    {c.sortBy ? (
                      <button
                        className="inline-flex items-center gap-1 font-semibold text-foreground hover:text-primary transition-colors"
                        onClick={() => setSort((s) => s?.key === c.key ? { key: c.key, dir: s.dir === "asc" ? "desc" : "asc" } : { key: c.key, dir: "asc" })}
                      >
                        {c.header}<ArrowUpDown className="h-3 w-3 opacity-60" />
                      </button>
                    ) : c.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="p-0">
                    <EmptyState title={emptyTitle} description={emptyDescription} />
                  </TableCell>
                </TableRow>
              ) : pageRows.map((r) => (
                <TableRow
                  key={rowKey(r)}
                  className={onRowClick ? "cursor-pointer" : ""}
                  onClick={() => onRowClick?.(r)}
                >
                  {columns.map((c) => (
                    <TableCell key={c.key} className={c.className}>{c.cell(r)}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {filtered.length > pageSize && (
        <div className="flex items-center justify-between text-sm">
          <div className="text-muted-foreground">
            {safePage * pageSize + 1}–{Math.min((safePage + 1) * pageSize, filtered.length)} of {filtered.length}
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" disabled={safePage === 0} onClick={() => setPage((p) => p - 1)} aria-label="Previous page">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="px-3 tabular-nums">{safePage + 1} / {pageCount}</div>
            <Button variant="outline" size="sm" disabled={safePage >= pageCount - 1} onClick={() => setPage((p) => p + 1)} aria-label="Next page">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}