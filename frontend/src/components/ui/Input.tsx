type InputProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
};

const Input: React.FC<InputProps> = ({ label, name, type = "text", placeholder }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-white mb-1">{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full rounded-md border border-gray-600 bg-transparent px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
      />
    </div>
  );
};

export default Input;
