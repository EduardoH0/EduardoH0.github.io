const scene = document.getElementById('scene');

let isDragging = false;
let startX;
let currentRotation = 0;

// LOAD (waits for all images to load)
window.addEventListener('load', function() {
    var loadingDiv = document.querySelector('.loading-element');
    loadingDiv.classList.add('fade-out'); // add fade-out animation to the loading icon
    // Remove div from the DOM once the transition is finished
    loadingDiv.addEventListener('transitionend', function() {
      loadingDiv.parentNode.removeChild(loadingDiv);
    })
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