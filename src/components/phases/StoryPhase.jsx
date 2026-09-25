// src/components/phases/StoryPhase.jsx
import React, { useEffect, useState } from 'react';
import './StoryPhase.css';
import { STORY_PANELS } from '../../data/storyContent.js';
import { useAudio } from '../../hooks/useAudio.js';
import { storyNarration } from '../../utils/narration.js';
import TelemetryGraph from '../shared/TelemetryGraph.jsx';
import ProgressionVisual from '../shared/ProgressionVisual.jsx';

import story1 from '../../assets/story/1.png';
import story2 from '../../assets/story/2.png';
import story3 from '../../assets/story/3.png';
import story4 from '../../assets/story/4.png';

const STORY_IMAGES = [story1, story2, story3, story4];

function StoryImage({ panel }) {
  const [imgError, setImgError] = useState(false);
  const imageSrc = STORY_IMAGES[panel.panel];

  useEffect(() => {
    setImgError(false);
  }, [panel.panel]);

  // For panel 3 (Trajectory Formula) or panel 0 & 3 telemetry, show live telemetry or formula breakdown when no custom PNG
  const showTelemetryVisual = panel.panel === 3 || panel.panel === 0;
  const showFormulaVisual = panel.panel === 2;

  return (
    <div className="story-image-container">
      {!imgError && imageSrc ? (
        <img
          key={panel.panel}
          src={imageSrc}
          alt={panel.title}
          onError={() => setImgError(true)}
          className="story-full-img"
        />
      ) : showTelemetryVisual && panel.telemetry ? (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px',
            background: panel.imageBg,
            borderRadius: '16px',
          }}
        >
          <TelemetryGraph
            points={panel.telemetry}
            highlightIndex={panel.panel === 3 ? 6 : null}
            targetValue={54}
            targetIndex={6}
            width={380}
            height={200}
            title={panel.panel === 0 ? "TELEMETRY CORRUPTED" : "READING 6 RECOVERED"}
          />
        </div>
      ) : showFormulaVisual ? (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            background: panel.imageBg,
            borderRadius: '16px',
            gap: '12px',
          }}
        >
          <span style={{ fontSize: '3rem' }}>🧮</span>
          <ProgressionVisual
            type="formula-breakdown"
            data={{ a: 50, d: -6, n: 6, Tn: 'T₆' }}
            compact={false}
          />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              color: '#f472b6',
              textAlign: 'center',
            }}
          >
            Descending Stage: T₆ = 50 + (5) × (−6) = 20m
          </span>
        </div>
      ) : (
        <div className="story-img-fallback" style={{ background: panel.imageBg }}>
          <span className="fallback-emoji">{panel.imageEmoji}</span>
          <span className="fallback-title">{panel.title}</span>
          <span className="fallback-highlight">{panel.highlight}</span>
        </div>
      )}
    </div>
  );
}

export default function StoryPhase({ state, dispatch }) {
  const panel = STORY_PANELS[state?.storyPanel || 0] || STORY_PANELS[0];
  const { narrate, stopAll } = useAudio(state?.audioEnabled ?? true);
  const totalPanels = STORY_PANELS.length;
  const isLastPanel = (state?.storyPanel || 0) >= totalPanels - 1;

  useEffect(() => {
    stopAll();
    const timer = setTimeout(() => narrate(storyNarration(state?.storyPanel || 0)), 300);
    return () => { clearTimeout(timer); stopAll(); };
  }, [state?.storyPanel, narrate, stopAll]);

  function handleNext() {
    stopAll();
    dispatch({ type: 'NEXT_STORY_PANEL' });
  }

  function handlePrev() {
    stopAll();
    dispatch({ type: 'PREV_STORY_PANEL' });
  }

  return (
    <div className="story-wrap">
      <div className="story-container anim-slide-up" key={state?.storyPanel || 0}>
        {/* Top Progress Bar Row */}
        <div className="story-progress-bar-row">
          <div className="story-track">
            <div
              className="story-fill"
              style={{ width: `${(((state?.storyPanel || 0) + 1) / totalPanels) * 100}%` }}
            />
          </div>
          <span className="story-counter-text">{(state?.storyPanel || 0) + 1} / {totalPanels}</span>
        </div>

        {/* Main Horizontal Story Card */}
        <div className="story-main-card">
          {/* Left: Image / Visual section */}
          <div className="story-image-section">
            <StoryImage panel={panel} />
          </div>

          {/* Right: Story Content */}
          <div className="story-content-section">
            <h2 className="story-title">{panel.title}</h2>
            <p className="story-text">{panel.text}</p>

            {panel.highlight && (
              <div className="story-prompt-pill">
                <span className="prompt-icon">💡</span>
                <span className="prompt-text">{panel.highlight}</span>
              </div>
            )}

            {/* Character Badge */}
            <div className="story-character-badge">
              <div className="character-avatar-circle">
                <span className="character-emoji">{panel.characterEmoji || '🤖'}</span>
              </div>
              <span className="character-name">{panel.character || 'Orbit the Mission Bot'}</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Centered Dots + Action Buttons */}
        <div className="story-footer-nav">
          <div className="story-dots-center">
            {STORY_PANELS.map((_, i) => (
              <span
                key={i}
                className={`story-nav-dot ${i === (state?.storyPanel || 0) ? 'active' : ''} ${i < (state?.storyPanel || 0) ? 'done' : ''}`}
              />
            ))}
          </div>

          <div className="story-nav-actions">
            {(state?.storyPanel || 0) > 0 && (
              <button
                type="button"
                id="story-prev-btn"
                className="btn btn-outline btn-sm story-prev-btn"
                onClick={handlePrev}
                aria-label="Previous story"
              >
                ← Back
              </button>
            )}
            <button
              type="button"
              id="story-next-btn"
              className="btn btn-primary btn-sm story-next-btn"
              onClick={handleNext}
              aria-label={isLastPanel ? 'Start Simulating' : 'Next story'}
            >
              {!isLastPanel ? 'Next →' : 'Simulate! 🧪'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
