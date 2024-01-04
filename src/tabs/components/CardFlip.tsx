import React, { useState } from 'react';
import { shuffleCards } from '../utils/constants';

const cards = [
  'TV',
  'TV',
  'VT',
  'VT',
  'hbird',
  'hbird',
  'name',
  'name',
  'seal',
  'seal',
  'tracks',
  'tracks',
];

export default function CardFlip() {
  const [cardList, setCardList] = useState(
    shuffleCards(cards).map((name, index) => {
      return {
        id: index,
        name: name,
        flipped: false,
        matched: false,
      };
    })
  );

  const [flippedCards, setFlippedCards] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const handleClick = (name: string, index: number) => {
    let currentCard = {
      name,
      index,
    };

    let updateCards = cardList.map((card) => {
      if (card.id === index) {
        card.flipped = true;
      }
      return card;
    });
    let updateFlipped = flippedCards;
    updateFlipped.push(currentCard);
    setFlippedCards(updateFlipped);
    setCardList(updateCards);

    if (flippedCards.length === 2) {
      setTimeout(() => {
        check();
      }, 750);
    }
  };

  const check = () => {
    let updateCards = cardList;
    if (
      flippedCards[0].name === flippedCards[1].name &&
      flippedCards[0].index !== flippedCards[1].index
    ) {
      updateCards[flippedCards[0].index].matched = true;
      updateCards[flippedCards[1].index].matched = true;
      isGameOver();
    } else {
      updateCards[flippedCards[0].index].flipped = false;
      updateCards[flippedCards[1].index].flipped = false;
    }
    setCardList(updateCards);
    setFlippedCards([]);
  };

  const isGameOver = () => {
    let done = true;
    cardList.forEach((card) => {
      if (!card.matched) done = false;
    });
    setGameOver(done);
  };

  const restartGame = () => {
    setCardList(
      shuffleCards(cards).map((name, index) => {
        return {
          id: index,
          name: name,
          flipped: false,
          matched: false,
        };
      })
    );
    setFlippedCards([]);
    setGameOver(false);
  };

  return (
    <div
      className='flex flex-wrap justify-center mb-[-15px]'
      style={{ perspective: '1000px' }}
    >
      {!gameOver &&
        cardList.map((card, index) => (
          <Card
            key={index}
            id={index}
            name={card.name}
            flipped={card.flipped}
            matched={card.matched}
            clicked={flippedCards.length === 2 ? () => {} : handleClick}
          />
        ))}
      {gameOver ? (
        <div className='w-full h-screen flex flex-col justify-center items-center'>
          <h1 className='text-[40px] patrick font-semibold mb-4'>
            Congrats, You Won!
          </h1>
          <button
            className='paper-button text-[24px] patrick !px-8'
            onClick={restartGame}
          >
            Play Again?
          </button>
        </div>
      ) : null}
    </div>
  );
}

const Card = ({ id, name, flipped, matched, clicked }) => {
  return (
    <div
      onClick={() => (flipped ? undefined : clicked(name, id))}
      className={
        'card w-[250px] select-none h-[250px] p-3 box-border text-center m-4 duration-[600ms] relative' +
        (flipped ? ' flipped' : '') +
        (matched ? ' matched' : '')
      }
    >
      <div className='absolute top-0 left-0 w-full h-full rounded-xl transition-all duration-[600ms] bg-[#e7e7e7] back'>
        ?
      </div>
      <div
        style={{ backfaceVisibility: 'hidden' }}
        className='absolute top-0 left-0 w-full h-full rounded-xl transition-all duration-[600ms] bg-[#e7e7e7] flex justify-center items-center front'
      >
        <img
          alt={name}
          src={`/${name}.png`}
          className='align-middle w-[100px] h-[100px] object-contain'
        />
      </div>
    </div>
  );
};

// font back flipped macthed etc naki css
