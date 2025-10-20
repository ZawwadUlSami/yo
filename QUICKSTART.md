# Quick Start Guide

Get started with the AI Product Photography Tool in 5 minutes!

## Installation

```bash
# Clone the repository (or navigate to the project directory)
cd ai-product-photo-tool

# Install dependencies
pip install -r requirements.txt
```

## Your First Image

### Using CLI

```bash
# Create input directory
mkdir -p input output

# Place your product image in input/ folder
# Example: input/my-product.jpg

# Process the image
python main.py process input/my-product.jpg output/result.png
```

That's it! Your enhanced image with removed background is now in `output/result.png`

## Try Different Styles

```bash
# Professional background
python main.py mockup input/my-product.jpg output/professional.jpg --preset professional

# Luxury background
python main.py mockup input/my-product.jpg output/luxury.jpg --preset luxury

# Vibrant background
python main.py mockup input/my-product.jpg output/vibrant.jpg --preset vibrant
```

## Batch Process Multiple Images

```bash
# Place all your product images in input/ folder
python main.py batch input/ output/ --background professional
```

## Using the API

### Start the server

```bash
python api_server.py
```

Open your browser to `http://localhost:8000/docs` for interactive API documentation!

### Test with cURL

```bash
curl -X POST "http://localhost:8000/api/process" \
  -F "file=@input/my-product.jpg" \
  -F "enhance=true" \
  -F "background_style=professional" \
  -o output/api-result.png
```

## Common Use Cases

### E-commerce Listing

Remove background and optimize for web:

```bash
python main.py process product.jpg listing.png --background studio_white
```

### Social Media Post

Create eye-catching mockup:

```bash
python main.py mockup product.jpg social.jpg --preset vibrant --scale 0.7
```

### Product Catalog

Batch process with consistent background:

```bash
python main.py batch products/ catalog/ --background professional --optimize
```

## Next Steps

- Read the full [README_PRODUCT_TOOL.md](README_PRODUCT_TOOL.md) for all features
- Check out [examples/](examples/) for code samples
- Explore the API at `http://localhost:8000/docs`

## Need Help?

```bash
# Show all commands
python main.py --help

# Show command-specific help
python main.py process --help

# Show tool information
python main.py info
```

Happy enhancing! 📸✨
