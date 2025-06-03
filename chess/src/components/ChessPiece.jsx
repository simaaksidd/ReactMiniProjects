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
  font-size: 40px;
  cursor: grab;
  user-select: none;
  color: ${props => props.color === 'white' ? '#fff' : '#000'};
  text-shadow: ${props => props.color === 'white' ? '0 0 2px #000' : '0 0 2px #fff'};
  transform: ${props => props.isdragging ? 'scale(1.1)' : 'scale(1)'};
  transition: transform 0.2s ease;
  z-index: ${props => props.isdragging ? 1 : 0};
`;

const getPieceSymbol = (type) => {
  const symbols = {
    king: '♔',
    queen: '♕',
    rook: '♖',
    bishop: '♗',
    knight: '♘',
    pawn: '♙'
  };
  return symbols[type] || '';
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
      {getPieceSymbol(piece.type)}
    </Piece>
  );
};

export default ChessPiece; 