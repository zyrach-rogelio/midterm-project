// src/components/GameOverScreen.jsx

import React, { useContext } from 'react';
import { GameContext } from '../context/gamecontext.jsx';

const GameOverScreen = ({ message }) => {
  const { restartGame, gameState } = useContext(GameContext);
  const title = gameState.gameStatus === 'victory' ? 'Victory!' : 'Game Over';

  return (
    <div className="game-over-screen">
      <h2>{title}</h2>
      <p>{message}</p>
      <button onClick={restartGame}>Play Again</button>
    </div>
  );
};

export default GameOverScreen;