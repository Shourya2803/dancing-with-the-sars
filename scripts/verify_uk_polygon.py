from PIL import Image, ImageDraw

img = Image.open('frontend/public/india_3d_relief_hd.png').convert('RGBA')
draw = ImageDraw.Draw(img)

# Let's inspect the exact pixel bounds of Uttarakhand on the image
# In india_3d_relief_hd.png:
# Northern tip of India (Kashmir): X ~ 450, Y ~ 120
# Himachal Pradesh: X ~ 480-530, Y ~ 240-300
# Uttarakhand:
# North (Himalayan border): around (540, 240) to (630, 260)
# East (Nepal border): around (630, 260) to (630, 335)
# South (Terai / UP plains): around (630, 335) to (530, 335)
# West (Yamuna / Himachal border): around (530, 335) to (540, 240)
uk_poly = [
    (535, 245),
    (585, 230),
    (630, 265),
    (635, 330),
    (595, 345),
    (530, 325),
    (525, 275)
]

draw.polygon(uk_poly, outline=(56, 189, 248, 255), fill=(56, 189, 248, 70), width=3)
img.save('frontend/public/test_uk_accurate.png')
print("Saved accurate Uttarakhand polygon check!")
