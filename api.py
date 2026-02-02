from fastapi import FastAPI, Body
from fastapi.responses import StreamingResponse

from generator.engine import generate_row
from exporters.csv_exporter import generate_csv_string



app = FastAPI(
    title = "GeneratorX API",
    description  = "Generate schema-based dummy data for testing",
    version = "1.0.0"
)


@app.post("/generate")
def generate_dummy_data(schema: dict = Body(...)): #schema from fastapi as json, FastAPI converts JSON → Python dict
    data = generate_row(schema)
    return {
        "table" : schema.get("table_name"),
        "count" : len(data),
        "rows" : data
    }   



@app.post("/generate/csv")
def generate_csv(schema: dict = Body(...)):
    data = generate_row(schema)

    csv_buffer = generate_csv_string(data)

    filename = f"{schema.get('table_name', 'data')}.csv"

    return StreamingResponse(
        csv_buffer,
        media_type = "text/csv",
        headers = {
            "Content-Disposition": f"attachment; filename = {filename}"
        }
    )
   