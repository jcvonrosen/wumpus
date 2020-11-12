const GameStatusEnum = {
    Win: 1,
    Lose: 2,
    Continue: 3,
}

const ActionsEnum = {
    Move: 'M',
    Shoot: 'S',
}

const ActorsEnum = {
    Bat: 'Bat',
    Pit: 'Pit',
    Player: 'Player',
    Wumpus: 'Wumpus',
}

Object.freeze(GameStatusEnum);
Object.freeze(ActionsEnum);
Object.freeze(ActorsEnum);

export { GameStatusEnum, ActionsEnum, ActorsEnum } 