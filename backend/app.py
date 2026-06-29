from flask import Flask, request, jsonify
from chatbot.gemini import generate_groundwater_explanation
from forecast import forecast_next_quarters
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

@app.route("/")
def home():
    return "Groundwater Prediction API is running!"

@app.route("/predict", methods=["POST"])
def predict():

    data = request.get_json()

    district = data["district"]

    forecast = forecast_next_quarters(district)

    explanation = generate_groundwater_explanation(
        district,
        forecast
    )

    return jsonify({
        "forecast": forecast,
        "explanation": explanation
    })
    

if __name__ == "__main__":
    app.run(debug=True)