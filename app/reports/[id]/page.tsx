'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Printer,
  Download,
  Share2,
  Send,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Calendar,
  User,
  ShieldCheck,
  Wrench,
  DollarSign,
  ArrowLeft,
  FileCheck,
  Building2,
  Sparkles,
  Camera,
  ChevronRight,
} from 'lucide-react';
import { useRoadVision } from '@/lib/context/RoadVisionContext';
import { formatDefectType, formatSeverity, getHealthScoreColor } from '@/lib/utils';

export default function ReportDetailPage() {
  const params = useParams();
  const reportId = (params.id as string) || 'RV-REP-1042';
  const { reports, inspections, defects, showToast, openDefectDrawer } = useRoadVision();

  const report = reports.find((r) => r.id === reportId) || reports[0];
  const inspection = inspections.find((i) => i.id === report.inspectionId) || inspections[0];
  const reportDefects = defects.filter((d) => d.inspectionId === inspection.id);

  const healthStyle = getHealthScoreColor(report.healthScore);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    const headers = ['Defect ID', 'Type', 'Severity', 'Chainage', 'Confidence', 'Action', 'Assigned To', 'Cost'];
    const rows = reportDefects.map((d) => [
      d.id,
      formatDefectType(d.type),
      d.severity,
      d.chainage,
      `${(d.confidence * 100).toFixed(1)}%`,
      `"${d.recommendation.replace(/"/g, '""')}"`,
      d.assignedTo,
      d.estimatedCost,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${report.id}_Defect_Registry.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV Download Started', `${report.id}_Defect_Registry.csv generated.`);
  };

  const handleSendToNHAI = () => {
    showToast(
      'Dispatched to Public Works & NHAI',
      `Official Report ${report.id} transmitted to NHAI Regional Project Director.`,
      'success'
    );
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link Copied', 'Report URL copied to clipboard.');
    }
  };

  return (
    <div className="space-y-6 print:space-y-4 max-w-6xl mx-auto">
      {/* Action Navigation Bar (Hidden in Print) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-2">
          <Link
            href="/reports"
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Reports Archive</span>
          </Link>
          <span className="text-slate-300">/</span>
          <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            {report.id}
          </span>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Certified Assessment
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleSendToNHAI}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
          >
            <Send className="w-3.5 h-3.5 text-blue-600" />
            <span>Send to Public Works / NHAI</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Share Link</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm shadow-blue-500/25 transition-all print-include"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF Export</span>
          </button>
        </div>
      </div>

      {/* Official Report Document Page matching Reference Image 4 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-10 shadow-card space-y-8 print:p-0 print:border-none print:shadow-none print-page">
        {/* Document Header */}
        <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">
              <Building2 className="w-4 h-4" />
              <span>National Highway Infrastructure Authority & RoadVision Intel</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Official Road Condition & Structural Damage Assessment Report
            </h1>
            <p className="text-sm font-semibold text-slate-600 mt-1">
              {report.projectName} · {report.segment}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500 font-mono">
              <span>Report ID: <strong>{report.id}</strong></span>
              <span>·</span>
              <span>Generated: {report.generatedAt}</span>
              <span>·</span>
              <span>Auditor: {report.inspector}</span>
            </div>
          </div>

          <div className="text-right">
            <div className="inline-block p-3 rounded-xl bg-slate-50 border border-slate-200 text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Statutory Authority
              </span>
              <span className="text-xs font-bold text-slate-800 block mt-0.5">
                NHAI Division Maharashtra
              </span>
              <span className="font-mono text-[11px] text-blue-700 block mt-1">
                {report.auditInfo.certificationCode}
              </span>
            </div>
          </div>
        </div>

        {/* Urgent Action Alert Banner matching Reference Image 4 */}
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-extrabold uppercase tracking-wide text-red-800">
              URGENT STATUTORY ACTION REQUIRED: {report.criticalCount} Critical Defects Identified
            </h4>
            <p className="text-xs text-red-700 mt-0.5 leading-relaxed">
              Immediate contractor dispatch recommended for Section 3 within 48 hours to avert vehicle axle
              failures and wet-weather hydroplaning hazards. Potholes &gt;5cm deep confirmed along wheel paths.
            </p>
            <div className="mt-2.5 pt-2 border-t border-red-200/80 flex items-center justify-between text-xs">
              <span className="font-semibold text-red-800">SLA: 24-48 Hours Emergency Response</span>
              <Link
                href="/defects?severity=critical"
                className="font-bold text-red-700 hover:text-red-950 flex items-center gap-1 group underline"
              >
                <span>Review {report.criticalCount} Critical Defects in Defect Register</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Executive Condition & PCI Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* PCI Radial Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
            <div className="w-14 h-14 rounded-full border-4 border-blue-600 flex items-center justify-center flex-shrink-0 bg-white">
              <span className="text-base font-extrabold text-slate-900">{report.healthScore}%</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Overall PCI Score</span>
              <h5 className="text-xs font-extrabold text-blue-700 mt-0.5">Moderate / Fair</h5>
              <span className="text-[10px] text-slate-500">642 km baseline</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Surface Smoothness</span>
            <div className="text-xl font-extrabold text-slate-900 mt-1">{report.surfaceCondition}%</div>
            <span className="text-[10px] text-slate-500">IRI: 2.4 m/km</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Structural Integrity</span>
            <div className="text-xl font-extrabold text-slate-900 mt-1">{report.structuralIntegrity}%</div>
            <span className="text-[10px] text-slate-500">Subgrade load bearing</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Est. Repair Budget</span>
            <div className="text-xl font-extrabold text-slate-900 mt-1">{report.maintenanceCostEstimate}</div>
            <span className="text-[10px] text-emerald-600 font-semibold">Immediate intervention</span>
          </div>
        </div>

        {/* Executive Summary Narrative */}
        <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 text-xs text-slate-700 leading-relaxed">
          <strong className="font-bold text-blue-900 block mb-1 uppercase tracking-wide">
            Executive Engineering Synthesis
          </strong>
          {report.executiveSummary}
        </div>

        {/* Centerpiece Visual Evidence Frame matching Reference Image 4 */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            <span>Visual Evidence & Annotations (KM 48.250 Anchor Frame)</span>
            <span className="font-mono text-slate-400 text-[11px]">Sensor Frame: NH48_SEC03_FRAME_04825.jpg</span>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-slate-300 bg-slate-950">
            <img
              src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80"
              alt="Annotated Road Distress Evidence"
              className="w-full aspect-[16/8] object-cover opacity-90"
            />

            {/* Bounding box 1: Critical Pothole */}
            <div
              className="absolute border-2 border-red-500 bg-red-500/25 rounded"
              style={{ left: '32%', top: '62%', width: '16%', height: '11%' }}
            >
              <span className="absolute -top-5 left-0 bg-red-600 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                CRITICAL POTHOLE · 96%
              </span>
            </div>

            {/* Bounding box 2: Transverse Crack */}
            <div
              className="absolute border-2 border-amber-400 bg-amber-400/20 rounded"
              style={{ left: '44%', top: '48%', width: '15%', height: '8%' }}
            >
              <span className="absolute -top-5 left-0 bg-amber-500 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                TRANSVERSE CRACK · 88%
              </span>
            </div>

            {/* Bounding box 3: Lane Marking */}
            <div
              className="absolute border-2 border-blue-400 bg-blue-400/20 rounded"
              style={{ left: '62%', top: '58%', width: '12%', height: '15%' }}
            >
              <span className="absolute -top-5 left-0 bg-blue-600 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                LANE DELAMINATION · 94%
              </span>
            </div>

            {/* HUD Overlay */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono bg-slate-950/85 backdrop-blur px-3 py-1.5 rounded-lg text-slate-300">
              <span>CAM-01 FRONT WIDE · 1080P 60FPS</span>
              <span>CHAINAGE: KM 48.250</span>
              <span>SPEED: 64.2 KM/H · ELEV: 580M</span>
            </div>
          </div>
        </div>

        {/* Detailed Defect Registry Table matching Reference Image 4 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Pavement Distress Inventory & Action Registry ({reportDefects.length} Items)
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">IRC:82-2015 Standards Compliant</span>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Defect ID</th>
                  <th className="py-2.5 px-3">Type & Description</th>
                  <th className="py-2.5 px-3">Severity</th>
                  <th className="py-2.5 px-3">Chainage</th>
                  <th className="py-2.5 px-3">Confidence</th>
                  <th className="py-2.5 px-3">Remediation Action Plan</th>
                  <th className="py-2.5 px-3">SLA Urgency</th>
                  <th className="py-2.5 px-3 text-right">Est. Cost</th>
                  <th className="py-2.5 px-3 text-right no-print">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reportDefects.map((defect) => {
                  const severityStyle = formatSeverity(defect.severity);

                  return (
                    <tr
                      key={defect.id}
                      onClick={() => openDefectDrawer(defect.id)}
                      className="hover:bg-blue-50/40 cursor-pointer transition-colors group"
                      title="Click to view detailed engineering drawer"
                    >
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800 group-hover:text-blue-600">
                        {defect.id}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-slate-900 block group-hover:text-blue-600">
                          {formatDefectType(defect.type)}
                        </span>
                        <span className="text-[11px] text-slate-400 block line-clamp-1">
                          {defect.dimensions}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold border ${severityStyle.badgeClass}`}
                        >
                          {severityStyle.label}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-700">{defect.chainage}</td>
                      <td className="py-2.5 px-3 font-mono text-blue-600 font-bold">
                        {(defect.confidence * 100).toFixed(0)}%
                      </td>
                      <td className="py-2.5 px-3 text-[11px] text-slate-700 max-w-xs">
                        {defect.recommendation}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-700">{defect.urgency}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900 text-right">
                        {defect.estimatedCost}
                      </td>
                      <td className="py-2.5 px-3 text-right no-print">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openDefectDrawer(defect.id);
                          }}
                          className="px-2 py-1 rounded text-[11px] font-semibold bg-white border border-slate-200 group-hover:border-blue-500 group-hover:text-blue-600 shadow-2xs"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Intelligent Maintenance Recommendations Section matching Reference Image 4 */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
            Intelligent Maintenance Work Order Recommendations
          </h3>

          <div className="space-y-3">
            {report.recommendations.map((rec) => {
              const isCritical = rec.priority === 'critical';
              const isHigh = rec.priority === 'high';

              return (
                <div
                  key={rec.id}
                  className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                    isCritical
                      ? 'border-red-200 bg-red-50/40'
                      : isHigh
                      ? 'border-orange-200 bg-orange-50/30'
                      : 'border-slate-200 bg-slate-50/50'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                          isCritical
                            ? 'bg-red-600 text-white border-red-600'
                            : isHigh
                            ? 'bg-orange-600 text-white border-orange-600'
                            : 'bg-blue-600 text-white border-blue-600'
                        }`}
                      >
                        {rec.priority}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">{rec.title}</h4>
                      <span className="text-[11px] text-slate-400 font-mono">({rec.chainage})</span>
                    </div>

                    <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                      <strong>Prescription:</strong> {rec.recommendedAction}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-2">
                      <span>Agency: <strong>{rec.assignedAgency}</strong></span>
                      <span>·</span>
                      <span>Target SLA: <strong className="text-red-600">{rec.urgency}</strong></span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Estimated Cost
                    </span>
                    <span className="text-base font-black text-slate-900 block mt-0.5">
                      {rec.estimatedCost}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Inspector Sign-off & Audit Trail matching Reference Image 4 */}
        <div className="pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-500">
          <div>
            <h5 className="font-bold text-slate-800 uppercase tracking-wide text-[11px]">
              Computer Vision Model & Verification Attestation
            </h5>
            <div className="mt-2 space-y-1 font-mono text-[11px]">
              <div>Inference Engine: {report.auditInfo.systemVersion}</div>
              <div>Model Checksum: {report.auditInfo.modelChecksum}</div>
              <div>ISO/IRC Code: IRC:SP:84-2019 Highway Audit Compliance</div>
            </div>
          </div>

          <div className="md:text-right">
            <h5 className="font-bold text-slate-800 uppercase tracking-wide text-[11px]">
              Lead Certifying Engineer
            </h5>
            <div className="mt-2 space-y-0.5">
              <span className="font-bold text-slate-900 block text-sm">
                Er. Harsh Rathod, M.Tech (Transportation Infrastructure)
              </span>
              <span className="text-slate-500 block">Inspection Director & Chief Pavement Specialist</span>
              <span className="font-mono text-emerald-700 font-semibold block mt-1">
                ✓ Digitally Certified on {report.auditInfo.verificationDate.substring(0, 10)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
