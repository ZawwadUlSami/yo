"""Image enhancement and optimization"""

from typing import Tuple, Optional
from PIL import Image, ImageEnhance, ImageFilter
import numpy as np
from skimage import exposure


class ImageEnhancer:
    """Enhance and optimize product images"""

    def __init__(self):
        """Initialize image enhancer"""
        pass

    def auto_enhance(self, image: Image.Image, enhance_level: float = 1.2) -> Image.Image:
        """
        Automatically enhance image (brightness, contrast, sharpness, color)

        Args:
            image: PIL Image
            enhance_level: Enhancement multiplier (1.0 = no change)

        Returns:
            Enhanced PIL Image
        """
        # Convert to RGB if needed
        if image.mode == 'RGBA':
            # Process RGB and alpha separately
            rgb = Image.new('RGB', image.size, (255, 255, 255))
            rgb.paste(image, mask=image.split()[3])
            alpha = image.split()[3]
            process_alpha = True
        else:
            rgb = image.convert('RGB')
            process_alpha = False

        # Enhance contrast
        enhancer = ImageEnhance.Contrast(rgb)
        rgb = enhancer.enhance(enhance_level * 0.9)

        # Enhance color
        enhancer = ImageEnhance.Color(rgb)
        rgb = enhancer.enhance(enhance_level * 1.1)

        # Enhance sharpness
        enhancer = ImageEnhance.Sharpness(rgb)
        rgb = enhancer.enhance(enhance_level * 1.2)

        # Enhance brightness slightly
        enhancer = ImageEnhance.Brightness(rgb)
        rgb = enhancer.enhance(1.0 + (enhance_level - 1.0) * 0.3)

        if process_alpha:
            rgb.putalpha(alpha)
            return rgb

        return rgb

    def adjust_white_balance(self, image: Image.Image) -> Image.Image:
        """
        Automatically adjust white balance

        Args:
            image: PIL Image

        Returns:
            White-balanced PIL Image
        """
        # Convert to numpy array
        img_array = np.array(image)

        # Handle RGBA images
        if img_array.shape[-1] == 4:
            alpha = img_array[:, :, 3]
            img_array = img_array[:, :, :3]
            has_alpha = True
        else:
            has_alpha = False

        # Calculate mean values for each channel
        mean_r = np.mean(img_array[:, :, 0])
        mean_g = np.mean(img_array[:, :, 1])
        mean_b = np.mean(img_array[:, :, 2])

        # Calculate adjustment factors
        mean_gray = (mean_r + mean_g + mean_b) / 3

        scale_r = mean_gray / mean_r if mean_r > 0 else 1.0
        scale_g = mean_gray / mean_g if mean_g > 0 else 1.0
        scale_b = mean_gray / mean_b if mean_b > 0 else 1.0

        # Apply adjustments
        img_array = img_array.astype(np.float32)
        img_array[:, :, 0] = np.clip(img_array[:, :, 0] * scale_r, 0, 255)
        img_array[:, :, 1] = np.clip(img_array[:, :, 1] * scale_g, 0, 255)
        img_array[:, :, 2] = np.clip(img_array[:, :, 2] * scale_b, 0, 255)

        img_array = img_array.astype(np.uint8)

        # Restore alpha channel if present
        if has_alpha:
            img_array = np.dstack([img_array, alpha])

        return Image.fromarray(img_array)

    def sharpen(self, image: Image.Image, amount: float = 1.5) -> Image.Image:
        """
        Sharpen image

        Args:
            image: PIL Image
            amount: Sharpness amount

        Returns:
            Sharpened PIL Image
        """
        enhancer = ImageEnhance.Sharpness(image)
        return enhancer.enhance(amount)

    def remove_noise(self, image: Image.Image) -> Image.Image:
        """
        Remove noise from image

        Args:
            image: PIL Image

        Returns:
            Denoised PIL Image
        """
        return image.filter(ImageFilter.MedianFilter(size=3))

    def optimize_for_web(self, image: Image.Image, max_size: Tuple[int, int] = (2000, 2000)) -> Image.Image:
        """
        Optimize image for web display

        Args:
            image: PIL Image
            max_size: Maximum dimensions (width, height)

        Returns:
            Optimized PIL Image
        """
        # Resize if needed
        if image.size[0] > max_size[0] or image.size[1] > max_size[1]:
            image.thumbnail(max_size, Image.Resampling.LANCZOS)

        return image

    def adjust_exposure(self, image: Image.Image, gamma: float = 1.0) -> Image.Image:
        """
        Adjust image exposure using gamma correction

        Args:
            image: PIL Image
            gamma: Gamma value (< 1 brightens, > 1 darkens)

        Returns:
            Exposure-adjusted PIL Image
        """
        img_array = np.array(image)

        # Handle RGBA
        if img_array.shape[-1] == 4:
            alpha = img_array[:, :, 3]
            img_array = img_array[:, :, :3]
            has_alpha = True
        else:
            has_alpha = False

        # Apply gamma correction
        img_array = exposure.adjust_gamma(img_array, gamma)

        # Restore alpha
        if has_alpha:
            img_array = np.dstack([img_array, alpha])

        return Image.fromarray((img_array * 255).astype(np.uint8))
