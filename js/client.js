import * as constants from './constants.js';
import { create_lane, load_car_w } from './assets.js'
import { QuestionHandler } from './questionhandler.js'



export class Client {
    constructor(name) {
        // ...
        this.clientName = name;
        this.bucketUrl = constants.CT_PUBLIC_BUCKET;
        this.clientsFolder = constants.CT_CLIENTS_FOLDER;
        this.raceStarted = constants.CT_RACE_STARTED;
        this.racePaused = constants.CT_RACE_PAUSED;
        this.raceStopped = constants.CT_RACE_STOPPED;
        this.raceEnded = constants.CT_RACE_ENDED;
        this.binFiles = Object.keys(constants.CT_CAR_CLIENT);
        this.results_path = constants.CT_RESULTS_PATH;
        
        this.n_steps = constants.CT_N_STEPS;
        this.per_start = constants.CT_START;
        this.per_end = constants.CT_END;
        this.step_size = (this.per_end - this.per_start) / this.n_steps

        this.refresh_rate = constants.CT_TIME_REFRESH
        this.client_reseted = constants.CT_CLIENT_RESETED;

        this.n_players = 0;
        this.n_players_display = document.getElementById('n-players-display');
        this.n_players_display.style.display = 'none';

        // Init Client car lane
        this.progressPosition = 0;
        this.car = create_lane(this.clientName, true);
        this.car.style.left = `${this.per_start}%`;

        this.racestate = this.raceStopped;
        this.questionsLoaded = false;
        this.time_question_spam = constants.CT_TIME_QUESTION_SPAM;
        
        this.in_the_zone = false;
        this.in_the_zone_bonus = constants.CT_IN_THE_ZONE_BONUS;

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

        this.results_downloaded = false;

        this.loading_container = document.getElementById('loading-container');
        this.finish_container = document.getElementById('finish-container');
        this.finish_car = document.getElementById('finish-car');
        
        const car = load_car_w(this.clientName);
        this.finish_car.appendChild(car)
    
        // Move client car to start line
        this.updatePosition();
        // Init loop to check for other clients cars
        this.setEvents();
        // Init Questions
        this.QH = new QuestionHandler();
        this.QH.initButtons(this.correctCallback.bind(this));
        this.QH.init().then(() => {
            this.questionsLoaded=true
            this.QH.nextquestion();
        });

        document.getElementById('move-car').addEventListener('click', () => {this.move(1);})
    }

    setEvents() {
        setInterval(() => {
            // this.updateLanes();
            this.updateMyLane();
            this.checkRaceStatus();
        }, this.refresh_rate);
    }

    async checkRaceStatus() {
        const fileUrl = `${this.bucketUrl}race-status.bin`;

        try {
            const response = await fetch(fileUrl);
            if (!response.ok) throw new Error(`Failed to fetch race status`);

            // Read the binary data as an ArrayBuffer
            const arrayBuffer = await response.arrayBuffer();
            const number = this._bin2number(arrayBuffer);  // Convert binary to number
            this.handleRaceStatus(number);
        } catch (error) {
            console.error(`Error checking race status`, error);
            return null;  // Skip files with errors
        }
    }

    handleRaceStatus(raceStatus) {
        this.racestate = raceStatus;
        if (raceStatus == this.raceStarted) {
            console.log('Race Started');
            this.QH.showquiz();
            this.results_container.style.display = 'none';
            this.results_downloaded = false;
            this.loading_container.classList.remove('loading-container-active');
            this.hideMyFinish()
        }
        else if (raceStatus == this.racePaused) {
            console.log('Race Paused');
            this.results_container.style.display = 'none';
            this.results_downloaded = false;
            this.hideMyFinish()
        }
        else if (raceStatus == this.raceStopped) {
            console.log('Race Stopped');
            this.QH.hidequiz();
            this.results_container.style.display = 'none';
            this.results_downloaded = false;
            this.loading_container.classList.add('loading-container-active');
            this.hideMyFinish()
        }
        else if (raceStatus == this.raceEnded) {
            console.log('Race Ended');
            if (!this.results_downloaded) {
                // this.getResults().then(results => {
                    // this.showWinners(results.results)
                // })

                this.showMyFinish();
            }
        }
    }

