from PIL import Image, ImageDraw

img = Image.open('frontend/public/india_3d_relief_transparent.png')
w, h = img.size
print(f"Dimensions: {w} x {h}")

# In this 508x445 image:
# J&K / Ladakh top: (150, 40)
# Himachal: (170, 75)
# Uttarakhand is between Himachal and Nepal border: around (195, 95)
# Let's verify pixel colors around (195, 95)
draw = ImageDraw.Draw(img)
# Draw a test marker around (195, 95)
draw.ellipse([(185, 85), (205, 105)], outline='red', width=2)
img.save('frontend/public/test_uk_marker.png')
print("Saved test marker at (195, 95)")
