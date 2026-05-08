document.addEventListener('DOMContentLoaded', () => {
  createFloatingHearts();
  initPageSystem();
  initQuiz();
  initMoodMessages();
  initOpenWhen();
  initLetter();
  initShayariCarousel();
  initPolaroidLightbox();
  initWishesCarousel();
  initCakeCandles();
  initStartButton();
  initClickBursts();
  initHeroTypewriter();
});

/* ====== CLICK BURST EFFECT (hearts/sparkles fly out on click) ====== */
const burstSymbols = ['💕', '💖', '✨', '🌸', '💗', '⭐', '🌟'];

function initClickBursts() {
  document.addEventListener('click', (e) => {
    if (e.target.closest('.lightbox-close, .lightbox-content img')) return;
    spawnClickBurst(e.clientX, e.clientY);
  });
}

function spawnClickBurst(x, y) {
  const count = 5;
  for (let i = 0; i < count; i++) {
    const burst = document.createElement('span');
    burst.className = 'click-burst';
    burst.textContent = burstSymbols[Math.floor(Math.random() * burstSymbols.length)];
    burst.style.left = x + 'px';
    burst.style.top = y + 'px';

    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6;
    const distance = 40 + Math.random() * 30;
    burst.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
    burst.style.setProperty('--ty', Math.sin(angle) * distance + 'px');
    burst.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
    burst.style.fontSize = (0.9 + Math.random() * 0.6) + 'rem';

    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 1100);
  }
}

/* ====== HERO NAME TYPEWRITER ====== */
let heroTypewriterTimer = null;

function runHeroTypewriter() {
  const nameEl = document.querySelector('.hero-name');
  if (!nameEl) return;
  const fullName = nameEl.dataset.fullName || nameEl.textContent;
  nameEl.dataset.fullName = fullName;
  nameEl.textContent = '';
  nameEl.style.minWidth = '0.5em';

  if (heroTypewriterTimer) clearInterval(heroTypewriterTimer);

  let i = 0;
  heroTypewriterTimer = setInterval(() => {
    if (i < fullName.length) {
      nameEl.textContent += fullName.charAt(i);
      i++;
    } else {
      clearInterval(heroTypewriterTimer);
      heroTypewriterTimer = null;
    }
  }, 140);
}

function initHeroTypewriter() {
  runHeroTypewriter();
}

/* ====== POLAROID LIGHTBOX ====== */
function initPolaroidLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  if (!lightbox) return;

  document.querySelectorAll('.polaroid').forEach(p => {
    p.addEventListener('click', () => {
      const img = p.querySelector('img');
      const caption = p.querySelector('.polaroid-caption');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = caption ? caption.textContent : '';
      lightbox.classList.add('visible');
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('visible');
  }

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

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

    if (next.id === 'page-hero') {
      setTimeout(runHeroTypewriter, 300);
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

/* ====== MOOD-BASED MESSAGES ====== */
const moodMessages = {
  sad: [
    "Hey… I don't know what happened, but I'm here. You don't have to go through it alone.",
    "It's okay to have bad days. You don't always have to be strong.",
    "If I could, I'd sit next to you quietly until you felt a little better.",
    "Text me even if you don't know what to say. I'll understand."
  ],
  stressed: [
    "Pause for a second. You've handled tough things before—you'll handle this too.",
    "You don't have to figure everything out right now. One small step is enough.",
    "Drink some water, take a breath… I'm rooting for you.",
    "Whatever it is, it doesn't define you."
  ],
  sleepless: [
    "Close your eyes and imagine we're just talking like we always do.",
    "You don't need to solve anything tonight. Just rest.",
    "I wish I could say goodnight properly… so here it is: goodnight, sleep peacefully.",
    "I'm probably thinking about you too."
  ],
  happy: [
    "I like this version of you a lot 😄",
    "Tell me what happened—I want to be part of your good days too.",
    "Seeing you happy (even like this) makes my day better."
  ],
  missme: [
    "I miss you too… probably more than I say.",
    "We'll make up for this distance one day.",
    "Till then, I'm just one message away."
  ],
  angry: [
    "Take your time. You don't have to respond to anything right now.",
    "Whatever it is, don't let it ruin your whole day.",
    "I'm here when you cool down—no pressure."
  ],
  overthinking: [
    "Your mind is being a little too loud right now.",
    "Not every thought deserves your attention.",
    "You're okay. Things are simpler than they feel."
  ],
  reassurance: [
    "I'm here, and I'm not going anywhere suddenly.",
    "You matter to me—consistently, not just sometimes.",
    "You don't have to question everything."
  ]
};

let typewriterTimer = null;

function initMoodMessages() {
  const moodBtns = document.querySelectorAll('.mood-btn');
  const messageBox = document.getElementById('moodMessageBox');
  const messageText = document.getElementById('moodMessageText');
  const closeBtn = document.getElementById('moodClose');

  if (!messageBox) return;

  moodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mood = btn.dataset.mood;
      const messages = moodMessages[mood];
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];

      moodBtns.forEach(b => b.classList.remove('active-mood'));
      btn.classList.add('active-mood');

      if (typewriterTimer) clearInterval(typewriterTimer);
      messageText.innerHTML = '';
      messageBox.classList.add('visible');

      typewriteText(messageText, randomMsg);
    });
  });

  closeBtn.addEventListener('click', () => {
    messageBox.classList.remove('visible');
    if (typewriterTimer) clearInterval(typewriterTimer);
    setTimeout(() => { messageText.innerHTML = ''; }, 300);
    document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active-mood'));
  });
}

