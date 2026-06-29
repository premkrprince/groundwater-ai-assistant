import os

from dotenv import load_dotenv
from google import genai

# Load .env file
load_dotenv()

# Read API key
API_KEY = os.getenv("GEMINI_API_KEY")

# Create Gemini client
client = genai.Client(api_key=API_KEY)


def generate_groundwater_explanation(district, forecast):

    prompt = f"""
You are an expert hydrogeologist and groundwater policy advisor.

Analyze the following groundwater forecast.

District: {district}

Forecast:
{forecast}

Instructions:
- Use simple English.
- Explain only using the forecast values.
- Mention seasonal trend.
- Explain possible reasons.
- Mention groundwater risk level (Low / Moderate / High).
- Give practical recommendations for:
  • Citizens
  • Farmers
  • Local Government

Return the answer in Markdown using exactly these headings:

## 📈 Overall Trend

## 🌧 Possible Reasons

## ⚠ Risk Level

## ✅ Recommendations
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return response.text