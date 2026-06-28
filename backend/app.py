from flask import Flask, request, jsonify
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

    return jsonify({
        "forecast": forecast
    })

if __name__ == "__main__":
    app.run(debug=True)