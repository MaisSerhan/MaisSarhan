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
        text: 'في C++، نحتاج إلى "تضمين" المكتبات...',
        code: '#include <iostream>\n\nint main() {\n    // كودك هنا\n    return 0;\n}'
    },
    'main-function': {
        title: 'دالة Main الرئيسية',
        text: 'كل برنامج C++ يبدأ من دالة main...',
        code: '#include <iostream>\n\nint main() {\n    std::cout << "مرحباً من دالة main!";\n    return 0;\n}'
    },
    'variables-datatypes': {
        title: 'المتغيرات وأنواع البيانات',
        text: 'في C++، يجب تحديد نوع المتغير...',
        code: 'std::string name = "";\nint age = 0;'
    },
    'output-console': {
        title: 'الطباعة على الشاشة (cout <<)',
        text: 'لإخراج النصوص نستخدم cout...',
        code: '#include <iostream>\n\nint main() {\n    std::cout << "أهلاً وسهلاً!\\n";\n    int score = 100;\n    std::cout << "نقاطك: " << score << std::endl;\n    return 0;\n}'
    },
    'input-console': {
        title: 'إدخال المستخدم (cin >>)',
        text: 'نستخدم cin لقراءة البيانات من المستخدم...',
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
const discoveredBoxIds = new Set();
let discoveredBoxesCount = 0;
const requiredDiscoveriesForCodeBuilder = 2;

const codeBlockDefinitions = {
    'include_iostream': { text: '#include <iostream>', data: '#include <iostream>' },
    'include_string': { text: '#include <string>', data: '#include <string>' },
    'main_function_start': { text: 'int main() {', data: 'int main() {' },
    'main_function_end': { text: 'return 0;\n}', data: '    return 0;\n}' },
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

// DOM references
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
    playerX = Math.max(0, Math.min(playerX, gameBoard.clientWidth - playerSize));
    playerY = Math.max(0, Math.min(playerY, gameBoard.clientHeight - playerSize));
    player.style.left = `${playerX}px`;
    player.style.top = `${playerY}px`;
    checkCollisions();
}

function playSound(soundElement) {
    if (soundElement) {
        soundElement.currentTime = 0;
        soundElement.play().catch(() => {});
    }
}

document.addEventListener('keydown', (e) => {
    if (learningContent.classList.contains('active') || messageOverlay.style.display === 'flex') return;

    switch (e.key) {
        case 'ArrowUp': playerY -= playerSpeed; break;
        case 'ArrowDown': playerY += playerSpeed; break;
        case 'ArrowLeft': playerX -= playerSpeed; break;
        case 'ArrowRight': playerX += playerSpeed; break;
    }
    updatePlayerPosition();
    playSound(moveSound);
});

[upBtn, downBtn, leftBtn, rightBtn].forEach((btn, index) => {
    if (!btn) return;
    const actions = [() => playerY -= playerSpeed, () => playerY += playerSpeed, () => playerX -= playerSpeed, () => playerX += playerSpeed];
    btn.addEventListener('click', () => {
        if (learningContent.classList.contains('active') || messageOverlay.style.display === 'flex') return;
        actions[index]();
        updatePlayerPosition();
        playSound(moveSound);
    });
});

function checkCollisions() {
    const playerRect = player.getBoundingClientRect();
    Object.values(gameBoxElements).forEach(box => {
        if (box.classList.contains('discovered')) return;
        const boxRect = box.getBoundingClientRect();

        if (playerRect.left < boxRect.right && playerRect.right > boxRect.left &&
            playerRect.top < boxRect.bottom && playerRect.bottom > boxRect.top) {
            
            const boxId = box.dataset.boxId;
            if (!discoveredBoxIds.has(boxId)) {
                box.classList.add('discovered');
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
    if (discoveredBoxesCount >= requiredDiscoveriesForCodeBuilder) {
        codeBuilderArea.classList.add('active');
    }
});

let draggedBlock = null;

function createCodeBlock(blockKey) {
    const blockDef = codeBlockDefinitions[blockKey];
    if (!blockDef) return null;

    const block = document.createElement('div');
    block.classList.add('code-block');
    block.setAttribute('draggable', 'true');
    block.dataset.codeValue = blockDef.data;
    block.textContent = blockDef.text;

    block.addEventListener('dragstart', () => {
        draggedBlock = block;
        setTimeout(() => block.style.opacity = '0.5', 0);
    });

    block.addEventListener('dragend', () => {
        draggedBlock.style.opacity = '1';
        draggedBlock = null;
    });

    block.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            const cloned = block.cloneNode(true);
            cloned.setAttribute('draggable', 'false');
            cloned.classList.add('code-block');
            cloned.dataset.codeValue = block.dataset.codeValue;
            codeDropZone.appendChild(cloned);
            const placeholder = codeDropZone.querySelector('p');
            if (placeholder) placeholder.remove();
        }
    });

    return block;
}

codeDropZone.addEventListener('dragover', (e) => e.preventDefault());

codeDropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    if (draggedBlock) {
        const clone = draggedBlock.cloneNode(true);
        clone.setAttribute('draggable', 'false');
        clone.classList.add('code-block');
        clone.dataset.codeValue = draggedBlock.dataset.codeValue;
        codeDropZone.appendChild(clone);
        const placeholder = codeDropZone.querySelector('p');
        if (placeholder) placeholder.remove();
    }
});

