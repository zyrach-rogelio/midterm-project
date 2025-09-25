// src/components/GameScreen.jsx

import React, { useContext } from 'react';
import { GameContext } from '../context/gamecontext.jsx';

const GameScreen = () => {
  const { gameState, handleChoice, storyData } = useContext(GameContext);
  const scene = storyData[gameState.currentScene];

  // This function decides if a choice button should be rendered
  const isChoiceVisible = (choice) => {
    const playerInventory = gameState.inventory;
    // Condition to HIDE: If 'hideIf' item is in inventory
    if (choice.hideIf && playerInventory.includes(choice.hideIf)) {
      return false;
    }
    // Condition to HIDE: If 'requires' item is NOT in inventory
    if (choice.requires && !playerInventory.includes(choice.requires)) {
      return false;
    }
    // Otherwise, show the choice
    return true;
  };

  return (
    <div className="game-screen">
      <div className="player-stats">
        <span><strong>{gameState.playerName}</strong></span>
        <span>HP: <strong style={{ color: gameState.hp < 50 ? '#e63946' : '#a8dadc' }}>{gameState.hp}</strong></span>
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