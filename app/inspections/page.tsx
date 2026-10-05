'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Filter,
  ScanEye,
  MapPin,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowUpDown,
} from 'lucide-react';
import { useRoadVision } from '@/lib/context/RoadVisionContext';
import { formatInspectionStatus, getHealthScoreColor } from '@/lib/utils';
import { InspectionStatus } from '@/types';

export default function InspectionsListPage() {
  const router = useRouter();
  const { inspections } = useRoadVision();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [highwayFilter, setHighwayFilter] = useState<string>('all');

  const highways = Array.from(new Set(inspections.map((i) => i.roadName)));

  const filteredInspections = inspections.filter((ins) => {
    const matchesSearch =
      search.trim() === '' ||
      ins.id.toLowerCase().includes(search.toLowerCase()) ||
      ins.projectName.toLowerCase().includes(search.toLowerCase()) ||
      ins.roadName.toLowerCase().includes(search.toLowerCase()) ||
      ins.inspector.toLowerCase().includes(search.toLowerCase()) ||
      ins.location.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || ins.status === statusFilter;
    const matchesHighway = highwayFilter === 'all' || ins.roadName === highwayFilter;

    return matchesSearch && matchesStatus && matchesHighway;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Project Management
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {inspections.length} Corridors
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Road Inspections Registry
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage road inspection missions, automated image processing runs, and pavement quality audits.
          </p>
        </div>

        <Link
          href="/inspections/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-sm shadow-blue-500/25 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Inspection Project</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-subtle flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by project name, highway, inspector..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="processing">AI Processing</option>
            <option value="in_review">In Review</option>
            <option value="draft">Draft</option>
          </select>

          {/* Highway Filter */}
          <select
            value={highwayFilter}
            onChange={(e) => setHighwayFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Highways</option>
            {highways.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Enterprise Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="py-3.5 px-4">Inspection ID & Project</th>
                <th className="py-3.5 px-4">Highway & Segment</th>
                <th className="py-3.5 px-4">Survey Date</th>
                <th className="py-3.5 px-4">Imagery</th>
                <th className="py-3.5 px-4">Defects Triage</th>
                <th className="py-3.5 px-4">PCI Health</th>
                <th className="py-3.5 px-4">Inspector</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInspections.map((ins) => {
                const statusStyle = formatInspectionStatus(ins.status);
                const healthStyle = getHealthScoreColor(ins.healthScore);

                return (
                  <tr
                    key={ins.id}
                    onClick={() => router.push(`/inspections/${ins.id}`)}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  >
                    {/* ID & Project */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0 bg-slate-100">
                          <img
                            src={ins.images[0]?.url || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=120&q=80'}
                            alt={ins.projectName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div>
                          <div className="font-mono font-bold text-slate-900 group-hover:text-blue-600">
                            {ins.id}
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium line-clamp-1 max-w-xs">
                            {ins.projectName}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Highway & Segment */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{ins.roadName}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">{ins.segment}</div>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 font-mono text-slate-600">{ins.date}</td>

                    {/* Imagery */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800">{ins.imageCount}</span>
                      <span className="text-[11px] text-slate-400 ml-1">frames</span>
                    </td>

                    {/* Defects */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">{ins.defectCount}</span>
                        {ins.criticalCount > 0 && (
                          <span className="px-1.5 py-0.2 rounded bg-red-50 text-red-700 text-[10px] font-bold border border-red-200">
                            {ins.criticalCount} Crit
                          </span>
                        )}
                      </div>
                    </td>

                    {/* PCI Health */}
                    <td className="py-3.5 px-4">
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
                    <td className="py-3.5 px-4 font-medium text-slate-700">{ins.inspector}</td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${statusStyle.badgeClass}`}
                      >
                        {statusStyle.label}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <Link
                          href={`/analysis/${ins.id}`}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold transition-colors"
                          title="Open AI Vision HUD"
                        >
                          AI HUD
                        </Link>
                        <Link
                          href={`/inspections/${ins.id}`}
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-xs font-semibold transition-colors"
                        >
                          View
                        </Link>
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
