export default function PredictionResult({
  results,
}: {
  results: Record<string, number> | null;
}) {
  return (
    <div className="mt-6 p-4 bg-zinc-900 text-white rounded shadow">
      <h3 className="text-xl mb-2">Outputs</h3>
      {!results && (
        <p className="italic text-gray-400">Henüz bir sonuç üretilmedi.</p>
      )}
      {results && (
        <ul className="space-y-1">
          {Object.entries(results).map(([k, v]) => (
            <li key={k}>
              ✅ <strong>{k}:</strong> {v}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
