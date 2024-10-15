import React, { useState, useMemo, useEffect, KeyboardEvent } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";

import SearchBar from "@/Components/addition/SearchBar";
import ColumnVisibilityToggle from "@/Components/addition/ColumnVisibilityToggle";
import AddRowDialog from "@/Components/addition/AddRowDialog";
import DataTable from "@/Components/addition/DataTable";

// Define types for project, pagination, and queryParams
interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  created_at: string;
  due_date: string;
  created_by: { name: string; email: string };
  updated_by: { name: string; email: string };
  image_path: string;
}

interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface QueryParams {
  search?: string;
  sort_field?: string;
  sort_direction?: "asc" | "desc";
  page?: number;
  per_page?: number;
}

interface IndexProps {
  auth: { user: any };
  projects: { data: Project[] };
  queryParams: QueryParams;
  pagination: Pagination;
}

const columns = [
  { key: "name", label: "Project Name" },
  { key: "description", label: "Description" },
  { key: "status", label: "Status" },
  { key: "created_at", label: "Created At" },
  { key: "due_date", label: "Due Date" },
  { key: "created_by", label: "Created By" },
  { key: "updated_by", label: "Updated By" },
  { key: "image_path", label: "Image" },
];

const Index: React.FC<IndexProps> = ({
  auth,
  projects,
  queryParams,
  pagination,
}) => {
  const [data, setData] = useState<Project[]>(projects.data);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    columns.map((col) => col.key)
  );
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: "asc" | "desc";
  }>({
    key: null,
    direction: "asc",
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);

  const handlePressEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const updatedParams: QueryParams = { ...queryParams, search: searchTerm };
      router.get(route("project.index"), updatedParams, {
        preserveState: true,
        preserveScroll: true,
        replace: true,
      });
    }
  };

  const handlePageChange = (page: number) => {
    router.get(
      route("project.index"),
      { ...queryParams, page },
      {
        preserveState: true,
        replace: true,
      }
    );
  };

  const handlePerPageChange = (perPage: number) => {
    router.get(
      route("project.index"),
      { ...queryParams, per_page: perPage, page: 1 },
      {
        preserveState: true,
        replace: true,
      }
    );
  };

  const sortChanged = (name: string) => {
    const updatedParams = {
      ...queryParams,
      sort_field: name,
      sort_direction: queryParams.sort_direction === "asc" ? "desc" : "asc",
    };
    router.get(route("project.index"), updatedParams, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  };

  useEffect(() => {
    setData(projects.data);
  }, [projects]);

  const filteredAndSortedData = useMemo(() => {
    return data
      .filter((item) =>
        Object.entries(item).some(([key, value]) => {
          if (key === "created_by" || key === "updated_by") {
            return (
              value.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              value.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
          }
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        })
      )
      .sort((a, b) => {
        if (sortConfig.key) {
          const aValue =
            sortConfig.key === "created_by" || sortConfig.key === "updated_by"
              ? a[sortConfig.key]?.name
              : a[sortConfig.key];
          const bValue =
            sortConfig.key === "created_by" || sortConfig.key === "updated_by"
              ? b[sortConfig.key]?.name
              : b[sortConfig.key];
          if (aValue < bValue) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
        }
        return 0;
      });
  }, [data, searchTerm, sortConfig]);

  const handleAdd = (newRow: Project) => {
    setData((prev) => [...prev, { id: Date.now(), ...newRow }]);
    setIsAddDialogOpen(false);
  };

  const handleEdit = (editedRow: Project) => {
    setData((prev) =>
      prev.map((row) => (row.id === editedRow.id ? editedRow : row))
    );
  };

  const handleDelete = (id: number) => {
    setData((prev) => prev.filter((row) => row.id !== id));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Projects Dashboard
        </h2>
      }
    >
      <Head title="Projects" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <Card className="w-full">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-2xl font-bold">
                    All Projects
                  </CardTitle>
                  <AddRowDialog
                    columns={columns}
                    onAdd={handleAdd}
                    isOpen={isAddDialogOpen}
                    onClose={() => setIsAddDialogOpen(false)}
                  />
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <SearchBar
                      searchTerm={searchTerm}
                      setSearchTerm={setSearchTerm}
                      pressEnter={handlePressEnter}
                    />
                    <ColumnVisibilityToggle
                      columns={columns}
                      visibleColumns={visibleColumns}
                      setVisibleColumns={setVisibleColumns}
                    />
                  </div>
                  <DataTable
                    data={filteredAndSortedData}
                    columns={columns}
                    visibleColumns={visibleColumns}
                    sortConfig={sortConfig}
                    setSortConfig={setSortConfig}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default Index;
