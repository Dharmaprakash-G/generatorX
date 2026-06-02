from google import genai
import os
import json
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

SYSTEM_PROMPT = """
You are a database schema designer. Given a user's description,
generate a JSON schema for test data generation.

RULES:
1. Return ONLY valid JSON, no markdown, no explanation
2. Use ONLY these column types: int, full_name, first_name, last_name,
   email, user_name, phone, address, city, country, zip_code, url,
   company, text, paragraph, date, uuid, boolean
3. NEVER use "ref" as a column type. "type" must ALWAYS be one of the above values.
4. For "int" columns, always include "min" and "max"
5. For foreign key relationships, use "type": "int" and add a SEPARATE "ref" field: {"table": "...", "column": "..."}
6. Generate realistic table names and column names

OUTPUT FORMAT:
{
  "tables": [
    {
      "table_name": "users",
      "rows": 10,
      "columns": [
        {"name": "id", "type": "int", "min": 1, "max": 1000},
        {"name": "email", "type": "email", "unique": true}
      ]
    },
    {
      "table_name": "orders",
      "rows": 20,
      "columns": [
        {"name": "id", "type": "int", "min": 1, "max": 5000},
        {"name": "user_id", "type": "int", "min": 1, "max": 1000, "ref": {"table": "users", "column": "id"}}
      ]
    }
  ]
}
"""


def generate_schema_from_promt(user_prompt: str) -> dict:
    full_promt = f"{SYSTEM_PROMPT}\n\nUser request: {user_prompt}"

    # Robust fallback mechanism to bypass 503 high-demand errors
    models_to_try = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-2.0-flash"]
    last_error = None

    for model_name in models_to_try:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=full_promt,
            )
            raw_text = response.text.strip()

            if raw_text.startswith("```"):
                raw_text = raw_text.split("\n", 1)[1] 
                raw_text = raw_text.rsplit("\n",1)[0]

            schema = json.loads(raw_text)
            return schema
        except Exception as e:
            last_error = e
            print(f"Model {model_name} failed: {e}. Trying fallback...")
            continue

    raise last_error
        


if __name__ == "__main__":
    test_prompt = "Create a simple users table with id, name, and email"
    print(generate_schema_from_promt(test_prompt))