import json
import math

with open('frontend/public/india_states.geojson', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Albers Conic projection parameters for India
lat1 = math.radians(12.0)
lat2 = math.radians(28.0)
lat0 = math.radians(20.0)
lng0 = math.radians(82.5)

n = 0.5 * (math.sin(lat1) + math.sin(lat2))
c = math.cos(lat1)**2 + 2 * n * math.sin(lat1)
rho0 = math.sqrt(c - 2 * n * math.sin(lat0)) / n

def project_albers(lng_deg, lat_deg):
    lng = math.radians(lng_deg)
    lat = math.radians(lat_deg)
    # Clamp to avoid sqrt negative
    val = c - 2 * n * math.sin(lat)
    rho = math.sqrt(max(val, 0.0001)) / n
    theta = n * (lng - lng0)
    x = rho * math.sin(theta)
    y = rho0 - rho * math.cos(theta)
    return x, y

# Test on bounds
all_pts = []
for f in data['features']:
    name = f['properties']['st_nm']
    if 'Andaman' in name or 'Lakshadweep' in name:
        continue
    geom = f['geometry']
    def collect(coords):
        if isinstance(coords[0], (int, float)):
            all_pts.append(project_albers(coords[0], coords[1]))
        else:
            for sub in coords:
                collect(sub)
    collect(geom['coordinates'])

xs = [p[0] for p in all_pts]
ys = [p[1] for p in all_pts]

min_x, max_x = min(xs), max(xs)
min_y, max_y = min(ys), max(ys)

print(f"Albers X: [{min_x:.4f}, {max_x:.4f}], span: {max_x - min_x:.4f}")
print(f"Albers Y: [{min_y:.4f}, {max_y:.4f}], span: {max_y - min_y:.4f}")
print(f"Aspect ratio (height/width): {(max_y - min_y) / (max_x - min_x):.4f}")
