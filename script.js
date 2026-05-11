/* ===== PRELOADER ===== */
(function(){
  const name = "BALACHANDAR";
  const el = document.getElementById('preloaderName');
  const bar = document.getElementById('preloaderBar');
  const pre = document.getElementById('preloader');
  let i = 0;
  const typeInterval = setInterval(()=>{
    if(i < name.length){ el.textContent += name[i]; i++; bar.style.width = ((i/name.length)*100)+'%'; }
    else { clearInterval(typeInterval); setTimeout(()=>{ pre.classList.add('hidden'); document.body.style.overflow=''; initAll(); },600); }
  }, 180);
  document.body.style.overflow='hidden';
})();

/* ===== CURSOR ===== */
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
const trailContainer = document.getElementById('cursorTrail');
let mx=0,my=0,rx=0,ry=0;
const isMobile = window.innerWidth < 769;

if(!isMobile){
  document.addEventListener('mousemove',e=>{
    mx=e.clientX; my=e.clientY;
    dot.style.left=mx+'px'; dot.style.top=my+'px';
    // trail
    const t = document.createElement('div');
    t.className='cursor-trail-dot';
    t.style.left=mx+'px'; t.style.top=my+'px';
    trailContainer.appendChild(t);
    setTimeout(()=>{t.style.opacity='0';},50);
    setTimeout(()=>{t.remove();},450);
  });
  function animateRing(){rx+=(mx-rx)*0.15;ry+=(my-ry)*0.15;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(animateRing);}
  animateRing();
  document.querySelectorAll('a,button,.glass-card,.btn,.cert-card,.project-card,.skill-orb').forEach(el=>{
    el.addEventListener('mouseenter',()=>ring.classList.add('hover'));
    el.addEventListener('mouseleave',()=>ring.classList.remove('hover'));
  });
}

/* ===== NAVBAR ===== */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('navHamburger');
const mobileMenu = document.getElementById('mobileMenu');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll',()=>{
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  backToTop.classList.toggle('visible', window.scrollY > 500);
  updateActiveNav();
});

hamburger.addEventListener('click',()=>{
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mobile-link').forEach(l=>{
  l.addEventListener('click',()=>mobileMenu.classList.remove('open'));
});
backToTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

function updateActiveNav(){
  const sections = document.querySelectorAll('.section, .hero');
  const links = document.querySelectorAll('.nav-link');
  let current = '';
  sections.forEach(s=>{
    const top = s.offsetTop - 200;
    if(window.scrollY >= top) current = s.id;
  });
  links.forEach(l=>{
    l.classList.toggle('active', l.getAttribute('href') === '#'+current);
  });
}

/* ===== TYPED TEXT ===== */
const roles = ["Cloud Security Engineer","AI/ML Security Researcher","AWS Certified","Threat Hunter","Linux Enthusiast"];
let ri=0,ci=0,deleting=false;
const typedEl = document.getElementById('typedText');
function typeLoop(){
  const word = roles[ri];
  if(!deleting){
    typedEl.textContent = word.slice(0,ci+1);
    ci++;
    if(ci >= word.length){deleting=true;setTimeout(typeLoop,1800);return;}
    setTimeout(typeLoop,80);
  } else {
    typedEl.textContent = word.slice(0,ci);
    ci--;
    if(ci < 0){deleting=false;ci=0;ri=(ri+1)%roles.length;setTimeout(typeLoop,400);return;}
    setTimeout(typeLoop,40);
  }
}

/* ===== BG CANVAS (Stars + Particles + Aurora) ===== */
const bgCanvas = document.getElementById('bgCanvas');
const bgCtx = bgCanvas.getContext('2d');
function resizeBg(){bgCanvas.width=window.innerWidth;bgCanvas.height=window.innerHeight;}
resizeBg();
window.addEventListener('resize',resizeBg);

// Stars
const stars = Array.from({length:200},()=>({
  x:Math.random()*window.innerWidth,
  y:Math.random()*window.innerHeight,
  r:Math.random()*1.5+0.3,
  a:Math.random(),
  speed:Math.random()*0.005+0.002,
  phase:Math.random()*Math.PI*2
}));

