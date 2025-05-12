import { useState } from "react";
import PredictionUpload from "../components/prediction/PredictionUpload";

const Prediction = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    console.log("Seçilen dosya:", file.name);
  };

  return (
    <div className="min-h-screen p-6 bg-[#0b1222] text-white">
      <div className="max-w-2xl">
        <PredictionUpload onFileSelect={handleFileSelect} />

        {selectedFile && (
          <div className="mt-4 p-4 rounded bg-zinc-800 border border-zinc-600">
            <p className="text-green-400">
                Selected File:{" "}
              <span className="font-medium">{selectedFile.name}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prediction;
