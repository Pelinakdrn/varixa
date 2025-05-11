import { useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext"; // AuthContext'ten kullanıcıyı alacağız

const CreateFileModal = ({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (file: any) => void;
}) => {
  const { auth } = useAuth(); // auth içinden userId al
  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    uploadType: "raw",
    season: "",
    product: "",
  });

  const [file, setFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) return alert("Dosya seçilmedi.");
    if (!auth?.user?.id) return alert("Kullanıcı ID'si alınamadı.");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("startDate", form.startDate);
    formData.append("endDate", form.endDate);
    formData.append("uploadType", form.uploadType);
    formData.append("season", form.season);
    formData.append("product", form.product);
    formData.append("userId", auth.user.id); 

    try {
      await axios.post("http://localhost:4000/api/file/upload", formData);
      onSubmit({
        id: Date.now().toString(),
        filename: file.name,
        ...form,
      });
    } catch (err) {
      console.error(err);
      alert("Yükleme başarısız.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-[#0b1222] p-6 rounded-lg w-full max-w-md border border-zinc-700 text-white">
        <h2 className="text-xl font-bold mb-4">Upload File</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-300"
          />
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-transparent border border-zinc-600"
          />
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-transparent border border-zinc-600"
          />
          <select
            name="uploadType"
            value={form.uploadType}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-transparent border border-zinc-600"
          >
            <option value="raw">Raw</option>
            <option value="output">Output</option>
          </select>
          <input
            type="text"
            name="season"
            placeholder="Season"
            value={form.season}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-transparent border border-zinc-600"
          />
          <input
            type="text"
            name="product"
            placeholder="Product"
            value={form.product}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-transparent border border-zinc-600"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500">
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFileModal;
