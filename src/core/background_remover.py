"""Background removal using AI models"""

import io
from typing import Union
from PIL import Image
import numpy as np
from rembg import remove


class BackgroundRemover:
    """Remove backgrounds from product images using AI"""

    def __init__(self, model_name: str = "u2net"):
        """
        Initialize background remover

        Args:
            model_name: Model to use for background removal (u2net, u2netp, u2net_human_seg, etc.)
        """
        self.model_name = model_name

    def remove_background(self, image: Union[Image.Image, str, bytes]) -> Image.Image:
        """
        Remove background from an image

        Args:
            image: PIL Image, file path, or bytes

        Returns:
            PIL Image with transparent background
        """
        # Load image if it's a path
        if isinstance(image, str):
            image = Image.open(image)
        elif isinstance(image, bytes):
            image = Image.open(io.BytesIO(image))

        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')

        # Remove background
        output = remove(image, model_name=self.model_name)

        return output

    def remove_background_with_mask(self, image: Union[Image.Image, str]) -> tuple[Image.Image, Image.Image]:
        """
        Remove background and return both the result and mask

        Args:
            image: PIL Image or file path

        Returns:
            Tuple of (image with transparent background, mask)
        """
        if isinstance(image, str):
            image = Image.open(image)

        # Remove background
        output = self.remove_background(image)

        # Extract mask from alpha channel
        if output.mode == 'RGBA':
            mask = output.split()[-1]
        else:
            # If no alpha channel, create a mask
            mask = Image.new('L', output.size, 255)

        return output, mask

    def refine_edges(self, image: Image.Image, feather: int = 2) -> Image.Image:
        """
        Refine edges of transparent image with feathering

        Args:
            image: PIL Image with alpha channel
            feather: Number of pixels to feather the edges

        Returns:
            PIL Image with refined edges
        """
        if image.mode != 'RGBA':
            return image

        # Get the alpha channel
        alpha = np.array(image.split()[-1])

        # Apply Gaussian blur to soften edges
        from scipy.ndimage import gaussian_filter
        alpha_smooth = gaussian_filter(alpha.astype(float), sigma=feather)

        # Create new image with smoothed alpha
        result = image.copy()
        result.putalpha(Image.fromarray(alpha_smooth.astype(np.uint8)))

        return result
