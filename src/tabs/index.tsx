import { createRoot } from 'react-dom/client';
import '../assets/tailwind.css';
import { CanvasProvider } from './context/CanvasContext';
import Doodle from './components/Doodle';
import TicTacToe from './components/TicTacToe';
import CardFlip from './components/CardFlip';
import Hangman from './components/Hangman';
import SimonSays from './components/SimonSays';

const allComps = [
  <CanvasProvider>
    <Doodle />
  </CanvasProvider>,
  <TicTacToe />,
  <CardFlip />,
  <Hangman />,
  <SimonSays />,
];

function init() {
  console.log(Math.random());
  const appContainer = document.createElement('div');
  document.body.appendChild(appContainer);
  if (!appContainer) {
    throw new Error('Can not find AppContainer');
  }
  const root = createRoot(appContainer);
  root.render(<SimonSays />);
}

init();
