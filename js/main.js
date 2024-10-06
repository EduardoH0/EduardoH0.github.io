import { create_lane } from './assets.js'
import { CT_HOST_PASSWORD, CT_CAR_CLIENT, CT_RACE_STARTED } from './constants.js';
import { Server } from './server.js';
import { Client } from './client.js';


document.addEventListener('DOMContentLoaded', (event) => {
    // create_lane('a');
    // create_lane('b');
    // create_lane('c');
});


document.getElementById('password-form').addEventListener('submit', function(event) {
    // Prevent the default form submission
    event.preventDefault();
    // Get the value of the input field
    const password = document.getElementById('name').value;

    if (password === CT_HOST_PASSWORD) {
        console.log('host');
        // Hide lobby container
        document.getElementById('lobby-container').style.display = 'none';
        // Create host
        const server = new Server();

    } else {
        // Check if client password is correct, otherwise pop up alert
        if (password in CT_CAR_CLIENT) {
            console.log('client');
            // Hide lobby container
            document.getElementById('lobby-container').style.display = 'none';
            // Create new client
            const client = new Client(password);
        } else {
            alert('password incorrect, try again.')
        }
    }
});