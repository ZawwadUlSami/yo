"""Example API usage with Python requests library"""

import requests
from pathlib import Path


# Base API URL
API_URL = "http://localhost:8000"


def example_process_image():
    """Example: Process image with full options"""
    print("Example 1: Process Image with Full Options")
    print("-" * 50)

    url = f"{API_URL}/api/process"

    # Open image file
    with open("input/product.jpg", "rb") as f:
        files = {"file": f}
        data = {
            "remove_bg": True,
            "enhance": True,
            "background_style": "professional",
            "optimize": True,
            "max_width": 2000,
            "max_height": 2000
        }

        response = requests.post(url, files=files, data=data)

    if response.status_code == 200:
        # Save the result
        with open("output/api_processed.png", "wb") as f:
            f.write(response.content)
        print("✓ Image processed successfully!")
    else:
        print(f"✗ Error: {response.json()}")

    print()


def example_remove_background():
    """Example: Quick background removal"""
    print("Example 2: Quick Background Removal")
    print("-" * 50)

    url = f"{API_URL}/api/remove-background"

    with open("input/product.jpg", "rb") as f:
        files = {"file": f}
        response = requests.post(url, files=files)

    if response.status_code == 200:
        with open("output/api_nobg.png", "wb") as f:
            f.write(response.content)
        print("✓ Background removed successfully!")
    else:
        print(f"✗ Error: {response.json()}")

    print()


def example_create_mockup():
    """Example: Create product mockup"""
    print("Example 3: Create Product Mockup")
    print("-" * 50)

    url = f"{API_URL}/api/mockup"

    with open("input/product.jpg", "rb") as f:
        files = {"file": f}
        data = {
            "preset": "luxury",
            "add_shadow": True,
            "scale": 0.8
        }

        response = requests.post(url, files=files, data=data)

    if response.status_code == 200:
        with open("output/api_mockup.jpg", "wb") as f:
            f.write(response.content)
        print("✓ Mockup created successfully!")
    else:
        print(f"✗ Error: {response.json()}")

    print()


def example_get_presets():
    """Example: Get available presets"""
    print("Example 4: Get Available Presets")
    print("-" * 50)

    url = f"{API_URL}/api/presets"
    response = requests.get(url)

    if response.status_code == 200:
        presets = response.json()["presets"]
        print("Available presets:")
        for preset in presets:
            print(f"  • {preset['name']}: {preset['description']}")
    else:
        print(f"✗ Error: {response.json()}")

    print()


def example_health_check():
    """Example: Health check"""
    print("Example 5: Health Check")
    print("-" * 50)

    url = f"{API_URL}/health"
    response = requests.get(url)

    if response.status_code == 200:
        print(f"✓ API Status: {response.json()}")
    else:
        print(f"✗ API is not responding")

    print()


def example_batch_process():
    """Example: Batch process multiple images"""
    print("Example 6: Batch Process Multiple Images")
    print("-" * 50)

    input_dir = Path("input")
    output_dir = Path("output/api_batch")
    output_dir.mkdir(parents=True, exist_ok=True)

    # Get all image files
    image_files = list(input_dir.glob("*.jpg")) + list(input_dir.glob("*.png"))

    for img_path in image_files:
        print(f"Processing: {img_path.name}")

        with open(img_path, "rb") as f:
            files = {"file": f}
            data = {
                "remove_bg": True,
                "enhance": True,
                "background_style": "professional"
            }

            response = requests.post(f"{API_URL}/api/process", files=files, data=data)

            if response.status_code == 200:
                output_path = output_dir / f"processed_{img_path.name}"
                with open(output_path, "wb") as out_f:
                    out_f.write(response.content)
                print(f"  ✓ Saved to: {output_path}")
            else:
                print(f"  ✗ Error processing {img_path.name}")

    print()


if __name__ == "__main__":
    print("\n" + "=" * 50)
    print("AI Product Photography Tool - API Examples")
    print("=" * 50 + "\n")

    print("Make sure the API server is running:")
    print("  python api_server.py\n")

    # Create output directory
    Path("output").mkdir(exist_ok=True)

    # Check if API is available
    try:
        response = requests.get(f"{API_URL}/health", timeout=2)
        if response.status_code == 200:
            print("✓ API server is running\n")

            # Run examples that don't require input files
            example_health_check()
            example_get_presets()

            # Uncomment these if you have input images:
            # example_process_image()
            # example_remove_background()
            # example_create_mockup()
            # example_batch_process()

        else:
            print("✗ API server returned unexpected status\n")

    except requests.exceptions.ConnectionError:
        print("✗ Cannot connect to API server")
        print("  Please start the server with: python api_server.py\n")
    except Exception as e:
        print(f"✗ Error: {e}\n")

    print("Examples completed!")
