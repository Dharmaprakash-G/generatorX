# GeneratorX — Server

The backend for GeneratorX, built with **Python**, **FastAPI**, **Pydantic**, and **Faker**.

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.10+**

### Installation

```bash
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS / Linux
pip install -r requirements.txt
```

### Start the API Server

```bash
uvicorn app:app --reload
```

The server starts at **http://127.0.0.1:8000**.
Interactive API docs (Swagger UI) are available at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

### CLI Usage (Single Table)

```bash
python main.py schema.json output.csv
```

---

## 🏗️ Project Structure

```
server/
├── app.py                         → FastAPI app & REST endpoints
├── main.py                        → CLI entry point (single-table mode)
├── requirements.txt               → Python dependencies
├── schema.json                    → Example single-table schema
├── test_all_types_schema.json     → Example schema with all column types
├── generator/
│   ├── engine.py                  → Core dataset generation engine
│   ├── types.py                   → Faker-based value generators per column type
│   └── dependency.py              → Topological sort for table dependency ordering
├── schemas/
│   └── schema_models.py           → Pydantic validation models
└── exporters/
    ├── csv_exporter.py            → Converts table rows → CSV buffer
    └── zip_exporter.py            → Bundles multiple CSVs into a ZIP archive
```

---

## 📡 API Endpoints

| Method | Endpoint         | Description                                      |
|--------|------------------|--------------------------------------------------|
| GET    | `/`              | App info and version                             |
| POST   | `/generate`      | Generate dataset → JSON response                 |
| POST   | `/generate/zip`  | Generate dataset → ZIP download (CSVs inside)    |

### Example — `POST /generate`

```json
{
  "tables": [
    {
      "table_name": "users",
      "rows": 5,
      "columns": [
        { "name": "id", "type": "int", "min": 1, "max": 1000 },
        { "name": "name", "type": "full_name" },
        { "name": "email", "type": "email", "unique": true }
      ]
    },
    {
      "table_name": "orders",
      "rows": 10,
      "columns": [
        { "name": "order_id", "type": "int", "min": 1, "max": 9999 },
        { "name": "user_id", "type": "int", "ref": { "table": "users", "column": "id" } },
        { "name": "created_at", "type": "date" }
      ]
    }
  ]
}
```

---

## 📋 Supported Column Types

| Type          | Description                 | Options             |
|---------------|-----------------------------|---------------------|
| `int`         | Random integer              | `min`, `max`        |
| `full_name`   | Full person name            |                     |
| `first_name`  | First name                  |                     |
| `last_name`   | Last name                   |                     |
| `email`       | Email address               | `unique`            |
| `user_name`   | Username                    |                     |
| `phone`       | Phone number                |                     |
| `address`     | Full street address         |                     |
| `city`        | City name                   |                     |
| `country`     | Country name                |                     |
| `zip_code`    | Postal / ZIP code           |                     |
| `url`         | Website URL                 |                     |
| `company`     | Company name                |                     |
| `text`        | Random text block           |                     |
| `paragraph`   | Random paragraph            |                     |
| `date`        | Date (last 5 years)         |                     |
| `uuid`        | UUID v4                     |                     |
| `boolean`     | `true` / `false`            |                     |

---

## 🔗 Foreign Key References

Columns can reference another table's column using `ref`:

```json
{
  "name": "user_id",
  "type": "int",
  "ref": { "table": "users", "column": "id" }
}
```

Tables are automatically sorted using **topological ordering** (Kahn's algorithm) so parent tables are always generated first. Circular dependencies are detected and rejected.

---

## 🛠️ Dependencies

| Package    | Purpose                       |
|------------|-------------------------------|
| FastAPI    | Web framework & REST API      |
| Uvicorn    | ASGI server                   |
| Pydantic   | Schema validation             |
| Faker      | Realistic fake data           |
| Pandas     | Data utilities                |
