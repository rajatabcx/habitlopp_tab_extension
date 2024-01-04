import React, { useEffect } from 'react';
import { useCanvas } from '../hooks/useCanvas.hook';

export default function Doodle() {
  const {
    canvasRef,
    prepareCanvas,
    startDrawing,
    finishDrawing,
    draw,
    clearCanvas,
  } = useCanvas();

  useEffect(() => {
    prepareCanvas();
  }, []);

  return (
    <div className='w-full h-screen overflow-hidden'>
      <h1 className='text-2xl font-bold text-center p-2'>
        Draw some doodles, it helps to release stress
      </h1>
      <div>
        <canvas
          onMouseDown={startDrawing}
          onMouseUp={finishDrawing}
          onMouseMove={draw}
          ref={canvasRef}
          className='w-full h-screen'
        />
        <button onClick={clearCanvas}>Clear Canvas</button>
      </div>
    </div>
  );
}
