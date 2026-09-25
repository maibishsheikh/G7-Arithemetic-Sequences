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
      width="38"
      height="46"
      viewBox="0 0 44 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="golden-lock-svg"
      aria-hidden="true"
    >
      {/* Shackle */}
      <path
        d="M12 21V13C12 7.47715 16.4772 3 22 3C27.5228 3 32 7.47715 32 13V21"
        stroke="url(#shackleGrad)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Lock Body */}
      <rect
        x="3"
        y="19"
        width="38"
        height="31"
        rx="7"
        fill="url(#goldBodyGrad)"
        stroke="#b45309"
        strokeWidth="1.2"
      />
      {/* Keyhole */}
      <circle cx="22" cy="32" r="3.2" fill="#451a03" />
      <path d="M22 34V41" stroke="#451a03" strokeWidth="2.8" strokeLinecap="round" />

      <defs>
        <linearGradient id="shackleGrad" x1="12" y1="3" x2="32" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#e2e8f0" />
          <stop offset="0.5" stopColor="#94a3b8" />
          <stop offset="1" stopColor="#64748b" />
        </linearGradient>
        <linearGradient id="goldBodyGrad" x1="3" y1="19" x2="41" y2="50" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fde047" />
          <stop offset="0.3" stopColor="#eab308" />
          <stop offset="0.75" stopColor="#ca8a04" />
          <stop offset="1" stopColor="#92400e" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Unlocked World SVG Icon (neon-styled like the bicycle in screenshot)
function WorldIcon({ idx, emoji }) {
  if (idx === 0) {
    // Neon green launch vehicle / cycle line-art
    return (
      <svg
        width="40"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#4ade80"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="neon-world-svg"
      >
        <circle cx="5.5" cy="17.5" r="3.5" />
        <circle cx="18.5" cy="17.5" r="3.5" />
        <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5L9 11l3-3 3 3-3 6.5z" />
        <path d="M5.5 17.5l3.5-6.5h6l3.5 6.5" />
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
          <h2 className="worlds-title">Arithmetic Progression Worlds</h2>
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
                  Q{startQ}–{endQ}
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
