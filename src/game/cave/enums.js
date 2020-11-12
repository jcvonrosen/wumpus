/* eslint-disable linebreak-style */
const GameStatusEnum = {
  Win: 1,
  Lose: 2,
  Continue: 3,
};

const ActionsEnum = {
  Move: 'M',
  Shoot: 'S',
};

Object.freeze(GameStatusEnum);
Object.freeze(ActionsEnum);

export { GameStatusEnum, ActionsEnum };
