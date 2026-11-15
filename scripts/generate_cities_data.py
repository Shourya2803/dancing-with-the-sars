"""
Authoritative dataset of real cities, towns, and pilgrimage/scientific areas in Uttarakhand, India.
Includes true geographical coordinates (WGS84), district associations, elevations,
bounding boxes, and map projection coordinates for the 1470x1230 physical relief map.
"""

from typing import Dict, Any, List

# Bounding box of the physical map canvas (1470 x 1230)
MAP_BOUNDS = {
    "min_lon": 77.46,
    "max_lon": 81.19,
    "min_lat": 28.50,
    "max_lat": 31.61,
    "width": 1470.0,
    "height": 1230.0
}

def project_coords(lon: float, lat: float) -> tuple[float, float]:
    x = ((lon - MAP_BOUNDS["min_lon"]) / (MAP_BOUNDS["max_lon"] - MAP_BOUNDS["min_lon"])) * MAP_BOUNDS["width"]
    y = ((MAP_BOUNDS["max_lat"] - lat) / (MAP_BOUNDS["max_lat"] - MAP_BOUNDS["min_lat"])) * MAP_BOUNDS["height"]
    return round(x, 1), round(y, 1)

def create_aoi_bbox(lon: float, lat: float, radius_deg: float = 0.05) -> list[float]:
    return [
        round(lon - radius_deg, 4),
        round(lat - radius_deg, 4),
        round(lon + radius_deg, 4),
        round(lat + radius_deg, 4)
    ]

def create_aoi_poly(lon: float, lat: float, radius_deg: float = 0.05) -> dict:
    min_x, min_y, max_x, max_y = create_aoi_bbox(lon, lat, radius_deg)
    return {
        "type": "Polygon",
        "coordinates": [[
            [min_x, min_y],
            [max_x, min_y],
            [max_x, max_y],
            [min_x, max_y],
            [min_x, min_y]
        ]]
    }

