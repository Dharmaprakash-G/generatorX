import json
import sys

from generator.engine import generate_row
from exporters.csv_exporter import export_to_csv

def main():
    if len(sys.argv) != 3:
        print("Usage: python main.py <schema.json> <output.csv>")
        return

    schema_file = sys.argv[1]
    output_file = sys.argv[2]
    
    with open(schema_file, "r") as f:
        schema = json.load(f) #schema from file in folder as schema.json

    data = generate_row(schema)
    export_to_csv(data, output_file)

    print(f" Generated {len(data)} rows into {output_file}")

if __name__ == "__main__":
    main()

