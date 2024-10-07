// const laneDashLineTemplate = document.getElementById('lane-dash-line-svg-template');
import { CT_CAR_CLIENT } from './constants.js';

export function create_lane(clientName, mycar) {
    // Get lane container
    const laneContainer = document.getElementById('lanes-container');

    // Create lane
    const lane = document.createElement('div');
    lane.classList.add('lane');
    lane.id = `lane_${clientName}`;
    if (mycar) lane.setAttribute('data-mylane', 'true');

    // const laneDashLineClonedSymbol = laneDashLineTemplate.content.cloneNode(true);
    // lane.appendChild(laneDashLineClonedSymbol);

    // Create car
    const car = load_car(clientName);
    if (mycar) car.setAttribute('data-mycar', 'true');
    lane.appendChild(car);

    // Append lane
    laneContainer.appendChild(lane);

    return car
}


function load_car(clientName) {
    const car = document.createElement('div');
    car.classList.add('car');
    car.id = `car_${clientName}`;

    // Create img element
    const img = document.createElement('img');
    img.src = `/images/cars/${CT_CAR_CLIENT[clientName]['car']}.png`;
    car.appendChild(img);

    // Client Nickname
    const nickname = document.createElement('div');
    nickname.textContent = CT_CAR_CLIENT[clientName]['nickname'];
    nickname.classList.add('nickname');
    car.appendChild(nickname);

    return car
}

export function load_car_w(clientName) {
    const car = document.createElement('div');
    car.classList.add('car');
    // car.id = `car_${clientName}`;

    // Create img element
    const img = document.createElement('img');
    img.src = `/images/cars/${CT_CAR_CLIENT[clientName]['car']}.png`;
    car.appendChild(img);

    // Client Nickname
    const nickname = document.createElement('div');
    nickname.textContent = CT_CAR_CLIENT[clientName]['nickname'];
    nickname.classList.add('nickname');
    car.appendChild(nickname);

    return car
}