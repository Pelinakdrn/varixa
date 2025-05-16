from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Literal
import pandas as pd
from io import BytesIO
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from xgboost import XGBRegressor
from lightgbm import LGBMRegressor

from ..utils.model_utils import (
    add_common_features,
    add_xgboost_features,
    add_lightgbm_features
)

router = APIRouter()
RANDOM_STATE = 42

@router.post("/run")
async def run_prediction(
    file: UploadFile = File(...),
    productType: str = Form(...),
    target: str = Form(...),
    trainSplit: float = Form(0.8),
    model: Literal["random_forest", "xgboost", "lightgbm"] = Form("random_forest")
):
    contents = await file.read()
    df = pd.read_excel(BytesIO(contents))

    if df.empty:
        raise HTTPException(400, "Excel dosyası boş")

    req_cols = {"Ürün Cinsi", "Yıl", "Hafta", target}
    if not req_cols.issubset(df.columns):
        missing = req_cols - set(df.columns)
        raise HTTPException(400, f"Eksik sütunlar: {missing}")

    df = df[df["Ürün Cinsi"] == productType].copy()
    df["Date"] = df["Yıl"].astype(str) + "-" + df["Hafta"].apply(lambda x: f"{int(x):02d}")
    df["date_index"] = pd.to_datetime(df["Date"] + "-1", format="%Y-%W-%w")
    df.sort_values("date_index", inplace=True)
    df.reset_index(drop=True, inplace=True)

    split_idx = int(len(df) * trainSplit)
    train_df = df.iloc[:split_idx].copy()
    test_df = df.iloc[split_idx:].copy()

    if model == "random_forest":
        train_df = add_common_features(train_df, target)
        test_df = add_common_features(test_df, target)
        features = ["lag_1"]
        reg = RandomForestRegressor(n_estimators=100, random_state=RANDOM_STATE)
    elif model == "xgboost":
        train_df = add_xgboost_features(train_df, target)
        test_df = add_xgboost_features(test_df, target)
        features = ["lag_1", "lag_2", "rolling_mean_3", "rolling_std_3"]
        reg = XGBRegressor(n_estimators=100, learning_rate=0.1, random_state=RANDOM_STATE)
    else:
        train_df = add_lightgbm_features(train_df, target)
        test_df = add_lightgbm_features(test_df, target)
        features = ["lag_1", "lag_2", "rolling_mean_3", "rolling_std_3", "month", "week"]
        reg = LGBMRegressor(n_estimators=100, learning_rate=0.1, random_state=RANDOM_STATE)

    train_df.dropna(inplace=True)
    test_df.dropna(inplace=True)

    X_train, y_train = train_df[features], train_df[target]
    X_test, y_test = test_df[features], test_df[target]

    reg.fit(X_train, y_train)
    y_pred_train = reg.predict(X_train)
    y_pred_test = reg.predict(X_test)

    return {
        "Train MAE": round(mean_absolute_error(y_train, y_pred_train), 2),
        "Test MAE": round(mean_absolute_error(y_test, y_pred_test), 2),
        "Train RMSE": round(mean_squared_error(y_train, y_pred_train, squared=False), 2),
        "Test RMSE": round(mean_squared_error(y_test, y_pred_test, squared=False), 2),
        "Train R2": round(r2_score(y_train, y_pred_train), 2),
        "Test R2": round(r2_score(y_test, y_pred_test), 2),
    }

# ✅ Burada /predict/preview endpoint’i tanımlanıyor
@router.post("/predict/preview")
async def preview_prediction(
    file: UploadFile = File(...),
    productType: str = Form("default"),
    target: str = Form("target_column"),
    trainSplit: float = Form(0.8),
    model: Literal["random_forest", "xgboost", "lightgbm"] = Form("random_forest")
):
    # frontend'de sadece file gönderildiği için varsayılan değerler kullanılıyor
    return await run_prediction(file, productType, target, trainSplit, model)
