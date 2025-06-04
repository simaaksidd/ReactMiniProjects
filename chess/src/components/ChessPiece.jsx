import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import styled from 'styled-components';

const Piece = styled.div.attrs(props => ({
  'data-dragging': props.isdragging,
  'data-color': props.color
}))`
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: grab;
  user-select: none;
  transform: ${props => props.isdragging ? 'scale(1.1)' : 'scale(1)'};
  transition: transform 0.2s ease;
  z-index: ${props => props.isdragging ? 1 : 0};
`;

const PieceImage = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
`;

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
    <Piece
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      color={piece.color}
      isdragging={isdragging}
    >
      <PieceImage src={getPieceImage(piece.type, piece.color)} alt={`${piece.color} ${piece.type}`} />
    </Piece>
  );
};

export default ChessPiece; 