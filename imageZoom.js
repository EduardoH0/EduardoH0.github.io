export function aa() {
    const roomImages = document.querySelectorAll('.room-img');
    const mainContainer = document.getElementById('a-main-container-work');
    const imageWrapper = document.getElementById('img-wrapper');
    const closeImageWrapper = document.getElementById('close-img-wrapper');

    let currentImageIndex = 0;
    let lenColection = 17;
    
    console.log(roomImages)

    roomImages.forEach(image => {
        image.addEventListener('click', function() {
            console.log(this)
            const imageSrc = this.src;
            console.log(imageSrc)
            mainContainer.style.display = 'flex';
            imageWrapper.src = imageSrc;
            // currentImageIndex = this.id.match(/\d+$/)[0];
        })
    })

    closeImageWrapper.addEventListener('click', () => {
        mainContainer.style.display = 'none';
    })
    
}
