import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import styled from 'styled-components';
import ChessPiece from './ChessPiece';

const Board = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
  width: 560px;
  height: 560px;
  border: 2px solid #333;
`;

const Square = styled.div.attrs(props => ({
  'data-even': props.iseven,
  'data-valid-move': props.isvalidmove
}))`
  width: 70px;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.iseven ? '#f0d9b5' : '#b58863'};
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.1);

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${props => props.isvalidmove ? 'rgba(255, 0, 0, 0.25)' : 'transparent'};
    pointer-events: none;
  }
`;

const ChessBoard = ({ boardState, validMoves = [], currentTurn }) => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const getPieceAtPosition = (position) => {
    return boardState.find(piece => piece.position === position);
  };

  return (
    <Board>
      {ranks.map((rank, rankIndex) =>
        files.map((file, fileIndex) => {
          const position = `${file}${rank}`;
          const piece = getPieceAtPosition(position);
          const iseven = (rankIndex + fileIndex) % 2 === 0;
          const isvalidmove = validMoves.includes(position);
          const { setNodeRef } = useDroppable({
            id: position,
          });

          return (
            <Square 
              key={position} 
              iseven={iseven}
              isvalidmove={isvalidmove}
              ref={setNodeRef}
            >
              {piece && <ChessPiece piece={piece} currentTurn={currentTurn} />}
            </Square>
          );
        })
      )}
    </Board>
  );
};

export default ChessBoard; 