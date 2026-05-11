const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const contactEmail = 'balachandar.works@gmail.com';

/* ===== LOADER ===== */
(function initLoader() {
  const fill = document.getElementById('loaderFill');
  const text = document.getElementById('loaderText');
  const loader = document.getElementById('loader');
  if (!fill || !text || !loader) {
    queueMicrotask(initAll);
    return;
  }

  if (window.getComputedStyle(loader).display === 'none') {
    queueMicrotask(initAll);
    return;
  }

  if (prefersReducedMotion) {
    fill.style.width = '100%';
    text.textContent = 'Ready';
    loader.classList.add('hidden');
    queueMicrotask(initAll);
    return;
  }

  document.body.style.overflow = 'hidden';
  let progress = 0;
  const tick = setInterval(() => {
    progress += Math.random() * 12 + 6;
    fill.style.width = Math.min(progress, 100) + '%';
    if (progress >= 100) {
      clearInterval(tick);
      text.textContent = 'Ready';
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        initAll();
      }, 360);
    }
  }, 90);
})();

/* ===== NAVBAR ===== */
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const mobileOverlay = document.getElementById('mobileOverlay');

function setMobileMenu(open) {
  if (!navToggle || !mobileOverlay) return;
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  mobileOverlay.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}

function updateActiveNav() {
  const sections = document.querySelectorAll('.section, .hero');
  const links = document.querySelectorAll('.nav-item:not(.nav-item--cta)');
  let current = '';

  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 220) current = section.id;
  });

  links.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}

window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
  updateActiveNav();
}, { passive: true });

if (navToggle) {
  navToggle.addEventListener('click', () => setMobileMenu(!navToggle.classList.contains('open')));
}

document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => setMobileMenu(false));
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    setMobileMenu(false);
    closeCertificateModal();
  }
});

/* ===== TYPED ROLE ===== */
const roles = ['Cloud Security Engineer', 'AI/ML Security Researcher', 'AWS Certified Professional', 'Threat Detection Builder', 'Linux Hardening Practitioner'];
let roleIndex = 0;
let charIndex = 0;
let deleting = false;
const roleEl = document.getElementById('heroRole');

function typeLoop() {
  if (!roleEl) return;
  const word = roles[roleIndex];

  if (prefersReducedMotion) {
    roleEl.textContent = roles[0];
    return;
  }

  if (!deleting) {
    roleEl.textContent = word.slice(0, charIndex + 1);
    charIndex += 1;
    if (charIndex >= word.length) {
      deleting = true;
      setTimeout(typeLoop, 1800);
      return;
    }
    setTimeout(typeLoop, 65);
    return;
  }

  roleEl.textContent = word.slice(0, charIndex);
  charIndex -= 1;
  if (charIndex < 0) {
    deleting = false;
    charIndex = 0;
    roleIndex = (roleIndex + 1) % roles.length;
    setTimeout(typeLoop, 380);
    return;
  }
  setTimeout(typeLoop, 32);
}

