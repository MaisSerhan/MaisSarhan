const questions = [
{ q: "ما هو أمر إنشاء مستودع Git جديد؟", correct: "git init", wrong: ["git start", "git new", "git create"] },
{ q: "ما هو أمر رفع التعديلات إلى GitHub؟", correct: "git push", wrong: ["git pull", "git commit", "git clone"] },
{ q: "ما هو أمر نسخ مستودع من GitHub؟", correct: "git clone", wrong: ["git copy", "git fetch", "git fork"] },
{ q: "ما هو أمر عرض حالة المشروع؟", correct: "git status", wrong: ["git check", "git view", "git update"] },
{ q: "ما هو أمر إضافة ملفات للتتبع؟", correct: "git add", wrong: ["git push", "git include", "git insert"] },
{ q: "ما هو أمر تسجيل التغييرات؟", correct: "git commit", wrong: ["git save", "git record", "git tag"] },
{ q: "ما هو أمر جلب التحديثات دون دمج؟", correct: "git fetch", wrong: ["git pull", "git push", "git import"] },
{ q: "ما هو أمر إنشاء فرع جديد؟", correct: "git branch", wrong: ["git fork", "git create", "git switch"] },
{ q: "ما هو أمر التنقل بين الفروع؟", correct: "git checkout", wrong: ["git switch", "git move", "git jump"] },
{ q: "ما هو موقع استضافة Git الشهير؟", correct: "GitHub", wrong: ["Bitbucket", "Dropbox", "Google Drive"] }
];

const game = document.getElementById("game");
const player = document.getElementById("player");
const questionEl = document.getElementById("question");
const resultEl = document.getElementById("result");
const scoreEl = document.getElementById("score");
const gameOverEl = document.getElementById("gameOver");
const winMessageEl = document.getElementById("winMessage");
const playerNameWin = document.getElementById("playerNameWin");
const restartBtn = document.getElementById("restartBtn");
const screenshotBtn = document.getElementById("screenshotBtn");
const optionsContainer = document.getElementById("options-container");
const nameInputContainer = document.getElementById("nameInputContainer");
const playerNameInput = document.getElementById("playerNameInput");
const startBtn = document.getElementById("startBtn");
const playerNameGameOver = document.getElementById("playerNameGameOver");

let currentQ = 0;
let options = [];
let optionsTop = -60;
let isGameOver = true;  // اللعبة متوقفة حتى يدخل الاسم
let score = 0;
let playerName = "";

function shuffleArray(arr) {
for (let i = arr.length -1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i+1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
}
}

function loadQuestion() {
clearOptions();
optionsTop = -60;
resultEl.textContent = "";
if (currentQ >= questions.length) {
    questionEl.textContent = "";
    showWinMessage();
    return;
}

const q = questions[currentQ];
questionEl.textContent = "🧠 " + q.q;

const allOpts = [q.correct, ...q.wrong];
shuffleArray(allOpts);

allOpts.forEach(opt => {
    const div = document.createElement("div");
    div.className = "option";
    div.textContent = opt;
    div.dataset.correct = (opt === q.correct).toString();
    optionsContainer.appendChild(div);
    options.push(div);
});

optionsContainer.style.top = optionsTop + "px";
}

function clearOptions() {
options.forEach(opt => opt.remove());
options = [];
}

function detectCollision(a, b) {
const r1 = a.getBoundingClientRect();
const r2 = b.getBoundingClientRect();
return !(r1.right < r2.left || r1.left > r2.right || r1.bottom < r2.top || r1.top > r2.bottom);
}

function updateGame() {
if (isGameOver) return;

optionsTop += 2;
optionsContainer.style.top = optionsTop + "px";

for (let i = 0; i < options.length; i++) {
    if (detectCollision(player, options[i])) {
    if (options[i].dataset.correct === "true") {
        resultEl.style.color = "green";
        resultEl.textContent = "✅ إجابة صحيحة!";
        score += 10;
        scoreEl.textContent = "النقاط: " + score;
        currentQ++;
        clearOptions();
        setTimeout(loadQuestion, 1000);
        return;
    } else {
        resultEl.style.color = "red";
        resultEl.textContent = "❌ إجابة خاطئة! انتهت اللعبة!";
        endGame(false);
        return;
    }
    }
}

if (optionsTop > game.clientHeight) {
    resultEl.textContent = "⌛ انتهى الوقت! اللعبة انتهت.";
    endGame(false);
}
}

function endGame(won) {
isGameOver = true;
clearOptions();
if (won) {
    playerNameWin.textContent = `🎉 ${playerName}، مبروك! حققت ${score} نقطة!`;
    winMessageEl.style.display = "block";
    gameOverEl.style.display = "none";
} else {
    playerNameGameOver.textContent = `اللاعب: ${playerName}`;
    gameOverEl.style.display = "block";
    winMessageEl.style.display = "none";
}
}

function showWinMessage() {
endGame(true);
questionEl.textContent = "";
}

document.addEventListener("keydown", e => {
if (isGameOver) return;

const step = 20;
const maxLeft = game.clientWidth - player.offsetWidth;
let left = player.offsetLeft;

if (e.code === "ArrowRight" && left + step <= maxLeft) {
    player.style.left = left + step + "px";
} else if (e.code === "ArrowLeft" && left - step >= 0) {
    player.style.left = left - step + "px";
}
});

restartBtn.addEventListener("click", () => {
isGameOver = false;
currentQ = 0;
score = 0;
scoreEl.textContent = "النقاط: 0";
resultEl.textContent = "";
gameOverEl.style.display = "none";
winMessageEl.style.display = "none";
loadQuestion();
});

screenshotBtn.addEventListener("click", () => {
html2canvas(game).then(canvas => {
    const link = document.createElement('a');
    link.download = 'game-result.png';
    link.href = canvas.toDataURL();
    link.click();
});
});

playerNameInput.addEventListener("input", () => {
startBtn.disabled = playerNameInput.value.trim().length === 0;
});

startBtn.addEventListener("click", () => {
playerName = playerNameInput.value.trim();
if (!playerName) return;
nameInputContainer.style.display = "none";
currentQ = 0;
score = 0;
scoreEl.textContent = "النقاط: 0";
resultEl.textContent = "";
isGameOver = false;
loadQuestion();
});

// بداية اللعبة: إظهار خانة إدخال الاسم فقط
isGameOver = true;
nameInputContainer.style.display = "block";
questionEl.textContent = "";
resultEl.textContent = "";
scoreEl.textContent = "";

setInterval(updateGame, 30);