import axios from "axios";
const BASE = "http://localhost:8000";
export const preview = (file: File) => {
  const fd = new FormData(); fd.append("file", file);
  return axios.post(`${BASE}/predict/preview`, fd);
};
export const runPredict = (file: File, productType: string, model: string) => {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("productType", productType);
  fd.append("model", model);
  return axios.post(`${BASE}/predict/run`, fd);
};
