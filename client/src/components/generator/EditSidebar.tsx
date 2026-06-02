import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, Database, LayoutList, Link } from "lucide-react";
import type { Table, Column } from "../../types/generator";
import { COLUMN_TYPES } from "../../types/enums";

interface Props {
    table: Table | null;
    allTables: Table[];
    onClose: () => void;
    onUpdateTable: (tableId: string, field: keyof Table, value: any) => void;
    onDeleteTable: (tableId: string) => void;
    onAddColumn: (tableId: string) => void;
    onUpdateColumn: (tableId: string, columnId: string, field: keyof Column, value: any) => void;
    onRemoveColumn: (tableId: string, columnId: string) => void;
}

function EditSidebar({
    table,
    allTables,
    onClose,
    onUpdateTable,
    onDeleteTable,
    onAddColumn,
    onUpdateColumn,
    onRemoveColumn,
}: Props) {
    return (
        <AnimatePresence>
            {table && (
                <motion.div
                    initial={{ x: "100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100%", opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute right-0 top-0 bottom-0 w-96 bg-surface-solid border-l border-border shadow-2xl flex flex-col z-50"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-slate-900/50">
                        <div className="flex items-center gap-3">
                            <Database className="w-5 h-5 text-primary" />
                            <h2 className="text-sm font-semibold text-white tracking-wide">
                                TABLE SETTINGS
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Content Scroll Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                        
                        {/* Table Name & Rows */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1.5 tracking-wider">
                                    TABLE NAME
                                </label>
                                <input
                                    type="text"
                                    value={table.table_name}
                                    onChange={(e) => onUpdateTable(table.id, "table_name", e.target.value)}
                                    className="w-full bg-base border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                                    placeholder="users"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1.5 tracking-wider">
                                    NUMBER OF ROWS
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={table.rows}
                                    onChange={(e) => onUpdateTable(table.id, "rows", Math.max(0, Number(e.target.value)))}
                                    className="w-full bg-base border border-border rounded-lg px-3 py-2 text-sm text-primary font-mono focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>
                        </div>

                        {/* Columns List */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <LayoutList className="w-4 h-4 text-slate-400" />
                                    <h3 className="text-xs font-semibold text-slate-300 tracking-wider">
                                        COLUMNS
                                    </h3>
                                </div>
                                <button
                                    onClick={() => onAddColumn(table.id)}
                                    className="flex items-center gap-1 text-xs text-primary hover:text-sky-300 font-medium transition-colors"
                                >
                                    <Plus className="w-3.5 h-3.5" /> ADD
                                </button>
                            </div>

                            <div className="space-y-3">
                                {table.columns.length === 0 ? (
                                    <div className="text-center py-6 border border-dashed border-border rounded-lg text-xs text-slate-500">
                                        No columns defined.
                                    </div>
                                ) : (
                                    table.columns.map((col) => (
                                        <div key={col.id} className="bg-base border border-border rounded-lg p-3 space-y-3 relative group">
                                            
                                            {/* Column Header (Name & Delete) */}
                                            <div className="flex items-center justify-between">
                                                <input
                                                    type="text"
                                                    value={col.name}
                                                    onChange={(e) => onUpdateColumn(table.id, col.id, "name", e.target.value)}
                                                    className="bg-transparent text-sm text-white font-medium focus:outline-none w-3/4 border-b border-transparent focus:border-primary pb-0.5"
                                                    placeholder="column_name"
                                                />
                                                <button
                                                    onClick={() => onRemoveColumn(table.id, col.id)}
                                                    className="text-slate-500 hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"
                                                    title="Delete Column"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Type and Properties */}
                                            <div className="flex flex-wrap gap-2 items-center">
                                                <select
                                                    value={col.type}
                                                    onChange={(e) => onUpdateColumn(table.id, col.id, "type", e.target.value)}
                                                    className="bg-surface-solid border border-border text-xs text-slate-300 rounded px-2 py-1 focus:outline-none focus:border-primary cursor-pointer font-mono"
                                                >
                                                    {COLUMN_TYPES.map((t) => (
                                                        <option key={t} value={t}>{t}</option>
                                                    ))}
                                                </select>

                                                <label className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={col.unique || false}
                                                        onChange={(e) => onUpdateColumn(table.id, col.id, "unique", e.target.checked)}
                                                        className="accent-primary"
                                                    />
                                                    UNIQUE
                                                </label>
                                            </div>

                                            {/* Int Min/Max */}
                                            {col.type === "int" && (
                                                <div className="flex items-center gap-2 pt-1 border-t border-border/50">
                                                    <input
                                                        type="number"
                                                        placeholder="min"
                                                        value={col.min ?? ""}
                                                        onChange={(e) => onUpdateColumn(table.id, col.id, "min", e.target.value ? Number(e.target.value) : undefined)}
                                                        className="w-16 bg-surface-solid border border-border rounded px-2 py-1 text-xs text-slate-300 font-mono focus:outline-none focus:border-primary"
                                                    />
                                                    <span className="text-slate-500 text-xs">-</span>
                                                    <input
                                                        type="number"
                                                        placeholder="max"
                                                        value={col.max ?? ""}
                                                        onChange={(e) => onUpdateColumn(table.id, col.id, "max", e.target.value ? Number(e.target.value) : undefined)}
                                                        className="w-16 bg-surface-solid border border-border rounded px-2 py-1 text-xs text-slate-300 font-mono focus:outline-none focus:border-primary"
                                                    />
                                                </div>
                                            )}

                                            {/* Foreign Key Reference (Only for int for now, or generally available) */}
                                            {col.type === "int" && (
                                                <div className="pt-2 border-t border-border/50">
                                                    <div className="flex items-center gap-1.5 mb-1.5">
                                                        <Link className="w-3 h-3 text-slate-400" />
                                                        <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Foreign Key</span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <select
                                                            value={col.ref?.table || ""}
                                                            onChange={(e) => onUpdateColumn(table.id, col.id, "ref", { table: e.target.value, column: "" })}
                                                            className="flex-1 bg-surface-solid border border-border text-xs text-slate-300 rounded px-2 py-1.5 focus:outline-none focus:border-primary font-mono"
                                                        >
                                                            <option value="">No Ref Table</option>
                                                            {allTables.filter(t => t.id !== table.id).map(t => (
                                                                <option key={t.id} value={t.table_name}>{t.table_name || "(unnamed)"}</option>
                                                            ))}
                                                        </select>

                                                        {col.ref?.table && (
                                                            <select
                                                                value={col.ref?.column || ""}
                                                                onChange={(e) => onUpdateColumn(table.id, col.id, "ref", { ...col.ref, column: e.target.value })}
                                                                className="flex-1 bg-surface-solid border border-border text-xs text-slate-300 rounded px-2 py-1.5 focus:outline-none focus:border-primary font-mono"
                                                            >
                                                                <option value="">Select Col</option>
                                                                {allTables.find(t => t.table_name === col.ref?.table)?.columns.map(c => (
                                                                    <option key={c.id} value={c.name}>{c.name}</option>
                                                                ))}
                                                            </select>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 border-t border-border bg-base">
                        <button
                            onClick={() => {
                                onDeleteTable(table.id);
                                onClose();
                            }}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-danger border border-danger/30 hover:bg-danger/10 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            DELETE TABLE
                        </button>
                    </div>

                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default EditSidebar;
