import { useState } from "react";
import PredictStep1 from "../components/prediction/PredictStep1";
import axios from "axios";

const Prediction = () => {
  const [meta, setMeta] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    model: "random_forest",
    productType: "",
    target: "",
    trainStart: "",
    trainEnd: "",
    testStart: "",
    testEnd: "",
  });

  const handleMetaFetched = (metaData: any) => {
    setMeta(metaData);
    setForm((prev) => ({
      ...prev,
      productType: metaData.productTypes?.[0] || "",
      target: metaData.columns?.[0] || "",
      trainStart: metaData.trainRange?.start || "",
      trainEnd: metaData.trainRange?.end || "",
      testStart: metaData.testRange?.start || "",
      testEnd: metaData.testRange?.end || "",
    }));
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePredict = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const res = await axios.post("http://localhost:4000/api/predict/run", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Prediction result:", res.data);
    } catch (err) {
      console.error("Prediction failed:", err);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-[#0b1222] text-white">
      <div className="max-w-4xl">
        <PredictStep1 onMetaFetched={handleMetaFetched} onFileSelect={handleFileSelect} />

        <div className="mt-6 space-y-4 bg-zinc-900 p-4 rounded border border-zinc-600">
          <h3 className="text-lg font-bold text-purple-400">Configuration</h3>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Product Type ("Ürün Cinsi")</label>
            <select
              name="productType"
              value={form.productType}
              onChange={handleInputChange}
              disabled={!meta}
              className="w-full p-2 rounded bg-zinc-800 text-white border border-zinc-600 disabled:opacity-50"
            >
              {meta?.productTypes?.map((type: string) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Target Column</label>
            <select
              name="target"
              value={form.target}
              onChange={handleInputChange}
              disabled={!meta}
              className="w-full p-2 rounded bg-zinc-800 text-white border border-zinc-600 disabled:opacity-50"
            >
              {meta?.columns?.map((col: string) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-300 mb-1">Train Start</label>
              <input
                type="date"
                name="trainStart"
                value={form.trainStart}
                onChange={handleInputChange}
                disabled={!meta}
                className="w-full p-2 rounded bg-zinc-800 text-white border border-zinc-600 disabled:opacity-50"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-300 mb-1">Train End</label>
              <input
                type="date"
                name="trainEnd"
                value={form.trainEnd}
                onChange={handleInputChange}
                disabled={!meta}
                className="w-full p-2 rounded bg-zinc-800 text-white border border-zinc-600 disabled:opacity-50"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-300 mb-1">Test Start</label>
              <input
                type="date"
                name="testStart"
                value={form.testStart}
                onChange={handleInputChange}
                disabled={!meta}
                className="w-full p-2 rounded bg-zinc-800 text-white border border-zinc-600 disabled:opacity-50"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-300 mb-1">Test End</label>
              <input
                type="date"
                name="testEnd"
                value={form.testEnd}
                onChange={handleInputChange}
                disabled={!meta}
                className="w-full p-2 rounded bg-zinc-800 text-white border border-zinc-600 disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Model</label>
            <select
              name="model"
              value={form.model}
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-zinc-800 text-white border border-zinc-600"
            >
              <option value="random_forest">Random Forest</option>
              <option value="xgboost">XGBoost</option>
            </select>
          </div>

          <button
            onClick={handlePredict}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded mt-2"
            disabled={!meta || !selectedFile}
          >
            Predict
          </button>
        </div>
      </div>
    </div>
  );
};

export default Prediction;
