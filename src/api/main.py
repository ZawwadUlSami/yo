"""FastAPI web API for AI Product Photography Tool"""

import os
import io
import tempfile
from pathlib import Path
from typing import Optional
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from src.core.processor import ImageProcessor


app = FastAPI(
    title="AI Product Photography Tool API",
    description="AI-powered e-commerce product image processing API",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize processor
processor = ImageProcessor()


class ProcessingOptions(BaseModel):
    """Image processing options"""
    remove_bg: bool = True
    enhance: bool = True
    background_style: Optional[str] = None
    background_color: Optional[str] = None
    optimize: bool = True
    max_width: int = 2000
    max_height: int = 2000


@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "name": "AI Product Photography Tool API",
        "version": "1.0.0",
        "endpoints": {
            "process": "/api/process",
            "remove_bg": "/api/remove-background",
            "mockup": "/api/mockup",
            "health": "/health"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "ai-product-photo-tool"}


@app.post("/api/process")
async def process_image(
    file: UploadFile = File(...),
    remove_bg: bool = Form(True),
    enhance: bool = Form(True),
    background_style: Optional[str] = Form(None),
    background_color: Optional[str] = Form(None),
    optimize: bool = Form(True),
    max_width: int = Form(2000),
    max_height: int = Form(2000)
):
    """
    Process a product image with AI enhancements

    - **file**: Product image file
    - **remove_bg**: Remove background (default: true)
    - **enhance**: Enhance image quality (default: true)
    - **background_style**: Background preset (professional, warm, cool, luxury, vibrant, studio_white)
    - **background_color**: Background color as R,G,B (e.g., "255,255,255")
    - **optimize**: Optimize for web (default: true)
    - **max_width**: Maximum width (default: 2000)
    - **max_height**: Maximum height (default: 2000)
    """
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")

        # Parse background color
        bg_color = None
        if background_color:
            try:
                bg_color = tuple(map(int, background_color.split(',')))
                if len(bg_color) != 3:
                    raise ValueError
            except:
                raise HTTPException(status_code=400, detail="Invalid color format. Use R,G,B")

        # Read file content
        content = await file.read()

        # Create temporary files
        with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as temp_input:
            temp_input.write(content)
            temp_input_path = temp_input.name

        with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as temp_output:
            temp_output_path = temp_output.name

        try:
            # Process image
            result_path = processor.process_product_image(
                input_path=temp_input_path,
                output_path=temp_output_path,
                remove_bg=remove_bg,
                enhance=enhance,
                background_style=background_style,
                background_color=bg_color,
                optimize=optimize,
                max_size=(max_width, max_height)
            )

            # Read processed image
            with open(result_path, 'rb') as f:
                result_content = f.read()

            # Return as streaming response
            return StreamingResponse(
                io.BytesIO(result_content),
                media_type="image/png",
                headers={
                    "Content-Disposition": f"attachment; filename=processed_{file.filename}"
                }
            )

        finally:
            # Clean up temp files
            try:
                os.unlink(temp_input_path)
                os.unlink(temp_output_path)
            except:
                pass

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")


@app.post("/api/remove-background")
async def remove_background(file: UploadFile = File(...)):
    """
    Quick background removal without enhancements

    - **file**: Product image file
    """
    try:
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")

        content = await file.read()

        with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as temp_input:
            temp_input.write(content)
            temp_input_path = temp_input.name

        with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as temp_output:
            temp_output_path = temp_output.name

        try:
            result_path = processor.quick_background_removal(temp_input_path, temp_output_path)

            with open(result_path, 'rb') as f:
                result_content = f.read()

            return StreamingResponse(
                io.BytesIO(result_content),
                media_type="image/png",
                headers={
                    "Content-Disposition": f"attachment; filename=nobg_{file.filename}"
                }
            )

        finally:
            try:
                os.unlink(temp_input_path)
                os.unlink(temp_output_path)
            except:
                pass

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")


@app.post("/api/mockup")
async def create_mockup(
    file: UploadFile = File(...),
    preset: str = Form("professional"),
    add_shadow: bool = Form(True),
    scale: float = Form(0.8)
):
    """
    Create a professional product mockup

    - **file**: Product image file
    - **preset**: Background preset (professional, warm, cool, luxury, vibrant)
    - **add_shadow**: Add drop shadow (default: true)
    - **scale**: Product scale 0.0-1.0 (default: 0.8)
    """
    try:
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")

        if not 0.1 <= scale <= 1.0:
            raise HTTPException(status_code=400, detail="Scale must be between 0.1 and 1.0")

        content = await file.read()

        with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as temp_input:
            temp_input.write(content)
            temp_input_path = temp_input.name

        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_output:
            temp_output_path = temp_output.name

        try:
            result_path = processor.create_product_mockup(
                input_path=temp_input_path,
                output_path=temp_output_path,
                background_preset=preset,
                add_shadow=add_shadow,
                scale=scale
            )

            with open(result_path, 'rb') as f:
                result_content = f.read()

            return StreamingResponse(
                io.BytesIO(result_content),
                media_type="image/jpeg",
                headers={
                    "Content-Disposition": f"attachment; filename=mockup_{file.filename}"
                }
            )

        finally:
            try:
                os.unlink(temp_input_path)
                os.unlink(temp_output_path)
            except:
                pass

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")


@app.get("/api/presets")
async def get_presets():
    """Get available background presets"""
    return {
        "presets": [
            {
                "id": "professional",
                "name": "Professional",
                "description": "Clean, professional gradient for business use"
            },
            {
                "id": "warm",
                "name": "Warm",
                "description": "Warm tones for cozy, inviting products"
            },
            {
                "id": "cool",
                "name": "Cool",
                "description": "Cool tones perfect for tech and modern products"
            },
            {
                "id": "luxury",
                "name": "Luxury",
                "description": "Dark, luxurious background for premium products"
            },
            {
                "id": "vibrant",
                "name": "Vibrant",
                "description": "Vibrant, colorful background for eye-catching displays"
            },
            {
                "id": "studio_white",
                "name": "Studio White",
                "description": "Classic studio white background"
            }
        ]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
