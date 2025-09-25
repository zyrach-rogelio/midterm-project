// src/App.jsx

import React, { useContext, useState, useEffect } from 'react'; // Add useState and useEffect
import { GameContext } from './context/gamecontext.jsx'; // Corrected path
import StartScreen from './components/startscreen.jsx';
import GameScreen from './components/gamescreen.jsx';
import GameOverScreen from './components/gameoverscreen.jsx';
import { usePrevious } from './hooks/useprevious.jsx'; // Import our new hook
import './App.css';

function App() {
  const { gameState, storyData } = useContext(GameContext);
  const [isShaking, setIsShaking] = useState(false); // State to control the animation class

  // Get the previous HP value using our custom hook
  const prevHp = usePrevious(gameState.hp);

  // This effect runs every time the player's HP changes
  useEffect(() => {
    // Check if prevHp has a value and if the new HP is less than the old one
    if (prevHp !== undefined && gameState.hp < prevHp) {
      setIsShaking(true); // Trigger the shake

      // Set a timer to remove the shake class after the animation finishes
      // This is crucial so it can be re-triggered later!
      const timeoutId = setTimeout(() => {
        setIsShaking(false);
      }, 820); // Must be slightly longer than the CSS animation duration

      // Cleanup function to prevent memory leaks if the component unmounts
      return () => clearTimeout(timeoutId);
    }
  }, [gameState.hp, prevHp]);


  const renderGameState = () => {
    const endingMessage = storyData[gameState.currentScene]?.text;
    switch (gameState.gameStatus) {
      case 'start':
        return <StartScreen />;
      case 'playing':
        return <GameScreen />;
      case 'gameOver':
        return <GameOverScreen message={endingMessage} />;
      case 'victory':
        return <GameOverScreen message={endingMessage} />;
      default:
        return <StartScreen />;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Aswang Hunter</h1>
      </header>
      {/*
        Conditionally add the 'shake' class to the main container.
        We use a template literal to combine class names.
      */}
      <main className={`game-container ${isShaking ? 'shake' : ''}`}>
        {renderGameState()}
      </main>
    </div>
  );
}

export default App;