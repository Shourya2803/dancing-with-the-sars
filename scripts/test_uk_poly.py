from PIL import Image, ImageDraw

img = Image.open('frontend/public/india_3d_relief_hd.png').convert('RGBA')
draw = ImageDraw.Draw(img)

# Uttarakhand polygon
pts = [(525, 240), (580, 215), (635, 245), (650, 300), (610, 345), (535, 320), (515, 275)]
draw.polygon(pts, outline='cyan', fill=(14, 165, 233, 90))
img.save('frontend/public/test_uk_poly.png')
print("Saved test polygon check at frontend/public/test_uk_poly.png")
