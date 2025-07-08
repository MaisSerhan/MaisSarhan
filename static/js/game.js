var circalContainer = document.querySelector(".circal");
var circles = []; // To store the created circle elements

// Configuration for each circle's animation, mirroring original CSS
const circleAnimations = [
    { startTop: -10, endTop: 100, duration: 10000, delay: 0, bgColor: 'blueviolet', width: 20, height: 20, opacity: 0.6, zIndex: -1, initialLeft: 3 }, // circal1
    { startTop: 10, endTop: 100, duration: 9000, delay: 5000, bgColor: 'aqua', width: 20, height: 20, opacity: 0.6, zIndex: -1, initialLeft: 21 },  // circal2
    { startTop: 0, endTop: 100, duration: 10000, delay: 5000, bgColor: 'aqua', width: 20, height: 20, opacity: 0.6, zIndex: -1, initialLeft: 90 },  // circal2 (from CSS)
    { startTop: 10, endTop: 100, duration: 9000, delay: 5000, bgColor: 'aqua', width: 20, height: 20, opacity: 0.6, zIndex: -1, initialLeft: 80 },  // circal2 again
    { startTop: -10, endTop: 100, duration: 10000, delay: 5000, bgColor: 'blueviolet', width: 20, height: 20, opacity: 0.6, zIndex: -1, initialLeft: 85 }, // circal1 again
    { startTop: -10, endTop: 100, duration: 9000, delay: 5000, bgColor: 'blueviolet', width: 20, height: 20, opacity: 0.6, zIndex: -1, initialLeft: 30 },  // circal1 again
    { startTop: -5, endTop: 100, duration: 10000, delay: 0, bgColor: 'aqua', width: 40, height: 40, opacity: 0.9, zIndex: -1, initialLeft: 7 },   // circal2 (larger)
    { startTop: 0, endTop: 100, duration: 10000, delay: 0, bgColor: 'aqua', width: 40, height: 40, opacity: 0.9, zIndex: -1, initialLeft: 23 },    // circal3 (larger)
    { startTop: 10, endTop: 100, duration: 10000, delay: 0, bgColor: 'aqua', width: 40, height: 40, opacity: 0.9, zIndex: -1, initialLeft: 80 },   // circal2 (larger)
    { startTop: 0, endTop: 100, duration: 10000, delay: 0, bgColor: 'aqua', width: 40, height: 40, opacity: 0.9, zIndex: -1, initialLeft: 94 },    // circal3 (larger)
    { startTop: 15, endTop: 100, duration: 9000, delay: 0, bgColor: 'blueviolet', width: 40, height: 40, opacity: 0.6, zIndex: -1, initialLeft: 35 },    // circal4 (larger, matches CSS)
    { startTop: 60, endTop: 100, duration: 9000, delay: 0, bgColor: 'rgb(43, 220, 226)', width: 20, height: 20, opacity: 0.6, zIndex: -1, initialLeft: 56 },    // circal5
    { startTop: 15, endTop: 100, duration: 9000, delay: 0, bgColor: 'blueviolet', width: 40, height: 40, opacity: 0.6, zIndex: -1, initialLeft: 89 },    // circal4 again
    { startTop: 60, endTop: 100, duration: 9000, delay: 0, bgColor: 'rgb(43, 211, 226)', width: 20, height: 20, opacity: 0.6, zIndex: -1, initialLeft: 14 },    // circal5 again
    { startTop: 15, endTop: 100, duration: 9000, delay: 0, bgColor: 'blueviolet', width: 20, height: 20, opacity: 0.6, zIndex: -1, initialLeft: 72 },    // circal4 again
    { startTop: 60, endTop: 100, duration: 9000, delay: 0, bgColor: 'rgb(43, 214, 226)', width: 20, height: 20, opacity: 0.6, zIndex: -1, initialLeft: 70 },    // circal5 again
];

// Create the 16 circle divs and apply initial styles
for (let i = 0; i < circleAnimations.length; i++) {
    let cir = document.createElement("div");
    const config = circleAnimations[i];

    cir.style.position = 'absolute';
    cir.style.borderRadius = '50%';
    cir.style.backgroundColor = config.bgColor;
    cir.style.width = `${config.width}px`;
    cir.style.height = `${config.height}px`;
    cir.style.boxShadow = '0px 2px 20px 3px rgb(0, 255, 38)';
    cir.style.opacity = config.opacity;
    cir.style.zIndex = config.zIndex;
    cir.style.left = `${config.initialLeft}%`; // Set initial horizontal position
    cir.style.top = `${config.startTop}%`; // Set initial vertical position

    circalContainer.appendChild(cir);
    circles.push(cir); // Store the reference to the div
}


// Initialize animation state for each circle
let animationStates = circles.map((_, index) => ({
    startTime: 0,
    animationActive: false, // Control when animation starts
    currentTop: circleAnimations[index].startTop,
    delayTimer: null, // For handling initial delays
}));


// Function to start a single circle's animation
function startCircleAnimation(index, currentTime) {
    const config = circleAnimations[index];
    const state = animationStates[index];
    const circle = circles[index];

    // Reset position for a new cycle
    state.currentTop = config.startTop;
    circle.style.top = `${state.currentTop}%`;
    state.startTime = currentTime; // Use current time for precise start
    state.animationActive = true;
}

// The main animation loop
function animateCircles(currentTime) {
    circles.forEach((circle, index) => {
        const config = circleAnimations[index];
        const state = animationStates[index];

        if (!state.animationActive) {
            // Apply initial delay
            if (!state.delayTimer) {
                state.delayTimer = setTimeout(() => {
                    startCircleAnimation(index, performance.now()); // Pass current time when starting
                }, config.delay);
            }
            return; // Skip animation if not active yet
        }

        const elapsedTime = currentTime - state.startTime;
        const progress = (elapsedTime % config.duration) / config.duration; // Loop the animation

        // Calculate current top position
        const range = config.endTop - config.startTop;
        let newTop = config.startTop + (range * progress);

        // Check if the circle has completed a cycle and needs to restart
        // We use a small epsilon to account for floating point inaccuracies
        if (progress >= 0.999 && elapsedTime >= config.duration) {
             // Reset to start of animation, and adjust start time to perfectly align next cycle
             state.startTime = currentTime - (elapsedTime % config.duration);
             newTop = config.startTop; // Ensure it snaps to start
        }

        circle.style.top = `${newTop}%`;
    });

    requestAnimationFrame(animateCircles); // Continue the loop
}

// Start the animation loop
requestAnimationFrame(animateCircles);

// Optional: Add cube rotation with JS if it's not handled by CSS anymore
// (Your CSS already has cub-rotate animation, so this is just if you moved it from CSS)
const cubIner = document.querySelector(".cub .iner");
let cubeRotationAngle = 0;
const cubeRotationSpeed = 0.05; // degrees per frame

function animateCube() {
    cubeRotationAngle = (cubeRotationAngle + cubeRotationSpeed) % 360;
    cubIner.style.transform = `translateX(-50%) rotateY(${cubeRotationAngle}deg)`;
    requestAnimationFrame(animateCube);
}

// If you want to use JS for cube rotation instead of CSS:
// requestAnimationFrame(animateCube);
// And remove `animation: cub-rotate 15s infinite linear;` from `.cub .iner` in CSS.
