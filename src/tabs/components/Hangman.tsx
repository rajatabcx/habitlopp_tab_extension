import React, { useEffect, useState } from 'react';

const defaultState = {
  wrongLetters: [],
  correctLetters: [],
  showHints: false,
  word: '',
  canPlay: false,
  win: 0,
};

export default function Hangman() {
  const [gameState, setGameState] = useState(defaultState);

  const handleSetWord = async () => {
    const [word] = await fetch(
      'https://random-word-api.herokuapp.com/word'
    ).then((res) => res.json());
    console.log(word);
    setGameState({
      ...defaultState,
      word,
      canPlay: true,
      correctLetters: Array(word.length).fill(null),
    });
  };

  const handleKeydown = (e: KeyboardEvent) => {
    const { key, keyCode } = e;

    if (keyCode >= 65 && keyCode <= 90) {
      const enteredWord = key.toLowerCase();

      if (
        gameState.correctLetters.includes(enteredWord) ||
        gameState.wrongLetters.includes(enteredWord)
      )
        return;

      if (gameState.word.includes(enteredWord)) {
        setGameState((prev) => {
          const newCorrectLetters = [...prev.correctLetters];
          for (let i = 0; i < prev.word.length; i++) {
            if (prev.word[i] === enteredWord) {
              newCorrectLetters[i] = enteredWord;
            }
          }
          return {
            ...prev,
            correctLetters: newCorrectLetters,
            win: newCorrectLetters.join('') === prev.word ? 1 : 0,
            canPlay: newCorrectLetters.join('') === prev.word ? false : true,
          };
        });
      } else {
        setGameState((prev) => {
          const newWrongLetters = [...prev.wrongLetters, enteredWord];
          return {
            ...prev,
            wrongLetters: newWrongLetters,
            win: newWrongLetters.length === 6 ? -1 : 0,
            canPlay: newWrongLetters.length === 6 ? false : true,
          };
        });
      }
    }
  };

  useEffect(() => {
    handleSetWord();
  }, []);

  useEffect(() => {
    if (gameState.canPlay) {
      window.addEventListener('keydown', handleKeydown);
    } else {
      window.removeEventListener('keydown', handleKeydown);
    }
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [gameState.canPlay]);

  return gameState.canPlay ? (
    <div className='w-full h-screen bg-slate-800 flex justify-center items-center text-white'>
      <div>
        <Figure wrongLetters={gameState.wrongLetters} />
        <CorrectLetters correctLetters={gameState.correctLetters} />
        <WrongLetters wrongLetters={gameState.wrongLetters} />
      </div>
    </div>
  ) : gameState.win === 0 ? (
    <div className='w-full h-screen bg-slate-800 flex justify-center items-center text-white'></div>
  ) : (
    <div className='w-full h-screen bg-slate-800 flex justify-center items-center flex-col text-white'>
      <h1 className='text-[48px] font-bold'>
        {gameState.win === 1
          ? 'Congratulations'
          : gameState.win === -1
          ? 'Sorry'
          : ''}{' '}
        You{' '}
        {gameState.win === 1
          ? 'Win'
          : gameState.win === -1
          ? `Lose, the word was "${gameState.word}"`
          : ''}
      </h1>
      <button
        className='paper-button text-[24px] patrick !px-8 text-black mt-4'
        onClick={handleSetWord}
      >
        Play Again
      </button>
    </div>
  );
}

const CorrectLetters = ({ correctLetters }: { correctLetters: string[] }) => {
  return (
    <div className='flex gap-2 mt-4'>
      {correctLetters.map((char, index) =>
        char ? (
          <p
            key={index}
            className='border-b-2 border-white text-[28px] w-5 h-[60px]'
          >
            {char}
          </p>
        ) : (
          <p key={index} className='border-b-2 border-white w-5 h-[60px]'></p>
        )
      )}
    </div>
  );
};

const WrongLetters = ({ wrongLetters }: { wrongLetters: string[] }) => {
  return wrongLetters.length ? (
    <div className='mt-4'>
      <div>
        <p className='text-[16px]'>Wrong letters:</p>
        <p className='text-[28px]'>{wrongLetters.join(', ')}</p>
      </div>
    </div>
  ) : null;
};

const Figure = ({ wrongLetters }: { wrongLetters: string[] }) => {
  return (
    <svg
      height='250'
      width='200'
      style={{ strokeLinecap: 'round' }}
      className='stroke-white fill-transparent stroke-[4px]'
    >
      {/* <!-- Rod --> */}
      <line x1='60' y1='20' x2='140' y2='20' />
      <line x1='140' y1='20' x2='140' y2='50' />
      <line x1='60' y1='20' x2='60' y2='230' />
      <line x1='20' y1='230' x2='100' y2='230' />

      {/* <!-- Head --> */}
      {wrongLetters.length > 0 && <circle cx='140' cy='70' r='20' />}
      {/* <!-- Body --> */}
      {wrongLetters.length > 1 && <line x1='140' y1='90' x2='140' y2='150' />}
      {/* <!-- Arms --> */}
      {wrongLetters.length > 2 && <line x1='140' y1='120' x2='120' y2='100' />}
      {wrongLetters.length > 3 && <line x1='140' y1='120' x2='160' y2='100' />}
      {/* <!-- Legs --> */}
      {wrongLetters.length > 4 && <line x1='140' y1='150' x2='120' y2='180' />}
      {wrongLetters.length > 5 && <line x1='140' y1='150' x2='160' y2='180' />}
    </svg>
  );
};
