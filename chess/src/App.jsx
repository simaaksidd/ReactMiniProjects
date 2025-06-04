import React, { useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import ChessBoard from './components/ChessBoard';
import ChessPiece from './components/ChessPiece';
import { initialBoardState } from './utils/boardState';
import { 
  isValidMove, 
  getValidPawnMoves, 
  getValidKnightMoves, 
  getValidBishopMoves,
  getValidRookMoves,
  getValidQueenMoves,
  getValidKingMoves 
} from './utils/chessRules';
import './styles/App.css';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentTurn, setCurrentTurn] = useState('white');
  const [activeId, setActiveId] = useState(null);
  const [boardState, setBoardState] = useState(initialBoardState);
  const [validMoves, setValidMoves] = useState([]);

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
    
    const piece = boardState.find(p => p.id === active.id);
    if (piece && piece.color === currentTurn) {
      switch (piece.type) {
        case 'pawn':
          setValidMoves(getValidPawnMoves(piece, boardState));
          break;
        case 'knight':
          setValidMoves(getValidKnightMoves(piece, boardState));
          break;
        case 'bishop':
          setValidMoves(getValidBishopMoves(piece, boardState));
          break;
        case 'rook':
          setValidMoves(getValidRookMoves(piece, boardState));
          break;
        case 'queen':
          setValidMoves(getValidQueenMoves(piece, boardState));
          break;
        case 'king':
          setValidMoves(getValidKingMoves(piece, boardState));
          break;
        default:
          setValidMoves([]);
      }
    } else {
      setValidMoves([]);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const activePiece = boardState.find(p => p.id === active.id);
      const overSquare = over.id;
      
      if (isValidMove(activePiece, overSquare, boardState)) {
        setBoardState(prevState => {
          const newState = prevState.filter(p => p.id !== active.id);
          return [...newState, { ...activePiece, position: overSquare }];
        });
        setCurrentTurn(prev => prev === 'white' ? 'black' : 'white');
      }
    }
    
    setActiveId(null);
    setValidMoves([]);
  };

  const activePiece = boardState.find(p => p.id === activeId);

  return (
    <div className="app-container">
      <div className="game-container">
        <div className="timer">00:00</div>
        <div className="board-container">
          {gameStarted && <div className="turn-indicator">{currentTurn}'s turn</div>}
          <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <ChessBoard 
              boardState={boardState} 
              currentTurn={currentTurn} 
              validMoves={validMoves}
            />
            <DragOverlay>
              {activeId ? <ChessPiece piece={activePiece} currentTurn={currentTurn} /> : null}
            </DragOverlay>
          </DndContext>
        </div>
        <div className="timer">00:00</div>
      </div>
      {!gameStarted && (
        <div className="start-overlay">
          <button className="start-button" onClick={() => setGameStarted(true)}>
            Start Game
          </button>
        </div>
      )}
    </div>
  );
}

export default App; 