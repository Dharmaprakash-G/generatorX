from fastapi import FastAPI, Body, HTTPException
from fastapi.responses import StreamingResponse

from generator.engine import generate_dataset
from schemas.schema_models import DatasetSchema
from exporters.zip_exporter import dataset_to_zip


app = FastAPI(
    title = "GeneratorX",
    description  = "Schema-driven data generation engine",
    version = "2.0.0"
)


@app.get("/")
def root():
    return {
        "name": "GeneratorX",
        "description": "Schema-driven relational data generation engine",
        "docs": "/docs",
        "version": "2.0.0"
    }

@app.post("/generate")
def generate_dataset_api(schema: DatasetSchema): #schema from fastapi as json, FastAPI converts JSON → Python dict
    try:
        dataset = generate_dataset(schema.dict())
    except ValueError as e:
        raise HTTPException(status_code = 422, detail = str(e))
    
    return {
        "dataset" : dataset
    }


@app.post("/generate/zip")
def generate_zip(schema: DatasetSchema):
    try:
        data = generate_dataset(schema.dict())
    except ValueError as e:
        raise HTTPException(status_code = 422, detail = str(e))

    zip_buffer = dataset_to_zip(data)

    return StreamingResponse(
        zip_buffer,
        media_type = "applecation/zip",
        headers = {
            "Content-Disposition": 'attachment; filename = "generatorX_dataset.zip"'
        }
    )


# @app.post("/generate/csv")
# def generate_csv(schema: DatasetSchema):
#     try:
#         data = generate_dataset(schema.dict())
#     except ValueError as e:
#         raise HTTPException(status_code = 422, detail = str(e))

#     csv_buffer = generate_csv_string(data)

#     filename = f"{schema.table_name}.csv"

#     return StreamingResponse(
#         csv_buffer,
#         media_type = "text/csv",
#         headers = {
#             "Content-Disposition": f"attachment; filename = {filename}"
#         }
#     )
   