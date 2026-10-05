'use client';

import React from 'react';

export function RoadConditionDonut({ score = 82 }: { score?: number }) {
  // SVG circular progress calculation
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = '#2563EB'; // Blue
  let textColor = 'text-blue-600';
  let rating = 'Good Condition';

  if (score >= 85) {
    strokeColor = '#16A34A';
    textColor = 'text-emerald-600';
    rating = 'Optimal Surface';
  } else if (score < 70) {
    strokeColor = '#D97706';
    textColor = 'text-amber-600';
    rating = 'Requires Attention';
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="w-24 h-24 -rotate-90 transform" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#E2E8F0"
            strokeWidth="9"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={strokeColor}
            strokeWidth="9"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xl font-extrabold text-slate-900 tracking-tight leading-none">
            {score}%
          </span>
          <span className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">
            PCI Index
          </span>
        </div>
      </div>

      <div className="flex flex-col">
        <span className={`text-xs font-bold ${textColor}`}>{rating}</span>
        <span className="text-[11px] text-slate-500 mt-0.5 leading-snug">
          Weighted road network stability index
        </span>
        <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400 font-medium">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> &gt;80 Good
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> 60-80 Fair
          </span>
        </div>
      </div>
    </div>
  );
}
