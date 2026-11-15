import json
import math

with open('frontend/public/india_states.geojson', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Let's project to 1000 x 1150 viewBox
# India mainland spans roughly:
# Longitude: 68.1 to 97.4
# Latitude: 6.8 to 37.3 (mainland 8.0 to 37.1)
# Center: lng0 = 82.5, lat0 = 22.0

# Using standard Albers Equal Area or Mercator
def project_mercator(lng, lat):
    # Mercator
    x = lng
    lat_rad = math.radians(min(max(lat, -85), 85))
    y = math.log(math.tan(math.pi / 4 + lat_rad / 2))
    return x, y

# Collect all mainland coordinates
all_pts = []
for f in data['features']:
    name = f['properties']['st_nm']
    # Skip Andaman and Nicobar and Lakshadweep if calculating mainland bounds
    is_island = 'Andaman' in name or 'Lakshadweep' in name
    geom = f['geometry']
    gtype = geom['type']
    coords = geom['coordinates']
    
    def extract_pts(c_list):
        if isinstance(c_list[0], (int, float)):
            all_pts.append((c_list[0], c_list[1], is_island))
        else:
            for sub in c_list:
                extract_pts(sub)
    extract_pts(coords)

mainland_pts = [(p[0], p[1]) for p in all_pts if not p[2]]
lngs = [p[0] for p in mainland_pts]
lats = [p[1] for p in mainland_pts]

min_lng, max_lng = min(lngs), max(lngs)
min_lat, max_lat = min(lats), max(lats)

print(f"Mainland Lng: {min_lng:.2f} to {max_lng:.2f}")
print(f"Mainland Lat: {min_lat:.2f} to {max_lat:.2f}")

# Projected bounds
proj_pts = [project_mercator(p[0], p[1]) for p in mainland_pts]
min_px = min(p[0] for p in proj_pts)
max_px = max(p[0] for p in proj_pts)
min_py = min(p[1] for p in proj_pts)
max_py = max(p[1] for p in proj_pts)

print(f"Projected X: {min_px:.4f} to {max_px:.4f}, Y: {min_py:.4f} to {max_py:.4f}")
