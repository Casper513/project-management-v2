import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

const AddRowDialog = ({ columns, onAdd }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="whitespace-nowrap">
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
            onAdd(newRow);
            e.target.reset();
          }}
          className="space-y-4"
        >
          {columns.map((column) => (
            <div key={column.key}>
              <Label htmlFor={column.key}>{column.label}</Label>
              <Input
                id={column.key}
                name={column.key}
                required
                className="mt-1"
              />
            </div>
          ))}
          <Button type="submit" className="w-full">
            Add
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRowDialog;
