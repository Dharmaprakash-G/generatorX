import { useState } from "react"
import ChatPanel from "../components/chat/ChatPanel"
import SchemaPanel from "../components/generator/SchemaPanel"
import { generateData } from "../services/api"
import type { Table, ExportFormat } from "../types/generator"

function GeneratePage() {
    const [tables, setTables] = useState<Table[]>([
        {
            id: crypto.randomUUID(),
            table_name: "users",
            rows: 50,
            columns: [
                { id: crypto.randomUUID(), name: "id", type: "int", unique: true },
                { id: crypto.randomUUID(), name: "full_name", type: "full_name" },
                { id: crypto.randomUUID(), name: "email", type: "email", unique: true }
            ],
        },
    ]);
    const [loading, setLoading] = useState(false);
    const [format, setFormat] = useState<ExportFormat>("csv");

    const handleGenerate = async () => {
        try {
            setLoading(true);
            const payload = { tables };
            const blob = await generateData(payload as any);

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `generatorx_data.${format === 'csv' ? 'zip' : format}`;
            link.click();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
            alert("Error generating data");
        } finally {
            setLoading(false);
        }
    };

    const handleApplySchema = (aiTables: Table[]) => {
        setTables(aiTables);
    };

    return (
        <div className="w-full h-screen bg-base text-slate-200 flex overflow-hidden">
            {/* Left Panel: AI Assistant (35%) */}
            <div className="w-[35%] min-w-[350px] max-w-[500px] h-full z-20">
                <ChatPanel onApplySchema={handleApplySchema} />
            </div>

            {/* Right Panel: Canvas & Workspace (65%) */}
            <div className="flex-1 h-full z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
                <SchemaPanel
                    tables={tables}
                    setTables={setTables}
                    onGenerate={handleGenerate}
                    loading={loading}
                    format={format}
                    onFormatChange={setFormat}
                />
            </div>
        </div>
    )
}

export default GeneratePage