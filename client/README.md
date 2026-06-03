# GeneratorX — Client

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![React Flow](https://img.shields.io/badge/React_Flow-12-FF007F?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?logo=tailwindcss&logoColor=white)

The frontend for GeneratorX, built using **React 19**, **TypeScript**, **Vite**, **Tailwind CSS 4**, and **React Flow 12** for visual database schema representation.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** and **npm**

### Installation

Install client-side dependencies:

```bash
npm install
```

### Environment Variables

Configure a `.env` file in the root of the client directory (default base configuration is already included):

```env
VITE_API_BASE_URL="http://127.0.0.1:8000"
```

### Development Server

Start the local client development server:

```bash
npm run dev
```

The application runs at **http://localhost:5173**. Ensure the FastAPI backend server is also running.

### Production Build

Compile and optimize the client application for production:

```bash
npm run build
npm run preview
```

---

## 🏗️ Project Structure

```
src/
├── components/
│   ├── chat/                      → AI Chat Assistant components
│   │   ├── ChatPanel.tsx          → Main Chat Sidebar with suggestions list
│   │   ├── ChatInput.tsx          → Text input field for prompting the AI
│   │   └── ChatMessage.tsx        → Single chat message element (user or AI)
│   │
│   ├── generator/                 → Schema visualization and editor components
│   │   ├── SchemaCanvas.tsx       → React Flow canvas rendering nodes & custom edges
│   │   ├── TableNode.tsx          → Node representation of a database table (with primary/foreign handles)
│   │   ├── DependencyEdge.tsx     → Custom SVG edge showing foreign key connections with color gradients
│   │   ├── EditSidebar.tsx        → Sidebar pane to add/edit/delete tables and columns
│   │   ├── SchemaPanel.tsx        → Container managing tabs (Canvas view vs JSON Editor)
│   │   ├── JsonSchemaEditor.tsx   → Textarea editor for editing schema raw JSON with real-time validation
│   │   ├── AIPromptInput.tsx      → Prompt textarea input block for Gemini schema generator
│   │   ├── ConfigPanel.tsx        → Panel for specifying global table details (name, rows)
│   │   ├── PreviewPanel.tsx       → Panel showcasing generated mock table data preview
│   │   └── SchemaInput.tsx        → Simple input element for schema setup
│   │
│   └── layout/
│       └── Container.tsx          → Structural page container component
│
├── pages/
│   └── GeneratePage.tsx           → Main app entry page, orchestrating chat and canvas state
├── services/
│   └── api.ts                     → Fetch client endpoints calling the backend
├── types/
│   ├── enums.ts                   → Enums defining column data types
│   └── generator.ts               → Types and interfaces for tables, columns, chat messages
├── App.tsx                        → Root application component
├── main.tsx                       → Client application bootstrap entry
└── index.css                      → CSS files including React Flow custom styling, tailwind layers, and custom gradients
```

---

## 🔌 API Integration

The client communicates with the backend endpoints defined in [api.ts](file:///c:/Users/Dharma.PrakashG/Documents/generatorX/client/src/services/api.ts):

- **`POST /generate/zip`** — Submits the structured JSON schema of tables, columns, and relations, returning a ZIP file containing the generated CSV datasets.
- **`POST /generate/ai-schema`** — Sends the natural language requirements to the server and returns the AI-structured database tables layout.

---

## 🛠️ Tech Stack

| Technology     | Version  | Description                                 |
|----------------|----------|---------------------------------------------|
| React          | 19.2     | UI foundation rendering                     |
| React Flow     | 12.10    | Node-based visual graph interactive canvas  |
| TypeScript     | 5.9      | Strong static type checking                 |
| Vite           | 7.3      | Hot Module Replacement (HMR) bundler        |
| Tailwind CSS   | 4.1      | Modern Utility-First CSS Styling            |
| Framer Motion  | 12.3     | Smooth user interface animations & modal transition |

---

## 📜 Available Scripts

| Command           | Description                   |
|--------------------|-------------------------------|
| `npm run dev`      | Start local dev server        |
| `npm run build`    | Build production files        |
| `npm run preview`  | Run production build preview  |
| `npm run lint`     | Run ESLint verification      |
