// Web Audio API Sound Generator
let audioCtx = null;
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playSound(type) {
    try {
        initAudio();
        if (!audioCtx) return;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        if (type === 'correct') {
            osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
            osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.3);
        } else if (type === 'wrong') {
            osc.frequency.setValueAtTime(200, audioCtx.currentTime);
            osc.frequency.setValueAtTime(140, audioCtx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.3);
        } else if (type === 'click') {
            osc.frequency.setValueAtTime(440, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.08);
        }
    } catch (e) {
        console.log("Audio blocked or not supported", e);
    }
}

// 1. Interactive Star Background Canvas
const bgCanvas = document.getElementById('stars-canvas');
if (bgCanvas) {
    const bgCtx = bgCanvas.getContext('2d');

    function resizeBgCanvas() {
        bgCanvas.width = window.innerWidth;
        bgCanvas.height = window.innerHeight;
    }
    resizeBgCanvas();

    let starParticles = [];
    for (let i = 0; i < 200; i++) {
        starParticles.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 2 + 0.5,
            speed: Math.random() * 0.4 + 0.1
        });
    }

    function drawStarfield() {
        bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
        bgCtx.fillStyle = '#ffffff';
        starParticles.forEach(star => {
            bgCtx.beginPath();
            bgCtx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            bgCtx.fill();
            star.y += star.speed;
            if (star.y > bgCanvas.height) star.y = 0;
        });
        requestAnimationFrame(drawStarfield);
    }
    drawStarfield();

    window.addEventListener('mousemove', (e) => {
        starParticles.forEach(star => {
            const dx = e.clientX - star.x;
            const dy = e.clientY - star.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                star.x -= dx * 0.03;
                star.y -= dy * 0.03;
            }
        });
    });

    window.addEventListener('resize', resizeBgCanvas);
}

