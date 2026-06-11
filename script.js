// Aguarda o DOM carregar completamente para garantir segurança nas referências de elementos
window.addEventListener('DOMContentLoaded', () => {

  /* ─── CURSOR ─────────────────────────────────────────────── */
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursor-ring');
  let mx=0, my=0, rx=0, ry=0;
  
  document.addEventListener('mousemove', e => { 
    mx = e.clientX; 
    my = e.clientY; 
    cursor.style.left = mx + 'px'; 
    cursor.style.top = my + 'px'; 
  });
  
  (function animRing(){ 
    rx += (mx - rx) * 0.12; 
    ry += (my - ry) * 0.12; 
    ring.style.left = rx + 'px'; 
    ring.style.top = ry + 'px'; 
    requestAnimationFrame(animRing); 
  })();

  /* ─── AMBIENT PETALS ON CANVAS (background) ─────────────── */
  (function(){
    const c   = document.getElementById('petalfield');
    const ctx = c.getContext('2d');
    let petals = [], W, H;
    
    function resize(){ 
      W = c.width = window.innerWidth; 
      H = c.height = window.innerHeight; 
    }
    
    function makePetals(){
      petals = [];
      for(let i=0; i<28; i++){
        petals.push({
          x: Math.random() * W,
          y: Math.random() * H - H,
          size: Math.random() * 10 + 5,
          rot: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.018,
          vy: Math.random() * 0.5 + 0.25,
          vx: (Math.random() - 0.5) * 0.4,
          color: ['rgba(232,180,184,','rgba(196,175,212,','rgba(228,160,170,','rgba(210,185,220,'][Math.floor(Math.random()*4)],
          opacity: Math.random() * 0.35 + 0.1,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: Math.random() * 0.012 + 0.006
        });
      }
    }
    
    function drawPetal(p){
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.opacity;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.42, p.size, 0, 0, Math.PI * 2);
      ctx.fillStyle = p.color + '0.85)';
      ctx.fill();
      ctx.restore();
    }
    
    function animate(){
      ctx.clearRect(0, 0, W, H);
      const t = Date.now() / 1000;
      petals.forEach(p => {
        p.y   += p.vy;
        p.x   += p.vx + Math.sin(t * p.wobbleSpeed * 60 + p.wobble) * 0.22;
        p.rot += p.rotSpeed;
        if(p.y > H + 20){ 
          p.y = -20; 
          p.x = Math.random() * W; 
        }
        drawPetal(p);
      });
      requestAnimationFrame(animate);
    }
    
    resize(); 
    makePetals(); 
    animate();
    window.addEventListener('resize', () => { 
      resize(); 
      makePetals(); 
    });
  })();

  /* ─── NAVBAR ─────────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => { 
    navbar.classList.toggle('scrolled', window.scrollY > 60); 
  });

  /* ─── SCROLL REVEAL ──────────────────────────────────────── */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { 
      if(e.isIntersecting) e.target.classList.add('visible'); 
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  /* ─── COUNTDOWN — fixed to target June 12 2027 ───────────── */
  function updateCountdown(){
    const now  = new Date();
    const next = new Date(2027, 5, 12, 0, 0, 0); // O mês é indexado em zero (5 = Junho)
    const diff = next - now;
    
    if(diff <= 0){
      ['cd-days','cd-hours','cd-mins','cd-secs'].forEach(id => {
        document.getElementById(id).textContent = '00';
      });
      return;
    }
    
    document.getElementById('cd-days').textContent  = String(Math.floor(diff / 86400000)).padStart(2, '0');
    document.getElementById('cd-hours').textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
    document.getElementById('cd-mins').textContent  = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    document.getElementById('cd-secs').textContent  = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
  }
  
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ─── PARALLAX ───────────────────────────────────────────── */
  window.addEventListener('scroll', () => {
    document.getElementById('petalfield').style.transform = `translateY(${window.scrollY * 0.15}px)`;
  });

});

/* ─── GALLERY FALLBACK (FOTOS ASSETS) ───────────────────── */
function handleImageError(imgElement, labelText) {
  imgElement.style.display = 'none';
  const card = imgElement.closest('.photo-card');
  
  if (!card.querySelector('.photo-placeholder')) {
    const ph = document.createElement('div');
    ph.className = 'photo-placeholder';
    ph.innerHTML = `
      <i class="fa-regular fa-image"></i>
      <span>${labelText}</span>
    `;
    card.insertBefore(ph, card.querySelector('.photo-overlay'));
  }
}