    async getResults() {
        this.results_downloaded = true;
        try {
            const response = await fetch(this.results_path);
            if (!response.ok) throw new Error('Failed to fetch results');
            
            const data = await response.json();
            return data;  // Ensure you return the data
        } catch (error) {
            console.error('Error fetching results JSON:', error);
            throw error;  // Re-throw the error if you want to handle it later
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

    updatePosition() {
        const position = this._number2bin(this.progressPosition);
        fetch(`${this.clientsFolder}${this.clientName}.bin`, {
            method: 'PUT',
            body: new Int8Array(position),
            headers: { 'Content-Type': 'application/octet-stream' }
        }).then(response => {
            if (!response.ok) throw new Error('Failed storing position');
            console.log('Race started successfully');
        }).catch(error => console.error('Error storing position:', error));
    }

    updateLanes() {
        this.n_players = 0;

        this.readAllBinFiles(this.binFiles).then(results => {
            results.forEach(result => {
                console.log(`Client: ${result.fileName}, Position: ${result.number}`);

                // FOR OTHER CLIENTS (IF the client is connected)
                if ((result.fileName != this.clientName) && (result.number != this.client_reseted)) {
                    this.n_players++;
                    // CREATE LANE if it does not exits yet
                    if (!document.getElementById(`car_${result.fileName}`)) {
                        create_lane(result.fileName);
                    }
                    // UPDATE POSITION
                    const new_position = this.step_size * result.number + this.per_start;
                    document.getElementById(`car_${result.fileName}`).style.left = `${new_position}%`;
                }
                // FOR OTHER CLIENTS (IF the client has disconnected, remove on race reset)
                else if ((result.fileName != this.clientName) && (result.number === this.client_reseted)) {
                    const lane = document.getElementById(`lane_${result.fileName}`);
                    if (lane) lane.remove();
                }
                // ME
                else if (result.fileName === this.clientName) {
                    this.n_players++;
                    // IF POSITION IS RESETED, move to start line
                    if (result.number === this.client_reseted) {
                        this.car.style.left = `${this.per_start}%`;
                        this.progressPosition = 0;
                        this.in_the_zone = false;
                        this.QH.in_the_zone = false;
                        this.updatePosition();
                    }
                }
            });
            this.n_players_display.textContent = `Players ${this.n_players}`;
        })
    }

    updateMyLane() {
        this.readAllBinFiles([this.clientName]).then(results => {
            results.forEach(result => {
                if (result.fileName === this.clientName) {
                    this.n_players++;
                    // IF POSITION IS RESETED, move to start line
                    if (result.number === this.client_reseted) {
                        this.car.style.left = `${this.per_start}%`;
                        this.progressPosition = 0;
                        this.in_the_zone = false;
                        this.QH.in_the_zone = false;
                        this.updatePosition();
                    }
                }
            });
        })
    }

    showMyFinish() {
        this.finish_container.style.display = 'flex';
    }
    hideMyFinish() {
        this.finish_container.style.display = 'none';
    }

    correctCallback(isCorrect) {
        if (isCorrect) {
            let step = this.in_the_zone ? 1 + this.in_the_zone_bonus : 1;
            this.move(step);
            this.in_the_zone = true;
        } else {
            this.in_the_zone = false;
        }
        setTimeout(() => {
            this.QH.nextquestion();
        }, this.time_question_spam);
    }

    move(step) {

        this.progressPosition = this.progressPosition + step;
        const new_position = this.step_size * this.progressPosition + this.per_start;

        this.car.style.left = `${new_position}%`;
        this.updatePosition();
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