function updateCodePalette() {
    codeBlocksPalette.innerHTML = '';
    if (discoveredBoxIds.has('include-directives')) codeBlocksPalette.appendChild(createCodeBlock('include_iostream'));
    if (discoveredBoxIds.has('main-function')) {
        codeBlocksPalette.appendChild(createCodeBlock('main_function_start'));
        codeBlocksPalette.appendChild(createCodeBlock('main_function_end'));
    }
    if (discoveredBoxIds.has('variables-datatypes')) {
        codeBlocksPalette.appendChild(createCodeBlock('declare_string'));
        codeBlocksPalette.appendChild(createCodeBlock('declare_age'));
    }
    if (discoveredBoxIds.has('output-console')) {
        ['cout_hello', 'cout_enter_name', 'cout_welcome_name', 'cout_enter_age', 'cout_age']
            .forEach(key => codeBlocksPalette.appendChild(createCodeBlock(key)));
    }
    if (discoveredBoxIds.has('input-console')) {
        ['cin_variable', 'cin_age', 'include_string']
            .forEach(key => codeBlocksPalette.appendChild(createCodeBlock(key)));
    }
}

checkCodeButton.addEventListener('click', () => {
    const blocks = Array.from(codeDropZone.children).filter(el => el.classList.contains('code-block'));
    const code = blocks.map(block => block.dataset.codeValue).join('\n');

    const expected = [
        '#include <iostream>', '#include <string>', 'int main() {',
        '    std::cout << "مرحباً ايها العالم!\\n";',
        '    std::string name = "";',
        '    std::cout << "ادخل اسمك: ";', '    std::cin >> name;',
        '    std::cout << "مرحباً يا " << name << std::endl;',
        '    std::cout << "ادخل عمرك: ";', '    int age = 0;',
        '    std::cin >> age;', '    std::cout << "عمرك هو: " << age << std::endl;',
        '    return 0;', '}'
    ];

    const allFound = expected.every(part => code.includes(part));
    const inOrder = expected.every((part, i, arr) => {
        if (i === 0) return true;
        return code.indexOf(arr[i - 1]) < code.indexOf(part);
    });

    let msg = '';
    if (allFound && inOrder) {
        msg = 'ممتاز! لقد بنيت برنامج C++ كاملاً.';
        playSound(successSound);
        displayOverlay('نجاح!', msg);
    } else if (blocks.length === 0) {
        displayOverlay('فارغ', 'لم تقم بترتيب أي كود بعد.');
    } else {
        playSound(failSound);
        displayOverlay('خطأ', 'الكود غير صحيح أو الترتيب خاطئ.');
    }
});

resetCodeButton.addEventListener('click', () => {
    codeDropZone.innerHTML = '<p>اسحب لبنات الكود إلى هنا لترتيبها...</p>';
    overlayButton.style.display = 'none';
});

overlayButton.addEventListener('click', () => messageOverlay.style.display = 'none');
closeOverlayBtn.addEventListener('click', () => messageOverlay.style.display = 'none');

function displayOverlay(title, msg) {
    overlayTitle.textContent = title;
    overlayMessage.textContent = msg;
    messageOverlay.style.display = 'flex';
    overlayButton.style.display = 'inline-block';
}

function displayLearningContent(id) {
    const content = boxData[id];
    if (!content) return;
    learningContentTitle.textContent = content.title;
    learningContentText.textContent = content.text;
    learningContentCode.textContent = content.code;
    learningContent.classList.add('active');
    gameBoard.style.pointerEvents = 'none';
    gameBoard.style.opacity = '0.5';
    player.style.display = 'none';
}

initializeGame();
