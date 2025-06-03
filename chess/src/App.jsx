import React, { useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import styled from 'styled-components';
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

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f0f0;
`;

const GameContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Timer = styled.div`
  width: 120px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  background-color: #f8f8f8;
  border: 2px solid #ddd;
  border-radius: 8px;
`;

const TurnIndicator = styled.div`
  position: absolute;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StartOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const StartButton = styled.button`
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background-color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const BoardContainer = styled.div`
  position: relative;
`;

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
    <AppContainer>
      <GameContainer>
        <Timer>00:00</Timer>
        <BoardContainer>
          {gameStarted && <TurnIndicator>{currentTurn}'s turn</TurnIndicator>}
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
        </BoardContainer>
        <Timer>00:00</Timer>
      </GameContainer>
      {!gameStarted && (
        <StartOverlay>
          <StartButton onClick={() => setGameStarted(true)}>
            Start Game
          </StartButton>
        </StartOverlay>
      )}
    </AppContainer>
  );
}

export default App; 