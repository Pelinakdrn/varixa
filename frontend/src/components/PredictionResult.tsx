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

  const { metrics } = results;

  return (
    <div className="mt-6 p-4 bg-zinc-900 text-white rounded shadow">
      <h3 className="text-xl font-semibold mb-4">Performance Metrics</h3>
      <ul className="space-y-1">
        {Object.entries(metrics).map(([key, value]) => (
          <li key={key}>
            ✅ <strong>{key}:</strong> {value.toFixed(2)}
          </li>
        ))}
      </ul>

    </div>
  );
}
