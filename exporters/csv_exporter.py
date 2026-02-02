import io
import pandas as pd 

def generate_csv_string(data):
    df = pd.DataFrame(data)
    buffer = io.StringIO()
    df.to_csv(buffer,index = False)
    buffer.seek(0)
    return buffer 