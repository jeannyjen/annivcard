/* =============================================
   ANNIVERSARY SITE — script.js
   Features: page transitions, quiz logic,
   confetti, heart rain, typewriter, stars
============================================= */

// ─── STATE ──────────────────────────────────
let currentQuestion = 1;
const TOTAL_QUESTIONS = 10;

// ─── PAGE TRANSITIONS ───────────────────────
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
    p.style.display = 'none';
  });
  const page = document.getElementById(id);
  page.style.display = 'flex';
  // Trigger reflow then add active
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      page.classList.add('active');
    });
  });
}

// ─── HOME PAGE SETUP ────────────────────────
function initHome() {
  spawnHomeHearts();
  addStarsBg(document.querySelector('.stars-bg'), 30, false);
}

function spawnHomeHearts() {
  const container = document.getElementById('home-hearts');
  if (!container) return;
  const symbols = ['❤️','🩷','💕','💗','💖'];
  for (let i = 0; i < 14; i++) {
    const h = document.createElement('span');
    h.className = 'heart-particle';
    h.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    h.style.left = Math.random() * 100 + '%';
    h.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
    h.style.animationDuration = (8 + Math.random() * 12) + 's';
    h.style.animationDelay = (Math.random() * 12) + 's';
    container.appendChild(h);
  }
}

// ─── START GAME ─────────────────────────────
function startGame() {
  showPage('page-quiz');
  addProgressBar();
  showQuestion(1);
}

function addProgressBar() {
  if (document.querySelector('.quiz-progress')) return;
  const bar = document.createElement('div');
  bar.className = 'quiz-progress';
  bar.innerHTML = '<div class="quiz-progress-fill" id="progress-fill" style="width:0%"></div>';
  document.body.appendChild(bar);
}

function updateProgress(q) {
  const fill = document.getElementById('progress-fill');
  if (fill) {
    fill.style.width = ((q - 1) / TOTAL_QUESTIONS * 100) + '%';
  }
}

// ─── QUIZ LOGIC ─────────────────────────────
function showQuestion(n) {
  document.querySelectorAll('.quiz-card').forEach(c => c.classList.add('hidden'));
  const card = document.getElementById('q' + n);
  if (!card) return;
  card.classList.remove('hidden');
  currentQuestion = n;
  updateProgress(n);
  // Special: Q10 has background change
  if (n === 10) {
    document.getElementById('page-quiz').style.background =
      'linear-gradient(160deg, #1a0a1a 0%, #2d0d2d 40%, #3d1a3d 100%)';
  }
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function answer(btn, questionNum) {
  const card = document.getElementById('q' + questionNum);
  const allOpts = card.querySelectorAll('.opt');

  // Disable all options
  allOpts.forEach(o => o.disabled = true);

  const isCorrect = btn.dataset.correct === 'true';

  if (isCorrect) {
    btn.classList.add('correct');
    // Small heart burst on correct
    burstHearts(btn);
    // Show reward after a brief delay
    setTimeout(() => {
      const reward = document.getElementById('reward' + questionNum);
      if (reward) {
        reward.classList.remove('hidden');
        reward.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 500);
  } else {
    btn.classList.add('wrong');
    // Highlight correct answer
    allOpts.forEach(o => {
      if (o.dataset.correct === 'true') {
        o.classList.add('correct');
      }
    });
    // Show reward too (soft — user still gets the memory)
    setTimeout(() => {
      const reward = document.getElementById('reward' + questionNum);
      if (reward) {
        reward.classList.remove('hidden');
        reward.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 700);
  }
}

function nextQuestion(n) {
  if (n <= TOTAL_QUESTIONS) {
    showQuestion(n);
  } else {
    goToWin();
  }
}

// ─── FINAL QUESTION (Q10) ───────────────────
function answerFinal(btn, type) {
  const allOpts = document.getElementById('q10').querySelectorAll('.opt');
  allOpts.forEach(o => o.disabled = true);

  if (type === 'love1') {
    // 愛 — show sweet response, keep options
    btn.classList.add('correct');
    const r = document.getElementById('reward-love1');
    r.classList.remove('hidden');
    // Re-enable 很愛 after 2s so they can click it
    setTimeout(() => {
      allOpts.forEach(o => {
        if (o !== btn) {
          o.disabled = false;
          o.style.animation = 'pulse-rose 1s ease infinite';
        }
      });
    }, 2000);
  } else {
    // 很愛 — proceed to win
    btn.classList.add('correct');
    burstHearts(btn);
    setTimeout(() => {
      goToWin();
    }, 1000);
  }
}

// ─── HEART BURST EFFECT ─────────────────────
function burstHearts(el) {
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const symbols = ['❤️','💗','💖','🩷'];

  for (let i = 0; i < 8; i++) {
    const h = document.createElement('span');
    h.style.cssText = `
      position:fixed; left:${cx}px; top:${cy}px;
      font-size:${0.9 + Math.random()*0.8}rem;
      pointer-events:none; z-index:200;
      transition: transform 0.8s ease, opacity 0.8s ease;
      transform: translate(0,0); opacity:1;
    `;
    h.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    document.body.appendChild(h);

    const angle = (i / 8) * Math.PI * 2;
    const dist = 60 + Math.random() * 60;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        h.style.transform = `translate(${tx}px, ${ty}px) rotate(${Math.random()*360}deg)`;
        h.style.opacity = '0';
      });
    });

    setTimeout(() => h.remove(), 900);
  }
}

// ─── WIN PAGE ───────────────────────────────
function goToWin() {
  showPage('page-win');
  updateProgress(TOTAL_QUESTIONS + 1);
  // Remove progress bar
  const bar = document.querySelector('.quiz-progress');
  if (bar) bar.style.opacity = '0';

  // Launch confetti
  startConfetti();
  // Heart rain
  startHeartRain();
  // Restore quiz bg if changed
  document.getElementById('page-quiz').style.background = '';
}

// ─── CONFETTI ───────────────────────────────
let confettiInterval = null;
let confettiParticles = [];

function startConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const colors = ['#f2a7b3','#d46e7e','#e87a8e','#fce8ed','#e8c97a','#fff','#ff6b9d','#ffb347'];

  for (let i = 0; i < 120; i++) {
    confettiParticles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: 8 + Math.random() * 8,
      h: 5 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      vy: 1.5 + Math.random() * 3,
      vx: (Math.random() - 0.5) * 2,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.1,
      type: Math.random() > 0.5 ? 'rect' : 'heart'
    });
  }

  function drawHeart(ctx, x, y, size) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, y + size * 0.3);
    ctx.bezierCurveTo(x, y, x - size * 0.5, y, x - size * 0.5, y + size * 0.3);
    ctx.bezierCurveTo(x - size * 0.5, y + size * 0.65, x, y + size, x, y + size);
    ctx.bezierCurveTo(x, y + size, x + size * 0.5, y + size * 0.65, x + size * 0.5, y + size * 0.3);
    ctx.bezierCurveTo(x + size * 0.5, y, x, y, x, y + size * 0.3);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettiParticles.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;

      if (p.type === 'heart') {
        drawHeart(ctx, -p.w/2, -p.h/2, p.w);
      } else {
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }

      ctx.restore();

      p.y += p.vy;
      p.x += p.vx;
      p.angle += p.spin;

      if (p.y > canvas.height + 20) {
        p.y = -20;
        p.x = Math.random() * canvas.width;
      }
    });

    confettiInterval = requestAnimationFrame(loop);
  }

  loop();

  // Stop confetti after 8 seconds
  setTimeout(() => {
    cancelAnimationFrame(confettiInterval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettiParticles = [];
  }, 8000);
}

