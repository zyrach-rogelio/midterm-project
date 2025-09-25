// src/components/GameScreen.jsx

import React, { useContext } from 'react';
import { GameContext } from '../context/gamecontext.jsx';

const GameScreen = () => {
  const { gameState, handleChoice, storyData } = useContext(GameContext);
  const scene = storyData[gameState.currentScene];

  // This function decides if a choice button should be rendered
  const isChoiceVisible = (choice) => {
    const playerInventory = gameState.inventory;
    if (choice.hideIf && playerInventory.includes(choice.hideIf)) {
      return false;
    }
    if (choice.requires && !playerInventory.includes(choice.requires)) {
      return false;
    }
    return true;
  };

  return (
    <div className="game-screen">
      <div className="player-stats">
        <span><strong>{gameState.playerName}</strong></span>
        <div className="hp-container">
          <span>HP: <strong>{gameState.hp}</strong></span>
          <div className="hp-bar">
            <div 
              className="hp-fill" 
              style={{ 
                width: `${gameState.hp}%`,
                backgroundColor: gameState.hp >= 75 ? '#4CAF50' : gameState.hp >= 25 ? '#FFD700' : '#e63946'
              }}
            />
          </div>
        </div>
        <span>Inventory: <strong>{gameState.inventory.join(', ') || 'None'}</strong></span>
      </div>

      <div className="story-text">
        <p>{scene.text}</p>
      </div>

      <div className="choices">
        {scene.choices?.map((choice, index) =>
          isChoiceVisible(choice) && (
            <button key={index} className="btn btn-outline-light w-100 my-2 text-start" onClick={() => handleChoice(choice)}>
              {choice.text}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default GameScreen;