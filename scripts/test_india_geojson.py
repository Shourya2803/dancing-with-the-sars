import urllib.request
import json
import math

url = 'https://raw.githubusercontent.com/adarshbiradar/maps-geojson/master/india.json'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, timeout=15) as r:
    data = json.loads(r.read().decode('utf-8'))

print(f"Total features: {len(data['features'])}")
for i, f in enumerate(data['features']):
    p = f.get('properties', {})
    print(f"{i}: {p}")
