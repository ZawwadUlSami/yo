# AI-Powered E-commerce Product Photography Tool

A comprehensive, AI-powered tool for processing e-commerce product images. Features include intelligent background removal, automatic image enhancement, professional background generation, and batch processing capabilities.

## Features

- **AI-Powered Background Removal**: Remove backgrounds using state-of-the-art U2-Net model
- **Automatic Image Enhancement**: Improve brightness, contrast, sharpness, and color balance
- **Professional Backgrounds**: Generate studio-quality backgrounds with various presets
- **Custom Backgrounds**: Apply solid colors, gradients, or custom styles
- **Drop Shadows**: Add realistic drop shadows for depth
- **Batch Processing**: Process multiple images at once
- **Web Optimization**: Automatic optimization for web use
- **CLI Interface**: Powerful command-line interface
- **REST API**: FastAPI-based web API with interactive documentation
- **Multiple Output Formats**: Support for PNG, JPEG, WebP, and more

## Installation

### Prerequisites

- Python 3.8 or higher
- pip package manager

### Install Dependencies

```bash
pip install -r requirements.txt
```

This will install all necessary dependencies including:
- FastAPI for the web API
- Pillow for image processing
- rembg for AI background removal
- scikit-image for advanced enhancement
- Click for CLI interface
- Rich for beautiful terminal output

## Quick Start

### CLI Usage

#### Process a single image

```bash
python main.py process input/product.jpg output/result.png
```

#### Remove background only

```bash
python main.py remove-bg input/product.jpg output/no_bg.png
```

#### Create a professional mockup

```bash
python main.py mockup input/product.jpg output/mockup.jpg --preset luxury
```

#### Batch process multiple images

```bash
python main.py batch input/ output/ --background professional
```

#### Show tool information

```bash
python main.py info
```

### API Usage

#### Start the API server

```bash
python api_server.py
```

The API will be available at `http://localhost:8000`
Interactive documentation at `http://localhost:8000/docs`

#### Example API Request (Python)

```python
import requests

url = "http://localhost:8000/api/process"

with open("product.jpg", "rb") as f:
    files = {"file": f}
    data = {
        "remove_bg": True,
        "enhance": True,
        "background_style": "professional"
    }

    response = requests.post(url, files=files, data=data)

    with open("result.png", "wb") as out:
        out.write(response.content)
```

#### Example API Request (cURL)

```bash
curl -X POST "http://localhost:8000/api/process" \
  -F "file=@product.jpg" \
  -F "remove_bg=true" \
  -F "enhance=true" \
  -F "background_style=professional" \
  -o result.png
```

## CLI Commands

### `process`

Process a single product image with full options.

```bash
python main.py process [OPTIONS] INPUT_PATH OUTPUT_PATH
```

**Options:**
- `--remove-bg / --keep-bg`: Remove or keep background (default: remove)
- `--enhance / --no-enhance`: Apply image enhancements (default: yes)
- `--background [preset]`: Apply background preset
- `--bg-color R,G,B`: Apply solid color background
- `--optimize / --no-optimize`: Optimize for web (default: yes)
- `--max-width INTEGER`: Maximum width in pixels (default: 2000)
- `--max-height INTEGER`: Maximum height in pixels (default: 2000)

**Examples:**

```bash
# Basic processing with background removal
python main.py process input.jpg output.png

# Keep original background, just enhance
python main.py process input.jpg output.jpg --keep-bg

# Add professional background
python main.py process input.jpg output.png --background professional

# Custom background color (white)
python main.py process input.jpg output.png --bg-color 255,255,255

# Process with specific size limit
python main.py process input.jpg output.jpg --max-width 1000 --max-height 1000
```

### `batch`

Batch process multiple images from a directory.

```bash
python main.py batch [OPTIONS] INPUT_DIR OUTPUT_DIR
```

**Options:** Same as `process` command

**Example:**

```bash
python main.py batch ./products ./processed --background luxury --enhance
```

### `remove-bg`

Quick background removal without enhancements.

```bash
python main.py remove-bg INPUT_PATH OUTPUT_PATH
```

**Example:**

```bash
python main.py remove-bg product.jpg product_nobg.png
```

### `mockup`

Create a professional product mockup with preset background.

```bash
python main.py mockup [OPTIONS] INPUT_PATH OUTPUT_PATH
```

**Options:**
- `--preset [style]`: Background preset (default: professional)
- `--shadow / --no-shadow`: Add drop shadow (default: yes)
- `--scale FLOAT`: Product scale 0.0-1.0 (default: 0.8)

**Example:**

```bash
python main.py mockup product.jpg mockup.jpg --preset luxury --scale 0.7
```

### `info`

Show tool information and available options.

```bash
python main.py info
```

## API Endpoints

### `POST /api/process`

Process a product image with all options.

**Parameters:**
- `file` (required): Image file
- `remove_bg` (boolean): Remove background
- `enhance` (boolean): Enhance image
- `background_style` (string): Background preset
- `background_color` (string): RGB color as "R,G,B"
- `optimize` (boolean): Optimize for web
- `max_width` (integer): Maximum width
- `max_height` (integer): Maximum height

