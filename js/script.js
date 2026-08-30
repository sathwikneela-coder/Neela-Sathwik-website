// Register GSAP Plugins (Assuming loaded via CDN in HTML)
if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Lenis Smooth Scroll Setup
let lenis;
if (typeof Lenis !== "undefined") {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: "vertical",
    gestureDirection: "vertical",
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

// Preloader Logic
const preloader = document.getElementById("preloader");
if (preloader) {
  const bar = document.querySelector(".preloader-bar");
  if (bar && typeof gsap !== "undefined") {
    gsap.to(bar, {
      width: "100%",
      duration: 1.5,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.to(preloader, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: () => {
            preloader.style.display = "none";
            initHeroAnimations();
          }
        });
      }
    });
  } else {
    setTimeout(() => {
      preloader.style.opacity = 0;
      setTimeout(() => preloader.style.display = "none", 500);
      initHeroAnimations();
    }, 1500);
  }
} else {
  // If no preloader, init immediately on DOM ready
  document.addEventListener("DOMContentLoaded", () => {
    initHeroAnimations();
  });
}

function initHeroAnimations() {
  if (typeof gsap === "undefined") return;
  const heroReveals = [...document.querySelectorAll("header.hero .reveal")];
  if (heroReveals.length === 0) return;

  // Make visible first (override the CSS hidden state)
  heroReveals.forEach(el => { el.style.visibility = 'visible'; });

  gsap.fromTo(heroReveals,
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      stagger: 0.18,
      onComplete: () => {
        // Remove .reveal class so the CSS hidden rule can never re-apply
        heroReveals.forEach(el => {
          el.classList.remove('reveal');
          el.style.visibility = '';
        });
      }
    }
  );
}

// ScrollTrigger Animations for remaining .reveal elements
if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    const reveals = document.querySelectorAll(".reveal:not(header.hero .reveal)");
    reveals.forEach((el) => {
      // Make visible before GSAP takes over (prevents CSS rule conflicts)
      el.style.visibility = 'visible';

      gsap.fromTo(el,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            // 'play none none none' = animate in once, never reverse/hide again
            toggleActions: "play none none none",
            onEnter: () => {
              // Remove reveal class after it animates so it stays visible
              setTimeout(() => el.classList.remove('reveal'), 1300);
            }
          }
        }
      );
    });

    // Parallax effect on cards
    const cards = document.querySelectorAll(".glass-card, .portfolio-card, .project-card");
    cards.forEach(card => {
      gsap.to(card, {
        y: -30,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });
  });
}


// WebGL/Three.js Background Universe
if (typeof THREE !== "undefined") {
  initThreeJsBackground();
}

