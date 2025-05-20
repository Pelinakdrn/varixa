from fastapi import UploadFile, File, Form, APIRouter, HTTPException
from fastapi.responses import FileResponse
import pandas as pd
import numpy as np
from io import BytesIO
import tempfile
import traceback
import os

from xgboost import XGBRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

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
        raise HTTPException(status_code=400, detail=f"\u00d6nizleme hatas\u0131: {str(e)}")

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


# --- Future Forecast ---
def recursive_forecast(model, initial_row, n_weeks=8):
    forecasts = []
    last_known = initial_row.copy()
    current_date = last_known.name

    for _ in range(1, n_weeks + 1):
        current_date += pd.Timedelta(weeks=1)
        week_num = int(current_date.strftime("%U"))
        year = current_date.year

        lag_1 = last_known['Totalsale']
        lag_2 = last_known.get('lag_2', lag_1)
        lag_3 = last_known.get('lag_3', lag_2)
        rolling_4 = [lag_1, lag_2, lag_3, last_known.get('lag_4', lag_3)]

        input_features = pd.DataFrame([{
            'lag_1': lag_1,
            'lag_2': lag_2,
            'lag_3': lag_3,
            'rolling_mean_4': np.mean(rolling_4),
            'rolling_median_4': np.median(rolling_4),
            'rolling_max_4': np.max(rolling_4),
            'rolling_min_4': np.min(rolling_4),
            'rolling_std_4': np.std(rolling_4),
            'trend_slope': last_known.get('trend_slope', 0),
            'is_spring': int(week_num in range(10, 22))
        }])

        if hasattr(model, "feature_names_in_"):
            input_features = input_features[model.feature_names_in_]

        prediction = max(model.predict(input_features)[0], 0)
        forecasts.append({
            'Week': f"{year}-W{week_num:02d}",
            'Predicted_Sales': prediction
        })

        last_known['lag_4'] = last_known.get('lag_3', lag_2)
        last_known['lag_3'] = last_known.get('lag_2', lag_1)
        last_known['lag_2'] = last_known['lag_1']
        last_known['lag_1'] = prediction
        last_known['Totalsale'] = prediction
        last_known.name = current_date

    return pd.DataFrame(forecasts)


@router.post("/future")
async def future_prediction(
    file: UploadFile = File(...),
    modelType: str = Form(...),
    target: str = Form(...),
    selectedProduct: str = Form(None)
):
    try:
        df = pd.read_excel(BytesIO(await file.read()))
        df['date_index'] = pd.to_datetime(df['date_index'])
        df = df.sort_values('date_index')
        df = df.set_index('date_index')

        if selectedProduct and "Ürün Cinsi" in df.columns:
            df = df[df['Ürün Cinsi'] == selectedProduct]

        df['lag_1'] = df[target].shift(1)
        df['lag_2'] = df[target].shift(2)
        df['lag_3'] = df[target].shift(3)
        df['rolling_mean_4'] = df[target].rolling(window=4).mean()
        df['rolling_median_4'] = df[target].rolling(window=4).median()
        df['rolling_max_4'] = df[target].rolling(window=4).max()
        df['rolling_min_4'] = df[target].rolling(window=4).min()
        df['rolling_std_4'] = df[target].rolling(window=4).std()
        df['trend_slope'] = 0
        df['is_spring'] = df.index.isocalendar().week.isin(range(10, 22)).astype(int)

        df.dropna(inplace=True)
        last_row = df.iloc[-1]

        X = df[[
            'lag_1', 'lag_2', 'lag_3', 'rolling_mean_4',
            'rolling_median_4', 'rolling_max_4', 'rolling_min_4',
            'rolling_std_4', 'trend_slope', 'is_spring'
        ]]
        y = df[target]

        model = XGBRegressor(objective='reg:squarederror') if modelType == "xgboost" else RandomForestRegressor()
        model.fit(X, y)

        forecast_df = recursive_forecast(model, last_row, n_weeks=8)

        with tempfile.NamedTemporaryFile(delete=False, suffix=".xlsx") as tmp:
            forecast_df.to_excel(tmp.name, index=False)
            tmp_path = tmp.name

        return FileResponse(
            tmp_path,
            filename="future_forecast.xlsx",
            media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )

    except Exception as e:
        print("\U0001f534 Tahmin hatası:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Gelecek tahmin hatası: {str(e)}")