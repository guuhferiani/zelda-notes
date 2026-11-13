import base64

with open('C:/Users/Gustavo/Documents/Projetos Antigravity/Zelda Ocarina/ZeldaNotes/public/Triforce.ttf', 'rb') as f:
    b64_font = base64.b64encode(f.read()).decode('ascii')

svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <style>
      @font-face {{
        font-family: 'Triforce';
        src: url(data:font/truetype;charset=utf-8;base64,{b64_font}) format('truetype');
      }}
      .zelda-z {{
        font-family: 'Triforce', 'Cinzel', serif;
        font-size: 440px;
        text-anchor: middle;
        dominant-baseline: central;
      }}
    </style>
    <linearGradient id="zeldaGold" x1="0%" y1="15%" x2="0%" y2="85%">
      <stop offset="0%" stop-color="#FFF59D" />
      <stop offset="25%" stop-color="#FBC02D" />
      <stop offset="65%" stop-color="#F57F17" />
      <stop offset="100%" stop-color="#D84315" />
    </linearGradient>
    <filter id="zeldaGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#000000" flood-opacity="0.9" />
      <feDropShadow dx="0" dy="0" stdDeviation="12" flood-color="#F59E0B" flood-opacity="0.4" />
    </filter>
  </defs>

  <!-- Sheikah Dark Badge -->
  <rect x="16" y="16" width="480" height="480" rx="110" fill="#080D0B" stroke="#F59E0B" stroke-width="6" />
  <rect x="28" y="28" width="456" height="456" rx="98" fill="none" stroke="#10B981" stroke-width="2" stroke-opacity="0.35" />

  <!-- Zelda Z Character -->
  <!-- Outer Stroke / Bevel -->
  <text x="256" y="240" class="zelda-z" fill="#781D00" stroke="#5C1300" stroke-width="16" stroke-linejoin="round" filter="url(#zeldaGlow)">Z</text>
  <!-- Main Golden Fill -->
  <text x="256" y="240" class="zelda-z" fill="url(#zeldaGold)">Z</text>
</svg>'''

with open('C:/Users/Gustavo/Documents/Projetos Antigravity/Zelda Ocarina/ZeldaNotes/public/favicon.svg', 'w', encoding='utf-8') as f:
    f.write(svg_content)

print('Generated public/favicon.svg successfully!')

