"""Regenerate lightweight gallery previews from the checked-in originals (Pillow)."""
from pathlib import Path
from PIL import Image, ImageOps

public = Path(__file__).resolve().parents[1] / "public"
for original in (public / "trips").glob("*/*"):
    if original.suffix.lower() not in {".jpg", ".jpeg", ".png"}:
        continue
    target = public / "thumbnails" / original.relative_to(public).with_suffix(".webp")
    target.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(original) as source:
        preview = ImageOps.exif_transpose(source).convert("RGB")
        preview.thumbnail((960, 960))
        preview.save(target, "WEBP", quality=78, method=6)
    with Image.open(target) as saved:
        assert max(saved.size) <= 960 and target.stat().st_size > 0
print("Gallery thumbnails generated and checked.")
