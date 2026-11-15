import json
import urllib.request
import math

url = 'https://raw.githubusercontent.com/adarshbiradar/maps-geojson/master/india.json'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, timeout=15) as r:
    data = json.loads(r.read().decode('utf-8'))

# Save the raw geojson to frontend/public/india_states.geojson
with open('frontend/public/india_states.geojson', 'w', encoding='utf-8') as f:
    json.dump(data, f)
print("Saved frontend/public/india_states.geojson")

# Find bounds of mainland India
# Note: Andaman & Nicobar and Lakshadweep are islands far south/east.
# In the user's reference image media_1794729780873_940a32d1.jpg:
# Notice that the reference image is focused cleanly on mainland India (with or without small islands).
# Let's inspect the coordinates of mainland India:
# Longitude approx: 68°E to 97.5°E
# Latitude approx: 8°N to 37.5°N
min_lng, max_lng = 68.0, 97.5
min_lat, max_lat = 8.0, 37.5

print(f"Target bounds: Lng [{min_lng}, {max_lng}], Lat [{min_lat}, {max_lat}]")
