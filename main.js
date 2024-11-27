const scene = document.getElementById('scene');
const ball = document.getElementById('ball');

let isDragging = false;
let startX;
let currentRotation = 0;

scene.addEventListener('mousedown', (event) => {
    isDragging = true;
    startX = event.clientX;
    scene.style.cursor = 'grabbing'; // Update cursor style
});

scene.addEventListener('mousemove', (event) => {
    if (!isDragging) return;
    const deltaX = event.clientX - startX;
    currentRotation += deltaX * 0.5; // Adjust rotation sensitivity
    scene.style.transform = `rotateY(${currentRotation}deg)`;
    startX = event.clientX; // Update starting position
});

scene.addEventListener('mouseup', () => {
    isDragging = false;
    scene.style.cursor = 'grab'; // Reset cursor style
});

scene.addEventListener('mouseleave', () => {
    isDragging = false; // Stop rotation if mouse leaves the scene
});


document.addEventListener('touchstart', (event) => {
    isDragging = true;
    startX = event.touches[0].clientX; // Track first touch
});

document.addEventListener('touchmove', (event) => {
    if (!isDragging) return;
    const deltaX = event.touches[0].clientX - startX;
    currentRotation += deltaX * 0.5;
    scene.style.transform = `rotateY(${currentRotation}deg)`;
    startX = event.touches[0].clientX;
});

document.addEventListener('touchend', () => {
    isDragging = false;
});


// let step = 0;

// scene.addEventListener('wheel', (event) => {
//     console.log(event.wheelDelta)
//     console.log(event.wheelDeltaX)
//     console.log(event.wheelDeltaY)
//     console.log('')

//     if (event.wheelDelta > 0) { step = 1; }
//     else { step = -1; }

//     // const deltaX = step - startX;
//     const deltaX = step;
//     currentRotation += deltaX * 10.5; // Adjust rotation sensitivity
//     scene.style.transform = `rotateY(${currentRotation}deg)`;
//     // startX = event.clientX; // Update starting position
// })

// let currentRotation = 0; // Current rotation angle
let targetRotation = 0; // Target rotation angle
let rotationStep = 10.5; // Adjust sensitivity
let isAnimating = false;

document.addEventListener('wheel', (event) => {
    // Prevent default scrolling behavior
    // event.preventDefault();

    // Update target rotation based on wheel direction
    targetRotation += (event.deltaY > 0 ? 1 : -1) * rotationStep;

    // Start animation loop if not already running
    if (!isAnimating) {
        isAnimating = true;
        animateRotation();
    }
});

// function animateRotation() {
//     // Smoothly interpolate between current and target rotation
//     currentRotation += (targetRotation - currentRotation) * 0.05; // Adjust 0.1 for smoothness (easing factor)
    
//     // Apply rotation to the scene
//     scene.style.transform = `rotateY(${currentRotation}deg)`;

//     // Continue animating if not at the target rotation
//     if (Math.abs(targetRotation - currentRotation) > 0.1) {
//         requestAnimationFrame(animateRotation);
//         // animateRotation()
//     } else {
//         // Snap to target rotation and stop animation
//         currentRotation = targetRotation;
//         isAnimating = false;
//     }
// }

function animateRotation() {
    currentRotation += (targetRotation - currentRotation) * 0.1; // Easing factor

    // Apply rotation to the scene
    scene.style.transform = `rotateY(${currentRotation}deg)`;

    // Adjust perspective-origin dynamically
    if (Math.abs((((currentRotation % 360) + 360) % 360) - 270) < 15) {
        // Near 90 degrees, set perspective to 50% top
        document.body.style.perspectiveOrigin = '50% 10%';
    } else {
        // Default perspective origin
        document.body.style.perspectiveOrigin = '50% calc(50% - 2em)';
    }

    // Continue animating if not at the target rotation
    if (Math.abs(targetRotation - currentRotation) > 0.1) {
        requestAnimationFrame(animateRotation);
    } else {
        // Snap to target rotation and stop animation
        currentRotation = targetRotation;
        isAnimating = false;
    }
}