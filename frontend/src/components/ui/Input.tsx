import React from "react";

type InputProps = {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Input: React.FC<InputProps> = ({
  label,
  name,
  placeholder,
  type = "text",
  value,
  onChange,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 rounded-md bg-[#1f2937] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-500"
      />
    </div>
  );
};

export default Input;
