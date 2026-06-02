# 🧠 Build Guide: AI Schema Generation Feature

A step-by-step guide to building the AI-powered schema generation feature from scratch.

---

## Overview — What We're Building

```
User types: "create supply chain test data"
         ↓
    [Frontend] sends prompt to backend
         ↓
    [Backend] sends prompt to Google Gemini
         ↓
    [Gemini] returns a JSON schema (tables, columns, types)
         ↓
    [Frontend] auto-fills the TableBuilder
         ↓
    User reviews/edits → clicks Generate → downloads ZIP
```

---

## Step 0: Get Your Gemini API Key

1. Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Click **"Create API Key"**
3. Copy the key
4. Create a [.env](file:///c:/Users/Dharma.PrakashG/Documents/generatorX/client/.env) file in `server/`:
   ```env
   GEMINI_API_KEY=your_key_here
   ```

> [!TIP]
> Never commit API keys to git. Add [.env](file:///c:/Users/Dharma.PrakashG/Documents/generatorX/client/.env) to your [.gitignore](file:///c:/Users/Dharma.PrakashG/Documents/generatorX/server/.gitignore).

---

## Step 1: Install the Gemini SDK

```bash
cd server
pip install google-generativeai python-dotenv
```

Add to [requirements.txt](file:///c:/Users/Dharma.PrakashG/Documents/generatorX/requirements.txt):
```
google-generativeai
python-dotenv
```

**Why?** `google-generativeai` is Google's official Python SDK for Gemini. `python-dotenv` loads your API key from the [.env](file:///c:/Users/Dharma.PrakashG/Documents/generatorX/client/.env) file.

---

## Step 2: Build the AI Module — [server/ai/schema_generator.py](file:///c:/Users/Dharma.PrakashG/Documents/generatorX/server/ai/schema_generator.py)

This is the core logic. You need to solve **3 problems**:
1. Connect to Gemini
2. Craft a prompt that returns **valid JSON** matching your schema format
3. Parse and validate the response

### 2a. Connect to Gemini

```python
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()  # loads GEMINI_API_KEY from .env

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")
```

**Why `gemini-2.0-flash`?** It's fast, free-tier friendly, and reliable for structured output.

### 2b. Craft the Prompt

This is the **most important part**. A bad prompt = bad/broken schemas. Your prompt must:
- Tell Gemini the **exact JSON format** you expect
- List all **valid column types** (so it doesn't invent types like `"string"` or `"float"`)
- Ask for **realistic** table/column names
- Request **foreign key relationships** where appropriate

```python
SYSTEM_PROMPT = """
You are a database schema designer. Given a user's description,
generate a JSON schema for test data generation.

RULES:
1. Return ONLY valid JSON, no markdown, no explanation
2. Use ONLY these column types: int, full_name, first_name, last_name,
   email, user_name, phone, address, city, country, zip_code, url,
   company, text, paragraph, date, uuid, boolean
3. For "int" columns, always include "min" and "max"
4. Use "ref" for foreign key relationships: {"table": "...", "column": "..."}

```python
SYSTEM_PROMPT = """
You are a database schema designer. Given a user's description,
generate a JSON schema for test data generation.

RULES:
1. Return ONLY valid JSON, no markdown, no explanation
2. Use ONLY these column types: int, full_name, first_name, last_name,
   email, user_name, phone, address, city, country, zip_code, url,
   company, text, paragraph, date, uuid, boolean
3. For "int" columns, always include "min" and "max"
4. Use "ref" for foreign key relationships: {"table": "...", "column": "..."}
5. Generate realistic table names and column names

OUTPUT FORMAT:
{
  "tables": [
    {
      "table_name": "example",
      "rows": 10,
      "columns": [
        {"name": "id", "type": "int", "min": 1, "max": 1000},
        {"name": "email", "type": "email", "unique": true}
      ]
    }
  ]
}
"""
```

**Why is the prompt so specific?** LLMs are creative — without constraints, Gemini might return column types like `"varchar"` or `"decimal"` that your generator doesn't support. By listing the exact valid types and expected JSON format, you prevent errors.

### 2c. Call Gemini and Parse the Response

```python
import json

def generate_schema_from_prompt(user_prompt: str) -> dict:
    full_prompt = f"{SYSTEM_PROMPT}\n\nUser request: {user_prompt}"

    response = model.generate_content(full_prompt)

    # Extract the text and clean it
    raw_text = response.text.strip()

    # Sometimes Gemini wraps JSON in ```json ... ``` — strip that
    if raw_text.startswith("```"):
        raw_text = raw_text.split("\n", 1)[1]  # remove first line
        raw_text = raw_text.rsplit("```", 1)[0]  # remove last ```

    # Parse JSON
    schema = json.loads(raw_text)

    return schema
```

**Why the cleanup?** Even with "return ONLY JSON" in the prompt, LLMs sometimes wrap the output in markdown code blocks. The cleanup handles that gracefully.

### 2d. Put It All Together

Your complete [server/ai/schema_generator.py](file:///c:/Users/Dharma.PrakashG/Documents/generatorX/server/ai/schema_generator.py):

```python
import json
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")

SYSTEM_PROMPT = """..."""  # (the full prompt from step 2b)

def generate_schema_from_prompt(user_prompt: str) -> dict:
    response = model.generate_content(
        f"{SYSTEM_PROMPT}\n\nUser request: {user_prompt}"
    )
    raw_text = response.text.strip()
    if raw_text.startswith("```"):
        raw_text = raw_text.split("\n", 1)[1]
        raw_text = raw_text.rsplit("```", 1)[0]
    return json.loads(raw_text)
```

---

## Step 3: Add the API Endpoint — [server/app.py](file:///c:/Users/Dharma.PrakashG/Documents/generatorX/server/app.py)

### 3a. Create a Request Model

```python
from pydantic import BaseModel

class AISchemaRequest(BaseModel):
    prompt: str
```

**Why Pydantic?** FastAPI uses Pydantic models to automatically validate incoming JSON. If someone sends an empty body, FastAPI returns a 422 error automatically.

### 3b. Add the Endpoint

```python
from ai.schema_generator import generate_schema_from_prompt

@app.post("/generate/ai-schema")
def generate_ai_schema(body: AISchemaRequest):
    try:
        schema = generate_schema_from_prompt(body.prompt)
        return schema
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### 3c. Test It!

```bash
# Start the server
uvicorn app:app --reload

# Test with curl
curl -X POST http://127.0.0.1:8000/generate/ai-schema \
  -H "Content-Type: application/json" \
  -d '{"prompt": "e-commerce system with users and orders"}'
```

You should get back a JSON schema with tables, columns, and types. **Fix any issues before moving to the frontend.**

---

## Step 4: Frontend API Function — [client/src/services/api.ts](file:///c:/Users/Dharma.PrakashG/Documents/generatorX/client/src/services/api.ts)

Add a function to call your new endpoint:

```typescript
export async function generateAISchema(prompt: string) {
    const response = await fetch(`${API_BASE_URL}/generate/ai-schema`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(JSON.stringify(error));
    }

    return await response.json();
}
```

**Why return `.json()` instead of `.blob()`?** Unlike the ZIP download endpoint, this endpoint returns JSON (the schema), not a file.

---

## Step 5: Build the UI Component — [AIPromptInput.tsx](file:///c:/Users/Dharma.PrakashG/Documents/generatorX/client/src/components/generator/AIPromptInput.tsx)

### 5a. Define the Props

Think about what this component needs:
- A callback to pass the AI-generated tables back to the parent (`onSchemaGenerated`)
- That's it — keep it simple

```typescript
interface Props {
    onSchemaGenerated: (tables: Table[]) => void;
}
```

### 5b. Build the Component

```tsx
import { useState } from "react";
import { generateAISchema } from "../../services/api";
import type { Table } from "../../types/generator";

interface Props {
    onSchemaGenerated: (tables: Table[]) => void;
}

function AIPromptInput({ onSchemaGenerated }: Props) {
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setLoading(true);
        setError("");

        try {
            const data = await generateAISchema(prompt);

            // Convert AI response to Table[] format (add IDs for React keys)
            const tables: Table[] = data.tables.map((t: any) => ({
                id: crypto.randomUUID(),
                table_name: t.table_name,
                rows: t.rows,
                columns: t.columns.map((c: any) => ({
                    id: crypto.randomUUID(),
                    name: c.name,
                    type: c.type,
                    min: c.min,
                    max: c.max,
                    unique: c.unique || false,
                    ref: c.ref || undefined,
                })),
            }));

            onSchemaGenerated(tables);
        } catch (err: any) {
            setError("AI generation failed. Try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mb-8 p-6 border rounded-xl bg-white shadow-sm">
            <h2 className="text-lg font-semibold mb-3">
                ✨ Describe Your Data
            </h2>
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder='e.g. "Create supply chain data with suppliers, warehouses, and shipments"'
                className="w-full border rounded-lg p-3 h-24 resize-none"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="mt-3 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
                {loading ? "Generating..." : "Generate Schema with AI"}
            </button>
        </div>
    );
}

export default AIPromptInput;
```

**Key design decisions:**
- **`crypto.randomUUID()`** — The AI response won't have [id](file:///c:/Users/Dharma.PrakashG/Documents/generatorX/server/schemas/schema_models.py#94-125) fields (they're frontend-only for React keys). We add them when converting.
- **Error handling** — Show a user-friendly message, log details to console
- **Loading state** — Disable the button while waiting for Gemini

---

## Step 6: Wire It Into the Page — [GeneratePage.tsx](file:///c:/Users/Dharma.PrakashG/Documents/generatorX/client/src/pages/GeneratePage.tsx)

```tsx
import AIPromptInput from "../components/generator/AIPromptInput";

// Inside the component, add a handler:
const handleAISchema = (aiTables: Table[]) => {
    setTables(aiTables);  // replaces current tables with AI-generated ones
};

// In the JSX, add it above the TableBuilder:
<AIPromptInput onSchemaGenerated={handleAISchema} />
<TableBuilder tables={tables} setTables={setTables} />
```

**Why `setTables(aiTables)` replaces instead of appending?** Because the AI generates a complete schema. The user can add more tables manually after if needed.

---

## Step 7: Test the Full Flow

1. Start the server: `cd server && uvicorn app:app --reload`
2. Start the client: `cd client && npm run dev`
3. Open `http://localhost:5173`
4. Type: *"Create an e-commerce database with users, products, and orders"*
5. Click **"Generate Schema with AI"**
6. ✅ Tables should auto-fill in the TableBuilder
7. Edit anything you want (rename columns, change row counts, etc.)
8. Click **Generate** to download the ZIP

---

## 🧩 Concepts You've Learned

| Concept | Where Used |
|---|---|
| LLM prompt engineering | System prompt with constraints, valid types, output format |
| API integration | Calling Gemini SDK, calling your own REST API from React |
| JSON parsing & validation | Cleaning LLM output, converting to typed structures |
| Component composition | [AIPromptInput](file:///c:/Users/Dharma.PrakashG/Documents/generatorX/client/src/components/generator/AIPromptInput.tsx#2-7) → [GeneratePage](file:///c:/Users/Dharma.PrakashG/Documents/generatorX/client/src/pages/GeneratePage.tsx#11-78) → [TableBuilder](file:///c:/Users/Dharma.PrakashG/Documents/generatorX/client/src/components/generator/TableBuilder.tsx#9-345) |
| State lifting in React | `onSchemaGenerated` callback passes data up to parent |
| Environment variables | `GEMINI_API_KEY` in [.env](file:///c:/Users/Dharma.PrakashG/Documents/generatorX/client/.env), `VITE_API_BASE_URL` in client |
| Error handling | Try/catch on both backend and frontend |

---

## 🐛 Common Issues & Fixes

| Problem | Cause | Fix |
|---|---|---|
| `Invalid column type` error when generating | Gemini used a type not in your enum | Improve the prompt — be more explicit about valid types |
| `json.JSONDecodeError` | Gemini returned markdown instead of raw JSON | Add the code block stripping logic (step 2c) |
| CORS error in browser | Backend doesn't allow frontend origin | Add the frontend URL to `allow_origins` in [app.py](file:///c:/Users/Dharma.PrakashG/Documents/generatorX/server/app.py) |
| Empty tables appear | AI returned empty columns array | Add validation: reject tables with 0 columns |
| API key not found | [.env](file:///c:/Users/Dharma.PrakashG/Documents/generatorX/client/.env) file not loaded | Make sure `load_dotenv()` is called before `genai.configure()` |
