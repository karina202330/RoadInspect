'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Layers,
  ArrowLeft,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  FileText,
  ScanEye,
  ChevronRight,
  ShieldCheck,
  Plus,
} from 'lucide-react';
import { useRoadVision } from '@/lib/context/RoadVisionContext';
import { getHealthScoreColor, formatDefectType, formatSeverity } from '@/lib/utils';

export default function AssetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const assetId = (params.id as string) || 'ASSET-NH48';

  const { roadAssets, inspections, defects, openDefectDrawer } = useRoadVision();
  const asset = roadAssets.find((a) => a.id === assetId || a.highway === assetId) || roadAssets[0];

  const assetInspections = inspections.filter(
    (i) => i.roadName === asset.highway || asset.inspections.includes(i.id)
  );

  const assetDefects = defects.filter((d) => d.location.includes(asset.highway) || d.inspectionId === assetInspections[0]?.id);

  const healthStyle = getHealthScoreColor(asset.healthScore);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Link
              href="/assets"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Road Assets</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {asset.highway}
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${healthStyle.bgClass} ${healthStyle.textClass} ${healthStyle.borderClass}`}
            >
              PCI {asset.healthScore}% ({healthStyle.label})
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {asset.name}
          </h1>

          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {asset.segment}
            </span>
            <span>·</span>
            <span>Total Length: <strong>{asset.length}</strong></span>
            <span>·</span>
            <span>Traffic: <strong>{asset.trafficVolume}</strong></span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/inspections/new?road=${encodeURIComponent(asset.highway)}`}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
          >
            <Plus className="w-4 h-4 text-blue-600" />
            <span>Schedule Inspection</span>
          </Link>

          {assetInspections[0] && (
            <Link
              href={`/inspections/${assetInspections[0].id}`}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm shadow-blue-500/25 transition-all"
            >
              <ScanEye className="w-4 h-4" />
              <span>View Scan ({assetInspections[0].id})</span>
            </Link>
          )}
        </div>
      </div>

      {/* Asset Overview Sub-Score Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Surface Smoothness</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{asset.surfaceCondition}%</div>
          <span className="text-[10px] text-emerald-600 font-semibold">IRI 2.4 m/km</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Safety Rating</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{asset.safetyIndex}%</div>
          <span className="text-[10px] text-slate-400">Skid resistance tested</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Lane Quality</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{asset.laneQuality}%</div>
          <span className="text-[10px] text-slate-400">Retroreflectivity 120 mcd</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Edge & Shoulder</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{asset.edgeCondition}%</div>
          <span className="text-[10px] text-red-600 font-semibold">{asset.criticalDefects} Scour hazards</span>
        </div>
      </div>

      {/* Related Inspections Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-subtle">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Surveys & AI Image Analysis History
          </h3>
          <span className="text-xs text-slate-400">{assetInspections.length} Projects Recorded</span>
        </div>

        <div className="space-y-3">
          {assetInspections.map((ins) => (
            <div
              key={ins.id}
              onClick={() => router.push(`/inspections/${ins.id}`)}
              className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-slate-50/50 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
                  <img
                    src={ins.images[0]?.url || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=120&q=80'}
                    alt={ins.projectName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 group-hover:text-blue-600">
                      {ins.id}
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500 font-mono">{ins.date}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-700 mt-0.5">{ins.projectName}</h4>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="text-right">
                  <span className="font-bold text-slate-900">{ins.defectCount} Defects</span>
                  <span className="text-[11px] text-red-600 block">{ins.criticalCount} Critical</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Corridor Defects Registry Section */}
      {assetDefects.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-subtle">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Active Pavement Distresses on {asset.highway} ({assetDefects.length})
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Click any defect to open the engineering review drawer and verify repair urgency
              </p>
            </div>
            <Link
              href="/defects"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View All Defects</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {assetDefects.slice(0, 4).map((defect) => {
              const severityStyle = formatSeverity(defect.severity);

              return (
                <div
                  key={defect.id}
                  onClick={() => openDefectDrawer(defect.id)}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer group bg-slate-50/50 hover:bg-white flex items-start gap-3"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0 bg-slate-900">
                    <img
                      src={defect.imageUrl}
                      alt={defect.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-mono text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-1.5 py-0.2 rounded">
                        {defect.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full border ${severityStyle.badgeClass}`}
                      >
                        {severityStyle.label}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 mt-1 truncate">
                      {formatDefectType(defect.type)}
                    </h4>

                    <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                      <span className="font-mono">{defect.chainage}</span>
                      <span className="font-semibold text-slate-700">{defect.estimatedCost}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