// 2. Pathway Filter Logic
function filterPath(btnElement, category) {
    playSound('click');
    document.querySelectorAll('.path-btn').forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');

    const cards = document.querySelectorAll('.mission-card');
    cards.forEach(card => {
        if (category === 'all' || card.classList.contains(`path-${category}`)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// 3. Try-It Editor Dictionary (All 30 Missions)
const tutorialCodes = {
    'html1': `<!DOCTYPE html>\n<html>\n  <head><title>My Planet</title></head>\n  <body><h1>Welcome to Earth</h1></body>\n</html>`,
    'html2': `<h1>Main Sector</h1>\n<h2>Sub-Sector</h2>\n<p>Cadet log entry.</p>`,
    'html3': `<p>Paragraph 1: Exploring deep space.</p>\n<p>Paragraph 2: Cadet log updated.</p>`,
    'html4': `<a href="https://example.com" target="_blank">Launch Link</a>`,
    'html5': `<img src="https://via.placeholder.com/150" alt="Space Satellite">`,
    'html6': `<ul>\n  <li>Oxygen Tank</li>\n  <li>Fuel Cell</li>\n</ul>`,
    'html7': `<ol>\n  <li>Ignite Thrusters</li>\n  <li>Enter Orbit</li>\n</ol>`,
    'html8': `<div style="background:#1a0033; padding:12px; border:1px solid #00f0ff;">Mission Box</div>`,
    'html9': `<p>Status: <span style="color:#00f0ff;">Nominal</span></p>`,
    'html10': `<button onclick="alert('Diagnostics OK!')">Run Check</button>`,

    'css1': `<style>.demo-11 { background-color: #0a0a1f; color: #00f0ff; padding: 10px; }</style>\n<div class="demo-11">Cyan Space Theme</div>`,
    'css2': `<style>.demo-12 { color: #fff; text-shadow: 0 0 10px #ff00aa; }</style>\n<h1 class="demo-12">Pink Nebula Glow</h1>`,
    'css3': `<style>.demo-13 { background: linear-gradient(90deg, #1a0033, #0088aa); padding: 12px; color: #fff; }</style>\n<div class="demo-13">Gradient Banner</div>`,
    'css4': `<style>.demo-14 { border: 2px solid #00f0ff; padding: 10px; }</style>\n<div class="demo-14">Bordered Box</div>`,
    'css5': `<style>.demo-15 { width: 60px; height: 60px; background: #ff00aa; border-radius: 50%; }</style>\n<div class="demo-15"></div>`,
    'css6': `<style>.demo-16 { margin: 20px; background: #1a0033; padding: 10px; }</style>\n<div class="demo-16">Outer Margin Box</div>`,
    'css7': `<style>.demo-17 { padding: 24px; background: #1a0033; border: 1px solid #00f0ff; }</style>\n<div class="demo-17">Inner Padding Box</div>`,
    'css8': `<style>.btn-18:hover { background: #ff00aa; color: #fff; }</style>\n<button class="btn-18">Hover Me</button>`,
    'css9': `<style>.demo-19 { font-family: monospace; font-size: 20px; color: #00ff66; }</style>\n<p class="demo-19">Monospace 20px Text</p>`,
    'css10': `<style>.demo-20 { display: flex; justify-content: center; gap: 12px; }</style>\n<div class="demo-20"><button>Left</button><button>Right</button></div>`,

    'js1': `<button onclick="launch()">Launch Rocket</button>\n<script>\n  function launch() { alert("Rocket launched! 🚀"); }\n<\/script>`,
    'js2': `<p id="st-22">Engine offline</p>\n<button onclick="document.getElementById('st-22').innerText = 'Thrusters active!'">Engage</button>`,
    'js3': `<button onclick="console.log('Telemetry received!'); alert('Check F12 Console!');">Log Telemetry</button>`,
    'js4': `<button onclick="let score = 100; alert('Score: ' + score);">Show Score</button>`,
    'js5': `<div id="box-25" style="padding:10px; background:#333; color:#fff;">Shield Box</div>\n<button onclick="document.getElementById('box-25').style.backgroundColor = '#00f0ff'; document.getElementById('box-25').style.color = '#000';">Activate Shield</button>`,
    'js6': `<button onclick="let totalFuel = 50 + 75; alert('Total Fuel: ' + totalFuel);">Calculate Fuel</button>`,
    'js7': `<button onclick="let fuel = 20; if (fuel > 50) { alert('Ready'); } else { alert('Low Fuel!'); }">Check Fuel</button>`,
    'js8': `<button onclick="let planets = ['Earth', 'Mars', 'Jupiter']; alert(planets[1]);">Pick Planet</button>`,
    'js9': `<p id="log-29"></p>\n<button onclick="let out=''; for(let i=1;i<=3;i++){ out += 'Countdown: ' + i + '<br>'; } document.getElementById('log-29').innerHTML = out;">Start Loop</button>`,
    'js10': `<button onclick="earnStar()">Earn +1 Star Achievement</button>`
};

function showTryIt(type) {
    playSound('click');
    const modal = document.getElementById('try-modal');
    const editor = document.getElementById('editor-area');
    if (modal) modal.style.display = 'block';

    const sampleCode = tutorialCodes[type] || `<h1>Try editing code here!</h1>`;
    if (editor) {
        editor.innerHTML = `<textarea id="code"></textarea>`;
        document.getElementById('code').value = sampleCode;
    }
    runPreview();
}

function runPreview() {
    const codeArea = document.getElementById('code');
    if (!codeArea) return;
    const preview = document.getElementById('preview-box');
    if (preview) {
        preview.innerHTML = codeArea.value;
    }
}

function closeModal() {
    playSound('click');
    const modal = document.getElementById('try-modal');
    if (modal) modal.style.display = 'none';
}

// 4. Snake Minigame Logic
const snakeCanvas = document.getElementById('snake-canvas');
let snake = [{x: 200, y: 200}];
let food = {x: 100, y: 100};
let dx = 20, dy = 0;
let score = 0;
let gameInterval = null;
let isPaused = false;

function initSnake() {
    snake = [{x: 200, y: 200}];
    food = {
        x: Math.floor(Math.random() * 19) * 20,
        y: Math.floor(Math.random() * 19) * 20
    };
    dx = 20;
    dy = 0;
    score = 0;
    isPaused = false;
    const scoreEl = document.getElementById('snake-score');
    if (scoreEl) scoreEl.textContent = score;
}

function drawSnake() {
    if (!snakeCanvas) return;
    const snakeCtx = snakeCanvas.getContext('2d');
    snakeCtx.fillStyle = '#050510';
    snakeCtx.fillRect(0, 0, 400, 400);

    snakeCtx.fillStyle = '#ff00aa';
    snakeCtx.fillRect(food.x, food.y, 18, 18);

    snakeCtx.fillStyle = '#00f0ff';
    snake.forEach(segment => snakeCtx.fillRect(segment.x, segment.y, 18, 18));
}

function moveSnake() {
    if (isPaused) return;
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};

    if (head.x < 0 || head.x >= 400 || head.y < 0 || head.y >= 400) {
        endGame();
        return;
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame();
            return;
        }
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        playSound('correct');
        score += 10;
        const scoreEl = document.getElementById('snake-score');
        if (scoreEl) scoreEl.textContent = score;
        food = {
            x: Math.floor(Math.random() * 19) * 20,
            y: Math.floor(Math.random() * 19) * 20
        };
    } else {
        snake.pop();
    }
}

function changeDirection(key) {
    if (isPaused) return;
    if ((key === 'ArrowUp' || key === 'w') && dy === 0) { dx = 0; dy = -20; }
    if ((key === 'ArrowDown' || key === 's') && dy === 0) { dx = 0; dy = 20; }
    if ((key === 'ArrowLeft' || key === 'a') && dx === 0) { dx = -20; dy = 0; }
    if ((key === 'ArrowRight' || key === 'd') && dx === 0) { dx = 20; dy = 0; }
}

function triggerKey(keyName) {
    changeDirection(keyName);
}

function gameLoop() {
    moveSnake();
    drawSnake();
}

function startSnake() {
    playSound('click');
    clearInterval(gameInterval);
    initSnake();
    drawSnake();
    gameInterval = setInterval(gameLoop, 150);
}

function pauseSnake() {
    playSound('click');
    isPaused = !isPaused;
}

function endGame() {
    playSound('wrong');
    clearInterval(gameInterval);
    alert(`Game Over! Final Score: ${score}`);
}

window.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        changeDirection(e.key);
    }
});