// Particles
const particleCount = isMobile ? 20 : 50;
const particleColors = ['#00f5ff','#7b2fff','#ff2d78'];
const particles = Array.from({length:particleCount},()=>makeParticle());
function makeParticle(fromBottom){
  const shapes = ['circle','square','diamond'];
  return {
    x:Math.random()*window.innerWidth,
    y:fromBottom ? window.innerHeight+10 : Math.random()*window.innerHeight,
    size:Math.random()*6+2,
    speed:Math.random()*1.2+0.4,
    drift:Math.random()*0.6-0.3,
    color:particleColors[Math.floor(Math.random()*3)],
    opacity:0,
    maxOpacity:Math.random()*0.6+0.2,
    shape:shapes[Math.floor(Math.random()*3)]
  };
}

// Aurora blobs
const auroras = [
  {x:0.3,y:0.4,r:300,color:'0,245,255',vx:0.0003,vy:0.0002,phase:0},
  {x:0.7,y:0.6,r:250,color:'123,47,255',vx:-0.0002,vy:0.0003,phase:2},
  {x:0.5,y:0.3,r:200,color:'255,45,120',vx:0.0004,vy:-0.0001,phase:4}
];

let time = 0;
function drawBg(){
  bgCtx.clearRect(0,0,bgCanvas.width,bgCanvas.height);
  time += 0.016;

  // Aurora
  auroras.forEach(a=>{
    a.phase += 0.005;
    const ax = (a.x + Math.sin(a.phase)*0.1)*bgCanvas.width;
    const ay = (a.y + Math.cos(a.phase*0.7)*0.1)*bgCanvas.height;
    const breathe = a.r + Math.sin(a.phase*0.5)*40;
    const grad = bgCtx.createRadialGradient(ax,ay,0,ax,ay,breathe);
    grad.addColorStop(0,'rgba('+a.color+',0.07)');
    grad.addColorStop(1,'rgba('+a.color+',0)');
    bgCtx.fillStyle = grad;
    bgCtx.fillRect(0,0,bgCanvas.width,bgCanvas.height);
  });

  // Stars
  stars.forEach(s=>{
    s.phase += s.speed;
    const a = (Math.sin(s.phase)*0.5+0.5)*s.a;
    bgCtx.beginPath();
    bgCtx.arc(s.x,s.y,s.r,0,Math.PI*2);
    bgCtx.fillStyle = 'rgba(224,232,255,'+a+')';
    bgCtx.fill();
  });

  // Particles
  particles.forEach((p,i)=>{
    p.y -= p.speed;
    p.x += p.drift;
    if(p.y > bgCanvas.height*0.8) p.opacity = Math.min(p.opacity+0.01, p.maxOpacity);
    else if(p.y < bgCanvas.height*0.15) p.opacity = Math.max(p.opacity-0.02, 0);
    else p.opacity = Math.min(p.opacity+0.005, p.maxOpacity);
    if(p.y < -20 || p.opacity <= 0 && p.y < bgCanvas.height*0.1){
      particles[i] = makeParticle(true);
    }
    bgCtx.globalAlpha = p.opacity;
    bgCtx.fillStyle = p.color;
    if(p.shape==='circle'){
      bgCtx.beginPath(); bgCtx.arc(p.x,p.y,p.size/2,0,Math.PI*2); bgCtx.fill();
    } else if(p.shape==='square'){
      bgCtx.fillRect(p.x-p.size/2,p.y-p.size/2,p.size,p.size);
    } else {
      bgCtx.save(); bgCtx.translate(p.x,p.y); bgCtx.rotate(Math.PI/4);
      bgCtx.fillRect(-p.size/3,-p.size/3,p.size*0.66,p.size*0.66);
      bgCtx.restore();
    }
    bgCtx.globalAlpha = 1;
  });

  requestAnimationFrame(drawBg);
}
drawBg();

