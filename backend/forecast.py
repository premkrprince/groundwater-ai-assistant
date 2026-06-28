import joblib
import pandas as pd
import numpy as np

# Load original dataset
df = pd.read_csv("../data/final_ml_dataset_ready.csv")

# Load trained district-wise models
trained_models = joblib.load("../models/trained_models.pkl")

# Historical rainfall statistics
rain_mean = (
    df.groupby(["District", "Quarter"])["Quarterly_Rainfall_Sum_mm"]
      .mean()
)

rain_std = (
    df.groupby(["District", "Quarter"])["Quarterly_Rainfall_Sum_mm"]
      .std()
)



def test_forecast():

    print(df.head())

    print(trained_models.keys())



def forecast_next_quarters(district, n=3):

    pipe = trained_models[district]

    sub = df[df["District"] == district].sort_values(["Year", "Quarter"])
    last = sub.iloc[-1].copy()

    preds = []

    for _ in range(n):

        # Next quarter
        next_quarter = (last["Quarter"] % 4) + 1
        next_year = last["Year"] + (1 if next_quarter == 1 else 0)

        q_rad = next_quarter * (2 * np.pi / 4)

        # Historical average rainfall
        expected_rain = rain_mean.loc[(district, next_quarter)]
        std_rain = rain_std.loc[(district, next_quarter)]

        # Rain anomaly
        if std_rain == 0:
            rain_anomaly = 0
        else:
            rain_anomaly = (
                last["Quarterly_Rainfall_Sum_mm"] - expected_rain
            ) / std_rain

        row = {
            "GW_Lag1": last["GW_Depth_mbgl"],
            "GW_Lag2": last["GW_Lag1"],
            "GW_Lag4": last["GW_Lag2"],
            "Quarterly_Rainfall_Sum_mm": expected_rain,
            "Rain_Rolling_Sum_2Q":
                (last["Quarterly_Rainfall_Sum_mm"] + expected_rain) / 2,
            "Rain_Rolling_Sum_4Q":
                last["Rain_Rolling_Sum_4Q"],
            "Rain_Anomaly":
                rain_anomaly,
            "StageExtraction(%)":
                last["StageExtraction(%)"],
            "Quarter_Sin":
                np.sin(q_rad),
            "Quarter_Cos":
                np.cos(q_rad)
        }

        pred = pipe.predict(pd.DataFrame([row]))[0]

        preds.append({
            "year": int(next_year),
            "quarter": int(next_quarter),
            "prediction": round(float(pred), 2)
        })

        # Update for next prediction
        last["Quarter"] = next_quarter
        last["Year"] = next_year
        last["GW_Depth_mbgl"] = pred
        last["GW_Lag1"] = row["GW_Lag1"]
        last["GW_Lag2"] = row["GW_Lag2"]
        last["Quarterly_Rainfall_Sum_mm"] = expected_rain

    return preds