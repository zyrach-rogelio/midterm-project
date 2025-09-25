// src/components/StartScreen.jsx

import React, { useState, useContext } from 'react';
import { GameContext } from '../context/gamecontext.jsx';

const StartScreen = () => {
  const [name, setName] = useState('');
  const { startGame } = useContext(GameContext);

   const [isShining, setIsShining] = useState(false);

  const handleStart = (e) => {
    e.preventDefault(); // Prevents page reload on form submission
    if (name.trim()) {
      setIsShining(true);
      setTimeout(() => {
        startGame(name.trim());
      }, 100);
    }
  };

  return (
    <div className="start-screen">
      <h2>Enter Your Name, Hunter</h2>
      <form onSubmit={handleStart}>
        <input
         className='form-control mb-3' //boostrap
         type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name is..."
          autoFocus
        />
        <button 
            type="submit"
                className={`btn btn-danger bt-lg shine-button ${isShining ? 'is-shining': '' }`}>Begin Adventure</button>
      </form>
    </div>
  );
};

export default StartScreen;