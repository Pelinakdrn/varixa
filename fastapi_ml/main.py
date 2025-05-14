from fastapi import FastAPI, UploadFile, File, HTTPException
import pandas as pd
from io import BytesIO
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# 🔓 CORS ayarı (React/Node backend'in erişebilmesi için)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # güvenlik için istersen bunu özelleştir
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict/preview")
async def preview_file(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        df = pd.read_excel(BytesIO(contents))

        if df.empty:
            raise HTTPException(status_code=400, detail="Excel dosyası boş")

        if "Ürün Cinsi" not in df.columns or "Yıl" not in df.columns or "Hafta" not in df.columns:
            raise HTTPException(status_code=400, detail="'Ürün Cinsi', 'Yıl' veya 'Hafta' sütunu eksik")

        df['Date'] = df['Yıl'].astype(str) + '-' + df['Hafta'].apply(lambda x: f"{int(x):02d}")
        df['date_index'] = pd.to_datetime(df['Date'] + '-1', format='%Y-%W-%w')

        return {
            "columns": df.columns.tolist(),
            "productTypes": df["Ürün Cinsi"].dropna().unique().tolist(),
            "trainRange": {
                "start": df['date_index'].min().strftime("%Y-%m-%d"),
                "end": df['date_index'].max().strftime("%Y-%m-%d"),
            },
            "testRange": {
                "start": df['date_index'].min().strftime("%Y-%m-%d"),
                "end": df['date_index'].max().strftime("%Y-%m-%d"),
            },
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Hata oluştu: {str(e)}")
