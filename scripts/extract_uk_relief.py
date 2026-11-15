import base64
import re
from PIL import Image
import io

with open('frontend/public/uttarakhand_physical_relief.svg', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

m = re.search(r'xlink:href=["\']data:image/png;base64,([^"\']+)["\']', text)
if m:
    b64_data = m.group(1)
    img_bytes = base64.b64decode(b64_data)
    img = Image.open(io.BytesIO(img_bytes))
    print('Extracted PNG size:', img.size, 'mode:', img.mode)
    img.save('frontend/public/uttarakhand_physical_relief_raw.png')
    print('Saved to frontend/public/uttarakhand_physical_relief_raw.png!')
else:
    print('Not found')
