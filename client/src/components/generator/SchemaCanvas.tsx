import { useCallback, useEffect } from "react";
import {
    ReactFlow,
    Background,
    Controls,
    useNodesState,
    useEdgesState,
    ConnectionLineType,
    BackgroundVariant,
    type Node,
    type Edge
} from "@xyflow/react";
import TableNode from "./TableNode";
import DependencyEdge from "./DependencyEdge";
import type { Table } from "../../types/generator";

interface Props {
    tables: Table[];
    onNodeClick?: (tableId: string) => void;
}

const nodeTypes = {
    tableNode: TableNode,
};

const edgeTypes = {
    dependencyEdge: DependencyEdge,
};

function SchemaCanvas({ tables, onNodeClick }: Props) {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

    // Convert tables to React Flow nodes and edges
    useEffect(() => {
        setNodes((currentNodes) => {
            return tables.map((table, i) => {
                const existingNode = currentNodes.find((n) => n.id === table.id);
                const position = existingNode
                    ? existingNode.position
                    : {
                          x: 250 + (i % 3) * 350,
                          y: 100 + Math.floor(i / 3) * 300,
                      };

                return {
                    id: table.id,
                    type: "tableNode",
                    position,
                    data: { ...table },
                };
            });
        });

        setEdges(() => {
            const newEdges: Edge[] = [];
            tables.forEach((table) => {
                table.columns.forEach((col) => {
                    if (col.ref && col.ref.table) {
                        const targetTable = tables.find(t => t.table_name === col.ref?.table);
                        if (targetTable) {
                            const targetColName = col.ref.column || "id";
                            newEdges.push({
                                id: `e-${table.id}-${col.id}-${targetTable.id}`,
                                source: table.id,
                                target: targetTable.id,
                                sourceHandle: `source-${table.id}-${col.name}`,
                                targetHandle: `target-${targetTable.id}-${targetColName}`,
                                type: "dependencyEdge",
                                data: {
                                    sourceTable: table.table_name,
                                    sourceCol: col.name,
                                    targetTable: targetTable.table_name,
                                    targetCol: targetColName,
                                },
                            });
                        }
                    }
                });
            });
            return newEdges;
        });
    }, [tables, setNodes, setEdges]);

    const handleNodeClick = useCallback(
        (_: React.MouseEvent, node: Node) => {
            if (onNodeClick) {
                onNodeClick(node.id);
            }
        },
        [onNodeClick]
    );

    return (
        <div className="w-full h-full bg-base relative">
            {/* Reusable SVG filters, gradients and markers for custom edges */}
            <svg style={{ position: "absolute", width: 0, height: 0 }}>
                <defs>
                    {/* Linear Gradients */}
                    <linearGradient id="dependency-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#38bdf8" /> {/* Sky blue (FK source) */}
                        <stop offset="100%" stopColor="#10b981" /> {/* Emerald green (PK target) */}
                    </linearGradient>
                    <linearGradient id="dependency-grad-hover" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0ea5e9" /> {/* Brighter blue */}
                        <stop offset="100%" stopColor="#34d399" /> {/* Brighter green */}
                    </linearGradient>

                    {/* Custom Arrowhead Markers */}
                    <marker
                        id="dependency-arrow"
                        viewBox="0 0 10 10"
                        refX="6"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto-start-reverse"
                    >
                        <path d="M 0 1.5 L 8 5 L 0 8.5 Z" fill="#10b981" />
                    </marker>
                    <marker
                        id="dependency-arrow-hover"
                        viewBox="0 0 10 10"
                        refX="6"
                        refY="5"
                        markerWidth="7"
                        markerHeight="7"
                        orient="auto-start-reverse"
                    >
                        <path d="M 0 1.5 L 8 5 L 0 8.5 Z" fill="#34d399" />
                    </marker>
                </defs>
            </svg>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={handleNodeClick}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                connectionLineType={ConnectionLineType.SmoothStep}
                fitView
                proOptions={{ hideAttribution: true }}
                minZoom={0.2}
                maxZoom={2}
            >
                <Background
                    variant={BackgroundVariant.Dots}
                    gap={20}
                    size={2}
                    color="#1e293b" // slate-800
                />
                <Controls
                    className="bg-surface-solid border-border fill-slate-300"
                    showInteractive={false}
                />
            </ReactFlow>
        </div>
    );
}

export default SchemaCanvas;
