import React, { useState, useEffect } from 'react';
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
  getValidKingMoves,
  getPieceAt
} from './utils/chessRules';
import './styles/App.css';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentTurn, setCurrentTurn] = useState('white');
  const [activeId, setActiveId] = useState(null);
  const [boardState, setBoardState] = useState(initialBoardState);
  const [validMoves, setValidMoves] = useState([]);
  const [whiteTime, setWhiteTime] = useState(300); 
  const [blackTime, setBlackTime] = useState(300); 
  const [capturedPieces, setCapturedPieces] = useState({ white: [], black: [] });

  useEffect(() => {
    let timer;
    if (gameStarted) {
      timer = setInterval(() => {
        if (currentTurn === 'white') {
          setWhiteTime(prev => {
            if (prev <= 0) return 0;
            return prev - 1;
          });
        } else {
          setBlackTime(prev => {
            if (prev <= 0) return 0;
            return prev - 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, currentTurn]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

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
      const pieceAtTarget = getPieceAt(overSquare, boardState);
      
      if (isValidMove(activePiece, overSquare, boardState)) {
        setBoardState(prevState => {
          const newState = prevState.filter(p => p.id !== active.id && p.position !== overSquare);
          return [...newState, { ...activePiece, position: overSquare }];
        });

        if (pieceAtTarget) {
          setCapturedPieces(prev => ({
            ...prev,
            [currentTurn]: [...prev[currentTurn], pieceAtTarget]
          }));
        }

        setCurrentTurn(prev => prev === 'white' ? 'black' : 'white');
      }
    }
    
    setActiveId(null);
    setValidMoves([]);
  };

  const activePiece = boardState.find(p => p.id === activeId);

  return (
    <div className="app-container">
      {gameStarted && (
        <div className="turn-indicator">
          <div className="turn-label">Current Turn:</div>
          <div className="turn-player">{currentTurn === 'white' ? 'Player 1' : 'Player 2'}</div>
        </div>
      )}
      <div className="game-container">
        <div className="player-section">
          <div className="player-label">Player 1</div>
          <div className="timer">{formatTime(whiteTime)}</div>
          <div className="captured-pieces">
            {capturedPieces.white.map((piece, index) => {
              const colorPrefix = piece.color === 'white' ? 'w' : 'b';
              const piecePrefix = piece.type === 'knight' ? 'kn' : piece.type.charAt(0);
              return (
                <img 
                  key={`white-captured-${index}`}
                  src={`/src/assets/Images/${colorPrefix}${piecePrefix}.png`}
                  alt={`${piece.color} ${piece.type}`}
                  className="captured-piece"
                />
              );
            })}
          </div>
        </div>
        <div className="board-container">
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
        <div className="player-section">
          <div className="player-label">Player 2</div>
          <div className="timer">{formatTime(blackTime)}</div>
          <div className="captured-pieces">
            {capturedPieces.black.map((piece, index) => {
              const colorPrefix = piece.color === 'white' ? 'w' : 'b';
              const piecePrefix = piece.type === 'knight' ? 'kn' : piece.type.charAt(0);
              return (
                <img 
                  key={`black-captured-${index}`}
                  src={`/src/assets/Images/${colorPrefix}${piecePrefix}.png`}
                  alt={`${piece.color} ${piece.type}`}
                  className="captured-piece"
                />
              );
            })}
          </div>
        </div>
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