/* ===== THREE.JS HERO ===== */
function initHero3D(){
  const canvas = document.getElementById('heroCanvas');
  if(!canvas) return;
  const w = canvas.clientWidth || 400;
  const h = canvas.clientHeight || 400;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, w/h, 0.1, 100);
  camera.position.z = 4;

  const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true});
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Shield sphere wireframe
  const geo = new THREE.IcosahedronGeometry(1.3, 1);
  const mat = new THREE.MeshBasicMaterial({color:0x00f5ff, wireframe:true, transparent:true, opacity:0.35});
  const sphere = new THREE.Mesh(geo, mat);
  scene.add(sphere);

  // Inner sphere
  const geo2 = new THREE.IcosahedronGeometry(0.9, 2);
  const mat2 = new THREE.MeshBasicMaterial({color:0x7b2fff, wireframe:true, transparent:true, opacity:0.15});
  const inner = new THREE.Mesh(geo2, mat2);
  scene.add(inner);

  // Nodes at vertices
  const nodeGeo = new THREE.SphereGeometry(0.04, 8, 8);
  const nodeMat = new THREE.MeshBasicMaterial({color:0x7b2fff});
  const positions = geo.attributes.position;
  for(let i=0; i<positions.count; i+=3){
    const node = new THREE.Mesh(nodeGeo, nodeMat);
    node.position.set(positions.getX(i), positions.getY(i), positions.getZ(i));
    sphere.add(node);
  }

  // Orbiting labels
  const orbitLabels = ['AWS','AI/ML','Security'];
  const orbiters = [];
  orbitLabels.forEach((label, idx)=>{
    const g = new THREE.SphereGeometry(0.08, 12, 12);
    const colors = [0x00f5ff, 0x7b2fff, 0xff2d78];
    const m = new THREE.MeshBasicMaterial({color: colors[idx]});
    const orb = new THREE.Mesh(g, m);
    orbiters.push({mesh:orb, angle: (idx/3)*Math.PI*2, radius: 2, speed: 0.3 + idx*0.1});
    scene.add(orb);
  });

  function animate(){
    requestAnimationFrame(animate);
    sphere.rotation.y += 0.003;
    sphere.rotation.x += 0.001;
    inner.rotation.y -= 0.004;
    inner.rotation.x += 0.002;
    // Bob
    sphere.position.y = Math.sin(Date.now()*0.001)*0.15;
    inner.position.y = sphere.position.y;
    // Orbiters
    orbiters.forEach(o=>{
      o.angle += 0.008 * o.speed;
      o.mesh.position.x = Math.cos(o.angle) * o.radius;
      o.mesh.position.z = Math.sin(o.angle) * o.radius;
      o.mesh.position.y = Math.sin(o.angle*2)*0.3 + sphere.position.y;
    });
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize',()=>{
    const nw = canvas.clientWidth;
    const nh = canvas.clientHeight;
    camera.aspect = nw/nh;
    camera.updateProjectionMatrix();
    renderer.setSize(nw, nh);
  });
}

/* ===== HERO FLOATING OBJECTS ===== */
function initHeroFloating(){
  const container = document.getElementById('heroFloating');
  if(!container) return;
  const items = ['⬡','🔒','010110','⬡','101001','🔒','⬡','110010'];
  items.forEach((item, i)=>{
    const el = document.createElement('span');
    el.textContent = item;
    el.style.cssText = `
      position:absolute;
      bottom:${-20 - Math.random()*40}px;
      left:${Math.random()*100}%;
      font-size:${12 + Math.random()*16}px;
      color:rgba(0,245,255,${0.06 + Math.random()*0.1});
      animation:floatUp ${12+Math.random()*10}s linear infinite;
      animation-delay:${i*1.5}s;
      pointer-events:none;
      font-family:${item.length>2 ? "'Space Grotesk',monospace" : "inherit"};
    `;
    container.appendChild(el);
  });
  // Add keyframe
  if(!document.getElementById('floatUpStyle')){
    const style = document.createElement('style');
    style.id = 'floatUpStyle';
    style.textContent = `@keyframes floatUp{0%{transform:translateY(0) translateX(0);opacity:0;}10%{opacity:1;}90%{opacity:1;}100%{transform:translateY(-110vh) translateX(${Math.random()>0.5?'':'-'}40px);opacity:0;}}`;
    document.head.appendChild(style);
  }
}

