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
    val = c - 2 * n * math.sin(lat)
    rho = math.sqrt(max(val, 0.0001)) / n
    theta = n * (lng - lng0)
    x = rho * math.sin(theta)
    y = rho0 - rho * math.cos(theta)
    return x, y

# ViewBox dimensions
VB_WIDTH = 1000
VB_HEIGHT = 1150
PADDING = 40

# Bounds from test_albers
min_x, max_x = -0.2263, 0.2291
min_y, max_y = -0.2073, 0.2985

span_x = max_x - min_x
span_y = max_y - min_y

scale = min((VB_WIDTH - 2 * PADDING) / span_x, (VB_HEIGHT - 2 * PADDING) / span_y)

def to_svg_coords(lng, lat):
    x, y = project_albers(lng, lat)
    # y increases northwards in Albers, so invert for SVG
    svg_x = PADDING + (x - min_x) * scale
    svg_y = VB_HEIGHT - PADDING - (y - min_y) * scale
    return round(svg_x, 1), round(svg_y, 1)

# Ramer-Douglas-Peucker simplification
def point_line_dist(pt, line_start, line_end):
    if line_start == line_end:
        return math.hypot(pt[0] - line_start[0], pt[1] - line_start[1])
    n = abs((line_end[1] - line_start[1]) * pt[0] - (line_end[0] - line_start[0]) * pt[1] + line_end[0] * line_start[1] - line_end[1] * line_start[0])
    d = math.hypot(line_end[1] - line_start[1], line_end[0] - line_start[0])
    return n / d if d > 0 else 0

def rdp(points, epsilon=0.45):
    if len(points) < 3:
        return points
    dmax = 0.0
    index = 0
    for i in range(1, len(points) - 1):
        d = point_line_dist(points[i], points[0], points[-1])
        if d > dmax:
            index = i
            dmax = d
    if dmax > epsilon:
        rec1 = rdp(points[:index + 1], epsilon)
        rec2 = rdp(points[index:], epsilon)
        return rec1[:-1] + rec2
    else:
        return [points[0], points[-1]]

def coords_to_svg_path(coords, geom_type):
    parts = []
    
    def process_ring(ring):
        svg_pts = [to_svg_coords(pt[0], pt[1]) for pt in ring]
        # Filter duplicates
        dedup = [svg_pts[0]]
        for p in svg_pts[1:]:
            if p != dedup[-1]:
                dedup.append(p)
        simplified = rdp(dedup, epsilon=0.6)
        if len(simplified) < 3:
            return ""
        path_str = f"M {simplified[0][0]} {simplified[0][1]} " + " ".join(f"L {p[0]} {p[1]}" for p in simplified[1:]) + " Z"
        return path_str

    if geom_type == "Polygon":
        for ring in coords:
            p = process_ring(ring)
            if p: parts.append(p)
    elif geom_type == "MultiPolygon":
        for poly in coords:
            for ring in poly:
                p = process_ring(ring)
                if p: parts.append(p)
                
    return " ".join(parts)

