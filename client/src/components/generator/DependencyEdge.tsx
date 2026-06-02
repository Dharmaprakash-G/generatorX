import { useState } from "react";
import {
    BaseEdge,
    EdgeLabelRenderer,
    getSmoothStepPath,
    type EdgeProps
} from "@xyflow/react";

export type DependencyEdgeData = {
    sourceTable: string;
    sourceCol: string;
    targetTable: string;
    targetCol: string;
};

export default function DependencyEdge({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    data,
}: EdgeProps & { data?: DependencyEdgeData }) {
    const [isHovered, setIsHovered] = useState(false);

    // Calculate a smooth step path with rounded corners (borderRadius: 16)
    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        borderRadius: 16,
    });

    return (
        <>
            {/* 1. Background Glow Path */}
            <path
                d={edgePath}
                fill="none"
                stroke={isHovered ? "#34d399" : "#38bdf8"}
                strokeWidth={isHovered ? 6 : 3}
                strokeOpacity={isHovered ? 0.35 : 0.12}
                className="transition-all duration-300 pointer-events-none"
            />

            {/* 2. Main Edge Path */}
            <BaseEdge
                path={edgePath}
                style={{
                    ...style,
                    stroke: isHovered ? "#34d399" : "#38bdf8",
                    strokeWidth: isHovered ? 2.5 : 1.5,
                    strokeDasharray: isHovered ? "none" : "4 4",
                    transition: "stroke-width 0.2s, stroke 0.2s, stroke-dasharray 0.2s",
                }}
                markerEnd={isHovered ? "url(#dependency-arrow-hover)" : "url(#dependency-arrow)"}
            />

            {/* 3. Animated Running Particle */}
            <circle r={isHovered ? 4.5 : 3.5} fill={isHovered ? "#34d399" : "#38bdf8"}>
                <animateMotion
                    dur={isHovered ? "1.5s" : "3s"}
                    repeatCount="indefinite"
                    path={edgePath}
                />
            </circle>

            {/* 4. Interactive Hit Area (much wider for easy hovering) */}
            <path
                d={edgePath}
                fill="none"
                stroke="transparent"
                strokeWidth={15}
                className="cursor-pointer pointer-events-auto"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            />

            {/* 5. Tooltip/Label */}
            {isHovered && data && (
                <EdgeLabelRenderer>
                    <div
                        style={{
                            position: "absolute",
                            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        }}
                        className="pointer-events-none z-50 bg-slate-950/95 border border-emerald-500/30 text-emerald-400 text-xs px-3 py-2 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.15)] backdrop-blur font-mono flex flex-col gap-1 select-none animate-in fade-in zoom-in-95 duration-150"
                    >
                        <div className="font-semibold text-[10px] text-slate-400 uppercase tracking-wider">
                            References
                        </div>
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                            <span className="text-slate-300 font-bold">{data.sourceTable}</span>
                            <span className="text-slate-500">.</span>
                            <span className="text-slate-300">{data.sourceCol}</span>
                            <span className="text-emerald-400 font-bold">→</span>
                            <span className="text-emerald-300 font-bold">{data.targetTable}</span>
                            <span className="text-slate-500">.</span>
                            <span className="text-emerald-300">{data.targetCol}</span>
                        </div>
                    </div>
                </EdgeLabelRenderer>
            )}
        </>
    );
}
