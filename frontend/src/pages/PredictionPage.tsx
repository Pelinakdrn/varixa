import { useState, useEffect } from "react";
import FileUploader from "../components/FileUploader";
import ModelSelector from "../components/ModelSelector";
import PredictionResult from "../components/PredictionResult";
import * as ML from "../../api/ml";
import FuturePredictForm from "../components/FuturePredictForm";

export default function PredictionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [target, setTarget] = useState("");
  const [model, setModel] = useState("xgboost");
  const [productGroup, setProductGroup] = useState("nos");

  const [productValues, setProductValues] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");

  const [result, setResult] = useState<null | {
    metrics: Record<string, number>;
    last_predictions: number[];
  }>(null);

  const [loading, setLoading] = useState(false);
  const [dots, setDots] = useState(".");

  // 🔁 Nokta animasyonu
  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "." : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, [loading]);

  const handlePreview = async (f: File) => {
    try {
      const { data } = await ML.preview(f);
      setFile(f);
      setColumns(data.columns || []);
      setTarget(data.columns?.[0] || "");

      const products = data.productValues || [];
      setProductValues(products);
      setSelectedProduct(products[0] || "");
    } catch {
      alert("Metadata alınırken hata");
    }
  };

  const handlePredict = async () => {
    if (!file || !target) return alert("Lütfen gerekli alanları doldurun.");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("productGroup", productGroup);
      formData.append("target", target);
      formData.append("modelType", model);

      if (selectedProduct) {
        formData.append("selectedProduct", selectedProduct);
      }

      const { data } = await ML.runPredict(formData);
      setResult(data);
    } catch {
      alert("Tahmin sırasında hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1222] text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Prediction</h1>

      <FileUploader onFile={handlePreview} onPreview={handlePreview} />

      <div className="mt-6 flex flex-col gap-4">
        <div className="flex gap-4 items-center flex-wrap">
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

          {productValues.length > 0 && (
            <select
              className="p-2 bg-zinc-800 rounded"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
            >
              {productValues.map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={handlePredict}
            className="px-4 py-2 bg-pink-500 rounded disabled:opacity-50"
            disabled={!file || !target || loading}
          >
            Predict
          </button>

          {/* ⏳ Yükleniyor yazısı */}
          {loading && (
            <span className="ml-2 text-sm text-gray-400">
              Model is running{dots}
            </span>
          )}
        </div>
      </div>

      <PredictionResult results={result} />
      <FuturePredictForm file={file} productValues={productValues} columns={columns} />

    </div>
  );
}
