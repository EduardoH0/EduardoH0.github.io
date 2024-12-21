import { LoadingHandler } from './loadingHandler.js';
import { EVENTS } from "./events.js";


class SceneController {
    constructor() {
        this.scene = document.getElementById('scene');
        this.warningRoom = document.getElementById('warning-room');
        this.rooms = [
            document.getElementById('room-closed-3'),
            document.getElementById('room-closed-4'),
        ];

        this.animationFrameId = null;
        this.isDragging = false;
        this.startX = 0;
        this.currentRotation = 0;
        this.targetRotation = 0;
        this.rotationStep = 10.5; // Adjust sensitivity
        
        this.smoothnessFactor = 0.1;
        this.touchSmoothnessFactor = 0.5;
        this.isAnimating = false;

        this.autoRotate = true;
    }

    init() {
        new LoadingHandler().init();
        this.addEventListeners();
    }

    addEventListeners() {

        const handleContentLoaded = () => {
            window.setTimeout(() => {
                this.rotateScene();
                document.removeEventListener(EVENTS.CONTENT_LOADED, handleContentLoaded);
            }, 500);
        };
        if (this.autoRotate) document.addEventListener(EVENTS.CONTENT_LOADED, handleContentLoaded);

        document.addEventListener('touchstart', (event) => this.handleTouchStart(event));
        document.addEventListener('touchmove', (event) => this.handleTouchMove(event));
        document.addEventListener('touchend', () => this.handleTouchEnd());

        document.addEventListener('wheel', (event) => this.handleWheel(event));

        this.rooms.forEach(room => {
            room.addEventListener('click', () => this.showWarningRoom());
        });
    }

    rotateScene() {
        this.currentRotation = (this.currentRotation + 0.1) % 360; // Increment and wrap angle
        this.targetRotation = this.currentRotation;
        this.scene.style.transform = `rotateY(${this.currentRotation}deg)`;
        this.animationFrameId = requestAnimationFrame(() => this.rotateScene());
    }

    endRotateScene() {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
    }

    handleTouchStart(event) {
        if (this.animationFrameId) { this.endRotateScene(); }
        this.isDragging = true;
        this.startX = event.touches[0].clientX; // Track first touch
    }

    handleTouchMove(event) {
        const currentScale = window.visualViewport ? window.visualViewport.scale : 1;
        const eventZoom = event.scale ? event.scale : event.touches.length;

        if (eventZoom === 1 && currentScale === 1) {
            if (!this.isDragging) return;
            const deltaX = event.touches[0].clientX - this.startX;
            this.currentRotation += deltaX * this.touchSmoothnessFactor;
            this.scene.style.transform = `rotateY(${this.currentRotation}deg)`;
            this.startX = event.touches[0].clientX;
        }
    }

    handleTouchEnd() {
        this.isDragging = false;
    }

    handleWheel(event) {
        if (this.animationFrameId) { this.endRotateScene(); }

        // Update target rotation based on wheel direction
        this.targetRotation += (event.deltaY > 0 ? 1 : -1) * this.rotationStep;

        // Start animation loop if not already running
        if (!this.isAnimating) {
            this.isAnimating = true;
            this.animateRotation();
        }
    }

    animateRotation() {
        this.currentRotation += (this.targetRotation - this.currentRotation) * this.smoothnessFactor; // Easing factor
        this.scene.style.transform = `rotateY(${this.currentRotation}deg)`;

        // Adjust perspective-origin dynamically
        const adjustedRotation = (((this.currentRotation % 360) + 360) % 360);
        if (Math.abs(adjustedRotation - 270) < 15) {
            document.body.style.perspectiveOrigin = '50% 10%';
        } else {
            document.body.style.perspectiveOrigin = '50% calc(50% - 2em)';
        }

        if (Math.abs(this.targetRotation - this.currentRotation) > 0.1) {
            requestAnimationFrame(() => this.animateRotation());
        } else {
            this.currentRotation = this.targetRotation;
            this.isAnimating = false;
        }
    }

    showWarningRoom() {
        this.warningRoom.classList.add('warning-room-active');
        this.warningRoom.addEventListener('animationend', () => {
            this.warningRoom.classList.remove('warning-room-active');
        }, { once: true });
    }
}

// Initialize the SceneController
const sceneController = new SceneController();
sceneController.init();
