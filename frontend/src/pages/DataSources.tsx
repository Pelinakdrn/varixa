import { useState } from "react";
import { Plus, Download } from "lucide-react";
import CreateFileModal from "../components/dataSources/CreateFileModal";

const DataSources = () => {
  const [files, setFiles] = useState([
    {
      id: "1",
      filename: "example.xlsx",
      startDate: "2024-05-01",
      endDate: "2024-06-01",
      uploadType: "raw",
      season: "Spring",
      product: "Tomato",
      fileBlob: null,
    },
  ]);
  const [showModal, setShowModal] = useState(false);

  const handleAddFile = (file: any) => {
    setFiles((prev) => [...prev, file]);
    setShowModal(false);
  };

  const handleDownload = (file: any) => {
    if (!file.fileBlob) return;
    const url = URL.createObjectURL(file.fileBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 text-white min-h-screen bg-[#0b1222]">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white"
        >
          <Plus size={18} />
          Create
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-zinc-700 text-white">
          <thead className="bg-zinc-800 text-left">
            <tr>
              <th className="p-3 border-b">File Name</th>
              <th className="p-3 border-b">Start Date</th>
              <th className="p-3 border-b">End Date</th>
              <th className="p-3 border-b">Upload Type</th>
              <th className="p-3 border-b">Season</th>
              <th className="p-3 border-b">Product</th>
              <th className="p-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.id} className="hover:bg-zinc-800">
                <td className="p-3 border-b">{file.filename}</td>
                <td className="p-3 border-b">{file.startDate}</td>
                <td className="p-3 border-b">{file.endDate}</td>
                <td className="p-3 border-b">{file.uploadType}</td>
                <td className="p-3 border-b">{file.season}</td>
                <td className="p-3 border-b">{file.product}</td>
                <td className="p-3 border-b">
                  <button
                    onClick={() => handleDownload(file)}
                    className="text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <Download size={16} /> Download
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
