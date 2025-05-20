// components/FuturePredictForm.tsx
import { useEffect, useState } from "react";
import * as ML from "../../api/ml";

export default function FuturePredictForm({
  file,
  productValues,
  columns,
}: {
  file: File | null;
  productValues: string[];
  columns: string[];
}) {
  const [model, setModel] = useState("xgboost");
  const [target, setTarget] = useState(columns[0] || "");
  const [selectedProduct, setSelectedProduct] = useState(productValues[0] || "");
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [dots, setDots] = useState(".");

  // 🌀 Nokta animasyonu
  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "." : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (columns.length > 0 && !target) setTarget(columns[0]);
    if (productValues.length > 0 && !selectedProduct) setSelectedProduct(productValues[0]);
  }, [columns, productValues]);

  const handleFuturePredict = async () => {
    if (!file || !target || !selectedProduct) {
      alert("Eksik bilgi");
      return;
    }

    setLoading(true);
    setDownloadUrl(null);

    const fd = new FormData();
    fd.append("file", file);
    fd.append("modelType", model);
    fd.append("target", target);
    fd.append("selectedProduct", selectedProduct);

    try {
      const response = await ML.runFutureForecast(fd);
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch {
      alert("Tahmin hatası");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">Future Prediction</h2>
      <div className="flex gap-4 flex-wrap items-center">
        <select
          className="p-2 bg-zinc-800 rounded"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        >
          <option value="xgboost">XGBoost</option>
          <option value="rf">Random Forest</option>
        </select>

        <select
          className="p-2 bg-zinc-800 rounded"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        >
          {columns.map((col) => (
            <option key={col} value={col}>
              {col}
            </option>
          ))}
        </select>

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

        <button
          onClick={handleFuturePredict}
          className="px-4 py-2 bg-pink-500 rounded disabled:opacity-50"
          disabled={loading || !file || !target || !selectedProduct}
        >
          {loading ? `Model is running${dots}` : "Predict"}
        </button>
      </div>

      <div className="mt-4">
        {downloadUrl ? (
          <a
            href={downloadUrl}
            download="future_forecast.xlsx"
            className="text-blue-400 underline"
          >
            Download Forecast Excel
          </a>
        ) : (
          <span className="text-gray-400">There is no result yet.</span>
        )}
      </div>
    </div>
  );
}