// 5. Star Quiz System (30 Questions in Exact Sequential Order, Aligned with Missions 1-30 & Star Achievement)
const rawQuestions = [
    // Mission 1-10 (HTML Track)
    { q: "[Mission 1] Which HTML tag represents the main Level 1 heading?", options: ["<h1>", "<head>", "<h6>", "<title>"], correct: "<h1>" },
    { q: "[Mission 2] Which tag defines a text paragraph in HTML?", options: ["<p>", "<h1>", "<ul>", "<div>"], correct: "<p>" },
    { q: "[Mission 3] How do consecutive <p> elements behave by default in HTML?", options: ["Each starts on a new line with vertical spacing", "They stay on one unbroken line", "They only show inside a table", "They hide until clicked"], correct: "Each starts on a new line with vertical spacing" },
    { q: "[Mission 4] Which attribute on an <a> tag sets the destination link?", options: ["href", "src", "alt", "loop"], correct: "href" },
    { q: "[Mission 5] Which attribute on an <img> tag provides fallback/accessibility text?", options: ["alt", "href", "rel", "type"], correct: "alt" },
    { q: "[Mission 6] Which HTML tag creates an unordered (bulleted) list?", options: ["<ul>", "<ol>", "<dl>", "<table>"], correct: "<ul>" },
    { q: "[Mission 7] Which HTML tag creates an ordered (numbered) list?", options: ["<ol>", "<ul>", "<span>", "<br>"], correct: "<ol>" },
    { q: "[Mission 8] What is a <div> primarily used for in HTML?", options: ["Grouping elements as a block-level container", "Creating numbered lists", "Playing audio files", "Defining page metadata"], correct: "Grouping elements as a block-level container" },
    { q: "[Mission 9] How does a <span> behave compared to a <div>?", options: ["It is an inline container within a line", "It forces a full-width block break", "It creates a table row", "It loads external scripts"], correct: "It is an inline container within a line" },
    { q: "[Mission 10] Which HTML element creates a clickable button?", options: ["<button>", "<link>", "<meta>", "<hr>"], correct: "<button>" },

    // Mission 11-20 (CSS Track)
    { q: "[Mission 11] Which CSS property changes text color?", options: ["color", "background-color", "border-radius", "display"], correct: "color" },
    { q: "[Mission 12] Which CSS property adds glow or shadow effects to text?", options: ["text-shadow", "font-family", "list-style", "z-index"], correct: "text-shadow" },
    { q: "[Mission 13] Which CSS function creates a smooth color gradient background?", options: ["linear-gradient()", "rgb()", "calc()", "var()"], correct: "linear-gradient()" },
    { q: "[Mission 14] Which CSS property draws an outline around an element?", options: ["border", "margin", "padding", "gap"], correct: "border" },
    { q: "[Mission 15] Which CSS property rounds corners or creates a circle at 50%?", options: ["border-radius", "padding", "margin", "font-size"], correct: "border-radius" },
    { q: "[Mission 16] Which CSS property adds outer spacing around an element?", options: ["margin", "padding", "color", "text-align"], correct: "margin" },
    { q: "[Mission 17] Which CSS property adds inner spacing between content and border?", options: ["padding", "margin", "href", "src"], correct: "padding" },
    { q: "[Mission 18] Which CSS pseudo-class styles an element when hovered by a cursor?", options: [":hover", ":active", ":first-child", "::before"], correct: ":hover" },
    { q: "[Mission 19] Which CSS property sets the typeface of text?", options: ["font-family", "background-color", "flex-direction", "overflow"], correct: "font-family" },
    { q: "[Mission 20] Which CSS declaration turns a container into a Flexbox layout?", options: ["display: flex;", "display: none;", "position: fixed;", "float: left;"], correct: "display: flex;" },

    // Mission 21-30 (JavaScript Track & Star Achievement)
    { q: "[Mission 21] What does alert() do in JavaScript?", options: ["Displays a popup alert box in the browser", "Deletes an HTML element", "Saves a file to GitHub", "Starts a CSS animation"], correct: "Displays a popup alert box in the browser" },
    { q: "[Mission 22] Which DOM method selects an HTML element by its ID?", options: ["document.getElementById()", "document.createList()", "window.stop()", "array.push()"], correct: "document.getElementById()" },
    { q: "[Mission 23] Where does console.log() output messages?", options: ["Browser Developer Console (F12)", "Inside a <title> tag", "On the desktop wallpaper", "Inside a CSS file"], correct: "Browser Developer Console (F12)" },
    { q: "[Mission 24] Which keyword declares a block-scoped variable in JavaScript?", options: ["let", "heading", "style", "tag"], correct: "let" },
    { q: "[Mission 25] How do you change an element's background color in JS via style?", options: ["el.style.backgroundColor = '#00f0ff'", "el.cssColor('#00f0ff')", "el.font('#00f0ff')", "el.link('#00f0ff')"], correct: "el.style.backgroundColor = '#00f0ff'" },
    { q: "[Mission 26] What is the value of 50 + 75 in JavaScript?", options: ["125", "5075", "25", "NaN"], correct: "125" },
    { q: "[Mission 27] Which statement runs code only when a condition is true?", options: ["if", "span", "meta", "ul"], correct: "if" },
    { q: "[Mission 28] In let planets = ['Earth', 'Mars', 'Jupiter'], what is planets[1]?", options: ["'Mars'", "'Earth'", "'Jupiter'", "undefined"], correct: "'Mars'" },
    { q: "[Mission 29] What is the main purpose of a for loop in JavaScript?", options: ["Repeat instructions multiple times", "Add a border to text", "Close the browser tab", "Convert HTML to CSS"], correct: "Repeat instructions multiple times" },
    { q: "[Mission 30 • Star Achievement] How many stars are needed in WebSpace to unlock the graduation certificate?", options: ["30 stars (100% progress)", "1 star", "9 stars", "50 stars"], correct: "30 stars (100% progress)" }
];

