import sys
import os

# Add server directory to Python path so server-internal imports work
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'server'))

from fastapi import FastAPI
from app import app as server_app

# Vercel sees requests at /api/*, so mount the server app under /api
# e.g. /api/generate → server app handles /generate
app = FastAPI()
app.mount("/api", server_app)
