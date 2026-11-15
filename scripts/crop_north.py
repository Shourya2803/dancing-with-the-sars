from PIL import Image, ImageDraw

img = Image.open('frontend/public/india_3d_relief_hd.png').convert('RGBA')

# Crop the northern region: X: 400 to 750, Y: 100 to 450
crop = img.crop((400, 100, 750, 450))
crop.save('frontend/public/north_crop.png')
print("Cropped northern region saved to frontend/public/north_crop.png")