let currentQuestion = 0;
let selectedChoice = null;

function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function loadQuizQuestion() {
    const qEl = document.getElementById('question');
    const optEl = document.getElementById('options');
    const resEl = document.getElementById('result');
    if (!qEl || !optEl) return;

    selectedChoice = null;
    if (resEl) resEl.textContent = '';
    const q = rawQuestions[currentQuestion];
    qEl.textContent = `Question ${currentQuestion + 1} of ${rawQuestions.length}: ${q.q}`;
    optEl.innerHTML = '';

    const jumbledOptions = shuffleArray(q.options);
    jumbledOptions.forEach((choice) => {
        const btn = document.createElement('button');
        btn.textContent = choice;
        btn.onclick = () => {
            playSound('click');
            document.querySelectorAll('.quiz-options button').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedChoice = choice;
        };
        optEl.appendChild(btn);
    });
}

function checkAnswer() {
    playSound('click');
    const result = document.getElementById('result');
    if (!selectedChoice) {
        if (result) {
            result.textContent = "Select an option first!";
            result.style.color = "#ff00aa";
        }
        return;
    }

    const q = rawQuestions[currentQuestion];
    if (selectedChoice === q.correct) {
        playSound('correct');
        if (result) {
            result.textContent = "Correct! +1 Star Achievement earned. Moving to next question...";
            result.style.color = "#00f0ff";
        }
        earnStar();
    } else {
        playSound('wrong');
        if (result) {
            result.textContent = `Not quite! Answer: ${q.correct}`;
            result.style.color = "#ff00aa";
        }
    }

    setTimeout(() => {
        currentQuestion = (currentQuestion + 1) % rawQuestions.length;
        loadQuizQuestion();
    }, 1300);
}

