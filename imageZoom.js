export class WorkZoom {
    constructor(workPath, stateManager) {
        this.stateManager = stateManager;

        this.fetchWork(workPath)
            .then(data => {
                this.workData = data;
            })

        this.roomImages = document.querySelectorAll('.room-img');
        this.mainContainer = document.getElementById('container-zoom-work');
        this.imageWrapper = document.getElementById('img-wrapper');
        this.textWrapper = document.getElementById('sub-container-zoom-text')

        this.currentImageIndex = 0;
        this.lenColection = this.roomImages.length;
        
        this.closeBtn = document.getElementById('close-img-wrapper');
        this.prevBtn = document.getElementById('container-zoom-work-prev');
        this.nextBtn = document.getElementById('container-zoom-work-next');
        

        this.currentScroll = 0;
        this.targetScroll = 0;
        this.isAnimating = false;
        this.smoothnessFactor = 0.1; // Adjust this value for smoother or faster animation


        this.setupEventListeners();
        this.setCoverflow(this.roomImages);
    }

    async fetchWork(workPath) {
        try {
            const response = await fetch(workPath);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching text content:', error);
            throw error;
        }
    }

    animateScroll(coverflowContainer) {
        // Interpolate towards the target scroll position
        this.currentScroll += (this.targetScroll - this.currentScroll) * this.smoothnessFactor;
    
        // Clamp the scroll position to the container boundaries
        const maxScroll = coverflowContainer.scrollWidth - coverflowContainer.clientWidth;
        this.currentScroll = Math.max(0, Math.min(this.currentScroll, maxScroll));
    
        // Apply the new scroll position
        coverflowContainer.scrollLeft = this.currentScroll;
    
        // Continue the animation loop if not yet at the target
        if (Math.abs(this.targetScroll - this.currentScroll) > 0.5) {
            requestAnimationFrame(() => this.animateScroll(coverflowContainer));
        } else {
            this.currentScroll = this.targetScroll; // Snap to target to avoid small discrepancies
            this.isAnimating = false;
        }
    }

    setCoverflow(data) {
        const coverflowContainer = document.getElementById('sub-container-coverflow-work');

        function isTouchDevice() {
            return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
        }

        if (isTouchDevice()) {
            coverflowContainer.style.overflowX = 'auto';
        }

        // Add scroll functionality on mouse wheel
        coverflowContainer.addEventListener('wheel', (event) => {
            event.preventDefault(); // Prevent default scroll behavior

            // Update target scroll position
            const maxScroll = coverflowContainer.scrollWidth - coverflowContainer.clientWidth;
            this.targetScroll = Math.max(0, Math.min(this.targetScroll + event.deltaY * 0.5, maxScroll));
        
            // Start the animation loop if not already animating
            if (!this.isAnimating) {
                this.isAnimating = true;
                this.animateScroll(coverflowContainer);
            }
        })
        const coverflowActivator = document.getElementById('activate-coverflow-work');
        

        if (isTouchDevice()) {
            coverflowActivator.addEventListener('click', () => { coverflowContainer.classList.toggle('coverflow-active') });
            // Touch devices: click anywhere on the screen to hide Coverflow
            document.addEventListener('touchstart', (event) => {
                if (!coverflowContainer.contains(event.target) && !coverflowActivator.contains(event.target)) {
                    coverflowContainer.classList.remove('coverflow-active');
                }
            })
        } else {
            coverflowActivator.addEventListener('mouseenter', () => { coverflowContainer.classList.add('coverflow-active') });
            coverflowContainer.addEventListener('mouseleave', () => { coverflowContainer.classList.remove('coverflow-active') });
        }



        data.forEach((image, index) => {
            const coverflowWork = document.createElement('div');
            coverflowWork.classList.add('coverflow-work');
            coverflowWork.id = `coverflow-work-${index+1}`
            coverflowWork.addEventListener('click', () => { 
                this.loadImage(index+1); 
                this.currentImageIndex = index+1;
                if(isTouchDevice()) { coverflowWork.classList.add('coverflow-work-touch') }
            })
            if (isTouchDevice()) {coverflowWork.addEventListener('animationend', () =>{ coverflowWork.classList.remove('coverflow-work-touch'); })}

            const imageContainer = document.createElement('img');
            imageContainer.src = image.src;

            coverflowWork.appendChild(imageContainer);
            coverflowContainer.appendChild(coverflowWork);
        });
    }

    setText(index) {
        const content = this.workData[`${index}`];
        const workText = `
            <p><b>${content.artist}</b></p>
            <p><i>${content.title}</i>, ${content.year}</p>
            <p>${content.medium}</p>
            <p>${content.dimensions}</p>
        `;
        this.textWrapper.innerHTML = workText;
    }

    setupEventListeners() {
        this.prevBtn.addEventListener('click', () => {
            this.showPrevImage();
            this.animateButton(this.prevBtn, 'left');
        });
        this.nextBtn.addEventListener('click', () => {
            this.showNextImage();
            this.animateButton(this.nextBtn, 'right');
        });
        this.closeBtn.addEventListener('click', () => {
            this.mainContainer.style.display = 'none'
            this.stateManager.setUnfreeze();
        });
        // Add keydown event listener for the Escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.mainContainer.style.display = 'none';
                this.stateManager.setUnfreeze();
            }
        });
        this.roomImages.forEach(image => {
            image.addEventListener('click', () => {
                this.stateManager.setFreeze(true);
                const imageSrc = image.src;
                this.mainContainer.style.display = 'flex';
                this.imageWrapper.src = imageSrc;
                this.currentImageIndex = image.id.match(/\d+$/)[0];
                this.setText(this.currentImageIndex)
            })
        })
    }

    loadImage(index) {
        const imageSrc = this.roomImages[index-1].src;
        this.imageWrapper.src = imageSrc;
        this.setText(index)
    }

    showPrevImage() {
        if (this.currentImageIndex == 1) {
            this.currentImageIndex = this.lenColection + 1
          }
        this.currentImageIndex--;
        this.loadImage(this.currentImageIndex);
    }

    showNextImage() {
        if (this.currentImageIndex == this.lenColection) {
            this.currentImageIndex = 0;
        }
        this.currentImageIndex++;
        this.loadImage(this.currentImageIndex);
    }

    animateButton(button, direction) {
        button.classList.add(`click-animation-${direction}`);
        button.addEventListener('animationend', () => {
            button.classList.remove(`click-animation-${direction}`);
        }, { once: true });
    }
}
