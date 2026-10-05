'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowLeft,
  FileText,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Layers,
  MapPin,
  Calendar,
  Wrench,
  Check,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { useRoadVision } from '@/lib/context/RoadVisionContext';
import { ChainageTimeline } from '@/components/analysis/ChainageTimeline';
import { ComparativeImageViewer } from '@/components/inspection/ComparativeImageViewer';
import { Defect } from '@/types';
import { formatDefectStatus, formatDefectType, formatSeverity } from '@/lib/utils';

export default function AIAnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const inspectionId = (params.id as string) || 'RV-1042';

  const {
    inspections,
    defects,
    runAIAnalysis,
    generateInspectionReport,
    openDefectDrawer,
    selectedDefectId,
    updateDefectStatus,
    isAnalyzing,
  } = useRoadVision();

  const [sensitivity, setSensitivity] = useState<'low' | 'standard' | 'high'>('high');

  const inspection = inspections.find((i) => i.id === inspectionId) || inspections[0];
  const inspectionDefects = defects.filter((d) => d.inspectionId === inspection.id);

  const images = inspection.images.length > 0 ? inspection.images : [
    {
      id: 'IMG-ANALYSIS-01',
      inspectionId: inspection.id,
      url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80',
      name: `${inspection.roadName}_FRAME_04825.jpg`,
      chainage: 'KM 48.250',
      chainageMeters: 250,
      timestamp: '2026-10-04 09:14:22',
      gps: { lat: 18.7512, lng: 73.415 },
      speed: '64.2 km/h',
      lane: 'Lane 2 & 3 Eastbound',
      defects: inspectionDefects,
    },
  ];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const currentImage = images[activeImageIndex] || images[0];

  const handleRerun = () => {
    runAIAnalysis(inspection.id, { sensitivity });
  };

  const handleGenerateReport = async () => {
    const reportId = await generateInspectionReport(inspection.id);
    router.push(`/reports/${reportId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Link
              href={`/inspections/${inspection.id}`}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Inspection View</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              AI Vision Analysis
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            AI Automated Defect Detection & Chainage HUD
          </h1>

          <p className="text-xs text-slate-500 mt-1">
            Real-time computer vision inference engine for {inspection.projectName}
          </p>
        </div>

        {/* Sensitivity & Action Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 p-1 rounded-lg text-xs">
            <Sliders className="w-3.5 h-3.5 text-slate-500 ml-1" />
            <span className="text-[11px] font-medium text-slate-500">Sensitivity:</span>
            {(['low', 'standard', 'high'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setSensitivity(level)}
                className={`px-2 py-1 rounded text-[11px] font-semibold capitalize transition-all ${
                  sensitivity === level
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          <button
            onClick={handleRerun}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm shadow-blue-500/25 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isAnalyzing ? 'Processing...' : 'Rerun AI Detection'}</span>
          </button>

          <button
            onClick={handleGenerateReport}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
          >
            <FileText className="w-4 h-4 text-slate-500" />
            <span>Report</span>
          </button>
        </div>
      </div>

      {/* Main 70/30 Analysis Layout matching Reference Image 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left ~70%: Viewer + Chainage Distance Timeline (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Main Annotated Image Viewer */}
          <ComparativeImageViewer
            image={currentImage}
            defects={inspectionDefects}
            selectedDefectId={selectedDefectId}
            onSelectDefect={(defect) => openDefectDrawer(defect.id)}
            onNextImage={() => setActiveImageIndex((prev) => (prev + 1) % images.length)}
            onPrevImage={() => setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length)}
            imageIndex={activeImageIndex + 1}
            totalImages={images.length}
          />

          {/* Road-Distance Timeline matching Reference Image 3 */}
          <ChainageTimeline
            defects={inspectionDefects}
            selectedDefectId={selectedDefectId}
            onSelectDefect={(defect) => openDefectDrawer(defect.id)}
            maxDistanceMeters={300}
          />
        </div>

        {/* Right ~30%: Analysis Panel & Defect Cards List (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Detection Summary Box */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-subtle">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Detection Summary
              </h3>
              <span className="font-mono text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                94.2% Confidence
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 mt-3 text-center">
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Total</span>
                <p className="text-base font-extrabold text-slate-900 mt-0.5">
                  {inspectionDefects.length}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-red-50 border border-red-200">
                <span className="text-[10px] font-semibold text-red-700 uppercase">Critical</span>
                <p className="text-base font-extrabold text-red-700 mt-0.5">
                  {inspectionDefects.filter((d) => d.severity === 'critical').length}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-orange-50 border border-orange-200">
                <span className="text-[10px] font-semibold text-orange-700 uppercase">High</span>
                <p className="text-base font-extrabold text-orange-700 mt-0.5">
                  {inspectionDefects.filter((d) => d.severity === 'high').length}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-blue-50 border border-blue-200">
                <span className="text-[10px] font-semibold text-blue-700 uppercase">Med/Low</span>
                <p className="text-base font-extrabold text-blue-700 mt-0.5">
                  {inspectionDefects.filter((d) => d.severity === 'medium' || d.severity === 'low').length}
                </p>
              </div>
            </div>
          </div>

          {/* Defect Cards List */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-subtle">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Defect Evidence Feed ({inspectionDefects.length})
              </h3>
              <span className="text-[11px] text-slate-400">Click to Inspect</span>
            </div>

            <div className="mt-3 space-y-3 max-h-[560px] overflow-y-auto pr-1">
              {inspectionDefects.map((defect) => {
                const severityStyle = formatSeverity(defect.severity);
                const statusStyle = formatDefectStatus(defect.status);
                const isSelected = selectedDefectId === defect.id;

                return (
                  <div
                    key={defect.id}
                    onClick={() => openDefectDrawer(defect.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/40 ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                            {defect.id}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${severityStyle.badgeClass}`}
                          >
                            {severityStyle.label}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${statusStyle.badgeClass}`}
                          >
                            {statusStyle.label}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 mt-1.5">
                          {formatDefectType(defect.type)}
                        </h4>
                      </div>

                      <span className="text-xs font-mono font-bold text-blue-600">
                        {(defect.confidence * 100).toFixed(0)}%
                      </span>
                    </div>

                    <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {defect.chainage} · {defect.location}
                      </span>
                    </div>

                    <div className="mt-2 p-2 rounded bg-slate-50 border border-slate-100 text-[11px] text-slate-700">
                      <span className="font-semibold text-slate-800">Action: </span>
                      {defect.recommendation}
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">
                        Cost: <strong className="text-slate-700">{defect.estimatedCost}</strong>
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateDefectStatus(defect.id, 'verified', {
                            verifiedBy: 'Er. Harsh Rathod',
                          });
                        }}
                        className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Quick Verify</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