RAW_CITIES = [
    # Chamoli District
    {
        "id": "joshimath",
        "name": "Joshimath",
        "district": "Chamoli",
        "division": "Garhwal",
        "lat": 30.5566,
        "lon": 79.5644,
        "elevation_m": 1890,
        "description": "Gateway to Badrinath and Valley of Flowers. Crucial area for ground subsidence & slope stability studies.",
        "radius_deg": 0.04
    },
    {
        "id": "badrinath",
        "name": "Badrinath",
        "district": "Chamoli",
        "division": "Garhwal",
        "lat": 30.7433,
        "lon": 79.4938,
        "elevation_m": 3300,
        "description": "High Himalayan holy town situated between Nar and Narayana mountain ranges in upper Alaknanda valley.",
        "radius_deg": 0.04
    },
    {
        "id": "auli",
        "name": "Auli",
        "district": "Chamoli",
        "division": "Garhwal",
        "lat": 30.5288,
        "lon": 79.5694,
        "elevation_m": 2800,
        "description": "High-altitude alpine bugyals and slopes facing Nanda Devi.",
        "radius_deg": 0.03
    },
    {
        "id": "gopeshwar",
        "name": "Gopeshwar",
        "district": "Chamoli",
        "division": "Garhwal",
        "lat": 30.4167,
        "lon": 79.3333,
        "elevation_m": 1550,
        "description": "Administrative headquarters of Chamoli district in the central Garhwal hills.",
        "radius_deg": 0.04
    },
    {
        "id": "karnaprayag",
        "name": "Karnaprayag",
        "district": "Chamoli",
        "division": "Garhwal",
        "lat": 30.2600,
        "lon": 79.2200,
        "elevation_m": 790,
        "description": "Confluence of Alaknanda and Pindar rivers, key hydrological transit corridor.",
        "radius_deg": 0.04
    },

    # Dehradun District
    {
        "id": "dehradun",
        "name": "Dehradun",
        "district": "Dehradun",
        "division": "Garhwal",
        "lat": 30.3165,
        "lon": 78.0322,
        "elevation_m": 450,
        "description": "State capital of Uttarakhand situated in the Doon Valley between the Himalayas and Shivaliks.",
        "radius_deg": 0.06
    },
    {
        "id": "mussoorie",
        "name": "Mussoorie",
        "district": "Dehradun",
        "division": "Garhwal",
        "lat": 30.4598,
        "lon": 78.0644,
        "elevation_m": 2005,
        "description": "Famous hill station on the Garhwal Himalayan ridge overlooking the Doon Valley.",
        "radius_deg": 0.04
    },
    {
        "id": "rishikesh",
        "name": "Rishikesh",
        "district": "Dehradun",
        "division": "Garhwal",
        "lat": 30.0869,
        "lon": 78.2676,
        "elevation_m": 340,
        "description": "Himalayan foothills along the holy Ganges river; global center for yoga and gateway to Garhwal.",
        "radius_deg": 0.04
    },
    {
        "id": "chakrata",
        "name": "Chakrata",
        "district": "Dehradun",
        "division": "Garhwal",
        "lat": 30.7016,
        "lon": 77.8697,
        "elevation_m": 2118,
        "description": "Secluded cantonment town in Jaunsar-Bawar nestled between Tons and Yamuna rivers.",
        "radius_deg": 0.04
    },

    # Haridwar District
    {
        "id": "haridwar",
        "name": "Haridwar",
        "district": "Haridwar",
        "division": "Garhwal",
        "lat": 29.9457,
        "lon": 78.1642,
        "elevation_m": 314,
        "description": "Ancient sacred city where the Ganges emerges from the Shivalik foothills onto the northern plains.",
        "radius_deg": 0.05
    },
    {
        "id": "roorkee",
        "name": "Roorkee",
        "district": "Haridwar",
        "division": "Garhwal",
        "lat": 29.8543,
        "lon": 77.8880,
        "elevation_m": 268,
        "description": "Premier educational & engineering hub, home to IIT Roorkee and National Institute of Hydrology.",
        "radius_deg": 0.05
    },

    # Nainital District
    {
        "id": "nainital",
        "name": "Nainital",
        "district": "Nainital",
        "division": "Kumaon",
        "lat": 29.3919,
        "lon": 79.4542,
        "elevation_m": 2084,
        "description": "Kumaon hill resort set around eye-shaped Naini Lake, surrounded by steep forested mountain peaks.",
        "radius_deg": 0.04
    },
    {
        "id": "haldwani",
        "name": "Haldwani",
        "district": "Nainital",
        "division": "Kumaon",
        "lat": 29.2183,
        "lon": 79.5130,
        "elevation_m": 424,
        "description": "Commercial capital of Kumaon in the foothills and main transit gateway to high-altitude regions.",
        "radius_deg": 0.05
    },
    {
        "id": "ramnagar",
        "name": "Ramnagar",
        "district": "Nainital",
        "division": "Kumaon",
        "lat": 29.3944,
        "lon": 79.1264,
        "elevation_m": 345,
        "description": "Gateway to Jim Corbett National Park along the Kosi river.",
        "radius_deg": 0.05
    },

    # Rudraprayag District
    {
        "id": "rudraprayag",
        "name": "Rudraprayag",
        "district": "Rudraprayag",
        "division": "Garhwal",
        "lat": 30.2844,
        "lon": 78.9811,
        "elevation_m": 895,
        "description": "Confluence of Alaknanda and Mandakini rivers, key point for monitoring river discharge and slope stability.",
        "radius_deg": 0.04
    },
    {
        "id": "kedarnath",
        "name": "Kedarnath",
        "district": "Rudraprayag",
        "division": "Garhwal",
        "lat": 30.7346,
        "lon": 79.0669,
        "elevation_m": 3583,
        "description": "High-altitude glacial valley along the Mandakini river near Chorabari glacier.",
        "radius_deg": 0.04
    },
    {
        "id": "guptkashi",
        "name": "Guptkashi",
        "district": "Rudraprayag",
        "division": "Garhwal",
        "lat": 30.5228,
        "lon": 79.0767,
        "elevation_m": 1319,
        "description": "Mandakini valley town with sweeping views of Chaukhamba peaks.",
        "radius_deg": 0.04
    },

    # Uttarkashi District
    {
        "id": "uttarkashi",
        "name": "Uttarkashi",
        "district": "Uttarkashi",
        "division": "Garhwal",
        "lat": 30.7268,
        "lon": 78.4354,
        "elevation_m": 1158,
        "description": "Historic town along the Bhagirathi river, home to Nehru Institute of Mountaineering.",
        "radius_deg": 0.04
    },
    {
        "id": "gangotri",
        "name": "Gangotri",
        "district": "Uttarkashi",
        "division": "Garhwal",
        "lat": 30.9947,
        "lon": 78.9398,
        "elevation_m": 3100,
        "description": "High Himalayan valley near the snout of Gangotri Glacier (Gaumukh), source of the Bhagirathi/Ganges.",
        "radius_deg": 0.04
    },
    {
        "id": "barkot",
        "name": "Barkot",
        "district": "Uttarkashi",
        "division": "Garhwal",
        "lat": 30.8125,
        "lon": 78.2078,
        "elevation_m": 1220,
        "description": "Gateway to Yamunotri along the Yamuna river valley.",
        "radius_deg": 0.04
    },

    # Almora District
    {
        "id": "almora",
        "name": "Almora",
        "district": "Almora",
        "division": "Kumaon",
        "lat": 29.5971,
        "lon": 79.6591,
        "elevation_m": 1638,
        "description": "Cultural heart of Kumaon situated on a 5 km ridge between Kosi and Suyal rivers.",
        "radius_deg": 0.04
    },
    {
        "id": "ranikhet",
        "name": "Ranikhet",
        "district": "Almora",
        "division": "Kumaon",
        "lat": 29.6434,
        "lon": 79.4322,
        "elevation_m": 1869,
        "description": "Pine-forested cantonment town with panoramic Himalayan vistas.",
        "radius_deg": 0.04
    },

    # Pithoragarh District
    {
        "id": "pithoragarh",
        "name": "Pithoragarh",
        "district": "Pithoragarh",
        "division": "Kumaon",
        "lat": 29.5829,
        "lon": 80.2182,
        "elevation_m": 1627,
        "description": "Soar valley headquarters in eastern Kumaon bordering Nepal and Tibet.",
        "radius_deg": 0.05
    },
    {
        "id": "dharchula",
        "name": "Dharchula",
        "district": "Pithoragarh",
        "division": "Kumaon",
        "lat": 29.8475,
        "lon": 80.5392,
        "elevation_m": 940,
        "description": "Strategic border valley town along the swift Kali river gorge.",
        "radius_deg": 0.04
    },
    {
        "id": "munsyari",
        "name": "Munsyari",
        "district": "Pithoragarh",
        "division": "Kumaon",
        "lat": 30.0667,
        "lon": 80.2333,
        "elevation_m": 2200,
        "description": "Base for treks to Milam and Ralam glaciers, facing the dramatic Panchachuli peaks.",
        "radius_deg": 0.04
    },

    # Bageshwar District
    {
        "id": "bageshwar",
        "name": "Bageshwar",
        "district": "Bageshwar",
        "division": "Kumaon",
        "lat": 29.8404,
        "lon": 79.7694,
        "elevation_m": 1004,
        "description": "Confluence of Saryu and Gomati rivers, gateway to Pindari and Sunderdhunga Glaciers.",
        "radius_deg": 0.04
    },
    {
        "id": "kausani",
        "name": "Kausani",
        "district": "Bageshwar",
        "division": "Kumaon",
        "lat": 29.8447,
        "lon": 79.5960,
        "elevation_m": 1890,
        "description": "Window to the Himalayas with 300 km uninterrupted views of Trishul, Nanda Devi, and Panchachuli.",
        "radius_deg": 0.04
    },

    # Tehri Garhwal District
    {
        "id": "new_tehri",
        "name": "New Tehri",
        "district": "Tehri Garhwal",
        "division": "Garhwal",
        "lat": 30.3788,
        "lon": 78.4803,
        "elevation_m": 1750,
        "description": "Modern planned city overlooking the massive Tehri Dam reservoir on the Bhagirathi river.",
        "radius_deg": 0.04
    },

    # Pauri Garhwal District
    {
        "id": "pauri",
        "name": "Pauri",
        "district": "Pauri Garhwal",
        "division": "Garhwal",
        "lat": 30.1500,
        "lon": 78.7800,
        "elevation_m": 1814,
        "description": "Hill town commanding grand vistas of snow-laden Himalayan peaks.",
        "radius_deg": 0.04
    },
    {
        "id": "srinagar_garhwal",
        "name": "Srinagar (Garhwal)",
        "district": "Pauri Garhwal",
        "division": "Garhwal",
        "lat": 30.2224,
        "lon": 78.7844,
        "elevation_m": 560,
        "description": "Largest educational and valley city in Garhwal along the Alaknanda river.",
        "radius_deg": 0.04
    },
    {
        "id": "kotdwar",
        "name": "Kotdwar",
        "district": "Pauri Garhwal",
        "division": "Garhwal",
        "lat": 29.7464,
        "lon": 78.5284,
        "elevation_m": 454,
        "description": "Gateway city to the Garhwal Himalayas at the foothills of the Shivalik range.",
        "radius_deg": 0.05
    },
    {
        "id": "lansdowne",
        "name": "Lansdowne",
        "district": "Pauri Garhwal",
        "division": "Garhwal",
        "lat": 29.8377,
        "lon": 78.6871,
        "elevation_m": 1706,
        "description": "Pristine oak and blue pine forested cantonment hill station.",
        "radius_deg": 0.04
    },

    # Champawat District
    {
        "id": "champawat",
        "name": "Champawat",
        "district": "Champawat",
        "division": "Kumaon",
        "lat": 29.3346,
        "lon": 80.0911,
        "elevation_m": 1610,
        "description": "Historic hill capital of the Chand dynasty in eastern Kumaon.",
        "radius_deg": 0.04
    },
    {
        "id": "tanakpur",
        "name": "Tanakpur",
        "district": "Champawat",
        "division": "Kumaon",
        "lat": 29.0722,
        "lon": 80.1111,
        "elevation_m": 255,
        "description": "Foothills town along the Sharda (Mahakali) river bordering Nepal.",
        "radius_deg": 0.04
    },

    # Udham Singh Nagar District
    {
        "id": "rudrapur",
        "name": "Rudrapur",
        "district": "Udham Singh Nagar",
        "division": "Kumaon",
        "lat": 28.9774,
        "lon": 79.4004,
        "elevation_m": 205,
        "description": "Major industrial city and administrative center of Udham Singh Nagar in the Terai.",
        "radius_deg": 0.05
    },
    {
        "id": "kashipur",
        "name": "Kashipur",
        "district": "Udham Singh Nagar",
        "division": "Kumaon",
        "lat": 29.2104,
        "lon": 78.9619,
        "elevation_m": 238,
        "description": "Historical Drona Sagar city and economic hub in southwestern Kumaon.",
        "radius_deg": 0.05
    }
]

