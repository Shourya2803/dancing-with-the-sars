from PIL import Image, ImageFilter

img = Image.open('frontend/public/india_3d_relief_transparent.png')
w, h = img.size

# Upscale 3x with high-quality Lanczos resampling
hd_w, hd_h = w * 3, h * 3
hd_img = img.resize((hd_w, hd_h), Image.Resampling.LANCZOS)

# Subtle unsharp mask for crisp topographic ridges
sharp_img = hd_img.filter(ImageFilter.UnsharpMask(radius=1.5, percent=120, threshold=3))

sharp_img.save('frontend/public/india_3d_relief_hd.png', optimize=True)
print(f"Generated HD 3D relief: {hd_w} x {hd_h} px")
