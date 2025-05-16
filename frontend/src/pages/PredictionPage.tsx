import { useState } from "react";
import FileUploader from "../components/FileUploader";
import ModelSelector from "../components/ModelSelector";
import PredictionResult from "../components/PredictionResult";
import * as ML from "../../api/ml";

export default function PredictionPage() {
  const [file, setFile] = useState<File|null>(null);
  const [types, setTypes] = useState<string[]>([]);
  const [productType, setProductType] = useState("");
  const [model, setModel] = useState("xgboost");
  const [result, setResult] = useState<Record<string,number>|null>(null);

  const handlePreview = async (f: File) => {
    try {
      const { data } = await ML.preview(f);
      setTypes(data.productTypes);
      setProductType(data.productTypes[0]||"");
    } catch {
      alert("Metadata alınırken hata");
    }
  };

  const handlePredict = async () => {
    if (!file) return alert("Önce dosya seçin");
    try {
      const { data } = await ML.runPredict(file, productType, model);
      setResult(data);
    } catch {
      alert("Tahmin sırasında hata oluştu.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1222] text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Prediction</h1>
      <FileUploader onFile={setFile} onPreview={handlePreview} />
      <div className="mt-4 flex space-x-4">
        <ModelSelector value={model} onChange={setModel} />
        <select
          className="p-2 bg-zinc-800 text-white rounded"
          value={productType}
          onChange={e => setProductType(e.target.value)}
        >
          {types.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <button
          onClick={handlePredict}
          className="px-4 py-2 bg-pink-500 rounded"
        >
          Predict
        </button>
      </div>
      <PredictionResult results={result} />
    </div>
  );
}
