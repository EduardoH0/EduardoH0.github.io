import * as constants from './constants.js';
import { create_lane, load_car_w } from './assets.js'


export class Server {
    constructor() {
        // ...
        this.bucketUrl = constants.CT_PUBLIC_BUCKET;
        this.raceStarted = constants.CT_RACE_STARTED;
        this.racePaused = constants.CT_RACE_PAUSED;
        this.raceStopped = constants.CT_RACE_STOPPED;
        this.raceEnded = constants.CT_RACE_ENDED;

        this.binFiles = Object.keys(constants.CT_CAR_CLIENT);
        this.clientsFolder = constants.CT_CLIENTS_FOLDER;
        this.results_path = constants.CT_RESULTS_PATH;

        this.client_reseted = constants.CT_CLIENT_RESETED;
        this.refresh_rate = constants.CT_TIME_REFRESH;

        this.n_steps = constants.CT_N_STEPS;
        this.per_start = constants.CT_START;
        this.per_end = constants.CT_END;
        this.step_size = (this.per_end - this.per_start) / this.n_steps
        
        this.n_players = 0;
        this.n_players_display = document.getElementById('n-players-display');

        this.results_container = document.getElementById('winners-container');
        this.first_position = document.getElementById('first-position');
        this.second_position = document.getElementById('second-position');
        this.third_position = document.getElementById('third-position');
        this.last_position = document.getElementById('last-position');

        this.position_results = [
            this.first_position,
            this.second_position,
            this.third_position,
            this.last_position
        ];

        this.results_uploaded = false;

        this.islive = false;
        this.intervalId = null;
        this.raceStartedFlag = false;

        this.all_pos = {};
        this.binFiles.forEach(key => {this.all_pos[key] = -1});
        
        this.showHostButtons();
        // setInterval(() => {this.updateLanes();}, this.refresh_rate);
    }

    showHostButtons() {
        const hostButtonsContainer = document.getElementById('race-host-controls');
        hostButtonsContainer.style.display = 'flex';

        const startButton = document.getElementById('start-race');
        const pauseButton = document.getElementById('pause-race');
        const stopButton = document.getElementById('stop-race');
        const resetButton = document.getElementById('reset-race');
        const liveButton = document.getElementById('live-race');
        this.liveButton = liveButton;
        // Display start button
        startButton.style.display = 'block';
        // Set event listener to start race
        startButton.addEventListener('click', () => this.startRace());
        pauseButton.addEventListener('click', () => this.pauseRace());
        stopButton.addEventListener('click', () => this.stopRace());
        resetButton.addEventListener('click', () => this.resetClients());
        liveButton.addEventListener('click', () => this.liveRace());

    }

    startRace() {
        this.modifyRaceStatus(this.raceStarted);
        this.results_uploaded = false;
        this.raceStartedFlag = true;
    }
    
    pauseRace() {
        this.modifyRaceStatus(this.racePaused);
        this.raceStartedFlag = false;
    }

    stopRace() {
        this.modifyRaceStatus(this.raceStopped);
        this.results_container.style.display = 'none';
        this.raceStartedFlag = false;
    }

    endRace() {this.modifyRaceStatus(this.raceEnded);}

    resetClients() {
        const buffer = this._number2bin(this.client_reseted);
        this.updatePosition(this.binFiles, buffer);
        this.clearLanes();

        this.raceStartedFlag = false;
        this.binFiles.forEach(key => {this.all_pos[key] = -1});
    }

    liveRace() {
        if (this.islive) {
            // Stop the interval
            clearInterval(this.intervalId);
            this.intervalId = null;
            this.liveButton.textContent = "Go Live";
        } else {
            // Start the interval
            this.intervalId = setInterval(() => {
                this.updateLanes();
            }, this.refresh_rate);
            this.liveButton.textContent = "Stop Live";
        }
        this.islive = !this.islive;
    }

    clearLanes() {
        // Select all div elements with the class 'lane'
        const lanes = document.querySelectorAll('.lane');
        // Loop through the NodeList and remove each element
        lanes.forEach(lane => lane.remove());
    }

    modifyRaceStatus(raceStatus) {
        raceStatus = this._number2bin(raceStatus);
        fetch(`${this.bucketUrl}race-status.bin`, {
            method: 'PUT',
            body: new Int8Array(raceStatus),
            headers: { 'Content-Type': 'application/octet-streamplain' }
        }).then(response => {
            if (!response.ok) throw new Error('Failed to start race');
            console.log('Race status modified succesfully');
        }).catch(error => console.error('Error modifying race status:', error));
    }


