'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  ScanEye,
  AlertTriangle,
  ShieldAlert,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  Calendar,
  ChevronRight,
  Filter,
  Plus,
  Play,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useRoadVision } from '@/lib/context/RoadVisionContext';
import { RoadConditionDonut } from '@/components/dashboard/RoadConditionDonut';
import { formatInspectionStatus, getHealthScoreColor } from '@/lib/utils';

export default function DashboardPage() {
  const router = useRouter();
  const { inspections, defects, stats, roadAssets } = useRoadVision();
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [tableSearch, setTableSearch] = useState<string>('');

  const filteredInspections = inspections.filter((ins) => {
    const matchesStatus =
      selectedStatusFilter === 'all' ? true : ins.status === selectedStatusFilter;
    const matchesSearch =
      tableSearch.trim() === ''
        ? true
        : ins.id.toLowerCase().includes(tableSearch.toLowerCase()) ||
          ins.projectName.toLowerCase().includes(tableSearch.toLowerCase()) ||
          ins.roadName.toLowerCase().includes(tableSearch.toLowerCase()) ||
          ins.inspector.toLowerCase().includes(tableSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero matching Reference Image 1 */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 md:p-8 border border-slate-800 shadow-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>Next-Gen Infrastructure Intelligence</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Smarter Roads. Faster Inspections.
            </h1>
            <p className="mt-2 text-slate-300 text-sm md:text-base leading-relaxed">
              Autonomous computer-vision pavement distress detection, automated severity scoring,
              and maintenance decision-support engineered for modern highway authorities.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-5">
              <Link
                href="/inspections/new"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/30"
              >
                <Plus className="w-4 h-4" />
                <span>New Inspection Project</span>
              </Link>
              <Link
                href="/inspections/RV-1042"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs transition-all backdrop-blur-sm"
              >
                <Play className="w-3.5 h-3.5 text-blue-300" />
                <span>View Flagship Demo (NH-48)</span>
              </Link>
            </div>
          </div>

          {/* Right Status Badge in Hero */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 min-w-[260px] self-start lg:self-auto">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
              Corridor Health Index
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-white">78.4</span>
              <span className="text-xs text-slate-300">/ 100</span>
              <span className="text-[11px] font-semibold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded border border-amber-300/30 ml-auto">
                Fair
              </span>
            </div>
            <Link
              href="/defects?severity=critical"
              className="mt-3 pt-3 border-t border-white/10 text-xs text-slate-300 flex items-center justify-between hover:text-white group transition-colors"
            >
              <span>Critical Active Alerts:</span>
              <span className="font-bold text-red-400 group-hover:underline flex items-center gap-1">
                <span>{stats.criticalDefects} Locations</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Section (5 compact cards matching Reference Image 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1 */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-subtle hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Total Inspections
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {stats.totalInspections}
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +12.4%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">642 km road network covered</p>
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-subtle hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Active Inspections
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {stats.activeInspections}
            </span>
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Live Runs
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Multi-sensor cameras active</p>
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-subtle hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Defects Detected
            </span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {stats.totalDefects.toLocaleString()}
            </span>
            <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              7 Classified Types
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">AI 94.2% mean confidence</p>
        </div>

        {/* KPI 4 */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-subtle hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Critical Defects
            </span>
            <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-red-600 tracking-tight">
              {stats.criticalDefects.toLocaleString()}
            </span>
            <span className="text-[11px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200 animate-pulse">
              Urgent 24-48h
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Potholes & severe fatigue</p>
        </div>

        {/* KPI 5: Road Health Donut */}
        <div className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-subtle flex items-center justify-center">
          <RoadConditionDonut score={stats.avgRoadHealth || 82} />
        </div>
      </div>

      {/* Analytics Mid-Section (Defect Distribution + Severity Breakdown) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Analytics: Defect Distribution by Type (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-subtle">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Defect Distribution by Distress Phenotype
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Breakdown of detected road surface anomalies across active corridors
              </p>
            </div>
            <Link
              href="/defects"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View Register</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="mt-4 space-y-3.5">
            {/* Horizontal Stacked Bar */}
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
              <div className="bg-red-500 h-full w-[28%]" title="Potholes: 28%" />
              <div className="bg-amber-500 h-full w-[32%]" title="Cracks: 32%" />
              <div className="bg-orange-500 h-full w-[15%]" title="Edge Scour: 15%" />
              <div className="bg-blue-500 h-full w-[17%]" title="Lane Markings: 17%" />
              <div className="bg-emerald-500 h-full w-[8%]" title="Debris & Other: 8%" />
            </div>

            {/* Phenotype List with Direct Connectivity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Link
                href="/defects?type=pothole"
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-red-50/40 border border-slate-100 hover:border-red-200 transition-all text-xs group cursor-pointer"
              >
                <span className="flex items-center gap-2 text-slate-700 font-medium group-hover:text-red-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  Potholes & Cavities
                </span>
                <span className="font-bold text-slate-900 group-hover:text-red-700">342 · 28% &rarr;</span>
              </Link>
              <Link
                href="/defects?type=transverse_crack"
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-amber-50/40 border border-slate-100 hover:border-amber-200 transition-all text-xs group cursor-pointer"
              >
                <span className="flex items-center gap-2 text-slate-700 font-medium group-hover:text-amber-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Longitudinal & Transverse Cracks
                </span>
                <span className="font-bold text-slate-900 group-hover:text-amber-700">412 · 32% &rarr;</span>
              </Link>
              <Link
                href="/defects?type=road_edge_damage"
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-orange-50/40 border border-slate-100 hover:border-orange-200 transition-all text-xs group cursor-pointer"
              >
                <span className="flex items-center gap-2 text-slate-700 font-medium group-hover:text-orange-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  Road Edge Break & Shoulder Scour
                </span>
                <span className="font-bold text-slate-900 group-hover:text-orange-700">186 · 15% &rarr;</span>
              </Link>
              <Link
                href="/defects?type=lane_marking_damage"
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-blue-50/40 border border-slate-100 hover:border-blue-200 transition-all text-xs group cursor-pointer"
              >
                <span className="flex items-center gap-2 text-slate-700 font-medium group-hover:text-blue-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  Lane Marking Delamination
                </span>
                <span className="font-bold text-slate-900 group-hover:text-blue-700">224 · 17% &rarr;</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Analytics: Severity Breakdown & Urgency (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Severity Breakdown & Urgency
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Triage prioritization for contractor dispatch
                </p>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                SLA Tracked
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 mt-4">
              {/* Critical */}
              <Link
                href="/defects?severity=critical"
                className="p-3 rounded-xl bg-red-50/70 border border-red-200 hover:border-red-400 hover:shadow-sm transition-all flex flex-col group cursor-pointer"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-700">
                  Critical
                </span>
                <span className="text-xl font-black text-red-700 mt-1">
                  {stats.criticalDefects.toLocaleString()}
                </span>
                <span className="text-[10px] text-red-600 font-medium mt-auto pt-2 group-hover:underline">
                  Immediate 24h &rarr;
                </span>
              </Link>

              {/* High */}
              <Link
                href="/defects?severity=high"
                className="p-3 rounded-xl bg-orange-50/70 border border-orange-200 hover:border-orange-400 hover:shadow-sm transition-all flex flex-col group cursor-pointer"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700">
                  High
                </span>
                <span className="text-xl font-black text-orange-700 mt-1">
                  {stats.highDefects.toLocaleString()}
                </span>
                <span className="text-[10px] text-orange-600 font-medium mt-auto pt-2 group-hover:underline">
                  7-Day Cycle &rarr;
                </span>
              </Link>

              {/* Moderate / Low */}
              <Link
                href="/defects?severity=medium"
                className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 hover:border-blue-400 hover:shadow-sm transition-all flex flex-col group cursor-pointer"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                  Moderate
                </span>
                <span className="text-xl font-black text-blue-700 mt-1">
                  {stats.mediumDefects.toLocaleString()}
                </span>
                <span className="text-[10px] text-blue-600 font-medium mt-auto pt-2 group-hover:underline">
                  Scheduled &rarr;
                </span>
              </Link>
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Estimated Remediation Budget:</span>
            <span className="font-extrabold text-slate-900">₹48.2 Lakhs</span>
          </div>
        </div>
      </div>

      {/* Highway Corridor Selector Quick Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-subtle">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Key Highway Corridors Under Continuous Monitoring
            </h3>
          </div>
          <Link
            href="/assets"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View All Road Assets</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {roadAssets.map((asset) => {
            const healthStyle = getHealthScoreColor(asset.healthScore);
            return (
              <div
                key={asset.id}
                onClick={() => router.push(`/assets/${asset.id}`)}
                className="p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:shadow-sm bg-slate-50/50 hover:bg-white transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 group-hover:text-blue-600">
                    {asset.highway}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${healthStyle.bgClass} ${healthStyle.textClass}`}>
                    {asset.healthScore}%
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 truncate mt-1">{asset.segment}</div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                  <span>{asset.length}</span>
                  <span className="text-red-600 font-semibold">{asset.criticalDefects} Critical</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Enterprise Active Inspections Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
        {/* Table Header & Controls */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Recent Road Inspections & Structural Audits
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live and completed automated visual camera runs
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Status Filter */}
            <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50 text-xs">
              {(['all', 'completed', 'processing', 'in_review'] as const).map((filterKey) => (
                <button
                  key={filterKey}
                  onClick={() => setSelectedStatusFilter(filterKey)}
                  className={`px-2.5 py-1 rounded-md capitalize font-medium transition-all ${
                    selectedStatusFilter === filterKey
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {filterKey.replace('_', ' ')}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Filter table..."
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Dense Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">Inspection Project</th>
                <th className="py-3 px-4">Highway & Location</th>
                <th className="py-3 px-4">Severity Triage</th>
                <th className="py-3 px-4">Health Index</th>
                <th className="py-3 px-4">Inspector</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInspections.map((ins) => {
                const statusStyle = formatInspectionStatus(ins.status);
                const healthStyle = getHealthScoreColor(ins.healthScore);

                return (
                  <tr
                    key={ins.id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => router.push(`/inspections/${ins.id}`)}
                  >
                    {/* Project & Thumbnail */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0 bg-slate-100">
                          <img
                            src={ins.images[0]?.url || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=120&q=80'}
                            alt={ins.projectName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-blue-600 flex items-center gap-1.5">
                            <span>{ins.id}</span>
                            <span className="text-[11px] text-slate-400 font-normal">
                              ({ins.imageCount} frames)
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium line-clamp-1 max-w-xs">
                            {ins.projectName}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Highway & Location */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{ins.roadName}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{ins.location}</span>
                      </div>
                    </td>

                    {/* Severity Triage */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {ins.criticalCount > 0 && (
                          <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 font-bold border border-red-200">
                            {ins.criticalCount} Crit
                          </span>
                        )}
                        {ins.highCount > 0 && (
                          <span className="px-2 py-0.5 rounded bg-orange-50 text-orange-700 font-semibold border border-orange-200">
                            {ins.highCount} High
                          </span>
                        )}
                        <span className="text-slate-400 text-[11px]">
                          ({ins.defectCount} Total)
                        </span>
                      </div>
                    </td>

                    {/* Health Index */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${ins.healthScore}%`,
                              backgroundColor: healthStyle.color,
                            }}
                          />
                        </div>
                        <span className={`font-bold ${healthStyle.textClass}`}>
                          {ins.healthScore}%
                        </span>
                      </div>
                    </td>

                    {/* Inspector */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                          {ins.inspectorAvatar || 'AS'}
                        </div>
                        <span className="font-medium text-slate-700">{ins.inspector}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${statusStyle.badgeClass}`}
                      >
                        {statusStyle.label}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/inspections/${ins.id}`);
                        }}
                        className="px-2.5 py-1 bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 rounded text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
                      >
                        View Inspection
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
