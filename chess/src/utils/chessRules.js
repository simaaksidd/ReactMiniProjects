const positionToCoordinates = (position) => {
  const file = position.charCodeAt(0) - 'a'.charCodeAt(0);
  const rank = 8 - parseInt(position[1]);
  return { file, rank };
};

const coordinatesToPosition = (file, rank) => {
  const fileChar = String.fromCharCode('a'.charCodeAt(0) + file);
  return `${fileChar}${8 - rank}`;
};

const isWithinBounds = (file, rank) => {
  return file >= 0 && file <= 7 && rank >= 0 && rank <= 7;
};

export const getPieceAt = (position, boardState) => {
  return boardState.find(piece => piece.position === position);
};

export const getValidPawnMoves = (piece, boardState) => {
  const { file, rank } = positionToCoordinates(piece.position);
  const direction = piece.color === 'white' ? -1 : 1;
  const validMoves = [];

  // Forward move
  const forwardRank = rank + direction;
  if (isWithinBounds(file, forwardRank)) {
    const forwardPosition = coordinatesToPosition(file, forwardRank);
    const pieceAtForward = getPieceAt(forwardPosition, boardState);
    
    if (!pieceAtForward) {
      validMoves.push(forwardPosition);
      
      // Check double move from starting position
      if ((piece.color === 'white' && rank === 6) || (piece.color === 'black' && rank === 1)) {
        const doubleForwardRank = rank + (2 * direction);
        const doubleForwardPosition = coordinatesToPosition(file, doubleForwardRank);
        const pieceAtDoubleForward = getPieceAt(doubleForwardPosition, boardState);
        
        if (!pieceAtDoubleForward) {
          validMoves.push(doubleForwardPosition);
        }
      }
    }
  }

  // Diagonal captures
  const captureFiles = [file - 1, file + 1];
  captureFiles.forEach(captureFile => {
    if (isWithinBounds(captureFile, forwardRank)) {
      const capturePosition = coordinatesToPosition(captureFile, forwardRank);
      const pieceAtCapture = getPieceAt(capturePosition, boardState);
      
      // Only add diagonal move if there's an enemy piece to capture
      if (pieceAtCapture && pieceAtCapture.color !== piece.color) {
        validMoves.push(capturePosition);
      }
    }
  });

  return validMoves;
};

export const getValidRookMoves = (piece, boardState) => {
  const { file, rank } = positionToCoordinates(piece.position);
  const validMoves = [];

  const directions = [
    { file: 0, rank: -1 },  
    { file: 1, rank: 0 },   
    { file: 0, rank: 1 },   
    { file: -1, rank: 0 }  
  ];

  directions.forEach(dir => {
    let currentFile = file + dir.file;
    let currentRank = rank + dir.rank;

    while (isWithinBounds(currentFile, currentRank)) {
      const position = coordinatesToPosition(currentFile, currentRank);
      const pieceAtPosition = getPieceAt(position, boardState);

      if (!pieceAtPosition) {
        validMoves.push(position);
      } else {
        if (pieceAtPosition.color !== piece.color) {
          validMoves.push(position);
        }
        break;
      }

      currentFile += dir.file;
      currentRank += dir.rank;
    }
  });

  return validMoves;
};

export const getValidBishopMoves = (piece, boardState) => {
  const { file, rank } = positionToCoordinates(piece.position);
  const validMoves = [];

  const directions = [
    { file: 1, rank: -1 },  
    { file: 1, rank: 1 },   
    { file: -1, rank: 1 },  
    { file: -1, rank: -1 }  
  ];

  directions.forEach(dir => {
    let currentFile = file + dir.file;
    let currentRank = rank + dir.rank;

    while (isWithinBounds(currentFile, currentRank)) {
      const position = coordinatesToPosition(currentFile, currentRank);
      const pieceAtPosition = getPieceAt(position, boardState);

      if (!pieceAtPosition) {
        // Empty square, can move here
        validMoves.push(position);
      } else {
        // Found a piece
        if (pieceAtPosition.color !== piece.color) {
          // Enemy piece, can capture
          validMoves.push(position);
        }
        // Can't move further in this direction
        break;
      }

      currentFile += dir.file;
      currentRank += dir.rank;
    }
  });

  return validMoves;
};

export const getValidQueenMoves = (piece, boardState) => {
  const rookMoves = getValidRookMoves(piece, boardState);
  const bishopMoves = getValidBishopMoves(piece, boardState);
  return [...new Set([...rookMoves, ...bishopMoves])];
};

export const getValidKingMoves = (piece, boardState) => {
  const { file, rank } = positionToCoordinates(piece.position);
  const validMoves = [];

  const directions = [
    { file: 0, rank: -1 },   
    { file: 1, rank: -1 },   
    { file: 1, rank: 0 },    
    { file: 1, rank: 1 },    
    { file: 0, rank: 1 },    
    { file: -1, rank: 1 },   
    { file: -1, rank: 0 },   
    { file: -1, rank: -1 }   
  ];

  directions.forEach(dir => {
    const newFile = file + dir.file;
    const newRank = rank + dir.rank;

    if (isWithinBounds(newFile, newRank)) {
      const position = coordinatesToPosition(newFile, newRank);
      const pieceAtPosition = getPieceAt(position, boardState);

      if (!pieceAtPosition || pieceAtPosition.color !== piece.color) {
        validMoves.push(position);
      }
    }
  });

  return validMoves;
};

export const getValidKnightMoves = (piece, boardState) => {
  const { file, rank } = positionToCoordinates(piece.position);
  const validMoves = [];

  const moves = [
    { file: 2, rank: -1 },   
    { file: 2, rank: 1 },    
    { file: -2, rank: 1 },   
    { file: -2, rank: -1 },  
    { file: 1, rank: -2 },   
    { file: 1, rank: 2 },    
    { file: -1, rank: 2 },   
    { file: -1, rank: -2 }   
  ];

  moves.forEach(move => {
    const newFile = file + move.file;
    const newRank = rank + move.rank;

    if (isWithinBounds(newFile, newRank)) {
      const position = coordinatesToPosition(newFile, newRank);
      const pieceAtPosition = getPieceAt(position, boardState);

      if (!pieceAtPosition || pieceAtPosition.color !== piece.color) {
        validMoves.push(position);
      }
    }
  });

  return validMoves;
};

export const isValidMove = (piece, targetPosition, boardState) => {
  switch (piece.type) {
    case 'pawn':
      const validPawnMoves = getValidPawnMoves(piece, boardState);
      return validPawnMoves.includes(targetPosition);
    case 'rook':
      const validRookMoves = getValidRookMoves(piece, boardState);
      return validRookMoves.includes(targetPosition);
    case 'bishop':
      const validBishopMoves = getValidBishopMoves(piece, boardState);
      return validBishopMoves.includes(targetPosition);
    case 'queen':
      const validQueenMoves = getValidQueenMoves(piece, boardState);
      return validQueenMoves.includes(targetPosition);
    case 'king':
      const validKingMoves = getValidKingMoves(piece, boardState);
      return validKingMoves.includes(targetPosition);
    case 'knight':
      const validKnightMoves = getValidKnightMoves(piece, boardState);
      return validKnightMoves.includes(targetPosition);
    default:
      return true;
  }
}; 