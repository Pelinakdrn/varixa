import * as XLSX from "xlsx";
import { readFileSync } from "fs";
import path from "path";
import { meanAbsoluteError, meanSquaredError, r2Score } from "../utils/metrics";
import { RandomForestRegressor } from "machinelearn/ensemble";
import * as dfd from "danfojs-node";

interface RunPredictionParams {
  filePath: string;
  productType: string;
  target: string;
  trainStart: string;
  trainEnd: string;
  testStart: string;
  testEnd: string;
  model: "random_forest" | "xgboost";
}

export async function runPrediction({
  filePath,
  productType,
  target,
  trainStart,
  trainEnd,
  testStart,
  testEnd,
  model,
}: RunPredictionParams) {
  const buffer = readFileSync(filePath);
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const json = XLSX.utils.sheet_to_json(sheet);

  let df = new dfd.DataFrame(json);

  // Filtrele
  df = df.query(df["Ürün Cinsi"].eq(productType)).resetIndex();

  // Date işle
  df.addColumn("Date", df["Yıl"].str.concat("-").str.concat(df["Hafta"].astype("string").str.padStart(2, "0")));
  df.addColumn("date_index", dfd.toDateTime(df["Date"].str.concat("-1"), { format: "%Y-%W-%w" }));

  // Tarih filtreleme
  const dateIndex = df["date_index"];
  const isTrain = dateIndex.ge(trainStart).and(dateIndex.le(trainEnd));
  const isTest = dateIndex.ge(testStart).and(dateIndex.le(testEnd));

  const dfTrain = df.loc({ rows: isTrain });
  const dfTest = df.loc({ rows: isTest });

  // Özellik mühendisliği (örnek: sadece target'ın bir gecikmeli versiyonu)
  dfTrain.addColumn("lag_1", dfTrain[target].shift(1));
  dfTrain.dropNa({ inplace: true });
  dfTest.addColumn("lag_1", dfTest[target].shift(1));
  dfTest.dropNa({ inplace: true });

  const X_train = dfTrain["lag_1"].values;
  const y_train = dfTrain[target].values;
  const X_test = dfTest["lag_1"].values;
  const y_test = dfTest[target].values;

  // Model seçimi
  let y_pred_train: number[] = [];
  let y_pred_test: number[] = [];

  if (model === "random_forest") {
    const rf = new RandomForestRegressor({ nEstimators: 10 });
    rf.fit(X_train, y_train);
    y_pred_train = rf.predict(X_train);
    y_pred_test = rf.predict(X_test);
  } else {
    throw new Error("XGBoost not implemented in Node backend yet.");
  }

  return {
    "Train MAE": meanAbsoluteError(y_train, y_pred_train),
    "Test MAE": meanAbsoluteError(y_test, y_pred_test),
    "Train RMSE": meanSquaredError(y_train, y_pred_train, true),
    "Test RMSE": meanSquaredError(y_test, y_pred_test, true),
    "Train R2": r2Score(y_train, y_pred_train),
    "Test R2": r2Score(y_test, y_pred_test),
    "Doğruluk %": Math.round((1 - meanAbsoluteError(y_test, y_pred_test) / dfd.mean(y_test)) * 100),
  };
}
