// src/contexts/GameContext.jsx

import React, { createContext, useState, useEffect, useCallback } from 'react';
import storyData from '../data/story.json';

// Define the initial state for a new game
const initialState = {
  playerName: '',
  hp: 100,
  inventory: [],
  currentScene: 'start',
  gameStatus: 'start' // Can be: 'start', 'playing', 'gameOver', 'victory'
};

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  // Load state from localStorage on startup, or use the initial state
  const [gameState, setGameState] = useState(() => {
    const savedState = localStorage.getItem('aswangHunterState');
    return savedState ? JSON.parse(savedState) : initialState;
  });

  // Automatically save to localStorage whenever the game state changes
  useEffect(() => {
    localStorage.setItem('aswangHunterState', JSON.stringify(gameState));
  }, [gameState]);

  // Function to begin the game with a player name
  const startGame = (name) => {
    setGameState({
      ...initialState, // Reset stats to default
      playerName: name,
      gameStatus: 'playing',
    });
  };

  // Function to reset the game to the start screen
  const restartGame = () => {
    localStorage.removeItem('aswangHunterState');
    setGameState(initialState);
  };

  // The core function that processes a player's choice
  const handleChoice = useCallback((choice) => {
    const nextSceneKey = choice.to;
    const nextScene = storyData[nextSceneKey];

    if (!nextScene) {
      console.error(`Error: Scene "${nextSceneKey}" does not exist in story.json!`);
      return;
    }

    setGameState(prevState => {
      let newHp = prevState.hp;
      let newInventory = [...prevState.inventory];
      let newGameStatus = 'playing';
      let finalSceneKey = nextSceneKey;

      // 1. Apply effects from the new scene's "onArrive" block
      if (nextScene.onArrive) {
        if (nextScene.onArrive.addItem && !newInventory.includes(nextScene.onArrive.addItem)) {
          newInventory.push(nextScene.onArrive.addItem);
        }
        if (nextScene.onArrive.takeDamage) {
          newHp -= nextScene.onArrive.takeDamage;
        }
      }

      // 2. Check for game over due to HP loss
      if (newHp <= 0) {
        newGameStatus = 'gameOver';
        finalSceneKey = 'gameOver_hp'; // Redirect to the specific HP death scene
      }
      // 3. Otherwise, check if the new scene is a defined ending
      else if (storyData[finalSceneKey].isEnding) {
        // Determine victory or defeat based on scene key (a simple convention)
        newGameStatus = finalSceneKey.toLowerCase().includes('good') ? 'victory' : 'gameOver';
      }

      // Return the updated state object
      return {
        ...prevState,
        hp: newHp,
        inventory: newInventory,
        currentScene: finalSceneKey,
        gameStatus: newGameStatus,
      };
    });
  }, []);

  // Provide the state and functions to all child components
  return (
    <GameContext.Provider value={{ gameState, startGame, handleChoice, restartGame, storyData }}>
      {children}
    </GameContext.Provider>
  );
};