function initThreeJsBackground() {
  const container = document.getElementById('webgl-container');
  if (!container) return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x020204, 0.0008);

  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 35;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  // ── LIGHTS ──────────────────────────────────────────────
  const ambientLight = new THREE.AmbientLight(0x111122, 1.5);
  scene.add(ambientLight);

  const blueLight = new THREE.PointLight(0x00E1FF, 3, 80);
  blueLight.position.set(-20, 15, 10);
  scene.add(blueLight);

  const violetLight = new THREE.PointLight(0x6A00F4, 3, 80);
  violetLight.position.set(20, -10, 5);
  scene.add(violetLight);

  const goldLight = new THREE.PointLight(0xD4AF37, 1.5, 60);
  goldLight.position.set(0, 20, -10);
  scene.add(goldLight);

  // ── PARTICLE FIELD (multi-colour) ────────────────────────
  const makeParticleField = (count, spread, color, size) => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * spread;
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ size, color, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false });
    return new THREE.Points(geo, mat);
  };
  const particles1 = makeParticleField(800, 120, 0x00E1FF, 0.12);
  const particles2 = makeParticleField(400, 90,  0x6A00F4, 0.18);
  const particles3 = makeParticleField(200, 70,  0xD4AF37, 0.22);
  scene.add(particles1, particles2, particles3);

  // ── DNA HELIX ────────────────────────────────────────────
  const dnaGroup = new THREE.Group();
  const dnaStrand1 = [], dnaStrand2 = [];
  const sphereGeo = new THREE.SphereGeometry(0.22, 8, 8);
  const mat1 = new THREE.MeshPhongMaterial({ color: 0x00E1FF, emissive: 0x003355, shininess: 120, transparent: true, opacity: 0.9 });
  const mat2 = new THREE.MeshPhongMaterial({ color: 0xFF007A, emissive: 0x330011, shininess: 120, transparent: true, opacity: 0.9 });
  const connMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.08 });

  const dnaCount = 30;
  for (let i = 0; i < dnaCount; i++) {
    const t = (i / dnaCount) * Math.PI * 6;
    const y = (i / dnaCount) * 28 - 14;

    const s1 = new THREE.Mesh(sphereGeo, mat1);
    s1.position.set(Math.cos(t) * 2.5, y, Math.sin(t) * 2.5);
    dnaGroup.add(s1); dnaStrand1.push(s1);

    const s2 = new THREE.Mesh(sphereGeo, mat2);
    s2.position.set(Math.cos(t + Math.PI) * 2.5, y, Math.sin(t + Math.PI) * 2.5);
    dnaGroup.add(s2); dnaStrand2.push(s2);

    if (i % 3 === 0) {
      const connGeo = new THREE.CylinderGeometry(0.05, 0.05, 5, 6);
      const conn = new THREE.Mesh(connGeo, connMat);
      conn.position.copy(s1.position).lerp(s2.position, 0.5);
      conn.lookAt(s2.position);
      conn.rotateX(Math.PI / 2);
      dnaGroup.add(conn);
    }
  }
  dnaGroup.position.set(-30, 0, -15);
  dnaGroup.rotation.z = 0.15;
  scene.add(dnaGroup);

  // ── TORUS RINGS ──────────────────────────────────────────
  const makeTorus = (r, tube, color, opacity, x, y, z, rx, ry) => {
    const geo = new THREE.TorusGeometry(r, tube, 16, 80);
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity, wireframe: false, blending: THREE.AdditiveBlending });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, 0);
    scene.add(mesh);
    return mesh;
  };
  const ring1 = makeTorus(7,  0.04, 0x00E1FF, 0.5,  18,  6, -20,  1.2, 0.4);
  const ring2 = makeTorus(5,  0.03, 0x6A00F4, 0.6,  18,  6, -20,  0.5, 1.1);
  const ring3 = makeTorus(3,  0.04, 0xD4AF37, 0.4, -22, -8, -10,  0.3, 0.8);
  const ring4 = makeTorus(10, 0.02, 0x00E1FF, 0.2,   0, 30, -30,  0.1, 0.2);

  // ── WIREFRAME ICOSAHEDRA CLUSTER ─────────────────────────
  const icoCluster = new THREE.Group();
  const icoGeo4 = new THREE.IcosahedronGeometry(1, 1);
  const sizes = [3.5, 2.0, 1.2, 1.8, 0.8];
  const icoColors = [0x00E1FF, 0x6A00F4, 0xFF007A, 0xD4AF37, 0x00E1FF];
  const icos = [];
  [[0,0,0], [6,4,-5], [-5,3,-3], [3,-5,-4], [-3,-4,-2]].forEach(([x,y,z], i) => {
    const m = new THREE.Mesh(icoGeo4, new THREE.MeshBasicMaterial({ color: icoColors[i], wireframe: true, transparent: true, opacity: 0.25 }));
    m.position.set(x, y, z);
    m.scale.setScalar(sizes[i]);
    icoCluster.add(m); icos.push(m);
  });
  icoCluster.position.set(22, -12, -18);
  scene.add(icoCluster);

  // ── PYRAMIDS (Octahedra) ─────────────────────────────────
  const pyramidGroup = new THREE.Group();
  const octGeo = new THREE.OctahedronGeometry(1, 0);
  const pyramidDefs = [
    { s: 2.5, pos: [0, 0, 0],     color: 0x00E1FF },
    { s: 1.5, pos: [4, 3, -2],    color: 0x6A00F4 },
    { s: 1.0, pos: [-4, -2, -1],  color: 0xD4AF37 },
    { s: 0.8, pos: [2, -4, 1],    color: 0xFF007A },
  ];
  const pyramids = pyramidDefs.map(({ s, pos, color }) => {
    const mat = new THREE.MeshPhongMaterial({ color, emissive: color, emissiveIntensity: 0.3, transparent: true, opacity: 0.6, wireframe: false });
    const m = new THREE.Mesh(octGeo, mat);
    m.position.set(...pos); m.scale.setScalar(s);
    pyramidGroup.add(m); return m;
  });
  pyramidGroup.position.set(5, 10, -8);
  scene.add(pyramidGroup);

  // ── FLOATING NODE NETWORK ────────────────────────────────
  const nodeGroup = new THREE.Group();
  const nodeCount = 18;
  const nodes = [];
  const nodeSphereGeo = new THREE.SphereGeometry(0.3, 12, 12);
  const nodeMat = new THREE.MeshPhongMaterial({ color: 0x00E1FF, emissive: 0x003344, transparent: true, opacity: 0.9, shininess: 200 });
  const nodePositions = Array.from({ length: nodeCount }, () => new THREE.Vector3(
    (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 15
  ));
  nodePositions.forEach(pos => {
    const n = new THREE.Mesh(nodeSphereGeo, nodeMat.clone());
    n.position.copy(pos);
    nodeGroup.add(n); nodes.push(n);
  });

  // Connect nearby nodes with lines
  const lineMat = new THREE.LineBasicMaterial({ color: 0x00E1FF, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending });
  for (let i = 0; i < nodeCount; i++) {
    for (let j = i + 1; j < nodeCount; j++) {
      if (nodePositions[i].distanceTo(nodePositions[j]) < 12) {
        const lineGeo = new THREE.BufferGeometry().setFromPoints([nodePositions[i], nodePositions[j]]);
        nodeGroup.add(new THREE.Line(lineGeo, lineMat));
      }
    }
  }
  nodeGroup.position.set(-5, 2, -5);
  scene.add(nodeGroup);

  // ── GRID PLANE (Far background) ─────────────────────────
  const gridHelper = new THREE.GridHelper(200, 50, 0x00E1FF, 0x111133);
  gridHelper.position.set(0, -25, -10);
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.12;
  scene.add(gridHelper);

  // ── LARGE BACKGROUND TORUS (Giant ring) ─────────────────
  const bgRingGeo = new THREE.TorusGeometry(50, 0.15, 8, 200);
  const bgRingMat = new THREE.MeshBasicMaterial({ color: 0x6A00F4, transparent: true, opacity: 0.08, blending: THREE.AdditiveBlending });
  const bgRing = new THREE.Mesh(bgRingGeo, bgRingMat);
  bgRing.rotation.x = 1.3;
  bgRing.position.set(0, 0, -40);
  scene.add(bgRing);

  // ── MOUSE & SCROLL (shared with foreground parallax) ────
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2);
    mouseY = (e.clientY - window.innerHeight / 2);
    window._bgMouseX = mouseX;
    window._bgMouseY = mouseY;
  });
  let scrollY = 0;
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    window._bgScrollY = scrollY;
  });
  window._bgMouseX = 0; window._bgMouseY = 0; window._bgScrollY = 0;

  const clock = new THREE.Clock();

  // ── ANIMATE LOOP ─────────────────────────────────────────
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Particle rotation
    particles1.rotation.y = t * 0.04;
    particles1.rotation.x = t * 0.015;
    particles2.rotation.y = -t * 0.03;
    particles2.rotation.z = t * 0.01;
    particles3.rotation.x = t * 0.02;

    // DNA helix spin
    dnaGroup.rotation.y = t * 0.15;
    dnaGroup.position.y = Math.sin(t * 0.2) * 2;

    // Torus rings
    ring1.rotation.z = t * 0.15;
    ring1.rotation.x = 1.2 + Math.sin(t * 0.3) * 0.2;
    ring2.rotation.z = -t * 0.1;
    ring3.rotation.y = t * 0.2;
    ring4.rotation.z = t * 0.05;
    bgRing.rotation.z = t * 0.02;

    // Icosahedron cluster
    icoCluster.rotation.x = t * 0.07;
    icoCluster.rotation.y = t * 0.12;
    icos.forEach((ico, i) => { ico.rotation.x += 0.003 + i * 0.001; ico.rotation.y += 0.004 + i * 0.001; });

    // Pyramid group
    pyramidGroup.rotation.y = t * 0.08;
    pyramidGroup.position.y = 10 + Math.sin(t * 0.4) * 1.5;
    pyramids.forEach((p, i) => { p.rotation.x += 0.005; p.rotation.y += 0.006 + i * 0.002; });

    // Node network pulse
    nodeGroup.rotation.y = t * 0.04;
    nodes.forEach((n, i) => {
      n.position.y = nodePositions[i].y + Math.sin(t * 0.8 + i) * 0.4;
      n.material.emissiveIntensity = 0.3 + Math.sin(t * 2 + i * 0.5) * 0.3;
    });

    // Dynamic lights orbit
    blueLight.position.x = -20 + Math.sin(t * 0.3) * 10;
    blueLight.position.z = 10 + Math.cos(t * 0.3) * 10;
    violetLight.position.x = 20 + Math.cos(t * 0.25) * 10;
    violetLight.position.y = -10 + Math.sin(t * 0.25) * 8;

    // Grid gentle movement
    gridHelper.position.x = Math.sin(t * 0.1) * 5;

    // Camera follow mouse
    camera.position.x += ((mouseX * 0.0008) - camera.position.x) * 0.04;
    camera.position.y += ((-mouseY * 0.0008) - camera.position.y) * 0.04;
    camera.position.y -= scrollY * 0.0008;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// ══════════════════════════════════════════════════════════
