// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { GameProvider } from './context/gamecontext.jsx'; // Import the provider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Wrap the entire App with GameProvider */}
    <GameProvider>
      <App />
    </GameProvider>
  </React.StrictMode>,
);