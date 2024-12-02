const scene = document.getElementById('scene');
const mapPosition = document.getElementById('map-position'); 

let currentWalk = 0;
let targetWalk = 0; // Target rotation angle
let walkStep = 0.3; // Adjust sensitivity
let isAnimating = false;

document.addEventListener('wheel', (event) => {
    // Prevent default scrolling behavior
    // event.preventDefault();

    // Update target rotation based on wheel direction
    targetWalk += (event.deltaY > 0 ? 1 : -1) * walkStep;

    // Start animation loop if not already running
    if (!isAnimating) {
        isAnimating = true;
        animateWalk();
    }
});

let currentRotation = 0;

function animateWalk() {
    // Smoothly interpolate between current and target rotation
    currentWalk += (targetWalk - currentWalk) * 0.05; // Adjust 0.1 for smoothness (easing factor)
    
    // Apply rotation to the scene
    console.log(`CurrentWalk: ${currentWalk}`)

    if (currentWalk<-10) {
        currentRotation = 90;
        scene.style.transform = `rotateY(${currentRotation}deg) translateZ(${currentWalk + 4}em) translateX(-15.25em)`;
        mapPosition.style.left = `${Math.max((-currentWalk-10)  * 80 / 10, 0)}%`;
    }
    else {
        scene.style.transform = `translateX(${currentWalk}em)`;
        mapPosition.style.bottom = `${Math.max(-currentWalk  * 80 / 10, 0)}%`;
    }

    // Continue animating if not at the target rotation
    if (Math.abs(targetWalk - currentWalk) > 0.1) {
        requestAnimationFrame(animateWalk);
    } else {
        // Snap to target rotation and stop animation
        currentWalk = targetWalk;
        isAnimating = false;
    }
}



let startX;
let isDragging = false;

document.addEventListener('touchstart', (event) => {
    isDragging = true;
    startX = event.touches[0].clientX; // Track first touch
});

document.addEventListener('touchmove', (event) => {
    if (!isDragging) return;
    const deltaX = event.touches[0].clientX - startX;
    currentWalk += deltaX * 0.02;

    if (currentWalk<-10) {
        currentRotation = 90;
        scene.style.transform = `rotateY(${currentRotation}deg) translateZ(${currentWalk + 4}em) translateX(-15.25em)`;
        mapPosition.style.left = `${Math.max((-currentWalk-11)  * 100 / 20, 0)}%`;
    }
    else {
        scene.style.transform = `translateX(${currentWalk}em)`;
        mapPosition.style.bottom = `${Math.max(-currentWalk  * 80 / 10, 0)}%`;
    }
    // scene.style.transform = `translateX(${2}em)`;
    startX = event.touches[0].clientX;
});

document.addEventListener('touchend', () => {
    isDragging = false;
});

// function animateRotation() {
//     currentRotation += (targetRotation - currentRotation) * 0.1; // Easing factor

//     // Apply rotation to the scene
//     scene.style.transform = `rotateY(${currentRotation}deg)`;

//     // Adjust perspective-origin dynamically
//     if (Math.abs((((currentRotation % 360) + 360) % 360) - 270) < 15) {
//         // Near 90 degrees, set perspective to 50% top
//         document.body.style.perspectiveOrigin = '50% 10%';
//     } else {
//         // Default perspective origin
//         document.body.style.perspectiveOrigin = '50% calc(50% - 2em)';
//     }

//     // Continue animating if not at the target rotation
//     if (Math.abs(targetRotation - currentRotation) > 0.1) {
//         requestAnimationFrame(animateRotation);
//     } else {
//         // Snap to target rotation and stop animation
//         currentRotation = targetRotation;
//         isAnimating = false;
//     }
// }



// window.addEventListener("resize", () => {
//     console.log("Screen height:", window.screen.height, "px");
//     console.log("Viewport height:", window.innerHeight, "px");
// });
