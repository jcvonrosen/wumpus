import {ActorsEnum, GameStatusEnum} from './enums.js';
import resources from './resources.js';
import utilities from './utilities.js';
import Cave from './cave/Cave.js';

let _write = () => {console.error('Game _write function undefined.')};
let _prompt = () => {console.error('Game _prompt function undefined.')};

const _cave = new Cave();
const _continue = {
    Status: GameStatusEnum.Continue,
};

const gameLoop = async (cave) => {
    let actionResult = {};

    do {
        // check the hazards
        actionResult = await checkHazards(cave);

        if(actionResult.Status == GameStatusEnum.Continue){
            await showRoom(cave.CurrentRoom);

            // Get the player's action
            actionResult = await getPlayerAction(cave)
            if(actionResult.Message){
                _write(actionResult.Message);
            }

        }
    } while(actionResult.Status == GameStatusEnum.Continue)

    // game over
    await gameOver(actionResult);
}

const gameOver = async (actionResult) => {
    const [winText, loseText] = await resources.getResources('Win', 'Lose');
    switch(actionResult.Status){
        case GameStatusEnum.Win:{
            _write(winText);
            break;
        }
        case GameStatusEnum.Lose:{
            _write(loseText);
            break;
        }
    }
}

const checkHazards = async (cave) => {
    if(cave.CurrentRoom.Hazards.length > 0){

        const hazard = cave.CurrentRoom.Hazards[0];
        _write(hazard.HazardText);
        return await hazard.HazardAction(cave);
    }

    return { Status: GameStatusEnum.Continue };
}

const showRoom = async (room) => {
    _write(' ');

    showHazards(room);

    const getLocation = resources.getResource('Location');
    const getExits = resources.getResource('Exits');

    const [locationTemplate, exitTemplate] = await Promise.all([getLocation, getExits]);

    const locationText = locationTemplate.replace('{0}', room.RoomNumber);
    const exitList = room.Exits.map(exit => exit.RoomNumber);
    const exitText = exitTemplate.concat(exitList.join('  '));

    _write(locationText);
    _write(exitText);

    _write(' ');
}

const showHazards = (room) => {
    room.Exits.forEach(exit => {
        exit.Hazards.forEach(hazard => {
            _write(hazard.WarningText);
        });
    });
}

const getPlayerAction = async (cave) => {
    const turnActionText = await resources.getResource("TurnActions");
    const action = await _prompt(
        turnActionText, 
        (input) => {
            return ['S','M'].includes(input.toUpperCase());
        });
    
    switch(action){
        case 'S':
        {
            return await actionShoot(cave);
        }
        case 'M':
        {
            return await actionMove(cave);
        }
    }
}

const actionMove = async (cave) => {
    const [whereTo, badMove] = await resources.getResources('WhereTo', 'BadMove');

    const exit = await _prompt(
        whereTo, 
        (input) => {
            const toRoom = cave.CurrentRoom.Exits.find(room => {
                return room.RoomNumber == input;
              });
            if(toRoom){
                return true;
            } else {
                _write(badMove);
            }
        });

    cave.MovePlayer(exit);
    return _continue;
}

const actionShoot = async (cave) => {
    const [shotMissedPrompt, shotWumpusPrompt, shotYourselfPrompt] = 
        await resources.getResources('Shot-Missed', 'Shot-Wumpus', 'Shot-Yourself');

    const shootCount = await getShootCount();
    const shootPath = await getShots(shootCount);
    const shotHit = await shoot(cave, shootPath);

    switch(shotHit){
        case ActorsEnum.Wumpus:
            {
                return {
                    Status: GameStatusEnum.Win,
                    Message: shotWumpusPrompt,
                };
            }
        case ActorsEnum.Player:
            {
                return {
                    Status: GameStatusEnum.Lose,
                    Message: shotYourselfPrompt,
                }
            }
        default: 
            {
                return {
                    Status: GameStatusEnum.Continue,
                    Message: shotMissedPrompt,
                }
            }
        }
}

const getShootCount = async() => {
    const [shootCountPrompt] = 
        await resources.getResources('Shoot-Count');

    return await _prompt(
        shootCountPrompt,
        (input) => {
            return input >= 1 && input <= 5;
        }
    );
}

const getShots = async(shootCount) => {
    const [shootRoomPrompt, corrkedArrowPrompt] = 
        await resources.getResources('Shoot-Room', 'Tcorrked-Arrows');
    const shootPath = [];

    for(let i = 0; i < shootCount; i++){
        const shotExit = await _prompt(
            shootRoomPrompt,
            (input) => {
                if(!Number.isInteger(+input)){
                    return false;
                }

                if(i >= 2){
                    if(input == shootPath[i-2]){
                        _write(corrkedArrowPrompt);
                        return false;
                    }
                }
                
                return true;
            }
        );

        shootPath.push(+shotExit);
    }

    return shootPath;
}

const shoot = async(cave, shootPath) => {
    let arrowRoom = cave.CurrentRoom;
    let hit = null;

    shootPath.forEach(arrowExit => {
        let newRoom = arrowRoom.Exits.find(ar => ar.RoomNumber == arrowExit);

        if(!newRoom){
            // They shot into a room that's not an exit.  The arrow flies randomly.
            const exitNumber = utilities.Random(0, arrowRoom.Exits.length-1);
            newRoom = arrowRoom.Exits[exitNumber];
        }

        arrowRoom = newRoom;

        // Did you just shoot yourself, nerd?
        if(arrowRoom.RoomNumber == cave.CurrentRoom.RoomNumber){
            hit = hit || ActorsEnum.Player;
        }

        const gotWumpus = arrowRoom.Hazards.some(h => {
            return h.Type == ActorsEnum.Wumpus;
        });

        if(gotWumpus){
            hit = hit || ActorsEnum.Wumpus;
        }
    });

    return hit;
}

class Game {
    // write = a function to write to the console;
    // prompt = a function to prompt the user
    constructor(write, prompt){
        _write = write || _write;
        _prompt = prompt || _prompt;
    }

    runGame = async () => {
        const gameStart = await resources.getResource('GameStart');
        _write(gameStart);
        
        await _cave.Init()
        _cave.MovePlayer();
        await gameLoop(_cave);
    }

    get Cave() {
        return _cave;
    }
}

export default Game;