// ─── HEART RAIN ─────────────────────────────
function startHeartRain() {
  const symbols = ['❤️','💕','💗','💖','🩷','💓'];
  let count = 0;
  const interval = setInterval(() => {
    if (count > 40) { clearInterval(interval); return; }
    const h = document.createElement('span');
    h.className = 'heart-rain-particle';
    h.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    h.style.left = Math.random() * 100 + 'vw';
    h.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
    h.style.animationDuration = (3 + Math.random() * 3) + 's';
    h.style.animationDelay = (Math.random() * 0.5) + 's';
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 7000);
    count++;
  }, 150);
}

// ─── LETTER PAGE ────────────────────────────
function goToLetter() {
  showPage('page-letter');
}

// ─── ENDING PAGE ────────────────────────────
function goToEnding() {
  showPage('page-ending');
  buildStarField();
}

// ─── STAR FIELD (ENDING) ────────────────────
function buildStarField() {
  const field = document.getElementById('stars-field');
  if (!field) return;
  field.innerHTML = '';
  const count = 120;
  for (let i = 0; i < count; i++) {
    const s = document.createElement('div');
    s.className = 'star-dot';
    const size = 0.8 + Math.random() * 2.2;
    s.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation-duration: ${2 + Math.random() * 4}s;
      animation-delay: ${Math.random() * 4}s;
      opacity: ${0.2 + Math.random() * 0.8};
    `;
    field.appendChild(s);
  }
}

// ─── STATIC STARS (HOME) ────────────────────
function addStarsBg(container, count, large) {
  if (!container) return;
  for (let i = 0; i < count; i++) {
    const s = document.createElement('div');
    const size = large ? 1.5 + Math.random() * 3 : 1 + Math.random() * 2;
    s.style.cssText = `
      position: absolute;
      width: ${size}px; height: ${size}px;
      background: rgba(212,110,126,${0.15 + Math.random() * 0.25});
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: twinkle ${3 + Math.random() * 4}s ease-in-out infinite;
      animation-delay: ${Math.random() * 4}s;
    `;
    container.appendChild(s);
  }
}

// ─── PULSE ANIMATION (re-enable btn) ────────
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse-rose {
    0%,100% { box-shadow: 0 0 0 0 rgba(212,110,126,0.4); }
    50%      { box-shadow: 0 0 0 8px rgba(212,110,126,0); }
  }
`;
document.head.appendChild(style);

// ─── INIT ────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initHome();
});
