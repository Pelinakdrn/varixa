import { useState, useEffect } from "react";
import { Plus, Download } from "lucide-react";
import CreateFileModal from "../components/dataSources/CreateFileModal";
import FilterControls from "../components/dataSources/FilterControls";
import axios from "axios";

const DataSources = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/file");
        setFiles(res.data);
        setFilteredFiles(res.data); 
      } catch (err) {
        console.error("Dosyalar alınamadı:", err);
      }
    };

    fetchFiles();
  }, []);

  const handleAddFile = (file: any) => {
    setFiles((prev) => [file, ...prev]);
    setFilteredFiles((prev) => [file, ...prev]);
    setShowModal(false);
  };

  const handleDownload = (id: string) => {
    window.open(`http://localhost:4000/api/file/download/${id}`, "_blank");
  };

  const handleFilterChange = (filters: {
    filename: string;
    season: string;
    product: string;
    sortOrder: "asc" | "desc";
  }) => {
    const filtered = [...files]
      .filter((file) =>
        file.filename.toLowerCase().includes(filters.filename.toLowerCase()) &&
        file.season.toLowerCase().includes(filters.season.toLowerCase()) &&
        file.product.toLowerCase().includes(filters.product.toLowerCase())
      )
      .sort((a, b) =>
        filters.sortOrder === "asc"
          ? new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          : new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );

    setFilteredFiles(filtered);
  };

  return (
    <div className="p-6 text-white bg-[#0b1222] min-h-screen">
      <div className="flex justify-between mb-4">
        <FilterControls onFilterChange={handleFilterChange} />
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
        >
          <Plus size={18} />
          Create
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-zinc-700">
          <thead className="bg-zinc-900 text-white">
            <tr>
              <th className="p-3 border-b border-zinc-700">File Name</th>
              <th className="p-3 border-b border-zinc-700">Start Date</th>
              <th className="p-3 border-b border-zinc-700">End Date</th>
              <th className="p-3 border-b border-zinc-700">Upload Type</th>
              <th className="p-3 border-b border-zinc-700">Season</th>
              <th className="p-3 border-b border-zinc-700">Product</th>
              <th className="p-3 border-b border-zinc-700">Download</th>
            </tr>
          </thead>
          <tbody>
            {filteredFiles.map((file) => (
              <tr key={file.id} className="hover:bg-zinc-800">
                <td className="p-3 border-b border-zinc-700">{file.filename}</td>
                <td className="p-3 border-b border-zinc-700">{file.startDate?.slice(0, 10)}</td>
                <td className="p-3 border-b border-zinc-700">{file.endDate?.slice(0, 10)}</td>
                <td className="p-3 border-b border-zinc-700">{file.uploadType}</td>
                <td className="p-3 border-b border-zinc-700">{file.season}</td>
                <td className="p-3 border-b border-zinc-700">{file.product}</td>
                <td className="p-3 border-b border-zinc-700">
                  <button
                    onClick={() => handleDownload(file.id)}
                    className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
                  >
                    <Download size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <CreateFileModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAddFile}
        />
      )}
    </div>
  );
};

export default DataSources;
