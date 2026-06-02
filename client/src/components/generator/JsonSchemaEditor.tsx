import { useState, useEffect } from "react";
import type { Table } from "../../types/generator";

interface Props {
    tables: Table[];
    onApply: (tables: Table[]) => void;
}

function JsonSchemaEditor({ tables, onApply }: Props) {
    const [jsonText, setJsonText] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [valid, setValid] = useState(false);

    useEffect(() => {
        const clean = tables.map((t) => ({
            table_name: t.table_name,
            rows: t.rows,
            columns: t.columns.map((c) => {
                const col: any = { name: c.name, type: c.type };
                if (c.min !== undefined) col.min = c.min;
                if (c.max !== undefined) col.max = c.max;
                if (c.unique) col.unique = c.unique;
                if (c.ref) col.ref = c.ref;
                return col;
            }),
        }));
        setJsonText(JSON.stringify({ tables: clean }, null, 2));
        setError(null);
        setValid(true);
    }, [tables]);

    const handleChange = (value: string) => {
        setJsonText(value);
        try {
            const parsed = JSON.parse(value);
            if (!parsed.tables || !Array.isArray(parsed.tables)) {
                setError("Schema must contain a 'tables' array");
                setValid(false);
                return;
            }
            for (const table of parsed.tables) {
                if (!table.table_name) {
                    setError(`Table missing 'table_name' field`);
                    setValid(false);
                    return;
                }
                if (!table.columns || !Array.isArray(table.columns)) {
                    setError(`Table '${table.table_name}' missing 'columns' array`);
                    setValid(false);
                    return;
                }
            }
            setError(null);
            setValid(true);
        } catch {
            setError("Invalid JSON syntax");
            setValid(false);
        }
    };

    const handleApply = () => {
        if (!valid) return;
        try {
            const parsed = JSON.parse(jsonText);
            const mergedTables: Table[] = parsed.tables.map((t: any) => {
                // Find if this table already existed to preserve its ID and layout position
                const existingTable = tables.find(
                    (et) => et.table_name.toLowerCase() === t.table_name.toLowerCase()
                );
                const tableId = existingTable ? existingTable.id : crypto.randomUUID();

                return {
                    id: tableId,
                    table_name: t.table_name,
                    rows: t.rows || 10,
                    columns: (t.columns || []).map((c: any) => {
                        // Find if this column already existed in the table to preserve its ID and connections
                        const existingCol = existingTable?.columns.find(
                            (ec) => ec.name.toLowerCase() === c.name.toLowerCase()
                        );
                        const colId = existingCol ? existingCol.id : crypto.randomUUID();

                        return {
                            id: colId,
                            name: c.name,
                            type: c.type,
                            min: c.min,
                            max: c.max,
                            unique: c.unique || false,
                            ref: c.ref || undefined,
                        };
                    }),
                };
            });
            onApply(mergedTables);
        } catch {
            setError("Failed to parse schema");
        }
    };

    const lineCount = jsonText.split("\n").length;

    return (
        <div className="flex flex-col h-full bg-base">
            <div className="flex-1 relative overflow-hidden">
                <div className="absolute inset-0 flex bg-surface-solid border-t border-border">
                    <div className="w-12 bg-slate-900/50 border-r border-border overflow-hidden select-none pt-4 text-right pr-3 shadow-inner">
                        {Array.from({ length: lineCount }, (_, i) => (
                            <div key={i} className="text-slate-600 font-mono text-xs leading-6">
                                {i + 1}
                            </div>
                        ))}
                    </div>
                    <textarea
                        value={jsonText}
                        onChange={(e) => handleChange(e.target.value)}
                        className="flex-1 bg-transparent text-primary text-sm p-4 resize-none focus:outline-none leading-6 font-mono"
                        spellCheck={false}
                    />
                </div>
            </div>

            <div className="border-t border-border px-6 py-3 flex items-center justify-between bg-surface-solid">
                <div className="flex items-center gap-2 text-xs">
                    {valid ? (
                        <>
                            <span className="text-emerald-400">✓</span>
                            <span className="text-slate-300 font-medium">Valid JSON</span>
                        </>
                    ) : (
                        <>
                            <span className="text-danger">✗</span>
                            <span className="text-danger truncate max-w-[300px]">
                                {error || "Invalid"}
                            </span>
                        </>
                    )}
                </div>

                <button
                    onClick={handleApply}
                    disabled={!valid}
                    className="px-4 py-1.5 rounded bg-primary text-slate-900 font-medium text-xs hover:bg-sky-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Apply Changes
                </button>
            </div>
        </div>
    );
}

export default JsonSchemaEditor;
