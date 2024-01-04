import { useContext } from 'react';
import { CanvasContext } from '../context/CanvasContext';

export const useCanvas = () => useContext(CanvasContext);
