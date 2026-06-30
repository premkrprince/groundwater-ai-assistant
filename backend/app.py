from flask import Flask, request, jsonify
from flask_cors import CORS

from forecast import forecast_next_quarters
from chatbot.gemini import generate_groundwater_explanation

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return "Groundwater Prediction API is running!"


# ======================================
# FAST PREDICTION
# ======================================

@app.route("/predict", methods=["POST"])
def predict():

    data = request.get_json()

    district = data["district"]

    forecast = forecast_next_quarters(district)

    return jsonify({
        "forecast": forecast
    })


# ======================================
# AI EXPLANATION
# ======================================

@app.route("/explanation", methods=["POST"])
def explanation():

    data = request.get_json()

    district = data["district"]
    forecast = data["forecast"]

    explanation = generate_groundwater_explanation(
        district,
        forecast
    )

    return jsonify({
        "explanation": explanation
    })


if __name__ == "__main__":
    app.run(debug=True)