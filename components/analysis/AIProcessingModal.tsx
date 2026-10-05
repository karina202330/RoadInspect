'use client';

import React from 'react';
import { useRoadVision } from '@/lib/context/RoadVisionContext';
import {
  UploadCloud,
  Cpu,
  ScanEye,
  CheckCircle2,
  Layers,
  Sparkles,
  ShieldAlert,
  Loader2,
} from 'lucide-react';

export function AIProcessingModal() {
  const { isAnalyzing, analysisProgress } = useRoadVision();

  if (!isAnalyzing) return null;

  const percent = analysisProgress?.progressPercent || 10;
  const currentStage = analysisProgress?.stage || 'uploading';

  const stages = [
    { key: 'uploading', label: 'Frame Ingestion & Telemetry', icon: UploadCloud },
    { key: 'preprocessing', label: 'Lens Calibration & Contrast', icon: Layers },
    { key: 'detection', label: 'YOLO-v11x Object Detection', icon: ScanEye },
    { key: 'classification', label: 'Distress Type Classification', icon: Cpu },
    { key: 'severity', label: 'PCI & Severity Calculation', icon: ShieldAlert },
    { key: 'recommendations', label: 'Actionable Repair Formulation', icon: Sparkles },
  ];

  const getStageStatus = (stageKey: string) => {
    const stageOrder = ['uploading', 'preprocessing', 'detection', 'classification', 'severity', 'recommendations', 'completed'];
    const currentIndex = stageOrder.indexOf(currentStage);
    const stageIndex = stageOrder.indexOf(stageKey);

    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-blue-100">
            <Sparkles className="w-4 h-4 text-blue-200 animate-spin" />
            <span>Simulated AI Computer Vision Pipeline</span>
          </div>
          <h3 className="text-xl font-bold mt-1 text-white">
            Running Highway Defect Detection
          </h3>
          <p className="text-xs text-blue-100/90 mt-1">
            Analyzing multi-lane pavement imagery against standard distress catalog
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-2">
              <span className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                {analysisProgress?.message || 'Processing road frames...'}
              </span>
              <span className="font-mono text-blue-600 font-bold">{percent}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          {/* Stepper Pipeline */}
          <div className="space-y-2.5">
            {stages.map((stage) => {
              const status = getStageStatus(stage.key);
              const Icon = stage.icon;

              return (
                <div
                  key={stage.key}
                  className={`flex items-center justify-between p-2.5 rounded-lg border text-xs transition-colors ${
                    status === 'active'
                      ? 'bg-blue-50/70 border-blue-200 text-blue-900 font-semibold'
                      : status === 'completed'
                      ? 'bg-emerald-50/50 border-emerald-100 text-slate-700'
                      : 'bg-slate-50 border-slate-100 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        status === 'active'
                          ? 'text-blue-600 animate-pulse'
                          : status === 'completed'
                          ? 'text-emerald-600'
                          : 'text-slate-400'
                      }`}
                    />
                    <span>{stage.label}</span>
                  </div>

                  <div>
                    {status === 'completed' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                    {status === 'active' && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                        Analyzing
                      </span>
                    )}
                    {status === 'pending' && (
                      <span className="text-[10px] text-slate-400">Queued</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Infrastructure Notice */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Model: YOLO-v11x High-Res Pavement</span>
            <span className="font-mono text-slate-700">Cluster 04 · Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
