'use client';

import React, { useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Eye,
  Layers,
  SplitSquareVertical,
  ChevronLeft,
  ChevronRight,
  Info,
  MapPin,
  Camera,
} from 'lucide-react';
import { Defect, InspectionImage } from '@/types';
import { formatDefectType, formatSeverity } from '@/lib/utils';
import { useRoadVision } from '@/lib/context/RoadVisionContext';

interface ComparativeImageViewerProps {
  image: InspectionImage;
  defects: Defect[];
  onSelectDefect?: (defect: Defect) => void;
  selectedDefectId?: string | null;
  onNextImage?: () => void;
  onPrevImage?: () => void;
  imageIndex?: number;
  totalImages?: number;
}

export function ComparativeImageViewer({
  image,
  defects,
  onSelectDefect,
  selectedDefectId,
  onNextImage,
  onPrevImage,
  imageIndex = 1,
  totalImages = 3,
}: ComparativeImageViewerProps) {
  const { openDefectDrawer } = useRoadVision();
  const [viewMode, setViewMode] = useState<'comparative' | 'overlay' | 'original'>('comparative');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showHud, setShowHud] = useState<boolean>(true);

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.25, 1));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-xl flex flex-col text-white">
      {/* Top Controller Bar */}
      <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: View Mode Toggles */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setViewMode('comparative')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
              viewMode === 'comparative'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span>Side-by-Side</span>
          </button>
          <button
            onClick={() => setViewMode('overlay')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
              viewMode === 'overlay'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>AI Detection Layer</span>
          </button>
          <button
            onClick={() => setViewMode('original')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
              viewMode === 'original'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Original Raw</span>
          </button>
        </div>

        {/* Center: Frame Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevImage}
            className="w-7 h-7 rounded-md bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
            title="Previous Frame"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono text-xs text-slate-300 px-2">
            Frame {imageIndex} of {totalImages}
          </span>
          <button
            onClick={onNextImage}
            className="w-7 h-7 rounded-md bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
            title="Next Frame"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Zoom & HUD Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHud(!showHud)}
            className={`px-2.5 py-1.5 rounded-md text-[11px] font-medium border ${
              showHud
                ? 'bg-slate-800 border-slate-700 text-slate-200'
                : 'bg-transparent border-slate-800 text-slate-500'
            }`}
          >
            HUD Telemetry
          </button>

          <div className="flex items-center border border-slate-800 rounded-lg p-0.5 bg-slate-900">
            <button
              onClick={handleZoomOut}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px] text-slate-300">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {zoomLevel > 1 && (
            <button
              onClick={handleResetZoom}
              className="px-2 py-1 rounded bg-slate-800 text-[11px] text-slate-300 hover:text-white"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Viewer Canvas Area */}
      <div className="relative p-3 bg-black/40 min-h-[440px] flex items-center justify-center overflow-hidden">
        {viewMode === 'comparative' ? (
          /* Side-by-Side Mode */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
            {/* Panel 1: Original Raw Image */}
            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 group">
              <div className="absolute top-2.5 left-2.5 z-10 bg-slate-900/80 backdrop-blur px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-300 border border-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                Raw Sensor Feed (Unprocessed)
              </div>

              {showHud && (
                <div className="absolute top-2.5 right-2.5 z-10 font-mono text-[10px] bg-slate-950/80 backdrop-blur px-2 py-0.5 rounded text-slate-400 border border-slate-800">
                  {image.name}
                </div>
              )}

              <div
                className="w-full aspect-[16/10] overflow-hidden"
                style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s' }}
              >
                <img
                  src={image.url}
                  alt="Raw Road Inspection"
                  className="w-full h-full object-cover"
                />
              </div>

              {showHud && (
                <div className="absolute bottom-2 left-2 right-2 z-10 flex items-center justify-between text-[11px] font-mono bg-slate-950/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-blue-400" />
                    CAM-01 FRONT WIDE · 1080P
                  </span>
                  <span>{image.chainage}</span>
                </div>
              )}
            </div>

            {/* Panel 2: AI Analyzed with Normalized Bounding Boxes */}
            <div className="relative rounded-xl overflow-hidden border border-blue-500/40 bg-slate-950 group shadow-lg shadow-blue-500/5">
              <div className="absolute top-2.5 left-2.5 z-10 bg-blue-950/90 backdrop-blur px-2.5 py-1 rounded-md text-[10px] font-bold text-blue-300 border border-blue-500/40 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                AI Detection Layer (YOLO-v11x)
              </div>

              <div className="absolute top-2.5 right-2.5 z-10 bg-slate-900/80 backdrop-blur px-2 py-0.5 rounded text-[10px] text-emerald-400 font-mono border border-slate-800">
                {defects.length} Defects Found
              </div>

              <div
                className="relative w-full aspect-[16/10] overflow-hidden"
                style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s' }}
              >
                <img
                  src={image.url}
                  alt="AI Road Detection"
                  className="w-full h-full object-cover"
                />

                {/* Dynamic Normalized Bounding Boxes */}
                {defects.map((defect) => {
                  const isSelected = selectedDefectId === defect.id;
                  const isCritical = defect.severity === 'critical';
                  const isHigh = defect.severity === 'high';

                  let borderColor = 'border-amber-400';
                  let bgColor = 'bg-amber-400/20';
                  let badgeBg = 'bg-amber-500';

                  if (isCritical) {
                    borderColor = 'border-red-500';
                    bgColor = 'bg-red-500/25';
                    badgeBg = 'bg-red-600';
                  } else if (isHigh) {
                    borderColor = 'border-orange-500';
                    bgColor = 'bg-orange-500/25';
                    badgeBg = 'bg-orange-600';
                  } else if (defect.type === 'lane_marking_damage') {
                    borderColor = 'border-blue-400';
                    bgColor = 'bg-blue-400/20';
                    badgeBg = 'bg-blue-600';
                  }

                  return (
                    <div
                      key={defect.id}
                      onClick={() => {
                        if (onSelectDefect) onSelectDefect(defect);
                        openDefectDrawer(defect.id);
                      }}
                      className={`absolute rounded transition-all cursor-pointer group/box ${
                        isSelected
                          ? 'border-[3px] ring-4 ring-white/50 z-20 scale-[1.02]'
                          : `border-2 hover:border-[3px] hover:z-20`
                      } ${borderColor} ${bgColor}`}
                      style={{
                        left: `${defect.boundingBox.x * 100}%`,
                        top: `${defect.boundingBox.y * 100}%`,
                        width: `${defect.boundingBox.width * 100}%`,
                        height: `${defect.boundingBox.height * 100}%`,
                      }}
                    >
                      {/* Floating Defect Label Badge */}
                      <div
                        className={`absolute -top-6 left-0 flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold text-white shadow-md whitespace-nowrap pointer-events-none ${badgeBg}`}
                      >
                        <span>{formatDefectType(defect.type)}</span>
                        <span className="opacity-90 font-mono">
                          {(defect.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {showHud && (
                <div className="absolute bottom-2 left-2 right-2 z-10 flex items-center justify-between text-[11px] font-mono bg-slate-950/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
                  <span className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">● PCI Impact: -24 pts</span>
                    <span>·</span>
                    <span>Speed: {image.speed}</span>
                  </span>
                  <span>
                    GPS: {image.gps.lat}° N, {image.gps.lng}° E
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Single Full-Width Mode (Overlay or Original) */
          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 w-full max-w-5xl">
            <div className="absolute top-3 left-3 z-10 bg-slate-900/90 backdrop-blur px-3 py-1 rounded-md text-xs font-bold text-white border border-slate-800 flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  viewMode === 'overlay' ? 'bg-blue-500 animate-pulse' : 'bg-slate-400'
                }`}
              />
              <span>
                {viewMode === 'overlay'
                  ? 'High-Resolution AI Detection Overlay'
                  : 'Original Unannotated Image'}
              </span>
            </div>

            <div
              className="relative w-full aspect-[16/9] overflow-hidden"
              style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s' }}
            >
              <img
                src={image.url}
                alt="Road Inspection View"
                className="w-full h-full object-cover"
              />

              {viewMode === 'overlay' &&
                defects.map((defect) => {
                  const isSelected = selectedDefectId === defect.id;
                  const isCritical = defect.severity === 'critical';
                  const isHigh = defect.severity === 'high';

                  let borderColor = 'border-amber-400';
                  let bgColor = 'bg-amber-400/20';
                  let badgeBg = 'bg-amber-500';

                  if (isCritical) {
                    borderColor = 'border-red-500';
                    bgColor = 'bg-red-500/25';
                    badgeBg = 'bg-red-600';
                  } else if (isHigh) {
                    borderColor = 'border-orange-500';
                    bgColor = 'bg-orange-500/25';
                    badgeBg = 'bg-orange-600';
                  } else if (defect.type === 'lane_marking_damage') {
                    borderColor = 'border-blue-400';
                    bgColor = 'bg-blue-400/20';
                    badgeBg = 'bg-blue-600';
                  }

                  return (
                    <div
                      key={defect.id}
                      onClick={() => {
                        if (onSelectDefect) onSelectDefect(defect);
                        openDefectDrawer(defect.id);
                      }}
                      className={`absolute rounded transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[3px] ring-4 ring-white/50 z-20 scale-[1.02]'
                          : `border-2 hover:border-[3px] hover:z-20`
                      } ${borderColor} ${bgColor}`}
                      style={{
                        left: `${defect.boundingBox.x * 100}%`,
                        top: `${defect.boundingBox.y * 100}%`,
                        width: `${defect.boundingBox.width * 100}%`,
                        height: `${defect.boundingBox.height * 100}%`,
                      }}
                    >
                      <div
                        className={`absolute -top-6 left-0 flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-md whitespace-nowrap pointer-events-none ${badgeBg}`}
                      >
                        <span>{formatDefectType(defect.type)}</span>
                        <span className="font-mono">
                          {(defect.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>

            {showHud && (
              <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-xs font-mono bg-slate-950/85 backdrop-blur px-4 py-2 rounded-lg border border-slate-800 text-slate-300">
                <span className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-red-400" />
                  {image.chainage} · {image.lane}
                </span>
                <span>Speed: {image.speed}</span>
                <span>
                  GPS: {image.gps.lat}° N, {image.gps.lng}° E
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