def generate_cities_dict() -> Dict[str, Dict[str, Any]]:
    cities = {}
    for c in RAW_CITIES:
        mx, my = project_coords(c["lon"], c["lat"])
        bbox = create_aoi_bbox(c["lon"], c["lat"], c["radius_deg"])
        poly = create_aoi_poly(c["lon"], c["lat"], c["radius_deg"])
        cities[c["id"]] = {
            "id": c["id"],
            "name": c["name"],
            "district": c["district"],
            "division": c["division"],
            "latitude": c["lat"],
            "longitude": c["lon"],
            "elevation_m": c["elevation_m"],
            "description": c["description"],
            "bbox": bbox,
            "geometry": poly,
            "default_nisar_track": 106,
            "default_nisar_frame": 73 if c["lat"] >= 29.8 else 74,
            "mapX": mx,
            "mapY": my
        }
    return cities

if __name__ == "__main__":
    import json
    import os

    data = generate_cities_dict()
    print(f"Generated {len(data)} cities/areas in Uttarakhand.")

    # 1. Save JSON
    os.makedirs("backend/app/data", exist_ok=True)
    with open("backend/app/data/uttarakhand_cities.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    print("Saved backend/app/data/uttarakhand_cities.json!")

    # 2. Save Python module for backend
    py_content = f'''"""
Authoritative dataset of real cities and areas across Uttarakhand, India.
Each city has verified WGS84 coordinates, elevation, district, bounding box, and GeoJSON polygon AOI.
"""

from typing import Dict, Any, List, Optional

UTTARAKHAND_CITIES: Dict[str, Dict[str, Any]] = {json.dumps(data, indent=4)}

def get_all_cities() -> List[Dict[str, Any]]:
    return list(UTTARAKHAND_CITIES.values())

def get_city_info(city_id: str) -> Optional[Dict[str, Any]]:
    key = city_id.strip().lower()
    return UTTARAKHAND_CITIES.get(key)

def find_city_by_name(name: str) -> Optional[Dict[str, Any]]:
    normalized = name.strip().lower()
    for cid, cdata in UTTARAKHAND_CITIES.items():
        if cid == normalized or cdata["name"].lower() == normalized:
            return cdata
    return None
'''
    with open("backend/app/data/uttarakhand_cities.py", "w", encoding="utf-8") as f:
        f.write(py_content)
    print("Saved backend/app/data/uttarakhand_cities.py!")

    # 3. Save TypeScript module for frontend
    os.makedirs("frontend/src/data", exist_ok=True)
    ts_content = f'''/**
 * Authoritative dataset of real cities and areas across Uttarakhand, India.
 * Includes verified WGS84 coordinates, elevation, district, bounding box, GeoJSON geometry,
 * and 2D canvas projection coordinates on the Uttarakhand physical relief map (1470x1230).
 *
 * DO NOT INVENT COORDINATES OR BOUNDARIES.
 */

export interface LocationDetail {{
  id: string;
  name: string;
  district: string;
  division: string;
  latitude: number;
  longitude: number;
  elevation_m: number;
  description: string;
  bbox: [number, number, number, number]; // [min_lon, min_lat, max_lon, max_lat]
  geometry: {{
    type: "Polygon";
    coordinates: number[][][];
  }};
  default_nisar_track: number;
  default_nisar_frame: number;
  mapX: number;
  mapY: number;
}}

export const UTTARAKHAND_CITIES: Record<string, LocationDetail> = {json.dumps(data, indent=2)};

export const UTTARAKHAND_CITIES_LIST: LocationDetail[] = Object.values(UTTARAKHAND_CITIES);

export const DEFAULT_CITY_ID = "joshimath";

export function getCityById(id: string): LocationDetail | undefined {{
  const key = id.toLowerCase().trim();
  return UTTARAKHAND_CITIES[key];
}}

export function searchCities(query: string): LocationDetail[] {{
  if (!query || query.trim() === "") return UTTARAKHAND_CITIES_LIST;
  const q = query.toLowerCase().trim();
  return UTTARAKHAND_CITIES_LIST.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.district.toLowerCase().includes(q) ||
    c.division.toLowerCase().includes(q)
  );
}}
'''
    with open("frontend/src/data/uttarakhand_cities.ts", "w", encoding="utf-8") as f:
        f.write(ts_content)
    print("Saved frontend/src/data/uttarakhand_cities.ts!")

