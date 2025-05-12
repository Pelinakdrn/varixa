import { useState } from "react";
import axios from "axios";

const PredictStep1 = ({ onMetaFetched }: { onMetaFetched: (meta: any) => void }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:4000/api/predict/preview", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onMetaFetched(res.data); // meta bilgileri parent component'e aktar
    } catch (err: any) {
      setError("Failed to fetch metadata.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 p-4 rounded shadow w-full max-w-2xl">
      <h2 className="text-lg font-bold text-white border-b border-purple-500 pb-1 mb-2">Prediction</h2>
      <p className="text-sm text-gray-400 mb-2">Please upload an Excel file to proceed.</p>

      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full
                   file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white
                   hover:file:bg-purple-700"
      />

      {loading && <p className="text-yellow-400 mt-2">Processing file...</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {selectedFile && !loading && (
        <p className="text-green-400 mt-2">Selected File: {selectedFile.name}</p>
      )}
    </div>
  );
};

export default PredictStep1;
