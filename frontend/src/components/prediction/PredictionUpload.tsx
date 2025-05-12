import { useState } from "react";

const PredictionUpload = ({ onFileSelect }: { onFileSelect: (file: File) => void }) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2 text-white">
      <h2 className="text-lg font-semibold border-b border-purple-500 w-fit">Prediction</h2>
      <p className="text-sm text-gray-400">Please upload an Excel file to proceed.</p>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        className={`rounded p-6 flex flex-col items-center justify-center text-center transition-colors duration-200 ${
          dragOver
            ? "border-2 border-purple-500 bg-[#1e1b2e]"
            : "border-2 border-zinc-700 bg-[#0b1222]"
        }`}
      >
        <label className="cursor-pointer">
          <div className="bg-zinc-800 text-white px-4 py-2 rounded hover:bg-zinc-700">
            Browse files
          </div>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
        <p className="mt-2 text-sm text-gray-400">Drag and drop a file here</p>
      </div>
    </div>
  );
};

export default PredictionUpload;
