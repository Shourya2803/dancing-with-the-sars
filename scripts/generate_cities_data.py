"""
Authoritative dataset of real cities, towns, and key geographic areas across all 13 districts of Uttarakhand, India.
Includes true geographical coordinates (WGS84), district associations, elevations,
bounding boxes, and map projection coordinates for the 1470x1230 physical relief map.

Includes Bhimtal, Mukteshwar, Bhowali, Nainital, Almora, Joshimath, and all prominent towns across Garhwal & Kumaon.
DO NOT INVENT COORDINATES OR BOUNDARIES.
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

def create_aoi_bbox(lon: float, lat: float, radius_deg: float = 0.04) -> list[float]:
    return [
        round(lon - radius_deg, 4),
        round(lat - radius_deg, 4),
        round(lon + radius_deg, 4),
        round(lat + radius_deg, 4)
    ]

def create_aoi_poly(lon: float, lat: float, radius_deg: float = 0.04) -> dict:
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
    # =========================================================================
    # 1. NAINITAL DISTRICT (Kumaon Division)
    # =========================================================================
    {
        "id": "bhimtal",
        "name": "Bhimtal",
        "district": "Nainital",
        "division": "Kumaon",
        "lat": 29.3496,
        "lon": 79.5544,
        "elevation_m": 1370,
        "description": "Scenic lake town in Kumaon hills centered around the iconic Bhimtal Lake with an island aquarium.",
        "radius_deg": 0.035
    },
    {
        "id": "mukteshwar",
        "name": "Mukteshwar",
        "district": "Nainital",
        "division": "Kumaon",
        "lat": 29.4722,
        "lon": 79.6472,
        "elevation_m": 2171,
        "description": "High-altitude ridge town offering 180-degree panoramic views of Himalayan peaks like Nanda Devi and Trishul.",
        "radius_deg": 0.035
    },
    {
        "id": "nainital",
        "name": "Nainital",
        "district": "Nainital",
        "division": "Kumaon",
        "lat": 29.3919,
        "lon": 79.4542,
        "elevation_m": 2084,
        "description": "Renowned Himalayan lake resort situated in a valley containing the pear-shaped Naini Lake, bordered by steep peaks.",
        "radius_deg": 0.04
    },
    {
        "id": "bhowali",
        "name": "Bhowali",
        "district": "Nainital",
        "division": "Kumaon",
        "lat": 29.3833,
        "lon": 79.5167,
        "elevation_m": 1706,
        "description": "Famous fruit-market town and mountain road junction connecting Nainital, Bhimtal, Almora, and Mukteshwar.",
        "radius_deg": 0.035
    },
    {
        "id": "naukuchiatal",
        "name": "Naukuchiatal",
        "district": "Nainital",
        "division": "Kumaon",
        "lat": 29.3197,
        "lon": 79.5842,
        "elevation_m": 1220,
        "description": "Tranquil nine-cornered lake nestled among oak-forested hills, feed by underground perennial springs.",
        "radius_deg": 0.03
    },
    {
        "id": "sattal",
        "name": "Sattal",
        "district": "Nainital",
        "division": "Kumaon",
        "lat": 29.3514,
        "lon": 79.5333,
        "elevation_m": 1370,
        "description": "Interconnected cluster of seven freshwater lakes set amidst dense pine and oak forests.",
        "radius_deg": 0.03
    },
    {
        "id": "haldwani",
        "name": "Haldwani",
        "district": "Nainital",
        "division": "Kumaon",
        "lat": 29.2183,
        "lon": 79.5130,
        "elevation_m": 424,
        "description": "Largest commercial city in Kumaon situated in the Bhabhar foothills; crucial transit and logistics hub.",
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
        "description": "Gateway city to Jim Corbett National Park situated along the Kosi river.",
        "radius_deg": 0.045
    },
    {
        "id": "kaladhungi",
        "name": "Kaladhungi",
        "district": "Nainital",
        "division": "Kumaon",
        "lat": 29.2833,
        "lon": 79.3500,
        "elevation_m": 393,
        "description": "Foothill settlement famous for the Jim Corbett winter home museum and lush mango orchards.",
        "radius_deg": 0.04
    },
    {
        "id": "lalkuan",
        "name": "Lalkuan",
        "district": "Nainital",
        "division": "Kumaon",
        "lat": 29.0800,
        "lon": 79.5200,
        "elevation_m": 256,
        "description": "Major railway junction and industrial center in southern Nainital district.",
        "radius_deg": 0.04
    },

    # =========================================================================
    # 2. CHAMOLI DISTRICT (Garhwal Division)
    # =========================================================================
    {
        "id": "joshimath",
        "name": "Joshimath",
        "district": "Chamoli",
        "division": "Garhwal",
        "lat": 30.5566,
        "lon": 79.5644,
        "elevation_m": 1890,
        "description": "Gateway to Badrinath and Valley of Flowers. High-priority area for ground subsidence & slope stability monitoring.",
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
        "description": "High-altitude alpine bugyals and ski slopes directly facing the western face of Nanda Devi.",
        "radius_deg": 0.035
    },
    {
        "id": "gopeshwar",
        "name": "Gopeshwar",
        "district": "Chamoli",
        "division": "Garhwal",
        "lat": 30.4167,
        "lon": 79.3333,
        "elevation_m": 1550,
        "description": "Administrative headquarters of Chamoli district famous for the ancient Gopinath temple.",
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
        "description": "Confluence of Alaknanda and Pindar rivers; key hydrological transit corridor in Garhwal.",
        "radius_deg": 0.04
    },
    {
        "id": "nandaprayag",
        "name": "Nandaprayag",
        "district": "Chamoli",
        "division": "Garhwal",
        "lat": 30.3300,
        "lon": 79.3200,
        "elevation_m": 870,
        "description": "Sacred confluence of Alaknanda and Nandakini rivers in the middle Garhwal valley.",
        "radius_deg": 0.035
    },
    {
        "id": "gauchar",
        "name": "Gauchar",
        "district": "Chamoli",
        "division": "Garhwal",
        "lat": 30.2900,
        "lon": 79.1600,
        "elevation_m": 800,
        "description": "River valley town with historical airstrip, trade fair grounds, and disaster relief airbase.",
        "radius_deg": 0.04
    },
    {
        "id": "pipalkoti",
        "name": "Pipalkoti",
        "district": "Chamoli",
        "division": "Garhwal",
        "lat": 30.4300,
        "lon": 79.4300,
        "elevation_m": 1260,
        "description": "Major transit town on the Rishikesh-Badrinath National Highway in the deep Alaknanda gorge.",
        "radius_deg": 0.035
    },
    {
        "id": "tharali",
        "name": "Tharali",
        "district": "Chamoli",
        "division": "Garhwal",
        "lat": 30.0700,
        "lon": 79.4800,
        "elevation_m": 1150,
        "description": "Commercial and administrative center of the upper Pindar river valley.",
        "radius_deg": 0.04
    },
    {
        "id": "gwaldam",
        "name": "Gwaldam",
        "district": "Chamoli",
        "division": "Garhwal",
        "lat": 30.0200,
        "lon": 79.5700,
        "elevation_m": 1940,
        "description": "Pristine hill station situated right on the border of Garhwal and Kumaon amidst apple orchards.",
        "radius_deg": 0.035
    },
    {
        "id": "govindghat",
        "name": "Govindghat",
        "district": "Chamoli",
        "division": "Garhwal",
        "lat": 30.6250,
        "lon": 79.5580,
        "elevation_m": 1828,
        "description": "Confluence of Alaknanda and Bhyundar Ganga; trailhead for Hemkund Sahib and Valley of Flowers.",
        "radius_deg": 0.03
    },
    {
        "id": "mana",
        "name": "Mana",
        "district": "Chamoli",
        "division": "Garhwal",
        "lat": 30.7700,
        "lon": 79.4950,
        "elevation_m": 3219,
        "description": "India's first border village near the Indo-Tibetan border on the banks of Saraswati river.",
        "radius_deg": 0.03
    },

    # =========================================================================
    # 3. RUDRAPRAYAG DISTRICT (Garhwal Division)
    # =========================================================================
    {
        "id": "rudraprayag",
        "name": "Rudraprayag",
        "district": "Rudraprayag",
        "division": "Garhwal",
        "lat": 30.2844,
        "lon": 78.9811,
        "elevation_m": 895,
        "description": "Confluence of Alaknanda and Mandakini rivers; primary nexus for Kedarnath and Badrinath routes.",
        "radius_deg": 0.04
    },
    {
        "id": "kedarnath",
        "name": "Kedarnath",
        "district": "Rudraprayag",
        "division": "Garhwal",
        "lat": 30.7352,
        "lon": 79.0669,
        "elevation_m": 3584,
        "description": "Glacial valley temple settlement near Chorabari Glacier; critical area for glacial lake and moraine monitoring.",
        "radius_deg": 0.04
    },
    {
        "id": "ukhimath",
        "name": "Ukhimath",
        "district": "Rudraprayag",
        "division": "Garhwal",
        "lat": 30.5100,
        "lon": 79.0900,
        "elevation_m": 1311,
        "description": "Winter seat of Lord Kedarnath overlooking the high peaks of Chaukhamba and Mandakini valley.",
        "radius_deg": 0.035
    },
    {
        "id": "guptkashi",
        "name": "Guptkashi",
        "district": "Rudraprayag",
        "division": "Garhwal",
        "lat": 30.5200,
        "lon": 79.0800,
        "elevation_m": 1319,
        "description": "Ancient temple town on the ridge above the Mandakini river on the Kedarnath highway.",
        "radius_deg": 0.035
    },
    {
        "id": "agastyamuni",
        "name": "Agastyamuni",
        "district": "Rudraprayag",
        "division": "Garhwal",
        "lat": 30.3900,
        "lon": 78.9800,
        "elevation_m": 1000,
        "description": "Vibrant valley town with major helicopter airbases and stadium along the Mandakini river.",
        "radius_deg": 0.04
    },
    {
        "id": "sonprayag",
        "name": "Sonprayag",
        "district": "Rudraprayag",
        "division": "Garhwal",
        "lat": 30.6300,
        "lon": 78.9900,
        "elevation_m": 1829,
        "description": "Sacred confluence of Mandakini and Basuki rivers; key checkpoint for Kedarnath pilgrims.",
        "radius_deg": 0.035
    },
    {
        "id": "gaurikund",
        "name": "Gaurikund",
        "district": "Rudraprayag",
        "division": "Garhwal",
        "lat": 30.6500,
        "lon": 79.0200,
        "elevation_m": 1982,
        "description": "Thermal springs town and traditional foot-trek base camp for the Kedarnath pilgrimage.",
        "radius_deg": 0.03
    },
    {
        "id": "chopta",
        "name": "Chopta",
        "district": "Rudraprayag",
        "division": "Garhwal",
        "lat": 30.4850,
        "lon": 79.1780,
        "elevation_m": 2680,
        "description": "Renowned high alpine meadow ('Mini Switzerland of Uttarakhand') and base for Tungnath temple.",
        "radius_deg": 0.035
    },

    # =========================================================================
    # 4. ALMORA DISTRICT (Kumaon Division)
    # =========================================================================
    {
        "id": "almora",
        "name": "Almora",
        "district": "Almora",
        "division": "Kumaon",
        "lat": 29.5971,
        "lon": 79.6591,
        "elevation_m": 1638,
        "description": "Cultural heart of Kumaon situated on a horse-saddle shaped ridge surrounded by dense pine and oak forests.",
        "radius_deg": 0.04
    },
    {
        "id": "ranikhet",
        "name": "Ranikhet",
        "district": "Almora",
        "division": "Kumaon",
        "lat": 29.6433,
        "lon": 79.4322,
        "elevation_m": 1869,
        "description": "Historic cantonment hill station home to Kumaon Regiment, famed for pine forests and Himalayan vistas.",
        "radius_deg": 0.04
    },
    {
        "id": "dwarahat",
        "name": "Dwarahat",
        "district": "Almora",
        "division": "Kumaon",
        "lat": 29.7800,
        "lon": 79.4300,
        "elevation_m": 1510,
        "description": "Historical temple town housing 55 ancient Katyuri temples and higher education centers.",
        "radius_deg": 0.035
    },
    {
        "id": "chaukhutia",
        "name": "Chaukhutia",
        "district": "Almora",
        "division": "Kumaon",
        "lat": 29.8800,
        "lon": 79.3500,
        "elevation_m": 925,
        "description": "Important agricultural valley town situated along the upper Ramganga river.",
        "radius_deg": 0.04
    },
    {
        "id": "jageshwar",
        "name": "Jageshwar",
        "district": "Almora",
        "division": "Kumaon",
        "lat": 29.6400,
        "lon": 79.8500,
        "elevation_m": 1870,
        "description": "Cluster of 124 stone temples dating from 7th to 14th century set in a narrow deodar valley.",
        "radius_deg": 0.035
    },
    {
        "id": "someshwar",
        "name": "Someshwar",
        "district": "Almora",
        "division": "Kumaon",
        "lat": 29.7700,
        "lon": 79.6000,
        "elevation_m": 1465,
        "description": "Fertile river valley town famous for rice cultivation and scenic Kumaoni countryside.",
        "radius_deg": 0.035
    },
    {
        "id": "majkhali",
        "name": "Majkhali",
        "district": "Almora",
        "division": "Kumaon",
        "lat": 29.6700,
        "lon": 79.5200,
        "elevation_m": 1850,
        "description": "Picturesque hill village near Ranikhet offering direct views of the snow-capped Trishul peak.",
        "radius_deg": 0.03
    },

    # =========================================================================
    # 5. DEHRADUN DISTRICT (Garhwal Division)
    # =========================================================================
    {
        "id": "dehradun",
        "name": "Dehradun",
        "district": "Dehradun",
        "division": "Garhwal",
        "lat": 30.3165,
        "lon": 78.0322,
        "elevation_m": 450,
        "description": "Capital city of Uttarakhand situated in the Doon Valley between the Himalayas and the Shivaliks.",
        "radius_deg": 0.05
    },
    {
        "id": "mussoorie",
        "name": "Mussoorie",
        "district": "Dehradun",
        "division": "Garhwal",
        "lat": 30.4598,
        "lon": 78.0644,
        "elevation_m": 2005,
        "description": "'Queen of the Hills' perched on a ridge of the Garhwal Himalayas overlooking the Doon Valley.",
        "radius_deg": 0.04
    },
    {
        "id": "landour",
        "name": "Landour",
        "district": "Dehradun",
        "division": "Garhwal",
        "lat": 30.4600,
        "lon": 78.0900,
        "elevation_m": 2250,
        "description": "Quiet, historic British-era cantonment town contiguous with Mussoorie with dense deodar woods.",
        "radius_deg": 0.03
    },
    {
        "id": "rishikesh",
        "name": "Rishikesh",
        "district": "Dehradun",
        "division": "Garhwal",
        "lat": 30.0869,
        "lon": 78.2676,
        "elevation_m": 372,
        "description": "World-famous yoga capital and spiritual center where the sacred Ganges leaves the Himalayas for the plains.",
        "radius_deg": 0.045
    },
    {
        "id": "vikasnagar",
        "name": "Vikas Nagar",
        "district": "Dehradun",
        "division": "Garhwal",
        "lat": 30.4300,
        "lon": 77.7700,
        "elevation_m": 452,
        "description": "Vibrant agricultural and trade hub in the western Doon Valley near the Yamuna river.",
        "radius_deg": 0.045
    },
    {
        "id": "chakrata",
        "name": "Chakrata",
        "district": "Dehradun",
        "division": "Garhwal",
        "lat": 30.7000,
        "lon": 77.8700,
        "elevation_m": 2118,
        "description": "Secluded cantonment town in the Jaunsar-Bawar region renowned for coniferous forests and Tiger Falls.",
        "radius_deg": 0.04
    },
    {
        "id": "doiwala",
        "name": "Doiwala",
        "district": "Dehradun",
        "division": "Garhwal",
        "lat": 30.1800,
        "lon": 78.1200,
        "elevation_m": 435,
        "description": "Industrial town and key transportation junction near Dehradun Jolly Grant Airport.",
        "radius_deg": 0.04
    },
    {
        "id": "herbertpur",
        "name": "Herbertpur",
        "district": "Dehradun",
        "division": "Garhwal",
        "lat": 30.4400,
        "lon": 77.7400,
        "elevation_m": 420,
        "description": "Border trade junction on the Himachal-Uttarakhand state boundary.",
        "radius_deg": 0.035
    },
    {
        "id": "clement_town",
        "name": "Clement Town",
        "district": "Dehradun",
        "division": "Garhwal",
        "lat": 30.2670,
        "lon": 78.0100,
        "elevation_m": 580,
        "description": "Cantonment and educational hub in southern Dehradun home to Mindrolling Monastery.",
        "radius_deg": 0.035
    },

    # =========================================================================
    # 6. HARIDWAR DISTRICT (Garhwal Division)
    # =========================================================================
    {
        "id": "haridwar",
        "name": "Haridwar",
        "district": "Haridwar",
        "division": "Garhwal",
        "lat": 29.9457,
        "lon": 78.1642,
        "elevation_m": 314,
        "description": "Ancient holy pilgrimage city on the banks of the Ganges and gateway to the Char Dham.",
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
        "description": "Premier engineering and scientific center home to IIT Roorkee and National Institute of Hydrology.",
        "radius_deg": 0.05
    },
    {
        "id": "laksar",
        "name": "Laksar",
        "district": "Haridwar",
        "division": "Garhwal",
        "lat": 29.7500,
        "lon": 78.0300,
        "elevation_m": 250,
        "description": "Key railway junction and major sugar manufacturing hub in the southern plains.",
        "radius_deg": 0.04
    },
    {
        "id": "manglaur",
        "name": "Manglaur",
        "district": "Haridwar",
        "division": "Garhwal",
        "lat": 29.7900,
        "lon": 77.8700,
        "elevation_m": 260,
        "description": "Historic town in southern Haridwar near the Upper Ganges Canal.",
        "radius_deg": 0.04
    },
    {
        "id": "bhagwanpur",
        "name": "Bhagwanpur",
        "district": "Haridwar",
        "division": "Garhwal",
        "lat": 30.0400,
        "lon": 77.8100,
        "elevation_m": 275,
        "description": "Rapidly expanding industrial manufacturing hub bordering Uttar Pradesh.",
        "radius_deg": 0.04
    },

    # =========================================================================
    # 7. TEHRI GARHWAL DISTRICT (Garhwal Division)
    # =========================================================================
    {
        "id": "new_tehri",
        "name": "New Tehri",
        "district": "Tehri Garhwal",
        "division": "Garhwal",
        "lat": 30.3800,
        "lon": 78.4800,
        "elevation_m": 1750,
        "description": "Modern planned district headquarters overlooking the massive Tehri Dam reservoir lake.",
        "radius_deg": 0.04
    },
    {
        "id": "chamba_tehri",
        "name": "Chamba",
        "district": "Tehri Garhwal",
        "division": "Garhwal",
        "lat": 30.3400,
        "lon": 78.3900,
        "elevation_m": 1676,
        "description": "Strategic mountain crossroads linking Rishikesh, New Tehri, Mussoorie, and Uttarkashi.",
        "radius_deg": 0.035
    },
    {
        "id": "dhanaulti",
        "name": "Dhanaulti",
        "district": "Tehri Garhwal",
        "division": "Garhwal",
        "lat": 30.4500,
        "lon": 78.2400,
        "elevation_m": 2286,
        "description": "High ridge alpine retreat surrounded by dense deodar, oak, and rhododendron forests.",
        "radius_deg": 0.035
    },
    {
        "id": "narendranagar",
        "name": "Narendranagar",
        "district": "Tehri Garhwal",
        "division": "Garhwal",
        "lat": 30.1600,
        "lon": 78.2800,
        "elevation_m": 1120,
        "description": "Historic royal capital of the Tehri Garhwal kingdom commanding panoramic views of the Doon Valley.",
        "radius_deg": 0.035
    },
    {
        "id": "devprayag",
        "name": "Devprayag",
        "district": "Tehri Garhwal",
        "division": "Garhwal",
        "lat": 30.1458,
        "lon": 78.5989,
        "elevation_m": 472,
        "description": "Holy confluence where the Alaknanda and Bhagirathi rivers merge to officially form the Ganges river.",
        "radius_deg": 0.035
    },
    {
        "id": "ghansali",
        "name": "Ghansali",
        "district": "Tehri Garhwal",
        "division": "Garhwal",
        "lat": 30.4300,
        "lon": 78.6500,
        "elevation_m": 975,
        "description": "Bhilangna river valley hub connecting western Tehri to Rudraprayag.",
        "radius_deg": 0.035
    },
    {
        "id": "kirtinagar",
        "name": "Kirtinagar",
        "district": "Tehri Garhwal",
        "division": "Garhwal",
        "lat": 30.2100,
        "lon": 78.7500,
        "elevation_m": 550,
        "description": "Valley town on the western bank of the Alaknanda opposite Srinagar Garhwal.",
        "radius_deg": 0.035
    },

    # =========================================================================
    # 8. UTTARKASHI DISTRICT (Garhwal Division)
    # =========================================================================
    {
        "id": "uttarkashi",
        "name": "Uttarkashi",
        "district": "Uttarkashi",
        "division": "Garhwal",
        "lat": 30.7268,
        "lon": 78.4354,
        "elevation_m": 1158,
        "description": "Major Himalayan valley town on the Bhagirathi river, home to Nehru Institute of Mountaineering.",
        "radius_deg": 0.045
    },
    {
        "id": "gangotri",
        "name": "Gangotri",
        "district": "Uttarkashi",
        "division": "Garhwal",
        "lat": 30.9947,
        "lon": 78.9398,
        "elevation_m": 3100,
        "description": "High Himalayan shrine and gateway to Gaumukh Glacier, the physical source of the Bhagirathi river.",
        "radius_deg": 0.04
    },
    {
        "id": "yamunotri",
        "name": "Yamunotri",
        "district": "Uttarkashi",
        "division": "Garhwal",
        "lat": 30.9900,
        "lon": 78.4600,
        "elevation_m": 3293,
        "description": "High Himalayan origin of the sacred Yamuna river near Kalind Mountain and thermal springs of Surya Kund.",
        "radius_deg": 0.035
    },
    {
        "id": "barkot",
        "name": "Barkot",
        "district": "Uttarkashi",
        "division": "Garhwal",
        "lat": 30.8100,
        "lon": 78.2000,
        "elevation_m": 1220,
        "description": "Major junction on the Yamunotri pilgrimage route with views of Bandarpoonch peak.",
        "radius_deg": 0.04
    },
    {
        "id": "purola",
        "name": "Purola",
        "district": "Uttarkashi",
        "division": "Garhwal",
        "lat": 30.8800,
        "lon": 78.0800,
        "elevation_m": 1524,
        "description": "Serene agricultural town in the fertile Kamal river valley surrounded by cedar forests.",
        "radius_deg": 0.04
    },
    {
        "id": "mori",
        "name": "Mori",
        "district": "Uttarkashi",
        "division": "Garhwal",
        "lat": 31.0200,
        "lon": 78.0400,
        "elevation_m": 1150,
        "description": "River rafting and adventure center situated on the banks of the rushing Tons river.",
        "radius_deg": 0.035
    },
    {
        "id": "harsil",
        "name": "Harsil",
        "district": "Uttarkashi",
        "division": "Garhwal",
        "lat": 31.0360,
        "lon": 78.7360,
        "elevation_m": 2620,
        "description": "Unspoiled Himalayan hamlet famous for apple orchards and deodar woods on the Bhagirathi river.",
        "radius_deg": 0.035
    },
    {
        "id": "bhatwari",
        "name": "Bhatwari",
        "district": "Uttarkashi",
        "division": "Garhwal",
        "lat": 30.8200,
        "lon": 78.6200,
        "elevation_m": 1218,
        "description": "Transit town and administrative subdivision on the highway leading to Gangotri.",
        "radius_deg": 0.035
    },

    # =========================================================================
    # 9. PAURI GARHWAL DISTRICT (Garhwal Division)
    # =========================================================================
    {
        "id": "pauri",
        "name": "Pauri",
        "district": "Pauri Garhwal",
        "division": "Garhwal",
        "lat": 30.1500,
        "lon": 78.7800,
        "elevation_m": 1814,
        "description": "Administrative headquarters of Garhwal division commanding panoramic vistas of snow-capped peaks.",
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
        "description": "Largest educational and cultural center in Garhwal valley, home to HNB Garhwal University on the Alaknanda.",
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
        "description": "'Gateway to Garhwal' situated at the base of the Shivalik range along the Khoh river.",
        "radius_deg": 0.045
    },
    {
        "id": "lansdowne",
        "name": "Lansdowne",
        "district": "Pauri Garhwal",
        "division": "Garhwal",
        "lat": 29.8377,
        "lon": 78.6871,
        "elevation_m": 1706,
        "description": "Historic Garhwal Rifles regimental center with pristine blue pine and oak forests.",
        "radius_deg": 0.035
    },
    {
        "id": "satpuli",
        "name": "Satpuli",
        "district": "Pauri Garhwal",
        "division": "Garhwal",
        "lat": 29.9200,
        "lon": 78.7000,
        "elevation_m": 657,
        "description": "Centrally located valley crossroads on the banks of the Purvi Nayar river.",
        "radius_deg": 0.035
    },
    {
        "id": "dugadda",
        "name": "Dugadda",
        "district": "Pauri Garhwal",
        "division": "Garhwal",
        "lat": 29.8000,
        "lon": 78.6100,
        "elevation_m": 832,
        "description": "Historic foothill town at the confluence of Silgad and Rawasan rivers.",
        "radius_deg": 0.035
    },

    # =========================================================================
    # 10. BAGESHWAR DISTRICT (Kumaon Division)
    # =========================================================================
    {
        "id": "bageshwar",
        "name": "Bageshwar",
        "district": "Bageshwar",
        "division": "Kumaon",
        "lat": 29.8400,
        "lon": 79.7700,
        "elevation_m": 1004,
        "description": "Confluence of Saryu and Gomati rivers, renowned for the ancient Bagnath temple and Uttarayani fair.",
        "radius_deg": 0.04
    },
    {
        "id": "kausani",
        "name": "Kausani",
        "district": "Bageshwar",
        "division": "Kumaon",
        "lat": 29.8544,
        "lon": 79.6000,
        "elevation_m": 1890,
        "description": "'Switzerland of India' celebrated for expansive views of Trishul, Nanda Devi, and Panchachuli peaks.",
        "radius_deg": 0.035
    },
    {
        "id": "baijnath",
        "name": "Baijnath",
        "district": "Bageshwar",
        "division": "Kumaon",
        "lat": 29.9078,
        "lon": 79.6178,
        "elevation_m": 1125,
        "description": "Ancient 12th-century temple complex of the Katyuri dynasty situated on the banks of the Gomati river.",
        "radius_deg": 0.035
    },
    {
        "id": "kapkot",
        "name": "Kapkot",
        "district": "Bageshwar",
        "division": "Kumaon",
        "lat": 29.9400,
        "lon": 79.9000,
        "elevation_m": 1080,
        "description": "Gateway to the world-famous Pindari, Sunderdhunga, and Kafni Glaciers in high Kumaon.",
        "radius_deg": 0.04
    },

    # =========================================================================
    # 11. PITHORAGARH DISTRICT (Kumaon Division)
    # =========================================================================
    {
        "id": "pithoragarh",
        "name": "Pithoragarh",
        "district": "Pithoragarh",
        "division": "Kumaon",
        "lat": 29.5800,
        "lon": 80.2200,
        "elevation_m": 1627,
        "description": "Largest town in eastern Kumaon located in the picturesque Soar Valley, often called 'Little Kashmir'.",
        "radius_deg": 0.045
    },
    {
        "id": "dharchula",
        "name": "Dharchula",
        "district": "Pithoragarh",
        "division": "Kumaon",
        "lat": 29.8500,
        "lon": 80.5333,
        "elevation_m": 915,
        "description": "Strategic border town along the roaring Kali river opposite Nepal, on the Kailash Mansarovar route.",
        "radius_deg": 0.04
    },
    {
        "id": "munsiyari",
        "name": "Munsiyari",
        "district": "Pithoragarh",
        "division": "Kumaon",
        "lat": 30.0667,
        "lon": 80.2333,
        "elevation_m": 2200,
        "description": "Sub-alpine town under the Panchachuli peaks; base for Milam, Ralam, and Namik Glaciers.",
        "radius_deg": 0.04
    },
    {
        "id": "didihat",
        "name": "Didihat",
        "district": "Pithoragarh",
        "division": "Kumaon",
        "lat": 29.9700,
        "lon": 80.2500,
        "elevation_m": 1725,
        "description": "Scenic hilltop town amidst verdant valleys with views of the Panchachuli range.",
        "radius_deg": 0.035
    },
    {
        "id": "berinag",
        "name": "Berinag",
        "district": "Pithoragarh",
        "division": "Kumaon",
        "lat": 29.8000,
        "lon": 80.0500,
        "elevation_m": 1860,
        "description": "Famous for aromatic tea gardens and panoramic sunrise views over snow-clad Himalayan massifs.",
        "radius_deg": 0.035
    },
    {
        "id": "gangolihat",
        "name": "Gangolihat",
        "district": "Pithoragarh",
        "division": "Kumaon",
        "lat": 29.6600,
        "lon": 80.0500,
        "elevation_m": 1760,
        "description": "Historic religious town housing the sacred Hat Kalika temple, near Patal Bhuvaneshwar caves.",
        "radius_deg": 0.035
    },
    {
        "id": "jauljibi",
        "name": "Jauljibi",
        "district": "Pithoragarh",
        "division": "Kumaon",
        "lat": 29.7500,
        "lon": 80.3800,
        "elevation_m": 605,
        "description": "Famous trans-Himalayan confluence of the Gori and Kali rivers hosting the historic Indo-Nepal trade fair.",
        "radius_deg": 0.035
    },

    # =========================================================================
    # 12. CHAMPAWAT DISTRICT (Kumaon Division)
    # =========================================================================
    {
        "id": "champawat",
        "name": "Champawat",
        "district": "Champawat",
        "division": "Kumaon",
        "lat": 29.3346,
        "lon": 80.0911,
        "elevation_m": 1610,
        "description": "Ancient capital of the Chand dynasty rulers of Kumaon, home to Baleshwar temple and dense pine groves.",
        "radius_deg": 0.04
    },
    {
        "id": "lohaghat",
        "name": "Lohaghat",
        "district": "Champawat",
        "division": "Kumaon",
        "lat": 29.4100,
        "lon": 80.0900,
        "elevation_m": 1754,
        "description": "Charming town along the Lohawati river near Abbott Mount and Advaita Ashrama at Mayawati.",
        "radius_deg": 0.035
    },
    {
        "id": "tanakpur",
        "name": "Tanakpur",
        "district": "Champawat",
        "division": "Kumaon",
        "lat": 29.0722,
        "lon": 80.1111,
        "elevation_m": 255,
        "description": "Foothills terminal town on the Sharda river, starting point for the Purnagiri temple pilgrimage.",
        "radius_deg": 0.04
    },
    {
        "id": "banbasa",
        "name": "Banbasa",
        "district": "Champawat",
        "division": "Kumaon",
        "lat": 28.9800,
        "lon": 80.0800,
        "elevation_m": 218,
        "description": "Indo-Nepal border transit hub famous for the Sharda Barrage and canal system.",
        "radius_deg": 0.035
    },

    # =========================================================================
    # 13. UDHAM SINGH NAGAR DISTRICT (Kumaon Division)
    # =========================================================================
    {
        "id": "rudrapur",
        "name": "Rudrapur",
        "district": "Udham Singh Nagar",
        "division": "Kumaon",
        "lat": 28.9774,
        "lon": 79.4004,
        "elevation_m": 205,
        "description": "Major industrial metropolis and administrative headquarters of Udham Singh Nagar in the fertile Terai.",
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
        "description": "Historical Drona Sagar city and major economic/industrial powerhouse in southwestern Kumaon.",
        "radius_deg": 0.05
    },
    {
        "id": "pantnagar",
        "name": "Pantnagar",
        "district": "Udham Singh Nagar",
        "division": "Kumaon",
        "lat": 29.0200,
        "lon": 79.4900,
        "elevation_m": 230,
        "description": "Cradle of India's Green Revolution home to Govind Ballabh Pant University of Agriculture & Technology.",
        "radius_deg": 0.045
    },
    {
        "id": "kichha",
        "name": "Kichha",
        "district": "Udham Singh Nagar",
        "division": "Kumaon",
        "lat": 28.9100,
        "lon": 79.5100,
        "elevation_m": 202,
        "description": "Agricultural trading and processing center situated along the Bareilly-Nainital highway.",
        "radius_deg": 0.04
    },
    {
        "id": "khatima",
        "name": "Khatima",
        "district": "Udham Singh Nagar",
        "division": "Kumaon",
        "lat": 28.9200,
        "lon": 79.9700,
        "elevation_m": 210,
        "description": "Eastern Terai town bordering Nepal, rich in agriculture and forestry products.",
        "radius_deg": 0.045
    },
    {
        "id": "sitarganj",
        "name": "Sitarganj",
        "district": "Udham Singh Nagar",
        "division": "Kumaon",
        "lat": 28.9300,
        "lon": 79.7000,
        "elevation_m": 208,
        "description": "Rapidly growing industrial hub housing the large ELDECO SIDCUL industrial park in the Terai.",
        "radius_deg": 0.04
    },
    {
        "id": "bazpur",
        "name": "Bazpur",
        "district": "Udham Singh Nagar",
        "division": "Kumaon",
        "lat": 29.1500,
        "lon": 79.1200,
        "elevation_m": 226,
        "description": "Famous as India's first cooperative sugar mill town in the fertile grain-producing belt.",
        "radius_deg": 0.04
    },
    {
        "id": "jaspur",
        "name": "Jaspur",
        "district": "Udham Singh Nagar",
        "division": "Kumaon",
        "lat": 29.2800,
        "lon": 78.8200,
        "elevation_m": 240,
        "description": "Historical timber and agro-processing center in western Udham Singh Nagar.",
        "radius_deg": 0.04
    },
    {
        "id": "gadarpur",
        "name": "Gadarpur",
        "district": "Udham Singh Nagar",
        "division": "Kumaon",
        "lat": 29.0300,
        "lon": 79.2500,
        "elevation_m": 212,
        "description": "Vibrant agricultural trading town situated near the Haripura and Baur reservoirs.",
        "radius_deg": 0.04
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
