import { useState, useEffect } from "react";
import { Plus, Download } from "lucide-react";
import CreateFileModal from "../components/dataSources/CreateFileModal";
import axios from "axios";

const DataSources = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/file");
        setFiles(res.data);
      } catch (err) {
        console.error("Dosyalar alınamadı:", err);
      }
    };

    fetchFiles();
  }, []);

  const handleAddFile = (file: any) => {
    setFiles((prev) => [file, ...prev]);
    setShowModal(false);
  };

  const handleDownload = (id: string) => {
    window.open(`http://localhost:4000/api/file/download/${id}`, "_blank");
  };

  return (
    <div className="p-6 text-white">
      <div className="flex justify-end mb-4">
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
          <thead className="bg-zinc-800 text-left">
            <tr>
              <th className="p-3 border-b">File Name</th>
              <th className="p-3 border-b">Start Date</th>
              <th className="p-3 border-b">End Date</th>
              <th className="p-3 border-b">Upload Type</th>
              <th className="p-3 border-b">Season</th>
              <th className="p-3 border-b">Product</th>
              <th className="p-3 border-b">Download</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.id} className="hover:bg-zinc-800">
                <td className="p-3 border-b">{file.filename}</td>
                <td className="p-3 border-b">{file.startDate?.slice(0, 10)}</td>
                <td className="p-3 border-b">{file.endDate?.slice(0, 10)}</td>
                <td className="p-3 border-b">{file.uploadType}</td>
                <td className="p-3 border-b">{file.season}</td>
                <td className="p-3 border-b">{file.product}</td>
                <td className="p-3 border-b">
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
