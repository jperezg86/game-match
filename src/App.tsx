import React from 'react';
import logo from './logo.svg';
import './App.css';
import GameWrapper from './components/GameWrapper/GameWrapper';

function App() {
  return (
    <div className="App">
      <GameWrapper 
        data={{ 'France': 'Paris', 'Germany': 'Berlin', 'Italy': 'Rome' }} 
        maxErrors={3}
        />
    </div>
  );
}

export default App;
