from PIL import Image, ImageDraw, ImageFilter
import numpy as np

# Load original rendered physical map
im = Image.open('frontend/public/uttarakhand_physical_map.png').convert('RGBA')
w, h = im.size

# Flood fill outer white background from corners and edges
points = [
    (0, 0), (w-1, 0), (0, h-1), (w-1, h-1),
    (w//2, 0), (w//2, h-1), (0, h//2), (w-1, h//2),
    (10, 10), (w-10, 10), (10, h-10), (w-10, h-10)
]

for pt in points:
    ImageDraw.floodfill(im, pt, (0, 0, 0, 0), thresh=25)

# Alpha channel now has 0 outside and 255 inside Uttarakhand
data = np.array(im)
alpha = data[:, :, 3]

# Create boundary glow
uk_mask = Image.fromarray(alpha, 'L')
# Dilate border
dilated = uk_mask.filter(ImageFilter.MaxFilter(7))
border = np.array(dilated) - np.array(uk_mask)

glow1 = Image.fromarray(border).filter(ImageFilter.GaussianBlur(3))
glow2 = Image.fromarray(border).filter(ImageFilter.GaussianBlur(12))

g1 = np.array(glow1) / 255.0
g2 = np.array(glow2) / 255.0
glow_strength = np.clip(g1 * 1.0 + g2 * 0.7, 0, 1)

# Apply glowing border
outside = (alpha == 0)
for c, col in enumerate([56, 189, 248]): # Cyan #38bdf8
    data[outside, c] = (col * glow_strength[outside]).astype(np.uint8)

data[outside, 3] = (glow_strength[outside] * 240).astype(np.uint8)

# Create final image
result = Image.fromarray(data, 'RGBA')
# Resize to standard 1470 x 1230
result_1470 = result.resize((1470, 1230), Image.Resampling.LANCZOS)
result_1470.save('frontend/public/uttarakhand_physical_map_glowing.png', optimize=True)

print("Saved glowing physical map of Uttarakhand!")
print("Alpha at (0,0):", result_1470.getpixel((0,0))[3])
print("Alpha at center:", result_1470.getpixel((750, 575))[3])
