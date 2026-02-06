import io
import csv

def table_to_csv_buffer(rows : list[dict]) -> io.StringIO:
    buffer = io.StringIO()

    if not rows:
        return buffer

    writer = csv.DictWriter(buffer, fieldnames = rows[0].keys())
    writer.writeheader()
    writer.writerows(rows)

    buffer.seek(0)
    return buffer
     