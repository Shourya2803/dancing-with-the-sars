import re
from PIL import Image, ImageDraw

with open('frontend/src/lib/constants.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Extract UTTARAKHAND_DISTRICTS
match = re.search(r'export const UTTARAKHAND_DISTRICTS.*?};', text, re.DOTALL)
if match:
    block = match.group(0)
    # Find district keys
    dist_keys = re.findall(r'(\w+):\s*\{', block)
    print("Found district keys:", dist_keys)
