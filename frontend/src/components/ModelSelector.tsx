export default function ModelSelector({
  value,
  onChange
}: { value: string; onChange(v: string): void }) {
  return (
    <select
      className="p-2 bg-zinc-800 text-white rounded"
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      <option value="random_forest">Random Forest</option>
      <option value="xgboost">XGBoost</option>
      <option value="lightgbm">LightGBM</option>
    </select>
  );
}
