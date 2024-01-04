import { createContext, useContext, useRef, useState } from 'react';

const defaultValue = {
  canvasRef: null,
  contextRef: null,
  prepareCanvas: () => {},
  startDrawing: ({ nativeEvent }) => {},
  finishDrawing: () => {},
  clearCanvas: () => {},
  draw: ({ nativeEvent }) => {},
};

export const CanvasContext = createContext(defaultValue);

export function CanvasProvider({ children }) {
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const createGradient = (ctx) => {
    const angleA = Math.random() * 360;
    const angleB = Math.random() * 360;
    const angleC = Math.random() * 360;
    const gr = ctx.createLinearGradient(0, 0, window.innerWidth, 0);
    gr.addColorStop(0, 'hsl(' + (angleA % 360) + ',100%, 50%)');
    gr.addColorStop(0.5, 'hsl(' + (angleB % 360) + ',100%, 50%)');
    gr.addColorStop(1, 'hsl(' + (angleC % 360) + ',100%, 50%)');

    ctx.strokeStyle = gr;
  };

  const prepareCanvas = () => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const context = canvas.getContext('2d');
    context.scale(2, 2);
    context.lineCap = 'round';

    createGradient(context);
    context.lineWidth = 6;
    contextRef.current = context;
  };

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <CanvasContext.Provider
      value={{
        canvasRef,
        contextRef,
        prepareCanvas,
        startDrawing,
        finishDrawing,
        clearCanvas,
        draw,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
}
