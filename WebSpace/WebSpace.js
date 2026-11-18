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


// 3. Try-It Editor Dictionary for all 30 Lessons
const tutorialCodes = {
    // HTML Track (1-10)
    'html1': `<!DOCTYPE html>\n<html>\n  <head><title>My Planet</title></head>\n  <body>\n    <h1>Welcome to Earth</h1>\n  </body>\n</html>`,
    'html2': `<h1>Heading 1</h1>\n<h2>Heading 2</h2>\n<h3>Heading 3</h3>`,
    'html3': `<p>Paragraph 1: Exploring deep space.</p>\n<p>Paragraph 2: Cadet log updated.</p>`,
    'html4': `<a href="https://google.com" target="_blank">Launch to Google</a>`,
    'html5': `<img src="https://via.placeholder.com/150" alt="Space Satellite">`,
    'html6': `<ul>\n  <li>Oxygen Tank</li>\n  <li>Fuel Cell</li>\n  <li>Space Suit</li>\n</ul>`,
    'html7': `<ol>\n  <li>Ignite Thrusters</li>\n  <li>Break Gravity</li>\n  <li>Enter Orbit</li>\n</ol>`,
    'html8': `<div style="background:#1a0033; padding:15px; border:1px solid #00f0ff;">\n  <h3>Inside Container</h3>\n</div>`,
    'html9': `<p>Systems are <span style="color:#00f0ff;">Operational</span>.</p>`,
    'html10': `<button onclick="alert('System Check Passed!')">Run Diagnostics</button>`,

    // CSS Track (11-20)
    'css1': `<!DOCTYPE html>\n<html>\n<head>\n<style>\n  body {\n    background: #0a0a1f;\n    color: #00f0ff;\n    font-family: sans-serif;\n  }\n</style>\n</head>\n<body>\n  <h1>Cyan Space Theme</h1>\n</body>\n</html>`,
    'css2': `<!DOCTYPE html>\n<html>\n<head>\n<style>\n  h1 {\n    color: #fff;\n    text-shadow: 0 0 10px #ff00aa;\n    background: #111;\n    padding: 10px;\n  }\n</style>\n</head>\n<body>\n  <h1>Pink Nebula Glow</h1>\n</body>\n</html>`,
    'css3': `<!DOCTYPE html>\n<html>\n<head>\n<style>\n  div {\n    background: linear-gradient(#1a0033, #0a0a1f);\n    padding: 20px;\n    color: #fff;\n  }\n</style>\n</head>\n<body>\n  <div>Gradient Section</div>\n</body>\n</html>`,
    'css4': `<!DOCTYPE html>\n<html>\n<head>\n<style>\n  .box {\n    border: 2px solid #00f0ff;\n    padding: 10px;\n    color: #fff;\n  }\n</style>\n</head>\n<body>\n  <div class="box">Shield Grid</div>\n</body>\n</html>`,
    'css5': `<!DOCTYPE html>\n<html>\n<head>\n<style>\n  .orb {\n    background: #ff00aa;\n    width: 60px;\n    height: 60px;\n    border-radius: 50%;\n  }\n</style>\n</head>\n<body>\n  <div class="orb"></div>\n</body>\n</html>`,
    'css6': `<!DOCTYPE html>\n<html>\n<head>\n<style>\n  .card {\n    margin: 30px;\n    background: #111;\n    padding: 10px;\n    color: #00f0ff;\n  }\n</style>\n</head>\n<body>\n  <div class="card">Outer Spaced Card</div>\n</body>\n</html>`,
    'css7': `<!DOCTYPE html>\n<html>\n<head>\n<style>\n  .card {\n    padding: 30px;\n    background: #111;\n    color: #00f0ff;\n  }\n</style>\n</head>\n<body>\n  <div class="card">Padded Inner Content</div>\n</body>\n</html>`,
    'css8': `<!DOCTYPE html>\n<html>\n<head>\n<style>\n  button {\n    background: #00f0ff;\n    border: none;\n    padding: 10px 20px;\n    cursor: pointer;\n  }\n  button:hover {\n    background: #ff00aa;\n    color: #fff;\n  }\n</style>\n</head>\n<body>\n  <button>Hover Me</button>\n</body>\n</html>`,
    'css9': `<!DOCTYPE html>\n<html>\n<head>\n<style>\n  p {\n    font-family: monospace;\n    font-size: 20px;\n    color: #00ff66;\n  }\n</style>\n</head>\n<body>\n  <p>Terminal Display</p>\n</body>\n</html>`,
    'css10': `<!DOCTYPE html>\n<html>\n<head>\n<style>\n  .flex-box {\n    display: flex;\n    justify-content: center;\n    gap: 10px;\n  }\n</style>\n</head>\n<body>\n  <div class="flex-box"><button>Left</button><button>Right</button></div>\n</body>\n</html>`,

    // JS Track (21-30)
    'js1': `<button onclick="alert('Rocket launched into zero gravity! 🚀')">Launch Rocket</button>`,
    'js2': `<p id="st">Engine offline</p>\n<button onclick="document.getElementById('st').innerText = 'Thrusters active!'">Engage Engine</button>`,
    'js3': `<button onclick="console.log('Telemetry received successfully.'); alert('Check browser F12 Console!');">Log Telemetry</button>`,
    'js4': `<button onclick="let score = 100; alert('Cadet Score: ' + score);">Check Score</button>`,
    'js5': `<div id="box" style="padding:10px; background:#333; color:#fff;">Shields</div>\n<button onclick="document.getElementById('box').style.background = '#00f0ff';">Activate Shields</button>`,
    'js6': `<button onclick="let totalFuel = 50 + 75; alert('Total Fuel: ' + totalFuel);">Calculate Fuel</button>`,
    'js7': `<button onclick="let fuel = 20; if(fuel > 50) { alert('Ready'); } else { alert('Low Fuel Warning!'); }">Check Fuel</button>`,
    'js8': `<button onclick="let planets = ['Earth', 'Mars', 'Jupiter']; alert('Planet: ' + planets[1]);">Select Destination</button>`,
    'js9': `<p id="log"></p>\n<button onclick="let txt=''; for(let i=1; i<=5; i++) { txt += 'Countdown: ' + i + '<br>'; } document.getElementById('log').innerHTML = txt;">Start Countdown</button>`,
    'js10': `<script>\nfunction warp() {\n  alert('Warp drive initiated!');\n}\n</script>\n<button onclick="warp()">Warp Drive</button>`
};

