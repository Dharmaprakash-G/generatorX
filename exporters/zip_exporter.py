import io
import zipfile
from exporters.csv_exporter import table_to_csv_buffer

def dataset_to_zip(dataset: dict) -> io.BytesIO:
    zip_buffer = io.BytesIO()

    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        for  table_name,rows  in dataset.items():
            csv_buffer = table_to_csv_buffer(rows)
            zip_file.writestr(f"{table_name}.csv", csv_buffer.getvalue())

    zip_buffer.seek(0)
    return zip_buffer