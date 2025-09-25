// src/components/StartScreen.jsx

import React, { useState, useContext } from 'react';
import { GameContext } from '../context/gamecontext.jsx';

const StartScreen = () => {
  const [name, setName] = useState('');
  const { startGame } = useContext(GameContext);

  const handleStart = (e) => {
    e.preventDefault(); // Prevents page reload on form submission
    if (name.trim()) {
      startGame(name.trim());
    }
  };

  return (
    <div className="start-screen">
      <h2>Enter Your Name, Hunter</h2>
      <form onSubmit={handleStart}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name..."
          autoFocus
        />
        <button type="submit">Begin Adventure</button>
      </form>
    </div>
  );
};

export default StartScreen;