// Convert position (e.g., 'e2') to coordinates {file: 4, rank: 1}
const positionToCoordinates = (position) => {
  const file = position.charCodeAt(0) - 'a'.charCodeAt(0);
  const rank = 8 - parseInt(position[1]);
  return { file, rank };
};

// Convert coordinates to position
const coordinatesToPosition = (file, rank) => {
  const fileChar = String.fromCharCode('a'.charCodeAt(0) + file);
  return `${fileChar}${8 - rank}`;
};

// Check if a position is within the board bounds
const isWithinBounds = (file, rank) => {
  return file >= 0 && file <= 7 && rank >= 0 && rank <= 7;
};

// Check if a square is light or dark
const isLightSquare = (file, rank) => {
  return (file + rank) % 2 === 0;
};

// Get valid pawn moves
export const getValidPawnMoves = (piece, boardState) => {
  const { file, rank } = positionToCoordinates(piece.position);
  const direction = piece.color === 'white' ? -1 : 1; // White moves up (negative), black moves down (positive)
  const validMoves = [];

  // Check forward move
  const forwardRank = rank + direction;
  if (isWithinBounds(file, forwardRank)) {
    const forwardPosition = coordinatesToPosition(file, forwardRank);
    const pieceAtForward = boardState.find(p => p.position === forwardPosition);
    
    // Can move forward if no piece is there
    if (!pieceAtForward) {
      validMoves.push(forwardPosition);
      
      // Check double move from starting position
      if ((piece.color === 'white' && rank === 6) || (piece.color === 'black' && rank === 1)) {
        const doubleForwardRank = rank + (2 * direction);
        const doubleForwardPosition = coordinatesToPosition(file, doubleForwardRank);
        const pieceAtDoubleForward = boardState.find(p => p.position === doubleForwardPosition);
        
        if (!pieceAtDoubleForward) {
          validMoves.push(doubleForwardPosition);
        }
      }
    }
  }

  // Check diagonal captures
  const captureFiles = [file - 1, file + 1];
  captureFiles.forEach(captureFile => {
    if (isWithinBounds(captureFile, forwardRank)) {
      const capturePosition = coordinatesToPosition(captureFile, forwardRank);
      const pieceAtCapture = boardState.find(p => p.position === capturePosition);
      
      // Can capture if there's an enemy piece
      if (pieceAtCapture && pieceAtCapture.color !== piece.color) {
        validMoves.push(capturePosition);
      }
    }
  });

  return validMoves;
};

// Get valid rook moves
export const getValidRookMoves = (piece, boardState) => {
  const { file, rank } = positionToCoordinates(piece.position);
  const validMoves = [];

  // Check all four directions: up, right, down, left
  const directions = [
    { file: 0, rank: -1 },  // up
    { file: 1, rank: 0 },   // right
    { file: 0, rank: 1 },   // down
    { file: -1, rank: 0 }   // left
  ];

  directions.forEach(dir => {
    let currentFile = file + dir.file;
    let currentRank = rank + dir.rank;

    // Keep moving in the current direction until we hit a piece or the board edge
    while (isWithinBounds(currentFile, currentRank)) {
      const position = coordinatesToPosition(currentFile, currentRank);
      const pieceAtPosition = boardState.find(p => p.position === position);

      if (!pieceAtPosition) {
        // Empty square, can move here
        validMoves.push(position);
      } else {
        // Found a piece
        if (pieceAtPosition.color !== piece.color) {
          // Enemy piece, can capture but can't move further
          validMoves.push(position);
        }
        // Stop checking this direction (can't jump over pieces)
        break;
      }

      currentFile += dir.file;
      currentRank += dir.rank;
    }
  });

  return validMoves;
};

