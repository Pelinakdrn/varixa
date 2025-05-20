import axios from "axios";

const BASE = "http://localhost:8000";

export const preview = (file: File) => {
  const fd = new FormData();
  fd.append("file", file);
  return axios.post(`${BASE}/predict/preview`, fd); // returns { columns, productValues }
};

export const runPredict = (formData: FormData) => {
  return axios.post(`${BASE}/predict/run`, formData);
};
