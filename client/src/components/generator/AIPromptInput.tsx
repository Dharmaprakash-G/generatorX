import { useState } from "react"
import type { Table } from "../../types/generator"
import { generateAISchema } from "../../services/api"




interface Props{
  onSchemaGenerated: (tables: Table[]) => void;
}


function AIPromptInput({onSchemaGenerated}: Props) {

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if(!prompt.trim()) return;

    setLoading(true);
    setError("");

    try{
      const data = await generateAISchema(prompt);

      //convert AI response to Table[] format

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
    }
    catch(err: any){
      setError("AI generation failed. Try again.");
      console.error(err);
    }
    finally{
      setLoading(false);
    }
  }

  return (
    <div className="mb-8 p-6 border rounded-xl bg-white shadow-sm">
      <h2 className="text-lg font-semibold md-3">
        ✨ Describe Your Data
      </h2>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder = 'e.g. "Create supply chain data with suppliers, warehouses, and shipments"'
        className="w-full border rounded-lg p-3 h-24 resize-none"
      />

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      
      <button
        onClick={handleGenerate}
        disabled={loading || !prompt.trim()}
        className="mt-3 bg-purple-700 hover:bg-purple-700 text-white px-4 py-2 rounded-lg "
      >
        {loading ? "Generating..." : "Generate Schema with AI"}
      </button> 
    </div>
  );
}

export default AIPromptInput