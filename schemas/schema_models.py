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


class RefSchema(BaseModel):
    table: str
    column: str


class ColumnSchema(BaseModel):
    name: str
    type: ColumnType


    min: Optional[int] = None
    max: Optional[int] = None
    unique: Optional[bool] = False

    ref: Optional[RefSchema] = None

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
        

class DatasetSchema(BaseModel):
    tables: List[TableSchema]

    @validator("tables")
    def tables_must_not_be_empty(cls, v):
        if not v:
            raise ValueError("dataset must contain at least one table")
        return v

        @root_validator
        def validate_references(cls, values):
            tables = values.get("tables", [])

            table_map = {
                tables.table_name:table
                for table in tables
            }

            for table in tables:
                for column in table.columns:
                    if column.ref:
                        ref_table = column.ref.table
                        ref_column = column.ref.column

                        if ref_table not in table_map:
                            raise ValueError(
                                f"Table '{table.table_name}' references unknown table '{ref_table}'"
                            )

                        parent_columns = {
                            col.name for col in table_map[ref_table].columns
                        }

                        if ref_column not in parent_columns:
                            raise ValueError(
                                f"Table '{table.table_name}' references unknown column "
                                f"'{ref_column}' in table '{ref_table}'"
                            )

            return values