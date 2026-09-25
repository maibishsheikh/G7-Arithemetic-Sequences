// src/components/shared/Mascot.jsx
// Mascot component for Orbit the Mission Bot 🤖
// Defined per PRD §7 & TRD §3

import React from 'react';
import './Mascot.css';

export default function Mascot({ mood = 'curious', message, size = 'md' }) {
  // Select emoji based on mood
  let emoji = '🤖';
  if (mood === 'celebrate') emoji = '🚀';
  else if (mood === 'thinking') emoji = '🛰️';
  else if (mood === 'alert' || mood === 'warning') emoji = '⚠️';
  else if (mood === 'excited') emoji = '✨';

  return (
    <div className={`mascot-row-wrap mascot-${size}`}>
      <div className={`mascot-avatar-circle mood-${mood}`} title="Orbit the Mission Bot">
        <span className="mascot-avatar-emoji">{emoji}</span>
      </div>
      {message && (
        <div className="mascot-speech-bubble anim-fade-in">
          <span className="speech-text">{message}</span>
        </div>
      )}
    </div>
  );
}
