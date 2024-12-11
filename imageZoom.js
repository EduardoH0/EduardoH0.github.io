export class WorkZoom {
    constructor(workPath) {
        
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

        this.setupEventListeners();
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
        this.closeBtn.addEventListener('click', () => {this.mainContainer.style.display = 'none'});
        this.roomImages.forEach(image => {
            image.addEventListener('click', () => {
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
