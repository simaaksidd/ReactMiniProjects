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
  
  const { attributes, listeners, setNodeRef, transform, isdragging } = useDraggable({
    id: piece.id,
    data: piece,
    disabled: isDisabled
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="chess-piece"
      data-dragging={isdragging}
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