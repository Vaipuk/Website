"""Generate the committed social card using the site's palette and local fonts."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

public = Path(__file__).resolve().parents[1] / "public"
fonts = Path("C:/Windows/Fonts")
canvas = Image.new("RGB", (1200, 630), "#0a0806")
draw = ImageDraw.Draw(canvas)
mono = ImageFont.truetype(str(fonts / "consola.ttf"), 20)
display = ImageFont.truetype(str(fonts / "georgia.ttf"), 112)
italic = ImageFont.truetype(str(fonts / "georgiai.ttf"), 112)
body = ImageFont.truetype(str(fonts / "georgia.ttf"), 28)
draw.line((72, 74, 1128, 74), fill="#44352b", width=1)
draw.text((72, 104), "DESIGN, DATA & CODE", font=mono, fill="#f0855a")
draw.text((66, 190), "Vaibhav", font=display, fill="#f4ece0")
draw.text((66, 302), "Bharadwaj", font=italic, fill="#f0855a")
draw.text((72, 477), "Software, photography, and things worth exploring.", font=body, fill="#f4ece0")
draw.text((72, 560), "vaipuk.com", font=mono, fill="#b8ada0")
canvas.save(public / "social-preview.png", optimize=True)
assert Image.open(public / "social-preview.png").size == (1200, 630)
print("Social preview generated and checked.")
