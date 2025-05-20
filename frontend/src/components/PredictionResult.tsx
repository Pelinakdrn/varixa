type Props = {
  results: Record<string, number>[] | null;
};

export default function PredictionResult({ results }: Props) {
  return (
    <div className="mt-6 p-4 bg-zinc-900 text-white rounded shadow">
      <h3 className="text-xl mb-2">Outputs</h3>

      {!results || results.length === 0 ? (
        <p className="italic text-gray-400">Henüz bir sonuç üretilmedi.</p>
      ) : (
        <ul className="space-y-2">
          {results.map((res, index) => (
            <li key={index} className="border border-zinc-700 p-2 rounded">
              <p className="text-sm text-gray-300 mb-1">#{index + 1} Tahmin</p>
              {Object.entries(res).map(([key, value]) => (
                <div key={key}>
                  ✅ <strong>{key}:</strong> {value}
                </div>
              ))}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
