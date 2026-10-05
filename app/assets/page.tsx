'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Layers,
  Search,
  MapPin,
  Calendar,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  ShieldAlert,
  Car,
  CheckCircle2,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { useRoadVision } from '@/lib/context/RoadVisionContext';
import { getHealthScoreColor } from '@/lib/utils';
import { RoadAsset } from '@/types';

export default function RoadAssetsPage() {
  const router = useRouter();
  const { roadAssets, inspections } = useRoadVision();

  const [search, setSearch] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<RoadAsset | null>(null);

  const filteredAssets = roadAssets.filter((a) => {
    return (
      search.trim() === '' ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.highway.toLowerCase().includes(search.toLowerCase()) ||
      a.segment.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Asset Lifecycle Management
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              712.2 km Monitored
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Highway Infrastructure Assets
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Structural health records, continuous PCI degradation curves, and asset register across Indian road networks.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search asset, highway, corridor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Asset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAssets.map((asset) => {
          const healthStyle = getHealthScoreColor(asset.healthScore);

          return (
            <div
              key={asset.id}
              onClick={() => router.push(`/assets/${asset.id}`)}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-subtle hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                        {asset.highway}
                      </span>
                      <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
                        {asset.length}
                      </span>
                    </div>
                    <h3 className="text-xs font-semibold text-slate-600 mt-0.5 line-clamp-1">
                      {asset.name}
                    </h3>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-1 rounded-lg border ${healthStyle.bgClass} ${healthStyle.textClass} ${healthStyle.borderClass}`}
                  >
                    <span>{asset.healthScore}%</span>
                    <span className="text-[10px] font-semibold">({healthStyle.label})</span>
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="line-clamp-1">{asset.segment}</span>
                </div>

                {/* Sub-Score Progress Bars */}
                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-500">Surface Smoothness & Integrity</span>
                      <span className="font-bold text-slate-800">{asset.surfaceCondition}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${asset.surfaceCondition}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-500">Safety & Skid Resistance</span>
                      <span className="font-bold text-slate-800">{asset.safetyIndex}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full"
                        style={{ width: `${asset.safetyIndex}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-500">Shoulder & Edge Stability</span>
                      <span className="font-bold text-slate-800">{asset.edgeCondition}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${asset.edgeCondition}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Details list */}
                <div className="mt-3 text-[11px] text-slate-500 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pavement:</span>
                    <span className="font-medium text-slate-700 truncate max-w-[200px]">
                      {asset.pavementType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Traffic Density:</span>
                    <span className="font-medium text-slate-700">{asset.trafficVolume}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Last Survey:</span>
                    <span className="font-medium text-slate-700">{asset.lastInspection}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded text-[11px] border border-red-200">
                    {asset.criticalDefects} Critical
                  </span>
                  <span className="text-slate-400 text-[11px]">{asset.openDefects} Total</span>
                </div>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => router.push(`/assets/${asset.id}`)}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold transition-colors"
                  >
                    Asset Intel
                  </button>
                  <button
                    onClick={() => router.push(`/inspections/${asset.inspections[0] || 'RV-1042'}`)}
                    className="font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
                  >
                    <span>Scan</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
