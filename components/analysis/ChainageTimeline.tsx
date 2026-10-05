'use client';

import React, { useState } from 'react';
import { Play, Pause, RotateCcw, FastForward, MapPin } from 'lucide-react';
import { Defect } from '@/types';
import { formatDefectType } from '@/lib/utils';
import { useRoadVision } from '@/lib/context/RoadVisionContext';

interface ChainageTimelineProps {
  defects: Defect[];
  selectedDefectId: string | null;
  onSelectDefect: (defect: Defect) => void;
  maxDistanceMeters?: number;
}

export function ChainageTimeline({
  defects,
  selectedDefectId,
  onSelectDefect,
  maxDistanceMeters = 300,
}: ChainageTimelineProps) {
  const { openDefectDrawer } = useRoadVision();
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrubberPosition, setScrubberPosition] = useState(180);

  // Active playback simulation
  React.useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setScrubberPosition((prev) => {
        const next = prev >= maxDistanceMeters ? 0 : prev + 5;

        // Auto-select nearby defect
        const nearby = defects.find(
          (d) => Math.abs(d.chainageMeters - next) <= 6
        );
        if (nearby && nearby.id !== selectedDefectId) {
          onSelectDefect(nearby);
        }

        return next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isPlaying, maxDistanceMeters, defects, selectedDefectId, onSelectDefect]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, clickX / rect.width));
    const newPos = Math.round(percent * maxDistanceMeters);
    setScrubberPosition(newPos);

    // Find closest defect
    const closest = defects.reduce((prev, curr) => {
      return Math.abs(curr.chainageMeters - newPos) < Math.abs(prev.chainageMeters - newPos)
        ? curr
        : prev;
    }, defects[0]);

    if (closest && Math.abs(closest.chainageMeters - newPos) < 25) {
      onSelectDefect(closest);
      openDefectDrawer(closest.id);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-subtle">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 text-xs">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-600" />
          <span className="font-bold text-slate-900 uppercase tracking-wide">
            Road Chainage Distress Timeline
          </span>
          <span className="text-[11px] text-slate-400">
            (Section 3 · 0m to {maxDistanceMeters}m Corridor)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setScrubberPosition(0)}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
            title="Rewind to 0m"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={togglePlay}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Simulate Run</span>
              </>
            )}
          </button>
          <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded border border-slate-200">
            {scrubberPosition}m
          </span>
        </div>
      </div>

      {/* Interactive Timeline Track */}
      <div className="mt-6 mb-3 px-2">
        <div onClick={handleTrackClick} className="relative h-8 flex items-center cursor-pointer group/track">
          {/* Base Track */}
          <div className="absolute inset-x-0 h-2 bg-slate-200 group-hover/track:bg-slate-300 transition-colors rounded-full" />

          {/* Progress fill */}
          <div
            className="absolute left-0 h-2 bg-blue-600/30 rounded-full"
            style={{ width: `${(scrubberPosition / maxDistanceMeters) * 100}%` }}
          />

          {/* Scrubber pointer */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-6 bg-slate-900 border-2 border-white rounded shadow-md cursor-ew-resize z-20"
            style={{ left: `calc(${(scrubberPosition / maxDistanceMeters) * 100}% - 8px)` }}
          />

          {/* Defect Markers along timeline */}
          {defects.map((defect) => {
            const leftPercent = Math.min(
              Math.max((defect.chainageMeters / maxDistanceMeters) * 100, 2),
              98
            );
            const isSelected = selectedDefectId === defect.id;
            const isCritical = defect.severity === 'critical';
            const isHigh = defect.severity === 'high';

            let markerColor = 'bg-amber-500';
            if (isCritical) markerColor = 'bg-red-600';
            else if (isHigh) markerColor = 'bg-orange-500';
            else if (defect.severity === 'low') markerColor = 'bg-blue-500';

            return (
              <button
                key={defect.id}
                onClick={() => {
                  setScrubberPosition(defect.chainageMeters);
                  onSelectDefect(defect);
                  openDefectDrawer(defect.id);
                }}
                className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 group transition-all z-10 ${
                  isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                }`}
                style={{ left: `${leftPercent}%` }}
                title={`${formatDefectType(defect.type)} at ${defect.chainageMeters}m`}
              >
                <div
                  className={`w-4 h-4 rounded-full ring-2 ring-white shadow-md ${markerColor} flex items-center justify-center text-[8px] font-bold text-white`}
                >
                  !
                </div>

                {/* Hover Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center pointer-events-none">
                  <div className="bg-slate-900 text-white text-[10px] py-1 px-2 rounded shadow-lg whitespace-nowrap">
                    <span className="font-bold">{formatDefectType(defect.type)}</span>
                    <span className="text-slate-400 ml-1">({defect.chainageMeters}m)</span>
                  </div>
                  <div className="w-1.5 h-1.5 bg-slate-900 rotate-45 -mt-1" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Distance Markers Legend */}
        <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-2 pt-1 border-t border-slate-100">
          <span>0m</span>
          <span>50m</span>
          <span>100m</span>
          <span>150m</span>
          <span>200m</span>
          <span>250m</span>
          <span>300m</span>
        </div>
      </div>
    </div>
  );
}
