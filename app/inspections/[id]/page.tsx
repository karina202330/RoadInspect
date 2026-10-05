'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Sparkles,
  FileText,
  Share2,
  Maximize2,
  ScanEye,
  CheckCircle2,
  AlertTriangle,
  Layers,
  MapPin,
  Calendar,
  User,
  Wrench,
  ChevronRight,
  ArrowLeft,
  ShieldAlert,
} from 'lucide-react';
import { useRoadVision } from '@/lib/context/RoadVisionContext';
import { ComparativeImageViewer } from '@/components/inspection/ComparativeImageViewer';
import { Defect } from '@/types';
import { formatDefectType, formatInspectionStatus, formatSeverity, getHealthScoreColor } from '@/lib/utils';

export default function InspectionDetailPage() {
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
    isAnalyzing,
  } = useRoadVision();

  const inspection = inspections.find((i) => i.id === inspectionId) || inspections[0];
  const inspectionDefects = defects.filter((d) => d.inspectionId === inspection.id);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const images = inspection.images.length > 0 ? inspection.images : [
    {
      id: 'IMG-FALLBACK',
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

  const currentImage = images[activeImageIndex] || images[0];

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleRunAI = async () => {
    await runAIAnalysis(inspection.id, { sensitivity: 'high' });
  };

  const handleGenerateReport = async () => {
    const reportId = await generateInspectionReport(inspection.id);
    router.push(`/reports/${reportId}`);
  };

  const statusStyle = formatInspectionStatus(inspection.status);
  const healthStyle = getHealthScoreColor(inspection.healthScore);

  return (
    <div className="space-y-6">
      {/* Top Header & Action Controls matching Reference Image 2 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Link
              href="/inspections"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Inspections</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {inspection.id}
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${statusStyle.badgeClass}`}
            >
              {statusStyle.label}
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            Comparative Road Image Inspector & Damage Analysis
          </h1>

          <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              {inspection.projectName} · {inspection.segment}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {inspection.date}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Inspector: <strong className="text-slate-700 font-semibold">{inspection.inspector}</strong>
            </span>
          </div>
        </div>

        {/* Action Buttons matching Reference Image 2 */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href={`/analysis/${inspection.id}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
          >
            <ScanEye className="w-4 h-4 text-blue-600" />
            <span>AI Analysis HUD</span>
          </Link>

          <button
            onClick={handleRunAI}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/25 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isAnalyzing ? 'Running AI Vision...' : 'Run AI Inspection'}</span>
          </button>

          <button
            onClick={handleGenerateReport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
          >
            <FileText className="w-4 h-4 text-slate-500" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Quick Inspection Summary Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-subtle">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Inspection Status</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-sm font-bold text-slate-900 capitalize">{inspection.status}</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-subtle">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Pavement Quality</span>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-base font-extrabold ${healthStyle.textClass}`}>
              {inspection.healthScore}%
            </span>
            <span className="text-xs text-slate-500">PCI Score</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-subtle">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Frames Analyzed</span>
          <div className="text-base font-extrabold text-slate-900 mt-1">
            {inspection.imageCount} <span className="text-xs font-normal text-slate-400">images</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-subtle">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Defects Detected</span>
          <div className="text-base font-extrabold text-slate-900 mt-1">
            {inspectionDefects.length} <span className="text-xs font-normal text-slate-400">distresses</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-subtle">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Critical Hazards</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-base font-extrabold text-red-600">{inspection.criticalCount}</span>
            <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
              Action Req
            </span>
          </div>
        </div>
      </div>

      {/* Centerpiece: Comparative Image Inspector */}
      <ComparativeImageViewer
        image={currentImage}
        defects={inspectionDefects}
        selectedDefectId={selectedDefectId}
        onSelectDefect={(defect) => openDefectDrawer(defect.id)}
        onNextImage={handleNextImage}
        onPrevImage={handlePrevImage}
        imageIndex={activeImageIndex + 1}
        totalImages={images.length}
      />

      {/* Defect Cards Breakdown Row matching Reference Image 2 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Detected Pavement Distress Classifications
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any defect card to open detailed engineering review, verify bounding box, or dispatch contractor
            </p>
          </div>

          <Link
            href="/defects"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Open Defect Register</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3-Column Defect Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {inspectionDefects.slice(0, 3).map((defect) => {
            const severityStyle = formatSeverity(defect.severity);

            return (
              <div
                key={defect.id}
                onClick={() => openDefectDrawer(defect.id)}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-subtle hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {defect.id}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${severityStyle.badgeClass}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${severityStyle.dot}`} />
                      {severityStyle.label}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 mt-2">
                    {formatDefectType(defect.type)}
                  </h4>

                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {defect.title}
                  </p>

                  <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Chainage:</span>
                      <span className="font-mono font-semibold text-slate-700">{defect.chainage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">AI Confidence:</span>
                      <span className="font-bold text-blue-600">
                        {(defect.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Estimated Cost:</span>
                      <span className="font-semibold text-slate-800">{defect.estimatedCost}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium truncate max-w-[160px]">
                    {defect.assignedTo}
                  </span>
                  <button className="text-blue-600 group-hover:underline font-semibold flex items-center gap-0.5">
                    <span>Review & Verify</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
