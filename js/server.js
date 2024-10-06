import * as constants from './constants.js';


export class Server {
    constructor() {
        // ...
        this.bucketUrl = constants.CT_PUBLIC_BUCKET;
        this.raceStarted = constants.CT_RACE_STARTED;
        this.racePaused = constants.CT_RACE_PAUSED;
        this.raceStopped = constants.CT_RACE_STOPPED;

        this.showHostButtons();
    }

    showHostButtons() {
        const hostButtonsContainer = document.getElementById('race-host-controls');
        hostButtonsContainer.style.display = 'flex';

        const startButton = document.getElementById('start-race');
        const pauseButton = document.getElementById('pause-race');
        const stopButton = document.getElementById('stop-race');
        // Display start button
        startButton.style.display = 'block';
        // Set event listener to start race
        startButton.addEventListener('click', () => this.startRace());
        pauseButton.addEventListener('click', () => this.pauseRace());
        stopButton.addEventListener('click', () => this.stopRace());

    }

    startRace() {this.modifyRaceStatus(this.raceStarted);}
    
    pauseRace() {this.modifyRaceStatus(this.racePaused);}

    stopRace() {this.modifyRaceStatus(this.raceStopped);}

    modifyRaceStatus(raceStatus) {
        const blob = new Blob([raceStatus], { type: 'text/plain' });
        fetch(`${this.bucketUrl}race-status.txt`, {
            method: 'PUT',
            body: blob,
            headers: { 'Content-Type': 'text/plain' }
        }).then(response => {
            if (!response.ok) throw new Error('Failed to start race');
            console.log('Race started successfully');
        }).catch(error => console.error('Error starting race:', error));
    }

    updateEvents() {

    }

}