#!/usr/bin/env python3
"""Start the FastAPI server"""

import uvicorn
from src.api.main import app

if __name__ == "__main__":
    print("Starting AI Product Photography Tool API Server...")
    print("API Documentation available at: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
