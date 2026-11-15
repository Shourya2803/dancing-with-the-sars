import pymupdf

# Open the SVG
doc = pymupdf.open('frontend/public/uttarakhand_physical_relief.svg')
page = doc[0]

# Render to 1470 x 1230 pixmap (2x or 3x scale)
zoom = 1470 / page.rect.width
mat = pymupdf.Matrix(zoom, zoom)
pix = page.get_pixmap(matrix=mat, alpha=True)

out_path = 'frontend/public/uttarakhand_physical_map.png'
pix.save(out_path)
print(f"Rendered physical map to {out_path} with size {pix.width}x{pix.height}!")
