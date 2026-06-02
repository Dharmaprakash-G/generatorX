import type { ColumnType } from "./enums";

export interface ColumnRef {
    table: string;
    column: string
}

export interface Column {
    id: string;
    name: string;
    type: ColumnType;
    min?: number;
    max?: number;
    unique?: boolean;
    ref?: ColumnRef;
}

export interface Table {
    id: string;
    table_name: string;
    rows: number;
    columns: Column[];
}

export interface GenerateRequest {
    tables: Table[];
}

export type ExportFormat = "csv" | "json" | "sql";

export interface ChatMessage {
    id: string;
    role: "user" | "ai";
    content: string;
    schema?: Table[];
}

