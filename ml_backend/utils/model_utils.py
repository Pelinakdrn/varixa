import pandas as pd

def add_common_features(df: pd.DataFrame, target: str) -> pd.DataFrame:
    df["lag_1"] = df[target].shift(1)
    return df

def add_xgboost_features(df: pd.DataFrame, target: str) -> pd.DataFrame:
    df["lag_1"] = df[target].shift(1)
    df["lag_2"] = df[target].shift(2)
    df["rolling_mean_3"] = df[target].rolling(window=3).mean()
    df["rolling_std_3"] = df[target].rolling(window=3).std()
    return df

def add_lightgbm_features(df: pd.DataFrame, target: str) -> pd.DataFrame:
    df = add_xgboost_features(df, target)
    df["month"] = df["date_index"].dt.month
    df["week"]  = df["date_index"].dt.isocalendar().week
    return df
