const prevBtn = document.getElementsByClassName('prev')[0];
const nextBtn = document.getElementsByClassName('next')[0];
// const totalImages = images.length;
const imgWrapper = document.getElementById('img-wrapper');
const textWrapper = document.getElementById('main-sub-container-text');
const folderPath = `images-light`

let numberColections = 2
let currentColection = 0;
let workColection = ['', 'p'];
let currentImageIndex = [1, 1];
let lenColection = [16, 8];




// Next and previous buttons functionality
prevBtn.addEventListener('click', showPrevImage);
nextBtn.addEventListener('click', showNextImage);

document.addEventListener("DOMContentLoaded", function() {
  loadImage(1);

  const animButton = document.querySelector('.toggle-colection');
  animButton.addEventListener('click', () => {
    currentColection = ((currentColection + 1) % numberColections);

    imgWrapper.classList.toggle('image-transition');
    setTimeout(() => {
        loadImage(currentImageIndex[currentColection])
        .then(() => {
          imgWrapper.classList.toggle('image-transition');
        })
    }, 600);
  })
})

async function loadImage(index) {
    // Load image to the container
    const img = new Image();
    img.src = folderPath + `/${index}${workColection[currentColection]}.jpg`
    await img.decode(); // wait for the image to be loaded
    imgWrapper.src = img.src

    // Load text to the container
    fetchTextContent(index);
}

function showPrevImage() {
  if (currentImageIndex[currentColection] == 1) {
    currentImageIndex[currentColection] = lenColection[currentColection] + 1
  }
  currentImageIndex[currentColection]--;
  loadImage(currentImageIndex[currentColection]);
}

function showNextImage() {
  if (currentImageIndex[currentColection] == lenColection[currentColection]) {
    currentImageIndex[currentColection] = 0
  }
  currentImageIndex[currentColection]++;
  loadImage(currentImageIndex[currentColection]);

}

// Function to fetch text content based on index
function fetchTextContent(index) {
    fetch('obradatabase.json')
        .then(response => response.json())
        .then(data => {
            const content = data[`${index}${workColection[currentColection]}`];
            const a = `<p><b>${content.artist}</b></p>
                                        <p><i>${content.title}</i>, ${content.year}</p>
                                        <p>${content.medium}</p>
                                        <p>${content.dimensions}</p>`;
            textWrapper.innerHTML = a;
        })
        .catch(error => console.error('Error fetching text content:', error));
}