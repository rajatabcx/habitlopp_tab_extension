export const SCORES: Record<string, number> = {
  1: 1,
  0: 0,
  2: -1,
};

export const GAME_MODES: Record<string, string> = {
  easy: 'easy',
  medium: 'medium',
  difficult: 'difficult',
};

export const SQUARE_DIMS = 100;

export const GAME_STATES = {
  notStarted: 'not_started',
  inProgress: 'in_progress',
  over: 'over',
};

export const DIMENSIONS = 3;
export const DRAW = 0;
export const PLAYER_X = 1;
export const PLAYER_O = 2;

export const switchPlayer = (player: number) => {
  return player === PLAYER_X ? PLAYER_O : PLAYER_X;
};

export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const shuffleCards = (array: string[]) => {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
};
