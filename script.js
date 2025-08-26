// ================== BUBBLES ==================
const bubblesContainer = document.querySelector('.bubbles');

const bubbleImages = [
  'https://i.imgur.com/4M7IWwP.png',
  'https://i.imgur.com/8Km9tLL.png'
];

function createBubble() {
  const bubble = document.createElement('div');
  const isImageBubble = Math.random() < 0.7;

  if (isImageBubble) {
    bubble.classList.add('bubble', 'image-bubble');
    const size = Math.random() * 60 + 50;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;

    const img = document.createElement('img');
    img.src = bubbleImages[Math.floor(Math.random() * bubbleImages.length)];
    bubble.appendChild(img);
  } else {
    bubble.classList.add('bubble');
    const size = Math.random() * 30 + 20;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
  }

  bubble.style.left = `${Math.random() * 100}%`;
  bubble.style.animationDuration = `${6 + Math.random() * 6}s`;

  bubblesContainer.appendChild(bubble);
  setTimeout(() => bubble.remove(), 15000);
}

setInterval(createBubble, 300);

// ================== POPUP FLOW ==================
const mainCard = document.getElementById('mainCard');
const enterDayBtn = document.getElementById('enterDayBtn');
const revealImage = document.getElementById('revealImage');

mainCard.addEventListener('click', () => {
  mainCard.textContent = "🥺 It's a special day for me…💕";
  mainCard.style.cursor = 'default';
  enterDayBtn.style.display = 'block';
  revealImage.style.display = 'block';
});

enterDayBtn.addEventListener('click', () => {
  document.querySelector('.popup-container').style.display = 'none';
  document.querySelector('.stickers').style.display = 'none';
  document.querySelector('.bubbles').style.display = 'none';
  document.getElementById('celebrationPage').style.display = 'flex';

  startSparkles();

  // 🎉 Trigger heading word-by-word reveal WITH fireworks
  const heading = document.querySelector('.birthday-heading');
  threePartWordEffect(heading, 1500, () => {
    const canvas = document.getElementById('sparkleCanvas');
    const W = canvas.width, H = canvas.height;
    const centerX = W / 2 + (Math.random() - 0.5) * 200;
    const centerY = H * 0.4 + (Math.random() - 0.5) * 100;

    explodeFirework(centerX, centerY, `hsl(${Math.random() * 360}, 100%, 60%)`);
    createHeartBurst(centerX, centerY);
  });
});

