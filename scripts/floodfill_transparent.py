from PIL import Image
import numpy as np
from collections import deque

img = Image.open('frontend/public/india_3d_relief_ref.jpg').convert('RGBA')
w, h = img.size
arr = np.array(img)

# Find connected background from corners using BFS
visited = np.zeros((h, w), dtype=bool)
is_bg = np.zeros((h, w), dtype=bool)

# Queue starting at all edge pixels
q = deque()
for x in range(w):
    q.append((0, x))
    q.append((h - 1, x))
for y in range(h):
    q.append((y, 0))
    q.append((y, w - 1))

while q:
    y, x = q.popleft()
    if visited[y, x]:
        continue
    visited[y, x] = True
    
    # Check if pixel is background (near white / light grey)
    pixel = arr[y, x][:3]
    # Background in the reference is light studio grey/white: min(RGB) > 215 or max difference < 15 and mean > 210
    if min(pixel) > 218:
        is_bg[y, x] = True
        # Expand to neighbors
        for dy, dx in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx]:
                q.append((ny, nx))

# Set alpha: where is_bg is True, alpha = 0.
# For border softening:
alpha = arr[:, :, 3].astype(np.float32)
alpha[is_bg] = 0

arr[:, :, 3] = alpha.astype(np.uint8)

out_img = Image.fromarray(arr, 'RGBA')
out_img.save('frontend/public/india_3d_relief_transparent.png')
print('Saved with floodfill! Retained interior snow and features.')