function showTryIt(type) {
    playSound('click');
    const modal = document.getElementById('try-modal');
    const editor = document.getElementById('editor-area');
    if (modal) modal.style.display = 'block';

    const sampleCode = tutorialCodes[type] || `<h1>Try editing code here!</h1>`;
    if (editor) {
        editor.innerHTML = `<textarea id="code" style="width:100%; height:120px; background:#050510; color:#00f0ff; border:1px solid #00f0ff; padding:10px; font-family:monospace; border-radius:6px; box-sizing:border-box;"></textarea>`;
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


// 5. Star Quiz System (30 Questions, Leaderboard, Validation)
const rawQuestions = [
    { q: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyperlinks Text Model", "Home Tool Markup Language"], correct: "Hyper Text Markup Language" },
    { q: "What does CSS stand for?", options: ["Cascading Style Sheets", "Creative Style System", "Computer Styling Script", "Colorful Style Source"], correct: "Cascading Style Sheets" },
    { q: "Which tag is used for the main heading in HTML?", options: ["<h1>", "<head>", "<h6>", "<header>"], correct: "<h1>" },
    { q: "Which CSS property changes the text color?", options: ["color", "font-color", "text-color", "background-color"], correct: "color" },
    { q: "Which JS keyword declares a block variable?", options: ["let", "varname", "constant", "string"], correct: "let" },
    { q: "Which HTML element creates a clickable link?", options: ["<a>", "<link>", "<href>", "<url>"], correct: "<a>" },
    { q: "Which symbol denotes an ID selector in CSS?", options: ["#", ".", "*", "&"], correct: "#" },
    { q: "Which symbol denotes a Class selector in CSS?", options: [".", "#", "_", "%"], correct: "." },
    { q: "How do you log output to the developer console in JS?", options: ["console.log()", "print()", "log.output()", "window.print()"], correct: "console.log()" },
    { q: "Which HTML tag is used to embed an image?", options: ["<img>", "<picture>", "<image>", "<src>"], correct: "<img>" },
    { q: "Which CSS property changes background color?", options: ["background-color", "bg-color", "color-bg", "background-image"], correct: "background-color" },
    { q: "Which HTML tag creates an unordered bulleted list?", options: ["<ul>", "<ol>", "<li>", "<list>"], correct: "<ul>" },
    { q: "Which HTML tag creates an ordered numbered list?", options: ["<ol>", "<ul>", "<li>", "<numlist>"], correct: "<ol>" },
    { q: "How do you write a comment in HTML?", options: ["<!-- Comment -->", "// Comment", "/* Comment */", "' Comment"], correct: "<!-- Comment -->" },
    { q: "How do you write a comment in CSS?", options: ["/* Comment */", "// Comment", "<!-- Comment -->", "# Comment"], correct: "/* Comment */" },
    { q: "Which CSS property changes font size?", options: ["font-size", "text-size", "size", "font-weight"], correct: "font-size" },
    { q: "Which HTML tag defines a table row?", options: ["<tr>", "<td>", "<table>", "<th>"], correct: "<tr>" },
    { q: "What does DOM stand for in JS?", options: ["Document Object Model", "Data Object Map", "Digital Online Medium", "Document Orientation Mode"], correct: "Document Object Model" },
    { q: "Which CSS property makes text bold?", options: ["font-weight: bold;", "text-style: bold;", "bold: true;", "font-type: bold;"], correct: "font-weight: bold;" },
    { q: "Which HTML tag contains page metadata?", options: ["<head>", "<body>", "<meta-data>", "<title>"], correct: "<head>" },
    { q: "What data type represents true or false in JS?", options: ["Boolean", "String", "Number", "Object"], correct: "Boolean" },
    { q: "Which CSS property adds inner spacing inside borders?", options: ["padding", "margin", "spacing", "border-spacing"], correct: "padding" },
    { q: "Which CSS property adds outer spacing around elements?", options: ["margin", "padding", "spacing", "outer-space"], correct: "margin" },
    { q: "How do you write an array in JS?", options: ["let list = [1, 2];", "let list = (1, 2);", "let list = {1, 2};", "let list = <1, 2>;"], correct: "let list = [1, 2];" },
    { q: "Which attribute specifies an image source URL?", options: ["src", "href", "link", "url"], correct: "src" },
    { q: "Which JS click event handler attribute is used on elements?", options: ["onclick", "onpress", "onmouseclick", "click-event"], correct: "onclick" },
    { q: "Which CSS layout property aligns items in flexible boxes?", options: ["display: flex;", "display: block;", "display: grid-box;", "layout: flex;"], correct: "display: flex;" },
    { q: "Which assignment operator is used in JS?", options: ["=", "==", "===", "=>"], correct: "=" },
    { q: "Which HTML tag creates a button?", options: ["<button>", "<btn>", "<click>", "<input type='click'>"], correct: "<button>" },
    { q: "Which CSS property rounds element borders?", options: ["border-radius", "corner-radius", "round-border", "radius"], correct: "border-radius" }
];

let cadetName = "";
let cadetSection = "";
let currentQuestion = 0;
let currentChoices = [];
let selectedChoice = null;
let quizScore = 0;
let timeLeft = 20;
let timerInterval = null;

function startQuizMission() {
    playSound('click');
    const nameInput = document.getElementById('cadet-name').value.trim();
    const sectionInput = document.getElementById('cadet-section').value.trim();

    if (!nameInput || !sectionInput) {
        alert("Please enter both your Cadet Name and Grade & Section before beginning!");
        return;
    }

    cadetName = nameInput;
    cadetSection = sectionInput;

    const cadetInfoEl = document.getElementById('display-cadet-info');
    const regBoxEl = document.getElementById('quiz-reg-box');
    const playAreaEl = document.getElementById('quiz-play-area');

    if (cadetInfoEl) cadetInfoEl.textContent = `${cadetName} (${cadetSection})`;
    if (regBoxEl) regBoxEl.style.display = 'none';
    if (playAreaEl) playAreaEl.style.display = 'block';

    loadQuestion();
}

function shuffleArray(array) {
    let arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 20;
    const timerEl = document.getElementById('quiz-timer');
    if (timerEl) timerEl.textContent = timeLeft;

    timerInterval = setInterval(() => {
        timeLeft--;
        if (timerEl) timerEl.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            playSound('wrong');
            const result = document.getElementById('result');
            if (result) {
                result.textContent = "⏰ Time's up! Moving to next question.";
                result.style.color = "#ff00aa";
            }
            setTimeout(() => {
                nextStepOrFinish();
            }, 1500);
        }
    }, 1000);
}

function loadQuestion() {
    const qEl = document.getElementById('question');
    const optEl = document.getElementById('options');
    if (!qEl || !optEl) return;

    selectedChoice = null;
    const q = rawQuestions[currentQuestion];
    qEl.textContent = `Question ${currentQuestion + 1} of 30: ${q.q}`;
    optEl.innerHTML = '';

    currentChoices = shuffleArray(q.options);

    currentChoices.forEach((choice) => {
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

    startTimer();
}

function checkAnswer() {
    playSound('click');
    clearInterval(timerInterval);
    const result = document.getElementById('result');
    if (selectedChoice === null) {
        if (result) {
            result.textContent = "Select an option first!";
            result.style.color = "#ff00aa";
        }
        startTimer();
        return;
    }

    const q = rawQuestions[currentQuestion];
    if (selectedChoice === q.correct) {
        playSound('correct');
        if (result) {
            result.textContent = "Correct! You earned a star & score point!";
            result.style.color = "#00f0ff";
        }
        quizScore++;
        const scoreEl = document.getElementById('quiz-score');
        if (scoreEl) scoreEl.textContent = quizScore;
        earnStar();
    } else {
        playSound('wrong');
        if (result) {
            result.textContent = "Not quite. Try again next time, cadet!";
            result.style.color = "#ff00aa";
        }
    }

    setTimeout(() => {
        nextStepOrFinish();
    }, 1800);
}

function nextStepOrFinish() {
    currentQuestion++;
    if (currentQuestion < rawQuestions.length) {
        loadQuestion();
        const result = document.getElementById('result');
        if (result) result.textContent = '';
    } else {
        clearInterval(timerInterval);
        const qEl = document.getElementById('question');
        const optEl = document.getElementById('options');
        const resultEl = document.getElementById('result');

        if (qEl) qEl.textContent = `🎉 Quiz Completed, ${cadetName}! Final Score: ${quizScore} / 30`;
        if (optEl) optEl.innerHTML = '';
        if (resultEl) resultEl.textContent = 'Your score with your name and section has been recorded to the leaderboard!';
        
        saveScoreToLeaderboard(cadetName, cadetSection, quizScore);
    }
}

// Leaderboard System
function saveScoreToLeaderboard(name, section, score) {
    let leaderboard = JSON.parse(localStorage.getItem('webspace_leaderboard')) || [];
    leaderboard.push({ name: name, section: section, score: score, date: new Date().toLocaleDateString() });
    
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 5);
    localStorage.setItem('webspace_leaderboard', JSON.stringify(leaderboard));
    renderLeaderboard();
}

function renderLeaderboard() {
    const listEl = document.getElementById('leaderboard-list');
    if (!listEl) return;
    let leaderboard = JSON.parse(localStorage.getItem('webspace_leaderboard')) || [];
    
    if (leaderboard.length === 0) {
        listEl.innerHTML = '<li style="color: #777;">No cadet scores recorded yet.</li>';
        return;
    }

    listEl.innerHTML = '';
    leaderboard.forEach((entry, idx) => {
        const li = document.createElement('li');
        li.style.cssText = "display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 0.95rem;";
        li.innerHTML = `<span>#${idx + 1} <strong>${entry.name}</strong> <span style="color:#aaa; font-size:0.85rem;">(${entry.section})</span></span> <span style="color: var(--accent-cyan);">${entry.score} / 30 pts</span>`;
        listEl.appendChild(li);
    });
}


// 6. Forum & Progress Tracker
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

let userStarProgress = 0;
function earnStar() {
    if (userStarProgress < 30) {
        userStarProgress++;
        const countEl = document.getElementById('stars-count');
        const barEl = document.getElementById('progress-bar');
        if (countEl) countEl.textContent = userStarProgress;
        if (barEl) barEl.style.width = (userStarProgress / 30 * 100) + '%';
        
        if (userStarProgress === 30) {
            playSound('correct');
            alert("Mission Accomplished! You collected all 30 stars! Certificate Unlocked.");
        }
    }
}

function downloadCertificate() {
    playSound('click');
    if (userStarProgress >= 30) {
        alert('Master Cadet Certificate downloaded! Outstanding work.');
    } else {
        alert(`Earn ${30 - userStarProgress} more star(s) to unlock your graduation certificate!`);
    }
}

window.onload = function() {
    renderLeaderboard();
    initSnake();
    drawSnake();
};