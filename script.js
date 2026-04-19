document.addEventListener('DOMContentLoaded', () => {
  createFloatingHearts();
  initPageSystem();
  initQuiz();
  initLetter();
  initWishesCarousel();
  initCakeCandles();
  initStartButton();
});

/* ====== PAGE NAVIGATION SYSTEM ====== */
const pages = [];
let currentPageIndex = 0;

function initPageSystem() {
  document.querySelectorAll('.page').forEach(p => pages.push(p));

  const dotsContainer = document.getElementById('pageDots');
  pages.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'page-dot' + (i === 0 ? ' active' : '');
    dotsContainer.appendChild(dot);
  });

  document.querySelectorAll('.next-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.next;
      const targetIndex = pages.findIndex(p => p.id === targetId);
      if (targetIndex !== -1) goToPage(targetIndex);
    });
  });
}

function goToPage(index) {
  if (index === currentPageIndex || index < 0 || index >= pages.length) return;

  const current = pages[currentPageIndex];
  const next = pages[index];

  current.classList.remove('active');
  current.classList.add('exit-out');

  setTimeout(() => {
    current.classList.remove('exit-out');
    next.classList.add('active');

    const dots = document.querySelectorAll('.page-dot');
    dots[currentPageIndex].classList.remove('active');
    dots[index].classList.add('active');

    currentPageIndex = index;

    if (next.id === 'page-counter') {
      setTimeout(animateCounters, 400);
    }
  }, 400);
}

function goToNextPage() {
  if (currentPageIndex < pages.length - 1) {
    goToPage(currentPageIndex + 1);
  }
}

/* ====== FLOATING HEARTS ====== */
function createFloatingHearts() {
  const container = document.getElementById('heartsBg');
  const hearts = ['💕', '💖', '💗', '💘', '💝', '✨', '🌸', '💐'];

  function spawnHeart() {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (Math.random() * 1.5 + 0.8) + 'rem';
    heart.style.animationDuration = (Math.random() * 8 + 8) + 's';
    heart.style.animationDelay = (Math.random() * 2) + 's';
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 18000);
  }

  for (let i = 0; i < 8; i++) setTimeout(spawnHeart, i * 600);
  setInterval(spawnHeart, 2500);
}

/* ====== COUNTER ANIMATION ====== */
let countersAnimated = false;

function animateCounters() {
  if (countersAnimated) return;
  countersAnimated = true;

  const counters = document.querySelectorAll('.counter-number[data-target]');
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.target);
    const duration = 2500;
    const startTime = performance.now();

    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(easeOut(progress) * target);
      counter.textContent = current.toLocaleString() + (progress >= 1 ? '+' : '');
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  });
}

/* ====== QUIZ STATE (accessible for reset) ====== */
let quiz1Answered = false;
let quiz2Answered = false;
let loveQuizState = { noClickCount: 0, isRunaway: false };

function initQuiz() {
  const options = document.querySelectorAll('.quiz-option:not(.bf-option)');
  const result = document.getElementById('quizResult');

  options.forEach(opt => {
    opt.addEventListener('click', () => {
      if (quiz1Answered) return;

      if (opt.dataset.correct === 'true') {
        opt.classList.add('selected-correct');
        result.textContent = 'Correct! It\'s Rashi, obviously! Was there ever any doubt? 🥰';
        quiz1Answered = true;
        setTimeout(() => {
          const loveQuizIndex = pages.findIndex(p => p.id === 'page-lovequiz');
          goToPage(loveQuizIndex);
        }, 1200);
      } else {
        opt.classList.add('selected-wrong');
        result.textContent = 'ERROR 404: Wrong answer not found. Try again! 😤';
        setTimeout(() => {
          opt.classList.remove('selected-wrong');
          opt.style.display = 'none';
          result.textContent = '';
        }, 1500);
      }
    });
  });

  initLoveQuiz();

  const bfOptions = document.querySelectorAll('.bf-option');
  const result2 = document.getElementById('quizResult2');

  const bfResponses = {
    taste: "Obviously! He picked YOU after all 😏",
    humor: "Even his code has good comments... sometimes 😂",
    love: "Aww, and it grows every single day 🥺💕",
    all: "CORRECT! Triple threat boyfriend right here 💪😎"
  };

  bfOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      if (quiz2Answered) return;
      quiz2Answered = true;
      opt.classList.add('selected-correct');
      result2.textContent = bfResponses[opt.dataset.answer];
      launchConfetti();
      setTimeout(() => {
        const reasonsIndex = pages.findIndex(p => p.id === 'page-reasons');
        goToPage(reasonsIndex);
      }, 2000);
    });
  });
}

