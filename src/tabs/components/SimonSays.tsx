import { useEffect, useState } from 'react';
import { REDUCED_DELAY_TIME, SONG_DELAY_TIME, sleep } from '../utils/board';

const tune = {
  blue: '/blue.mp3',
  green: '/green.mp3',
  red: '/red.mp3',
  yellow: '/yellow.mp3',
};

const pads = [
  {
    id: 0,
    active: false,
  },
  {
    id: 1,
    active: false,
  },
  {
    id: 2,
    active: false,
  },
  {
    id: 3,
    active: false,
  },
];

export default function SimonSays() {
  const [gameState, setGameState] = useState({
    steps: [],
    enteredStep: [],
    disabled: true,
    started: false,
    gameOver: false,
    pads,
  });

  const startGame = () => {
    setGameState((prev) => ({ ...prev, started: true }));
    addNewStep();
  };

  const addNewStep = () => {
    const newStep = Math.floor(Math.random() * 4);
    setGameState((prev) => ({ ...prev, steps: [...prev.steps, newStep] }));
  };

  const blinkPads = async () => {
    for (let padId of gameState.steps) {
      await sleep(REDUCED_DELAY_TIME);
      setGameState((prev) => ({
        ...prev,
        pads: prev.pads.map((pad) => ({ ...pad, active: pad.id === padId })),
      }));
      await sleep(SONG_DELAY_TIME);
      setGameState((prev) => ({
        ...prev,
        pads: prev.pads.map((pad) =>
          pad.id === padId ? { ...pad, active: false } : { ...pad }
        ),
      }));
      await sleep(SONG_DELAY_TIME);
    }
  };

  const handleBlinkPads = async () => {
    if (gameState.steps.length) {
      await blinkPads();
      setGameState((prev) => ({ ...prev, disabled: false }));
    }
  };

  useEffect(() => {
    handleBlinkPads();
  }, [gameState.steps]);

  return (
    <div className='bg-[#1B1A1A] w*full h-screen flex justify-center items-center'>
      <div className='flex flex-col items-center'>
        <div className='relative flex flex-col gap-2'>
          <div className='flex gap-2'>
            <button
              disabled={gameState.disabled}
              onClick={() => console.log('Red Click')}
              className={`pad h-[200px] w-[200px] red brightness-110 bg-[#FF2136] ${
                gameState.pads[0].active ? 'bg-[#fb8a95]' : ''
              }`}
            ></button>
            <button
              disabled={gameState.disabled}
              onClick={() => console.log('blue Click')}
              className={`pad h-[200px] w-[200px] blue bg-[#0072D9] rotate-90 ${
                gameState.pads[1].active ? 'bg-[#7dc1fc]' : ''
              }`}
            ></button>
          </div>
          <div className='flex gap-2'>
            <button
              disabled={gameState.disabled}
              onClick={() => console.log('yellow Click')}
              className={`pad h-[200px] w-[200px] yellow bg-[#FFDC00] -rotate-90 ${
                gameState.pads[2].active ? 'bg-[#f7e780]' : ''
              }`}
            ></button>
            <button
              disabled={gameState.disabled}
              onClick={() => console.log('green Click')}
              className={`pad h-[200px] w-[200px] green bg-[#2ECC40] rotate-180 ${
                gameState.pads[3].active ? 'bg-[#93ff9f]' : ''
              }`}
            ></button>
          </div>
          <div className='center absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-[#1b1a1a] h-[120px] w-[120px] score-pad rounded-full flex justify-center items-center text-white text-6xl patrick'>
            0
          </div>
        </div>
        {gameState.started ? (
          gameState.gameOver ? (
            <button
              disabled={gameState.started}
              className='paper-button mt-4'
              onClick={startGame}
            >
              Start Game
            </button>
          ) : null
        ) : (
          <button
            disabled={gameState.started}
            className='paper-button mt-4'
            onClick={startGame}
          >
            Start Game
          </button>
        )}
        <button className='paper-button mt-4' onClick={startGame}>
          Start Game
        </button>
      </div>
    </div>
  );
}
