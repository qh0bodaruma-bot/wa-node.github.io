import os
import re
from pathlib import Path

root_dir = Path(os.getcwd())

def get_html_files(directory):
    html_files = []
    for root, dirs, files in os.walk(directory):
        if '.git' in root: continue
        for file in files:
            if file.endswith('.html'):
                html_files.append(Path(root) / file)
    return html_files

def check_links():
    html_files = get_html_files(root_dir)
    referenced_files = set()
    link_pattern = re.compile(r'(?:href|src)=["\']([^"\']+)["\']')
    broken_links = []
    
    for html_file in html_files:
        try:
            with open(html_file, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                links = link_pattern.findall(content)
                
                for link in links:
                    clean_link = link.split('#')[0].split('?')[0]
                    if not clean_link or clean_link.startswith(('http', 'mailto:', 'tel:', 'javascript:')):
                        continue
                    
                    if clean_link.startswith('/'):
                        link_path = (root_dir / clean_link.lstrip('/')).resolve()
                    else:
                        link_path = (html_file.parent / clean_link).resolve()

                    if not link_path.exists():
                        if link_path.is_dir() and (link_path / 'index.html').exists():
                            referenced_files.add((link_path / 'index.html').resolve())
                        else:
                            broken_links.append((html_file.relative_to(root_dir), link))
                    else:
                        referenced_files.add(link_path.resolve())
        except Exception as e:
            print(f"Error reading {html_file}: {e}")

    unreferenced_html = []
    for html_file in html_files:
        abs_path = html_file.resolve()
        if abs_path not in referenced_files and html_file.name != 'index.html' and html_file.name != '404.html':
            unreferenced_html.append(html_file.relative_to(root_dir))

    return broken_links, unreferenced_html

broken, unreferenced = check_links()

print("--- Broken Internal Links ---")
for src, link in broken:
    print(f"{src} -> {link}")

print("\n--- Unreferenced HTML Files ---")
for f in unreferenced:
    print(f)
