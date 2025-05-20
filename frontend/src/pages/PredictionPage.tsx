import { useState } from "react";
import FileUploader from "../components/FileUploader";
import ModelSelector from "../components/ModelSelector";
import PredictionResult from "../components/PredictionResult";
import * as ML from "../../api/ml";

export default function PredictionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [target, setTarget] = useState("");
  const [productGroup, setProductGroup] = useState("nos");
  const [model, setModel] = useState("xgboost");
  const [result, setResult] = useState<null | {
    metrics: Record<string, number>;
    last_predictions: number[];
  }>(null);

  const handlePreview = async (f: File) => {
    try {
      const { data } = await ML.preview(f);
      setFile(f);
      setColumns(data.columns || []);
      setTarget(data.columns?.[0] || "");
    } catch {
      alert("Metadata alınırken hata");
    }
  };

  const handlePredict = async () => {
    if (!file || !target) return alert("Lütfen dosya ve hedef değişkeni seçin");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("productGroup", productGroup);
      formData.append("target", target);
      formData.append("modelType", model);

      const { data } = await ML.runPredict(formData);
      setResult(data);
    } catch {
      alert("Tahmin sırasında hata oluştu.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1222] text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Prediction</h1>

      <FileUploader onFile={handlePreview} onPreview={handlePreview} />

      {/* Seçim alanları her zaman gözüksün */}
      <div className="mt-6 flex flex-col gap-4">
        <div className="flex gap-4 items-center">
          <select
            className="p-2 bg-zinc-800 rounded"
            value={productGroup}
            onChange={(e) => setProductGroup(e.target.value)}
          >
            <option value="nos">NOS</option>
            <option value="summer">Summer</option>
            <option value="winter">Winter</option>
          </select>

          <ModelSelector value={model} onChange={setModel} />

          <select
            className="p-2 bg-zinc-800 rounded"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            disabled={columns.length === 0}
          >
            {columns.length === 0 ? (
              <option>Hedef değişken yüklemek için dosya seçin</option>
            ) : (
              columns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))
            )}
          </select>

          <button
            onClick={handlePredict}
            className="px-4 py-2 bg-pink-500 rounded"
            disabled={!file || !target}
          >
            Predict
          </button>
        </div>
      </div>

      <PredictionResult results={result} />
    </div>
  );
}
