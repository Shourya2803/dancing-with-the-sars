from PIL import Image, ImageFilter, ImageDraw
import numpy as np

# Load the rendered physical map
im = Image.open('frontend/public/uttarakhand_physical_map.png').convert('RGBA')
w, h = im.size

# We can flood fill the corners with transparent (0, 0, 0, 0)
# Make a copy for flood filling
mask_im = Image.new('L', (w, h), 0)
draw = ImageDraw.Draw(mask_im)

# Sample image data
data = np.array(im)
r, g, b = data[:, :, 0], data[:, :, 1], data[:, :, 2]
is_white = (r >= 250) & (g >= 250) & (b >= 250)
white_img = Image.fromarray((is_white * 255).astype(np.uint8), 'L')

# Flood fill from the corners on white_img
ImageDraw.floodfill(white_img, (0, 0), 128, thresh=10)
ImageDraw.floodfill(white_img, (w-1, 0), 128, thresh=10)
ImageDraw.floodfill(white_img, (0, h-1), 128, thresh=10)
ImageDraw.floodfill(white_img, (w-1, h-1), 128, thresh=10)

# Outside mask is where value == 128
filled_arr = np.array(white_img)
outside_mask = (filled_arr == 128)

# Create transparent image for Uttarakhand
final_arr = data.copy()
final_arr[outside_mask, 3] = 0

# Binary mask of Uttarakhand
uk_binary = Image.fromarray(((~outside_mask) * 255).astype(np.uint8), 'L')

# Dilate slightly for glowing border
uk_dilated = uk_binary.filter(ImageFilter.MaxFilter(9))
border_mask = np.array(uk_dilated) - np.array(uk_binary)

glow1 = Image.fromarray(border_mask).filter(ImageFilter.GaussianBlur(3))
glow2 = Image.fromarray(border_mask).filter(ImageFilter.GaussianBlur(10))

g1_arr = np.array(glow1) / 255.0
g2_arr = np.array(glow2) / 255.0
glow_strength = np.clip(g1_arr * 0.95 + g2_arr * 0.65, 0, 1)

# Apply cyan/sky-blue border glow outside
for c, val in enumerate([56, 189, 248]): # cyan RGB: #38bdf8
    final_arr[outside_mask, c] = (val * glow_strength[outside_mask]).astype(np.uint8)

final_arr[outside_mask, 3] = (glow_strength[outside_mask] * 230).astype(np.uint8)

final_img = Image.fromarray(final_arr, 'RGBA')
final_img_1470 = final_img.resize((1470, 1230), Image.Resampling.LANCZOS)
out_path = 'frontend/public/uttarakhand_physical_map_glowing.png'
final_img_1470.save(out_path, optimize=True)

print(f"Successfully generated glowing physical map: {out_path} ({final_img_1470.size})")
