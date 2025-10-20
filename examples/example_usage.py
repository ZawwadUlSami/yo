"""Example usage of the AI Product Photography Tool"""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.core.processor import ImageProcessor
from src.core.background_remover import BackgroundRemover
from src.core.enhancer import ImageEnhancer
from src.core.background_generator import BackgroundGenerator


def example_basic_processing():
    """Basic image processing example"""
    print("Example 1: Basic Image Processing")
    print("-" * 50)

    processor = ImageProcessor()

    # Process a single image
    result = processor.process_product_image(
        input_path="input/product.jpg",
        output_path="output/processed_product.png",
        remove_bg=True,
        enhance=True,
        background_style="professional"
    )

    print(f"Processed image saved to: {result}\n")


def example_background_removal():
    """Background removal only"""
    print("Example 2: Quick Background Removal")
    print("-" * 50)

    remover = BackgroundRemover()

    from PIL import Image
    image = Image.open("input/product.jpg")

    # Remove background
    result = remover.remove_background(image)

    result.save("output/no_background.png")
    print("Background removed successfully!\n")


def example_custom_background():
    """Custom background creation"""
    print("Example 3: Custom Background")
    print("-" * 50)

    processor = ImageProcessor()

    # Add custom solid color background
    result = processor.process_product_image(
        input_path="input/product.jpg",
        output_path="output/custom_bg.jpg",
        remove_bg=True,
        enhance=True,
        background_color=(240, 248, 255)  # Light blue
    )

    print(f"Custom background applied: {result}\n")


def example_mockup_creation():
    """Create professional mockup"""
    print("Example 4: Professional Mockup")
    print("-" * 50)

    processor = ImageProcessor()

    # Create mockup with different presets
    presets = ["professional", "luxury", "vibrant"]

    for preset in presets:
        result = processor.create_product_mockup(
            input_path="input/product.jpg",
            output_path=f"output/mockup_{preset}.jpg",
            background_preset=preset,
            add_shadow=True,
            scale=0.8
        )
        print(f"Mockup created with {preset} preset: {result}")

    print()


def example_batch_processing():
    """Batch process multiple images"""
    print("Example 5: Batch Processing")
    print("-" * 50)

    processor = ImageProcessor()

    # Process all images in a directory
    results = processor.batch_process(
        input_dir="input/",
        output_dir="output/batch/",
        remove_bg=True,
        enhance=True,
        background_style="professional"
    )

    print(f"Processed {len(results)} images")
    for result in results:
        print(f"  - {result}")

    print()


def example_advanced_enhancement():
    """Advanced image enhancement"""
    print("Example 6: Advanced Enhancement")
    print("-" * 50)

    from PIL import Image

    enhancer = ImageEnhancer()

    image = Image.open("input/product.jpg")

    # Apply various enhancements
    enhanced = enhancer.auto_enhance(image, enhance_level=1.3)
    enhanced = enhancer.adjust_white_balance(enhanced)
    enhanced = enhancer.sharpen(enhanced, amount=1.5)

    enhanced.save("output/enhanced.jpg", quality=95)
    print("Advanced enhancement completed!\n")


def example_background_styles():
    """Demonstrate all background styles"""
    print("Example 7: All Background Styles")
    print("-" * 50)

    from PIL import Image

    bg_generator = BackgroundGenerator()

    size = (800, 800)

    # Create different background styles
    styles = {
        "solid_white": bg_generator.create_solid_background(size, (255, 255, 255)),
        "gradient_professional": bg_generator.create_preset_background(size, "professional"),
        "gradient_warm": bg_generator.create_preset_background(size, "warm"),
        "gradient_cool": bg_generator.create_preset_background(size, "cool"),
        "gradient_luxury": bg_generator.create_preset_background(size, "luxury"),
        "studio_white": bg_generator.create_studio_background(size, "white"),
        "blurred": bg_generator.create_blurred_background(size, (200, 220, 255)),
    }

    for name, bg in styles.items():
        bg.save(f"output/bg_{name}.jpg", quality=95)
        print(f"Created {name} background")

    print()


if __name__ == "__main__":
    print("\n" + "=" * 50)
    print("AI Product Photography Tool - Examples")
    print("=" * 50 + "\n")

    # Create output directory if it doesn't exist
    from pathlib import Path
    Path("output").mkdir(exist_ok=True)
    Path("output/batch").mkdir(exist_ok=True)

    # Run examples (comment out if you don't have input images)
    print("Note: These examples assume you have images in 'input/' directory\n")

    # Uncomment the examples you want to run:
    # example_basic_processing()
    # example_background_removal()
    # example_custom_background()
    # example_mockup_creation()
    # example_batch_processing()
    # example_advanced_enhancement()
    example_background_styles()  # This one doesn't require input images

    print("Examples completed!")