# Metadata mapping for states
STATE_INFO = {
    "Uttarakhand": {"capital": "Dehradun / Gairsain", "region": "Northern Himalayas", "significance": "NISAR Priority Sector: Landslide & Glacier Melt Monitoring", "target": True},
    "Jammu and Kashmir": {"capital": "Srinagar / Jammu", "region": "Western Himalayas", "significance": "Cryosphere & Glacial Lake Outburst Risk"},
    "Ladakh": {"capital": "Leh", "region": "Trans-Himalayas", "significance": "High Altitude Permafrost & Cryosphere"},
    "Himachal Pradesh": {"capital": "Shimla", "region": "Western Himalayas", "significance": "High-altitude Flash Flood & Snow Cover"},
    "Punjab": {"capital": "Chandigarh", "region": "Northern Plains", "significance": "Agrarian Soil Moisture & Groundwater Subsidence"},
    "Haryana": {"capital": "Chandigarh", "region": "Northern Plains", "significance": "Groundwater Aquifer Depletion Mapping"},
    "Delhi": {"capital": "New Delhi", "region": "National Capital", "significance": "Urban Heat Island & Surface Deformation"},
    "Rajasthan": {"capital": "Jaipur", "region": "Thar Desert", "significance": "Desertification & Dune Migration InSAR"},
    "Gujarat": {"capital": "Gandhinagar", "region": "Western Littoral", "significance": "Kutch Rift Basin & Coastal Mangrove Dynamics"},
    "Uttar Pradesh": {"capital": "Lucknow", "region": "Gangetic Plain", "significance": "Alluvial Basin Subsidence & Floodplain Mapping"},
    "Bihar": {"capital": "Patna", "region": "Eastern Gangetic", "significance": "Kosi River Flood Dynamics & Sedimentation"},
    "West Bengal": {"capital": "Kolkata", "region": "Bay of Bengal Littoral", "significance": "Sundarbans Mangrove Tidal Radar Backscatter"},
    "Sikkim": {"capital": "Gangtok", "region": "Eastern Himalayas", "significance": "Teesta Basin Glacial Lake GLOF Risk"},
    "Assam": {"capital": "Dispur", "region": "Brahmaputra Valley", "significance": "Brahmaputra River Floods & Wetland Dynamics"},
    "Arunachal Pradesh": {"capital": "Itanagar", "region": "Eastern Himalayas", "significance": "Alpine Forest Biomass & Seismic Slopes"},
    "Meghalaya": {"capital": "Shillong", "region": "Shillong Plateau", "significance": "High-precipitation Karst Landforms"},
    "Nagaland": {"capital": "Kohima", "region": "Naga Hills", "significance": "Himalayan Ridge Forest Canopy Cover"},
    "Manipur": {"capital": "Imphal", "region": "Indo-Burma Range", "significance": "Loktak Lake Phumdi Biomass Tracking"},
    "Mizoram": {"capital": "Aizawl", "region": "Lushai Hills", "significance": "Steep Valley Landslide Susceptibility"},
    "Tripura": {"capital": "Agartala", "region": "Surma Valley", "significance": "Sub-tropical Agroforestry SAR Mapping"},
    "Madhya Pradesh": {"capital": "Bhopal", "region": "Central Highlands", "significance": "Central Deciduous Forest Biomass Estimation"},
    "Chhattisgarh": {"capital": "Raipur", "region": "Dandakaranya", "significance": "Mahanadi Basin Water Resources & Mineral Belts"},
    "Jharkhand": {"capital": "Ranchi", "region": "Chota Nagpur Plateau", "significance": "Mineral Extraction Land Surface Subsidence"},
    "Odisha": {"capital": "Bhubaneswar", "region": "Eastern Coastal Plains", "significance": "Cyclone Landfall Storm Surge & Coastal Erosion"},
    "Maharashtra": {"capital": "Mumbai", "region": "Deccan Traps & Konkan", "significance": "Western Ghats Escarpment Slopes & Urban Core"},
    "Goa": {"capital": "Panaji", "region": "Konkan Coast", "significance": "Estuarine Salinity & Coastal Mangroves"},
    "Karnataka": {"capital": "Bengaluru", "region": "Deccan Plateau & Malenadu", "significance": "Western Ghats Biodiversity Hotspot & Drought"},
    "Telangana": {"capital": "Hyderabad", "region": "Deccan Semi-Arid", "significance": "Godavari-Krishna River Basin Irrigation SAR"},
    "Andhra Pradesh": {"capital": "Amaravati", "region": "Coromandel Coastal", "significance": "Coastal Aquaculture & Delta Subsidence"},
    "Tamil Nadu": {"capital": "Chennai", "region": "Coromandel Coast", "significance": "Cauvery Delta Irrigation & Coastal Vulnerability"},
    "Kerala": {"capital": "Thiruvananthapuram", "region": "Malabar Coast", "significance": "Monsoonal Landslide Detection & Coastal InSAR"},
    "Andaman and Nicobar Islands": {"capital": "Port Blair", "region": "Bay of Bengal Archipelago", "significance": "Subduction Zone Tectonic Uplift"},
    "Lakshadweep": {"capital": "Kavaratti", "region": "Arabian Sea Atolls", "significance": "Coral Atoll Geomorphology & Sea Level Rise"},
    "Puducherry": {"capital": "Puducherry", "region": "Union Territory", "significance": "Coastal Sediment Transport"},
    "Chandigarh": {"capital": "Chandigarh", "region": "Union Territory", "significance": "Urban Surface Backscatter Reference"},
    "Dadra and Nagar Haveli": {"capital": "Silvassa", "region": "Western UT", "significance": "Daman Ganga Watershed"},
    "Daman and Diu": {"capital": "Daman", "region": "Western UT", "significance": "Gulf of Khambhat Coastal Edge"}
}

processed_states = []

for f in data['features']:
    name = f['properties']['st_nm']
    geom = f['geometry']
    path_d = coords_to_svg_path(geom['coordinates'], geom['type'])
    if not path_d:
        continue
        
    meta = STATE_INFO.get(name, {
        "capital": "State Capital",
        "region": "Subcontinent Sector",
        "significance": "Regional Radar Remote Sensing"
    })
    
    # Calculate visual centroid
    # Collect all points in path to find bounding box center
    pts = []
    tokens = path_d.split()
    for i in range(len(tokens) - 1):
        try:
            x_val = float(tokens[i])
            y_val = float(tokens[i+1])
            pts.append((x_val, y_val))
        except:
            pass
    if pts:
        cx = round(sum(p[0] for p in pts) / len(pts), 1)
        cy = round(sum(p[1] for p in pts) / len(pts), 1)
    else:
        cx, cy = 500, 500

    processed_states.append({
        "id": name.lower().replace(" ", "_").replace("&", "and"),
        "name": name,
        "capital": meta.get("capital", "Capital"),
        "region": meta.get("region", "Region"),
        "significance": meta.get("significance", "NISAR Surveillance"),
        "isTarget": meta.get("target", False),
        "center": [cx, cy],
        "path": path_d
    })

print(f"Total processed states: {len(processed_states)}")
# Check Uttarakhand specifically
uk = [s for s in processed_states if "uttarakhand" in s["id"] or s["isTarget"]]
print("Uttarakhand found:", uk[0]["name"] if uk else "NOT FOUND", uk[0]["center"] if uk else "")

# Write clean JSON
with open('frontend/src/data/india_states_paths.json', 'w', encoding='utf-8') as out:
    json.dump(processed_states, out, indent=2)

print("Saved frontend/src/data/india_states_paths.json")
