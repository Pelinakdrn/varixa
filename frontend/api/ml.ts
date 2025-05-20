import axios from "axios";

const BASE = "http://localhost:8000";

// Kullanıcının yüklediği dosyadaki meta bilgileri alır (kolonlar, ürün değerleri vs.)
export const preview = (file: File) => {
  const fd = new FormData();
  fd.append("file", file);
  return axios.post(`${BASE}/predict/preview`, fd); // returns { columns, productValues }
};

// Model tahmini yapar
export const runPredict = (formData: FormData) => {
  return axios.post(`${BASE}/predict/run`, formData);
};

// Gelecek haftalara yönelik tahmin (Excel döner)
export const runFutureForecast = (formData: FormData) => {
  return axios.post(`${BASE}/predict/future`, formData, {
    responseType: "blob", // Çünkü backend Excel dosyası döndürüyor
  });
};
