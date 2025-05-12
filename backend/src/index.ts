import express from "express";
import cors from "cors";
import fileRoutes from "./routes/file.routes";
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/file", fileRoutes);
app.use("/api/auth", authRoutes); 

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
