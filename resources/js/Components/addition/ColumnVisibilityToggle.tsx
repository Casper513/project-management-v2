import React from "react";
import { Button } from "@/Components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/ui/popover";
import { Checkbox } from "@/Components/ui/checkbox";

const ColumnVisibilityToggle = ({
  columns,
  visibleColumns,
  setVisibleColumns,
}) => {
  const toggleColumn = (columnKey) => {
    setVisibleColumns((prev) =>
      prev.includes(columnKey)
        ? prev.filter((key) => key !== columnKey)
        : [...prev, columnKey]
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="whitespace-nowrap border-gray-300">
          Show/Hide Columns
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 ">
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
  );
};

export default ColumnVisibilityToggle;