// FOREGROUND PARALLAX SYSTEM
// Background 3D motion bleeds into foreground text at
// fractional depth rates — no HTML or functionality changed.
// ══════════════════════════════════════════════════════════
(function initForegroundParallax() {

  const layers = [
    { selector: '.hero-subtitle', depthX: 0.016, depthY: 0.012, scrollFactor: 0.04, glowBase: '0,225,255' },
    { selector: '.hero-title',    depthX: 0.028, depthY: 0.020, scrollFactor: 0.06, glowBase: '106,0,244' },
    { selector: '.hero-desc',     depthX: 0.012, depthY: 0.008, scrollFactor: 0.03, glowBase: '0,225,255' },
    { selector: '.cta-group',     depthX: 0.008, depthY: 0.005, scrollFactor: 0.02, glowBase: '212,175,55' },
    { selector: '.section-title', depthX: 0.006, depthY: 0.003, scrollFactor: 0.0,  glowBase: '0,225,255' },
    { selector: '.page-title',    depthX: 0.022, depthY: 0.016, scrollFactor: 0.05, glowBase: '106,0,244' },
    { selector: '.page-subtitle', depthX: 0.010, depthY: 0.007, scrollFactor: 0.03, glowBase: '0,225,255' },
  ];

  let resolvedLayers = [];
  const initLayers = () => {
    resolvedLayers = layers
      .map(l => ({ ...l, els: [...document.querySelectorAll(l.selector)] }))
      .filter(l => l.els.length > 0);
  };

  let lerpX = 0, lerpY = 0;
  let parallaxReady = false;
  setTimeout(() => { parallaxReady = true; }, 2200);

  function rafLoop() {
    requestAnimationFrame(rafLoop);
    if (!parallaxReady) return;

    const rawX = window._bgMouseX || 0;
    const rawY = window._bgMouseY || 0;
    const sY   = window._bgScrollY || 0;

    lerpX += (rawX - lerpX) * 0.05;
    lerpY += (rawY - lerpY) * 0.05;

    resolvedLayers.forEach(({ els, depthX, depthY, scrollFactor, glowBase }) => {
      els.forEach(el => {
        const tx = lerpX * depthX;
        const ty = lerpY * depthY - (sY * scrollFactor);

        // Use CSS custom props so GSAP/tilt transforms don't conflict
        el.style.setProperty('--fpx', tx + 'px');
        el.style.setProperty('--fpy', ty + 'px');

        // Dynamic glow: mirrors the orbiting Three.js point lights
        const gShiftX   = (lerpX / (window.innerWidth  || 1)) * 12;
        const gShiftY   = (lerpY / (window.innerHeight || 1)) * 8;
        const gOpacity  = (0.18 + Math.abs(lerpX / (window.innerWidth || 1)) * 0.22).toFixed(2);
        const gOpacity2 = (parseFloat(gOpacity) * 0.6).toFixed(2);

        el.style.textShadow = [
          gShiftX + 'px ' + gShiftY + 'px 30px rgba(' + glowBase + ',' + gOpacity + ')',
          (-gShiftX * 0.6) + 'px ' + (-gShiftY * 0.6) + 'px 20px rgba(106,0,244,' + gOpacity2 + ')',
          '0 0 60px rgba(' + glowBase + ',0.05)'
        ].join(', ');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { initLayers(); rafLoop(); });
  } else {
    initLayers(); rafLoop();
  }

})();

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// Mobile Menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.innerHTML = navLinks.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
  });
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      hamburger.innerHTML = '<i class="fas fa-bars"></i>';
    });
  });
}