// 6. Forum & Progress Tracker (Star Achievement out of 30)
function postForumMessage() {
    playSound('click');
    const input = document.getElementById('forum-msg');
    if (!input || input.value.trim() === '') return;

    const list = document.getElementById('forum-list');
    if (!list) return;
    const post = document.createElement('div');
    post.className = 'forum-post';
    post.textContent = `"${input.value}"`;
    list.appendChild(post);
    input.value = '';
}

const MAX_STARS = 30;
let userStarProgress = 3;

function earnStar() {
    if (userStarProgress < MAX_STARS) {
        userStarProgress++;
        const countEl = document.getElementById('stars-count');
        const barEl = document.getElementById('progress-bar');
        if (countEl) countEl.textContent = userStarProgress;
        if (barEl) barEl.style.width = (userStarProgress / MAX_STARS * 100) + '%';

        if (userStarProgress === MAX_STARS) {
            playSound('correct');
            alert("Star Achievement Unlocked! You collected all 30 stars! Certificate Unlocked.");
        }
    }
}

function downloadCertificate() {
    playSound('click');
    if (userStarProgress >= MAX_STARS) {
        alert('Master Cadet Certificate downloaded! Outstanding work.');
    } else {
        alert(`Earn ${MAX_STARS - userStarProgress} more star(s) to unlock your Star Achievement certificate!`);
    }
}

window.onload = function() {
    loadQuizQuestion();
    initSnake();
    drawSnake();
};
