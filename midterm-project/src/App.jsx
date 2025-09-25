// src/App.jsx

import React, { useContext, useState, useEffect } from 'react';
import { GameContext } from './context/gamecontext.jsx';
import StartScreen from './components/startscreen.jsx';
import GameScreen from './components/gamescreen.jsx';
import GameOverScreen from './components/gameoverscreen.jsx';
import { usePrevious } from './hooks/useprevious.jsx';
import './App.css';

function App() {
  const { gameState, storyData } = useContext(GameContext);
  const { gameStatus } = gameState;
  const [isShaking, setIsShaking] = useState(false);
  const prevHp = usePrevious(gameState.hp);

  useEffect(() => {
    if (prevHp !== undefined && gameState.hp < prevHp) {
      setIsShaking(true);
      const timeout = setTimeout(() => setIsShaking(false), 820);
      return () => clearTimeout(timeout);
    }
  }, [gameState.hp, prevHp]);

  // We determine which screen is visible based on the game status
  const showStartScreen = gameStatus === 'start' || gameStatus === 'starting';
  const showGameScreen = gameStatus === 'playing' || gameStatus === 'starting';
  const showEndScreen = gameStatus === 'gameOver' || gameStatus === 'victory';

  const endingMessage = storyData[gameState.currentScene]?.text;

  return (
    <div className="App container py-4">
      <header className="App-header">
        <h1>Aswang Hunter</h1>
      </header>
      
      <main className={`game-container mt-4${isShaking ? ' shake' : ''}`}>
        {/* The screen container manages the stacking of our screens */}
        <div className="screen-container">

          {/* --- START SCREEN --- */}
          {/* It's always rendered until the 'playing' state begins */}
          {showStartScreen && (
            <div className={`screen ${gameStatus === 'starting' ? 'fade-out' : 'fade-in'}`}>
              <StartScreen />
            </div>
          )}
          
          {/* --- GAME SCREEN --- */}
          {/* It's rendered during the transition and gameplay */}
          {showGameScreen && (
            <div className={`screen ${gameStatus === 'starting' ? 'fade-in' : ''}`}>
              {/* We apply a base style of opacity 0 so it can fade in */}
              <div style={{ opacity: gameStatus === 'playing' ? 1 : 0, transition: 'opacity 1.5s ease-in-out' }}>
                 <GameScreen />
              </div>
            </div>
          )}

          {/* --- END SCREEN --- */}
          {showEndScreen && (
            <div className="screen fade-in">
              <GameOverScreen message={endingMessage} />
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default App;