// Active Nav Link
const setNavActive = () => {
  try {
    const currentPath = decodeURIComponent(window.location.pathname).toLowerCase();
    document.querySelectorAll('.nav-links a').forEach(link => {
      const linkPath = decodeURIComponent(new URL(link.href).pathname).toLowerCase();
      if (currentPath === linkPath || (currentPath.endsWith('/') && linkPath.endsWith('index.html'))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  } catch (e) {
    console.error("Error setting active nav link:", e);
  }
};
window.addEventListener('DOMContentLoaded', setNavActive);

// Magnetic Custom Cursor
let cursorDot = document.querySelector('.cursor-dot');
let cursorGlow = document.querySelector('.cursor-glow');

if (!cursorDot) {
  cursorDot = document.createElement('div');
  cursorDot.className = 'cursor-dot';
  document.body.appendChild(cursorDot);
}
if (!cursorGlow) {
  cursorGlow = document.createElement('div');
  cursorGlow.className = 'cursor-glow';
  document.body.appendChild(cursorGlow);
}

document.body.classList.add('custom-cursor-active');

window.addEventListener('mousemove', (e) => {
  if (cursorDot.style.opacity !== '1') {
    cursorDot.style.opacity = '1';
    cursorGlow.style.opacity = '1';
  }
  
  cursorDot.style.left = `${e.clientX}px`;
  cursorDot.style.top = `${e.clientY}px`;
  
  cursorGlow.style.left = `${e.clientX}px`;
  cursorGlow.style.top = `${e.clientY}px`;
});

// Magnetic Hover Effect on links/buttons
document.querySelectorAll('a, button, .portfolio-card, .project-card, .skill-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorGlow.classList.add('active');
    cursorDot.style.transform = 'translate(-50%, -50%) scale(0)';
  });
  el.addEventListener('mouseleave', () => {
    cursorGlow.classList.remove('active');
    cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
  });
});

