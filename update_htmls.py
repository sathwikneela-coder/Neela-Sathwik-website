import os
import glob
import re

directory = r"e:\Website"
html_files = glob.glob(os.path.join(directory, "*.html"))

# We want to inject:
# 1. <html> class lenis
# 2. Before </head>: Three.js, GSAP, Lenis CDNs
# 3. After <body>: WebGL container and Preloader
# 4. We ensure we don't duplicate them if already injected.

cdns = """
    <!-- GSAP & Lenis & Three.js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/studio-freight/lenis@1.0.29/bundled/lenis.min.js"></script>
"""

body_inject = """
    <!-- WebGL Background -->
    <div id="webgl-container"></div>
    <!-- Cinematic Preloader -->
    <div id="preloader">
        <div class="preloader-logo">SATHWIK.</div>
        <div class="preloader-progress">
            <div class="preloader-bar"></div>
        </div>
    </div>
"""

for file_path in html_files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # 1. Add lenis class to html
    if '<html lang="en">' in content and 'class="lenis"' not in content:
        content = content.replace('<html lang="en">', '<html lang="en" class="lenis">')
    
    # 2. Add CDNs before </head>
    if 'three.min.js' not in content:
        content = content.replace('</head>', cdns + '</head>')
        
    # 3. Add body_inject right after <body>
    if 'id="webgl-container"' not in content:
        content = content.replace('<body>', '<body>\n' + body_inject)
    
    # Remove old inline styles in index.html hero section (since we handle it in CSS now)
    content = re.sub(r'<style>.*?</style>', '', content, flags=re.DOTALL)
        
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

print(f"Updated {len(html_files)} HTML files successfully.")
