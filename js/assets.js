// const laneDashLineTemplate = document.getElementById('lane-dash-line-svg-template');
import { CT_CAR_CLIENT } from './constants.js';

export function create_lane(clientName) {
    // Get lane container
    const laneContainer = document.getElementById('lanes-container');

    // Create lane
    const lane = document.createElement('div');
    lane.classList.add('lane');
    lane.id = '';
    // const laneDashLineClonedSymbol = laneDashLineTemplate.content.cloneNode(true);
    // lane.appendChild(laneDashLineClonedSymbol);

    // Create car
    const car = load_car(clientName);
    car.id = `car_${clientName}`
    lane.appendChild(car);

    // Append lane
    laneContainer.appendChild(lane);

    return car
}


function load_car(clientName) {
    const car = document.createElement('div');
    car.classList.add('car');
    car.id = '';

    // Create img element
    const img = document.createElement('img');
    img.src = `/images/cars/${CT_CAR_CLIENT[clientName]}.png`;
    car.appendChild(img);

    return car
}