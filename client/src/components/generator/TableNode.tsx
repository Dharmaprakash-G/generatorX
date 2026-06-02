import { memo } from "react";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { Key, Link } from "lucide-react";
import { cn } from "../../utils/cn";
import type { Table, Column } from "../../types/generator";

export interface CustomNodeData extends Table {
    [key: string]: any;
    onSelect?: (id: string) => void;
}

type CustomTableNode = Node<CustomNodeData, "tableNode">;

function TableNode({ data, selected }: NodeProps<CustomTableNode>) {
    return (
        <div
            className={cn(
                "w-72 rounded-xl shadow-xl glass-panel overflow-hidden transition-all duration-200 cursor-grab active:cursor-grabbing",
                selected ? "border-primary shadow-[0_0_20px_rgba(56,189,248,0.2)]" : ""
            )}
        >
            {/* Header */}
            <div className="bg-surface-solid border-b border-border px-4 py-3 flex items-center justify-between">
                <div className="font-semibold text-sm tracking-wide text-white">
                    {data.table_name || "untitled_table"}
                </div>
                <div className="text-xs text-slate-400 bg-slate-800/50 px-2 py-0.5 rounded-full border border-slate-700/50">
                    {data.rows} rows
                </div>
            </div>

            {/* Columns */}
            <div className="flex flex-col py-2">
                {data.columns.map((col: Column) => {
                    const isPK = col.name === "id"; // Simple heuristic for PK
                    const isFK = !!col.ref;

                    return (
                        <div
                            key={col.id}
                            className="relative flex items-center justify-between px-4 py-2 hover:bg-slate-800/30 transition-colors group"
                        >
                            {/* Target Handle for incoming FKs (available on all columns) */}
                            <Handle
                                type="target"
                                position={Position.Left}
                                id={`target-${data.id}-${col.name}`}
                                className={cn(
                                    "w-2 h-2 rounded-full !left-[-5px] transition-opacity",
                                    isPK 
                                        ? "!bg-emerald-500 !border-emerald-900 opacity-0 group-hover:opacity-100" 
                                        : "!bg-slate-600 !border-slate-800 opacity-0"
                                )}
                            />

                            <div className="flex items-center gap-2">
                                {isPK ? (
                                    <Key className="w-3.5 h-3.5 text-emerald-400" />
                                ) : isFK ? (
                                    <Link className="w-3.5 h-3.5 text-primary" />
                                ) : (
                                    <div className="w-3.5 h-3.5 flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                                    </div>
                                )}
                                <span className="text-sm text-slate-200">
                                    {col.name || "unnamed"}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                {col.unique && (
                                    <span className="text-[10px] uppercase text-amber-400 font-semibold tracking-wider">
                                        UNQ
                                    </span>
                                )}
                                <span className="font-mono text-[11px] text-slate-500 px-1.5 py-0.5 rounded bg-slate-900/50 border border-slate-800">
                                    {col.type}
                                </span>
                            </div>

                            {/* Source Handle for outgoing FKs (always rendered to avoid edge missing bugs) */}
                            <Handle
                                type="source"
                                position={Position.Right}
                                id={`source-${data.id}-${col.name}`}
                                className={cn(
                                    "w-2 h-2 !bg-primary !border-sky-900 rounded-full !right-[-5px] transition-opacity",
                                    isFK ? "opacity-0 group-hover:opacity-100" : "opacity-0 pointer-events-none hidden"
                                )}
                                style={{ display: isFK ? 'block' : 'none' }}
                            />
                        </div>
                    );
                })}
                {data.columns.length === 0 && (
                    <div className="px-4 py-3 text-xs text-slate-500 italic text-center">
                        No columns
                    </div>
                )}
            </div>
        </div>
    );
}

export default memo(TableNode);
