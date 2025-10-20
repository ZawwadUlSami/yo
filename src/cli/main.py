"""Command-line interface for AI Product Photography Tool"""

import click
from pathlib import Path
from rich.console import Console
from rich.progress import Progress, SpinnerColumn, TextColumn
from rich.table import Table
from rich import print as rprint

import sys
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from src.core.processor import ImageProcessor


console = Console()


@click.group()
@click.version_option(version='1.0.0')
def cli():
    """AI-Powered E-commerce Product Photography Tool

    Enhance your product images with AI-powered background removal,
    image enhancement, and professional backgrounds.
    """
    pass


@cli.command()
@click.argument('input_path', type=click.Path(exists=True))
@click.argument('output_path', type=click.Path())
@click.option('--remove-bg/--keep-bg', default=True, help='Remove background')
@click.option('--enhance/--no-enhance', default=True, help='Enhance image quality')
@click.option('--background', type=click.Choice(['professional', 'warm', 'cool', 'luxury', 'vibrant', 'studio_white']), help='Background style preset')
@click.option('--bg-color', type=str, help='Background color as R,G,B (e.g., 255,255,255)')
@click.option('--optimize/--no-optimize', default=True, help='Optimize for web')
@click.option('--max-width', type=int, default=2000, help='Maximum width')
@click.option('--max-height', type=int, default=2000, help='Maximum height')
def process(input_path, output_path, remove_bg, enhance, background, bg_color, optimize, max_width, max_height):
    """Process a single product image"""

    console.print(f"\n[bold blue]Processing:[/bold blue] {input_path}")

    # Parse background color
    background_color = None
    if bg_color:
        try:
            background_color = tuple(map(int, bg_color.split(',')))
            if len(background_color) != 3:
                raise ValueError
        except:
            console.print("[bold red]Error:[/bold red] Invalid color format. Use R,G,B (e.g., 255,255,255)")
            return

    processor = ImageProcessor()

    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        console=console
    ) as progress:
        task = progress.add_task("Processing image...", total=None)

        try:
            result = processor.process_product_image(
                input_path=input_path,
                output_path=output_path,
                remove_bg=remove_bg,
                enhance=enhance,
                background_style=background,
                background_color=background_color,
                optimize=optimize,
                max_size=(max_width, max_height)
            )

            progress.update(task, completed=True)
            console.print(f"[bold green]Success![/bold green] Saved to: {result}")

        except Exception as e:
            console.print(f"[bold red]Error:[/bold red] {str(e)}")


@cli.command()
@click.argument('input_dir', type=click.Path(exists=True, file_okay=False))
@click.argument('output_dir', type=click.Path())
@click.option('--remove-bg/--keep-bg', default=True, help='Remove background')
@click.option('--enhance/--no-enhance', default=True, help='Enhance image quality')
@click.option('--background', type=click.Choice(['professional', 'warm', 'cool', 'luxury', 'vibrant', 'studio_white']), help='Background style preset')
@click.option('--bg-color', type=str, help='Background color as R,G,B')
@click.option('--optimize/--no-optimize', default=True, help='Optimize for web')
def batch(input_dir, output_dir, remove_bg, enhance, background, bg_color, optimize):
    """Batch process multiple images from a directory"""

    console.print(f"\n[bold blue]Batch Processing:[/bold blue] {input_dir}")

    # Parse background color
    background_color = None
    if bg_color:
        try:
            background_color = tuple(map(int, bg_color.split(',')))
            if len(background_color) != 3:
                raise ValueError
        except:
            console.print("[bold red]Error:[/bold red] Invalid color format. Use R,G,B (e.g., 255,255,255)")
            return

    processor = ImageProcessor()

    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        console=console
    ) as progress:
        task = progress.add_task("Processing images...", total=None)

        try:
            results = processor.batch_process(
                input_dir=input_dir,
                output_dir=output_dir,
                remove_bg=remove_bg,
                enhance=enhance,
                background_style=background,
                background_color=background_color,
                optimize=optimize
            )

            progress.update(task, completed=True)
            console.print(f"[bold green]Success![/bold green] Processed {len(results)} images")
            console.print(f"Output directory: {output_dir}")

        except Exception as e:
            console.print(f"[bold red]Error:[/bold red] {str(e)}")