/* ====== DO YOU LOVE ME QUIZ ====== */
function initLoveQuiz() {
  const yesBtn = document.getElementById('loveYesBtn');
  const noBtn = document.getElementById('loveNoBtn');
  const message = document.getElementById('loveMessage');

  const noMessages = [
    "Wait... really?! Think again! 😢",
    "Are you sure? My heart just cracked a little 💔",
    "Okay this is getting concerning... 😰",
    "I'm literally going to cry right now 🥺",
    "Last chance before the button runs away! 😤",
  ];

  yesBtn.addEventListener('click', () => {
    if (message.classList.contains('success')) return;
    message.textContent = "I KNEW IT! Rashi loves me! Best answer ever! 🥳💕💖";
    message.classList.add('success');
    yesBtn.classList.add('growing');
    noBtn.style.display = 'none';
    launchConfetti();
    setTimeout(() => {
      const bfIndex = pages.findIndex(p => p.id === 'page-bfquiz');
      goToPage(bfIndex);
    }, 1800);
  });

  noBtn.addEventListener('click', () => {
    if (message.classList.contains('success')) return;

    loveQuizState.noClickCount++;

    if (loveQuizState.noClickCount <= 5) {
      message.textContent = noMessages[loveQuizState.noClickCount - 1];
      noBtn.classList.add('shrinking');
      yesBtn.classList.add('growing');
      setTimeout(() => {
        noBtn.classList.remove('shrinking');
        yesBtn.classList.remove('growing');
      }, 400);
    }

    if (loveQuizState.noClickCount >= 6) {
      loveQuizState.isRunaway = true;
      noBtn.classList.add('runaway');
      message.textContent = "NOPE! The button has had enough. Clicking 'No' is NOT allowed! 🚫😤";
      moveNoButton();
    }
  });

  noBtn.addEventListener('mouseenter', () => {
    if (loveQuizState.isRunaway) moveNoButton();
  });

  noBtn.addEventListener('touchstart', (e) => {
    if (loveQuizState.isRunaway) {
      e.preventDefault();
      moveNoButton();
    }
  }, { passive: false });

  function moveNoButton() {
    const btnW = noBtn.offsetWidth;
    const btnH = noBtn.offsetHeight;
    const pad = 20;

    const maxX = window.innerWidth - btnW - pad;
    const maxY = window.innerHeight * 0.55;

    let newX = Math.random() * maxX + pad / 2;
    let newY = Math.random() * maxY + pad;

    const yesBtnRect = yesBtn.getBoundingClientRect();
    if (Math.abs(newX - yesBtnRect.left) < 150 && Math.abs(newY - yesBtnRect.top) < 80) {
      newX = (newX + maxX / 2) % maxX;
      newY = (newY + maxY / 2) % maxY;
    }

    noBtn.style.left = newX + 'px';
    noBtn.style.top = newY + 'px';

    const funnyMessages = [
      "NOPE! Can't catch me! 🏃‍♂️💨",
      "Nice try! The answer is YES! 😏",
      "This button refuses to be clicked! 🚫",
      "I'm too fast for you! Just say YES! 💕",
      "ERROR: 'No' button has left the chat 😂",
      "You'll never catch me! Give up and click Yes! 🏃‍♀️",
      "I have legs now! You can't click No! 🦵🦵",
      "This button is on a diet — no more clicks! 🙅‍♂️",
    ];
    message.textContent = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
  }
}

/* ====== LOVE LETTER ====== */
function initLetter() {
  const envelope = document.getElementById('envelope');
  const letterContent = document.getElementById('letterContent');

  envelope.addEventListener('click', () => {
    envelope.style.opacity = '0';
    envelope.style.transform = 'scale(0.5) translateY(-50px)';
    envelope.style.pointerEvents = 'none';
    setTimeout(() => {
      envelope.style.display = 'none';
      letterContent.classList.add('visible');
    }, 500);
  });
}

/* ====== WISHES CAROUSEL ====== */
function initWishesCarousel() {
  const cards = document.querySelectorAll('.wish-card');
  const dotsContainer = document.getElementById('wishDots');
  let currentWish = 0;
  let autoplayTimer;

  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'wish-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToWish(i));
    dotsContainer.appendChild(dot);
  });

  function goToWish(index) {
    cards[currentWish].classList.remove('active');
    document.querySelectorAll('.wish-dot')[currentWish].classList.remove('active');
    currentWish = index;
    cards[currentWish].classList.add('active');
    document.querySelectorAll('.wish-dot')[currentWish].classList.add('active');
    resetAutoplay();
  }

  function nextWish() { goToWish((currentWish + 1) % cards.length); }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(nextWish, 4000);
  }

  resetAutoplay();
}