// ================== SPARKLES (Fireworks & Hearts) ==================
function startSparkles() {
  const canvas = document.getElementById('sparkleCanvas');
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  const particles = [];
  const fireworks = [];

  // Firework rocket launcher
  function launchFirework() {
    const x = Math.random() * W * 0.8 + W * 0.1; // random horizontal start
    const color = `hsl(${Math.random() * 360}, 100%, 60%)`;

    // random direction: vertical or diagonal
    const direction = Math.random();
    let dx = 0;
    let dy = -(6 + Math.random() * 3); // upward speed

    if (direction < 0.33) {
      dx = -2 - Math.random() * 2; // left diagonal
    } else if (direction < 0.66) {
      dx = 2 + Math.random() * 2; // right diagonal
    }
    // else dx stays 0 = vertical

    fireworks.push({
      x,
      y: H,
      dx,
      dy,
      targetY: H * (0.3 + Math.random() * 0.3),
      exploded: false,
      color
    });
  }

  // Big firework explosion
  window.explodeFirework = function (x, y, color) {
    const particleCount = 120; // big burst
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      particles.push({
        x, y,
        angle,
        speed: Math.random() * 6 + 2,
        size: Math.random() * 4 + 2,
        color,
        alpha: 1,
        decay: 0.015 + Math.random() * 0.01
      });
    }
  }

  // Heart burst
  window.createHeartBurst = function (x, y) {
    const colors = ['#FF66CC','#FF33AA','#FF99CC','#FF0077','#FFFFFF'];
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      particles.push({
        type: 'heart',
        x, y,
        angle,
        speed: 2 + Math.random()*4,
        size: 10 + Math.random()*6,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: 0.015
      });
    }
  }

  function drawHeart(cx, cy, size, color, alpha) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    const topY = cy - size / 3;
    ctx.moveTo(cx, topY);
    ctx.bezierCurveTo(cx + size/2, topY - size/2, cx + size*1.25, topY + size/3, cx, cy + size);
    ctx.bezierCurveTo(cx - size*1.25, topY + size/3, cx - size/2, topY - size/2, cx, topY);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Animate fireworks
  function animate() {
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(0, 0, W, H);

    // Firework rockets
    fireworks.forEach((f, i) => {
      if (!f.exploded) {
        f.x += f.dx;
        f.y += f.dy;
        ctx.fillStyle = f.color;
        ctx.beginPath();
        ctx.arc(f.x, f.y, 3, 0, Math.PI * 2);
        ctx.fill();

        if (f.y <= f.targetY) {
          f.exploded = true;
          explodeFirework(f.x, f.y, f.color);
          createHeartBurst(f.x, f.y);
        }
      } else {
        fireworks.splice(i, 1);
      }
    });

    // Firework particles
    particles.forEach((p, i) => {
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed;
      p.alpha -= p.decay || 0.02;
      p.size *= 0.98;

      if (p.alpha <= 0 || p.size < 1) {
        particles.splice(i, 1);
      } else {
        if (p.type === 'heart') {
          drawHeart(p.x, p.y, p.size, p.color, p.alpha);
        } else {
          ctx.beginPath();
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
    });

    requestAnimationFrame(animate);
  }

  // Launch fireworks automatically
  setInterval(launchFirework, 1000);

  animate();

  // 🎆 EXTRA: Button-triggered mega bursts
  const celebrateBtn = document.querySelector('.celebrate-btn');
  celebrateBtn.addEventListener('click', () => {
    const centerX = W / 2;
    const centerY = H * 0.4;

    for (let i = 0; i < 3; i++) {
      const offsetX = centerX + (Math.random() - 0.5) * 300;
      const offsetY = centerY + (Math.random() - 0.5) * 200;

      explodeFirework(offsetX, offsetY, `hsl(${Math.random() * 360}, 100%, 60%)`);
      createHeartBurst(offsetX, offsetY);
    }
  });
}

// ================== THREE-STEP WORD EFFECT ==================
function threePartWordEffect(element, delay = 1200, fireworkTrigger) {
  element.textContent = ""; // clear heading first

  const parts = ["Happy", "Birthday,", "MadamJii"];
  let i = 0;

  function showPart() {
    if (i < parts.length) {
      const span = document.createElement("span");
      span.textContent = parts[i] + " ";
      span.classList.add("word");
      element.appendChild(span);

      // 🎆 Trigger fireworks synced with word
      if (typeof fireworkTrigger === "function") {
        fireworkTrigger();
      }

      i++;
      setTimeout(showPart, delay);
    }
  }

  showPart();
}

// 🎂 Cake Cutting Button
const cakeBtn = document.querySelector('.cake-btn');
const cakePage = document.getElementById('cakePage');
const celebrationPage = document.getElementById('celebrationPage');
const birthdayPage = document.getElementById('birthdayPage'); // new

cakeBtn.addEventListener('click', () => {
  celebrationPage.style.display = 'none';
  cakePage.style.display = 'flex';
});

// ================== SPRINKLE RAIN ==================
let sprinkleRunning = false;
let sprinkleIntervalId = null;
let sprinkleRAF = null;
let sprinkleResizeHandler = null;

function startSprinkleRain() {
  if (sprinkleRunning) return;          // prevent duplicates
  sprinkleRunning = true;

  const canvas = document.getElementById('sprinkleCanvas');
  const ctx = canvas.getContext('2d');

  function size() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  size();
  sprinkleResizeHandler && window.removeEventListener('resize', sprinkleResizeHandler);
  sprinkleResizeHandler = () => size();
  window.addEventListener('resize', sprinkleResizeHandler);

  const sprinkles = [];
  const colors = ['#ff66b2','#ff3399','#ff80df','#ffd166','#63d2ff','#7dff7a'];

  function createSprinkle() {
    const len = 8 + Math.random()*10;
    sprinkles.push({
      x: Math.random() * canvas.width,
      y: -30,
      w: len * 0.35,
      h: len,
      color: colors[Math.floor(Math.random()*colors.length)],
      vy: 2 + Math.random()*3.5,
      angle: Math.random()*360,
      spin: (Math.random()*6 - 3)
    });
  }

  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    for (let i = sprinkles.length - 1; i >= 0; i--) {
      const s = sprinkles[i];
      s.y += s.vy;
      s.angle += s.spin;

      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.angle * Math.PI/180);
      ctx.fillStyle = s.color;
      ctx.fillRect(-s.w/2, -s.h/2, s.w, s.h);
      ctx.restore();

      if (s.y > canvas.height + 40) sprinkles.splice(i,1);
    }

    sprinkleRAF = requestAnimationFrame(draw);
  }

  // steady rain
  sprinkleIntervalId = setInterval(() => {
    for (let i = 0; i < 10; i++) createSprinkle();
  }, 110);

  draw();
}

function stopSprinkleRain() {
  sprinkleRunning = false;
  if (sprinkleIntervalId) clearInterval(sprinkleIntervalId);
  if (sprinkleRAF) cancelAnimationFrame(sprinkleRAF);
  sprinkleIntervalId = null;
  sprinkleRAF = null;

  const canvas = document.getElementById('sprinkleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx && ctx.clearRect(0,0,canvas.width,canvas.height);
  }
  sprinkleResizeHandler && window.removeEventListener('resize', sprinkleResizeHandler);
  sprinkleResizeHandler = null;
}

// 👇 start rain when the cake IMAGE is clicked
const cakePhoto = document.getElementById('cakePhoto');
if (cakePhoto) {
  cakePhoto.addEventListener('click', startSprinkleRain);
}

// optional: stop when leaving the page
const backBtn = document.getElementById('backToCelebrationBtn');
if (backBtn) {
  backBtn.addEventListener('click', () => {
    stopSprinkleRain();
    document.getElementById('cakePage').style.display = 'none';
    document.getElementById('celebrationPage').style.display = 'flex';
  });
}

// ================== NEXT BUTTON ==================
const nextBtn = document.getElementById('nextBtn');
if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    stopSprinkleRain();
    cakePage.style.display = 'none';
    birthdayPage.style.display = 'flex';

    // 🎈 small bounce animation for card
    const card = birthdayPage.querySelector('.birthday-card');
    card.style.opacity = '0';
    card.style.transform = 'scale(0.8)';
    setTimeout(() => {
      card.style.transition = 'all 0.6s ease';
      card.style.opacity = '1';
      card.style.transform = 'scale(1)';
    }, 50);
  });
}
