// src/components/shared/TelemetryGraph.jsx
// Reusable live-updating altitude/checkpoint telemetry graph
// Compliant with PRD §12 & TRD §5.2 (numeric axis labels, text trend descriptions, accessible)

import React, { useMemo } from 'react';

export default function TelemetryGraph({
  points = [], // Array of numbers or { x, y } points
  projected = [], // Projected upcoming points e.g. [{ x, y }] or numbers
  highlightIndex = null,
  showTrendLine = true,
  targetValue = null,
  targetIndex = null,
  width = 460,
  height = 220,
  title = "ROCKET TELEMETRY FEED",
  yAxisLabel = "Altitude (m)",
  xAxisLabel = "Checkpoint (n)",
}) {
  // Normalize points into { x, y }
  const normalizedPoints = useMemo(() => {
    return points.map((p, idx) => {
      if (typeof p === 'number') return { x: idx + 1, y: p, rawIndex: idx };
      if (p && typeof p.y === 'number') return { x: p.x ?? idx + 1, y: p.y, rawIndex: idx };
      return { x: idx + 1, y: null, rawIndex: idx };
    });
  }, [points]);

  const normalizedProjected = useMemo(() => {
    const baseOffset = normalizedPoints.length;
    return projected.map((p, idx) => {
      if (typeof p === 'number') return { x: baseOffset + idx + 1, y: p };
      if (p && typeof p.y === 'number') return { x: p.x ?? baseOffset + idx + 1, y: p.y };
      return null;
    }).filter(Boolean);
  }, [projected, normalizedPoints.length]);

  // Combine valid points to calculate bounds
  const validPoints = useMemo(() => {
    const list = [...normalizedPoints.filter(p => p.y !== null)];
    normalizedProjected.forEach(p => list.push(p));
    if (targetValue != null && targetIndex != null) {
      list.push({ x: targetIndex, y: targetValue });
    }
    return list;
  }, [normalizedPoints, normalizedProjected, targetValue, targetIndex]);

  // Bounds
  const { minX, maxX, minY, maxY, trendRate } = useMemo(() => {
    if (validPoints.length === 0) {
      return { minX: 1, maxX: 6, minY: 0, maxY: 100, trendRate: 0 };
    }
    let mxX = Math.max(...validPoints.map(p => p.x), 5);
    let mnX = Math.min(...validPoints.map(p => p.x), 1);
    let mxY = Math.max(...validPoints.map(p => p.y));
    let mnY = Math.min(...validPoints.map(p => p.y));

    if (mxY === mnY) {
      mxY += 20;
      mnY = Math.max(0, mnY - 20);
    }
    // Pad Y axis by 10%
    const yPadding = Math.max((mxY - mnY) * 0.12, 10);
    const calculatedMinY = Math.floor((mnY - yPadding) / 10) * 10;
    const calculatedMaxY = Math.ceil((mxY + yPadding) / 10) * 10;

    // Rate calculation
    let rate = 0;
    if (validPoints.length >= 2) {
      const pFirst = validPoints[0];
      const pLast = validPoints[validPoints.length - 1];
      if (pLast.x !== pFirst.x) {
        rate = Math.round((pLast.y - pFirst.y) / (pLast.x - pFirst.x));
      }
    }

    return {
      minX: Math.max(1, mnX),
      maxX: Math.max(mxX, mnX + 4),
      minY: calculatedMinY,
      maxY: calculatedMaxY,
      trendRate: rate,
    };
  }, [validPoints]);

  // Graph Margins
  const margin = { top: 28, right: 30, bottom: 36, left: 54 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Coordinate mappers
  const scaleX = (x) => {
    if (maxX === minX) return margin.left + innerWidth / 2;
    return margin.left + ((x - minX) / (maxX - minX)) * innerWidth;
  };

  const scaleY = (y) => {
    if (maxY === minY) return margin.top + innerHeight / 2;
    return margin.top + innerHeight - ((y - minY) / (maxY - minY)) * innerHeight;
  };

  // Y-axis tick values (4 clean steps)
  const yTicks = useMemo(() => {
    const ticks = [];
    const step = (maxY - minY) / 3;
    for (let i = 0; i <= 3; i++) {
      ticks.push(Math.round(minY + i * step));
    }
    return ticks;
  }, [minY, maxY]);

  // X-axis tick values (integer checkpoints)
  const xTicks = useMemo(() => {
    const ticks = [];
    for (let x = minX; x <= maxX; x++) {
      ticks.push(x);
    }
    return ticks;
  }, [minX, maxX]);

  // Path generator for continuous polyline
  const validSeq = normalizedPoints.filter(p => p.y !== null);
  const pathD = validSeq.length > 1
    ? validSeq.map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(p.x)} ${scaleY(p.y)}`).join(' ')
    : '';

  // Projected path
  let projectedPathD = '';
  if (normalizedProjected.length > 0 && validSeq.length > 0) {
    const lastValid = validSeq[validSeq.length - 1];
    const allProj = [lastValid, ...normalizedProjected];
    projectedPathD = allProj.map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(p.x)} ${scaleY(p.y)}`).join(' ');
  }

  // Trend description for accessibility & clarity
  const trendText = trendRate > 0
    ? `Ascending: +${trendRate}m per checkpoint`
    : trendRate < 0
    ? `Descending: ${trendRate}m per checkpoint`
    : `Constant altitude: ${points[0]?.y ?? points[0] ?? 0}m`;

  return (
    <div
      className="telemetry-graph-card"
      style={{
        background: 'rgba(8, 14, 34, 0.85)',
        border: '1.5px solid rgba(56, 189, 248, 0.25)',
        borderRadius: '16px',
        padding: '10px 12px',
        position: 'relative',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
        width: '100%',
        maxWidth: `${width}px`,
        margin: '0 auto',
      }}
    >
      {/* Telemetry Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '6px',
          padding: '0 4px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '4px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.9rem', color: '#38bdf8' }}>🛰️</span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: '#38bdf8',
              textTransform: 'uppercase',
            }}
          >
            {title}
          </span>
        </div>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: trendRate >= 0 ? '#34d399' : '#f87171',
            background: 'rgba(255, 255, 255, 0.06)',
            padding: '2px 8px',
            borderRadius: '999px',
            border: `1px solid ${trendRate >= 0 ? 'rgba(52, 211, 153, 0.3)' : 'rgba(248, 113, 113, 0.3)'}`,
          }}
          aria-label={trendText}
        >
          {trendRate >= 0 ? '↗' : '↘'} {trendText}
        </span>
      </div>

      {/* SVG Canvas */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
        role="img"
        aria-label={`Altitude vs Checkpoint Graph. ${trendText}`}
      >
        <defs>
          <linearGradient id="telemetryLineGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="areaFillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
          </linearGradient>
          <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Gridlines - Horizontal */}
        {yTicks.map((val, idx) => {
          const y = scaleY(val);
          return (
            <g key={`y-${idx}`}>
              <line
                x1={margin.left}
                y1={y}
                x2={width - margin.right}
                y2={y}
                stroke="rgba(255, 255, 255, 0.08)"
                strokeDasharray="4 4"
              />
              <text
                x={margin.left - 8}
                y={y + 4}
                textAnchor="end"
                fontSize="10"
                fontFamily="var(--font-mono)"
                fill="rgba(226, 232, 240, 0.6)"
              >
                {val}m
              </text>
            </g>
          );
        })}

        {/* Gridlines - Vertical */}
        {xTicks.map((xVal) => {
          const x = scaleX(xVal);
          return (
            <g key={`x-${xVal}`}>
              <line
                x1={x}
                y1={margin.top}
                x2={x}
                y2={height - margin.bottom}
                stroke="rgba(255, 255, 255, 0.05)"
              />
              <text
                x={x}
                y={height - margin.bottom + 16}
                textAnchor="middle"
                fontSize="10"
                fontFamily="var(--font-mono)"
                fill="rgba(226, 232, 240, 0.7)"
              >
                T{xVal}
              </text>
            </g>
          );
        })}

        {/* Axis Labels */}
        <text
          x={margin.left}
          y={margin.top - 10}
          fontSize="9"
          fontFamily="var(--font-mono)"
          fill="#38bdf8"
          fontWeight="bold"
        >
          {yAxisLabel}
        </text>
        <text
          x={width - margin.right}
          y={height - margin.bottom + 16}
          textAnchor="end"
          fontSize="9"
          fontFamily="var(--font-mono)"
          fill="#818cf8"
        >
          {xAxisLabel}
        </text>

        {/* Area fill under curve */}
        {validSeq.length > 1 && (
          <path
            d={`${pathD} L ${scaleX(validSeq[validSeq.length - 1].x)} ${scaleY(minY)} L ${scaleX(validSeq[0].x)} ${scaleY(minY)} Z`}
            fill="url(#areaFillGrad)"
          />
        )}

        {/* Main Telemetry Line */}
        {pathD && showTrendLine && (
          <path
            d={pathD}
            fill="none"
            stroke="url(#telemetryLineGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glowEffect)"
          />
        )}

        {/* Projected Line (Dashed) */}
        {projectedPathD && (
          <path
            d={projectedPathD}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2.5"
            strokeDasharray="6 6"
          />
        )}

        {/* Target Checkpoint Indicator if provided */}
        {targetValue != null && targetIndex != null && (
          <g>
            <circle
              cx={scaleX(targetIndex)}
              cy={scaleY(targetValue)}
              r="10"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2"
              strokeDasharray="3 3"
              className="anim-pulse"
            />
            <text
              x={scaleX(targetIndex)}
              y={scaleY(targetValue) - 14}
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fontFamily="var(--font-mono)"
              fill="#fbbf24"
            >
              TARGET: {targetValue}m
            </text>
          </g>
        )}

        {/* Telemetry Points */}
        {normalizedPoints.map((pt, i) => {
          if (pt.y === null) {
            // Corrupted / Missing term indicator
            return (
              <g key={`corrupt-${i}`}>
                <circle
                  cx={scaleX(pt.x)}
                  cy={innerHeight / 2 + margin.top}
                  r="7"
                  fill="rgba(244, 63, 94, 0.2)"
                  stroke="#f43f5e"
                  strokeWidth="2"
                  strokeDasharray="2 2"
                />
                <text
                  x={scaleX(pt.x)}
                  y={innerHeight / 2 + margin.top + 4}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="bold"
                  fill="#f43f5e"
                >
                  ?
                </text>
                <text
                  x={scaleX(pt.x)}
                  y={innerHeight / 2 + margin.top + 22}
                  textAnchor="middle"
                  fontSize="8"
                  fill="#f43f5e"
                  fontFamily="var(--font-mono)"
                >
                  CORRUPTED
                </text>
              </g>
            );
          }

          const isHighlighted = highlightIndex === i || highlightIndex === pt.x;
          const cx = scaleX(pt.x);
          const cy = scaleY(pt.y);

          return (
            <g key={`pt-${i}`}>
              {/* Outer halo if highlighted */}
              {isHighlighted && (
                <circle
                  cx={cx}
                  cy={cy}
                  r="12"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  opacity="0.8"
                />
              )}
              {/* Point dot */}
              <circle
                cx={cx}
                cy={cy}
                r={isHighlighted ? 6 : 4.5}
                fill={isHighlighted ? '#fbbf24' : '#38bdf8'}
                stroke="#0f172a"
                strokeWidth="2"
              />
              {/* Value Label above dot */}
              <text
                x={cx}
                y={cy - 9}
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fontFamily="var(--font-mono)"
                fill={isHighlighted ? '#fbbf24' : '#ffffff'}
              >
                {pt.y}
              </text>
            </g>
          );
        })}

        {/* Projected points */}
        {normalizedProjected.map((pt, i) => (
          <g key={`proj-${i}`}>
            <circle
              cx={scaleX(pt.x)}
              cy={scaleY(pt.y)}
              r="5"
              fill="#f59e0b"
              stroke="#0f172a"
              strokeWidth="2"
            />
            <text
              x={scaleX(pt.x)}
              y={scaleY(pt.y) - 9}
              textAnchor="middle"
              fontSize="9"
              fontWeight="700"
              fontFamily="var(--font-mono)"
              fill="#f59e0b"
            >
              {pt.y}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
