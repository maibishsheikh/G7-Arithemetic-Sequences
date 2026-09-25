// src/components/gamification/KingdomMap.jsx
// World Map for ProgressionQuest: Grade 7 Arithmetic Sequences
// Strictly formatted per user reference screenshot & PRD/TRD specs

import React from 'react';
import './KingdomMap.css';
import { calcStars } from '../../utils/scoring.js';
import { DISTRICTS } from '../../data/questionBank.js';

// Golden 3D Padlock SVG matching the user screenshot exactly
function GoldenLockIcon() {
  return (
    <svg
      width="34"
      height="42"
      viewBox="0 0 36 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="golden-lock-svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="shackleGrad" x1="10" y1="2" x2="26" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f1f5f9" />
          <stop offset="0.4" stopColor="#cbd5e1" />
          <stop offset="0.75" stopColor="#94a3b8" />
          <stop offset="1" stopColor="#64748b" />
        </linearGradient>
        <linearGradient id="goldBodyGrad" x1="3" y1="16" x2="33" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fef08a" />
          <stop offset="0.25" stopColor="#eab308" />
          <stop offset="0.7" stopColor="#ca8a04" />
          <stop offset="1" stopColor="#92400e" />
        </linearGradient>
      </defs>
      {/* Shackle */}
      <path
        d="M11 17V10.5C11 6.35786 14.134 3 18 3C21.866 3 25 6.35786 25 10.5V17"
        stroke="url(#shackleGrad)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Lock Body */}
      <rect
        x="3"
        y="16"
        width="30"
        height="25"
        rx="6"
        fill="url(#goldBodyGrad)"
        stroke="#a16207"
        strokeWidth="0.8"
      />
      {/* Keyhole */}
      <circle cx="18" cy="27" r="2.4" fill="#3b1d03" />
      <path d="M18 28.5V34" stroke="#3b1d03" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

// Unlocked World SVG Icon (neon-styled bicycle matching user screenshot)
function WorldIcon({ idx, emoji }) {
  if (idx === 0) {
    // Crisp neon green bicycle line-art matching reference image exactly
    return (
      <svg
        width="42"
        height="30"
        viewBox="0 0 34 24"
        fill="none"
        stroke="#4ade80"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="neon-world-svg"
        aria-hidden="true"
      >
        {/* Rear wheel */}
        <circle cx="7" cy="16.5" r="5" />
        <circle cx="7" cy="16.5" r="0.75" fill="#4ade80" />
        {/* Front wheel */}
        <circle cx="27" cy="16.5" r="5" />
        <circle cx="27" cy="16.5" r="0.75" fill="#4ade80" />
        {/* Crank / Pedals */}
        <circle cx="16" cy="16.5" r="1.2" fill="#4ade80" />
        {/* Chainstay */}
        <line x1="7" y1="16.5" x2="16" y2="16.5" />
        {/* Seatstay */}
        <line x1="7" y1="16.5" x2="13" y2="7.5" />
        {/* Seat tube */}
        <line x1="16" y1="16.5" x2="13" y2="7.5" />
        {/* Saddle */}
        <line x1="10.5" y1="7.5" x2="15.5" y2="7.5" strokeWidth="2.4" />
        {/* Down tube */}
        <line x1="16" y1="16.5" x2="23" y2="9.5" />
        {/* Top tube */}
        <line x1="13" y1="9.5" x2="23" y2="9.5" />
        {/* Fork & Stem */}
        <line x1="27" y1="16.5" x2="23" y2="6.5" />
        {/* Handlebars */}
        <path d="M21 6.5h2.5c1 0 1.5.5 1.5 1.5" />
      </svg>
    );
  }

  // Fallback to thematic emoji with glow for other unlocked worlds
  return <span className="world-emoji-icon">{emoji || '🚀'}</span>;
}

export default function KingdomMap({
  districtScores = [],
  districtCorrect = [],
  currentDistrict = 0,
  onSelectDistrict,
}) {
  // Calculate total stars across all completed worlds
  const totalStars = districtScores.reduce((sum, score) => {
    if (score === null || score === undefined) return sum;
    return sum + calcStars(score);
  }, 0);

  return (
    <div className="worlds-container glass-card">
      {/* Glowing neon green accent capsule at top center */}
      <div className="worlds-accent-bar" />

      {/* Header row with Title, Subtitle, and Star pill */}
      <div className="worlds-header-row">
        <div className="worlds-header-left">
          <h2 className="worlds-title">Arithmetic Progression Game Worlds</h2>
          <p className="worlds-subtitle">
            10 Themed Worlds · Need 4/10 Correct to Unlock Next World
          </p>
        </div>

        <div className="worlds-star-pill">
          <span className="star-icon">⭐</span>
          <span className="star-text">{totalStars} / 30</span>
        </div>
      </div>

      {/* 2x5 Grid of 10 Worlds */}
      <div className="worlds-grid">
        {DISTRICTS.map((dist, idx) => {
          const isCurrent = idx === currentDistrict;
          const isCompleted =
            districtScores[idx] !== null && districtScores[idx] !== undefined;

          // Unlock rule: W1 always unlocked; W_n unlocked if W_(n-1) >= 4 correct OR currentDistrict >= idx OR completed
          const prevCorrect = idx > 0 ? (districtCorrect[idx - 1] || 0) : 10;
          const isUnlocked =
            idx === 0 ||
            prevCorrect >= 4 ||
            idx <= currentDistrict ||
            isCompleted;

          const stars = isCompleted ? calcStars(districtScores[idx]) : 0;
          const startQ = idx * 10 + 1;
          const endQ = (idx + 1) * 10;

          return (
            <div
              key={dist.id || idx}
              className={`world-card ${isCurrent ? 'active' : ''} ${
                isCompleted ? 'completed' : ''
              } ${!isUnlocked ? 'locked' : ''}`}
              onClick={() => isUnlocked && onSelectDistrict && onSelectDistrict(idx)}
              role="button"
              tabIndex={isUnlocked ? 0 : -1}
              aria-label={`World ${idx + 1}: ${dist.name}. ${
                isUnlocked ? 'Unlocked' : 'Locked'
              }`}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && isUnlocked) {
                  e.preventDefault();
                  onSelectDistrict && onSelectDistrict(idx);
                }
              }}
            >
              {/* Card Top Row: W# on left, Q#-# on right */}
              <div className="world-card-top">
                <span className="world-w-tag">W{idx + 1}</span>
                <span className="world-q-tag">
                  Q{startQ}-{endQ}
                </span>
              </div>

              {/* Center Icon: Padlock if locked, Themed Icon if unlocked */}
              <div className="world-card-icon-wrap">
                {isUnlocked ? (
                  <WorldIcon idx={idx} emoji={dist.emoji} />
                ) : (
                  <GoldenLockIcon />
                )}
              </div>

              {/* World Name */}
              <div className="world-card-name" title={dist.name}>
                {dist.name}
              </div>

              {/* Bottom Status / Play Link */}
              <div className="world-card-status">
                {isCompleted ? (
                  <span className="world-stars-earned">
                    {'⭐'.repeat(stars)}
                  </span>
                ) : isUnlocked ? (
                  <span className="world-play-btn">Play →</span>
                ) : (
                  <span className="world-locked-text">Locked</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
