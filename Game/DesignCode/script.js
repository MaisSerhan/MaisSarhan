// --- Game Elements ---
const gameBoard = document.getElementById('gameBoard');
const player = document.getElementById('player');

const upBtn = document.getElementById('upBtn');
const downBtn = document.getElementById('downBtn');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');

const discoverSound = document.getElementById('discoverSound');
const moveSound = document.getElementById('moveSound');
const successSound = document.getElementById('successSound');
const failSound = document.getElementById('failSound');

const playerSize = 30;
const playerSpeed = 15;
let playerX = 0;
let playerY = 0;

const boxData = {
    'include-directives': {
        title: 'تضمين المكتبات (#include)',
        text: 'في C++، نحتاج إلى "تضمين" المكتبات التي تحتوي على الدوال الجاهزة التي سنستخدمها، مثل دالة الإدخال والإخراج. فكر فيها كإحضار الأدوات اللازمة قبل بدء العمل.',
        code: '#include <iostream>\n\nint main() {\n    // كودك هنا\n    return 0;\n}'
    },
    'main-function': {
        title: 'دالة Main الرئيسية',
        text: 'كل برنامج C++ يبدأ تنفيذه من دالة خاصة تسمى `main`. هي نقطة البداية لبرنامجك، ومن الضروري أن تكون موجودة.',
        code: '#include <iostream>\n\nint main() {\n    std::cout << "مرحباً من دالة main!";\n    return 0;\n}'
    },
    'variables-datatypes': {
        title: 'المتغيرات وأنواع البيانات (int, string)',
        text: 'في C++، يجب أن تحدد نوع البيانات للمتغير عند تعريفه (مثل رقم صحيح `int`، أو نص `std::string`). هذا يساعد المترجم على فهم كيفية التعامل مع القيمة.',
        code: 'std::string name = "";\nint age = 0;'
    },
    'output-console': {
        title: 'الطباعة على الشاشة (cout <<)',
        text: 'لإخراج النصوص أو قيم المتغيرات إلى شاشة الكونسول في C++، نستخدم `std::cout` مع عامل الإخراج `<<`. لا تنسَ `;` في نهاية كل عبارة!',
        code: '#include <iostream>\n\nint main() {\n    std::cout << "أهلاً وسهلاً!\\n";\n    int score = 100;\n    std::cout << "نقاطك: " << score << std::endl;\n    return 0;\n}'
    },
    'input-console': {
        title: 'إدخال المستخدم (cin >>)',
        text: 'للحصول على إدخال من المستخدم عبر لوحة المفاتيح في C++، نستخدم `std::cin` مع عامل الإدخال `>>`. سيتوقف البرنامج وينتظر المستخدم لإدخال قيمة.',
        code: '#include <iostream>\n#include <string>\n\nint main() {\n    std::string userName;\n    std::cout << "ادخل اسمك: ";\n    std::cin >> userName;\n    std::cout << "مرحباً يا " << userName << std::endl;\n    return 0;\n}'
    },
};

const gameBoxesPositions = [
    { x: 60, y: 60, id: 'include-directives' },
    { x: 20, y: 20, id: 'main-function' },
    { x: 30, y: 70, id: 'variables-datatypes' },
    { x: 10, y: 50, id: 'output-console' },
    { x: 80, y: 30, id: 'input-console' },
];

let gameBoxElements = {};

const learningContent = document.getElementById('learningContent');
const learningContentTitle = document.getElementById('learningContentTitle');
const learningContentText = document.getElementById('learningContentText');
const learningContentCode = document.getElementById('learningContentCode');
const closeLearningContentBtn = document.getElementById('closeLearningContent');
const codeBuilderArea = document.getElementById('codeBuilderArea');
const codeBlocksPalette = document.getElementById('codeBlocksPalette');
const codeDropZone = document.getElementById('codeDropZone');
const checkCodeButton = document.getElementById('checkCodeButton');
const resetCodeButton = document.getElementById('resetCodeButton');
const messageOverlay = document.getElementById('messageOverlay');
const overlayTitle = document.getElementById('overlayTitle');
const overlayMessage = document.getElementById('overlayMessage');
const overlayButton = document.getElementById('overlayButton');
const closeOverlayBtn = document.getElementById('closeOverlay');

let discoveredBoxesCount = 0;
const discoveredBoxIds = new Set();
const requiredDiscoveriesForCodeBuilder = 2;

