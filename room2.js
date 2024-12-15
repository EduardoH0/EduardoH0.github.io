import { AnimationController } from './animationController.js';
import { WorkZoom } from './imageZoom.js';
import { StateManager } from './stateManager.js';

const scene = document.getElementById('scene');
const mapPosition = document.getElementById('map-position-2');

let room = [20, 19, 9, 10, 11, 9];
let cumulativeRoom = [];
let offset = 2
let sum = 0;
let initZoom = 2.25

for (let num of room) {
    sum += num - offset;
    cumulativeRoom.push(sum)
}

let offMapX = 10;
let offMapY = 15;

function forwardTransformations(currentWalk, cumulativeRoom) {
    return [
        `translateX(${currentWalk - (offset/2)}em)`,
        `rotateY(90deg) translateZ(${currentWalk + cumulativeRoom[0] - initZoom - (offset/2)}em) translateX(${-room[0] - initZoom}em)`,
        `rotateY(180deg) translateZ(${-room[1] - initZoom*2}em) translateX(${-currentWalk - cumulativeRoom[1] - room[0] + (offset/2)}em)`,
        `rotateY(270deg) translateZ(${-currentWalk - cumulativeRoom[2] - room[1] - initZoom + (offset/2)}em) translateX(${initZoom - (room[0] - room[2])}em)`,
        `rotateY(180deg) translateZ(${-(room[1] - room[3]) - initZoom*2}em) translateX(${-currentWalk - cumulativeRoom[3] - room[4] + (offset/2)}em)`,
        `rotateY(270deg) translateZ(${-currentWalk - cumulativeRoom[4] - room[1] + room[3] - initZoom + (offset/2)}em) translateX(${initZoom}em)`,
    ];
}

function forwardMap(cw, cr) {
    let c1 = [offMapX, offMapY];
    let c2 = [offMapX, 60];
    let c3 = [50, 60];
    let c4 = [50, 50];
    let c5 = [23, 50];
    let c6 = [23, offMapY];

    return [
        `auto auto ${-(cw / cr[0]) * c2[1] + c1[1]}% ${c1[0]}%`,
        `auto auto ${c2[1] + c1[1]}% ${(((-cw - cr[0])/(cr[1] - cr[0])) * c3[0]) + c1[0]}%`,
        `auto auto ${(c4[1] - c3[1]) * (((-cw - cr[1])/(cr[2] - cr[1]))) + c1[1] + c2[1]}% ${c1[0] + c3[0]}%`,
        `auto auto ${c1[1] + c4[1]}% ${((c5[0] - c4[0]) * ((-cw - cr[2])/(cr[3] - cr[2]))) + c1[0] + c3[0]}%`,
        `auto auto ${(c5[1] + c1[1] - 25) * (1 - ((-cw - cr[3])/(cr[4] - cr[3]))) + c1[1]}% ${c6[0]}%`,
        `auto auto ${c1[1]}% ${((c6[0] - c1[0]) * (1 - ((-cw - cr[4])/(cr[5] - cr[4])))) + c1[0]}%`
    ]
}

const stateManager = new StateManager();

const animationController = new AnimationController(scene, mapPosition, stateManager, {
    room: room,
    cumulativeRoom: cumulativeRoom,
    forwardTransformations: forwardTransformations,
    forwardMap: forwardMap,
});

const workData = "images/room2/roomdatabase.json"
const workZoom = new WorkZoom(workData, stateManager);