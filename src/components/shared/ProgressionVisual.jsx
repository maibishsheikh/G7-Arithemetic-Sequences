// src/components/shared/ProgressionVisual.jsx
// Visual component for arithmetic progression concepts in questions and lessons
// Supported types: sequence-strip, telemetry-readout, formula-breakdown, interpolation-gap
// Defined per TRD §5.1

import React from 'react';
import TelemetryGraph from './TelemetryGraph.jsx';

export default function ProgressionVisual({ type, data = {}, compact = false }) {
  if (!type) return null;

  // 1. SEQUENCE STRIP: Displays terms with T1, T2, T3 tags and +d connectors
  if (type === 'sequence-strip') {
    const terms = data.terms || [];
    const d = data.d;
    const highlightIndex = data.highlightIndex;

    return (
      <div
        className={`progression-strip-wrap ${compact ? 'compact' : ''}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: compact ? '4px' : '8px',
          padding: compact ? '8px 4px' : '12px 8px',
          background: 'rgba(15, 23, 42, 0.65)',
          borderRadius: '14px',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          margin: '6px 0',
        }}
      >
        {terms.map((val, idx) => {
          const isHighlighted = highlightIndex === idx;
          const isCorrupt = val === null || val === undefined || val === '?';
          const nextVal = terms[idx + 1];
          const hasNext = idx < terms.length - 1;

          // compute diff between consecutive terms if known
          let gapDiff = null;
          if (hasNext && typeof val === 'number' && typeof nextVal === 'number') {
            gapDiff = nextVal - val;
          } else if (d != null) {
            gapDiff = d;
          }

          return (
            <React.Fragment key={idx}>
              {/* Term Capsule */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: isCorrupt
                    ? 'rgba(244, 63, 94, 0.15)'
                    : isHighlighted
                    ? 'rgba(251, 191, 36, 0.2)'
                    : 'rgba(30, 41, 59, 0.85)',
                  border: `1.5px solid ${
                    isCorrupt
                      ? '#f43f5e'
                      : isHighlighted
                      ? '#fbbf24'
                      : 'rgba(56, 189, 248, 0.4)'
                  }`,
                  borderRadius: '10px',
                  padding: compact ? '4px 8px' : '6px 14px',
                  minWidth: compact ? '48px' : '62px',
                  boxShadow: isHighlighted ? '0 0 16px rgba(251, 191, 36, 0.35)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: compact ? '0.7rem' : '0.76rem',
                    color: '#94a3b8',
                    fontWeight: 600,
                  }}
                >
                  T{idx + 1}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: compact ? '1rem' : '1.25rem',
                    fontWeight: 800,
                    color: isCorrupt ? '#f43f5e' : isHighlighted ? '#fbbf24' : '#f8fafc',
                  }}
                >
                  {isCorrupt ? '?' : val}
                </span>
              </div>

              {/* Difference connector arrow */}
              {hasNext && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '0 2px',
                  }}
                >
                  {gapDiff !== null && data.showDifference !== false && (
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: compact ? '0.68rem' : '0.75rem',
                        fontWeight: 700,
                        color: gapDiff >= 0 ? '#34d399' : '#f87171',
                        background: 'rgba(15, 23, 42, 0.9)',
                        padding: '1px 5px',
                        borderRadius: '6px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        marginBottom: '2px',
                      }}
                    >
                      {gapDiff >= 0 ? `+${gapDiff}` : `${gapDiff}`}
                    </span>
                  )}
                  <span style={{ color: '#64748b', fontSize: compact ? '0.8rem' : '1rem' }}>
                    ➔
                  </span>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  // 2. TELEMETRY READOUT: Compact version of TelemetryGraph
  if (type === 'telemetry-readout') {
    return (
      <div style={{ margin: '4px 0', width: '100%' }}>
        <TelemetryGraph
          points={data.points || []}
          projected={data.projected || []}
          highlightIndex={data.highlightIndex}
          targetValue={data.targetValue}
          targetIndex={data.targetIndex}
          width={compact ? 380 : 440}
          height={compact ? 170 : 200}
          title={data.title || "TELEMETRY CHECKPOINT"}
        />
      </div>
    );
  }

  // 3. FORMULA BREAKDOWN: Color-coded explanation of Tn = a + (n - 1)d
  if (type === 'formula-breakdown') {
    const a = data.a ?? 'a';
    const d = data.d ?? 'd';
    const n = data.n ?? 'n';
    const Tn = data.Tn ?? 'Tₙ';

    return (
      <div
        className="formula-breakdown-card"
        style={{
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1.5px solid rgba(129, 140, 248, 0.3)',
          borderRadius: '14px',
          padding: compact ? '8px 12px' : '12px 18px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          margin: '6px 0',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.35)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: compact ? '6px' : '10px',
            fontFamily: 'var(--font-mono)',
            fontSize: compact ? '1.05rem' : '1.35rem',
            fontWeight: 800,
          }}
        >
          <span style={{ color: '#38bdf8' }}>{Tn}</span>
          <span style={{ color: '#94a3b8' }}>=</span>
          <span
            style={{
              color: '#34d399',
              background: 'rgba(52, 211, 153, 0.12)',
              padding: '2px 8px',
              borderRadius: '8px',
              border: '1px solid rgba(52, 211, 153, 0.3)',
            }}
          >
            {a}
          </span>
          <span style={{ color: '#94a3b8' }}>+</span>
          <span
            style={{
              color: '#fbbf24',
              background: 'rgba(251, 191, 36, 0.12)',
              padding: '2px 8px',
              borderRadius: '8px',
              border: '1px solid rgba(251, 191, 36, 0.3)',
            }}
          >
            ({n} − 1)
          </span>
          <span style={{ color: '#94a3b8' }}>×</span>
          <span
            style={{
              color: '#f472b6',
              background: 'rgba(244, 114, 182, 0.12)',
              padding: '2px 8px',
              borderRadius: '8px',
              border: '1px solid rgba(244, 114, 182, 0.3)',
            }}
          >
            {d < 0 ? `(${d})` : d}
          </span>
        </div>

        {/* Legend pills */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '0.74rem',
            fontFamily: 'var(--font-mono)',
            color: '#cbd5e1',
          }}
        >
          <span style={{ color: '#38bdf8' }}>● Tₙ: nth term</span>
          <span style={{ color: '#34d399' }}>● a: first term</span>
          <span style={{ color: '#fbbf24' }}>● (n−1): jumps</span>
          <span style={{ color: '#f472b6' }}>● d: difference</span>
        </div>
      </div>
    );
  }

  // 4. INTERPOLATION GAP: Strip with missing terms highlighted
  if (type === 'interpolation-gap') {
    const { sequence = [], known1, known2 } = data;

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          padding: '10px',
          background: 'rgba(15, 23, 42, 0.7)',
          borderRadius: '12px',
          border: '1px dashed rgba(245, 158, 11, 0.4)',
        }}
      >
        {sequence.map((item, idx) => {
          const isBlank = item == null || item === '?';
          const pos = idx + 1;
          const isKnown = pos === known1?.pos || pos === known2?.pos;

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '4px 10px',
                borderRadius: '8px',
                background: isBlank
                  ? 'rgba(245, 158, 11, 0.15)'
                  : isKnown
                  ? 'rgba(56, 189, 248, 0.2)'
                  : 'rgba(30, 41, 59, 0.6)',
                border: `1.5px solid ${
                  isBlank ? '#f59e0b' : isKnown ? '#38bdf8' : 'rgba(255, 255, 255, 0.1)'
                }`,
                minWidth: '50px',
              }}
            >
              <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                T{pos}
              </span>
              <span
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  color: isBlank ? '#f59e0b' : '#f8fafc',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {isBlank ? '?' : item}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return null;
}
