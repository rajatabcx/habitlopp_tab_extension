import { DIMENSIONS, DRAW } from './constants';

type Grid = Array<null | number>;
export default class Board {
  grid: Grid;
  winningIndex: null | number;
  constructor(grid?: Grid) {
    this.grid = grid || new Array(DIMENSIONS ** 2).fill(null);
    this.winningIndex = null;
  }

  makeMove = (square: number, player: number) => {
    if (this.grid[square] === null) {
      this.grid[square] = player;
    }
  };

  // Collect indices of empty squares and return them
  getEmptySquares = (grid = this.grid) => {
    let squares: number[] = [];
    grid.forEach((square, i) => {
      if (square === null) squares.push(i);
    });
    return squares;
  };

  isEmpty = (grid = this.grid) => {
    return this.getEmptySquares(grid).length === DIMENSIONS ** 2;
  };

  getWinner = (grid = this.grid) => {
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    let res: null | number = null;
    winningCombos.forEach((el, i) => {
      if (
        grid[el[0]] !== null &&
        grid[el[0]] === grid[el[1]] &&
        grid[el[0]] === grid[el[2]]
      ) {
        res = grid[el[0]];
        this.winningIndex = i;
      } else if (res === null && this.getEmptySquares(grid).length === 0) {
        res = DRAW;
        this.winningIndex = null;
      }
    });
    return res;
  };

  /**
   * Get the styles for strike through based on the combination that won
   */
  getStrikethroughStyles = () => {
    switch (this.winningIndex) {
      case 0:
        return 'transform-none top-[41px] left-[15px] w-[285px]';
      case 1:
        return 'transform-none top-[140px] left-[15px] w-[285px]';
      case 2:
        return 'transform-none top-[242px] left-[15px] w-[285px]';
      case 3:
        return 'rotate-90 top-[145px] left-[-86px] w-[285px]';
      case 4:
        return 'rotate-90 top-[145px] left-[15px] w-[285px]';
      case 5:
        return 'rotate-90 top-[145px] left-[115px] w-[285px]';
      case 6:
        return 'rotate-45 top-[145px] left-[-44px] w-[400px]';
      case 7:
        return 'rotate-45 top-[145px] left-[-46px] w-[400px]';
      default:
        return null;
    }
  };

  clone = () => {
    return new Board(this.grid.concat());
  };
}

export const sleep = async (time: number) => {
  return new Promise((res) => {
    setTimeout(() => {
      res('sleep done');
    }, time);
  });
};

export const SONG_DELAY_TIME = 200;
export const REDUCED_DELAY_TIME = SONG_DELAY_TIME - 100;
export const NEXT_LEVEL_DELAY_TIME = 500;
