document.addEventListener('DOMContentLoaded', function() {
    const rotatable = document.getElementById("rotatable");
    const knob = document.getElementById("knob");
    const dial = document.querySelector(".dial");
    const girlElement = document.querySelector('.girl');
    let isDragging = false;
    const radius = 30;

    //start code circul
    function getAngle(cx, cy, ex, ey) {
        return Math.atan2(ey - cy, ex - cx) * (180 / Math.PI);
    }

    function updateKnobPosition(angle) {
        const radian = (angle * Math.PI) / 180;
        const cx = dial.clientWidth / 2;
        const cy = dial.clientHeight / 2;
        const x = cx + radius * Math.cos(radian) - 8;
        const y = cy + radius * Math.sin(radian) - 8;
        knob.style.left = `${x}px`;
        knob.style.top = `${y}px`;
    }

    knob.addEventListener("mousedown", (event) => {
        isDragging = true;
    });

    document.addEventListener("mousemove", (event) => {
        if (!isDragging) return;
        const rect = dial.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        let angle = getAngle(cx, cy, event.clientX, event.clientY);
        angle = (angle + 360) % 360;
        rotatable.style.transform = `rotate(${angle}deg)`;
        updateKnobPosition(angle);
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
    });

    updateKnobPosition(0);
    //end code circul

    //start code of girl
    const dangerElements = document.querySelectorAll('.danger');
    const charElement = document.querySelector('.char');
    const level2Button = document.querySelector('.level2');
    const level3Button = document.querySelector('.level3'); 
    const level4Button = document.querySelector('.level4'); 
    const level5Button = document.querySelector('.level5'); 
    const contgroupElement = document.querySelector('.contgroup');
 /*  const custDivs = document.querySelectorAll('.cust');
    const groupImage = document.querySelector('.group');*/ 
    level2Button.style.display = 'none';  // Hide at the start
    contgroupElement.style.display = 'none'; // Hide at the start
    level3Button.style.display = 'none'; // Hide at the start
    level4Button.style.display = 'none'; // Hide at the start
    level5Button.style.display = 'none'; // Hide at the start
    
    let level2Reached = false; // Track if Level 2 target has been reached
    let level3Reached = false; // Track if Level 3 target has been reached
    let level4Reached = false; // Track if Level 3 target has been reached
    let level5Reached = false; // Track if Level 3 target has been reached
    let level6Reached = false; // Track if Level 3 target has been reached
    var currentLevel = 1;
    
    let level2Shown = false;
    let level3Shown = false; 
    let level4Shown = false; 
    let level5Shown = false; 
    
    let x = 0;
    let y = 445;
    const step = 10;

    let backgroundMusic;
    var isMuted = true; // Initial state: NOT muted (but not playing yet)
    var musicPlayed = false;
    let winSound;
    let failSound; 

    function updatePosition(currentLevel) {
        girlElement.style.left = x + 'px';
        girlElement.style.top = y + 'px';

        const girlRect = girlElement.getBoundingClientRect();
        let targetX = 1250;
        let targetY = 435;
        
        switch (currentLevel) {
            case 1:
                targetX = 1250;
                targetY = 435;
                tolerance = 25;
                break;
            case 2:
                targetX = 1249; // Different target for level 2
                targetY = 315; // Different target for level 2
                tolerance = 25;
                break;
            case 3:
                targetX = 1249;  // Different target for level 3
                targetY = 215;   // Different target for level 3
                tolerance = 25;
                break;
            case 4:
                targetX = 1210;  // Different target for level 4
                targetY = 201;   // Different target for level 4
                tolerance = 25;
                break;
            case 5:
                targetX = 1203; // Replace with actual coordinates
                targetY = 200; // Replace with actual coordinates
                tolerance = 25; // Adjust as needed
                break;
        }

        const distX = Math.abs(x - targetX);
        const distY = Math.abs(y - targetY);

        console.log(distX, distY, currentLevel);

        // Level transition logic
        if (distX < tolerance && distY < 10) {
            switch (currentLevel) {
                case 1:
                    if (!level2Reached) {
                        level2Button.style.display = 'block';
                        contgroupElement.style.display = 'block';
                        level2Reached = true;
                    }
                    break;
                case 2:
                    if (!level3Reached) {
                        level3Button.style.display = 'block';
                        contgroupElement.style.display = 'block';
                        level3Reached = true;
                        level2Button.style.display = 'none';
                    }
                    break;
                case 3:
                    if (!level4Reached) { // Transition to level 4
                        level4Button.style.display = 'block'; // Assuming you have a level4Button
                        contgroupElement.style.display = 'block';
                        level4Reached = true;
                        level3Button.style.display = 'none';
                    }
                    break;
                case 4:
                    if (!level5Reached) { // Transition to level 4
                        level5Button.style.display = 'block'; // Assuming you have a level4Button
                        contgroupElement.style.display = 'block';
                        level5Reached = true;
                        level4Button.style.display = 'none';
                    }
                    break;
                case 5:
                    if (!level6Reached) { // Transition to level 4
                        contgroupElement.style.display = 'block';
                        level6Reached = true;
                        level5Button.style.display = 'none';
                    }
                    break;
            }
            
            if (winSound) {
                winSound.play();
                backgroundMusic.pause(); // Optional: Pause background music
                if(!isMuted){
                    winSound.onended = () => {
                    backgroundMusic.play(); // Optional: Restart background music
                }
            } else {
                console.error("Win sound not initialized. Check the file path.");
            }}
        } else {
            // Reset logic (only when moving AWAY from target)
            switch (currentLevel) {
                case 2:
                    if (level2Reached && (distX > tolerance || distY > 10)) {
                        level2Button.style.display = 'none';
                        contgroupElement.style.display = 'none';
                        level2Reached = false;
                        currentLevel = 1;
                    }
                    break;
                case 3:
                    if (level3Reached && (distX > tolerance || distY > 10)) {
                        level3Button.style.display = 'none';
                        contgroupElement.style.display = 'none';
                        level3Reached = false;
                        currentLevel = 2;
                    }
                    break;
                 case 4:
                    if (level4Reached && (distX > tolerance || distY > 10)) {
                        level4Button.style.display = 'none';
                        contgroupElement.style.display = 'none';
                        level4Reached = false;
                        currentLevel = 3;
                    }
                    break;
                case 5:
                    if (level5Reached && (distX > tolerance || distY > 10)) {
                        level5Button.style.display = 'none';
                        contgroupElement.style.display = 'none';
                        level5Reached = false;
                        currentLevel = 4;
                    }
                    break;
            }
        }
        
        for (const dangerElement of dangerElements) {
            const dangerRect = dangerElement.getBoundingClientRect();
            if (isCollision(girlRect, dangerRect)) {
                x = 0;
                y = 445;
                updatePosition(currentLevel);
                alert("Danger!");
                if (failSound) { // Play fail sound
                    failSound.play();
                    failSound.playbackRate = 1.5;
                    backgroundMusic.pause(); // Optional: Pause background music
                    if(!isMuted){
                    failSound.onended = () => {
                        backgroundMusic.play(); // Optional: Restart background music
                    }
                } }else {
                    console.error("Fail sound not initialized. Check the file path.");
                }
                
                return;
            }
        }
    }
    // ... (danger collision code)
    function isCollision(rect1, rect2) {
        return !(rect1.right < rect2.left ||
                 rect1.left > rect2.right ||
                 rect1.bottom < rect2.top ||
                 rect1.top > rect2.bottom);
    }
    // move danger
    function moveElement(element, offset, duration) {
       // console.log(element , offset ,duration );
        if (element.animation) {
            element.animation.cancel();
            console.log("sffe")
        }
    
        const computedStyle = window.getComputedStyle(element);
        const startTop = parseFloat(computedStyle.top)|| 0;  // Relative to document
        const targetTop = startTop + offset;
        const startTime = performance.now();
        //console.log(startTop, targetTop)

        function animate(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const newTop = startTop + (targetTop - startTop) * progress;
            
            //console.log(startTime , elapsedTime , progress , element.style.top);
            element.style.position = 'relative';
            element.style.top = newTop + 'px';
    
            if (progress < 1) {
                element.animation = requestAnimationFrame(animate);
            } else {
                element.animation = null;
                element.style.top = startTop + 'px'; // Return to original
    
                // Start the next animation cycle (infinite loop)
                setTimeout(() => { // Small delay before restarting (optional)
                    moveElement(element, offset, duration);
                }, 0); // 0 delay for instant restart, or a small value like 100 for a pause
            }
        }
    
        element.animation = requestAnimationFrame(animate);
    }
    // Level 1 button click handler
    document.addEventListener('keydown', function(event) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        switch (event.key) {
            case 'ArrowLeft':
                x -= step;
                if (x < 0) { x = 0; }
                break;
            case 'ArrowRight':
                x += step;
                if (x + girlElement.offsetWidth > charElement.offsetWidth) {
                    x = charElement.offsetWidth - girlElement.offsetWidth;
                }
                break;
            case 'ArrowUp':
                y -= step;
                if (y < 0) { y = 0; }
                break;
            case 'ArrowDown':
                y += step;
                if (y + girlElement.offsetHeight > charElement.offsetHeight) {
                    y = charElement.offsetHeight - girlElement.offsetHeight;
                }
                break;
        }
        updatePosition(currentLevel);
    });
    // Level 2 button click handler
    level2Button.addEventListener('click', function() {
        let girls=document.querySelector('.girls');
        girls.style.top="44.7%";
        girls.style.right="-59%";
        level2Button.style.display = 'none';
        contgroupElement.style.display = 'none';
        level2Shown = false;
        let cust3 = document.querySelector('.cust3');
        cust3.style.display = 'flex';
        cust3.style.top = '-514px';
        cust3.style.left = '194px';
        girlElement.style.top = '445px';
        girlElement.style.left = '0px';
        x = 0;
        y = 445;
        currentLevel = 2; // Set current level
        console.log("Bike to start!");
        updatePosition(currentLevel);
        
    });
    // Level 3 button click handler
    level3Button.addEventListener('click', function() {
        let girls=document.querySelector('.girls');
        girls.style.top="28.7%";
        girls.style.right="-59%";
        level3Button.style.display = 'none';
        contgroupElement.style.display = 'none';
        level3Shown = false;
        let cust2 = document.querySelector('.cust2');
        cust2.style.display = 'flex';
        /*cust2.style.top = '-514px';
        cust3.style.left = '247px';*/
        girlElement.style.top = '445px';
        girlElement.style.left = '0px';
        x = 0;
        y = 445;
        currentLevel = 3; // Set current level
        console.log("Level 3 started!");
        updatePosition(currentLevel);
        
    });
    // Level 4 button click handler
    level4Button.addEventListener('click', function() {
        let girls=document.querySelector('.girls');
        girls.style.top="26.7%";
        girls.style.right="-59%";
        let favirus = document.querySelectorAll('.fa-virus');
        favirus.forEach(element =>{
            element.style.visibility= "hidden";
        })
        level4Button.style.display = 'none';
        contgroupElement.style.display = 'none';
        level3Shown = false;
        let cust2 = document.querySelector('.cust2');
        cust2.style.display = 'flex';
        girlElement.style.top = '445px';
        girlElement.style.left = '0px';
        x = 0;
        y = 445;
        dangerElement1=document.querySelector('.cust.cust3 img:nth-child(2)');
        dangerElement2=document.querySelector('.cust img:nth-child(6)');

        moveElement(dangerElement1,-200, 5000);
        moveElement(dangerElement2,-200, 5000);

        currentLevel = 4;
        console.log("Level 4 started!");
        updatePosition(currentLevel);
    });
    // Level 5 button click handler
    level5Button.addEventListener('click', function() {
        let girls=document.querySelector('.girls');
        girls.style.top="26.7%";
        girls.style.right="-59%";
        level4Button.style.display = 'none';
        contgroupElement.style.display = 'none';
        level3Shown = false;
        let cust2 = document.querySelector('.cust2');
        cust2.style.display = 'flex';
        girlElement.style.top = '445px';
        girlElement.style.left = '0px';
        x = 0;
        y = 445;
        dangerElement2=document.querySelector('.cust3 img:nth-child(4)');
        moveElement(dangerElement2,-300, 5000);

        currentLevel = 5;
        console.log("Level 5 started!");
        updatePosition(currentLevel);
    });
    
    charElement.addEventListener('click', (event) => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        const girlRect = girlElement.getBoundingClientRect();
        const charRect = charElement.getBoundingClientRect();

        const clickX = event.clientX - charRect.left;
        const clickY = event.clientY - charRect.top;

        // Calculate direction and distance
        const centerX = girlRect.left + girlRect.width / 2 - charRect.left;
        const centerY = girlRect.top + girlRect.height / 2 - charRect.top;

        const deltaX = clickX - centerX;
        const deltaY = clickY - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance > 0) { // Avoid division by zero
            const moveX = (deltaX / distance) * 10; // 10px in the calculated direction
            const moveY = (deltaY / distance) * 10;

            let newX = x + moveX;
            let newY = y + moveY;
            if (width > height) { // Landscape Mode (Original behavior)
                newX = Math.max(0, Math.min(charRect.width - girlRect.width, newX));
               newY = Math.max(0, Math.min(charRect.height - girlRect.height, newY));
               x = newX;
               y = newY;
               updatePosition(currentLevel);
           } else { // Portrait Mode (Modified behavior)
               // Determine the dominant direction of the click
               if (Math.abs(deltaX) > Math.abs(deltaY)) { // Horizontal movement
                   if (deltaX > 0) { // Clicked right, move *top*
                    newY = y - Math.abs(moveX); // Move up (decrease y)
                    newX = x;
                    } else { // Clicked left, move bottom
                        newY = y + Math.abs(moveX); // Move down (increase y)
                        newX = x;
                    }
               } else { // Vertical movement
                   if (deltaY > 0) { // Clicked down, move left
                       newX = x + Math.abs(moveY);
                       newY = y;
                   } else { // Clicked up, move right
                       newX = x - Math.abs(moveY);
                       newY = y;
                   }
               }
               newX = Math.max(0, Math.min(charRect.width - girlRect.width, newX));
               newY = Math.max(0, Math.min(charRect.height - girlRect.height, newY));
               x = newX;
               y = newY;
               updatePosition(currentLevel);
           }
       }
    });

    function sound() {
        backgroundMusic = new Audio('../../static/photo/background.mp3'); // Correct path!
        backgroundMusic.loop = true;
        backgroundMusic.volume = 0.2;
        backgroundMusic.playedOnce = false; // Initialize

        winSound = new Audio('../../static/photo/win.mp3'); // Path to your win sound - CORRECTED
        winSound.volume = 0.5;

        failSound = new Audio('../../static/photo/fail.mp3'); // Path to your fail sound - Add this line
        failSound.volume = 0.5;
        const volumeButton = document.getElementById('volumeButton');
        const volumeOnIcon = document.getElementById('volumeOnIcon');
        const volumeOffIcon = document.getElementById('volumeOffIcon');

        if (!volumeButton || !volumeOnIcon || !volumeOffIcon) {
            console.error("Volume button or icons not found!");
            return;
        }

        // Initialize icons (Show muted icon initially)
        volumeOnIcon.style.display = 'none';
        volumeOffIcon.style.display = 'inline-block';

        volumeButton.addEventListener('click', () => {
            isMuted = !isMuted;

            if (isMuted) {
                volumeOnIcon.style.display = 'none';
                volumeOffIcon.style.display = 'inline-block';
                if (backgroundMusic) {
                    backgroundMusic.pause();
                }
            } else {
                volumeOnIcon.style.display = 'inline-block';
                volumeOffIcon.style.display = 'none';

                if (backgroundMusic && !backgroundMusic.playedOnce) {
                    backgroundMusic.play();
                    backgroundMusic.playedOnce = true;
                } else if (backgroundMusic) {
                    backgroundMusic.play(); // Resume
                }
            }
        });
    }

    function rotateNavbar() {
        const navbar = document.querySelector('body');
        const nav=document.querySelector('navbar');
        const width = window.innerWidth;
        const height = window.innerHeight;
      
        if (width < height) {
          navbar.style.transform = 'rotate(90deg)';
          navbar.style.margin='23px -59px -69px 2px';
          nav.style.top='41px';
        } else {
          navbar.style.transform = 'rotate(0deg)';
        }
      }
    // Initialize sound (important!)
     sound(); 
    // Initial check on page load
    rotateNavbar();
    // Check on window resize
      window.addEventListener('resize', rotateNavbar);
});

var sex=document.querySelector(".char .contgirl .girl");

var group=document.querySelector(".char .contgroup");
function changeGirl(){
    sex.src="https://blush.design/api/download?shareUri=OX3EZpSWP&c=Skin_0%7Ecdd6f2&w=800&h=800&fm=png";
    sex.style.height="auto";
    sex.style.paddingTop= "0px";
}
function changeBoy(){
    sex.src="https://blush.design/api/download?shareUri=5rdIDJpY7&c=Skin_0%7Ecdd6f2&w=800&h=800&fm=png";
    sex.style.height="193px";
    sex.style.paddingTop= "14px";
}
