import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route"; // 🔹

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 Burada rotayı ekliyoruz
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
