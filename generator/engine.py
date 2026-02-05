from generator.types import generate_value 

def generate_data(schema):
    rows = schema["rows"]
    columns = schema["columns"]

    data = []
    unique_trackers = {}

    for col in columns:
        if col.get("unique"):
            unique_trackers[col["name"]] = set()

    for _ in range(rows):
        row = {}

        for col in columns:
            col_name = col["name"]
            col_type = col["type"]


            while True:
                value = generate_value(col_type,col)

                if col.get("unique"):
                    if value in unique_trackers[col_name]:
                        continue

                    unique_trackers[col_name].add(value)

                row[col_name] = value 
                break

        data.append(row)

    return data