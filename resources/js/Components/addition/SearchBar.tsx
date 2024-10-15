import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const SearchBar = ({ searchTerm, setSearchTerm, pressEnter }) => {
  return (
    <div className="relative flex-grow max-w-sm">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-900" />
      <Input
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 pr-4 py-2 w-full text-gray-900"
        onKeyDown={(e, name) => pressEnter(e)}
      />
    </div>
  );
};

export default SearchBar;
