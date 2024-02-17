const heightTracks = '100px'
const waveColors = ['#0099ff', '#00ccff', '#1eebd1', '#00ff99', '#66ff33']
const volumeColors = ['#80ccff', '#aaffff', '#c6f6ff', '#80ffff', '#ccffcc']
const trackBackgroundColors = ['#0066cc', '#0099cc', '#00cdb3', '#00cc66', '#33cc19']

// BUTTONS ANIMATIONS
const buttons = document.querySelectorAll(".button");

buttons.forEach((button) => {
    button.addEventListener("click", () => {
        const currentState = button.getAttribute("data-state");
        console.log('data-state')

        if (!currentState || currentState === "closed") {
        button.setAttribute("data-state", "opened");
        button.setAttribute("aria-expanded", "true");
        } else {
        button.setAttribute("data-state", "closed");
        button.setAttribute("aria-expanded", "false");
        }
    });
});

const dynamicMusicStems = [
    { url: 'music/INeedYouRemastered2009_320kbps-vocals.mp3'},
    { url: 'music/INeedYouRemastered2009_320kbps-other.mp3'},
    { url: 'music/INeedYouRemastered2009_320kbps-drums.mp3'},
    // { url: '../music/INeedYouRemastered2009_320kbps-drums.mp3'},
    { url: 'music/INeedYouRemastered2009_320kbps-bass.mp3'},
];
  
// Create an array to hold the track objects
const tracks = dynamicMusicStems.map((stem, index) => {
    console.log('Index:', index); // Log the index
    return {
        id: index,
        draggable: false,
        url: stem.url,
        options: {
            waveColor: waveColors[index],
            progressColor: '#FFFFFF',
        },
    };
});
  
// Create the multitrack mixer dynamically
const multitrack = Multitrack.create(
    tracks,
    {
        container: document.querySelector('#container'),
        minPxPerSec: 10,
        rightButtonDrag: false,
        cursorWidth: 2,
        cursorColor: '#FFFFFF',
        trackBackground: '#00000000',
        trackBorderColor: '#00000000',
        dragBounds: true,
        heightContainer: heightTracks,
    }
);

  
multitrack.containers.slice(0, -1).forEach((container, index) => {
    container.style.background = trackBackgroundColors[index]
    container.id = `trackContainer-${index}`; // Generate unique IDs

    const columnControlsContainer = document.getElementById('column-controls')

    const trackControls = document.createElement('div');
    trackControls.classList.add('trackControls');

    const trackName = document.createElement('label')
    trackName.textContent = "Instrumental"
    trackName.setAttribute("for", 'trackVolume');


    // Create the input element
    const trackVolume = document.createElement('input');
    trackVolume.classList.add('trackVolume');

    // Set its attributes
    trackVolume.type = 'range';
    trackVolume.id = `${index}`;  // add index 0, 1... as track ID
    trackVolume.min = 0;
    trackVolume.max = 100;
    trackVolume.value = 50;
    setVolume.call(trackVolume) // init volume
    trackVolume.addEventListener('input', setVolume);



    trackControls.appendChild(trackName)
    trackControls.appendChild(trackVolume)
    columnControlsContainer.appendChild(trackControls)


})

// SET VOLUME
function setVolume() {
    const value = this.value
    const index = this.id
    const gradientString = `linear-gradient(to right, ${trackBackgroundColors[index]} 0%, ${trackBackgroundColors[index]} ${value}%, ${volumeColors[index]} ${value}%, ${volumeColors[index]} 100%)`;
    // Update colours and volume
    this.style.setProperty('--range-background', gradientString);
    multitrack.setTrackVolume(index, value/100)  // Args: index [0, number_tracks], volume
}
  
  
// Mute button functionality
const muteButton = document.querySelector('#mute');
muteButton.onclick = () => {
    console.log('mute')
    multitrack.setTrackVolume(0, 0); // Mute the first stem
};
  
// Events, play/pause button, etc., can be handled similarly as before
// You can add event listeners, controls, and other functionality dynamically based on your requirements

// Events
multitrack.on('start-position-change', ({ id, startPosition }) => {
    console.log(`Track ${id} start position updated to ${startPosition}`);
});

multitrack.on('start-cue-change', ({ id, startCue }) => {
    console.log(`Track ${id} start cue updated to ${startCue}`);
});

multitrack.on('end-cue-change', ({ id, endCue }) => {
    console.log(`Track ${id} end cue updated to ${endCue}`);
});

multitrack.on('volume-change', ({ id, volume }) => {
    console.log(`Track ${id} volume updated to ${volume}`);
});

multitrack.on('fade-in-change', ({ id, fadeInEnd }) => {
    console.log(`Track ${id} fade-in updated to ${fadeInEnd}`);
});

multitrack.on('fade-out-change', ({ id, fadeOutStart }) => {
    console.log(`Track ${id} fade-out updated to ${fadeOutStart}`);
});

multitrack.on('intro-end-change', ({ id, endTime }) => {
    console.log(`Track ${id} intro end updated to ${endTime}`);
});

multitrack.on('envelope-points-change', ({ id, points }) => {
    console.log(`Track ${id} envelope points updated to`, points);
});

multitrack.on('drop', ({ id }) => {
    multitrack.addTrack({
        id,
        url: 'music/INeedYouRemastered2009_320kbps-other.mp3',
        startPosition: 0,
        draggable: true,
        options: {
        waveColor: 'hsl(25, 87%, 49%)',
        progressColor: 'hsl(25, 87%, 20%)',
        },
    });
});

// Play/pause button
const button = document.querySelector('#play');
button.disabled = true;
multitrack.once('canplay', () => {
    button.disabled = false;
    button.onclick = () => {
        multitrack.isPlaying() ? multitrack.pause() : multitrack.play();
        button.textContent = multitrack.isPlaying() ? 'Pause' : 'Play';
    };
});

// Forward/back buttons
const forward = document.querySelector('#forward');
forward.onclick = () => {
    multitrack.setTime(multitrack.getCurrentTime() + 30);
};
const backward = document.querySelector('#backward');
backward.onclick = () => {
    multitrack.setTime(multitrack.getCurrentTime() - 30);
};

// // Zoom
// const slider = document.querySelector('input[type="range"]');
// slider.oninput = () => {
//     multitrack.zoom(slider.valueAsNumber);
// };

// Destroy all wavesurfer instances on unmount
window.onbeforeunload = () => {
    multitrack.destroy();
};





// // Set sinkId
// multitrack.once('canplay', async () => {
//     await multitrack.setSinkId('default');
//     console.log('Set sinkId to default');
// });



// Create an audio context
const audioContext = new AudioContext();

multitrack.wavesurfers.map((ws) => {
    console.log('hey')
    const source = audioContext.createMediaElementSource(ws.backend.source);
    source.connect(audioContext.destination);
})







let isVisible = true;
const togglecolumn = document.getElementById('toggle-column')
const columndiv = document.getElementById('column-controls')
const containersurfer = document.getElementById('container')

function togglecolumnvisibility() {
    isVisible = !isVisible; // Flip visibility state
    console.log(isVisible)
    columndiv.classList.toggle('hide'); // Hide/Expand column-controls
    containersurfer.classList.toggle('expand') // Remove/Add left margin on container
}

togglecolumn.addEventListener('click', togglecolumnvisibility);


