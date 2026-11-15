from PIL import Image
import numpy as np

img = Image.open('frontend/public/india_3d_relief_ref.jpg').convert('RGBA')
arr = np.array(img)

# In the user's reference image, the background is near white/light grey (e.g. R>240, G>240, B>240)
# Let's floodfill or mask out the outer white background cleanly.
r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]

# Pixels that are bright white background
is_white = (r > 235) & (g > 235) & (b > 235)

# Smooth alpha for feathering
alpha = np.ones_like(a, dtype=np.float32) * 255.0

# Calculate distance from white: brightness = min(r, g, b)
brightness = np.minimum(np.minimum(r, g), b)
# Where brightness > 230, fade alpha
fade_mask = brightness > 230
alpha[fade_mask] = np.clip((255.0 - brightness[fade_mask]) / 25.0 * 255.0, 0, 255)
alpha[brightness >= 250] = 0

arr[:, :, 3] = alpha.astype(np.uint8)

out_img = Image.fromarray(arr, 'RGBA')
out_img.save('frontend/public/india_3d_relief_transparent.png')
print('Saved frontend/public/india_3d_relief_transparent.png! Size:', out_img.size)
