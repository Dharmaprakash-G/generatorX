from typing import Optional
from pydantic import BaseModel, validator, root_validator
from typing import List
from enum import Enum



class ColumnType(str, Enum):
    INT = "int"
    FULL_NAME = "full_name"
    EMAIL = "email"
    CITY = "city"
    DATE = "date"
    UUID = "uuid"
    BOOLEAN = "boolean"

class ColumnSchema(BaseModel):
    name: str
    type: ColumnType


    min: Optional[int] = None
    max: Optional[int] = None
    unique: Optional[bool] = False

    @validator("name")
    def name_must_not_ne_empty(cls, v):
        if not v.strip():
            raise ValueError("column nmae must not be empty")
        return v


        @root_validator
        def check_min_max(cls,values):
            min_val = values.get("min")
            max_val = values.get("max")

            if min_val is not None and max_val is not None:
                if min_val > max_val:
                    raise ValueError("min must be less than max")

            return values



class TableSchema(BaseModel):
    table_name: str = "data"
    rows: int
    columns: List[ColumnSchema]

    @validator("rows")
    def rows_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError("rows must be greater than 0")

        return v

    @validator("columns")
    def columns_must_not_be_empty(cls, v):
        if not v:
            raise ValueError("columns list must not be empty")

        return v