function typewriteText(element, text) {
  let i = 0;
  element.innerHTML = '<span class="typewriter-cursor"></span>';

  typewriterTimer = setInterval(() => {
    if (i < text.length) {
      const cursor = element.querySelector('.typewriter-cursor');
      if (cursor) cursor.remove();
      element.innerHTML += text.charAt(i);
      element.innerHTML += '<span class="typewriter-cursor"></span>';
      i++;
    } else {
      clearInterval(typewriterTimer);
      typewriterTimer = null;
      setTimeout(() => {
        const cursor = element.querySelector('.typewriter-cursor');
        if (cursor) cursor.remove();
      }, 1500);
    }
  }, 35);
}

/* ====== OPEN WHEN LETTERS ====== */
const owMessages = {
  overthinking: [
    "Not every thought needs a solution right now.",
    "You're safe. Your mind is just a bit loud.",
    "If it's still important tomorrow, you can handle it then.",
    "Come back to something simple—like texting me."
  ],
  cantsleep: [
    "Pretend we're just talking like always… nothing serious.",
    "You don't need to fix anything tonight.",
    "Close your eyes, I'll 'stay' here.",
    "Goodnight… even if it takes time."
  ],
  stressed: [
    "One thing at a time. That's enough.",
    "You've handled worse—you'll get through this too.",
    "Take a pause, not pressure.",
    "I'm on your side, always."
  ],
  bored: [
    "Text me something random right now.",
    "Let's start a useless but fun argument 😄",
    "Go listen to one song and tell me how it feels.",
    "Or just come annoy me—I won't complain."
  ],
  missme: [
    "I miss you too, more than I say.",
    "This distance is temporary, not permanent.",
    "We'll laugh about this someday.",
    "Till then, I'm just one message away."
  ],
  motivation: [
    "You don't need to be perfect—just consistent.",
    "Even small progress counts.",
    "Do it for yourself first.",
    "I believe in you, quietly but strongly."
  ],
  upset: [
    "It's okay to feel this way.",
    "Don't force yourself to calm down instantly.",
    "Take your time—I'll still be here.",
    "You can talk when you're ready."
  ],
  badday: [
    "Bad days don't cancel out who you are.",
    "Today was heavy, not you.",
    "Rest first, think later.",
    "Tomorrow doesn't have to be the same."
  ],
  reassurance: [
    "I'm here consistently, not just sometimes.",
    "You don't have to question everything.",
    "You matter to me—simply and clearly.",
    "Nothing changed."
  ],
  lost: [
    "You don't need all the answers right now.",
    "It's okay to figure things out slowly.",
    "You're not behind—you're just on your path.",
    "You'll make sense of it, step by step."
  ],
  latenight: [
    "These are the hours we usually talk the most.",
    "Feels incomplete without that, doesn't it?",
    "Still… I'm here in some way.",
    "Sleep when you can."
  ],
  morning: [
    "Good morning.",
    "Hope today is a little kinder to you.",
    "Start slow—you don't have to rush.",
    "Text me when you're up."
  ]
};