// Get valid bishop moves
export const getValidBishopMoves = (piece, boardState) => {
  const { file, rank } = positionToCoordinates(piece.position);
  const validMoves = [];
  const originalSquareColor = isLightSquare(file, rank);

  // Check all four diagonal directions
  const directions = [
    { file: 1, rank: -1 },  // up-right
    { file: 1, rank: 1 },   // down-right
    { file: -1, rank: 1 },  // down-left
    { file: -1, rank: -1 }  // up-left
  ];

  directions.forEach(dir => {
    let currentFile = file + dir.file;
    let currentRank = rank + dir.rank;

    // Keep moving in the current direction until we hit a piece or the board edge
    while (isWithinBounds(currentFile, currentRank)) {
      // Check if the square is the same color as the bishop's original square
      if (isLightSquare(currentFile, currentRank) === originalSquareColor) {
        const position = coordinatesToPosition(currentFile, currentRank);
        const pieceAtPosition = boardState.find(p => p.position === position);

        if (!pieceAtPosition) {
          // Empty square, can move here
          validMoves.push(position);
        } else {
          // Found a piece
          if (pieceAtPosition.color !== piece.color) {
            // Enemy piece, can capture but can't move further
            validMoves.push(position);
          }
          // Stop checking this direction (can't jump over pieces)
          break;
        }
      } else {
        // Not the same color square, can't move here
        break;
      }

      currentFile += dir.file;
      currentRank += dir.rank;
    }
  });

  return validMoves;
};

// Get valid queen moves
export const getValidQueenMoves = (piece, boardState) => {
  // Queen combines rook and bishop movements
  const rookMoves = getValidRookMoves(piece, boardState);
  const bishopMoves = getValidBishopMoves(piece, boardState);
  
  // Combine and remove duplicates
  return [...new Set([...rookMoves, ...bishopMoves])];
};

// Get valid king moves
export const getValidKingMoves = (piece, boardState) => {
  const { file, rank } = positionToCoordinates(piece.position);
  const validMoves = [];

  // All eight possible directions for the king
  const directions = [
    { file: 0, rank: -1 },   // up
    { file: 1, rank: -1 },   // up-right
    { file: 1, rank: 0 },    // right
    { file: 1, rank: 1 },    // down-right
    { file: 0, rank: 1 },    // down
    { file: -1, rank: 1 },   // down-left
    { file: -1, rank: 0 },   // left
    { file: -1, rank: -1 }   // up-left
  ];

  // Check each direction for a single square move
  directions.forEach(dir => {
    const newFile = file + dir.file;
    const newRank = rank + dir.rank;

    if (isWithinBounds(newFile, newRank)) {
      const position = coordinatesToPosition(newFile, newRank);
      const pieceAtPosition = boardState.find(p => p.position === position);

      // Can move to empty square or capture enemy piece
      if (!pieceAtPosition || pieceAtPosition.color !== piece.color) {
        validMoves.push(position);
      }
    }
  });

  return validMoves;
};

// Get valid knight moves
export const getValidKnightMoves = (piece, boardState) => {
  const { file, rank } = positionToCoordinates(piece.position);
  const validMoves = [];

  // All possible L-shaped moves for the knight
  const moves = [
    { file: 2, rank: -1 },   // up-right
    { file: 2, rank: 1 },    // down-right
    { file: -2, rank: 1 },   // down-left
    { file: -2, rank: -1 },  // up-left
    { file: 1, rank: -2 },   // right-up
    { file: 1, rank: 2 },    // right-down
    { file: -1, rank: 2 },   // left-down
    { file: -1, rank: -2 }   // left-up
  ];

  // Check each L-shaped move
  moves.forEach(move => {
    const newFile = file + move.file;
    const newRank = rank + move.rank;

    if (isWithinBounds(newFile, newRank)) {
      const position = coordinatesToPosition(newFile, newRank);
      const pieceAtPosition = boardState.find(p => p.position === position);

      // Can move to empty square or capture enemy piece
      // Note: Knight can jump over pieces, so we don't need to check the path
      if (!pieceAtPosition || pieceAtPosition.color !== piece.color) {
        validMoves.push(position);
      }
    }
  });

  return validMoves;
};

// Check if a move is valid for a piece
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
      return true; // For now, allow all other pieces to move anywhere
  }
}; 