from predictor import predict_groundwater

sample = {
    "GW_Lag1": 5.2,
    "GW_Lag2": 5.4,
    "GW_Lag4": 5.1,
    "Quarterly_Rainfall_Sum_mm": 500,
    "Rain_Rolling_Sum_2Q": 400,
    "Rain_Rolling_Sum_4Q": 800,
    "Rain_Anomaly": 0.4,
    "StageExtraction(%)": 62,
    "Quarter_Sin": 1,
    "Quarter_Cos": 0
}

prediction = predict_groundwater(
    district="Pune",
    input_data=sample
)

print(prediction)