from fastapi import FastAPI, Body, HTTPException
from fastapi.responses import StreamingResponse

from generator.engine import generate_data
from exporters.csv_exporter import generate_csv_string
from schemas.schema_models import TableSchema


app = FastAPI(
    title = "GeneratorX API",
    description  = "Generate schema-based dummy data for testing",
    version = "1.0.0"
)


@app.post("/generate")
def generate_dummy_data(schema: TableSchema): #schema from fastapi as json, FastAPI converts JSON → Python dict
    try:
        data = generate_data(schema.dict())
    except ValueError as e:
        raise HTTPException(status_code = 422, detail = str(e))
    
    return {
        "table" : schema.table_name,
        "count" : len(data),
        "rows" : data
    }   



@app.post("/generate/csv")
def generate_csv(schema: TableSchema):
    try:
        data = generate_data(schema.dict())
    except ValueError as e:
        raise HTTPException(status_code = 422, detail = str(e))

    csv_buffer = generate_csv_string(data)

    filename = f"{schema.table_name}.csv"

    return StreamingResponse(
        csv_buffer,
        media_type = "text/csv",
        headers = {
            "Content-Disposition": f"attachment; filename = {filename}"
        }
    )
   