const codeBlockDefinitions = {
    'include_iostream': { text: '#include <iostream>', data: '#include <iostream>' },
    'include_string': { text: '#include <string>', data: '#include <string>' },
    'main_function_start': { text: 'int main() {', data: 'int main() {' },
    'main_function_end': { text: 'return 0;\n}', data: '    return 0;\n}' },
    // 'declare_int': { text: 'int count = 0;', data: '    int count = 0;' }, // Removed
    'declare_string': { text: 'std::string name = "";', data: '    std::string name = "";' },
    'declare_age': { text: 'int age = 0;', data: '    int age = 0;' },
    'cout_hello': { text: 'std::cout << "مرحباً ايها العالم!";', data: '    std::cout << "مرحباً ايها العالم!\\n";' },
    'cout_enter_name': { text: 'std::cout << "ادخل اسمك: ";', data: '    std::cout << "ادخل اسمك: ";' },
    'cout_welcome_name': { text: 'std::cout << "مرحباً يا " << name;', data: '    std::cout << "مرحباً يا " << name << std::endl;' },
    'cin_variable': { text: 'std::cin >> name;', data: '    std::cin >> name;' },
    'cout_enter_age': { text: 'std::cout << "ادخل عمرك: ";', data: '    std::cout << "ادخل عمرك: ";' },
    'cin_age': { text: 'std::cin >> age;', data: '    std::cin >> age;' },
    'cout_age': { text: 'std::cout << "عمرك هو: " << age;', data: '    std::cout << "عمرك هو: " << age << std::endl;' },
};

function initializeGame() {
    playerX = gameBoard.clientWidth / 2 - playerSize / 2;
    playerY = gameBoard.clientHeight / 2 - playerSize / 2;
    updatePlayerPosition();

    gameBoxesPositions.forEach(boxPos => {
        const box = document.createElement('div');
        box.classList.add('box-in-game');
        box.dataset.boxId = boxPos.id;
        box.style.left = `${boxPos.x}%`;
        box.style.top = `${boxPos.y}%`;
        box.textContent = boxPos.id.substring(0, 1).toUpperCase();
        gameBoard.appendChild(box);
        gameBoxElements[boxPos.id] = box;
    });

    updateCodePalette();
}

function updatePlayerPosition() {
    const boardWidth = gameBoard.clientWidth;
    const boardHeight = gameBoard.clientHeight;

    playerX = Math.max(0, Math.min(playerX, boardWidth - playerSize));
    playerY = Math.max(0, Math.min(playerY, boardHeight - playerSize));

    player.style.left = `${playerX}px`;
    player.style.top = `${playerY}px`;

    checkCollisions();
}

function playSound(soundElement) {
    if (soundElement) {
        soundElement.currentTime = 0;
        soundElement.play().catch(error => {
            console.warn("Sound playback failed:", soundElement.id, error);
        });
    }
}

document.addEventListener('keydown', (e) => {
    if (learningContent.classList.contains('active') || messageOverlay.style.display === 'flex') {
        return;
    }

    const originalPlayerX = playerX;
    const originalPlayerY = playerY;

    switch (e.key) {
        case 'ArrowUp': playerY -= playerSpeed; break;
        case 'ArrowDown': playerY += playerSpeed; break;
        case 'ArrowLeft': playerX -= playerSpeed; break;
        case 'ArrowRight': playerX += playerSpeed; break;
    }
    updatePlayerPosition();

    if (playerX !== originalPlayerX || playerY !== originalPlayerY) {
        playSound(moveSound);
    }
});

if (upBtn) {
    upBtn.addEventListener('click', () => {
        if (!learningContent.classList.contains('active') && messageOverlay.style.display !== 'flex') {
            const originalPlayerY = playerY;
            playerY -= playerSpeed;
            updatePlayerPosition();
            if (playerY !== originalPlayerY) playSound(moveSound);
        }
    });
}
if (downBtn) {
    downBtn.addEventListener('click', () => {
        if (!learningContent.classList.contains('active') && messageOverlay.style.display !== 'flex') {
            const originalPlayerY = playerY;
            playerY += playerSpeed;
            updatePlayerPosition();
            if (playerY !== originalPlayerY) playSound(moveSound);
        }
    });
}
if (leftBtn) {
    leftBtn.addEventListener('click', () => {
        if (!learningContent.classList.contains('active') && messageOverlay.style.display !== 'flex') {
            const originalPlayerX = playerX;
            playerX -= playerSpeed;
            updatePlayerPosition();
            if (playerX !== originalPlayerX) playSound(moveSound);
        }
    });
}
if (rightBtn) {
    rightBtn.addEventListener('click', () => {
        if (!learningContent.classList.contains('active') && messageOverlay.style.display !== 'flex') {
            const originalPlayerX = playerX;
            playerX += playerSpeed;
            updatePlayerPosition();
            if (playerX !== originalPlayerX) playSound(moveSound);
        }
    });
}