/* ===== BACKGROUND 3D SCENE ===== */
function initBackground3D() {
  const canvas = document.getElementById('scene3d');
  if (!canvas || prefersReducedMotion || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const count = window.innerWidth < 768 ? 55 : 125;
  const spread = 42;
  const positions = [];
  const velocities = [];

  for (let i = 0; i < count; i += 1) {
    positions.push((Math.random() - 0.5) * spread, (Math.random() - 0.5) * spread, (Math.random() - 0.5) * 20);
    velocities.push((Math.random() - 0.5) * 0.014, (Math.random() - 0.5) * 0.014, (Math.random() - 0.5) * 0.008);
  }

  const pointGeo = new THREE.BufferGeometry();
  pointGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

  const points = new THREE.Points(pointGeo, new THREE.PointsMaterial({
    color: 0xd4af37,
    size: 0.12,
    transparent: true,
    opacity: 0.46,
    sizeAttenuation: true
  }));
  scene.add(points);

  const lineMesh = new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({
    color: 0x14b8a6,
    transparent: true,
    opacity: 0.052
  }));
  scene.add(lineMesh);

  let mouseX = 0;
  let mouseY = 0;
  document.addEventListener('mousemove', event => {
    mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  function animate() {
    requestAnimationFrame(animate);
    const pos = pointGeo.attributes.position.array;

    for (let i = 0; i < count; i += 1) {
      const offset = i * 3;
      pos[offset] += velocities[offset];
      pos[offset + 1] += velocities[offset + 1];
      pos[offset + 2] += velocities[offset + 2];

      if (Math.abs(pos[offset]) > spread / 2) velocities[offset] *= -1;
      if (Math.abs(pos[offset + 1]) > spread / 2) velocities[offset + 1] *= -1;
      if (Math.abs(pos[offset + 2]) > 10) velocities[offset + 2] *= -1;
    }
    pointGeo.attributes.position.needsUpdate = true;

    const linePositions = [];
    const maxDist = 4.8;
    for (let i = 0; i < count; i += 1) {
      for (let j = i + 1; j < count; j += 1) {
        const a = i * 3;
        const b = j * 3;
        const dx = pos[a] - pos[b];
        const dy = pos[a + 1] - pos[b + 1];
        const dz = pos[a + 2] - pos[b + 2];
        if ((dx * dx) + (dy * dy) + (dz * dz) < maxDist * maxDist) {
          linePositions.push(pos[a], pos[a + 1], pos[a + 2], pos[b], pos[b + 1], pos[b + 2]);
        }
      }
    }

    lineMesh.geometry.dispose();
    lineMesh.geometry = new THREE.BufferGeometry();
    if (linePositions.length) {
      lineMesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    }

    camera.position.x += (mouseX * 3 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 3 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
    points.rotation.y += 0.00025;
    renderer.render(scene, camera);
  }

  animate();
}

/* ===== HERO 3D OBJECT ===== */
function initHero3D() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || prefersReducedMotion || typeof THREE === 'undefined') return;

  const width = canvas.clientWidth || 420;
  const height = canvas.clientHeight || 420;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
  camera.position.z = 4;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const outerGeo = new THREE.DodecahedronGeometry(1.4, 0);
  const shield = new THREE.Mesh(outerGeo, new THREE.MeshBasicMaterial({
    color: 0xd4af37,
    wireframe: true,
    transparent: true,
    opacity: 0.26
  }));
  scene.add(shield);

  const inner = new THREE.Mesh(new THREE.IcosahedronGeometry(0.86, 1), new THREE.MeshBasicMaterial({
    color: 0x4f8cff,
    wireframe: true,
    transparent: true,
    opacity: 0.16
  }));
  scene.add(inner);

  const nodeGeo = new THREE.SphereGeometry(0.035, 6, 6);
  const nodeMat = new THREE.MeshBasicMaterial({ color: 0x14b8a6, transparent: true, opacity: 0.7 });
  const verts = outerGeo.attributes.position;
  for (let i = 0; i < verts.count; i += 1) {
    const node = new THREE.Mesh(nodeGeo, nodeMat);
    node.position.set(verts.getX(i), verts.getY(i), verts.getZ(i));
    shield.add(node);
  }

  const orbiters = [];
  [0xd4af37, 0x4f8cff, 0x14b8a6].forEach((color, index) => {
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.86 }));
    orbiters.push({ mesh: orb, angle: (index / 3) * Math.PI * 2, radius: 2.1, speed: 0.25 + index * 0.08 });
    scene.add(orb);
  });

  let heroMouseX = 0;
  let heroMouseY = 0;
  canvas.parentElement.addEventListener('mousemove', event => {
    const rect = canvas.parentElement.getBoundingClientRect();
    heroMouseX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    heroMouseY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
  }, { passive: true });

  function animate() {
    requestAnimationFrame(animate);
    const time = Date.now() * 0.001;

    shield.rotation.y += 0.004;
    shield.rotation.x = Math.sin(time * 0.3) * 0.1 + heroMouseY * 0.2;
    shield.rotation.z = heroMouseX * 0.15;
    inner.rotation.y -= 0.005;
    inner.rotation.x += 0.002;
    shield.position.y = Math.sin(time * 0.8) * 0.1;
    inner.position.y = shield.position.y;

    orbiters.forEach(orbiter => {
      orbiter.angle += 0.006 * orbiter.speed;
      orbiter.mesh.position.x = Math.cos(orbiter.angle) * orbiter.radius;
      orbiter.mesh.position.z = Math.sin(orbiter.angle) * orbiter.radius;
      orbiter.mesh.position.y = Math.sin(orbiter.angle * 1.5) * 0.4 + shield.position.y;
    });

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    const newWidth = canvas.clientWidth;
    const newHeight = canvas.clientHeight;
    if (!newWidth || !newHeight) return;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  });
}

