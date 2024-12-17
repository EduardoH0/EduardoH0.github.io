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

// LOAD (waits for all images to load)
window.addEventListener('load', function() {
    var loadingDiv = document.querySelector('.loading-element');
    loadingDiv.classList.add('fade-out'); // add fade-out animation to the loading icon
    // Remove div from the DOM once the transition is finished
    loadingDiv.addEventListener('transitionend', function() {
      loadingDiv.parentNode.removeChild(loadingDiv);
    })
  });
  