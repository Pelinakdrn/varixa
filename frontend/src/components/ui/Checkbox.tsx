import React from "react";

type CheckboxProps = {
  label: string;
  name: string;
};

const Checkbox: React.FC<CheckboxProps> = ({ label, name }) => (
  <label className="flex items-center gap-2">
    <input type="checkbox" name={name} className="outline-none focus:outline focus:outline-sky-300" />
    <span className="text-xs">{label}</span>
  </label>
);

export default Checkbox;
