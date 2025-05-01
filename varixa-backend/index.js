const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = 5000;

// PostgreSQL bağlantı ayarları
const pool = new Pool({
  user: "postgres",             // 👉 pgAdmin'deki kullanıcı adın (çoğu zaman "postgres")
  host: "localhost",
  database: "penti_app",         // 👉 oluşturduğun veritabanı adı
  password: "2005pA.",     // 👉 şifreni buraya yaz
  port: 5432,
});

// Middleware
app.use(cors());
app.use(express.json());

// GİRİŞ API'Sİ: Login formundan gelen veriyi kontrol eder
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );

    if (result.rows.length > 0) {
      res.json({ success: true, user: result.rows[0] });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Server başlat
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
