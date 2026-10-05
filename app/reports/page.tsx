'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Download,
  Share2,
  Printer,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Plus,
  Search,
} from 'lucide-react';
import { useRoadVision } from '@/lib/context/RoadVisionContext';
import { getHealthScoreColor } from '@/lib/utils';

export default function ReportsListPage() {
  const router = useRouter();
  const { reports, inspections } = useRoadVision();
  const [search, setSearch] = useState('');

  const filteredReports = reports.filter(
    (r) =>
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.projectName.toLowerCase().includes(search.toLowerCase()) ||
      r.roadName.toLowerCase().includes(search.toLowerCase()) ||
      r.inspector.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Statutory Compliance & Documentation
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {reports.length} Official Reports
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Inspection Reports Archive
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Certified road condition assessment documents, damage registries, and executive engineering briefs.
          </p>
        </div>

        <Link
          href={`/reports/${reports[0]?.id || 'RV-REP-1042'}`}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm shadow-blue-500/25 transition-all self-start md:self-auto"
        >
          <FileText className="w-4 h-4" />
          <span>View Flagship NH-48 Report</span>
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-subtle flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search report ID, corridor, inspector..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredReports.map((report) => {
          const healthStyle = getHealthScoreColor(report.healthScore);

          return (
            <div
              key={report.id}
              onClick={() => router.push(`/reports/${report.id}`)}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-subtle hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-mono text-xs font-bold text-slate-900 group-hover:text-blue-600">
                        {report.id}
                      </span>
                      <span className="text-[10px] text-slate-400 block">{report.inspectionId}</span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${healthStyle.bgClass} ${healthStyle.textClass} ${healthStyle.borderClass}`}
                  >
                    PCI {report.healthScore}%
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mt-3 group-hover:text-blue-600 line-clamp-1">
                  {report.projectName}
                </h3>

                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {report.executiveSummary}
                </p>

                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Highway & Location:</span>
                    <span className="font-semibold text-slate-800">{report.roadName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Defects Classified:</span>
                    <span className="font-bold text-slate-800">{report.totalDefects} Items</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Critical Concerns:</span>
                    <span className="font-bold text-red-600">{report.criticalCount} Locations</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Repair Estimate:</span>
                    <span className="font-bold text-slate-900">{report.maintenanceCostEstimate}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-mono">{report.generatedAt}</span>
                <span className="text-blue-600 font-semibold group-hover:underline flex items-center gap-1">
                  <span>View Official Report</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
