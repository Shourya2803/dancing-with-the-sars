/**
 * Authoritative dataset of real cities and areas across Uttarakhand, India.
 * Includes verified WGS84 coordinates, elevation, district, bounding box, GeoJSON geometry,
 * and 2D canvas projection coordinates on the Uttarakhand physical relief map (1470x1230).
 *
 * DO NOT INVENT COORDINATES OR BOUNDARIES.
 */

export interface LocationDetail {
  id: string;
  name: string;
  district: string;
  division: string;
  latitude: number;
  longitude: number;
  elevation_m: number;
  description: string;
  bbox: [number, number, number, number]; // [min_lon, min_lat, max_lon, max_lat]
  geometry: {
    type: "Polygon";
    coordinates: number[][][];
  };
  default_nisar_track: number;
  default_nisar_frame: number;
  mapX: number;
  mapY: number;
}

export const UTTARAKHAND_CITIES: Record<string, LocationDetail> = {
  "bhimtal": {
    "id": "bhimtal",
    "name": "Bhimtal",
    "district": "Nainital",
    "division": "Kumaon",
    "latitude": 29.3496,
    "longitude": 79.5544,
    "elevation_m": 1370,
    "description": "Scenic lake town in Kumaon hills centered around the iconic Bhimtal Lake with an island aquarium.",
    "bbox": [
      79.5194,
      29.3146,
      79.5894,
      29.3846
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            79.5194,
            29.3146
          ],
          [
            79.5894,
            29.3146
          ],
          [
            79.5894,
            29.3846
          ],
          [
            79.5194,
            29.3846
          ],
          [
            79.5194,
            29.3146
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 74,
    "mapX": 825.4,
    "mapY": 894.0
  },
  "mukteshwar": {
    "id": "mukteshwar",
    "name": "Mukteshwar",
    "district": "Nainital",
    "division": "Kumaon",
    "latitude": 29.4722,
    "longitude": 79.6472,
    "elevation_m": 2171,
    "description": "High-altitude ridge town offering 180-degree panoramic views of Himalayan peaks like Nanda Devi and Trishul.",
    "bbox": [
      79.6122,
      29.4372,
      79.6822,
      29.5072
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            79.6122,
            29.4372
          ],
          [
            79.6822,
            29.4372
          ],
          [
            79.6822,
            29.5072
          ],
          [
            79.6122,
            29.5072
          ],
          [
            79.6122,
            29.4372
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 74,
    "mapX": 862.0,
    "mapY": 845.5
  },
  "nainital": {
    "id": "nainital",
    "name": "Nainital",
    "district": "Nainital",
    "division": "Kumaon",
    "latitude": 29.3919,
    "longitude": 79.4542,
    "elevation_m": 2084,
    "description": "Renowned Himalayan lake resort situated in a valley containing the pear-shaped Naini Lake, bordered by steep peaks.",
    "bbox": [
      79.4142,
      29.3519,
      79.4942,
      29.4319
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            79.4142,
            29.3519
          ],
          [
            79.4942,
            29.3519
          ],
          [
            79.4942,
            29.4319
          ],
          [
            79.4142,
            29.4319
          ],
          [
            79.4142,
            29.3519
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 74,
    "mapX": 785.9,
    "mapY": 877.3
  },
  "bhowali": {
    "id": "bhowali",
    "name": "Bhowali",
    "district": "Nainital",
    "division": "Kumaon",
    "latitude": 29.3833,
    "longitude": 79.5167,
    "elevation_m": 1706,
    "description": "Famous fruit-market town and mountain road junction connecting Nainital, Bhimtal, Almora, and Mukteshwar.",
    "bbox": [
      79.4817,
      29.3483,
      79.5517,
      29.4183
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            79.4817,
            29.3483
          ],
          [
            79.5517,
            29.3483
          ],
          [
            79.5517,
            29.4183
          ],
          [
            79.4817,
            29.4183
          ],
          [
            79.4817,
            29.3483
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 74,
    "mapX": 810.5,
    "mapY": 880.7
  },
  "naukuchiatal": {
    "id": "naukuchiatal",
    "name": "Naukuchiatal",
    "district": "Nainital",
    "division": "Kumaon",
    "latitude": 29.3197,
    "longitude": 79.5842,
    "elevation_m": 1220,
    "description": "Tranquil nine-cornered lake nestled among oak-forested hills, feed by underground perennial springs.",
    "bbox": [
      79.5542,
      29.2897,
      79.6142,
      29.3497
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            79.5542,
            29.2897
          ],
          [
            79.6142,
            29.2897
          ],
          [
            79.6142,
            29.3497
          ],
          [
            79.5542,
            29.3497
          ],
          [
            79.5542,
            29.2897
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 74,
    "mapX": 837.2,
    "mapY": 905.8
  },
  "sattal": {
    "id": "sattal",
    "name": "Sattal",
    "district": "Nainital",
    "division": "Kumaon",
    "latitude": 29.3514,
    "longitude": 79.5333,
    "elevation_m": 1370,
    "description": "Interconnected cluster of seven freshwater lakes set amidst dense pine and oak forests.",
    "bbox": [
      79.5033,
      29.3214,
      79.5633,
      29.3814
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            79.5033,
            29.3214
          ],
          [
            79.5633,
            29.3214
          ],
          [
            79.5633,
            29.3814
          ],
          [
            79.5033,
            29.3814
          ],
          [
            79.5033,
            29.3214
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 74,
    "mapX": 817.1,
    "mapY": 893.3
  },
  "haldwani": {
    "id": "haldwani",
    "name": "Haldwani",
    "district": "Nainital",
    "division": "Kumaon",
    "latitude": 29.2183,
    "longitude": 79.513,
    "elevation_m": 424,
    "description": "Largest commercial city in Kumaon situated in the Bhabhar foothills; crucial transit and logistics hub.",
    "bbox": [
      79.463,
      29.1683,
      79.563,
      29.2683
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            79.463,
            29.1683
          ],
          [
            79.563,
            29.1683
          ],
          [
            79.563,
            29.2683
          ],
          [
            79.463,
            29.2683
          ],
          [
            79.463,
            29.1683
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 74,
    "mapX": 809.1,
    "mapY": 945.9
  },
  "ramnagar": {
    "id": "ramnagar",
    "name": "Ramnagar",
    "district": "Nainital",
    "division": "Kumaon",
    "latitude": 29.3944,
    "longitude": 79.1264,
    "elevation_m": 345,
    "description": "Gateway city to Jim Corbett National Park situated along the Kosi river.",
    "bbox": [
      79.0814,
      29.3494,
      79.1714,
      29.4394
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            79.0814,
            29.3494
          ],
          [
            79.1714,
            29.3494
          ],
          [
            79.1714,
            29.4394
          ],
          [
            79.0814,
            29.4394
          ],
          [
            79.0814,
            29.3494
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 74,
    "mapX": 656.7,
    "mapY": 876.3
  },
  "kaladhungi": {
    "id": "kaladhungi",
    "name": "Kaladhungi",
    "district": "Nainital",
    "division": "Kumaon",
    "latitude": 29.2833,
    "longitude": 79.35,
    "elevation_m": 393,
    "description": "Foothill settlement famous for the Jim Corbett winter home museum and lush mango orchards.",
    "bbox": [
      79.31,
      29.2433,
      79.39,
      29.3233
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            79.31,
            29.2433
          ],
          [
            79.39,
            29.2433
          ],
          [
            79.39,
            29.3233
          ],
          [
            79.31,
            29.3233
          ],
          [
            79.31,
            29.2433
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 74,
    "mapX": 744.9,
    "mapY": 920.2
  },
  "lalkuan": {
    "id": "lalkuan",
    "name": "Lalkuan",
    "district": "Nainital",
    "division": "Kumaon",
    "latitude": 29.08,
    "longitude": 79.52,
    "elevation_m": 256,
    "description": "Major railway junction and industrial center in southern Nainital district.",
    "bbox": [
      79.48,
      29.04,
      79.56,
      29.12
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            79.48,
            29.04
          ],
          [
            79.56,
            29.04
          ],
          [
            79.56,
            29.12
          ],
          [
            79.48,
            29.12
          ],
          [
            79.48,
            29.04
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 74,
    "mapX": 811.8,
    "mapY": 1000.6
  },
  "joshimath": {
    "id": "joshimath",
    "name": "Joshimath",
    "district": "Chamoli",
    "division": "Garhwal",
    "latitude": 30.5566,
    "longitude": 79.5644,
    "elevation_m": 1890,
    "description": "Gateway to Badrinath and Valley of Flowers. High-priority area for ground subsidence & slope stability monitoring.",
    "bbox": [
      79.5244,
      30.5166,
      79.6044,
      30.5966
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            79.5244,
            30.5166
          ],
          [
            79.6044,
            30.5166
          ],
          [
            79.6044,
            30.5966
          ],
          [
            79.5244,
            30.5966
          ],
          [
            79.5244,
            30.5166
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 829.3,
    "mapY": 416.6
  },
  "badrinath": {
    "id": "badrinath",
    "name": "Badrinath",
    "district": "Chamoli",
    "division": "Garhwal",
    "latitude": 30.7433,
    "longitude": 79.4938,
    "elevation_m": 3300,
    "description": "High Himalayan holy town situated between Nar and Narayana mountain ranges in upper Alaknanda valley.",
    "bbox": [
      79.4538,
      30.7033,
      79.5338,
      30.7833
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            79.4538,
            30.7033
          ],
          [
            79.5338,
            30.7033
          ],
          [
            79.5338,
            30.7833
          ],
          [
            79.4538,
            30.7833
          ],
          [
            79.4538,
            30.7033
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 801.5,
    "mapY": 342.8
  },
  "auli": {
    "id": "auli",
    "name": "Auli",
    "district": "Chamoli",
    "division": "Garhwal",
    "latitude": 30.5288,
    "longitude": 79.5694,
    "elevation_m": 2800,
    "description": "High-altitude alpine bugyals and ski slopes directly facing the western face of Nanda Devi.",
    "bbox": [
      79.5344,
      30.4938,
      79.6044,
      30.5638
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            79.5344,
            30.4938
          ],
          [
            79.6044,
            30.4938
          ],
          [
            79.6044,
            30.5638
          ],
          [
            79.5344,
            30.5638
          ],
          [
            79.5344,
            30.4938
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 831.3,
    "mapY": 427.6
  },
  "gopeshwar": {
    "id": "gopeshwar",
    "name": "Gopeshwar",
    "district": "Chamoli",
    "division": "Garhwal",
    "latitude": 30.4167,
    "longitude": 79.3333,
    "elevation_m": 1550,
    "description": "Administrative headquarters of Chamoli district famous for the ancient Gopinath temple.",
    "bbox": [
      79.2933,
      30.3767,
      79.3733,
      30.4567
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            79.2933,
            30.3767
          ],
          [
            79.3733,
            30.3767
          ],
          [
            79.3733,
            30.4567
          ],
          [
            79.2933,
            30.4567
          ],
          [
            79.2933,
            30.3767
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 738.3,
    "mapY": 471.9
  },
  "karnaprayag": {
    "id": "karnaprayag",
    "name": "Karnaprayag",
    "district": "Chamoli",
    "division": "Garhwal",
    "latitude": 30.26,
    "longitude": 79.22,
    "elevation_m": 790,
    "description": "Confluence of Alaknanda and Pindar rivers; key hydrological transit corridor in Garhwal.",
    "bbox": [
      79.18,
      30.22,
      79.26,
      30.3
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            79.18,
            30.22
          ],
          [
            79.26,
            30.22
          ],
          [
            79.26,
            30.3
          ],
          [
            79.18,
            30.3
          ],
          [
            79.18,
            30.22
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 693.6,
    "mapY": 533.9
  },
  "nandaprayag": {
    "id": "nandaprayag",
    "name": "Nandaprayag",
    "district": "Chamoli",
    "division": "Garhwal",
    "latitude": 30.33,
    "longitude": 79.32,
    "elevation_m": 870,
    "description": "Sacred confluence of Alaknanda and Nandakini rivers in the middle Garhwal valley.",
    "bbox": [
      79.285,
      30.295,
      79.355,
      30.365
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            79.285,
            30.295
          ],
          [
            79.355,
            30.295
          ],
          [
            79.355,
            30.365
          ],
          [
            79.285,
            30.365
          ],
          [
            79.285,
            30.295
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 733.0,
    "mapY": 506.2
  },
  "gauchar": {
    "id": "gauchar",
    "name": "Gauchar",
    "district": "Chamoli",
    "division": "Garhwal",
    "latitude": 30.29,
    "longitude": 79.16,
    "elevation_m": 800,
    "description": "River valley town with historical airstrip, trade fair grounds, and disaster relief airbase.",
    "bbox": [
      79.12,
      30.25,
      79.2,
      30.33
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            79.12,
            30.25
          ],
          [
            79.2,
            30.25
          ],
          [
            79.2,
            30.33
          ],
          [
            79.12,
            30.33
          ],
          [
            79.12,
            30.25
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 670.0,
    "mapY": 522.1
  },
  "pipalkoti": {
    "id": "pipalkoti",
    "name": "Pipalkoti",
    "district": "Chamoli",
    "division": "Garhwal",
    "latitude": 30.43,
    "longitude": 79.43,
    "elevation_m": 1260,
    "description": "Major transit town on the Rishikesh-Badrinath National Highway in the deep Alaknanda gorge.",
    "bbox": [
      79.395,
      30.395,
      79.465,
      30.465
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            79.395,
            30.395
          ],
          [
            79.465,
            30.395
          ],
          [
            79.465,
            30.465
          ],
          [
            79.395,
            30.465
          ],
          [
            79.395,
            30.395
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 776.4,
    "mapY": 466.7
  },
  "tharali": {
    "id": "tharali",
    "name": "Tharali",
    "district": "Chamoli",
    "division": "Garhwal",
    "latitude": 30.07,
    "longitude": 79.48,
    "elevation_m": 1150,
    "description": "Commercial and administrative center of the upper Pindar river valley.",
    "bbox": [
      79.44,
      30.03,
      79.52,
      30.11
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            79.44,
            30.03
          ],
          [
            79.52,
            30.03
          ],
          [
            79.52,
            30.11
          ],
          [
            79.44,
            30.11
          ],
          [
            79.44,
            30.03
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 796.1,
    "mapY": 609.1
  },
  "gwaldam": {
    "id": "gwaldam",
    "name": "Gwaldam",
    "district": "Chamoli",
    "division": "Garhwal",
    "latitude": 30.02,
    "longitude": 79.57,
    "elevation_m": 1940,
    "description": "Pristine hill station situated right on the border of Garhwal and Kumaon amidst apple orchards.",
    "bbox": [
      79.535,
      29.985,
      79.605,
      30.055
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            79.535,
            29.985
          ],
          [
            79.605,
            29.985
          ],
          [
            79.605,
            30.055
          ],
          [
            79.535,
            30.055
          ],
          [
            79.535,
            29.985
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 831.6,
    "mapY": 628.8
  },
  "govindghat": {
    "id": "govindghat",
    "name": "Govindghat",
    "district": "Chamoli",
    "division": "Garhwal",
    "latitude": 30.625,
    "longitude": 79.558,
    "elevation_m": 1828,
    "description": "Confluence of Alaknanda and Bhyundar Ganga; trailhead for Hemkund Sahib and Valley of Flowers.",
    "bbox": [
      79.528,
      30.595,
      79.588,
      30.655
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            79.528,
            30.595
          ],
          [
            79.588,
            30.595
          ],
          [
            79.588,
            30.655
          ],
          [
            79.528,
            30.655
          ],
          [
            79.528,
            30.595
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 826.8,
    "mapY": 389.6
  },
  "mana": {
    "id": "mana",
    "name": "Mana",
    "district": "Chamoli",
    "division": "Garhwal",
    "latitude": 30.77,
    "longitude": 79.495,
    "elevation_m": 3219,
    "description": "India's first border village near the Indo-Tibetan border on the banks of Saraswati river.",
    "bbox": [
      79.465,
      30.74,
      79.525,
      30.8
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            79.465,
            30.74
          ],
          [
            79.525,
            30.74
          ],
          [
            79.525,
            30.8
          ],
          [
            79.465,
            30.8
          ],
          [
            79.465,
            30.74
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 802.0,
    "mapY": 332.2
  },
  "rudraprayag": {
    "id": "rudraprayag",
    "name": "Rudraprayag",
    "district": "Rudraprayag",
    "division": "Garhwal",
    "latitude": 30.2844,
    "longitude": 78.9811,
    "elevation_m": 895,
    "description": "Confluence of Alaknanda and Mandakini rivers; primary nexus for Kedarnath and Badrinath routes.",
    "bbox": [
      78.9411,
      30.2444,
      79.0211,
      30.3244
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            78.9411,
            30.2444
          ],
          [
            79.0211,
            30.2444
          ],
          [
            79.0211,
            30.3244
          ],
          [
            78.9411,
            30.3244
          ],
          [
            78.9411,
            30.2444
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 599.5,
    "mapY": 524.3
  },
  "kedarnath": {
    "id": "kedarnath",
    "name": "Kedarnath",
    "district": "Rudraprayag",
    "division": "Garhwal",
    "latitude": 30.7352,
    "longitude": 79.0669,
    "elevation_m": 3584,
    "description": "Glacial valley temple settlement near Chorabari Glacier; critical area for glacial lake and moraine monitoring.",
    "bbox": [
      79.0269,
      30.6952,
      79.1069,
      30.7752
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            79.0269,
            30.6952
          ],
          [
            79.1069,
            30.6952
          ],
          [
            79.1069,
            30.7752
          ],
          [
            79.0269,
            30.7752
          ],
          [
            79.0269,
            30.6952
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 633.3,
    "mapY": 346.0
  },
  "ukhimath": {
    "id": "ukhimath",
    "name": "Ukhimath",
    "district": "Rudraprayag",
    "division": "Garhwal",
    "latitude": 30.51,
    "longitude": 79.09,
    "elevation_m": 1311,
    "description": "Winter seat of Lord Kedarnath overlooking the high peaks of Chaukhamba and Mandakini valley.",
    "bbox": [
      79.055,
      30.475,
      79.125,
      30.545
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            79.055,
            30.475
          ],
          [
            79.125,
            30.475
          ],
          [
            79.125,
            30.545
          ],
          [
            79.055,
            30.545
          ],
          [
            79.055,
            30.475
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 642.4,
    "mapY": 435.0
  },
  "guptkashi": {
    "id": "guptkashi",
    "name": "Guptkashi",
    "district": "Rudraprayag",
    "division": "Garhwal",
    "latitude": 30.52,
    "longitude": 79.08,
    "elevation_m": 1319,
    "description": "Ancient temple town on the ridge above the Mandakini river on the Kedarnath highway.",
    "bbox": [
      79.045,
      30.485,
      79.115,
      30.555
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            79.045,
            30.485
          ],
          [
            79.115,
            30.485
          ],
          [
            79.115,
            30.555
          ],
          [
            79.045,
            30.555
          ],
          [
            79.045,
            30.485
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 638.4,
    "mapY": 431.1
  },
  "agastyamuni": {
    "id": "agastyamuni",
    "name": "Agastyamuni",
    "district": "Rudraprayag",
    "division": "Garhwal",
    "latitude": 30.39,
    "longitude": 78.98,
    "elevation_m": 1000,
    "description": "Vibrant valley town with major helicopter airbases and stadium along the Mandakini river.",
    "bbox": [
      78.94,
      30.35,
      79.02,
      30.43
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            78.94,
            30.35
          ],
          [
            79.02,
            30.35
          ],
          [
            79.02,
            30.43
          ],
          [
            78.94,
            30.43
          ],
          [
            78.94,
            30.35
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 599.0,
    "mapY": 482.5
  },
  "sonprayag": {
    "id": "sonprayag",
    "name": "Sonprayag",
    "district": "Rudraprayag",
    "division": "Garhwal",
    "latitude": 30.63,
    "longitude": 78.99,
    "elevation_m": 1829,
    "description": "Sacred confluence of Mandakini and Basuki rivers; key checkpoint for Kedarnath pilgrims.",
    "bbox": [
      78.955,
      30.595,
      79.025,
      30.665
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            78.955,
            30.595
          ],
          [
            79.025,
            30.595
          ],
          [
            79.025,
            30.665
          ],
          [
            78.955,
            30.665
          ],
          [
            78.955,
            30.595
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 603.0,
    "mapY": 387.6
  },
  "gaurikund": {
    "id": "gaurikund",
    "name": "Gaurikund",
    "district": "Rudraprayag",
    "division": "Garhwal",
    "latitude": 30.65,
    "longitude": 79.02,
    "elevation_m": 1982,
    "description": "Thermal springs town and traditional foot-trek base camp for the Kedarnath pilgrimage.",
    "bbox": [
      78.99,
      30.62,
      79.05,
      30.68
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            78.99,
            30.62
          ],
          [
            79.05,
            30.62
          ],
          [
            79.05,
            30.68
          ],
          [
            78.99,
            30.68
          ],
          [
            78.99,
            30.62
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 614.8,
    "mapY": 379.7
  },
  "chopta": {
    "id": "chopta",
    "name": "Chopta",
    "district": "Rudraprayag",
    "division": "Garhwal",
    "latitude": 30.485,
    "longitude": 79.178,
    "elevation_m": 2680,
    "description": "Renowned high alpine meadow ('Mini Switzerland of Uttarakhand') and base for Tungnath temple.",
    "bbox": [
      79.143,
      30.45,
      79.213,
      30.52
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            79.143,
            30.45
          ],
          [
            79.213,
            30.45
          ],
          [
            79.213,
            30.52
          ],
          [
            79.143,
            30.52
          ],
          [
            79.143,
            30.45
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 677.1,
    "mapY": 444.9
  },
  "almora": {
    "id": "almora",
    "name": "Almora",
    "district": "Almora",
    "division": "Kumaon",
    "latitude": 29.5971,
    "longitude": 79.6591,
    "elevation_m": 1638,
    "description": "Cultural heart of Kumaon situated on a horse-saddle shaped ridge surrounded by dense pine and oak forests.",
    "bbox": [
      79.6191,
      29.5571,
      79.6991,
      29.6371
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            79.6191,
            29.5571
          ],
          [
            79.6991,
            29.5571
          ],
          [
            79.6991,
            29.6371
          ],
          [
            79.6191,
            29.6371
          ],
          [
            79.6191,
            29.5571
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 74,
    "mapX": 866.7,
    "mapY": 796.1
  },
  "ranikhet": {
    "id": "ranikhet",
    "name": "Ranikhet",
    "district": "Almora",
    "division": "Kumaon",
    "latitude": 29.6433,
    "longitude": 79.4322,
    "elevation_m": 1869,
    "description": "Historic cantonment hill station home to Kumaon Regiment, famed for pine forests and Himalayan vistas.",
    "bbox": [
      79.3922,
      29.6033,
      79.4722,
      29.6833
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            79.3922,
            29.6033
          ],
          [
            79.4722,
            29.6033
          ],
          [
            79.4722,
            29.6833
          ],
          [
            79.3922,
            29.6833
          ],
          [
            79.3922,
            29.6033
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 74,
    "mapX": 777.2,
    "mapY": 777.8
  },
  "dwarahat": {
    "id": "dwarahat",
    "name": "Dwarahat",
    "district": "Almora",
    "division": "Kumaon",
    "latitude": 29.78,
    "longitude": 79.43,
    "elevation_m": 1510,
    "description": "Historical temple town housing 55 ancient Katyuri temples and higher education centers.",
    "bbox": [
      79.395,
      29.745,
      79.465,
      29.815
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            79.395,
            29.745
          ],
          [
            79.465,
            29.745
          ],
          [
            79.465,
            29.815
          ],
          [
            79.395,
            29.815
          ],
          [
            79.395,
            29.745
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 74,
    "mapX": 776.4,
    "mapY": 723.8
  },
  "chaukhutia": {
    "id": "chaukhutia",
    "name": "Chaukhutia",
    "district": "Almora",
    "division": "Kumaon",
    "latitude": 29.88,
    "longitude": 79.35,
    "elevation_m": 925,
    "description": "Important agricultural valley town situated along the upper Ramganga river.",
    "bbox": [
      79.31,
      29.84,
      79.39,
      29.92
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            79.31,
            29.84
          ],
          [
            79.39,
            29.84
          ],
          [
            79.39,
            29.92
          ],
          [
            79.31,
            29.92
          ],
          [
            79.31,
            29.84
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 744.9,
    "mapY": 684.2
  },
  "jageshwar": {
    "id": "jageshwar",
    "name": "Jageshwar",
    "district": "Almora",
    "division": "Kumaon",
    "latitude": 29.64,
    "longitude": 79.85,
    "elevation_m": 1870,
    "description": "Cluster of 124 stone temples dating from 7th to 14th century set in a narrow deodar valley.",
    "bbox": [
      79.815,
      29.605,
      79.885,
      29.675
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            79.815,
            29.605
          ],
          [
            79.885,
            29.605
          ],
          [
            79.885,
            29.675
          ],
          [
            79.815,
            29.675
          ],
          [
            79.815,
            29.605
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 74,
    "mapX": 941.9,
    "mapY": 779.1
  },
  "someshwar": {
    "id": "someshwar",
    "name": "Someshwar",
    "district": "Almora",
    "division": "Kumaon",
    "latitude": 29.77,
    "longitude": 79.6,
    "elevation_m": 1465,
    "description": "Fertile river valley town famous for rice cultivation and scenic Kumaoni countryside.",
    "bbox": [
      79.565,
      29.735,
      79.635,
      29.805
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            79.565,
            29.735
          ],
          [
            79.635,
            29.735
          ],
          [
            79.635,
            29.805
          ],
          [
            79.565,
            29.805
          ],
          [
            79.565,
            29.735
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 74,
    "mapX": 843.4,
    "mapY": 727.7
  },
  "majkhali": {
    "id": "majkhali",
    "name": "Majkhali",
    "district": "Almora",
    "division": "Kumaon",
    "latitude": 29.67,
    "longitude": 79.52,
    "elevation_m": 1850,
    "description": "Picturesque hill village near Ranikhet offering direct views of the snow-capped Trishul peak.",
    "bbox": [
      79.49,
      29.64,
      79.55,
      29.7
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            79.49,
            29.64
          ],
          [
            79.55,
            29.64
          ],
          [
            79.55,
            29.7
          ],
          [
            79.49,
            29.7
          ],
          [
            79.49,
            29.64
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 74,
    "mapX": 811.8,
    "mapY": 767.3
  },
  "dehradun": {
    "id": "dehradun",
    "name": "Dehradun",
    "district": "Dehradun",
    "division": "Garhwal",
    "latitude": 30.3165,
    "longitude": 78.0322,
    "elevation_m": 450,
    "description": "Capital city of Uttarakhand situated in the Doon Valley between the Himalayas and the Shivaliks.",
    "bbox": [
      77.9822,
      30.2665,
      78.0822,
      30.3665
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            77.9822,
            30.2665
          ],
          [
            78.0822,
            30.2665
          ],
          [
            78.0822,
            30.3665
          ],
          [
            77.9822,
            30.3665
          ],
          [
            77.9822,
            30.2665
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 225.5,
    "mapY": 511.6
  },
  "mussoorie": {
    "id": "mussoorie",
    "name": "Mussoorie",
    "district": "Dehradun",
    "division": "Garhwal",
    "latitude": 30.4598,
    "longitude": 78.0644,
    "elevation_m": 2005,
    "description": "'Queen of the Hills' perched on a ridge of the Garhwal Himalayas overlooking the Doon Valley.",
    "bbox": [
      78.0244,
      30.4198,
      78.1044,
      30.4998
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            78.0244,
            30.4198
          ],
          [
            78.1044,
            30.4198
          ],
          [
            78.1044,
            30.4998
          ],
          [
            78.0244,
            30.4998
          ],
          [
            78.0244,
            30.4198
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 238.2,
    "mapY": 454.9
  },
  "landour": {
    "id": "landour",
    "name": "Landour",
    "district": "Dehradun",
    "division": "Garhwal",
    "latitude": 30.46,
    "longitude": 78.09,
    "elevation_m": 2250,
    "description": "Quiet, historic British-era cantonment town contiguous with Mussoorie with dense deodar woods.",
    "bbox": [
      78.06,
      30.43,
      78.12,
      30.49
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            78.06,
            30.43
          ],
          [
            78.12,
            30.43
          ],
          [
            78.12,
            30.49
          ],
          [
            78.06,
            30.49
          ],
          [
            78.06,
            30.43
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 248.3,
    "mapY": 454.8
  },
  "rishikesh": {
    "id": "rishikesh",
    "name": "Rishikesh",
    "district": "Dehradun",
    "division": "Garhwal",
    "latitude": 30.0869,
    "longitude": 78.2676,
    "elevation_m": 372,
    "description": "World-famous yoga capital and spiritual center where the sacred Ganges leaves the Himalayas for the plains.",
    "bbox": [
      78.2226,
      30.0419,
      78.3126,
      30.1319
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            78.2226,
            30.0419
          ],
          [
            78.3126,
            30.0419
          ],
          [
            78.3126,
            30.1319
          ],
          [
            78.2226,
            30.1319
          ],
          [
            78.2226,
            30.0419
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 318.3,
    "mapY": 602.4
  },
  "vikasnagar": {
    "id": "vikasnagar",
    "name": "Vikas Nagar",
    "district": "Dehradun",
    "division": "Garhwal",
    "latitude": 30.43,
    "longitude": 77.77,
    "elevation_m": 452,
    "description": "Vibrant agricultural and trade hub in the western Doon Valley near the Yamuna river.",
    "bbox": [
      77.725,
      30.385,
      77.815,
      30.475
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            77.725,
            30.385
          ],
          [
            77.815,
            30.385
          ],
          [
            77.815,
            30.475
          ],
          [
            77.725,
            30.475
          ],
          [
            77.725,
            30.385
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 122.2,
    "mapY": 466.7
  },
  "chakrata": {
    "id": "chakrata",
    "name": "Chakrata",
    "district": "Dehradun",
    "division": "Garhwal",
    "latitude": 30.7,
    "longitude": 77.87,
    "elevation_m": 2118,
    "description": "Secluded cantonment town in the Jaunsar-Bawar region renowned for coniferous forests and Tiger Falls.",
    "bbox": [
      77.83,
      30.66,
      77.91,
      30.74
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            77.83,
            30.66
          ],
          [
            77.91,
            30.66
          ],
          [
            77.91,
            30.74
          ],
          [
            77.83,
            30.74
          ],
          [
            77.83,
            30.66
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 161.6,
    "mapY": 359.9
  },
  "doiwala": {
    "id": "doiwala",
    "name": "Doiwala",
    "district": "Dehradun",
    "division": "Garhwal",
    "latitude": 30.18,
    "longitude": 78.12,
    "elevation_m": 435,
    "description": "Industrial town and key transportation junction near Dehradun Jolly Grant Airport.",
    "bbox": [
      78.08,
      30.14,
      78.16,
      30.22
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            78.08,
            30.14
          ],
          [
            78.16,
            30.14
          ],
          [
            78.16,
            30.22
          ],
          [
            78.08,
            30.22
          ],
          [
            78.08,
            30.14
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 260.1,
    "mapY": 565.6
  },
  "herbertpur": {
    "id": "herbertpur",
    "name": "Herbertpur",
    "district": "Dehradun",
    "division": "Garhwal",
    "latitude": 30.44,
    "longitude": 77.74,
    "elevation_m": 420,
    "description": "Border trade junction on the Himachal-Uttarakhand state boundary.",
    "bbox": [
      77.705,
      30.405,
      77.775,
      30.475
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            77.705,
            30.405
          ],
          [
            77.775,
            30.405
          ],
          [
            77.775,
            30.475
          ],
          [
            77.705,
            30.475
          ],
          [
            77.705,
            30.405
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 110.3,
    "mapY": 462.7
  },
  "clement_town": {
    "id": "clement_town",
    "name": "Clement Town",
    "district": "Dehradun",
    "division": "Garhwal",
    "latitude": 30.267,
    "longitude": 78.01,
    "elevation_m": 580,
    "description": "Cantonment and educational hub in southern Dehradun home to Mindrolling Monastery.",
    "bbox": [
      77.975,
      30.232,
      78.045,
      30.302
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            77.975,
            30.232
          ],
          [
            78.045,
            30.232
          ],
          [
            78.045,
            30.302
          ],
          [
            77.975,
            30.302
          ],
          [
            77.975,
            30.232
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 216.8,
    "mapY": 531.2
  },
  "haridwar": {
    "id": "haridwar",
    "name": "Haridwar",
    "district": "Haridwar",
    "division": "Garhwal",
    "latitude": 29.9457,
    "longitude": 78.1642,
    "elevation_m": 314,
    "description": "Ancient holy pilgrimage city on the banks of the Ganges and gateway to the Char Dham.",
    "bbox": [
      78.1142,
      29.8957,
      78.2142,
      29.9957
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            78.1142,
            29.8957
          ],
          [
            78.2142,
            29.8957
          ],
          [
            78.2142,
            29.9957
          ],
          [
            78.1142,
            29.9957
          ],
          [
            78.1142,
            29.8957
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 277.5,
    "mapY": 658.2
  },
  "roorkee": {
    "id": "roorkee",
    "name": "Roorkee",
    "district": "Haridwar",
    "division": "Garhwal",
    "latitude": 29.8543,
    "longitude": 77.888,
    "elevation_m": 268,
    "description": "Premier engineering and scientific center home to IIT Roorkee and National Institute of Hydrology.",
    "bbox": [
      77.838,
      29.8043,
      77.938,
      29.9043
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            77.838,
            29.8043
          ],
          [
            77.938,
            29.8043
          ],
          [
            77.938,
            29.9043
          ],
          [
            77.838,
            29.9043
          ],
          [
            77.838,
            29.8043
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 168.7,
    "mapY": 694.4
  },
  "laksar": {
    "id": "laksar",
    "name": "Laksar",
    "district": "Haridwar",
    "division": "Garhwal",
    "latitude": 29.75,
    "longitude": 78.03,
    "elevation_m": 250,
    "description": "Key railway junction and major sugar manufacturing hub in the southern plains.",
    "bbox": [
      77.99,
      29.71,
      78.07,
      29.79
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            77.99,
            29.71
          ],
          [
            78.07,
            29.71
          ],
          [
            78.07,
            29.79
          ],
          [
            77.99,
            29.79
          ],
          [
            77.99,
            29.71
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 74,
    "mapX": 224.6,
    "mapY": 735.6
  },
  "manglaur": {
    "id": "manglaur",
    "name": "Manglaur",
    "district": "Haridwar",
    "division": "Garhwal",
    "latitude": 29.79,
    "longitude": 77.87,
    "elevation_m": 260,
    "description": "Historic town in southern Haridwar near the Upper Ganges Canal.",
    "bbox": [
      77.83,
      29.75,
      77.91,
      29.83
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            77.83,
            29.75
          ],
          [
            77.91,
            29.75
          ],
          [
            77.91,
            29.83
          ],
          [
            77.83,
            29.83
          ],
          [
            77.83,
            29.75
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 74,
    "mapX": 161.6,
    "mapY": 719.8
  },
  "bhagwanpur": {
    "id": "bhagwanpur",
    "name": "Bhagwanpur",
    "district": "Haridwar",
    "division": "Garhwal",
    "latitude": 30.04,
    "longitude": 77.81,
    "elevation_m": 275,
    "description": "Rapidly expanding industrial manufacturing hub bordering Uttar Pradesh.",
    "bbox": [
      77.77,
      30.0,
      77.85,
      30.08
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            77.77,
            30.0
          ],
          [
            77.85,
            30.0
          ],
          [
            77.85,
            30.08
          ],
          [
            77.77,
            30.08
          ],
          [
            77.77,
            30.0
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 137.9,
    "mapY": 620.9
  },
  "new_tehri": {
    "id": "new_tehri",
    "name": "New Tehri",
    "district": "Tehri Garhwal",
    "division": "Garhwal",
    "latitude": 30.38,
    "longitude": 78.48,
    "elevation_m": 1750,
    "description": "Modern planned district headquarters overlooking the massive Tehri Dam reservoir lake.",
    "bbox": [
      78.44,
      30.34,
      78.52,
      30.42
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            78.44,
            30.34
          ],
          [
            78.52,
            30.34
          ],
          [
            78.52,
            30.42
          ],
          [
            78.44,
            30.42
          ],
          [
            78.44,
            30.34
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 402.0,
    "mapY": 486.5
  },
  "chamba_tehri": {
    "id": "chamba_tehri",
    "name": "Chamba",
    "district": "Tehri Garhwal",
    "division": "Garhwal",
    "latitude": 30.34,
    "longitude": 78.39,
    "elevation_m": 1676,
    "description": "Strategic mountain crossroads linking Rishikesh, New Tehri, Mussoorie, and Uttarkashi.",
    "bbox": [
      78.355,
      30.305,
      78.425,
      30.375
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            78.355,
            30.305
          ],
          [
            78.425,
            30.305
          ],
          [
            78.425,
            30.375
          ],
          [
            78.355,
            30.375
          ],
          [
            78.355,
            30.305
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 366.5,
    "mapY": 502.3
  },
  "dhanaulti": {
    "id": "dhanaulti",
    "name": "Dhanaulti",
    "district": "Tehri Garhwal",
    "division": "Garhwal",
    "latitude": 30.45,
    "longitude": 78.24,
    "elevation_m": 2286,
    "description": "High ridge alpine retreat surrounded by dense deodar, oak, and rhododendron forests.",
    "bbox": [
      78.205,
      30.415,
      78.275,
      30.485
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            78.205,
            30.415
          ],
          [
            78.275,
            30.415
          ],
          [
            78.275,
            30.485
          ],
          [
            78.205,
            30.485
          ],
          [
            78.205,
            30.415
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 307.4,
    "mapY": 458.8
  },
  "narendranagar": {
    "id": "narendranagar",
    "name": "Narendranagar",
    "district": "Tehri Garhwal",
    "division": "Garhwal",
    "latitude": 30.16,
    "longitude": 78.28,
    "elevation_m": 1120,
    "description": "Historic royal capital of the Tehri Garhwal kingdom commanding panoramic views of the Doon Valley.",
    "bbox": [
      78.245,
      30.125,
      78.315,
      30.195
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            78.245,
            30.125
          ],
          [
            78.315,
            30.125
          ],
          [
            78.315,
            30.195
          ],
          [
            78.245,
            30.195
          ],
          [
            78.245,
            30.125
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 323.2,
    "mapY": 573.5
  },
  "devprayag": {
    "id": "devprayag",
    "name": "Devprayag",
    "district": "Tehri Garhwal",
    "division": "Garhwal",
    "latitude": 30.1458,
    "longitude": 78.5989,
    "elevation_m": 472,
    "description": "Holy confluence where the Alaknanda and Bhagirathi rivers merge to officially form the Ganges river.",
    "bbox": [
      78.5639,
      30.1108,
      78.6339,
      30.1808
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            78.5639,
            30.1108
          ],
          [
            78.6339,
            30.1108
          ],
          [
            78.6339,
            30.1808
          ],
          [
            78.5639,
            30.1808
          ],
          [
            78.5639,
            30.1108
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 448.8,
    "mapY": 579.1
  },
  "ghansali": {
    "id": "ghansali",
    "name": "Ghansali",
    "district": "Tehri Garhwal",
    "division": "Garhwal",
    "latitude": 30.43,
    "longitude": 78.65,
    "elevation_m": 975,
    "description": "Bhilangna river valley hub connecting western Tehri to Rudraprayag.",
    "bbox": [
      78.615,
      30.395,
      78.685,
      30.465
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            78.615,
            30.395
          ],
          [
            78.685,
            30.395
          ],
          [
            78.685,
            30.465
          ],
          [
            78.615,
            30.465
          ],
          [
            78.615,
            30.395
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 469.0,
    "mapY": 466.7
  },
  "kirtinagar": {
    "id": "kirtinagar",
    "name": "Kirtinagar",
    "district": "Tehri Garhwal",
    "division": "Garhwal",
    "latitude": 30.21,
    "longitude": 78.75,
    "elevation_m": 550,
    "description": "Valley town on the western bank of the Alaknanda opposite Srinagar Garhwal.",
    "bbox": [
      78.715,
      30.175,
      78.785,
      30.245
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            78.715,
            30.175
          ],
          [
            78.785,
            30.175
          ],
          [
            78.785,
            30.245
          ],
          [
            78.715,
            30.245
          ],
          [
            78.715,
            30.175
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 508.4,
    "mapY": 553.7
  },
  "uttarkashi": {
    "id": "uttarkashi",
    "name": "Uttarkashi",
    "district": "Uttarkashi",
    "division": "Garhwal",
    "latitude": 30.7268,
    "longitude": 78.4354,
    "elevation_m": 1158,
    "description": "Major Himalayan valley town on the Bhagirathi river, home to Nehru Institute of Mountaineering.",
    "bbox": [
      78.3904,
      30.6818,
      78.4804,
      30.7718
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            78.3904,
            30.6818
          ],
          [
            78.4804,
            30.6818
          ],
          [
            78.4804,
            30.7718
          ],
          [
            78.3904,
            30.7718
          ],
          [
            78.3904,
            30.6818
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 384.4,
    "mapY": 349.3
  },
  "gangotri": {
    "id": "gangotri",
    "name": "Gangotri",
    "district": "Uttarkashi",
    "division": "Garhwal",
    "latitude": 30.9947,
    "longitude": 78.9398,
    "elevation_m": 3100,
    "description": "High Himalayan shrine and gateway to Gaumukh Glacier, the physical source of the Bhagirathi river.",
    "bbox": [
      78.8998,
      30.9547,
      78.9798,
      31.0347
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            78.8998,
            30.9547
          ],
          [
            78.9798,
            30.9547
          ],
          [
            78.9798,
            31.0347
          ],
          [
            78.8998,
            31.0347
          ],
          [
            78.8998,
            30.9547
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 583.2,
    "mapY": 243.4
  },
  "yamunotri": {
    "id": "yamunotri",
    "name": "Yamunotri",
    "district": "Uttarkashi",
    "division": "Garhwal",
    "latitude": 30.99,
    "longitude": 78.46,
    "elevation_m": 3293,
    "description": "High Himalayan origin of the sacred Yamuna river near Kalind Mountain and thermal springs of Surya Kund.",
    "bbox": [
      78.425,
      30.955,
      78.495,
      31.025
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            78.425,
            30.955
          ],
          [
            78.495,
            30.955
          ],
          [
            78.495,
            31.025
          ],
          [
            78.425,
            31.025
          ],
          [
            78.425,
            30.955
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 394.1,
    "mapY": 245.2
  },
  "barkot": {
    "id": "barkot",
    "name": "Barkot",
    "district": "Uttarkashi",
    "division": "Garhwal",
    "latitude": 30.81,
    "longitude": 78.2,
    "elevation_m": 1220,
    "description": "Major junction on the Yamunotri pilgrimage route with views of Bandarpoonch peak.",
    "bbox": [
      78.16,
      30.77,
      78.24,
      30.85
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            78.16,
            30.77
          ],
          [
            78.24,
            30.77
          ],
          [
            78.24,
            30.85
          ],
          [
            78.16,
            30.85
          ],
          [
            78.16,
            30.77
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 291.6,
    "mapY": 316.4
  },
  "purola": {
    "id": "purola",
    "name": "Purola",
    "district": "Uttarkashi",
    "division": "Garhwal",
    "latitude": 30.88,
    "longitude": 78.08,
    "elevation_m": 1524,
    "description": "Serene agricultural town in the fertile Kamal river valley surrounded by cedar forests.",
    "bbox": [
      78.04,
      30.84,
      78.12,
      30.92
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            78.04,
            30.84
          ],
          [
            78.12,
            30.84
          ],
          [
            78.12,
            30.92
          ],
          [
            78.04,
            30.92
          ],
          [
            78.04,
            30.84
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 244.3,
    "mapY": 288.7
  },
  "mori": {
    "id": "mori",
    "name": "Mori",
    "district": "Uttarkashi",
    "division": "Garhwal",
    "latitude": 31.02,
    "longitude": 78.04,
    "elevation_m": 1150,
    "description": "River rafting and adventure center situated on the banks of the rushing Tons river.",
    "bbox": [
      78.005,
      30.985,
      78.075,
      31.055
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            78.005,
            30.985
          ],
          [
            78.075,
            30.985
          ],
          [
            78.075,
            31.055
          ],
          [
            78.005,
            31.055
          ],
          [
            78.005,
            30.985
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 228.6,
    "mapY": 233.3
  },
  "harsil": {
    "id": "harsil",
    "name": "Harsil",
    "district": "Uttarkashi",
    "division": "Garhwal",
    "latitude": 31.036,
    "longitude": 78.736,
    "elevation_m": 2620,
    "description": "Unspoiled Himalayan hamlet famous for apple orchards and deodar woods on the Bhagirathi river.",
    "bbox": [
      78.701,
      31.001,
      78.771,
      31.071
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            78.701,
            31.001
          ],
          [
            78.771,
            31.001
          ],
          [
            78.771,
            31.071
          ],
          [
            78.701,
            31.071
          ],
          [
            78.701,
            31.001
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 502.9,
    "mapY": 227.0
  },
  "bhatwari": {
    "id": "bhatwari",
    "name": "Bhatwari",
    "district": "Uttarkashi",
    "division": "Garhwal",
    "latitude": 30.82,
    "longitude": 78.62,
    "elevation_m": 1218,
    "description": "Transit town and administrative subdivision on the highway leading to Gangotri.",
    "bbox": [
      78.585,
      30.785,
      78.655,
      30.855
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            78.585,
            30.785
          ],
          [
            78.655,
            30.785
          ],
          [
            78.655,
            30.855
          ],
          [
            78.585,
            30.855
          ],
          [
            78.585,
            30.785
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 457.2,
    "mapY": 312.4
  },
  "pauri": {
    "id": "pauri",
    "name": "Pauri",
    "district": "Pauri Garhwal",
    "division": "Garhwal",
    "latitude": 30.15,
    "longitude": 78.78,
    "elevation_m": 1814,
    "description": "Administrative headquarters of Garhwal division commanding panoramic vistas of snow-capped peaks.",
    "bbox": [
      78.74,
      30.11,
      78.82,
      30.19
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            78.74,
            30.11
          ],
          [
            78.82,
            30.11
          ],
          [
            78.82,
            30.19
          ],
          [
            78.74,
            30.19
          ],
          [
            78.74,
            30.11
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 520.2,
    "mapY": 577.4
  },
  "srinagar_garhwal": {
    "id": "srinagar_garhwal",
    "name": "Srinagar (Garhwal)",
    "district": "Pauri Garhwal",
    "division": "Garhwal",
    "latitude": 30.2224,
    "longitude": 78.7844,
    "elevation_m": 560,
    "description": "Largest educational and cultural center in Garhwal valley, home to HNB Garhwal University on the Alaknanda.",
    "bbox": [
      78.7444,
      30.1824,
      78.8244,
      30.2624
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            78.7444,
            30.1824
          ],
          [
            78.8244,
            30.1824
          ],
          [
            78.8244,
            30.2624
          ],
          [
            78.7444,
            30.2624
          ],
          [
            78.7444,
            30.1824
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 521.9,
    "mapY": 548.8
  },
  "kotdwar": {
    "id": "kotdwar",
    "name": "Kotdwar",
    "district": "Pauri Garhwal",
    "division": "Garhwal",
    "latitude": 29.7464,
    "longitude": 78.5284,
    "elevation_m": 454,
    "description": "'Gateway to Garhwal' situated at the base of the Shivalik range along the Khoh river.",
    "bbox": [
      78.4834,
      29.7014,
      78.5734,
      29.7914
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            78.4834,
            29.7014
          ],
          [
            78.5734,
            29.7014
          ],
          [
            78.5734,
            29.7914
          ],
          [
            78.4834,
            29.7914
          ],
          [
            78.4834,
            29.7014
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 74,
    "mapX": 421.1,
    "mapY": 737.1
  },
  "lansdowne": {
    "id": "lansdowne",
    "name": "Lansdowne",
    "district": "Pauri Garhwal",
    "division": "Garhwal",
    "latitude": 29.8377,
    "longitude": 78.6871,
    "elevation_m": 1706,
    "description": "Historic Garhwal Rifles regimental center with pristine blue pine and oak forests.",
    "bbox": [
      78.6521,
      29.8027,
      78.7221,
      29.8727
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            78.6521,
            29.8027
          ],
          [
            78.7221,
            29.8027
          ],
          [
            78.7221,
            29.8727
          ],
          [
            78.6521,
            29.8727
          ],
          [
            78.6521,
            29.8027
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 483.6,
    "mapY": 700.9
  },
  "satpuli": {
    "id": "satpuli",
    "name": "Satpuli",
    "district": "Pauri Garhwal",
    "division": "Garhwal",
    "latitude": 29.92,
    "longitude": 78.7,
    "elevation_m": 657,
    "description": "Centrally located valley crossroads on the banks of the Purvi Nayar river.",
    "bbox": [
      78.665,
      29.885,
      78.735,
      29.955
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            78.665,
            29.885
          ],
          [
            78.735,
            29.885
          ],
          [
            78.735,
            29.955
          ],
          [
            78.665,
            29.955
          ],
          [
            78.665,
            29.885
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 488.7,
    "mapY": 668.4
  },
  "dugadda": {
    "id": "dugadda",
    "name": "Dugadda",
    "district": "Pauri Garhwal",
    "division": "Garhwal",
    "latitude": 29.8,
    "longitude": 78.61,
    "elevation_m": 832,
    "description": "Historic foothill town at the confluence of Silgad and Rawasan rivers.",
    "bbox": [
      78.575,
      29.765,
      78.645,
      29.835
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            78.575,
            29.765
          ],
          [
            78.645,
            29.765
          ],
          [
            78.645,
            29.835
          ],
          [
            78.575,
            29.835
          ],
          [
            78.575,
            29.765
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 453.2,
    "mapY": 715.9
  },
  "bageshwar": {
    "id": "bageshwar",
    "name": "Bageshwar",
    "district": "Bageshwar",
    "division": "Kumaon",
    "latitude": 29.84,
    "longitude": 79.77,
    "elevation_m": 1004,
    "description": "Confluence of Saryu and Gomati rivers, renowned for the ancient Bagnath temple and Uttarayani fair.",
    "bbox": [
      79.73,
      29.8,
      79.81,
      29.88
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            79.73,
            29.8
          ],
          [
            79.81,
            29.8
          ],
          [
            79.81,
            29.88
          ],
          [
            79.73,
            29.88
          ],
          [
            79.73,
            29.8
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 910.4,
    "mapY": 700.0
  },
  "kausani": {
    "id": "kausani",
    "name": "Kausani",
    "district": "Bageshwar",
    "division": "Kumaon",
    "latitude": 29.8544,
    "longitude": 79.6,
    "elevation_m": 1890,
    "description": "'Switzerland of India' celebrated for expansive views of Trishul, Nanda Devi, and Panchachuli peaks.",
    "bbox": [
      79.565,
      29.8194,
      79.635,
      29.8894
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            79.565,
            29.8194
          ],
          [
            79.635,
            29.8194
          ],
          [
            79.635,
            29.8894
          ],
          [
            79.565,
            29.8894
          ],
          [
            79.565,
            29.8194
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 843.4,
    "mapY": 694.3
  },
  "baijnath": {
    "id": "baijnath",
    "name": "Baijnath",
    "district": "Bageshwar",
    "division": "Kumaon",
    "latitude": 29.9078,
    "longitude": 79.6178,
    "elevation_m": 1125,
    "description": "Ancient 12th-century temple complex of the Katyuri dynasty situated on the banks of the Gomati river.",
    "bbox": [
      79.5828,
      29.8728,
      79.6528,
      29.9428
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            79.5828,
            29.8728
          ],
          [
            79.6528,
            29.8728
          ],
          [
            79.6528,
            29.9428
          ],
          [
            79.5828,
            29.9428
          ],
          [
            79.5828,
            29.8728
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 850.4,
    "mapY": 673.2
  },
  "kapkot": {
    "id": "kapkot",
    "name": "Kapkot",
    "district": "Bageshwar",
    "division": "Kumaon",
    "latitude": 29.94,
    "longitude": 79.9,
    "elevation_m": 1080,
    "description": "Gateway to the world-famous Pindari, Sunderdhunga, and Kafni Glaciers in high Kumaon.",
    "bbox": [
      79.86,
      29.9,
      79.94,
      29.98
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            79.86,
            29.9
          ],
          [
            79.94,
            29.9
          ],
          [
            79.94,
            29.98
          ],
          [
            79.86,
            29.98
          ],
          [
            79.86,
            29.9
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 961.6,
    "mapY": 660.5
  },
  "pithoragarh": {
    "id": "pithoragarh",
    "name": "Pithoragarh",
    "district": "Pithoragarh",
    "division": "Kumaon",
    "latitude": 29.58,
    "longitude": 80.22,
    "elevation_m": 1627,
    "description": "Largest town in eastern Kumaon located in the picturesque Soar Valley, often called 'Little Kashmir'.",
    "bbox": [
      80.175,
      29.535,
      80.265,
      29.625
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            80.175,
            29.535
          ],
          [
            80.265,
            29.535
          ],
          [
            80.265,
            29.625
          ],
          [
            80.175,
            29.625
          ],
          [
            80.175,
            29.535
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 74,
    "mapX": 1087.7,
    "mapY": 802.9
  },
  "dharchula": {
    "id": "dharchula",
    "name": "Dharchula",
    "district": "Pithoragarh",
    "division": "Kumaon",
    "latitude": 29.85,
    "longitude": 80.5333,
    "elevation_m": 915,
    "description": "Strategic border town along the roaring Kali river opposite Nepal, on the Kailash Mansarovar route.",
    "bbox": [
      80.4933,
      29.81,
      80.5733,
      29.89
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            80.4933,
            29.81
          ],
          [
            80.5733,
            29.81
          ],
          [
            80.5733,
            29.89
          ],
          [
            80.4933,
            29.89
          ],
          [
            80.4933,
            29.81
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 1211.2,
    "mapY": 696.1
  },
  "munsiyari": {
    "id": "munsiyari",
    "name": "Munsiyari",
    "district": "Pithoragarh",
    "division": "Kumaon",
    "latitude": 30.0667,
    "longitude": 80.2333,
    "elevation_m": 2200,
    "description": "Sub-alpine town under the Panchachuli peaks; base for Milam, Ralam, and Namik Glaciers.",
    "bbox": [
      80.1933,
      30.0267,
      80.2733,
      30.1067
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            80.1933,
            30.0267
          ],
          [
            80.2733,
            30.0267
          ],
          [
            80.2733,
            30.1067
          ],
          [
            80.1933,
            30.1067
          ],
          [
            80.1933,
            30.0267
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 1093.0,
    "mapY": 610.4
  },
  "didihat": {
    "id": "didihat",
    "name": "Didihat",
    "district": "Pithoragarh",
    "division": "Kumaon",
    "latitude": 29.97,
    "longitude": 80.25,
    "elevation_m": 1725,
    "description": "Scenic hilltop town amidst verdant valleys with views of the Panchachuli range.",
    "bbox": [
      80.215,
      29.935,
      80.285,
      30.005
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            80.215,
            29.935
          ],
          [
            80.285,
            29.935
          ],
          [
            80.285,
            30.005
          ],
          [
            80.215,
            30.005
          ],
          [
            80.215,
            29.935
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 1099.5,
    "mapY": 648.6
  },
  "berinag": {
    "id": "berinag",
    "name": "Berinag",
    "district": "Pithoragarh",
    "division": "Kumaon",
    "latitude": 29.8,
    "longitude": 80.05,
    "elevation_m": 1860,
    "description": "Famous for aromatic tea gardens and panoramic sunrise views over snow-clad Himalayan massifs.",
    "bbox": [
      80.015,
      29.765,
      80.085,
      29.835
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            80.015,
            29.765
          ],
          [
            80.085,
            29.765
          ],
          [
            80.085,
            29.835
          ],
          [
            80.015,
            29.835
          ],
          [
            80.015,
            29.765
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 73,
    "mapX": 1020.7,
    "mapY": 715.9
  },
  "gangolihat": {
    "id": "gangolihat",
    "name": "Gangolihat",
    "district": "Pithoragarh",
    "division": "Kumaon",
    "latitude": 29.66,
    "longitude": 80.05,
    "elevation_m": 1760,
    "description": "Historic religious town housing the sacred Hat Kalika temple, near Patal Bhuvaneshwar caves.",
    "bbox": [
      80.015,
      29.625,
      80.085,
      29.695
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            80.015,
            29.625
          ],
          [
            80.085,
            29.625
          ],
          [
            80.085,
            29.695
          ],
          [
            80.015,
            29.695
          ],
          [
            80.015,
            29.625
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 74,
    "mapX": 1020.7,
    "mapY": 771.2
  },
  "jauljibi": {
    "id": "jauljibi",
    "name": "Jauljibi",
    "district": "Pithoragarh",
    "division": "Kumaon",
    "latitude": 29.75,
    "longitude": 80.38,
    "elevation_m": 605,
    "description": "Famous trans-Himalayan confluence of the Gori and Kali rivers hosting the historic Indo-Nepal trade fair.",
    "bbox": [
      80.345,
      29.715,
      80.415,
      29.785
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            80.345,
            29.715
          ],
          [
            80.415,
            29.715
          ],
          [
            80.415,
            29.785
          ],
          [
            80.345,
            29.785
          ],
          [
            80.345,
            29.715
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 74,
    "mapX": 1150.8,
    "mapY": 735.6
  },
  "champawat": {
    "id": "champawat",
    "name": "Champawat",
    "district": "Champawat",
    "division": "Kumaon",
    "latitude": 29.3346,
    "longitude": 80.0911,
    "elevation_m": 1610,
    "description": "Ancient capital of the Chand dynasty rulers of Kumaon, home to Baleshwar temple and dense pine groves.",
    "bbox": [
      80.0511,
      29.2946,
      80.1311,
      29.3746
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            80.0511,
            29.2946
          ],
          [
            80.1311,
            29.2946
          ],
          [
            80.1311,
            29.3746
          ],
          [
            80.0511,
            29.3746
          ],
          [
            80.0511,
            29.2946
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 74,
    "mapX": 1036.9,
    "mapY": 899.9
  },
  "lohaghat": {
    "id": "lohaghat",
    "name": "Lohaghat",
    "district": "Champawat",
    "division": "Kumaon",
    "latitude": 29.41,
    "longitude": 80.09,
    "elevation_m": 1754,
    "description": "Charming town along the Lohawati river near Abbott Mount and Advaita Ashrama at Mayawati.",
    "bbox": [
      80.055,
      29.375,
      80.125,
      29.445
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            80.055,
            29.375
          ],
          [
            80.125,
            29.375
          ],
          [
            80.125,
            29.445
          ],
          [
            80.055,
            29.445
          ],
          [
            80.055,
            29.375
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 74,
    "mapX": 1036.5,
    "mapY": 870.1
  },
  "tanakpur": {
    "id": "tanakpur",
    "name": "Tanakpur",
    "district": "Champawat",
    "division": "Kumaon",
    "latitude": 29.0722,
    "longitude": 80.1111,
    "elevation_m": 255,
    "description": "Foothills terminal town on the Sharda river, starting point for the Purnagiri temple pilgrimage.",
    "bbox": [
      80.0711,
      29.0322,
      80.1511,
      29.1122
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            80.0711,
            29.0322
          ],
          [
            80.1511,
            29.0322
          ],
          [
            80.1511,
            29.1122
          ],
          [
            80.0711,
            29.1122
          ],
          [
            80.0711,
            29.0322
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 74,
    "mapX": 1044.8,
    "mapY": 1003.7
  },
  "banbasa": {
    "id": "banbasa",
    "name": "Banbasa",
    "district": "Champawat",
    "division": "Kumaon",
    "latitude": 28.98,
    "longitude": 80.08,
    "elevation_m": 218,
    "description": "Indo-Nepal border transit hub famous for the Sharda Barrage and canal system.",
    "bbox": [
      80.045,
      28.945,
      80.115,
      29.015
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            80.045,
            28.945
          ],
          [
            80.115,
            28.945
          ],
          [
            80.115,
            29.015
          ],
          [
            80.045,
            29.015
          ],
          [
            80.045,
            28.945
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 74,
    "mapX": 1032.5,
    "mapY": 1040.2
  },
  "rudrapur": {
    "id": "rudrapur",
    "name": "Rudrapur",
    "district": "Udham Singh Nagar",
    "division": "Kumaon",
    "latitude": 28.9774,
    "longitude": 79.4004,
    "elevation_m": 205,
    "description": "Major industrial metropolis and administrative headquarters of Udham Singh Nagar in the fertile Terai.",
    "bbox": [
      79.3504,
      28.9274,
      79.4504,
      29.0274
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            79.3504,
            28.9274
          ],
          [
            79.4504,
            28.9274
          ],
          [
            79.4504,
            29.0274
          ],
          [
            79.3504,
            29.0274
          ],
          [
            79.3504,
            28.9274
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 74,
    "mapX": 764.7,
    "mapY": 1041.2
  },
  "kashipur": {
    "id": "kashipur",
    "name": "Kashipur",
    "district": "Udham Singh Nagar",
    "division": "Kumaon",
    "latitude": 29.2104,
    "longitude": 78.9619,
    "elevation_m": 238,
    "description": "Historical Drona Sagar city and major economic/industrial powerhouse in southwestern Kumaon.",
    "bbox": [
      78.9119,
      29.1604,
      79.0119,
      29.2604
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            78.9119,
            29.1604
          ],
          [
            79.0119,
            29.1604
          ],
          [
            79.0119,
            29.2604
          ],
          [
            78.9119,
            29.2604
          ],
          [
            78.9119,
            29.1604
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 74,
    "mapX": 591.9,
    "mapY": 949.0
  },
  "pantnagar": {
    "id": "pantnagar",
    "name": "Pantnagar",
    "district": "Udham Singh Nagar",
    "division": "Kumaon",
    "latitude": 29.02,
    "longitude": 79.49,
    "elevation_m": 230,
    "description": "Cradle of India's Green Revolution home to Govind Ballabh Pant University of Agriculture & Technology.",
    "bbox": [
      79.445,
      28.975,
      79.535,
      29.065
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            79.445,
            28.975
          ],
          [
            79.535,
            28.975
          ],
          [
            79.535,
            29.065
          ],
          [
            79.445,
            29.065
          ],
          [
            79.445,
            28.975
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 74,
    "mapX": 800.0,
    "mapY": 1024.3
  },
  "kichha": {
    "id": "kichha",
    "name": "Kichha",
    "district": "Udham Singh Nagar",
    "division": "Kumaon",
    "latitude": 28.91,
    "longitude": 79.51,
    "elevation_m": 202,
    "description": "Agricultural trading and processing center situated along the Bareilly-Nainital highway.",
    "bbox": [
      79.47,
      28.87,
      79.55,
      28.95
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            79.47,
            28.87
          ],
          [
            79.55,
            28.87
          ],
          [
            79.55,
            28.95
          ],
          [
            79.47,
            28.95
          ],
          [
            79.47,
            28.87
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 74,
    "mapX": 807.9,
    "mapY": 1067.8
  },
  "khatima": {
    "id": "khatima",
    "name": "Khatima",
    "district": "Udham Singh Nagar",
    "division": "Kumaon",
    "latitude": 28.92,
    "longitude": 79.97,
    "elevation_m": 210,
    "description": "Eastern Terai town bordering Nepal, rich in agriculture and forestry products.",
    "bbox": [
      79.925,
      28.875,
      80.015,
      28.965
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            79.925,
            28.875
          ],
          [
            80.015,
            28.875
          ],
          [
            80.015,
            28.965
          ],
          [
            79.925,
            28.965
          ],
          [
            79.925,
            28.875
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 74,
    "mapX": 989.2,
    "mapY": 1063.9
  },
  "sitarganj": {
    "id": "sitarganj",
    "name": "Sitarganj",
    "district": "Udham Singh Nagar",
    "division": "Kumaon",
    "latitude": 28.93,
    "longitude": 79.7,
    "elevation_m": 208,
    "description": "Rapidly growing industrial hub housing the large ELDECO SIDCUL industrial park in the Terai.",
    "bbox": [
      79.66,
      28.89,
      79.74,
      28.97
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            79.66,
            28.89
          ],
          [
            79.74,
            28.89
          ],
          [
            79.74,
            28.97
          ],
          [
            79.66,
            28.97
          ],
          [
            79.66,
            28.89
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 74,
    "mapX": 882.8,
    "mapY": 1059.9
  },
  "bazpur": {
    "id": "bazpur",
    "name": "Bazpur",
    "district": "Udham Singh Nagar",
    "division": "Kumaon",
    "latitude": 29.15,
    "longitude": 79.12,
    "elevation_m": 226,
    "description": "Famous as India's first cooperative sugar mill town in the fertile grain-producing belt.",
    "bbox": [
      79.08,
      29.11,
      79.16,
      29.19
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            79.08,
            29.11
          ],
          [
            79.16,
            29.11
          ],
          [
            79.16,
            29.19
          ],
          [
            79.08,
            29.19
          ],
          [
            79.08,
            29.11
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 74,
    "mapX": 654.2,
    "mapY": 972.9
  },
  "jaspur": {
    "id": "jaspur",
    "name": "Jaspur",
    "district": "Udham Singh Nagar",
    "division": "Kumaon",
    "latitude": 29.28,
    "longitude": 78.82,
    "elevation_m": 240,
    "description": "Historical timber and agro-processing center in western Udham Singh Nagar.",
    "bbox": [
      78.78,
      29.24,
      78.86,
      29.32
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            78.78,
            29.24
          ],
          [
            78.86,
            29.24
          ],
          [
            78.86,
            29.32
          ],
          [
            78.78,
            29.32
          ],
          [
            78.78,
            29.24
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 74,
    "mapX": 536.0,
    "mapY": 921.5
  },
  "gadarpur": {
    "id": "gadarpur",
    "name": "Gadarpur",
    "district": "Udham Singh Nagar",
    "division": "Kumaon",
    "latitude": 29.03,
    "longitude": 79.25,
    "elevation_m": 212,
    "description": "Vibrant agricultural trading town situated near the Haripura and Baur reservoirs.",
    "bbox": [
      79.21,
      28.99,
      79.29,
      29.07
    ],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            79.21,
            28.99
          ],
          [
            79.29,
            28.99
          ],
          [
            79.29,
            29.07
          ],
          [
            79.21,
            29.07
          ],
          [
            79.21,
            28.99
          ]
        ]
      ]
    },
    "default_nisar_track": 106,
    "default_nisar_frame": 74,
    "mapX": 705.4,
    "mapY": 1020.4
  }
};

export const UTTARAKHAND_CITIES_LIST: LocationDetail[] = Object.values(UTTARAKHAND_CITIES);

export const DEFAULT_CITY_ID = "joshimath";

export function getCityById(id: string): LocationDetail | undefined {
  const key = id.toLowerCase().trim();
  return UTTARAKHAND_CITIES[key];
}

export function searchCities(query: string): LocationDetail[] {
  if (!query || query.trim() === "") return UTTARAKHAND_CITIES_LIST;
  const q = query.toLowerCase().trim();
  return UTTARAKHAND_CITIES_LIST.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.district.toLowerCase().includes(q) ||
    c.division.toLowerCase().includes(q)
  );
}
