import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import '../styles/ChessPiece.css';

const getPieceImage = (type, color) => {
  const colorPrefix = color === 'white' ? 'w' : 'b';
  const piecePrefix = type === 'knight' ? 'kn' : type.charAt(0);
  return `/src/assets/Images/${colorPrefix}${piecePrefix}.png`;
};

const ChessPiece = ({ piece, currentTurn }) => {
  const isDisabled = piece.color !== currentTurn;
  
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: piece.id,
    data: piece,
    disabled: isDisabled
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`chess-piece ${isDragging ? 'dragging' : ''}`}
      data-color={piece.color}
    >
      <img 
        src={getPieceImage(piece.type, piece.color)} 
        alt={`${piece.color} ${piece.type}`}
        className="chess-piece-image"
      />
    </div>
  );
};

export default ChessPiece; 