function initOpenWhen() {
  document.querySelectorAll('.ow-envelope').forEach(env => {
    env.addEventListener('click', () => {
      if (env.classList.contains('opened')) {
        env.classList.remove('opened');
        return;
      }
      const mood = env.dataset.ow;
      const messages = owMessages[mood];
      const msg = messages[Math.floor(Math.random() * messages.length)];
      env.querySelector('.ow-message').textContent = msg;
      env.classList.add('opened');
    });
  });
}

/* ====== LOVE LETTER ====== */
/* ====== SHAYARI CAROUSEL ====== */
function initShayariCarousel() {
  const papers = document.querySelectorAll('.shayari-paper');
  const dotsContainer = document.getElementById('shayariDots');
  const prevBtn = document.getElementById('shayariPrev');
  const nextBtn = document.getElementById('shayariNext');
  if (!papers.length || !dotsContainer) return;

  let currentIdx = 0;

  papers.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'shayari-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Shayari ${i + 1}`);
    dot.addEventListener('click', () => showShayari(i));
    dotsContainer.appendChild(dot);
  });

  function showShayari(idx) {
    if (idx === currentIdx) return;
    currentIdx = (idx + papers.length) % papers.length;

    papers.forEach((p, i) => {
      p.classList.remove('shayari-active', 'shayari-switched');
      if (i === currentIdx) {
        p.classList.add('shayari-active', 'shayari-switched');
      }
    });

    document.querySelectorAll('.shayari-dot').forEach((d, i) => {
      d.classList.toggle('active', i === currentIdx);
    });
  }

  prevBtn.addEventListener('click', () => showShayari(currentIdx - 1));
  nextBtn.addEventListener('click', () => showShayari(currentIdx + 1));
}

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
      releaseCakeBalloons();
      launchConfetti();
      setTimeout(launchConfetti, 800);
      setTimeout(launchConfetti, 1600);
    }, 2800);
  }

  function releaseCakeBalloons() {
    const container = document.getElementById('cakeBalloons');
    if (!container) return;
    container.innerHTML = '';
    const colors = [
      ['#ff8a8a', '#e91e63'],
      ['#ffd180', '#ff9800'],
      ['#ce93d8', '#9c27b0'],
      ['#80deea', '#00acc1'],
      ['#fff59d', '#fbc02d'],
      ['#a5d6a7', '#43a047']
    ];
    const count = 12;
    for (let i = 0; i < count; i++) {
      const cb = document.createElement('div');
      cb.className = 'cb';
      const c = colors[i % colors.length];
      cb.style.background = `radial-gradient(circle at 30% 30%, ${c[0]}, ${c[1]})`;
      cb.style.color = c[1];
      cb.style.left = (5 + Math.random() * 90) + '%';
      cb.style.animationDelay = (Math.random() * 0.8) + 's';
      cb.style.setProperty('--cbx', (Math.random() * 80 - 40) + 'px');
      cb.style.setProperty('--cbr', (Math.random() * 30 - 15) + 'deg');
      const scale = 0.7 + Math.random() * 0.6;
      cb.style.transform = `scale(${scale})`;
      container.appendChild(cb);
    }
    container.classList.add('releasing');
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
    const cakeBalloons = document.getElementById('cakeBalloons');
    if (cakeBalloons) {
      cakeBalloons.classList.remove('releasing');
      cakeBalloons.innerHTML = '';
    }
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

  // Reset Mood Messages
  if (typewriterTimer) clearInterval(typewriterTimer);
  const moodBox = document.getElementById('moodMessageBox');
  const moodText = document.getElementById('moodMessageText');
  if (moodBox) moodBox.classList.remove('visible');
  if (moodText) moodText.innerHTML = '';
  document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active-mood'));

  // Reset Open When envelopes
  document.querySelectorAll('.ow-envelope').forEach(env => {
    env.classList.remove('opened');
    env.querySelector('.ow-message').textContent = '';
  });

  // Reset Shayari carousel to first
  document.querySelectorAll('.shayari-paper').forEach((p, i) => {
    p.classList.remove('shayari-switched');
    p.classList.toggle('shayari-active', i === 0);
  });
  document.querySelectorAll('.shayari-dot').forEach((d, i) => {
    d.classList.toggle('active', i === 0);
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
