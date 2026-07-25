import os

from dotenv import load_dotenv
import google.generativeai as genai

# Load .env file
load_dotenv()

# Read API key
API_KEY = os.getenv("GEMINI_API_KEY")

# Create Gemini client
genai.configure(api_key=API_KEY)


def generate_groundwater_explanation(district, forecast, language="en"):
  print("Selected language:", language)
  if language == "hi":
      language_instruction = """
  Write the ENTIRE response in Hindi.
  Do NOT use English except numbers and the Markdown headings if absolutely necessary.
  """

  elif language == "mr":
      language_instruction = """
  Write the ENTIRE response in Marathi.
  Do NOT use English except numbers and the Markdown headings if absolutely necessary.
  """

  else:
      language_instruction = """
  Write the ENTIRE response in English.
  """

  prompt = f"""
    
  You are an expert hydrogeologist and groundwater policy advisor.
  {language_instruction}
  
  Analyze the following groundwater forecast.

  District: {district}

  Forecast:
  {forecast}

  Instructions:
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

  model = genai.GenerativeModel("gemini-2.5-flash")

  response = model.generate_content(prompt)

  return response.text