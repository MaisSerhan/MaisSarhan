const cppCodeData = {
  1: {
    snippet: "#include <iostream>",
    explanation: "يتضمن هذا الجزء المكتبة الأساسية للإدخال والإخراج في C++.",
    runMessage: "✅ واصل التقدم! لقد قمت باستدعاء المكتبة الأساسية."
  },
  2: {
    snippet: "int main() {",
    explanation: "الدالة الرئيسية التي يبدأ منها تنفيذ أي برنامج C++.",
    runMessage: "🚀 لقد حصلت على الدالة الرئيسية!"
  },
  3: {
    snippet: 'std::cout << "مرحباً" << std::endl;',
    explanation: "تعلمت كيفية طباعة رسالة.",
    runMessage: "🖨️ تعلمت الطباعة باستخدام cout!"
  },
  4: {
    snippet: "return 0;",
    explanation: "إنهاء البرنامج وإرجاع القيمة 0.",
    runMessage: "✅ أنهيت البرنامج بنجاح."
  },
  5: {
    snippet: "}",
    explanation: "إغلاق الدالة الرئيسية.",
    runMessage: "✅ تم إغلاق الدالة بشكل صحيح."
  },
  6: {
    snippet: "// البرنامج جاهز",
    explanation: "تم تجميع كل الأكواد، البرنامج مكتمل!",
    runMessage: "🎉 البرنامج جاهز!"
  }
};

let currentLevel = 1;
let collectedCodeParts = [];
let currentLevelWords = [];
let codeWords = [];

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let car = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 60,
  width: 50,
  height: 50,
  speed: 5,
  dx: 0
};

let trackLeft = canvas.width / 4;
let trackRight = canvas.width * 3 / 4;
let obstacles = [], lastSpawn = 0, spawnInterval = 1200, obstacleSpeed = 2;
let isGameOver = false, isLevelComplete = false;
let codesCollectedInLevel = 0, levelGoalCodes = 3;

function drawTrack() {
  ctx.fillStyle = "#006400";
  ctx.fillRect(trackLeft, 0, trackRight - trackLeft, canvas.height);
  ctx.strokeStyle = "#aaa";
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(trackLeft, 0); ctx.lineTo(trackLeft, canvas.height); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(trackRight, 0); ctx.lineTo(trackRight, canvas.height); ctx.stroke();
}

function drawCar() {
  ctx.fillStyle = "red";
  ctx.fillRect(car.x, car.y, car.width, car.height);
}

function drawObstacles() {
  for (let o of obstacles) {
    ctx.fillStyle = o.type === "good" ? "yellow" : "purple";
    ctx.fillRect(o.x, o.y, o.width, o.height);
    if (o.word) {
      ctx.fillStyle = "black";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(o.word, o.x + o.width / 2, o.y + o.height / 2 + 4);
    }
  }
}

function drawText() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`المستوى : ${currentLevel}          `, 20, 30);
  ctx.fillText(`أكواد: ${codesCollectedInLevel}/${levelGoalCodes}         `, 20, 60);
  if (isGameOver) {
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText("انتهت اللعبة!", canvas.width / 2, canvas.height / 2);
  }
}

function update() {
  if (isGameOver || isLevelComplete) return;

  car.x += car.dx;
  if (car.x < trackLeft) car.x = trackLeft;
  if (car.x + car.width > trackRight) car.x = trackRight - car.width;

  let now = Date.now();
  if (now - lastSpawn > spawnInterval) {
    const width = 50, height = 30;
    const x = trackLeft + Math.random() * (trackRight - trackLeft - width);
    const type = Math.random() < 0.8 ? "good" : "bad";
    let word = "";
    if (type === "good" && codeWords.length > 0) {
      word = codeWords.shift();
    }
    obstacles.push({ x, y: -height, width, height, type, word });
    lastSpawn = now;
  }

  for (let i = obstacles.length - 1; i >= 0; i--) {
    let o = obstacles[i];
    o.y += obstacleSpeed;

    if (car.x < o.x + o.width && car.x + car.width > o.x &&
        car.y < o.y + o.height && car.y + car.height > o.y) {
      obstacles.splice(i, 1);
      if (o.type === "good") {
        codesCollectedInLevel++;
        if (o.word && !currentLevelWords.includes(o.word)) {
          currentLevelWords.push(o.word);
          document.getElementById("game-messages").textContent = "✅ جمعت كلمة: " + o.word;
        }
        if (codesCollectedInLevel >= levelGoalCodes) levelUp();
      } else {
        isGameOver = true;
        document.getElementById("game-messages").textContent = "❌ اصطدمت بعقبة!";
      }
    }

    if (o.y > canvas.height) obstacles.splice(i, 1);
  }
}

