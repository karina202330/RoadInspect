'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight,
  ShieldAlert,
  ArrowUpDown,
  UserPlus,
  CheckCheck,
  ScanEye,
  ExternalLink,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useRoadVision } from '@/lib/context/RoadVisionContext';
import { formatDefectStatus, formatDefectType, formatSeverity } from '@/lib/utils';
import { DefectSeverity, DefectStatus, DefectType } from '@/types';

function DefectRegisterContent() {
  const searchParams = useSearchParams();
  const urlSeverity = searchParams ? searchParams.get('severity') : null;
  const urlType = searchParams ? searchParams.get('type') : null;
  const { defects, openDefectDrawer, stats, updateDefectStatus } = useRoadVision();

  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>(urlSeverity || 'all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>(urlType || 'all');
  const [sortField, setSortField] = useState<'detectedAt' | 'confidence' | 'severity'>('detectedAt');

  // React dynamically to URL search params
  useEffect(() => {
    if (urlSeverity) {
      setSeverityFilter(urlSeverity);
    }
  }, [urlSeverity]);

  useEffect(() => {
    if (urlType) {
      setTypeFilter(urlType);
    }
  }, [urlType]);

  const filteredDefects = defects
    .filter((d) => {
      const matchesSearch =
        search.trim() === '' ||
        d.id.toLowerCase().includes(search.toLowerCase()) ||
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        d.location.toLowerCase().includes(search.toLowerCase()) ||
        d.assignedTo.toLowerCase().includes(search.toLowerCase());

      const matchesSeverity = severityFilter === 'all' || d.severity === severityFilter;
      const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
      const matchesType = typeFilter === 'all' || d.type === typeFilter;

      return matchesSearch && matchesSeverity && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      if (sortField === 'confidence') {
        return b.confidence - a.confidence;
      }
      if (sortField === 'severity') {
        const order = { critical: 4, high: 3, medium: 2, low: 1 };
        return order[b.severity] - order[a.severity];
      }
      return new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime();
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Asset Health Governance
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
              {stats.criticalDefects} Critical Hazards
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Defect Register & Remediation Queue
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Live catalog of identified pavement distresses, engineer verifications, and contractor dispatch SLAs.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-subtle">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Logged</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{defects.length}</div>
          <span className="text-[10px] text-slate-400">All surveyed segments</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-red-200 bg-red-50/20 shadow-subtle">
          <span className="text-[11px] font-bold text-red-700 uppercase">Critical Severity</span>
          <div className="text-2xl font-extrabold text-red-600 mt-1">{stats.criticalDefects}</div>
          <span className="text-[10px] text-red-600 font-semibold">Immediate 24-48h SLA</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-orange-200 bg-orange-50/20 shadow-subtle">
          <span className="text-[11px] font-bold text-orange-700 uppercase">High Priority</span>
          <div className="text-2xl font-extrabold text-orange-600 mt-1">{stats.highDefects}</div>
          <span className="text-[10px] text-orange-600 font-semibold">7-Day repair cycle</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-amber-200 bg-amber-50/20 shadow-subtle">
          <span className="text-[11px] font-bold text-amber-700 uppercase">Moderate / Low</span>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">{stats.mediumDefects}</div>
          <span className="text-[10px] text-amber-600 font-semibold">Routine maintenance</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-subtle">
          <span className="text-[11px] font-bold text-emerald-700 uppercase">Resolved</span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">{stats.resolvedDefects}</div>
          <span className="text-[10px] text-emerald-600 font-semibold">Verified repaired</span>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-subtle flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search defect ID, road, contractor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Severity Filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="verified">Verified</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Defect Types</option>
            <option value="pothole">Potholes</option>
            <option value="transverse_crack">Transverse Cracks</option>
            <option value="longitudinal_crack">Longitudinal Cracks</option>
            <option value="alligator_crack">Alligator Cracks</option>
            <option value="road_edge_damage">Road Edge Damage</option>
            <option value="lane_marking_damage">Lane Marking Damage</option>
            <option value="debris">Debris</option>
          </select>

          {/* Sort */}
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="detectedAt">Sort by Date</option>
            <option value="severity">Sort by Severity</option>
            <option value="confidence">Sort by AI Confidence</option>
          </select>
        </div>
      </div>

      {/* Enterprise Defect Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="py-3.5 px-4">Defect ID & Evidence</th>
                <th className="py-3.5 px-4">Distress Phenotype</th>
                <th className="py-3.5 px-4">Chainage & Location</th>
                <th className="py-3.5 px-4">Severity</th>
                <th className="py-3.5 px-4">AI Confidence</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Assigned Contractor</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDefects.map((defect) => {
                const severityStyle = formatSeverity(defect.severity);
                const statusStyle = formatDefectStatus(defect.status);

                return (
                  <tr
                    key={defect.id}
                    onClick={() => openDefectDrawer(defect.id)}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  >
                    {/* ID & Evidence Thumbnail */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0 bg-slate-900 relative">
                          <img
                            src={defect.imageUrl}
                            alt={defect.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div>
                          <div className="font-mono font-bold text-slate-900 group-hover:text-blue-600">
                            {defect.id}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {defect.inspectionId}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Defect Type */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">
                        {formatDefectType(defect.type)}
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 max-w-xs">
                        {defect.title}
                      </div>
                    </td>

                    {/* Chainage & Location */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-semibold text-slate-800">
                        {defect.chainage}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">
                        {defect.location}
                      </div>
                    </td>

                    {/* Severity */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold border ${severityStyle.badgeClass}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${severityStyle.dot}`} />
                        {severityStyle.label}
                      </span>
                    </td>

                    {/* Confidence */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-blue-600">
                        {(defect.confidence * 100).toFixed(1)}%
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${statusStyle.badgeClass}`}
                      >
                        {statusStyle.label}
                      </span>
                    </td>

                    {/* Assigned Contractor */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-medium truncate max-w-[170px]">
                        {defect.assignedTo}
                      </div>
                      <div className="text-[10px] text-slate-400">{defect.urgency}</div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <Link
                          href={`/inspections/${defect.inspectionId}`}
                          className="px-2 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded text-xs font-semibold text-slate-700 transition-colors"
                          title="Jump to Inspection Scan"
                        >
                          Scan
                        </Link>
                        <button
                          onClick={() => openDefectDrawer(defect.id)}
                          className="px-2.5 py-1 bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 rounded text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
                        >
                          Review
                        </button>
                      </div>
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

export default function DefectRegisterPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Defect Registry...</div>}>
      <DefectRegisterContent />
    </React.Suspense>
  );
}
