"use client";

import { useState, useMemo } from "react";
import { Input } from "@/Components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Checkbox } from "@/Components/ui/checkbox";
import { Button } from "@/Components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/Components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { Label } from "@/Components/ui/label";
import {
  ArrowUpDown,
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

// Sample data (unchanged)
const initialData = [
  {
    id: 1,
    name: "John Doe",
    age: 30,
    city: "New York",
    occupation: "Engineer",
  },
  {
    id: 2,
    name: "Jane Smith",
    age: 25,
    city: "Los Angeles",
    occupation: "Designer",
  },
  {
    id: 3,
    name: "Bob Johnson",
    age: 35,
    city: "Chicago",
    occupation: "Manager",
  },
  {
    id: 4,
    name: "Alice Brown",
    age: 28,
    city: "Houston",
    occupation: "Teacher",
  },
  {
    id: 5,
    name: "Charlie Wilson",
    age: 40,
    city: "Phoenix",
    occupation: "Doctor",
  },
  { id: 6, name: "Eva Martinez", age: 32, city: "Miami", occupation: "Lawyer" },
  {
    id: 7,
    name: "David Lee",
    age: 45,
    city: "San Francisco",
    occupation: "Entrepreneur",
  },
  {
    id: 8,
    name: "Grace Taylor",
    age: 29,
    city: "Seattle",
    occupation: "Software Developer",
  },
  {
    id: 9,
    name: "Frank Anderson",
    age: 38,
    city: "Boston",
    occupation: "Accountant",
  },
  {
    id: 10,
    name: "Helen Garcia",
    age: 33,
    city: "Dallas",
    occupation: "Marketing Specialist",
  },
  {
    id: 11,
    name: "Isaac Robinson",
    age: 27,
    city: "Atlanta",
    occupation: "Graphic Designer",
  },
  {
    id: 12,
    name: "Julia White",
    age: 36,
    city: "Denver",
    occupation: "Project Manager",
  },
];

const columns = [
  { key: "name", label: "Name" },
  { key: "age", label: "Age" },
  { key: "city", label: "City" },
  { key: "occupation", label: "Occupation" },
];

export default function DataTable() {
  const [data, setData] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterColumn, setFilterColumn] = useState("all");
  const [visibleColumns, setVisibleColumns] = useState(
    columns.map((col) => col.key)
  );
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [editingRow, setEditingRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value) => {
    setFilterColumn(value);
    setCurrentPage(1);
  };

  const toggleColumn = (columnKey) => {
    setVisibleColumns((prev) =>
      prev.includes(columnKey)
        ? prev.filter((key) => key !== columnKey)
        : [...prev, columnKey]
    );
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  const filteredAndSortedData = useMemo(() => {
    return data
      .filter((item) =>
        Object.entries(item).some(
          ([key, value]) =>
            (filterColumn === "all" || key === filterColumn) &&
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
      .sort((a, b) => {
        if (sortConfig.key) {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
        }
        return 0;
      });
  }, [data, searchTerm, filterColumn, sortConfig]);

  const pageCount = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  const handleAdd = (newRow) => {
    setData((prev) => [...prev, { id: Date.now(), ...newRow }]);
  };

  const handleEdit = (editedRow) => {
    setData((prev) =>
      prev.map((row) => (row.id === editedRow.id ? editedRow : row))
    );
    setEditingRow(null);
  };

  const handleDelete = (id) => {
    setData((prev) => prev.filter((row) => row.id !== id));
  };

  const handlePageChange = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, pageCount)));
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const totalPages = pageCount;
    const currentPageIndex = currentPage - 1;
    const maxPagesToShow = 5;

    let startPage = Math.max(
      0,
      currentPageIndex - Math.floor(maxPagesToShow / 2)
    );
    let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Button
          key={i}
          variant={i + 1 === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(i + 1)}
        >
          {i + 1}
        </Button>
      );
    }

    return pageNumbers;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          Enhanced Responsive Table with Improved Pagination
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-8"
            />
          </div>
          <Select onValueChange={handleFilterChange} defaultValue="all">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by column" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Columns</SelectItem>
              {columns.map((column) => (
                <SelectItem key={column.key} value={column.key}>
                  {column.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-wrap gap-4 mb-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Show/Hide Columns</Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <div className="space-y-2">
                {columns.map((column) => (
                  <div key={column.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={`column-${column.key}`}
                      checked={visibleColumns.includes(column.key)}
                      onCheckedChange={() => toggleColumn(column.key)}
                    />
                    <label
                      htmlFor={`column-${column.key}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {column.label}
                    </label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Row
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Row</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const newRow = Object.fromEntries(formData.entries());
                  handleAdd(newRow);
                  e.target.reset();
                }}
              >
                {columns.map((column) => (
                  <div key={column.key} className="mb-4">
                    <Label htmlFor={column.key}>{column.label}</Label>
                    <Input id={column.key} name={column.key} required />
                  </div>
                ))}
                <Button type="submit">Add</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
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
              {paginatedData.map((row) => (
                <TableRow key={row.id}>
                  {columns
                    .filter((col) => visibleColumns.includes(col.key))
                    .map((column) => (
                      <TableCell key={`${row.id}-${column.key}`}>
                        {editingRow?.id === row.id ? (
                          <Input
                            defaultValue={row[column.key]}
                            onChange={(e) => {
                              setEditingRow((prev) => ({
                                ...prev,
                                [column.key]: e.target.value,
                              }));
                            }}
                          />
                        ) : (
                          row[column.key]
                        )}
                      </TableCell>
                    ))}
                  <TableCell>
                    {editingRow?.id === row.id ? (
                      <>
                        <Button
                          onClick={() => handleEdit(editingRow)}
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
                          onClick={() => handleDelete(row.id)}
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
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
            {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)}{" "}
            of {filteredAndSortedData.length} results
          </p>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => {
              setItemsPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder={itemsPerPage} />
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
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {renderPageNumbers()}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pageCount}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pageCount)}
            disabled={currentPage === pageCount}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            min={1}
            max={pageCount}
            value={currentPage}
            onChange={(e) => handlePageChange(parseInt(e.target.value) || 1)}
            className="w-16"
          />
          <span className="text-sm text-muted-foreground">of {pageCount}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