function levelUp() {
  isLevelComplete = true;
  const code = cppCodeData[currentLevel];
  document.getElementById("code-discovery").style.display = "block";
  document.getElementById("currentCodeSnippet").textContent = code.snippet;
  document.getElementById("codeExplanation").textContent = code.explanation;
  document.getElementById("continueGameBtn").style.display = "inline-block";

  const levelCodeLine = currentLevelWords.join(" ");
  if (levelCodeLine.trim() !== "") {
    collectedCodeParts.push(levelCodeLine);
  }
  currentLevelWords = [];
  updateAssembledCode();

  if (code.runMessage) alert(code.runMessage);
}

function updateAssembledCode() {
  document.getElementById("assembledCode").textContent = collectedCodeParts.join("\n\n");
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawTrack();
  drawCar();
  drawObstacles();
  drawText();
  update();
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", e => {
  if (["ArrowLeft", "a", "A"].includes(e.key)) car.dx = -car.speed;
  if (["ArrowRight", "d", "D"].includes(e.key)) car.dx = car.speed;
});

document.addEventListener("keyup", () => car.dx = 0);

document.getElementById("continueGameBtn").onclick = () => {
  currentLevel++;
  isLevelComplete = false;
  codesCollectedInLevel = 0;
  obstacles = [];
  document.getElementById("code-discovery").style.display = "none";

  const code = cppCodeData[currentLevel];
  if (code) {
    codeWords = code.snippet.trim().split(/\s+/);
    levelGoalCodes = codeWords.length;
  }
};

document.getElementById("runCodeBtn").onclick = () => {
  const code = cppCodeData[currentLevel];
  alert(code?.runMessage || "🚀 لا توجد رسالة تشغيل.");
};

window.onload = () => {
  const code = cppCodeData[currentLevel];
  if (code) {
    codeWords = code.snippet.trim().split(/\s+/);
    levelGoalCodes = codeWords.length;
  }
  gameLoop();
};
// عرض أزرار الهاتف فقط إذا كانت الشاشة صغيرة
function handleMobileControlsVisibility() {
  const controls = document.getElementById("mobile-controls");
  if (window.innerWidth <= 768) {
    controls.style.display = "block";
  } else {
    controls.style.display = "none";
  }
}

window.addEventListener("resize", handleMobileControlsVisibility);
window.addEventListener("load", handleMobileControlsVisibility);

// تحكم بالسيارة عند الضغط على الزر الأيسر
document.getElementById("leftBtn").addEventListener("mousedown", () => {
  car.dx = -car.speed;
});
document.getElementById("leftBtn").addEventListener("mouseup", () => {
  car.dx = 0;
});
document.getElementById("leftBtn").addEventListener("touchstart", (e) => {
  e.preventDefault();
  car.dx = -car.speed;
});
document.getElementById("leftBtn").addEventListener("touchend", () => {
  car.dx = 0;
});

// تحكم بالسيارة عند الضغط على الزر الأيمن
document.getElementById("rightBtn").addEventListener("mousedown", () => {
  car.dx = car.speed;
});
document.getElementById("rightBtn").addEventListener("mouseup", () => {
  car.dx = 0;
});
document.getElementById("rightBtn").addEventListener("touchstart", (e) => {
  e.preventDefault();
  car.dx = car.speed;
});
document.getElementById("rightBtn").addEventListener("touchend", () => {
  car.dx = 0;
});
