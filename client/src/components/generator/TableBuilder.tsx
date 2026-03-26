import type { Table, Column } from "../../types/generator";
import { COLUMN_TYPES } from "../../types/enums";

interface Props {
    tables: Table[];
    setTables: React.Dispatch<React.SetStateAction<Table[]>>;
}

function TableBuilder({ tables, setTables }: Props) {

    // =============================
    // TABLE FUNCTIONS
    // =============================

    const addTable = () => {
        setTables([
            ...tables,
            {
                id: crypto.randomUUID(),
                table_name: "",
                rows: 10,
                columns: [],
            },
        ]);
    };

    const removeTable = (tableId: string) => {
        setTables(tables.filter((t) => t.id !== tableId));
    };

    const updateTable = (
        tableId: string,
        field: keyof Table,
        value: any
    ) => {
        setTables(
            tables.map((table) =>
                table.id === tableId ? { ...table, [field]: value } : table
            )
        );
    };

    // =============================
    // COLUMN FUNCTIONS
    // =============================

    const addColumn = (tableId: string) => {
        setTables(
            tables.map((table) =>
                table.id === tableId
                    ? {
                        ...table,
                        columns: [
                            ...table.columns,
                            {
                                id: crypto.randomUUID(),
                                name: "",
                                type: "int",
                                unique: false,
                            } as Column,
                        ],
                    }
                    : table
            )
        );
    };

    const removeColumn = (tableId: string, columnId: string) => {
        setTables(
            tables.map((table) =>
                table.id === tableId
                    ? {
                        ...table,
                        columns: table.columns.filter(
                            (col) => col.id !== columnId
                        ),
                    }
                    : table
            )
        );
    };

    const updateColumn = (
        tableId: string,
        columnId: string,
        field: keyof Column,
        value: any
    ) => {
        setTables(
            tables.map((table) =>
                table.id === tableId
                    ? {
                        ...table,
                        columns: table.columns.map((col) =>
                            col.id === columnId
                                ? { ...col, [field]: value }
                                : col
                        ),
                    }
                    : table
            )
        );
    };

    // =============================
    // UI
    // =============================

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Tables</h2>
                <button
                    onClick={addTable}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                >
                    + Add Table
                </button>
            </div>

            {tables.map((table) => (
                <div
                    key={table.id}
                    className="border border-gray-200 rounded-xl p-6 mb-8 bg-white shadow-sm"
                >
                    {/* Table Header */}
                    <div className="flex justify-between items-center mb-4">
                        <input
                            placeholder="Table Name"
                            value={table.table_name}
                            onChange={(e) =>
                                updateTable(table.id, "table_name", e.target.value)
                            }
                            className="border border-gray-300 rounded-lg p-2 w-1/2"
                        />

                        <button
                            onClick={() => removeTable(table.id)}
                            className="text-red-500 hover:text-red-700 p-3 text-sm border shadow border-gray-400 rounded"
                        >
                            Remove Table
                        </button>
                    </div>

                    {/* Rows */}
                    <div className="mb-6">
                        <label className="text-sm text-gray-600 mr-2">
                            Rows:
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={table.rows}
                            onChange={(e) =>
                                updateTable(table.id, "rows", Math.max(0, Number(e.target.value)))
                            }
                            className="border border-gray-300 rounded-lg p-2 w-32"
                        />
                    </div>

                    {/* Add Column Button */}
                    <div className="mb-4">
                        <button
                            onClick={() => addColumn(table.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm"
                        >
                            + Add Column
                        </button>
                    </div>

                    {/* Columns */}
                    {table.columns.map((column) => (
                        <div
                            key={column.id}
                            className="border border-gray-100 rounded-lg p-4 mb-4 bg-gray-50"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">

                                {/* Type */}
                                <select
                                    value={column.type}
                                    onChange={(e) =>
                                        updateColumn(
                                            table.id,
                                            column.id,
                                            "type",
                                            e.target.value
                                        )
                                    }
                                    className="border border-gray-300 rounded-lg p-2"
                                >
                                    {COLUMN_TYPES.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                                {/* Column Name */}
                                <input
                                    placeholder="Column Name"
                                    value={column.name}
                                    onChange={(e) =>
                                        updateColumn(
                                            table.id,
                                            column.id,
                                            "name",
                                            e.target.value
                                        )
                                    }
                                    className="border border-gray-300 rounded-lg p-2"
                                />


                                {/* Min / Max only for int */}
                                {column.type === "int" && (
                                    <>
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="Min"
                                            value={column.min ?? ""}
                                            onChange={(e) =>
                                                updateColumn(
                                                    table.id,
                                                    column.id,
                                                    "min",
                                                    e.target.value
                                                        ? Math.max(0, Number(e.target.value))
                                                        : undefined
                                                )
                                            }
                                            className="border border-gray-300 rounded-lg p-2"
                                        />

                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="Max"
                                            value={column.max ?? ""}
                                            onChange={(e) =>
                                                updateColumn(
                                                    table.id,
                                                    column.id,
                                                    "max",
                                                    e.target.value
                                                        ? Math.max(0, Number(e.target.value))
                                                        : undefined
                                                )
                                            }
                                            className="border border-gray-300 rounded-lg p-2"
                                        />
                                    </>
                                )}

                                {/* Unique */}
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={column.unique || false}
                                        onChange={(e) =>
                                            updateColumn(
                                                table.id,
                                                column.id,
                                                "unique",
                                                e.target.checked
                                            )
                                        }
                                    />
                                    Unique
                                </label>

                                {/* Remove Column */}
                                <button
                                    onClick={() =>
                                        removeColumn(table.id, column.id)
                                    }
                                    className="text-red-500 hover:text-red-700 text-sm shadow border border-gray-400 rounded"
                                >
                                    Remove
                                </button>
                            </div>

                            {/* =============================
                   FOREIGN KEY SECTION
              ============================= */}
                            {column.type === "int" && (
                                <div className="mt-4 flex gap-3">

                                    {/* Ref Table */}
                                    <select
                                        value={column.ref?.table || ""}
                                        onChange={(e) =>
                                            updateColumn(table.id, column.id, "ref", {
                                                table: e.target.value,
                                                column: "",
                                            })
                                        }
                                        className="border border-gray-300 rounded-lg p-2"
                                    >
                                        <option value="">Select Ref Table</option>
                                        {tables
                                            .filter((t) => t.id !== table.id)
                                            .map((t) => (
                                                <option key={t.id} value={t.table_name}>
                                                    {t.table_name}
                                                </option>
                                            ))}
                                    </select>

                                    {/* Ref Column */}
                                    {column.ref?.table && (
                                        <select
                                            value={column.ref?.column || ""}
                                            onChange={(e) =>
                                                updateColumn(table.id, column.id, "ref", {
                                                    ...column.ref,
                                                    column: e.target.value,
                                                })
                                            }
                                            className="border border-gray-300 rounded-lg p-2"
                                        >
                                            <option value="">Select Ref Column</option>
                                            {tables
                                                .find(
                                                    (t) =>
                                                        t.table_name === column.ref?.table
                                                )
                                                ?.columns.map((c) => (
                                                    <option key={c.id} value={c.name}>
                                                        {c.name}
                                                    </option>
                                                ))}
                                        </select>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default TableBuilder;