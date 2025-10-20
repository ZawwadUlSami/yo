"""AI-powered background generation for product images"""

from typing import Tuple, Optional
from PIL import Image, ImageDraw, ImageFilter
import numpy as np
import random


class BackgroundGenerator:
    """Generate professional backgrounds for product images"""

    def __init__(self):
        """Initialize background generator"""
        self.gradient_presets = {
            'professional': [(240, 240, 245), (255, 255, 255)],
            'warm': [(255, 250, 240), (255, 240, 220)],
            'cool': [(240, 248, 255), (230, 240, 255)],
            'luxury': [(20, 20, 30), (40, 40, 50)],
            'vibrant': [(255, 240, 245), (240, 255, 250)],
        }

    def create_solid_background(self, size: Tuple[int, int], color: Tuple[int, int, int] = (255, 255, 255)) -> Image.Image:
        """
        Create a solid color background

        Args:
            size: (width, height)
            color: RGB color tuple

        Returns:
            PIL Image with solid background
        """
        return Image.new('RGB', size, color)

    def create_gradient_background(
        self,
        size: Tuple[int, int],
        color1: Tuple[int, int, int],
        color2: Tuple[int, int, int],
        direction: str = 'vertical'
    ) -> Image.Image:
        """
        Create a gradient background

        Args:
            size: (width, height)
            color1: Starting RGB color
            color2: Ending RGB color
            direction: 'vertical', 'horizontal', or 'diagonal'

        Returns:
            PIL Image with gradient background
        """
        width, height = size
        gradient = Image.new('RGB', size)

        draw = ImageDraw.Draw(gradient)

        if direction == 'vertical':
            for y in range(height):
                r = int(color1[0] + (color2[0] - color1[0]) * y / height)
                g = int(color1[1] + (color2[1] - color1[1]) * y / height)
                b = int(color1[2] + (color2[2] - color1[2]) * y / height)
                draw.line([(0, y), (width, y)], fill=(r, g, b))

        elif direction == 'horizontal':
            for x in range(width):
                r = int(color1[0] + (color2[0] - color1[0]) * x / width)
                g = int(color1[1] + (color2[1] - color1[1]) * x / width)
                b = int(color1[2] + (color2[2] - color1[2]) * x / width)
                draw.line([(x, 0), (x, height)], fill=(r, g, b))

        elif direction == 'diagonal':
            for i in range(max(width, height) * 2):
                progress = i / (max(width, height) * 2)
                r = int(color1[0] + (color2[0] - color1[0]) * progress)
                g = int(color1[1] + (color2[1] - color1[1]) * progress)
                b = int(color1[2] + (color2[2] - color1[2]) * progress)
                draw.line([(i, 0), (0, i)], fill=(r, g, b), width=3)

        return gradient

    def create_preset_background(self, size: Tuple[int, int], preset: str = 'professional') -> Image.Image:
        """
        Create a background from preset

        Args:
            size: (width, height)
            preset: 'professional', 'warm', 'cool', 'luxury', 'vibrant'

        Returns:
            PIL Image with preset background
        """
        if preset not in self.gradient_presets:
            preset = 'professional'

        colors = self.gradient_presets[preset]
        return self.create_gradient_background(size, colors[0], colors[1], 'vertical')

    def create_blurred_background(self, size: Tuple[int, int], base_color: Tuple[int, int, int], blur_radius: int = 50) -> Image.Image:
        """
        Create a soft blurred background with color variations

        Args:
            size: (width, height)
            base_color: Base RGB color
            blur_radius: Blur intensity

        Returns:
            PIL Image with blurred background
        """
        width, height = size

        # Create base image
        img = Image.new('RGB', size, base_color)
        draw = ImageDraw.Draw(img)

        # Add some random colored circles for variation
        for _ in range(5):
            x = random.randint(0, width)
            y = random.randint(0, height)
            radius = random.randint(width // 4, width // 2)

            # Vary the color slightly
            color_var = tuple(max(0, min(255, c + random.randint(-30, 30))) for c in base_color)

            draw.ellipse([x - radius, y - radius, x + radius, y + radius], fill=color_var)

        # Apply strong blur
        img = img.filter(ImageFilter.GaussianBlur(blur_radius))

        return img

    def add_product_to_background(
        self,
        product: Image.Image,
        background: Image.Image,
        position: Optional[Tuple[int, int]] = None,
        scale: float = 1.0,
        add_shadow: bool = True
    ) -> Image.Image:
        """
        Composite product image onto background

        Args:
            product: Product image with transparent background (RGBA)
            background: Background image (RGB)
            position: (x, y) position to place product (None = center)
            scale: Scale factor for product
            add_shadow: Whether to add drop shadow

        Returns:
            Composite PIL Image
        """
        # Resize product if scale != 1.0
        if scale != 1.0:
            new_size = (int(product.width * scale), int(product.height * scale))
            product = product.resize(new_size, Image.Resampling.LANCZOS)

        # Calculate position
        if position is None:
            x = (background.width - product.width) // 2
            y = (background.height - product.height) // 2
        else:
            x, y = position

        # Create result
        result = background.copy()

        # Add shadow if requested
        if add_shadow and product.mode == 'RGBA':
            shadow = self._create_shadow(product, offset=(10, 10), blur=20)
            result.paste(shadow, (x + 10, y + 10), shadow)

        # Paste product
        if product.mode == 'RGBA':
            result.paste(product, (x, y), product)
        else:
            result.paste(product, (x, y))

        return result

    def _create_shadow(self, image: Image.Image, offset: Tuple[int, int] = (5, 5), blur: int = 15, opacity: int = 128) -> Image.Image:
        """
        Create drop shadow for product

        Args:
            image: Product image with alpha channel
            offset: Shadow offset (x, y)
            blur: Shadow blur radius
            opacity: Shadow opacity (0-255)

        Returns:
            Shadow image
        """
        # Create shadow from alpha channel
        if image.mode != 'RGBA':
            return image

        # Extract alpha channel
        alpha = image.split()[3]

        # Create shadow image
        shadow = Image.new('RGBA', image.size, (0, 0, 0, 0))
        shadow.putalpha(alpha)

        # Apply blur
        shadow = shadow.filter(ImageFilter.GaussianBlur(blur))

        # Adjust opacity
        alpha = shadow.split()[3]
        alpha = alpha.point(lambda p: int(p * opacity / 255))
        shadow.putalpha(alpha)

        return shadow

    def create_studio_background(self, size: Tuple[int, int], style: str = 'white') -> Image.Image:
        """
        Create professional studio-style background

        Args:
            size: (width, height)
            style: 'white', 'gray', 'black'

        Returns:
            Studio background image
        """
        styles = {
            'white': (255, 255, 255),
            'gray': (200, 200, 200),
            'black': (30, 30, 30),
        }

        base_color = styles.get(style, (255, 255, 255))

        # Create gradient for depth
        lighter = tuple(min(255, c + 20) for c in base_color)
        return self.create_gradient_background(size, lighter, base_color, 'vertical')
