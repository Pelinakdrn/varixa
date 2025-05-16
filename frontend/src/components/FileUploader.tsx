import React, { useState } from "react";

export default function FileUploader({
  onFile,
  onPreview,
}: {
  onFile: (f: File) => void;
  onPreview: (f: File) => void;
}) {
  const [name, setName] = useState("");
  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setName(f.name);
    onFile(f);
    onPreview(f);
  };
  return (
    <div className="border-2 border-dashed p-6 rounded text-center">
      <input
        type="file"
        accept=".xls,.xlsx"
        onChange={handle}
        className="hidden"
        id="file"
      />
      <label
        htmlFor="file"
        className="cursor-pointer px-4 py-2 bg-purple-600 text-white rounded"
      >
        Browse files
      </label>
      {name && <div className="mt-2 text-green-400">{name}</div>}
    </div>
  );
}
