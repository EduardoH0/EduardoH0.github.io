// const layout-check = document.getElementById('layout-check');
// const logoText = document.querySelector('.hover-logo');

// // DARK MODE
// layout-check.addEventListener('change', function() {
//   if (this.checked) {
//     logoText.style.color = 'white'; // Change to the color you desire
//   } else {
//     logoText.style.color = 'black'; // Change to the default color
//   }
// });

// // VIEWPOINT TO THE MIDDLE OF THE PAGE
// window.addEventListener('load', function() {
//     const container = document.querySelector('.home-grid');
//     const containerWidth = container.scrollWidth;
//     const containerHeight = container.scrollHeight;

//     const scrollX = (containerWidth - window.innerWidth) / 2;
//     const scrollY = (containerHeight - window.innerHeight) / 2;
//     container.style.visibility = 'visible'; // Home grid container should be not visible initially

//     container.scrollTo({left: scrollX, top: scrollY, behaviour: 'smooth'});
//   });

const buttons = document.querySelectorAll(".button");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const currentState = button.getAttribute("data-state");

    if (!currentState || currentState === "closed") {
      button.setAttribute("data-state", "opened");
      button.setAttribute("aria-expanded", "true");
    } else {
      button.setAttribute("data-state", "closed");
      button.setAttribute("aria-expanded", "false");
    }
  });
});

// VIEWPOINT TO THE MIDDLE OF THE PAGE (SMOOTHLY)
// window.addEventListener('load', function() {
document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.home-container .home-grid');
    const containerWidth = container.scrollWidth;
    const containerHeight = container.scrollHeight;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
  
    const scrollX = (containerWidth - windowWidth) / 2;
    const scrollY = (containerHeight - windowHeight) / 2;
  
    const startTime = performance.now();
    const duration = 1500; // Adjust the duration (in milliseconds)
  
    function scrollAnimation(currentTime) {
      const elapsedTime = currentTime - startTime;
      const easing = function(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // Easing function (optional)
      };
      const progress = Math.min(elapsedTime / duration, 1); // Limit the progress to 1
  
      container.scrollTo({
        top: scrollY * easing(progress),
        left: scrollX * easing(progress),
        behavior: 'auto' // Use smooth scrolling (may not work in all browsers)
      });
  
      if (elapsedTime < duration) {
        requestAnimationFrame(scrollAnimation);
      }
    }
  
    requestAnimationFrame(scrollAnimation);
  });
  


const closeBtn = document.getElementsByClassName('close')[0];
const prevBtn = document.getElementsByClassName('prev')[0];
const nextBtn = document.getElementsByClassName('next')[0];

// Get the images and set up event listeners
const images = document.querySelectorAll('.photo img');
images.forEach(image => {
  image.addEventListener('click', displayModal);
});
const zoomContainer = document.querySelector('.zoom-container');
const imgWrapper = document.getElementById('img-wrapper');
const totalImages = images.length;



let textElement;
let currentImageIndex;

// Function to display the modal with the clicked image
function displayModal(e) {
  zoomContainer.style.display = 'block';
  const clickedImage = e.target;
  imgWrapper.src = clickedImage.src;
  const altText = clickedImage.getAttribute('alt');
  textElement = document.querySelector(`.${altText}`);
  textElement.style.display = 'block';
  currentImageIndex = parseInt(clickedImage.getAttribute('data-index'));
}

// Close the modal
closeBtn.addEventListener('click', closeModal);
function closeModal() {
  zoomContainer.style.display = 'none';
  textElement.style.display = 'none';
}
  // imageText.innerHTML = altText;

  // Next and previous buttons functionality
prevBtn.addEventListener('click', showPrevImage);
nextBtn.addEventListener('click', showNextImage);

function showPrevImage() {
  if (currentImageIndex == 1) {
    currentImageIndex = totalImages + 1
  }
  currentImageIndex--;
  const prevImage = document.querySelector(`[data-index='${currentImageIndex}']`);
  imgWrapper.src = prevImage.src;

  textElement.style.display = 'none';
  const altText = prevImage.getAttribute('alt');
  textElement = document.querySelector(`.${altText}`);
  textElement.style.display = 'block';
}

function showNextImage() {
  if (currentImageIndex == totalImages) {
    currentImageIndex = 0
  }
  currentImageIndex++;
  const nextImage = document.querySelector(`[data-index='${currentImageIndex}']`);
  imgWrapper.src = nextImage.src;

  textElement.style.display = 'none';
  const altText = nextImage.getAttribute('alt');
  textElement = document.querySelector(`.${altText}`);
  textElement.style.display = 'block';
}

// Watch for changes in the layout-check checkbox
const layoutcheck = document.getElementById('layout-check');
layoutcheck.addEventListener('change', function() {
  if (this.checked) {
    // Remove the event listeners when unchecked
    images.forEach(image => {
      image.removeEventListener('click', displayModal);
    });
    closeBtn.removeEventListener('click', closeModal);
    prevBtn.removeEventListener('click', showPrevImage);
    nextBtn.removeEventListener('click', showNextImage);
    attachEventListeners(); // Attach event listeners when checked
  } else {
    // Remove the event listeners when unchecked
    images.forEach(image => {
      image.addEventListener('click', displayModal);
    });
    closeBtn.addEventListener('click', closeModal);
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);
  }
});

// // Watch for changes in the layout-check checkbox
// const layout-check = document.getElementById('layout-check');
// layout-check.addEventListener('change', function() {
//   modalActive = this.checked;
//   if (!modalActive) {
//     closeModal();
//   }
// });