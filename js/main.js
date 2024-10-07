import { create_lane, load_car_w } from './assets.js'
import { CT_HOST_PASSWORD, CT_CAR_CLIENT, CT_RACE_STARTED, CT_PUBLIC_KEY } from './constants.js';
import { Server } from './server.js';
import { Client } from './client.js';
import { generateKeyPair, signData, verifyData } from './keys.js';
import { QuestionHandler } from './questionhandler.js'


document.addEventListener('DOMContentLoaded', (event) => {

    console.log(localStorage.getItem('welcome-done'))
    if (!localStorage.getItem('welcome-done')) {
        document.getElementById('welcome-password-form').addEventListener('submit', function(event) {
            // Prevent the default form submission
            event.preventDefault();
            // Get the value of the input field
            const password = document.getElementById('welcome-name').value;
    
            (async () => {
                const isKeyValid = await checkKey(password);
                if (isKeyValid) {
                    localStorage.setItem('welcome-done', 'true');
                    endWelcome();
                } else {
                    alert('Key not valid.')
                }
            })();
        })
    } else {
        document.getElementById('welcome-container').style.display = 'none';
    }

});

function endWelcome() {
    document.querySelectorAll('.welcome-response').forEach(element => {
        element.style.display = 'block';
    });
    setTimeout(() => {
        document.getElementById('welcome-container').style.display = 'none';
    }, 8000);
}

async function checkKey(privateKeyBase64) {
    const publicKeyBase64 = CT_PUBLIC_KEY;

    // Simulate the client inputting their private key and the server verifying it
    const data = "Sample data to verify";
    try {
        const signatureBase64 = await signData(privateKeyBase64, data);
        const isValid = await verifyData(publicKeyBase64, data, signatureBase64);
        console.log("Key is valid:", isValid);
        return isValid; // Return the validity result
    } catch (error) {
        console.error(`The Key is not valid:`, error);
        return false; // Return false if there's an error
    }
}

document.getElementById('password-form').addEventListener('submit', function(event) {
    // Prevent the default form submission
    event.preventDefault();
    // Get the value of the input field
    const password = document.getElementById('lobby-name').value;

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