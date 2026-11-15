import json

with open('frontend/src/data/india_states_paths.json', 'r', encoding='utf-8') as f:
    states = json.load(f)

print(f"Loaded {len(states)} states")
for s in states:
    print(f"{s['name']:<28} | Target: {str(s.get('isTarget', False)):<5} | Center: {s['center']}")
