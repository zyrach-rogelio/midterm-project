// src/contexts/gamecontext.jsx

import React, { createContext, useState, useEffect, useCallback } from 'react';
import storyData from '../data/story.json';

// Define the initial state for a new game
const initialState = {
  playerName: '',
  hp: 100,
  inventory: [],
  currentScene: 'start',
  gameStatus: 'start' // Can be: 'start', 'starting', 'playing', 'gameOver', 'victory'
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
    // 1. Set the initial state and immediately put the game into the 'starting' (transition) state
    setGameState(prevState => ({
      ...initialState,
      playerName: name,
      gameStatus: 'starting',
    }));

    // 2. After the animation duration, switch to the 'playing' state
    // THIS BLOCK HAS BEEN MOVED INSIDE THE startGame FUNCTION
    setTimeout(() => {
      setGameState(prevState => ({
        ...prevState,
        gameStatus: 'playing',
      }));
    }, 1500); // This duration MUST match the CSS transition time!
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

      if (nextScene.onArrive) {
        if (nextScene.onArrive.addItem && !newInventory.includes(nextScene.onArrive.addItem)) {
          newInventory.push(nextScene.onArrive.addItem);
        }
        if (nextScene.onArrive.takeDamage) {
          newHp -= nextScene.onArrive.takeDamage;
        }
      }

      if (newHp <= 0) {
        newGameStatus = 'gameOver';
        finalSceneKey = 'gameOver_hp';
      } else if (storyData[finalSceneKey].isEnding) {
        newGameStatus = finalSceneKey.toLowerCase().includes('good') ? 'victory' : 'gameOver';
      }

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