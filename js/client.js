import * as constants from './constants.js';
import { create_lane } from './assets.js'



export class Client {
    constructor(name) {
        // ...
        this.clientName = name;
        this.bucketUrl = constants.CT_PUBLIC_BUCKET;
        this.clientsFolder = constants.CT_CLIENTS_FOLDER;
        this.raceStarted = constants.CT_RACE_STARTED;
        this.racePaused = constants.CT_RACE_PAUSED;
        this.raceStopped = constants.CT_RACE_STOPPED;
        this.binFiles = constants.CT_BIN_FILES;
        
        this.n_steps = constants.CT_N_STEPS;
        this.per_start = constants.CT_START;
        this.per_end = constants.CT_END;

        this.progressPosition = 0;
        this.car = create_lane(this.clientName);

        this.updatePosition();
        // this.updateLanes();
        this.createAllLanes();
        // this.updateLanes();
        this.checkRaceStatus();


        document.getElementById('move-car').addEventListener('click', () => {this.move(1);})
    }

    checkRaceStatus() {

        setInterval(() => {
            this.updateLanes();
        }, 1000);

        // setInterval(() => {
        //     fetch(`${this.bucketUrl}race-status.txt`)
        //         .then(response => response.text())
        //         .then(data => {
        //             if (data.trim() === this.raceStarted) {
        //                 console.log('Race has started!');
        //                 this.updateLanes();
        //             }
        //         })
        //         .catch(error => console.error('Error checking race status:', error));
        // }, 1000);
    }

    updatePosition() {
        const position = this._number2bin(this.progressPosition);
        fetch(`${this.clientsFolder}${this.clientName}.bin`, {
            method: 'PUT',
            body: new Uint8Array(position),
            headers: { 'Content-Type': 'application/octet-stream' }
        }).then(response => {
            if (!response.ok) throw new Error('Failed storing position');
            console.log('Race started successfully');
        }).catch(error => console.error('Error storing position:', error));
    }

    createAllLanes() {
        this.readAllBinFiles(this.binFiles).then(results => {
            results.forEach(result => {
                console.log(`Client: ${result.fileName}, Position: ${result.number}`);
                if (result.fileName != this.clientName) {
                    if (!document.getElementById(`car_${result.fileName}`)) {
                        create_lane(result.fileName);
                    }
                }
            });
        })
    }

    updateLanes() {
        this.readAllBinFiles(this.binFiles).then(results => {
            results.forEach(result => {
                console.log(`Client: ${result.fileName}, Position: ${result.number}`);
                if (result.fileName != this.clientName) {
                    const step_size = (this.per_end - this.per_start) / this.n_steps;
                    const new_position = step_size * result.number + this.per_start;
                    document.getElementById(`car_${result.fileName}`).style.left = `${new_position}%`;
                }

            });
        })
    }

    move(step) {

        this.progressPosition = this.progressPosition + step;
        const step_size = (this.per_end - this.per_start) / this.n_steps
        const new_position = step_size * this.progressPosition + this.per_start;

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
        view.setUint8(0, number);  // Use 1 byte to store the number 30
        return buffer
    }

    _bin2number(buffer) {
        const view = new DataView(buffer);
        return view.getUint8(0);  // Read 1 byte as a number (assuming 1-byte integers)
    }

}
