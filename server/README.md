# GeneratorX — Server

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![Pydantic](https://img.shields.io/badge/Pydantic-E92063?logo=pydantic&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI-4285F4?logo=google&logoColor=white)

The backend for GeneratorX, built with **Python 3.10+**, **FastAPI**, **Pydantic**, and the **Google GenAI SDK** for AI-assisted relational database schema generation.

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.10+**

### Installation

Create a virtual environment and install the required dependencies:

```bash
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS / Linux
pip install -r requirements.txt
```

### Environment Configuration

The AI schema assistant requires a Google Gemini API Key. 

1. Obtain a key from [Google AI Studio](https://aistudio.google.com/).
2. Create a `.env` file in the root of the `server/` directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Start the API Server

Run the FastAPI application locally using Uvicorn:

```bash
uvicorn app:app --reload
```

The server starts at **http://127.0.0.1:8000**.
Interactive API documentation (Swagger UI) is available at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

### CLI Usage (Single Table Mode)

Generate CSV data directly from the terminal:

```bash
python main.py schema.json output.csv
```

---

## 🏗️ Project Structure

```
server/
├── app.py                         → FastAPI web server & REST endpoints
├── main.py                        → CLI entry point (single-table mode)
├── requirements.txt               → Python package dependencies
├── schema.json                    → Example schema (single-table)
├── test_all_types_schema.json     → Example schema using all column types
├── ai/
│   └── schema_generator.py        → Google Gemini AI schema generator implementation
├── generator/
│   ├── engine.py                  → Core multi-table Faker generation engine
│   ├── types.py                   → Faker generator maps for all column types
│   └── dependency.py              → Dependency sorting (Kahn's Topological Sort)
├── schemas/
│   └── schema_models.py           → Pydantic validation schemas
└── exporters/
    ├── csv_exporter.py            → Conversions to CSV string buffers
    └── zip_exporter.py            → Packaging CSV files into a ZIP archive
```

---

## 📡 API Endpoints

| Method | Endpoint               | Description                                      |
|--------|------------------------|--------------------------------------------------|
| GET    | `/`                    | Server metadata (name, description, version)     |
| POST   | `/generate`            | Accepts a JSON schema → Returns generated dataset JSON |
| POST   | `/generate/zip`        | Accepts a JSON schema → Returns generated tables ZIP file |
| POST   | `/generate/ai-schema`  | Accepts a text prompt → Returns AI-generated schema JSON |

### Example — `POST /generate/ai-schema`

Payload:
```json
{
  "prompt": "Create a gym workout database containing users, exercises, and logs"
}
```

Response:
```json
{
  "tables": [
    {
      "table_name": "users",
      "rows": 10,
      "columns": [
        { "name": "id", "type": "int", "min": 1, "max": 1000 },
        { "name": "name", "type": "full_name" },
        { "name": "email", "type": "email", "unique": true }
      ]
    },
    {
      "table_name": "exercises",
      "rows": 15,
      "columns": [
        { "name": "id", "type": "int", "min": 1, "max": 500 },
        { "name": "exercise_name", "type": "company" },
        { "name": "description", "type": "paragraph" }
      ]
    },
    {
      "table_name": "logs",
      "rows": 25,
      "columns": [
        { "name": "id", "type": "int", "min": 1, "max": 10000 },
        { "name": "user_id", "type": "int", "ref": { "table": "users", "column": "id" } },
        { "name": "exercise_id", "type": "int", "ref": { "table": "exercises", "column": "id" } },
        { "name": "date_logged", "type": "date" }
      ]
    }
  ]
}
```

---

## 📋 Supported Column Types

The mock generation engine currently supports the following column types:

| Type          | Description                         | Options                    |
|---------------|-------------------------------------|----------------------------|
| `int`         | Random integer                      | `min`, `max` (required)    |
| `full_name`   | Full name of a person               |                            |
| `first_name`  | First name                          |                            |
| `last_name`   | Last name                           |                            |
| `email`       | Email address                       | `unique`                   |
| `user_name`   | Username                            |                            |
| `phone`       | Phone number                        |                            |
| `address`     | Full street address                 |                            |
| `city`        | City                                |                            |
| `country`     | Country                             |                            |
| `zip_code`    | Postal / Zip code                   |                            |
| `url`         | Website URL                         |                            |
| `company`     | Company name                        |                            |
| `text`        | Short text block                    |                            |
| `paragraph`   | Full paragraph text                 |                            |
| `date`        | Date string (last 5 years)          |                            |
| `uuid`        | Universally Unique Identifier (UUID)|                            |
| `boolean`     | True / False                        |                            |

---

## 🔗 Foreign Key References & Topological Sorting

Tables can establish relations by using the `ref` field. For instance, linking a child column to its parent column:

```json
{
  "name": "user_id",
  "type": "int",
  "ref": { "table": "users", "column": "id" }
}
```

To ensure relational integrity during mock generation, the backend sorts tables in **topological order** using Kahn's algorithm. Circular references are automatically detected and will result in validation errors.

---

## 🛠️ Dependencies

| Package         | Version / Range | Purpose                                                    |
|-----------------|-----------------|------------------------------------------------------------|
| FastAPI         | Latest          | Async Web API framework                                    |
| Uvicorn         | Latest          | ASGI web server                                            |
| Pydantic        | Latest          | Structured JSON schema validation                          |
| Faker           | Latest          | Fake data generation providers                             |
| Pandas          | Latest          | DataFrame handling for data formatting                     |
| Google GenAI    | Latest          | Official SDK to connect to Gemini AI models                |
| Python Dotenv   | Latest          | Loads environment configurations from `.env` files         |
