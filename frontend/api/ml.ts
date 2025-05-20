import axios from "axios";

const BASE = "http://localhost:8000"; // veya VITE_ML_API_URL

export const preview = (file: File) => {
  const fd = new FormData();
  fd.append("file", file);
  return axios.post(`${BASE}/predict/preview`, fd);
};

export const runPredict = (formData: FormData) => {
  return axios.post(`${BASE}/predict/run`, formData); // ✅ sadece tek parametre
};