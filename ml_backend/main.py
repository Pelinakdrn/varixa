from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import predict  # relative import
# eğer future.py de kullanacaksanız:
# from .routes import future

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# predict router’ını “/predict” prefix’i ile ekliyoruz
app.include_router(predict.router, prefix="/predict", tags=["predict"])

# benzer şekilde future router’ı varsa:
# app.include_router(future.router, prefix="/future", tags=["future"])