/* ===== GSAP SCROLL ANIMATIONS ===== */
function initScrollAnimations(){
  gsap.registerPlugin(ScrollTrigger);

  // Hero stagger
  gsap.from('.hero-badge',{opacity:0,y:30,duration:0.8,delay:0.2});
  gsap.from('.hero-name',{opacity:0,y:40,duration:1,delay:0.5});
  gsap.from('.hero-subtitle',{opacity:0,y:30,duration:0.8,delay:0.8});
  gsap.from('.hero-typed',{opacity:0,y:20,duration:0.8,delay:1.1});
  gsap.from('.hero-cta',{opacity:0,y:20,duration:0.8,delay:1.3});
  gsap.from('.hero-stats',{opacity:0,y:20,duration:0.8,delay:1.5});
  gsap.from('.hero-right',{opacity:0,scale:0.8,duration:1.2,delay:1});

  // Sections
  const sections = document.querySelectorAll('.section');
  sections.forEach(sec=>{
    const label = sec.querySelector('.section-label');
    const title = sec.querySelector('.section-title');
    const subtitle = sec.querySelector('.section-subtitle');
    if(label) gsap.from(label,{scrollTrigger:{trigger:sec,start:'top 80%'},opacity:0,x:-40,duration:0.8});
    if(title) gsap.from(title,{scrollTrigger:{trigger:sec,start:'top 80%'},opacity:0,x:-40,duration:0.8,delay:0.15});
    if(subtitle) gsap.from(subtitle,{scrollTrigger:{trigger:sec,start:'top 80%'},opacity:0,y:20,duration:0.6,delay:0.3});
  });

  // About
  gsap.from('.about-avatar-col',{scrollTrigger:{trigger:'.about',start:'top 75%'},opacity:0,x:-50,duration:1});
  gsap.from('.about-text-col',{scrollTrigger:{trigger:'.about',start:'top 75%'},opacity:0,x:50,duration:1,delay:0.2});

  // Expertise cards
  gsap.utils.toArray('.expertise-card').forEach((c,i)=>{
    gsap.from(c,{scrollTrigger:{trigger:c,start:'top 85%'},opacity:0,y:60,duration:0.8,delay:i*0.15});
  });

  // Skill orbs
  gsap.utils.toArray('.skill-orb').forEach((c,i)=>{
    gsap.from(c,{scrollTrigger:{trigger:c,start:'top 90%'},opacity:0,y:40,scale:0.8,duration:0.6,delay:i*0.08});
  });

  // Skill bars
  ScrollTrigger.create({
    trigger:'#skills',
    start:'top 70%',
    onEnter:()=>{
      document.querySelectorAll('.skill-bar-fill').forEach(b=>b.classList.add('animate'));
    }
  });

  // Project cards
  gsap.utils.toArray('.project-card').forEach((c,i)=>{
    gsap.from(c,{scrollTrigger:{trigger:c,start:'top 85%'},opacity:0,y:50,duration:0.8,delay:i*0.15});
  });

  // Cert cards
  gsap.utils.toArray('.cert-card').forEach((c,i)=>{
    gsap.from(c,{scrollTrigger:{trigger:c,start:'top 85%'},opacity:0,rotateY:15,duration:0.8,delay:i*0.15});
  });

  // Why cards
  gsap.utils.toArray('.why-card').forEach((c,i)=>{
    gsap.from(c,{scrollTrigger:{trigger:c,start:'top 85%'},opacity:0,y:40,duration:0.7,delay:i*0.12});
  });

  // Contact
  gsap.from('.contact-form',{scrollTrigger:{trigger:'.contact',start:'top 75%'},opacity:0,y:40,duration:0.8});
  gsap.utils.toArray('.social-link').forEach((c,i)=>{
    gsap.from(c,{scrollTrigger:{trigger:c,start:'top 90%'},opacity:0,y:20,duration:0.5,delay:i*0.1});
  });
}

/* ===== INIT ===== */
function initAll(){
  typeLoop();
  initHero3D();
  initHeroFloating();
  initScrollAnimations();
}