**Response:** Processed image file

### `POST /api/remove-background`

Quick background removal.

**Parameters:**
- `file` (required): Image file

**Response:** Image with transparent background

### `POST /api/mockup`

Create professional mockup.

**Parameters:**
- `file` (required): Image file
- `preset` (string): Background preset
- `add_shadow` (boolean): Add drop shadow
- `scale` (float): Product scale

**Response:** Mockup image

### `GET /api/presets`

Get available background presets.

**Response:** JSON list of presets

### `GET /health`

Health check endpoint.

**Response:** API status

## Background Presets

| Preset | Description | Best For |
|--------|-------------|----------|
| **professional** | Clean, professional gradient | Business products, general use |
| **warm** | Warm, inviting tones | Home goods, food, cozy products |
| **cool** | Cool, modern tones | Tech products, electronics |
| **luxury** | Dark, luxurious background | Premium products, jewelry |
| **vibrant** | Vibrant, colorful gradient | Fashion, accessories, youth products |
| **studio_white** | Classic studio white | Traditional e-commerce listings |

## Project Structure

```
.
├── src/
│   ├── core/               # Core image processing modules
│   │   ├── processor.py    # Main image processor
│   │   ├── background_remover.py  # AI background removal
│   │   ├── enhancer.py     # Image enhancement
│   │   └── background_generator.py  # Background generation
│   ├── cli/                # Command-line interface
│   │   └── main.py
│   └── api/                # REST API
│       └── main.py
├── examples/               # Example scripts
│   ├── example_usage.py    # Python examples
│   └── api_examples.py     # API examples
├── output/                 # Default output directory
├── main.py                 # CLI entry point
├── api_server.py          # API server entry point
├── requirements.txt       # Python dependencies
└── README_PRODUCT_TOOL.md # This file
```

## Advanced Usage

### Python API

You can also use the tool directly in your Python code:

```python
from src.core.processor import ImageProcessor

# Initialize processor
processor = ImageProcessor()

# Process image
result = processor.process_product_image(
    input_path="product.jpg",
    output_path="result.png",
    remove_bg=True,
    enhance=True,
    background_style="professional"
)

# Batch process
results = processor.batch_process(
    input_dir="products/",
    output_dir="processed/",
    remove_bg=True,
    enhance=True
)

# Create mockup
mockup = processor.create_product_mockup(
    input_path="product.jpg",
    output_path="mockup.jpg",
    background_preset="luxury",
    add_shadow=True,
    scale=0.8
)
```

### Individual Components

```python
from PIL import Image
from src.core.background_remover import BackgroundRemover
from src.core.enhancer import ImageEnhancer
from src.core.background_generator import BackgroundGenerator

# Background removal
remover = BackgroundRemover()
image = Image.open("product.jpg")
no_bg = remover.remove_background(image)

# Image enhancement
enhancer = ImageEnhancer()
enhanced = enhancer.auto_enhance(image)
enhanced = enhancer.adjust_white_balance(enhanced)

# Background generation
bg_gen = BackgroundGenerator()
background = bg_gen.create_preset_background((2000, 2000), "professional")
result = bg_gen.add_product_to_background(no_bg, background, add_shadow=True)
```

## Performance Tips

1. **Batch Processing**: Process multiple images at once for better efficiency
2. **Size Limits**: Use `--max-width` and `--max-height` to limit output size
3. **Format Choice**: Use JPEG for smaller file sizes, PNG for transparency
4. **Optimization**: Keep `--optimize` enabled for web use
5. **API Mode**: Use the API for concurrent processing of multiple images

## Troubleshooting

### Installation Issues

If you encounter issues with `rembg` or `onnxruntime`:

```bash
pip install --upgrade pip
pip install onnxruntime-gpu  # For GPU support
# or
pip install onnxruntime      # For CPU only
```

### Memory Issues

For large images or batch processing:

1. Reduce `--max-width` and `--max-height`
2. Process images in smaller batches
3. Use `--no-optimize` if optimization is causing issues

### API Issues

If the API fails to start:

1. Check if port 8000 is available
2. Try a different port: `uvicorn src.api.main:app --port 8080`
3. Check firewall settings

## Examples

See the `examples/` directory for complete working examples:

- `example_usage.py`: Comprehensive Python usage examples
- `api_examples.py`: API integration examples

## Dependencies

- **FastAPI**: Modern web framework for the API
- **Pillow**: Python Imaging Library for image manipulation
- **rembg**: AI-powered background removal
- **opencv-python**: Computer vision library
- **scikit-image**: Image processing algorithms
- **Click**: Command-line interface creation
- **Rich**: Beautiful terminal output
- **uvicorn**: ASGI server for FastAPI

## License

This project is provided as-is for e-commerce product photography enhancement.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## Support

For issues, questions, or feature requests, please open an issue on the project repository.

## Acknowledgments

- U2-Net model for background removal
- rembg library for the background removal implementation
- The Python imaging community for excellent tools and libraries

---

**Happy Product Photography!** 📸✨
