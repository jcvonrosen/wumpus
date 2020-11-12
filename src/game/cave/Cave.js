import Room from './Room.js';

import Bat from './hazards/Bat.js';
import Pit from './hazards/Pit.js';
import Wumpus from './hazards/Wumpus.js';

import utilities from '../utilities.js';

const ROOMCOUNT = 20;
const BATCOUNT = 2;
const PITCOUNT = 2;
const WUMPUSCOUNT = 1;

const _rooms = {};
let _currentRoom = 1;

const createRooms = () => {
    for(let x = 1; x <= ROOMCOUNT; x++){
        _rooms[x] = new Room(x);
    }
}

const setExits = () => {
    for(let roomNumber = 0; roomNumber < ROOMCOUNT; roomNumber++){
        for(let exitNumber = 0; exitNumber < exits[roomNumber].length; exitNumber++){
            const exitTo = exits[roomNumber][exitNumber];
            _rooms[roomNumber+1].Exits.push(_rooms[exitTo]);
        }
    }
}

const getHazardRoom = (hazard) => {
    for(let roomNumber = 1; roomNumber <= ROOMCOUNT; roomNumber++){
        if(_rooms[roomNumber].Hazards.some(h => h == hazard)){
            return _rooms[roomNumber];
        }
    }

    // This hazard doesn't have a room?
    return null;
}

const setHazards = async () => {
    const promises = [];
    // set bats
    for (let batNumber = 1; batNumber <= BATCOUNT; batNumber++)
    {
        var bat = new Bat();
        var batRoom = _rooms[getRandomRoom()];
        batRoom.Hazards.push(bat);
        promises.push(bat.Init());
    }

    // set pits
    for (let pitNumber = 1; pitNumber <= PITCOUNT; pitNumber++)
    {
        var pit = new Pit();
        var pitRoom = _rooms[getRandomRoom()];
        pitRoom.Hazards.push(pit);
        promises.push(pit.Init());
    }

    // set the Wumpus(s)
    for (let wumpusNumber = 1; wumpusNumber <= WUMPUSCOUNT; wumpusNumber++)
    {
        var wumpus = new Wumpus();
        var wumpusRoom = _rooms[getRandomRoom()];
        wumpusRoom.Hazards.push(wumpus);
        promises.push(wumpus.Init());
    }

    await Promise.all(promises);
}

const getRandomRoom = (empty) => {
    empty = empty !== false;
    // Note that if we wanted an empty room and there are none, infinite loop
    // ToDo: check for an empty room
    
    // eslint-disable-next-line no-constant-condition
    while(true){
        const roomNumber = utilities.Random(1, ROOMCOUNT);
        if(!empty || _rooms[roomNumber].Hazards.length == 0){
            return roomNumber;
        }
    }
}

class Cave {
    constructor(){
    }

    Init = async () => {
        createRooms();
        setExits();
        await setHazards();
    }

    get CurrentRoom() {
        return _rooms[_currentRoom];
    }

    GetRoom = (roomNumber) => {
        return _rooms[roomNumber];
    }

    MovePlayer = (roomNumber, empty) => {
        roomNumber = roomNumber || 0;
        empty = empty !== false;

        // no room specified, get a random room
        if(roomNumber == 0){
            _currentRoom = getRandomRoom(empty);
        } else {
            _currentRoom = roomNumber;
        }
    }

    MoveHazard = (hazard, useExit) => {
        const hazardRoom = getHazardRoom(hazard);
        let newRoom = {};
        if(useExit){
            // There must be an empty room at an exit, since the player came from an empty room
            const openExits = hazardRoom.Exits.filter(r => r.Hazards.length == 0);
            if(openExits.length > 0){
                const exitNumber = utilities.Random(0, openExits.length-1);
                newRoom = openExits[exitNumber];
            } else {
                // This should never happen, but if there's no open room, go anywhere else
                newRoom = _rooms[getRandomRoom(true)];
            }
        } else {
            newRoom = _rooms[getRandomRoom(true)];
        }

        if(hazardRoom){
            const hazardNumber = hazardRoom.Hazards.indexOf(hazard);
            hazardRoom.Hazards.splice(hazardNumber, 1);
        }

        newRoom.Hazards.push(hazard);
    }
}

// ToDo: move to its own file?
// Taken from the original DATA statements, this is a 20x3 array with the 
// three room exits for each room.
const exits =
[
    [ 2, 5, 8, ],
    [ 1, 3,10, ],
    [ 2, 4,12, ],
    [ 3, 5,14, ],
    [ 1, 4, 6, ],
    [ 5, 7,15, ],
    [ 6, 8,17, ],
    [ 1, 7, 9, ],
    [ 8,10,18, ],
    [ 2, 9,11, ],
    [ 10,12,19, ],
    [ 3,11,13, ],
    [ 12,14,20, ],
    [ 4,13,15, ],
    [ 6,14,16, ],
    [ 15,17,20, ],
    [ 7,16,18, ],
    [ 9,17,19, ],
    [ 11,18,20, ],
    [ 13,16,19 ],
];

export default Cave;