function checkCollisions() {
    const playerRect = player.getBoundingClientRect();

    Object.values(gameBoxElements).forEach(boxElement => {
        if (boxElement.classList.contains('discovered')) return;

        const boxRect = boxElement.getBoundingClientRect();

        if (playerRect.left < boxRect.right &&
            playerRect.right > boxRect.left &&
            playerRect.top < boxRect.bottom &&
            playerRect.bottom > boxRect.top) {
            
            const boxId = boxElement.dataset.boxId;
            if (!discoveredBoxIds.has(boxId)) {
                boxElement.classList.add('discovered');
                discoveredBoxIds.add(boxId);
                discoveredBoxesCount++;
                displayLearningContent(boxId);
                updateCodePalette();
                playSound(discoverSound);
                if (discoveredBoxesCount >= requiredDiscoveriesForCodeBuilder) {
                    codeBuilderArea.classList.add('active');
                }
            }
        }
    });
}

closeLearningContentBtn.addEventListener('click', () => {
    learningContent.classList.remove('active');
    gameBoard.style.pointerEvents = 'auto';
    gameBoard.style.opacity = '1';
    player.style.display = 'block';

    if (upBtn) {
        upBtn.style.pointerEvents = 'auto';
        downBtn.style.pointerEvents = 'auto';
        leftBtn.style.pointerEvents = 'auto';
        rightBtn.style.pointerEvents = 'auto';
    }

    if (discoveredBoxesCount >= requiredDiscoveriesForCodeBuilder) {
        codeBuilderArea.classList.add('active');
    }
});

let draggedBlock = null;

function updateCodePalette() {
    codeBlocksPalette.innerHTML = '';

    if (discoveredBoxIds.has('include-directives')) {
        codeBlocksPalette.appendChild(createCodeBlock('include_iostream'));
    }
    if (discoveredBoxIds.has('main-function')) {
        codeBlocksPalette.appendChild(createCodeBlock('main_function_start'));
        codeBlocksPalette.appendChild(createCodeBlock('main_function_end'));
    }
    if (discoveredBoxIds.has('variables-datatypes')) {
        // Removed declare_int
        codeBlocksPalette.appendChild(createCodeBlock('declare_string'));
        codeBlocksPalette.appendChild(createCodeBlock('declare_age'));
    }
    if (discoveredBoxIds.has('output-console')) {
        codeBlocksPalette.appendChild(createCodeBlock('cout_hello'));
        codeBlocksPalette.appendChild(createCodeBlock('cout_enter_name'));
        codeBlocksPalette.appendChild(createCodeBlock('cout_welcome_name'));
        codeBlocksPalette.appendChild(createCodeBlock('cout_enter_age'));
        codeBlocksPalette.appendChild(createCodeBlock('cout_age'));
    }
    if (discoveredBoxIds.has('input-console')) {
        codeBlocksPalette.appendChild(createCodeBlock('cin_variable'));
        codeBlocksPalette.appendChild(createCodeBlock('cin_age'));
        codeBlocksPalette.appendChild(createCodeBlock('include_string'));
    }
}

function createCodeBlock(blockKey) {
    const blockDef = codeBlockDefinitions[blockKey];
    if (!blockDef) return null;

    const block = document.createElement('div');
    block.classList.add('code-block');
    block.setAttribute('draggable', 'true');
    block.dataset.codeValue = blockDef.data;
    block.textContent = blockDef.text;

    block.addEventListener('dragstart', (e) => {
        draggedBlock = block;
        setTimeout(() => {
            block.style.opacity = '0.5';
        }, 0);
    });

    block.addEventListener('dragend', () => {
        draggedBlock.style.opacity = '1';
        draggedBlock = null;
    });
    return block;
}

codeDropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
});

codeDropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    if (draggedBlock) {
        const clonedBlock = draggedBlock.cloneNode(true);
        clonedBlock.setAttribute('draggable', 'false');
        codeDropZone.appendChild(clonedBlock);
        const placeholder = codeDropZone.querySelector('p');
        if (placeholder && placeholder.textContent === 'اسحب لبنات الكود إلى هنا لترتيبها...') {
            placeholder.remove();
        }
    }
});

