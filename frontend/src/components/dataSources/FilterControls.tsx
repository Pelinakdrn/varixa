import { useState } from "react";

type Props = {
  onFilterChange: (filters: {
    filename: string;
    season: string;
    product: string;
    sortOrder: "asc" | "desc";
  }) => void;
};

const FilterControls = ({ onFilterChange }: Props) => {
  const [filters, setFilters] = useState({
    filename: "",
    season: "",
    product: "",
    sortOrder: "desc" as "asc" | "desc",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const updated = { ...filters, [e.target.name]: e.target.value };
    setFilters(updated);
    onFilterChange(updated);
  };

  return (
    <div className="flex flex-wrap gap-4 mb-4 text-white">
      <input
        name="filename"
        placeholder="File Name"
        value={filters.filename}
        onChange={handleChange}
        className="px-2 py-1 border rounded"
      />
      <input
        name="season"
        placeholder="Season"
        value={filters.season}
        onChange={handleChange}
        className="px-2 py-1 border rounded"
      />
      <input
        name="product"
        placeholder="Product"
        value={filters.product}
        onChange={handleChange}
        className="px-2 py-1 border rounded"
      />
      <select
        name="sortOrder"
        value={filters.sortOrder}
        onChange={handleChange}
        className="px-2 py-1 border rounded"
      >
        <option value="desc">Newest → Oldest</option>
        <option value="asc">Oldest → Newest</option>
      </select>
    </div>
  );
};

export default FilterControls;