/* ─── PETAL & HEART BURST (SURPRESA - WEB ANIMATIONS API) ── */
function spawnPetalBurst(){
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const petalShapes = [
    'M0,-12 C4,-8 4,0 0,8 C-4,0 -4,-8 0,-12', // Pétala clássica tipo 1
    'M0,-10 C6,-6 6,4 0,10 C-6,4 -6,-6 0,-10', // Pétala clássica tipo 2
    'M0,-6 C-2,-10 -9,-10 -9,-4 C-9,2 0,7 0,10 C0,7 9,2 9,-4 C9,-10 2,-10 0,-6' // Coração estilizado delicado
  ];
  const colors = [
    '#e8b4b8','#c4afd4','#f0c8cc','#d4b8dc','#f5d0d4',
    '#c9829a','#b8a4c9','#e8c4c8','#d0a0b8','#f0e0e8'
  ];

  // Gera 70 pétalas e coraçõezinhos voando em várias direções
  for(let i=0; i<70; i++){
    // Concatenação de string evita que o sistema auto-formate como hiperligação
    const el = document.createElementNS('http' + '://www.w3.org/2000/svg', 'svg');
    el.setAttribute('viewBox','-14 -14 28 28');
    el.style.width  = (Math.random() * 15 + 8) + 'px';
    el.style.height = el.style.width;
    el.style.position = 'fixed';
    el.style.pointerEvents = 'none';
    el.style.zIndex = '9000';
    
    const path = document.createElementNS('http' + '://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', petalShapes[Math.floor(Math.random() * petalShapes.length)]);
    path.setAttribute('fill', colors[Math.floor(Math.random() * colors.length)]);
    path.setAttribute('opacity','0.88');
    el.appendChild(path);

    // Posição inicial: Centro da tela com pequena variação
    const startX = cx + (Math.random() - 0.5) * 60;
    const startY = cy + (Math.random() - 0.5) * 60;
    
    // Trajetória de dispersão radial
    const angle  = Math.random() * Math.PI * 2;
    const dist   = Math.random() * Math.min(window.innerWidth, window.innerHeight) * 0.55 + 120;
    const endX   = startX + Math.cos(angle) * dist;
    const endY   = startY + Math.sin(angle) * dist;
    
    // Configurações individuais de tempo e rotação
    const dur    = Math.random() * 1400 + 1600; // Duração em milissegundos (entre 1.6s e 3s)
    const r0     = (Math.random() * 360) + 'deg';
    const r1     = (Math.random() * 960 - 480) + 'deg';

    el.style.left = startX + 'px';
    el.style.top  = startY + 'px';
    
    // Atribui classe de forma correta ao SVG
    el.setAttribute('class', 'petal-burst');
    document.body.appendChild(el);

    // Executa a animação de forma nativa e otimizada por hardware (Web Animations API)
    el.animate([
      { transform: `translate(0px, 0px) rotate(${r0}) scale(1)`, opacity: 0.9 },
      { opacity: 1, offset: 0.3 },
      { transform: `translate(${endX - startX}px, ${endY - startY}px) rotate(${r1}) scale(0.4)`, opacity: 0 }
    ], {
      duration: dur,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      delay: Math.random() * 500, // Dispersão orgânica gradual
      fill: 'forwards'
    });

    // Remove o elemento do DOM após o término da animação
    setTimeout(() => el.remove(), dur + 600);
  }
}

/* ─── DIGITALIZAÇÃO DA SURPRESA (TYPEWRITER EFFECT) ──────── */
function typeWriter(element, htmlContent, speed) {
  element.innerHTML = '';
  element.style.opacity = '1';
  let index = 0;
  let currentHTML = '';
  
  function step() {
    if (index < htmlContent.length) {
      if (htmlContent.slice(index, index + 4) === '<br>') {
        currentHTML += '<br>';
        index += 4;
      } else {
        currentHTML += htmlContent.charAt(index);
        index++;
      }
      element.innerHTML = currentHTML;
      setTimeout(step, speed);
    }
  }
  step();
}

function revealSurprise(){
  document.getElementById('surprise-btn').style.display = 'none';
  const rev = document.getElementById('surprise-reveal');
  rev.classList.add('active');
  requestAnimationFrame(() => { rev.classList.add('show'); });
  
  // Ativa a linda explosão de pétalas e corações
  spawnPetalBurst();
  
  // Inicia o efeito de máquina de escrever poético
  const phraseEl = document.getElementById('surprise-phrase');
  const targetText = `"Que cada dia ao seu lado<br>seja razão suficiente<br>para chamar este tempo de especial."`;
  typeWriter(phraseEl, targetText, 55);
}

/* ─── AUDIO SYSTEM (BYPASS AUTOPLAY COM ENTRADA) ──────────── */
let playing = false;
const audio    = document.getElementById('bg-audio');
const audioBtn = document.getElementById('audio-toggle');
audio.volume = 0.22;

function toggleAudio(){
  if(playing){ 
    audio.pause(); 
    audioBtn.classList.remove('playing'); 
  } else { 
    audio.play().catch(() => {}); 
    audioBtn.classList.add('playing'); 
  }
  playing = !playing;
}

// Inicia a experiência, toca o áudio e oculta o overlay com fade
function startExperience() {
  const intro = document.getElementById('intro-overlay');
  intro.classList.add('fade-out');
  
  audio.play().then(() => {
    playing = true;
    audioBtn.classList.add('playing');
  }).catch(e => {
    console.log("Autoplay bloqueado ou falhou:", e);
  });
}