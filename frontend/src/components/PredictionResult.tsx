type Props = {
  results: {
    metrics: Record<string, number>;
    last_predictions: number[];
  } | null;
};

export default function PredictionResult({ results }: Props) {
  if (!results) {
    return (
      <div className="mt-6 p-4 bg-zinc-900 text-white rounded shadow">
        <p className="italic text-gray-400">Henüz bir sonuç üretilmedi.</p>
      </div>
    );
  }

  const { metrics, last_predictions } = results;

  return (
    <div className="mt-6 p-4 bg-zinc-900 text-white rounded shadow">
      <h3 className="text-xl font-semibold mb-4">📊 Performans Metrikleri</h3>
      <ul className="space-y-1">
        {Object.entries(metrics).map(([key, value]) => (
          <li key={key}>
            ✅ <strong>{key}:</strong> {value.toFixed(2)}
          </li>
        ))}
      </ul>

      <h4 className="text-lg font-semibold mt-6">📈 Son Tahminler</h4>
      <ul className="mt-2 space-y-1">
        {last_predictions.map((val, idx) => (
          <li key={idx}>
            #{idx + 1} Tahmin: <strong>{val.toFixed(2)}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
