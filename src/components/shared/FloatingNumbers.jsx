// src/components/shared/FloatingNumbers.jsx
// Ambient floating telemetry and progression symbols
import React, { useMemo } from 'react';
import './FloatingNumbers.css';

const TELEMETRY_SYMBOLS = [
  'Tₙ',
  'a + (n−1)d',
  '📡',
  '🚀',
  'd = +8',
  'd = −5',
  '🛰️',
  'Sₙ',
  'T₁',
  'T₆',
  'T₁₀',
  '⭐',
  '⚡',
  '📊',
  '🛸',
  'Δ',
  'Σ',
  '🤖',
  '+d',
  '−d',
];

export default function FloatingNumbers() {
  const items = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      symbol: TELEMETRY_SYMBOLS[i % TELEMETRY_SYMBOLS.length],
      left: `${(i * 5.6 + 3) % 94}%`,
      delay: `${(i * 1.3) % 15}s`,
      duration: `${18 + (i % 5) * 4}s`,
      size: `${1.0 + (i % 4) * 0.35}rem`,
    }));
  }, []);

  return (
    <div className="floating-symbols-container" aria-hidden="true">
      {items.map((item) => (
        <span
          key={item.id}
          className="floating-money-symbol"
          style={{
            left: item.left,
            animationDelay: item.delay,
            animationDuration: item.duration,
            fontSize: item.size,
            opacity: 0.15,
            fontFamily: 'var(--font-mono)',
          }}
        >
          {item.symbol}
        </span>
      ))}
    </div>
  );
}