checkCodeButton.addEventListener('click', () => {
    const arrangedCodeBlocks = Array.from(codeDropZone.children).filter(el => el.classList.contains('code-block'));
    const generatedCode = arrangedCodeBlocks.map(block => block.dataset.codeValue).join('\n');

    let isCorrect = false;
    let message = '';

    const expectedCodeParts = [
        '#include <iostream>',
        '#include <string>',
        'int main() {',
        '    std::cout << "مرحباً ايها العالم!\\n";',
        '    std::string name = "";',
        '    std::cout << "ادخل اسمك: ";',
        '    std::cin >> name;',
        '    std::cout << "مرحباً يا " << name << std::endl;',
        '    std::cout << "ادخل عمرك: ";',
        '    int age = 0;',
        '    std::cin >> age;',
        '    std::cout << "عمرك هو: " << age << std::endl;',
        '    return 0;',
        '}'
    ];

    let allPartsFound = true;
    for (const part of expectedCodeParts) {
        if (!generatedCode.includes(part)) {
            allPartsFound = false;
            break;
        }
    }

    const orderCheck =
        generatedCode.indexOf('#include <iostream>') < generatedCode.indexOf('#include <string>') &&
        generatedCode.indexOf('#include <string>') < generatedCode.indexOf('int main() {') &&
        generatedCode.indexOf('int main() {') < generatedCode.indexOf('std::cout << "مرحباً ايها العالم!\\n";') &&
        generatedCode.indexOf('std::cout << "مرحباً ايها العالم!\\n";') < generatedCode.indexOf('std::string name = "";') &&
        generatedCode.indexOf('std::string name = "";') < generatedCode.indexOf('std::cout << "ادخل اسمك: ";') &&
        generatedCode.indexOf('std::cout << "ادخل اسمك: ";') < generatedCode.indexOf('std::cin >> name;') &&
        generatedCode.indexOf('std::cin >> name;') < generatedCode.indexOf('std::cout << "مرحباً يا " << name << std::endl;') &&
        generatedCode.indexOf('std::cout << "مرحباً يا " << name << std::endl;') < generatedCode.indexOf('std::cout << "ادخل عمرك: ";') &&
        generatedCode.indexOf('std::cout << "ادخل عمرك: ";') < generatedCode.indexOf('int age = 0;') &&
        generatedCode.indexOf('int age = 0;') < generatedCode.indexOf('std::cin >> age;') &&
        generatedCode.indexOf('std::cin >> age;') < generatedCode.indexOf('std::cout << "عمرك هو: " << age << std::endl;') &&
        generatedCode.indexOf('std::cout << "عمرك هو: " << age << std::endl;') < generatedCode.indexOf('return 0;') &&
        generatedCode.indexOf('return 0;') < generatedCode.indexOf('}');

    if (allPartsFound && orderCheck) {
        isCorrect = true;
        message = 'ممتاز! لقد بنيت برنامج C++ كاملاً ويعمل بشكل صحيح. أنت تتقن البرمجة!';
        playSound(successSound);
    } else if (arrangedCodeBlocks.length === 0) {
        message = 'لم تقم بترتيب أي كود بعد. اسحب اللبنات إلى منطقة الترتيب لبناء برنامجك.';
    } else {
        message = 'الكود الذي رتبته غير صحيح أو بترتيب خاطئ. تأكد من تضمين جميع الأوامر الأساسية لبرنامج C++ والترتيب الصحيح لها.';
        playSound(failSound);
    }

    displayOverlay(isCorrect ? 'نجاح!' : 'خطأ', message);
});

resetCodeButton.addEventListener('click', () => {
    codeDropZone.innerHTML = '<p>اسحب لبنات الكود إلى هنا لترتيبها...</p>';
    overlayButton.style.display = 'none';
});

overlayButton.addEventListener('click', () => {
    messageOverlay.style.display = 'none';
});

closeOverlayBtn.addEventListener('click', () => {
    messageOverlay.style.display = 'none';
});

function displayOverlay(title, message) {
    overlayTitle.textContent = title;
    overlayMessage.textContent = message;
    messageOverlay.style.display = 'flex';
    overlayButton.style.display = 'inline-block';
}

function displayLearningContent(boxId) {
    const content = boxData[boxId];
    if (!content) return;

    learningContentTitle.textContent = content.title;
    learningContentText.textContent = content.text;
    learningContentCode.textContent = content.code;

    learningContent.classList.add('active');
    gameBoard.style.pointerEvents = 'none';
    gameBoard.style.opacity = '0.5';
    player.style.display = 'none';

    if (upBtn) {
        upBtn.style.pointerEvents = 'none';
        downBtn.style.pointerEvents = 'none';
        leftBtn.style.pointerEvents = 'none';
        rightBtn.style.pointerEvents = 'none';
    }
}

initializeGame();
//expectedCodeParts