@cli.command()
@click.argument('input_path', type=click.Path(exists=True))
@click.argument('output_path', type=click.Path())
def remove_bg(input_path, output_path):
    """Quick background removal without enhancements"""

    console.print(f"\n[bold blue]Removing background:[/bold blue] {input_path}")

    processor = ImageProcessor()

    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        console=console
    ) as progress:
        task = progress.add_task("Removing background...", total=None)

        try:
            result = processor.quick_background_removal(input_path, output_path)
            progress.update(task, completed=True)
            console.print(f"[bold green]Success![/bold green] Saved to: {result}")

        except Exception as e:
            console.print(f"[bold red]Error:[/bold red] {str(e)}")


@cli.command()
@click.argument('input_path', type=click.Path(exists=True))
@click.argument('output_path', type=click.Path())
@click.option('--preset', type=click.Choice(['professional', 'warm', 'cool', 'luxury', 'vibrant']), default='professional', help='Background preset')
@click.option('--shadow/--no-shadow', default=True, help='Add drop shadow')
@click.option('--scale', type=float, default=0.8, help='Product scale (0.0-1.0)')
def mockup(input_path, output_path, preset, shadow, scale):
    """Create a professional product mockup"""

    console.print(f"\n[bold blue]Creating mockup:[/bold blue] {input_path}")

    processor = ImageProcessor()

    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        console=console
    ) as progress:
        task = progress.add_task("Creating mockup...", total=None)

        try:
            result = processor.create_product_mockup(
                input_path=input_path,
                output_path=output_path,
                background_preset=preset,
                add_shadow=shadow,
                scale=scale
            )
            progress.update(task, completed=True)
            console.print(f"[bold green]Success![/bold green] Saved to: {result}")

        except Exception as e:
            console.print(f"[bold red]Error:[/bold red] {str(e)}")


@cli.command()
def info():
    """Show tool information and available options"""

    table = Table(title="AI Product Photography Tool", show_header=True, header_style="bold magenta")
    table.add_column("Feature", style="cyan", width=30)
    table.add_column("Description", style="white")

    table.add_row("Background Removal", "AI-powered background removal using U2-Net")
    table.add_row("Image Enhancement", "Auto-enhance brightness, contrast, sharpness, and color")
    table.add_row("White Balance", "Automatic white balance adjustment")
    table.add_row("Background Styles", "Professional, warm, cool, luxury, vibrant presets")
    table.add_row("Custom Backgrounds", "Solid colors, gradients, and studio styles")
    table.add_row("Drop Shadows", "Realistic drop shadows for products")
    table.add_row("Web Optimization", "Optimize images for web use")
    table.add_row("Batch Processing", "Process multiple images at once")

    console.print(table)

    console.print("\n[bold]Available Commands:[/bold]")
    console.print("  [cyan]process[/cyan]   - Process a single image")
    console.print("  [cyan]batch[/cyan]     - Batch process multiple images")
    console.print("  [cyan]remove-bg[/cyan] - Quick background removal")
    console.print("  [cyan]mockup[/cyan]    - Create product mockup")
    console.print("  [cyan]info[/cyan]      - Show this information")

    console.print("\n[bold]Background Presets:[/bold]")
    console.print("  [cyan]professional[/cyan] - Clean, professional gradient")
    console.print("  [cyan]warm[/cyan]         - Warm tones for cozy products")
    console.print("  [cyan]cool[/cyan]         - Cool tones for tech products")
    console.print("  [cyan]luxury[/cyan]       - Dark, luxurious background")
    console.print("  [cyan]vibrant[/cyan]      - Vibrant, colorful background")
    console.print("  [cyan]studio_white[/cyan] - Classic studio white")


if __name__ == '__main__':
    cli()
