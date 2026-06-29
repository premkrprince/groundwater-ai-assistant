from chatbot.gemini import generate_groundwater_explanation

forecast = [
    {"quarter": 1, "prediction": 5.36},
    {"quarter": 2, "prediction": 9.47},
    {"quarter": 3, "prediction": 5.30}
]

response = generate_groundwater_explanation(
    "Beed",
    forecast
)

print(response)