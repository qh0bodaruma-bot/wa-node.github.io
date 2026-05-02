import os
import re

def unescape_file(filepath):
    print(f"Fixing {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # This will find sequences like \u3053 and convert them to the actual character
    fixed_content = re.sub(r'\\u([0-9a-fA-F]{4})', lambda m: chr(int(m.group(1), 16)), content)
    
    # Also fix escaped quotes if they exist (e.g. \")
    fixed_content = fixed_content.replace('\\"', '"')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(fixed_content)

files_to_fix = [
    'tokutei.html',
    'mental_care.html',
    'barrier_free.html',
    'seo_check.html',
    'lp_wizard.html',
    'simulator.html'
]

for f in files_to_fix:
    if os.path.exists(f):
        unescape_file(f)
    else:
        print(f"File not found: {f}")
