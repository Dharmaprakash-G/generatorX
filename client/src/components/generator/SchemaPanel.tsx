import { useState, useCallback } from "react";
import { Code2, PenTool, Download, Plus } from "lucide-react";
import SchemaCanvas from "./SchemaCanvas";
import JsonSchemaEditor from "./JsonSchemaEditor";
import EditSidebar from "./EditSidebar";
import type { Table, ExportFormat, Column } from "../../types/generator";

interface Props {
    tables: Table[];
    setTables: React.Dispatch<React.SetStateAction<Table[]>>;
    onGenerate: () => void;
    loading: boolean;
    format: ExportFormat;
    onFormatChange: (format: ExportFormat) => void;
}

type SchemaTab = "visual" | "json";

// const FORMATS: ExportFormat[] = ["csv", "json", "sql"];

function SchemaPanel({ tables, setTables, onGenerate, loading, format, onFormatChange }: Props) {
    const [activeTab, setActiveTab] = useState<SchemaTab>("visual");
    const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

    // Satisfy TS compiler for unused props while format selector is commented out by user
    void format;
    void onFormatChange;

    const handleJsonApply = (newTables: Table[]) => {
        setTables(newTables);
        setActiveTab("visual");
    };

    // =============================
    // CRUD Logic for EditSidebar
    // =============================

    const updateTable = useCallback((tableId: string, field: keyof Table, value: any) => {
        setTables((prev) =>
            prev.map((t) => (t.id === tableId ? { ...t, [field]: value } : t))
        );
    }, [setTables]);

    const addTable = useCallback(() => {
        setTables((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                table_name: `table_${prev.length + 1}`,
                rows: 10,
                columns: [],
            },
        ]);
    }, [setTables]);

    const deleteTable = useCallback((tableId: string) => {
        setTables((prev) => prev.filter((t) => t.id !== tableId));
        if (selectedTableId === tableId) setSelectedTableId(null);
    }, [setTables, selectedTableId]);

    const addColumn = useCallback((tableId: string) => {
        setTables((prev) =>
            prev.map((t) =>
                t.id === tableId
                    ? {
                          ...t,
                          columns: [
                              ...t.columns,
                              {
                                  id: crypto.randomUUID(),
                                  name: `col_${t.columns.length + 1}`,
                                  type: "int",
                                  unique: false,
                              } as Column,
                          ],
                      }
                    : t
            )
        );
    }, [setTables]);

    const updateColumn = useCallback((tableId: string, colId: string, field: keyof Column, value: any) => {
        setTables((prev) =>
            prev.map((t) =>
                t.id === tableId
                    ? {
                          ...t,
                          columns: t.columns.map((c) =>
                              c.id === colId ? { ...c, [field]: value } : c
                          ),
                      }
                    : t
            )
        );
    }, [setTables]);

    const removeColumn = useCallback((tableId: string, colId: string) => {
        setTables((prev) =>
            prev.map((t) =>
                t.id === tableId
                    ? {
                          ...t,
                          columns: t.columns.filter((c) => c.id !== colId),
                      }
                    : t
            )
        );
    }, [setTables]);


    return (
        <div className="flex flex-col h-full bg-base relative overflow-hidden">
            
            {/* Top Workspace Header */}
            <div className="h-17 px-6  border-b border-border bg-base/80 backdrop-blur flex items-center justify-between z-10">
                
                {/* Visual / JSON Toggle */}
                <div className="flex items-center bg-surface-solid rounded-lg border border-border p-1 ">
                    <button
                        onClick={() => setActiveTab("visual")}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                            activeTab === "visual" 
                                ? "bg-slate-800 text-white shadow-sm" 
                                : "text-slate-400 hover:text-slate-200"
                        }`}
                    >
                        <PenTool className="w-4 h-4" /> Visual
                    </button>
                    <button
                        onClick={() => setActiveTab("json")}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                            activeTab === "json" 
                                ? "bg-slate-800 text-white shadow-sm" 
                                : "text-slate-400 hover:text-slate-200"
                        }`}
                    >
                        <Code2 className="w-4 h-4" /> JSON Source
                    </button>
                </div>

                {/* Export Actions & Add Table */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={addTable}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 hover:bg-emerald-400/20 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Add Table
                    </button>

                    <div className="w-px h-6 bg-border mx-1" />

                    {/* <div className="flex items-center bg-surface-solid border border-border rounded-lg overflow-hidden">
                        {FORMATS.map((f) => (
                            <button
                                key={f}
                                onClick={() => onFormatChange(f)}
                                className={`px-3 py-1.5 text-xs font-bold uppercase transition-colors ${
                                    format === f 
                                        ? "bg-primary/20 text-primary border-b-2 border-primary" 
                                        : "text-slate-400 hover:bg-slate-800 border-b-2 border-transparent"
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div> */}

                    <button
                        onClick={onGenerate}
                        disabled={loading || tables.length === 0}
                        className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                            loading || tables.length === 0
                                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                                : "bg-primary text-slate-900 hover:bg-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.4)]"
                        }`}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-slate-500 border-t-slate-300 rounded-full animate-spin" />
                                GENERATING...
                            </span>
                        ) : (
                            <>
                                <Download className="w-4 h-4" />
                                GENERATE DATA
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 relative">
                {activeTab === "visual" ? (
                    <SchemaCanvas 
                        tables={tables} 
                        onNodeClick={(id) => setSelectedTableId(id)} 
                    />
                ) : (
                    <JsonSchemaEditor tables={tables} onApply={handleJsonApply} />
                )}

                {/* Sliding Sidebar for Editing */}
                <EditSidebar
                    table={tables.find((t) => t.id === selectedTableId) || null}
                    allTables={tables}
                    onClose={() => setSelectedTableId(null)}
                    onUpdateTable={updateTable}
                    onDeleteTable={deleteTable}
                    onAddColumn={addColumn}
                    onUpdateColumn={updateColumn}
                    onRemoveColumn={removeColumn}
                />
            </div>
        </div>
    );
}

export default SchemaPanel;