/* ====== CAKE CANDLES ====== */
function initCakeCandles() {
  const flames = document.querySelectorAll('.flame');
  const blowText = document.getElementById('blowText');
  const afterBlow = document.getElementById('afterBlow');
  const cake = document.querySelector('.cake');
  const knife = document.getElementById('knife');
  const cutLine = document.getElementById('cakeCutLine');
  const cakeSlice = document.getElementById('cakeSlice');
  let blownCount = 0;
  let animating = false;

  cake.addEventListener('click', () => {
    if (animating) return;
    const unblown = document.querySelectorAll('.flame:not(.blown)');
    if (unblown.length > 0) {
      unblown[0].classList.add('blown');
      blownCount++;

      if (blownCount >= flames.length) {
        animating = true;
        blowText.style.display = 'none';
        startCuttingSequence();
      }
    }
  });

  function startCuttingSequence() {
    // Step 1: Knife enters (1s)
    knife.classList.add('enter');

    // Step 2: Knife cuts down (starts at 1.1s)
    setTimeout(() => {
      knife.classList.remove('enter');
      knife.classList.add('cut');
      cutLine.classList.add('cutting');
    }, 1100);

    // Step 3: Cake shows gap, slice slides out (starts at 1.7s)
    setTimeout(() => {
      cake.classList.add('cut-done');
      cakeSlice.classList.add('slide-out');
    }, 1700);

    // Step 4: Knife leaves (starts at 2s)
    setTimeout(() => {
      knife.classList.remove('cut');
      knife.classList.add('leave');
    }, 2000);

    // Step 5: Show celebration (starts at 2.8s)
    setTimeout(() => {
      afterBlow.classList.add('visible');
      launchConfetti();
      setTimeout(launchConfetti, 800);
      setTimeout(launchConfetti, 1600);
    }, 2800);
  }

  const restartBtn = document.getElementById('restartBtn');
  restartBtn.addEventListener('click', () => {
    resetEverything();
    flames.forEach(f => f.classList.remove('blown'));
    blownCount = 0;
    animating = false;
    afterBlow.classList.remove('visible');
    blowText.style.display = 'block';
    knife.classList.remove('enter', 'cut', 'leave');
    cutLine.classList.remove('cutting');
    cakeSlice.classList.remove('slide-out');
    cake.classList.remove('cut-done');
    goToPage(0);
  });
}

/* ====== FULL RESET ====== */
function resetEverything() {
  countersAnimated = false;

  // Reset counter numbers
  document.querySelectorAll('.counter-number[data-target]').forEach(c => {
    c.textContent = '0';
  });

  // Reset Quiz 1
  quiz1Answered = false;
  document.getElementById('quizResult').textContent = '';
  document.querySelectorAll('.quiz-option:not(.bf-option)').forEach(opt => {
    opt.classList.remove('selected-correct', 'selected-wrong');
    opt.style.display = '';
  });

  // Reset Love Quiz
  loveQuizState.noClickCount = 0;
  loveQuizState.isRunaway = false;
  const loveMessage = document.getElementById('loveMessage');
  loveMessage.textContent = '';
  loveMessage.classList.remove('success');
  const yesBtn = document.getElementById('loveYesBtn');
  const noBtn = document.getElementById('loveNoBtn');
  yesBtn.classList.remove('growing');
  noBtn.classList.remove('runaway', 'shrinking');
  noBtn.style.display = '';
  noBtn.style.left = '';
  noBtn.style.top = '';
  noBtn.style.position = '';

  // Reset BF Quiz
  quiz2Answered = false;
  document.getElementById('quizResult2').textContent = '';
  document.querySelectorAll('.bf-option').forEach(opt => {
    opt.classList.remove('selected-correct');
  });

  // Reset Letter
  const envelope = document.getElementById('envelope');
  const letterContent = document.getElementById('letterContent');
  envelope.style.display = '';
  envelope.style.opacity = '';
  envelope.style.transform = '';
  envelope.style.pointerEvents = '';
  envelope.classList.remove('opened');
  letterContent.classList.remove('visible');
}

/* ====== START BUTTON ====== */
function initStartButton() {
  const btn = document.getElementById('startBtn');
  btn.addEventListener('click', () => {
    launchConfetti();
    goToPage(1);
  });
}

/* ====== CONFETTI ====== */
function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];
  const colors = ['#ff6b9d', '#a855f7', '#f9a825', '#66bb6a', '#42a5f5', '#ef5350', '#ff9ec6', '#c084fc', '#ffd54f'];
  const shapes = ['circle', 'rect', 'heart'];

  for (let i = 0; i < 150; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      speedY: Math.random() * 3 + 2,
      speedX: (Math.random() - 0.5) * 4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      opacity: 1,
      wobble: Math.random() * 10,
      wobbleSpeed: Math.random() * 0.1 + 0.02
    });
  }

  let frame = 0;
  const maxFrames = 300;

  function drawHeart(x, y, size) {
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 1.5, x, y + size);
    ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 1.5, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    ctx.fill();
  }

  function animate() {
    if (frame > maxFrames) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pieces.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX + Math.sin(p.wobble) * 0.5;
      p.wobble += p.wobbleSpeed;
      p.rotation += p.rotationSpeed;

      if (frame > maxFrames * 0.7) {
        p.opacity = Math.max(0, 1 - (frame - maxFrames * 0.7) / (maxFrames * 0.3));
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;

      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else {
        drawHeart(0, 0, p.size);
      }

      ctx.restore();
    });

    frame++;
    requestAnimationFrame(animate);
  }

  animate();
}

window.addEventListener('resize', () => {
  const canvas = document.getElementById('confettiCanvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
