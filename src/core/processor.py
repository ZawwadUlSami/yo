"""Main image processor orchestrating all operations"""

import os
from typing import Optional, Tuple, Union
from pathlib import Path
from PIL import Image

from .background_remover import BackgroundRemover
from .enhancer import ImageEnhancer
from .background_generator import BackgroundGenerator


class ImageProcessor:
    """Main processor for e-commerce product photography"""

    def __init__(self):
        """Initialize image processor with all components"""
        self.bg_remover = BackgroundRemover()
        self.enhancer = ImageEnhancer()
        self.bg_generator = BackgroundGenerator()

    def process_product_image(
        self,
        input_path: Union[str, Path],
        output_path: Union[str, Path],
        remove_bg: bool = True,
        enhance: bool = True,
        background_style: Optional[str] = None,
        background_color: Optional[Tuple[int, int, int]] = None,
        optimize: bool = True,
        max_size: Tuple[int, int] = (2000, 2000)
    ) -> str:
        """
        Process a product image with all enhancements

        Args:
            input_path: Path to input image
            output_path: Path to save output image
            remove_bg: Remove background
            enhance: Enhance image quality
            background_style: Background preset ('professional', 'warm', 'cool', 'luxury', 'vibrant', 'studio_white')
            background_color: Solid background color RGB tuple
            optimize: Optimize for web
            max_size: Maximum output dimensions

        Returns:
            Path to output image
        """
        # Load image
        image = Image.open(input_path)

        # Remove background if requested
        if remove_bg:
            image = self.bg_remover.remove_background(image)

        # Enhance image if requested
        if enhance:
            image = self.enhancer.auto_enhance(image)
            image = self.enhancer.adjust_white_balance(image)

        # Add new background if specified
        if background_style or background_color:
            if image.mode != 'RGBA':
                # If no transparency, we can't composite properly
                pass
            else:
                # Create background
                if background_color:
                    bg = self.bg_generator.create_solid_background(image.size, background_color)
                elif background_style == 'studio_white':
                    bg = self.bg_generator.create_studio_background(image.size, 'white')
                elif background_style:
                    bg = self.bg_generator.create_preset_background(image.size, background_style)
                else:
                    bg = self.bg_generator.create_solid_background(image.size)

                # Composite product onto background
                image = self.bg_generator.add_product_to_background(image, bg, add_shadow=True)

        # Optimize for web if requested
        if optimize:
            image = self.enhancer.optimize_for_web(image, max_size)

        # Ensure output directory exists
        output_path = Path(output_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)

        # Save image
        if output_path.suffix.lower() in ['.jpg', '.jpeg']:
            # Convert RGBA to RGB for JPEG
            if image.mode == 'RGBA':
                rgb_image = Image.new('RGB', image.size, (255, 255, 255))
                rgb_image.paste(image, mask=image.split()[3])
                image = rgb_image
            image.save(output_path, 'JPEG', quality=95, optimize=True)
        else:
            image.save(output_path, optimize=True)

        return str(output_path)

    def batch_process(
        self,
        input_dir: Union[str, Path],
        output_dir: Union[str, Path],
        **kwargs
    ) -> list[str]:
        """
        Batch process multiple images

        Args:
            input_dir: Directory containing input images
            output_dir: Directory to save output images
            **kwargs: Arguments passed to process_product_image

        Returns:
            List of output file paths
        """
        input_dir = Path(input_dir)
        output_dir = Path(output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)

        # Supported image formats
        image_extensions = {'.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff'}

        output_paths = []

        # Process each image
        for img_path in input_dir.iterdir():
            if img_path.suffix.lower() in image_extensions:
                output_path = output_dir / img_path.name

                try:
                    result = self.process_product_image(
                        img_path,
                        output_path,
                        **kwargs
                    )
                    output_paths.append(result)
                except Exception as e:
                    print(f"Error processing {img_path}: {e}")

        return output_paths

    def quick_background_removal(self, input_path: Union[str, Path], output_path: Union[str, Path]) -> str:
        """
        Quick background removal without enhancements

        Args:
            input_path: Path to input image
            output_path: Path to save output image

        Returns:
            Path to output image
        """
        image = Image.open(input_path)
        result = self.bg_remover.remove_background(image)

        output_path = Path(output_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)

        result.save(output_path)
        return str(output_path)

    def create_product_mockup(
        self,
        input_path: Union[str, Path],
        output_path: Union[str, Path],
        background_preset: str = 'professional',
        add_shadow: bool = True,
        scale: float = 0.8
    ) -> str:
        """
        Create a professional product mockup

        Args:
            input_path: Path to product image
            output_path: Path to save mockup
            background_preset: Background style preset
            add_shadow: Add drop shadow
            scale: Product scale (0.0-1.0)

        Returns:
            Path to output mockup
        """
        # Load and remove background
        image = Image.open(input_path)
        product = self.bg_remover.remove_background(image)

        # Enhance
        product = self.enhancer.auto_enhance(product)

        # Determine output size
        output_size = (2000, 2000)

        # Create background
        background = self.bg_generator.create_preset_background(output_size, background_preset)

        # Composite
        result = self.bg_generator.add_product_to_background(
            product,
            background,
            scale=scale,
            add_shadow=add_shadow
        )

        # Save
        output_path = Path(output_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        result.save(output_path, quality=95)

        return str(output_path)
