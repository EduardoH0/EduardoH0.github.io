const room3 = document.getElementById('map-room-3'); 
const room4 = document.getElementById('map-room-4'); 
const warningRoom = document.getElementById('warning-room');
const rooms = [room3, room4];

rooms.forEach(room => {
    room.addEventListener('click', () => {
        warningRoom.classList.add('warning-room-active');
        // Remove the class after the animation finishes
        warningRoom.addEventListener('animationend', () => {
            warningRoom.classList.remove('warning-room-active');
        });
    });
});

