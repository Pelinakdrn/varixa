# backend/routes/predict_routes.py
from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
from io import BytesIO

router = APIRouter()

@router.post("/preview")
async def preview_file(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        df = pd.read_excel(BytesIO(contents))

        if df.empty:
            raise HTTPException(status_code=400, detail="Excel dosyası boş")

        # Ürün cinsi sütunu kontrolü
        urun_cinsi_column = "Ürün Cinsi"
        if urun_cinsi_column not in df.columns:
            raise HTTPException(status_code=400, detail="'Ürün Cinsi' sütunu bulunamadı")

        # Tarih sütunları kontrolü
        if "Yıl" not in df.columns or "Hafta" not in df.columns:
            raise HTTPException(status_code=400, detail="'Yıl' veya 'Hafta' sütunu eksik")

        df['Date'] = df['Yıl'].astype(str) + '-' + df['Hafta'].apply(lambda x: f"{int(x):02d}")
        df['date_index'] = pd.to_datetime(df['Date'] + '-1', format='%Y-%W-%w')

        return {
            "columns": df.columns.tolist(),
            "unique_urun_cinsi": df[urun_cinsi_column].dropna().unique().tolist(),
            "min_date": df['date_index'].min().strftime("%Y-%m-%d"),
            "max_date": df['date_index'].max().strftime("%Y-%m-%d")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"İşleme hatası: {str(e)}")