    updatePosition(binFiles, position) {
        binFiles.map(async (fileName) => {
            const fileUrl = `${this.clientsFolder}${fileName}.bin`;
            fetch(fileUrl, {
                method: 'PUT',
                body: new Int8Array(position),
                headers: { 'Content-Type': 'application/octet-stream' }
            }).then(response => {
                if (!response.ok) throw new Error('Failed storing position');
                console.log('Position Reset successfully');
            }).catch(error => console.error('Error storing position:', error));
        });
    }

    updateLanes() {
        let dictPos = {};
        this.n_players = 0;
        // Filter by connected players when the game started
        const clients = this.raceStartedFlag ? this.binFiles.filter(key => this.all_pos[key] > -1) : this.binFiles;

        this.readAllBinFiles(clients).then(results => {
            results.forEach(result => {
                // console.log(`Client: ${result.fileName}, Position: ${result.number}`);

                // FOR ALL CLIENTS (IF the client is connected)
                if ((result.number != this.client_reseted)) {
                    this.n_players++;
                    // CREATE LANE if it does not exits yet
                    if (!document.getElementById(`car_${result.fileName}`)) {
                        create_lane(result.fileName);
                    }
                    // UPDATE POSITION
                    const new_position = this.step_size * result.number + this.per_start;
                    document.getElementById(`car_${result.fileName}`).style.left = `${new_position}%`;

                    // STORE POSITIONS
                    dictPos[result.fileName] = result.number;
                    this.all_pos[result.fileName] = result.number;

                } 
            });
            // CHECK FOR WINNER
            this.checkforWinner(dictPos)
            this.n_players_display.textContent = `Players ${this.n_players}`;
        })
    }

    checkforWinner(dictPos) {
        // get array of entries (key-value pairs)
        let entries = Object.entries(dictPos);
        // sort entries by values in descending order
        entries.sort((a, b) => b[1] - a[1]);
        
        // WE HAVE A WINNER
        if (Object.keys(dictPos).length != 0 && entries[0][1] >= this.n_steps) {

            let numWinners = Math.min(3, entries.length);
            // get largest 3 values and their corresponding keys
            let largestThreeEntries = entries.slice(0, numWinners);

            // Extract keys and values for the largest 3
            let largestThreeKeys = largestThreeEntries.map(entry => entry[0]);
            let largestThreeValues = largestThreeEntries.map(entry => entry[1]);

            // Get last
            let minEntry = entries[entries.length - 1];
            let minKey = minEntry[0];
            let minValue = minEntry[1];

            console.log("Largest 3 keys:", largestThreeKeys);
            console.log("Largest 3 values:", largestThreeValues);
            console.log("Minimum key:", minKey);
            console.log("Minimum value:", minValue);

            this.showWinners([...largestThreeKeys, minKey])
            if (!this.results_uploaded) {
                console.log('Uploading Results')
                this.uploadResults([...largestThreeKeys, minKey]).then(() =>{
                    this.endRace();
                })
            }
        }
    }

    showWinners(results) {
        this.results_container.style.display = 'flex';
        this.position_results.forEach(position => {
            const elem2del = position.querySelector('.car');
            if (elem2del) elem2del.remove();
        });
        
        results.forEach((key_client, index) => {
            const car = load_car_w(key_client);
            this.position_results[index].appendChild(car)
        })
    }

    async uploadResults(results) {
        // Create the JSON object
        const resultsJson = JSON.stringify({ results });
        // Upload the JSON to the S3 bucket
        fetch(this.results_path, {
            method: 'PUT',
            body: resultsJson,
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            if (!response.ok) throw new Error('Failed to upload results');
            console.log('Results uploaded successfully');
            this.results_uploaded = true;
            return;
        }).catch(error => {
            console.error('Error uploading results:', error)
            return;
        });
    }

    // Fetch and read all .bin files in the folder
    async readAllBinFiles(binFiles) {
        const filePromises = binFiles.map(async (fileName) => {
            const fileUrl = `${this.clientsFolder}${fileName}.bin`;
            try {
                const response = await fetch(fileUrl);
                if (!response.ok) throw new Error(`Failed to fetch ${fileName}`);

                // Read the binary data as an ArrayBuffer
                const arrayBuffer = await response.arrayBuffer();
                const number = this._bin2number(arrayBuffer);  // Convert binary to number
                return { fileName, number };  // Return the file name and the number
            } catch (error) {
                console.error(`Error reading file ${fileName}:`, error);
                return null;  // Skip files with errors
            }
        });

        // Wait for all files to be processed
        const results = await Promise.all(filePromises);
        return results.filter(result => result !== null);  // Remove any failed files
    }

    _number2bin(number) {
        const buffer = new ArrayBuffer(1);  // Create a 1-byte buffer
        const view = new DataView(buffer);
        view.setInt8(0, number);  // Use 1 byte to store the number 30
        return buffer
    }

    _bin2number(buffer) {
        const view = new DataView(buffer);
        return view.getInt8(0);  // Read 1 byte as a number (assuming 1-byte integers)
    }

}