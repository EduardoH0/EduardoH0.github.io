const loadingElement = document.getElementById('loading'); // Your loading element
const importantImages = document.querySelectorAll('.room-img'); // Images to wait for

let loadedImagesCount = 0;
const totalImages = importantImages.length;

// Function to check if all images are loaded
function checkAllImagesLoaded() {
    loadedImagesCount++;
    if (loadedImagesCount === totalImages) {
        // All important images are loaded
        console.log("LOADED")
    }
}

// Attach load event listeners to the images
importantImages.forEach((img) => {
    if (img.complete) {
        // Image already loaded (e.g., cached)
        checkAllImagesLoaded();
    } else {
        img.addEventListener('load', checkAllImagesLoaded);
    }
});
