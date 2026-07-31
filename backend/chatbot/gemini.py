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

    Translate the headings also into Hindi.

    Do NOT use English except numbers.
    """

  elif language == "mr":
    language_instruction = """
    Write the ENTIRE response in Marathi.

    Translate the headings also into Marathi.

    Do NOT use English except numbers.
    """

  else:
    language_instruction = """
    Write the ENTIRE response in English.
    """


  prompt = f"""
  
  You are a groundwater advisor for farmers.

  District: {district}

  Forecast:
  {forecast}

  {language_instruction}

  Respond in exactly this format:

  🌍 Groundwater Status:
  (one short sentence)

  🌧 Rainfall Impact:
  (one short sentence)

  💡 Advice:
  (one practical recommendation)

  Limit the total response to 60–80 words.

  Avoid:
  - Long explanations
  - Technical terms
  - Repeating the forecast
  - Mentioning AI, ML, prediction models, or historical trends
  """

  model = genai.GenerativeModel("gemini-2.5-flash")

  response = model.generate_content(prompt)

  return response.text