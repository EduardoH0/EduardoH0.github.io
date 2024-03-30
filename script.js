const box = document.getElementById('home-grid');
let isDown = false;
let startX;
let startY;
let scrollLeft;
let scrollTop;
let mousemove = false;

box.addEventListener('mousedown', (e) => {
  isDown = true;
  startX = e.pageX - box.offsetLeft;
  startY = e.pageY - box.offsetTop;
  scrollLeft = box.scrollLeft;
  scrollTop = box.scrollTop;
  // box.style.cursor = 'grabbing';
  mousemove = false
});

box.addEventListener('mouseleave', () => {
  isDown = false;
  // box.style.cursor = 'grab';
});

box.addEventListener('mouseup', () => {
  isDown = false;
  // box.style.cursor = 'grab';
});

document.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - box.offsetLeft;
  const y = e.pageY - box.offsetTop;
  const walkX = (x - startX) * 1; // Change this number to adjust the scroll speed
  const walkY = (y - startY) * 1; // Change this number to adjust the scroll speed
  box.scrollLeft = scrollLeft - walkX;
  box.scrollTop = scrollTop - walkY;
  mousemove = true
});

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

// DOM LOADED (does not wait for images to load)
document.addEventListener('DOMContentLoaded', function() {
  centerGrid(); // center Grid to the middle of the window
});

// LOAD (waits for all images to load)
window.addEventListener('load', function() {
  var loadingDiv = document.querySelector('.loading-element');
  loadingDiv.classList.add('fade-out'); // add fade-out animation to the loading icon
  // Remove div from the DOM once the transition is finished
  loadingDiv.addEventListener('transitionend', function() {
    loadingDiv.parentNode.removeChild(loadingDiv);
  })
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
  if (mousemove==false){
    zoomContainer.style.display = 'block';
    const clickedImage = e.target;
    imgWrapper.src = clickedImage.src;
    const altText = clickedImage.getAttribute('alt');
    textElement = document.querySelector(`.${altText}`);
    textElement.style.display = 'block';
    currentImageIndex = parseInt(clickedImage.getAttribute('data-index'));
  }
}

// Close the modal
closeBtn.addEventListener('click', closeModal);
function closeModal() {
  zoomContainer.style.display = 'none';
  textElement.style.display = 'none';
}

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
  } else {
    // Center grid to the middle of the window
    centerGrid();
    // Attach the event listeners when checked
    images.forEach(image => {
      image.addEventListener('click', displayModal);
    });
    closeBtn.addEventListener('click', closeModal);
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);
  }
});

// Center Grid to the middle of the window
function centerGrid() {
  var scrollableDiv = document.querySelector('.home-container .home-grid');
  scrollableDiv.scrollLeft = (scrollableDiv.scrollWidth - scrollableDiv.clientWidth) / 2; // Center horizontally
  scrollableDiv.scrollTop = (scrollableDiv.scrollHeight - scrollableDiv.clientHeight) / 2; // Center vertically
}