/* ===== SCROLL ANIMATIONS ===== */
function initScrollAnimations() {
  if (prefersReducedMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    document.querySelectorAll('.skill-fill').forEach(bar => {
      bar.style.setProperty('--w', bar.dataset.width + '%');
      bar.classList.add('animate');
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  gsap.from('.hero-tag', { opacity: 0, y: 20, duration: 0.7, delay: 0.15 });
  gsap.from('.hero-title-line', { opacity: 0, y: 42, duration: 0.9, delay: 0.28 });
  gsap.from('.hero-role', { opacity: 0, y: 20, duration: 0.7, delay: 0.48 });
  gsap.from('.hero-desc', { opacity: 0, y: 20, duration: 0.7, delay: 0.62 });
  gsap.from('.hero-actions', { opacity: 0, y: 20, duration: 0.7, delay: 0.78 });
  gsap.from('.hero-metrics', { opacity: 0, y: 20, duration: 0.7, delay: 0.92 });
  gsap.from('.hero-right', { opacity: 0, scale: 0.9, duration: 1, delay: 0.55 });

  document.querySelectorAll('.section').forEach(section => {
    const tag = section.querySelector('.section-tag');
    const heading = section.querySelector('.section-heading');
    if (tag) gsap.from(tag, { scrollTrigger: { trigger: section, start: 'top 82%' }, opacity: 0, x: -24, duration: 0.55 });
    if (heading) gsap.from(heading, { scrollTrigger: { trigger: section, start: 'top 82%' }, opacity: 0, x: -28, duration: 0.65, delay: 0.08 });
  });

  ['.about-visual', '.about-text', '.exp-card', '.lab-card', '.skill-group', '.proj', '.cert', '.why-item', '.contact-info', '.contact-form'].forEach(selector => {
    gsap.utils.toArray(selector).forEach((element, index) => {
      gsap.from(element, {
        scrollTrigger: { trigger: element, start: 'top 86%' },
        opacity: 0,
        y: 30,
        duration: 0.62,
        delay: Math.min(index * 0.08, 0.24)
      });
    });
  });

  ScrollTrigger.create({
    trigger: '#skills',
    start: 'top 70%',
    onEnter: () => {
      document.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.setProperty('--w', bar.dataset.width + '%');
        bar.classList.add('animate');
      });
    }
  });
}

/* ===== PROJECT FILTERS ===== */
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projects = document.querySelectorAll('.proj');
  if (!filterButtons.length || !projects.length) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach(item => item.classList.toggle('active', item === button));
      projects.forEach(project => {
        project.classList.toggle('hidden', filter !== 'all' && project.dataset.category !== filter);
      });
    });
  });
}

/* ===== CERTIFICATE MODAL ===== */
const certModal = document.getElementById('certModal');
const certModalImage = document.getElementById('certModalImage');
const certModalClose = document.getElementById('certModalClose');

function closeCertificateModal() {
  if (!certModal || !certModalImage) return;
  certModal.classList.remove('open');
  certModal.setAttribute('aria-hidden', 'true');
  certModalImage.src = '';
  document.body.style.overflow = '';
}

function initCertificateModal() {
  document.querySelectorAll('.cert').forEach(card => {
    card.addEventListener('click', event => {
      if (event.target.closest('a, button')) return;
      card.classList.toggle('flipped');
    });
  });

  document.querySelectorAll('[data-cert-preview]').forEach(button => {
    button.addEventListener('click', () => {
      if (!certModal || !certModalImage) return;
      certModalImage.src = button.dataset.certPreview;
      certModal.classList.add('open');
      certModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (certModalClose) certModalClose.focus();
    });
  });

  if (certModalClose) certModalClose.addEventListener('click', closeCertificateModal);
  if (certModal) {
    certModal.addEventListener('click', event => {
      if (event.target === certModal) closeCertificateModal();
    });
  }
}

/* ===== CONTACT FORM ===== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (!form) return;

  form.addEventListener('submit', event => {
    event.preventDefault();
    const name = document.getElementById('formName')?.value.trim();
    const email = document.getElementById('formEmail')?.value.trim();
    const message = document.getElementById('formMsg')?.value.trim();

    if (!name || !email || !message) {
      if (note) note.textContent = 'Please complete all fields before sending.';
      return;
    }

    const subject = encodeURIComponent('Portfolio contact from ' + name);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
    if (note) note.textContent = 'Opening your email client with the message ready.';
  });
}

/* ===== INIT ===== */
function initAll() {
  typeLoop();
  updateActiveNav();
  initProjectFilters();
  initCertificateModal();
  initContactForm();
  initBackground3D();
  initHero3D();
  initScrollAnimations();
}
