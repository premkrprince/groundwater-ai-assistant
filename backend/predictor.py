import joblib
import pandas as pd

# Load models
trained_models = joblib.load("../models/trained_models.pkl")

# Load feature information
feature_info = joblib.load("../models/feature_info.pkl")

FEATURE_COLS = feature_info["FEATURE_COLS"]


def predict_groundwater(district, input_data):
    
    # district : District name
    # input_data : dictionary containing all features


    model = trained_models[district]

    df = pd.DataFrame([input_data])

    predict = model.predict(df)[0]

    return round(predict, 2)