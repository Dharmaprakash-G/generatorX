import json
import sys
import os

from generator.engine import generate_dataset
from exporters.csv_exporter import table_to_csv_buffer

def main():
    if len(sys.argv) != 3:
        print("Usage: python main.py <schema.json> <output.csv>")
        return

    schema_file = sys.argv[1]
    output_file = sys.argv[2]
    
    with open(schema_file, "r") as f:
        schema = json.load(f)

    # Handle both single table schema and multi-table dataset schema
    if "tables" not in schema:
        dataset_schema = {"tables": [schema]}
        single_table = True
        table_name = schema.get("table_name", "data")
    else:
        dataset_schema = schema
        single_table = False

    try:
        data = generate_dataset(dataset_schema)
    except Exception as e:
        print(f"Error generating data: {e}")
        return
    
    if single_table:
        rows = data[table_name]
        csv_buf = table_to_csv_buffer(rows)
        with open(output_file, "w", newline="", encoding="utf-8") as f:
            f.write(csv_buf.getvalue())
        print(f" Generated {len(rows)} rows into {output_file}")
    else:
        first_table = list(data.keys())[0]
        rows = data[first_table]
        csv_buf = table_to_csv_buffer(rows)
        with open(output_file, "w", newline="", encoding="utf-8") as f:
            f.write(csv_buf.getvalue())
        print(f" Generated multi-table dataset. Wrote table '{first_table}' ({len(rows)} rows) into {output_file}")

if __name__ == "__main__":
    main()