// Video Play/Pause Hover System
document.querySelectorAll('.project-card').forEach(card => {
  const video = card.querySelector('.card-video');
  if (!video) return;

  card.addEventListener('mouseenter', () => {
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log("Video play prevented by browser autoplay restrictions:", error);
      });
    }
  });

  card.addEventListener('mouseleave', () => {
    video.pause();
    video.currentTime = 0;
  });
});

// 3D Tilt Effect
document.querySelectorAll('.glass-card, .portfolio-card, .project-card').forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xDist = (x / rect.width - 0.5) * 20; 
    const yDist = (y / rect.height - 0.5) * -20;
    
    el.style.transform = `perspective(1000px) rotateX(${yDist}deg) rotateY(${xDist}deg) scale3d(1.02, 1.02, 1.02)`;
    if(el.querySelector('.portfolio-overlay')) {
       el.querySelector('.portfolio-overlay').style.transform = `translateZ(30px)`;
    }
  });
  
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    if(el.querySelector('.portfolio-overlay')) {
       el.querySelector('.portfolio-overlay').style.transform = `translateZ(0)`;
    }
  });
});

// Contact Form Backend API Integration
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    const formMessage = document.getElementById('form-message');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    
    if (!name.value || !email.value || !message.value) {
      if(formMessage) { formMessage.style.color = 'red'; formMessage.textContent = 'Please fill all fields.'; }
      return;
    }
    
    if (submitBtn) {
      submitBtn.innerHTML = 'Sending <i class="fas fa-spinner fa-spin"></i>';
      submitBtn.disabled = true;
    }
    
    if(formMessage) { formMessage.style.color = 'var(--accent-blue)'; formMessage.textContent = 'Saving request details...'; }
    
    const whatsappNumber = "919110707247";
    const whatsappText = `Hello Sathwik,\n\nI am ${name.value.trim()}.\nMy Email: ${email.value.trim()}\n\nMessage:\n${message.value.trim()}`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;
    const apiBaseUrl = (window.API_CONFIG && window.API_CONFIG.BASE_URL) ? window.API_CONFIG.BASE_URL : '';
    const contactApiUrl = `${apiBaseUrl}/api/contact`;

    fetch(contactApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name.value.trim(),
            email: email.value.trim(),
            phone: "",
            service: "General Contact",
            business: "",
            details: message.value.trim()
        })
    })
    .then(() => {
        if(formMessage) { formMessage.style.color = '#4CAF50'; formMessage.textContent = 'Saved! Opening WhatsApp...'; }
        
        window.open(whatsappUrl, '_blank');
        
        contactForm.reset();
        if (submitBtn) {
          submitBtn.innerHTML = 'Send Message';
          submitBtn.disabled = false;
        }
        setTimeout(() => {
            if(formMessage) formMessage.textContent = '';
        }, 2000);
    })
    .catch(error => {
        console.error('Error submitting form to backend:', error);
        if(formMessage) { formMessage.style.color = 'orange'; formMessage.textContent = 'Opening WhatsApp...'; }
        
        window.open(whatsappUrl, '_blank');
        
        contactForm.reset();
        if (submitBtn) {
          submitBtn.innerHTML = 'Send Message';
          submitBtn.disabled = false;
        }
        setTimeout(() => {
            if(formMessage) formMessage.textContent = '';
        }, 2000);
    });
  });
}

