# GeneratorX

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![React Flow](https://img.shields.io/badge/React_Flow-12-FF007F?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?logo=tailwindcss&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI-4285F4?logo=google&logoColor=white)

A **schema-driven relational data generator** featuring an interactive React Flow node-based database canvas and a Google Gemini AI schema generator chat assistant. Define or describe tables, configure relationships, visually edit columns, and instantly export realistic datasets as a ZIP archive of CSV files.

---

## ✨ Features

- **Visual Node Canvas** — Add, move, and visualize multiple tables and their connections as nodes on an interactive canvas powered by **React Flow**.
- **AI Schema Assistant** — Describe your application or database requirements in plain English in the AI chat assistant (powered by Gemini 2.0/2.5) to automatically build complete, complex relational schemas.
- **Dual Editors** — Seamlessly switch between the node-based canvas view and the raw JSON schema text editor (with real-time validation).
- **18 Data Types** — `int`, `full_name`, `first_name`, `last_name`, `email`, `user_name`, `phone`, `address`, `city`, `country`, `zip_code`, `url`, `company`, `text`, `paragraph`, `date`, `uuid`, `boolean`.
- **Relational Integrity (Foreign Keys)** — Reference columns across tables (e.g., `orders.user_id` → `users.id`) to create realistic database connections.
- **Dependency-Aware Generation** — Generates tables in topological order, ensuring parent table records exist before child table records are created.
- **Configurable Constraints** — Setup integer ranges (`min`/`max`) and mark columns as `unique`.
- **ZIP Export** — Pack and download all generated tables as CSV files inside a single ZIP archive.
- **REST API** — Headless usage via FastAPI endpoints with interactive Swagger documentation.

---

## 🏗️ Architecture

```
generatorX/
├── client/          → React 19 + TypeScript + Vite 7 + Tailwind CSS 4 + React Flow 12
│   └── src/
│       ├── components/
│       │   ├── chat/        → ChatPanel, ChatInput, ChatMessage (AI Schema Assistant)
│       │   └── generator/   → SchemaCanvas, TableNode, EditSidebar, JsonSchemaEditor, AIPromptInput
│       ├── pages/           → GeneratePage (Main application layout)
│       ├── services/        → API client (api.ts)
│       └── types/           → TypeScript interfaces & enums
│
└── server/          → Python 3.10+ + FastAPI + Google GenAI SDK
    ├── app.py                      → FastAPI web server & endpoints
    ├── main.py                     → CLI entry point (single-table generation)
    ├── requirements.txt            → Server dependencies
    ├── ai/
    │   └── schema_generator.py     → Google Gemini integration for prompt-to-schema
    ├── generator/
    │   ├── engine.py               → Core Faker-based mock generation engine
    │   ├── types.py                → Faker value mapping functions
    │   └── dependency.py           → Topological sorting logic
    ├── schemas/
    │   └── schema_models.py        → Pydantic validation models
    └── exporters/
        ├── csv_exporter.py         → CSV buffer converter
        └── zip_exporter.py         → ZIP archive generator
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.10+**
- **Node.js 18+** and **npm**

### 1. Clone the repository

```bash
git clone https://github.com/Dharmaprakash-G/Data-generator.git
cd Data-generator
```

### 2. Start the backend

Navigate to the server directory, create a virtual environment, install dependencies, and configure your Gemini API key:

```bash
cd server
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS / Linux
pip install -r requirements.txt
```

Create a `.env` file in the `server/` directory and add your Google Gemini API key:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

Start the FastAPI development server:

```bash
uvicorn app:app --reload
```

The API server starts at **http://127.0.0.1:8000**. Interactive docs are available at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

### 3. Start the frontend

Navigate to the client directory, install dependencies, and run the Vite server:

```bash
cd ../client
npm install
npm run dev
```

The UI opens at **http://localhost:5173**.

---

## 📡 API Endpoints

| Method | Endpoint               | Description                                           |
|--------|------------------------|-------------------------------------------------------|
| GET    | `/`                    | App info, description, and version                    |
| POST   | `/generate`            | Generate dataset and return as JSON                   |
| POST   | `/generate/zip`        | Generate dataset and download as ZIP of CSV files     |
| POST   | `/generate/ai-schema`  | Generate database schema structure from a text prompt |

### Example Request — `POST /generate/ai-schema`

Request:
```json
{
  "prompt": "e-commerce system with users and orders"
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
        { "name": "email", "type": "email", "unique": true }
      ]
    },
    {
      "table_name": "orders",
      "rows": 20,
      "columns": [
        { "name": "id", "type": "int", "min": 1, "max": 9999 },
        { "name": "user_id", "type": "int", "ref": { "table": "users", "column": "id" } }
      ]
    }
  ]
}
```

---

## 🛠️ CLI Usage

Generate mock data directly from the command line for a single table schema:

```bash
cd server
python main.py schema.json output.csv
```

---

## 📦 Tech Stack

| Layer    | Technology                                                |
|----------|-----------------------------------------------------------|
| Frontend | React 19, TypeScript, React Flow 12, Tailwind CSS 4, Vite |
| Backend  | Python 3.10+, FastAPI, Pydantic, Faker, Google GenAI SDK   |
| Export   | CSV, ZIP                                                  |

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
