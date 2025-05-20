from fastapi import UploadFile, File, Form, APIRouter, HTTPException
import pandas as pd
from io import BytesIO
from xgboost import XGBRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.model_selection import GridSearchCV
import traceback

router = APIRouter()

REQUIRED_COLUMNS = [
    'date_index', 'Özel_günler',
    'Ortalama Avg Temperature (°C)', 'Ortalama Avg Humidity (%)', 'Ürün Cinsi'
]

@router.post("/preview")
async def preview_excel(file: UploadFile = File(...)):
    try:
        df = pd.read_excel(BytesIO(await file.read()))
        return {
            "columns": df.columns.tolist(),
            "productValues": df["Ürün Cinsi"].dropna().unique().tolist() if "Ürün Cinsi" in df.columns else []
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Önizleme hatası: {str(e)}")


@router.post("/run")
async def run_model(
    file: UploadFile = File(...),
    productGroup: str = Form(...),
    modelType: str = Form(...),
    target: str = Form(...),
    selectedProduct: str = Form(None)
):
    try:
        df = pd.read_excel(BytesIO(await file.read()))

        for col in REQUIRED_COLUMNS + [target]:
            if col not in df.columns:
                raise HTTPException(status_code=400, detail=f"Gerekli kolon eksik: {col}")

        # ∅ Filtrele ürün bazlı
        if selectedProduct and "Ürün Cinsi" in df.columns:
            df = df[df["Ürün Cinsi"] == selectedProduct]

        df['date_index'] = pd.to_datetime(df['date_index'])
        df['year'] = df['date_index'].dt.year
        df['month'] = df['date_index'].dt.month
        df['week'] = df['date_index'].dt.isocalendar().week
        df['is_summer'] = df['week'].astype(int).isin(range(22, 36)).astype(int)
        df['is_start_of_year'] = df['week'].astype(int).isin(range(1, 3)).astype(int)
        df['is_end_of_year'] = df['week'].astype(int).isin(range(50, 54)).astype(int)
        df['is_special_day'] = df['Özel_günler'].astype(str).ne("0").astype(int)

        df['lag_1'] = df[target].shift(1)
        df['lag_2'] = df[target].shift(2)
        df['sales_diff_1'] = df[target].diff()
        df['sales_diff_2'] = df[target].diff(2)
        df['rolling_mean_3'] = df[target].rolling(window=3).mean()
        df['rolling_std_3'] = df[target].rolling(window=3).std()
        df.dropna(inplace=True)

        feature_cols = [
            'lag_1', 'lag_2', 'sales_diff_1', 'sales_diff_2', 'rolling_mean_3', 'rolling_std_3',
            'Ortalama Avg Temperature (°C)', 'Ortalama Avg Humidity (%)',
            'is_summer', 'is_start_of_year', 'is_end_of_year', 'is_special_day', 'month'
        ]

        train_df = df[df['year'].isin([2016, 2017])]
        test_df = df[df['year'] == 2018]

        if train_df.empty or test_df.empty:
            raise HTTPException(status_code=400, detail="Yetersiz veri: Eğitim veya test seti boş.")

        X_train = train_df[feature_cols]
        y_train = train_df[target]
        X_test = test_df[feature_cols]
        y_test = test_df[target]

        rf_model = GridSearchCV(
            estimator=RandomForestRegressor(random_state=42),
            param_grid={
                'n_estimators': [100],
                'max_depth': [4, 5, 6],
                'min_samples_leaf': [5, 10],
                'max_features': ['sqrt', 0.5],
            },
            scoring='neg_mean_squared_error',
            cv=5,
            n_jobs=-1
        ).fit(X_train, y_train).best_estimator_

        xgb_model = XGBRegressor(
            objective='reg:squarederror',
            random_state=42,
            n_estimators=100,
            learning_rate=0.05,
            max_depth=3,
            subsample=0.8,
            colsample_bytree=0.8,
            reg_alpha=5,
            reg_lambda=10
        )
        xgb_model.fit(X_train, y_train)

        if modelType == "xgboost":
            y_pred_train = xgb_model.predict(X_train)
            y_pred_test = xgb_model.predict(X_test)
        elif modelType == "rf":
            y_pred_train = rf_model.predict(X_train)
            y_pred_test = rf_model.predict(X_test)
        else:
            y_pred_train = (rf_model.predict(X_train) + xgb_model.predict(X_train)) / 2
            y_pred_test = (rf_model.predict(X_test) + xgb_model.predict(X_test)) / 2

        return {
            "metrics": {
                "Train MAE": mean_absolute_error(y_train, y_pred_train),
                "Test MAE": mean_absolute_error(y_test, y_pred_test),
                "Train R2": r2_score(y_train, y_pred_train),
                "Test R2": r2_score(y_test, y_pred_test),
                "Correctness (%)": round(100 * (1 - mean_absolute_error(y_test, y_pred_test) / y_test.mean()), 2)
            },
            "last_predictions": y_pred_test[-5:].tolist()
        }

    except Exception as e:
        print("\U0001f4a5 Backend Hatası:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Model hatası: {str(e)}")
