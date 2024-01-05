import { useEffect, useState } from 'react';
import { REDUCED_DELAY_TIME, SONG_DELAY_TIME, sleep } from '../utils/board';

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
    score: 0,
  });

  const startGame = () => {
    setGameState((prev) => ({ ...prev, started: true, score: -1 }));
    addNewStep();
  };

  const addNewStep = () => {
    const newStep = Math.floor(Math.random() * 4);
    setGameState((prev) => ({
      ...prev,
      steps: [...prev.steps, newStep],
      disabled: true,
      enteredStep: [],
      score: prev.score + 1,
    }));
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

  const handleUserInput = (id: number) => {
    setGameState((prev) => ({
      ...prev,
      enteredStep: [...prev.enteredStep, id],
    }));
  };

  const handleUserSubmit = () => {
    if (gameState.steps.join('') === gameState.enteredStep.join('')) {
      addNewStep();
    } else {
      setGameState((prev) => ({ ...prev, gameOver: true }));
    }
  };

  return (
    <div className='bg-[#1B1A1A] w*full h-screen flex justify-center items-center'>
      <div className='flex flex-col items-center'>
        <div className='relative flex flex-col gap-2'>
          <div className='flex gap-2'>
            <button
              disabled={gameState.disabled}
              onClick={() => handleUserInput(0)}
              className={`pad h-[200px] w-[200px] red brightness-110 bg-[#FF2136] active:bg-[#fb8a95] ${
                gameState.pads[0].active ? 'bg-[#fb8a95]' : ''
              }`}
            ></button>
            <button
              disabled={gameState.disabled}
              onClick={() => handleUserInput(1)}
              className={`pad h-[200px] w-[200px] blue bg-[#0072D9] active:bg-[#97ceff] rotate-90 ${
                gameState.pads[1].active ? 'bg-[#97ceff]' : ''
              }`}
            ></button>
          </div>
          <div className='flex gap-2'>
            <button
              disabled={gameState.disabled}
              onClick={() => handleUserInput(2)}
              className={`pad h-[200px] w-[200px] yellow bg-[#FFDC00] active:bg-[#fff2ab] -rotate-90 ${
                gameState.pads[2].active ? 'bg-[#efe395]' : ''
              }`}
            ></button>
            <button
              disabled={gameState.disabled}
              onClick={() => handleUserInput(3)}
              className={`pad h-[200px] w-[200px] green bg-[#2ECC40] active:bg-[#93ff9f] rotate-180 ${
                gameState.pads[3].active ? 'bg-[#93ff9f]' : ''
              }`}
            ></button>
          </div>
          <div className='center absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-[#1b1a1a] h-[120px] w-[120px] score-pad rounded-full flex justify-center items-center text-white text-6xl patrick'>
            {gameState.score}
          </div>
          {gameState.gameOver ? (
            <div className='absolute w-full h-full bg-[white] mix-blend-saturation grayscale left-0 top-0'></div>
          ) : null}
        </div>
        <div className='h-[100px] flex flex-col items-center'>
          {gameState.started ? (
            gameState.gameOver ? (
              <button className='paper-button mt-4' onClick={startGame}>
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
          {gameState.disabled ? null : gameState.gameOver ? null : (
            <button className='paper-button mt-4' onClick={handleUserSubmit}>
              Submit
            </button>
          )}
          {gameState.gameOver ? (
            <h1 className='patrick text-2xl text-white mt-4'>
              Oops!! Game Over
            </h1>
          ) : null}
        </div>
      </div>
    </div>
  );
}
