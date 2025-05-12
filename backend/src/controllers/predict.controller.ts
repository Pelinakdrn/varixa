import { Request, Response } from "express";
import xlsx from "xlsx";

export const previewDataset = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;

    if (!file) {
      res.status(400).json({ message: "Dosya bulunamadı." });
      return;
    }

    // Excel dosyasını oku
    const workbook = xlsx.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const jsonData: Record<string, any>[] = xlsx.utils.sheet_to_json(sheet);

    if (!Array.isArray(jsonData) || jsonData.length === 0) {
      res.status(400).json({ message: "Geçerli veri bulunamadı." });
      return;
    }

    // Sütun isimleri
    const columns = Object.keys(jsonData[0]);

    // Ürün Cinsi sütunundaki eşsiz değerler
    const productTypes = [...new Set(jsonData.map((row) => row["Ürün Cinsi"]))];

    // date_index üzerinden tarih aralığı hesaplama
    const sortedDates = jsonData
      .map((row) => new Date(row["date_index"]))
      .filter((d) => !isNaN(d.getTime()))
      .sort((a, b) => a.getTime() - b.getTime());

    const start = sortedDates[0]?.toISOString().slice(0, 10) || null;
    const end = sortedDates[sortedDates.length - 1]?.toISOString().slice(0, 10) || null;

    res.json({
      columns,
      productTypes,
      trainRange: { start, end },
      testRange: { start, end },
    });
  } catch (error) {
    console.error("Preview error:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};
