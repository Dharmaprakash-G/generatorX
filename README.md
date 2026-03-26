# GeneratorX

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?logo=tailwindcss&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![Pydantic](https://img.shields.io/badge/Pydantic-E92063?logo=pydantic&logoColor=white)
![Faker](https://img.shields.io/badge/Faker-Data_Generation-blue)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI-4285F4?logo=google&logoColor=white)

A **schema-driven relational data generator** with a visual table builder UI. Define your tables, columns, and relationships — GeneratorX produces realistic fake data and exports it as a ZIP of CSV files.

---

## ✨ Features

- **Visual Table Builder** — Add multiple tables, define columns, set types, and configure constraints through an intuitive UI
- **18 Data Types** — `int`, `full_name`, `first_name`, `last_name`, `email`, `user_name`, `phone`, `address`, `city`, `country`, `zip_code`, `url`, `company`, `text`, `paragraph`, `date`, `uuid`, `boolean`
- **Foreign Key References** — Link columns across tables (e.g., `orders.user_id` → `users.id`)
- **Dependency-Aware Generation** — Tables are topologically sorted so parent data is always generated before child data
- **Configurable Constraints** — Set `min`/`max` ranges for integers and mark columns as `unique`
- **ZIP Export** — Download all generated tables as a ZIP archive of CSV files
- **REST API** — Headless usage via FastAPI endpoints with full Swagger docs

---

## 🏗️ Architecture

```
generatorX/
├── client/          → React + TypeScript + Vite + Tailwind CSS
│   └── src/
│       ├── components/generator/   → TableBuilder, ConfigPanel, etc.
│       ├── pages/                  → GeneratePage
│       ├── services/               → API client (api.ts)
│       └── types/                  → TypeScript interfaces & enums
│
└── server/          → Python + FastAPI
    ├── app.py                      → REST endpoints
    ├── main.py                     → CLI entry point
    ├── generator/
    │   ├── engine.py               → Core generation logic
    │   ├── types.py                → Faker-based value generators
    │   └── dependency.py           → Topological sort for table ordering
    ├── schemas/
    │   └── schema_models.py        → Pydantic validation models
    └── exporters/
        ├── csv_exporter.py         → Table → CSV buffer
        └── zip_exporter.py         → Dataset → ZIP archive
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.10+**
- **Node.js 18+** and **npm**

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/generatorX.git
cd generatorX
```

### 2. Start the backend

```bash
cd server
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS / Linux
pip install -r requirements.txt
uvicorn app:app --reload
```

The API server starts at **http://127.0.0.1:8000**. Interactive docs are available at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

### 3. Start the frontend

```bash
cd client
npm install
npm run dev
```

The UI opens at **http://localhost:5173**.

---

## 📡 API Endpoints

| Method | Endpoint         | Description                                      |
|--------|------------------|--------------------------------------------------|
| GET    | `/`              | App info and version                             |
| POST   | `/generate`      | Generate dataset and return JSON                 |
| POST   | `/generate/zip`  | Generate dataset and download as ZIP of CSVs     |

### Example Request — `POST /generate`

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

## 🛠️ CLI Usage

You can also generate data directly from the command line (single-table mode):

```bash
cd server
python main.py schema.json output.csv
```

---

## 📦 Tech Stack

| Layer    | Technology                                 |
|----------|--------------------------------------------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS 4 |
| Backend  | Python, FastAPI, Pydantic, Faker           |
| Export   | CSV, ZIP                                   |

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/awesome-feature`)
3. Commit your changes (`git commit -m "Add awesome feature"`)
4. Push to the branch (`git push origin feature/awesome-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source. Add a license of your choice (e.g., MIT, Apache 2.0).
