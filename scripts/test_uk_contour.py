from PIL import Image, ImageDraw

img = Image.open('frontend/public/india_3d_relief_hd.png').convert('RGBA')
draw = ImageDraw.Draw(img)

# Detailed, authentic boundary of Uttarakhand on this 3D relief:
# Following the actual mountain ridge and valleys:
uk_detailed_poly = [
    (535, 240), # NW corner (Govind Pashu Vihar / Himachal border)
    (555, 232), # Upper Yamunotri ridge
    (585, 235), # Gangotri / Kedarnath Himalayan crest
    (615, 248), # Nanda Devi / Badrinath crest
    (638, 262), # Lipulekh / Kalapani / Nepal-Tibet trijunction
    (632, 290), # Dharchula / Mahakali river along Nepal border
    (626, 322), # Champawat / Tanakpur
    (618, 342), # Banbasa / SE corner (Udham Singh Nagar)
    (585, 335), # Haldwani / Kashipur / UP border foothills
    (550, 320), # Ramnagar / Corbett Shivaliks
    (525, 308), # Haridwar / Roorkee border
    (510, 295), # Dehradun / Paonta Sahib / Yamuna river
    (518, 268), # Chakrata / Tons valley
    (535, 240)  # Close
]

draw.polygon(uk_detailed_poly, outline=(56, 189, 248, 255), fill=(56, 189, 248, 55), width=3)
img.save('frontend/public/test_uk_fine_contour.png')
print("Detailed polygon drawn and saved to test_uk_fine_contour.png!")
