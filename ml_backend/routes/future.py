from fastapi import APIRouter, UploadFile, File, HTTPException, Form
# … benzer preview + run mantığı, 
# sadece train/test yerine bütün geçmiş veride XGBoost ile forward-predict 
# (ör. last N haftayı feature’a çevir + predict).
