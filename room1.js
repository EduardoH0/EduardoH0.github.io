import { AnimationController } from './animationController.js';
import { WorkZoom } from './imageZoom.js';
import { StateManager } from './stateManager.js';

const scene = document.getElementById('scene');
const mapPosition = document.getElementById('map-position');

let room = [13, 10, 8.5 + 1, 15, 18.5];
let cumulativeRoom = [];
let offset = 2
let sum = 0;
let initZoom = 2.25

for (let num of room) {
    sum += num - offset;
    cumulativeRoom.push(sum)
}

let offMapX = 13;
let offMapY = 15;

function forwardTransformations(currentWalk, cumulativeRoom) {
    return [
        `translateX(${currentWalk - (offset/2)}em)`,
        `rotateY(90deg) translateZ(${currentWalk + cumulativeRoom[0] - initZoom - (offset/2)}em) translateX(${-room[0] - initZoom}em)`,
        `rotateY(90deg) translateZ(${currentWalk + cumulativeRoom[0] - initZoom - (offset/2)}em) translateX(${-room[0] - initZoom - 2}em)`,
        `rotateY(180deg) translateZ(${-room[4] - initZoom*2}em) translateX(${-currentWalk - cumulativeRoom[2] - room[0] - 2 + (offset/2)}em)`,
        `rotateY(270deg) translateZ(${-currentWalk - cumulativeRoom[3] - room[4] - initZoom + (offset/2)}em) translateX(${initZoom}em)`,
    ];
}

function forwardMap(cw, cr) {
    let c1 = [offMapX, offMapY];
    let c2 = [offMapX, 42];
    let c3 = [30, 42];
    let c4 = [33, 54];
    return [
        `auto auto ${-(cw / cr[0]) * c2[1] + c1[1]}% ${c1[0]}%`,
        `auto auto ${c2[1] + c1[1]}% ${(((-cw - cr[0])/(cr[1] - cr[0])) * c3[0]) + c1[0]}%`,
        `auto auto ${Math.min(c2[1] + c1[1] + (((-cw - cr[1])/(cr[2] - cr[1])) * 30), c4[1] + c1[1])}% ${(((-cw - cr[1])/(cr[2] - cr[1])) * c4[0]) + c1[0] + c3[0]}%`,
        `auto auto ${(c4[1]) * (1 - ((-cw - cr[2])/(cr[3] - cr[2]))) + c1[1]}% ${c4[0] + c1[0] + c3[0]}%`,
        `auto auto ${c1[1]}% ${((c4[0] + c3[0]) * (1 - ((-cw - cr[3])/(cr[4] - cr[3])))) + c1[0]}%`
    ]
}

const stateManager = new StateManager();

const animationController = new AnimationController(scene, mapPosition, stateManager, {
    room: room,
    cumulativeRoom: cumulativeRoom,
    forwardTransformations: forwardTransformations,
    forwardMap: forwardMap,
});

const workData = "images/room1/room1database.json"
const workZoom = new WorkZoom(workData, stateManager);