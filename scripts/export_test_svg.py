import json

with open('frontend/src/data/india_states_paths.json', 'r', encoding='utf-8') as f:
    states = json.load(f)

svg_header = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1150" width="1000" height="1150" style="background:#020617;">
<defs>
  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur stdDeviation="4" result="blur" />
    <feComposite in="SourceGraphic" in2="blur" operator="over" />
  </filter>
</defs>
'''

svg_body = []
for s in states:
    is_target = s.get('isTarget', False)
    # The reference image has deep royal/navy blue fill (#00437a / #003865) and clean white/cyan outlines (#ffffff)
    fill = "#005596" if not is_target else "#0284c7"
    stroke = "#ffffff" if not is_target else "#38bdf8"
    sw = "1.5" if not is_target else "2.5"
    svg_body.append(f'<path id="{s["id"]}" d="{s["path"]}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round" />')

svg_footer = '</svg>'

with open('frontend/public/test_india.svg', 'w', encoding='utf-8') as out:
    out.write(svg_header + "\n".join(svg_body) + svg_footer)

print("Saved frontend/public/test_india.svg")
