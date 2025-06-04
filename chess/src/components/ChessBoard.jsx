import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import ChessPiece from './ChessPiece';
import '../styles/ChessBoard.css';

const ChessBoard = ({ boardState, validMoves = [], currentTurn }) => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const getPieceAtPosition = (position) => {
    return boardState.find(piece => piece.position === position);
  };

  return (
    <div className="chess-board">
      {ranks.map((rank, rankIndex) =>
        files.map((file, fileIndex) => {
          const position = `${file}${rank}`;
          const piece = getPieceAtPosition(position);
          const iseven = (rankIndex + fileIndex) % 2 === 0;
          const isvalidmove = validMoves.includes(position);
          const isCapture = isvalidmove && piece && piece.color !== currentTurn;
          const { setNodeRef } = useDroppable({
            id: position,
          });

          return (
            <div 
              key={position} 
              className="chess-square"
              data-even={iseven}
              data-valid-move={isvalidmove && !isCapture}
              data-capture={isCapture}
              ref={setNodeRef}
            >
              {piece && <ChessPiece piece={piece} currentTurn={currentTurn} />}
            </div>
          );
        })
      )}
    </div>
  );
};

export default ChessBoard; 