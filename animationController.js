/* 
    Animation Controller module
*/
export class AnimationController {
    constructor(scene, mapPosition, config) {
        this.scene = scene;
        this.mapPosition = mapPosition;

        // State variables
        this.currentWalk = 0;
        this.targetWalk = 0;
        this.isAnimating = false;
        this.isDragging = false;
        this.startX = 0;

        // Configuration
        this.walkStep = config.walkStep || 0.3;
        this.walkStepKey = config.walkStepKey || 0.05;
        this.smoothnessFactor = config.smoothnessFactor || 0.05;
        this.touchSmoothness = config.touchSmoothness || 0.02;
        this.cumulativeRoom = config.cumulativeRoom;
        this.room = config.room;

        // Transformation functions
        this.forwardTransformations = config.forwardTransformations;
        this.forwardMap = config.forwardMap;

        // Bind event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('wheel', (event) => this.onWheel(event));
        document.addEventListener('touchstart', (event) => this.onTouchStart(event));
        document.addEventListener('touchmove', (event) => this.onTouchMove(event));
        document.addEventListener('touchend', () => this.onTouchEnd());
        document.addEventListener('keydown', (event) => {this.onKey(event)});
    }

    startAnimation() {
        if (!this.isAnimating) {
            this.isAnimating = true;
            this.animateWalk();
        }
    }

    animateWalk() {
        this.currentWalk += (this.targetWalk - this.currentWalk) * this.smoothnessFactor;

        // Compute new position (take into account direction + number of spins)
        let newPos = -(-this.currentWalk % this.cumulativeRoom[this.cumulativeRoom.length - 1]);
        if (this.currentWalk > 0) {
            newPos = -((this.cumulativeRoom[this.cumulativeRoom.length - 1] - (this.currentWalk % this.cumulativeRoom[this.cumulativeRoom.length - 1])));
        }
        const index = this.cumulativeRoom.findIndex(num => num > -newPos);

        // Update scene and map
        this.scene.style.transform = this.forwardTransformations(newPos, this.cumulativeRoom)[index];
        this.mapPosition.style.inset = this.forwardMap(newPos, this.cumulativeRoom)[index];

        // Continue animation loop
        if (Math.abs(this.targetWalk - this.currentWalk) > 0.05) {
            requestAnimationFrame(() => this.animateWalk());
        } else {
            this.currentWalk = this.targetWalk;
            this.isAnimating = false;
        }
    }

    onWheel(event) {
        this.targetWalk += (event.deltaY > 0 ? 1 : -1) * this.walkStep;
        this.startAnimation();
    }

    onKey(event) {
        this.smoothnessFactor = 1
        if (event.key == 'ArrowRight') {
            this.targetWalk += -1 * this.walkStepKey;
        }
        else if (event.key == 'ArrowLeft') {
            this.targetWalk += 1 * this.walkStepKey;
        }
        this.startAnimation();
    }

    onTouchStart(event) {
        this.isDragging = true;
        this.startX = event.touches[0].clientX; // Track first touch
    }

    onTouchMove(event) {
        if (!this.isDragging) return;

        const deltaX = event.touches[0].clientX - this.startX;
        this.currentWalk += deltaX * this.touchSmoothness;

        // Compute new position (take into account direction + number of spins)
        let newPos = -(-this.currentWalk % this.cumulativeRoom[this.cumulativeRoom.length - 1]);
        if (this.currentWalk > 0) {
            newPos = -((this.cumulativeRoom[this.cumulativeRoom.length - 1] - (this.currentWalk % this.cumulativeRoom[this.cumulativeRoom.length - 1])));
        }
        const index = this.cumulativeRoom.findIndex(num => num > -newPos);

        // Update scene and map
        this.scene.style.transform = this.forwardTransformations(newPos, this.cumulativeRoom)[index];
        this.mapPosition.style.inset = this.forwardMap(newPos, this.cumulativeRoom)[index];

        this.startX = event.touches[0].clientX; // Update start position
    }

    onTouchEnd() {
        this.isDragging = false;
    }
}
