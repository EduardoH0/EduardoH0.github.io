export class SwitchPaintings {
    constructor() {
        this.paintings = [
            document.getElementById('welcome-painting-1'),
            document.getElementById('welcome-painting-2'),
            document.getElementById('welcome-painting-3'),
            document.getElementById('welcome-painting-4')
        ]
        this.firstBatch = [
            "images/room4/9.jpg",
            "images/room1/7.jpg",
            "images/room2/16.jpg",
            "images/room3/14.jpg"
        ]
        this.secondBatch = [
            "images/room4/3.jpg",
            "images/room1/13.jpg",
            "images/room2/6.jpg",
            "images/room3/11.jpg"
        ]
        this.flags = [0, 0, 0, 0];
        this.debounceTimeout = [null, null, null, null]; // To track debounce for each painting
        this.cooldownPeriod = 100; // Cooldown period in milliseconds

        // Preload images
        this.preloadImages([...this.firstBatch, ...this.secondBatch]);
        this.offsetAutoRotation = 0;
    }

    preloadImages(imagePaths) {
        imagePaths.forEach((src) => {
            const img = new Image();
            img.src = src;
        });
    }

    switchImage(currentRotation) {
        const rotation = currentRotation - this.offsetAutoRotation;
        const absRotation = Math.abs(rotation);

        const nSpins0 = Math.floor((absRotation + 180) / 360);
        const nSpins2 = Math.floor((absRotation) / 360);
        const nSpins3 = Math.floor(((absRotation + 270) - ((rotation > 0) * 180)) / 360);
        const nSpins1 = Math.floor(((absRotation + 270) - ((rotation < 0) * 180)) / 360);

        this.updatePainting(0, nSpins0);
        this.updatePainting(1, nSpins1);
        this.updatePainting(2, nSpins2);
        this.updatePainting(3, nSpins3);
    }

    updatePainting(index, nSpins) {
        if (this.flags[index] != nSpins) {
            this.flags[index] = nSpins;
            this.paintings[index].src = nSpins % 2 ? this.secondBatch[index] : this.firstBatch[index];
        }
    }

    // Not in use
    setOffsetAutoRotation(currentRotation) {
        let final_rotation = currentRotation % 360;
        if (Math.abs(final_rotation) > 180) {
            final_rotation = Math.sign(final_rotation) * (Math.abs(final_rotation) - 360);
        }
        this.offsetAutoRotation = currentRotation - final_rotation;
    }

    // Not in use
    updatePaintingWithDebounce() {
        if (this.flags[index] != nSpins) {
            this.flags[index] = nSpins;
            clearTimeout(this.debounceTimeout[index]); // Clear previous debounce
            this.debounceTimeout[index] = setTimeout(() => {
                this.paintings[index].src = nSpins % 2 ? this.secondBatch[index] : this.firstBatch[index];
            }, this.cooldownPeriod); // Delay changes
        }
    }
}