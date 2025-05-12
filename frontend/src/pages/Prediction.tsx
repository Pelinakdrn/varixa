import { useState } from "react";
import PredictStep1 from "../components/prediction/PredictStep1";

const Prediction = () => {
  const [meta, setMeta] = useState<any>(null);

  return (
    <div className="min-h-screen p-6 bg-[#0b1222] text-white">
      <div className="max-w-4xl">
        <PredictStep1 onMetaFetched={setMeta} />

        {/* Her zaman göster, ama meta gelene kadar disabled ve boş */}
        <div className="mt-6 space-y-4 bg-zinc-900 p-4 rounded border border-zinc-600">
          <h3 className="text-lg font-bold text-purple-400">Configuration</h3>

          {/* ÜRÜN CİNSİ */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Product Type ("Ürün Cinsi")</label>
            <select
              disabled={!meta}
              className="w-full p-2 rounded bg-zinc-800 text-white border border-zinc-600 disabled:opacity-50"
            >
              {meta?.productTypes?.map((type: string) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* TARGET */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Target Column</label>
            <select
              disabled={!meta}
              className="w-full p-2 rounded bg-zinc-800 text-white border border-zinc-600 disabled:opacity-50"
            >
              {meta?.columns?.map((col: string) => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>

          {/* TRAIN TARİHLERİ */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-300 mb-1">Train Start</label>
              <input
                type="date"
                disabled={!meta}
                defaultValue={meta?.trainRange?.start}
                className="w-full p-2 rounded bg-zinc-800 text-white border border-zinc-600 disabled:opacity-50"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-300 mb-1">Train End</label>
              <input
                type="date"
                disabled={!meta}
                defaultValue={meta?.trainRange?.end}
                className="w-full p-2 rounded bg-zinc-800 text-white border border-zinc-600 disabled:opacity-50"
              />
            </div>
          </div>

          {/* TEST TARİHLERİ */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-300 mb-1">Test Start</label>
              <input
                type="date"
                disabled={!meta}
                defaultValue={meta?.testRange?.start}
                className="w-full p-2 rounded bg-zinc-800 text-white border border-zinc-600 disabled:opacity-50"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-300 mb-1">Test End</label>
              <input
                type="date"
                disabled={!meta}
                defaultValue={meta?.testRange?.end}
                className="w-full p-2 rounded bg-zinc-800 text-white border border-zinc-600 disabled:opacity-50"
              />
            </div>
          </div>

          {/* MODEL */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Model</label>
            <select
              className="w-full p-2 rounded bg-zinc-800 text-white border border-zinc-600"
            >
              <option value="random_forest">Random Forest</option>
              <option value="xgboost">XGBoost</option>
            </select>
          </div>

          {/* Predict Button */}
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded mt-2"
            disabled={!meta}
          >
            Predict
          </button>
        </div>
      </div>
    </div>
  );
};

export default Prediction;
