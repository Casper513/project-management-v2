import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/Components/ui/pagination";
import {
  ArrowUpDown,
  Edit,
  Trash2,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/Components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { router } from "@inertiajs/react";

interface Column {
  key: string;
  label: string;
}

interface SortConfig {
  key: string | null;
  direction: "asc" | "desc";
}

interface PaginationType {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface DataTableProps {
  data: Record<string, any>[];
  columns: Column[];
  visibleColumns: string[];
  sortConfig: SortConfig;
  setSortConfig: (config: SortConfig) => void;
  onEdit: (row: Record<string, any>) => void;
  onDelete: (id: number | string) => void;
  pagination: PaginationType;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  visibleColumns,
  sortConfig,
  setSortConfig,
  onEdit,
  onDelete,
  pagination,
  onPageChange,
  onPerPageChange,
}) => {
  const [editingRow, setEditingRow] = useState<Record<string, any> | null>(
    null
  );

  const handleSort = (key: string) => {
    let newDirection = "asc"; // Defaultnya kita anggap naik dulu

  // Jika kita sudah mengurutkan berdasarkan kolom yang sama
    if (sortConfig.key === key) {
      // Ganti arah urutannya
      newDirection = sortConfig.direction === "asc" ? "desc" : "asc";
    }

    // Perbarui catatan di sortConfig
    setSortConfig({ key, direction: newDirection });

    // Gunakan Inertia untuk mengirim permintaan sorting ke server
    router.get(window.location.pathname, {
      sort_field: key, // Kirim sort_field ke server
      sort_direction: newDirection, // Kirim arah sorting
      ...pagination, // Kirim pagination juga
    }, {
      preserveState: true, // Agar tidak mereset state form saat sorting
      replace: true, // Ganti URL tanpa menambah history
    });
  };

  console.log(pagination)

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const { current_page, last_page } = pagination;

    for (let i = 1; i <= last_page; i++) {
      if (
        i === 1 ||
        i === last_page ||
        (i >= current_page - 2 && i <= current_page + 2)
      ) {
        pageNumbers.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => onPageChange(i)}
              isActive={i === current_page}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      } else if (i === current_page - 3 || i === current_page + 3) {
        pageNumbers.push(<PaginationEllipsis key={i} />);
      }
    }

    return pageNumbers;
  };

  return (
    <>
      <div className="rounded-md border border-gray-300">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-300">
              {columns
                .filter((col) => visibleColumns.includes(col.key))
                .map((column) => (
                  <TableHead key={column.key} className="font-medium">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort(column.key)}
                      className="hover:bg-transparent"
                    >
                      {column.label}
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id} className="border-gray-300">
                {columns
                  .filter((col) => visibleColumns.includes(col.key))
                  .map((column) => (
                    <TableCell key={`${row.id}-${column.key}`}>
                      {editingRow?.id === row.id ? (
                        <Input
                          defaultValue={
                            typeof row[column.key] === "object" &&
                            row[column.key] !== null
                              ? row[column.key].name // Menampilkan .name jika datanya adalah object
                              : row[column.key]
                          }
                          onChange={(e) => {
                            setEditingRow((prev: any) => ({
                              ...prev,
                              [column.key]: e.target.value,
                            }));
                          }}
                        />
                      ) : // Cek jika row[column.key] adalah object, lalu tampilkan row[column.key].name
                      typeof row[column.key] === "object" &&
                        row[column.key] !== null ? (
                        row[column.key].name // Tampilkan name jika object memiliki field name
                      ) : (
                        row[column.key]
                      ) // Jika bukan object, tampilkan data biasa
                      }
                    </TableCell>
                  ))}
                <TableCell>
                  {editingRow?.id === row.id ? (
                    <>
                      <Button
                        onClick={() => {
                          onEdit(editingRow);
                          setEditingRow(null);
                        }}
                        className="mr-2"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => setEditingRow(null)}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => setEditingRow(row)}
                        className="mr-2"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => onDelete(row.id)}
                        variant="destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">
            Showing {(pagination.current_page - 1) * pagination.per_page + 1} -{" "}
            {Math.min(
              pagination.current_page * pagination.per_page,
              pagination.total
            )}{" "}
            of {pagination.total} results
          </p>
          <Select
            value={pagination.per_page.toString()}
            onValueChange={(value) => onPerPageChange(Number(value))}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder={pagination.per_page} />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink
                onClick={() => onPageChange(1)}
                disabled={pagination.current_page === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                onClick={() => onPageChange(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </PaginationLink>
            </PaginationItem>
            {renderPageNumbers()}
            <PaginationItem>
              <PaginationLink
                onClick={() => onPageChange(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.last_page}
              >
                <ChevronRight className="h-4 w-4" />
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                onClick={() => onPageChange(pagination.last_page)}
                disabled={pagination.current_page === pagination.last_page}
              >
                <ChevronsRight className="h-4 w-4" />
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            min={1}
            max={pagination.last_page}
            value={pagination.current_page}
            onChange={(e) => onPageChange(parseInt(e.target.value) || 1)}
            className="w-16"
          />
          <span className="text-sm text-muted-foreground">
            of {pagination.last_page}
          </span>
        </div>
      </CardFooter>
    </>
  );
};

export default DataTable;
