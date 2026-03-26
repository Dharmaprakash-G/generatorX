# GeneratorX — Client

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?logo=tailwindcss&logoColor=white)

The frontend for GeneratorX, built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS 4**.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** and **npm**

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in this directory (already included):

```env
VITE_API_BASE_URL = "http://127.0.0.1:8000"
```

### Development Server

```bash
npm run dev
```

Opens at **http://localhost:5173**. Make sure the backend server is running.

### Production Build

```bash
npm run build
npm run preview
```

---

## 🏗️ Project Structure

```
src/
├── components/
│   ├── generator/
│   │   ├── TableBuilder.tsx       → Main table/column builder UI
│   │   ├── ConfigPanel.tsx        → Table configuration (name, row count)
│   │   ├── GenerateButton.tsx     → Trigger data generation
│   │   ├── PreviewPanel.tsx       → Data preview display
│   │   └── SchemaInput.tsx        → Schema input component
│   └── layout/
│       └── Container.tsx          → Layout wrapper
├── pages/
│   └── GeneratePage.tsx           → Main application page
├── services/
│   └── api.ts                     → Backend API client
├── types/
│   ├── enums.ts                   → Column type definitions
│   └── generator.ts              → TypeScript interfaces (Table, Column, etc.)
├── App.tsx                        → Root component
├── main.tsx                       → Entry point
└── index.css                      → Global styles
```

---

## 🔌 API Integration

The client communicates with the backend via a single endpoint:

- **`POST /generate/zip`** — Sends the table schema as JSON, receives a ZIP file containing CSVs

The API base URL is configured through the `VITE_API_BASE_URL` environment variable.

---

## 🛠️ Tech Stack

| Technology     | Version |
|----------------|---------|
| React          | 19      |
| TypeScript     | 5.9     |
| Vite           | 7.3     |
| Tailwind CSS   | 4.1     |

---

## 📜 Available Scripts

| Command           | Description                   |
|--------------------|-------------------------------|
| `npm run dev`      | Start development server      |
| `npm run build`    | Build for production          |
| `npm run preview`  | Preview production build      |
| `npm run lint`     | Run ESLint                    |
