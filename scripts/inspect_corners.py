from PIL import Image

im = Image.open('frontend/public/uttarakhand_physical_map.png')
w, h = im.size

print("Corners:")
print("Top-left (50, 50):", im.getpixel((50, 50)))
print("Bottom-left (50, 1150):", im.getpixel((50, 1150)))
print("Top-right (1400, 50):", im.getpixel((1400, 50)))
print("Bottom-right (1400, 1150):", im.getpixel((1400, 1150)))

print("Inside Uttarakhand:")
print("Chamoli (750, 575):", im.getpixel((750, 575)))
print("Dehradun (275, 450):", im.getpixel((275, 450)))
print("Pithoragarh (1025, 600):", im.getpixel((1025, 600)))
