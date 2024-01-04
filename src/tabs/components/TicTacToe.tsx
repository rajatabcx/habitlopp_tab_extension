import { useCallback, useEffect, useState } from 'react';
import {
  PLAYER_X,
  PLAYER_O,
  SQUARE_DIMS,
  DRAW,
  GAME_STATES,
  GAME_MODES,
  DIMENSIONS,
  getRandomInt,
  switchPlayer,
} from '../utils/constants';
import Board from '../utils/board';
import { minimax } from '../utils/minimax';

const arr = new Array(DIMENSIONS ** 2).fill(null);
const board = new Board();

interface Props {
  squares?: Array<number | null>;
}

export default function TicTacToe({ squares = arr }: Props) {
  const [players, setPlayers] = useState<Record<string, number | null>>({
    human: null,
    ai: null,
  });
  const [gameState, setGameState] = useState(GAME_STATES.notStarted);
  const [grid, setGrid] = useState(squares);
  const [winner, setWinner] = useState<string | null>(null);
  const [nextMove, setNextMove] = useState<null | number>(null);
  const [mode, setMode] = useState(GAME_MODES.medium);

  useEffect(() => {
    const boardWinner = board.getWinner(grid);

    const declareWinner = (winner: number) => {
      let winnerStr;
      switch (winner) {
        case PLAYER_X:
          winnerStr = 'Player X wins!';
          break;
        case PLAYER_O:
          winnerStr = 'Player O wins!';
          break;
        case DRAW:
        default:
          winnerStr = "It's a draw";
      }
      setGameState(GAME_STATES.over);
      setWinner(winnerStr);
    };

    if (boardWinner !== null && gameState !== GAME_STATES.over) {
      declareWinner(boardWinner);
    }
  }, [gameState, grid, nextMove]);

  const move = useCallback(
    (index: number, player: number | null) => {
      if (player !== null && gameState === GAME_STATES.inProgress) {
        setGrid((grid) => {
          const gridCopy = grid.concat();
          gridCopy[index] = player;
          return gridCopy;
        });
      }
    },
    [gameState]
  );

  const aiMove = useCallback(() => {
    // Important to pass a copy of the grid here
    const board = new Board(grid.concat());
    const emptyIndices = board.getEmptySquares(grid);
    let index;
    switch (mode) {
      case GAME_MODES.easy:
        do {
          index = getRandomInt(0, 8);
        } while (!emptyIndices.includes(index));
        break;
      // Medium level is basically ~half of the moves are minimax and the other ~half random
      case GAME_MODES.medium:
        const smartMove = !board.isEmpty(grid) && Math.random() < 0.5;
        if (smartMove) {
          index = minimax(board, players.ai!)[1];
        } else {
          do {
            index = getRandomInt(0, 8);
          } while (!emptyIndices.includes(index));
        }
        break;
      case GAME_MODES.difficult:
      default:
        index = board.isEmpty(grid)
          ? getRandomInt(0, 8)
          : minimax(board, players.ai!)[1];
    }

    if (index !== null && !grid[index]) {
      if (players.ai !== null) {
        move(index, players.ai);
      }
      setNextMove(players.human);
    }
  }, [move, grid, players, mode]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (
      nextMove !== null &&
      nextMove === players.ai &&
      gameState !== GAME_STATES.over
    ) {
      // Delay AI moves to make them more natural
      timeout = setTimeout(() => {
        aiMove();
      }, 500);
    }
    return () => timeout && clearTimeout(timeout);
  }, [nextMove, aiMove, players.ai, gameState]);

  const humanMove = (index: number) => {
    if (!grid[index] && nextMove === players.human) {
      move(index, players.human);
      setNextMove(players.ai);
    }
  };

  const choosePlayer = (option: number) => {
    setPlayers({ human: option, ai: switchPlayer(option) });
    setGameState(GAME_STATES.inProgress);
    setNextMove(PLAYER_X);
  };

  const startNewGame = () => {
    setGameState(GAME_STATES.notStarted);
    setGrid(arr);
    setWinner(null);
  };

  const changeMode = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMode(e.target.value);
  };

  return (
    <div className='h-screen'>
      <h1 className='text-2xl font-bold text-center p-2 patrick mb-20 underline'>
        Play a game of Tic-Tac-Toe it helps in reduce stress
      </h1>
      {gameState === GAME_STATES.notStarted ? (
        <div className='w-full flex justify-center items-center'>
          <div className='p-8 flex-shrink-0'>
            <div className='flex flex-col items-center mb-[30px]'>
              <p className='patrick text-[40px] mb-4'>Select difficulty</p>
              <select
                className='border patrick text-[28px] paper-button'
                onChange={changeMode}
                value={mode}
              >
                {Object.keys(GAME_MODES).map((key) => {
                  const gameMode = GAME_MODES[key];
                  return (
                    <option key={gameMode} value={gameMode}>
                      {key}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className='flex flex-col items-center mb-[30px]'>
              <p className='patrick text-[20px] mb-4'>Choose your player</p>
              <div className='flex w-[250px] justify-between items-center'>
                <button
                  className='paper-button  text-[24px] patrick !px-8'
                  onClick={() => choosePlayer(PLAYER_X)}
                >
                  X
                </button>
                <p className='patrick text-[20px]'>or</p>
                <button
                  className='paper-button text-[24px] patrick !px-8'
                  onClick={() => choosePlayer(PLAYER_O)}
                >
                  O
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='w-full flex flex-col justify-center items-center'>
          <div
            style={{ width: `${DIMENSIONS * (SQUARE_DIMS + 5)}px` }}
            className='flex justify-center flex-wrap relative'
          >
            {grid.map((value, index) => {
              const isActive = value !== null;

              return (
                <div
                  style={{
                    width: `${SQUARE_DIMS}px`,
                    height: `${SQUARE_DIMS}px`,
                  }}
                  className='flex justify-center items-center cursor-pointer border patrick'
                  key={index}
                  onClick={() => humanMove(index)}
                >
                  {isActive && (
                    <p className='text-[68px]'>
                      {value === PLAYER_X ? 'X' : 'O'}
                    </p>
                  )}
                </div>
              );
            })}
            <div
              className={`absolute bg-red-500 h-[5px] ${
                gameState === GAME_STATES.over
                  ? board.getStrikethroughStyles()
                  : ''
              }`}
            />
          </div>
          {winner ? (
            <div className='flex flex-col items-center'>
              <p className='text-[40px] font-semibold my-4'>{winner}</p>
              <button
                className='paper-button text-[28px] patrick'
                onClick={startNewGame}
              >
                Start Over
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
