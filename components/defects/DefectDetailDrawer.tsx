'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  CheckCircle,
  XCircle,
  UserPlus,
  CheckCheck,
  AlertTriangle,
  Clock,
  MapPin,
  Calendar,
  Layers,
  Wrench,
  DollarSign,
  Compass,
  Maximize2,
  FileCheck,
  ScanEye,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useRoadVision } from '@/lib/context/RoadVisionContext';
import { formatDefectStatus, formatDefectType, formatSeverity } from '@/lib/utils';
import { DefectSeverity, DefectStatus } from '@/types';

export function DefectDetailDrawer() {
  const router = useRouter();
  const {
    isDefectDrawerOpen,
    closeDefectDrawer,
    selectedDefect,
    updateDefectStatus,
    updateDefectSeverity,
  } = useRoadVision();

  const [notes, setNotes] = useState('');
  const [assignedAgency, setAssignedAgency] = useState('');

  if (!isDefectDrawerOpen || !selectedDefect) return null;

  const severityStyle = formatSeverity(selectedDefect.severity);
  const statusStyle = formatDefectStatus(selectedDefect.status);

  const handleVerify = () => {
    updateDefectStatus(selectedDefect.id, 'verified', {
      verifiedBy: 'Er. Harsh Rathod (Inspection Director)',
    });
  };

  const handleReject = () => {
    updateDefectStatus(selectedDefect.id, 'rejected');
  };

  const handleAssign = () => {
    const agency = assignedAgency || 'NHAI Rapid Response Team 4';
    updateDefectStatus(selectedDefect.id, 'assigned', {
      assignedTo: agency,
    });
  };

  const handleResolve = () => {
    updateDefectStatus(selectedDefect.id, 'resolved');
  };

  const handleSeverityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateDefectSeverity(selectedDefect.id, e.target.value as DefectSeverity);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeDefectDrawer}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white shadow-2xl flex flex-col h-full border-l border-slate-200">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                  {selectedDefect.id}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${severityStyle.badgeClass}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${severityStyle.dot}`} />
                  {severityStyle.label} Severity
                </span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${statusStyle.badgeClass}`}
                >
                  {statusStyle.label}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                {formatDefectType(selectedDefect.type)}
              </h3>
            </div>
            <button
              onClick={closeDefectDrawer}
              className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Visual Evidence Section */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <span>Visual AI Annotation & Context</span>
                <span className="text-blue-600 font-mono">
                  {(selectedDefect.confidence * 100).toFixed(1)}% AI Confidence
                </span>
              </div>
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 group">
                <img
                  src={selectedDefect.imageUrl}
                  alt={selectedDefect.title}
                  className="w-full h-56 object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />

                {/* Simulated dynamic bounding box overlay */}
                <div
                  className="absolute border-2 border-red-500 bg-red-500/20 rounded pointer-events-none flex items-start justify-end p-1"
                  style={{
                    left: `${selectedDefect.boundingBox.x * 100}%`,
                    top: `${selectedDefect.boundingBox.y * 100}%`,
                    width: `${selectedDefect.boundingBox.width * 100}%`,
                    height: `${selectedDefect.boundingBox.height * 100}%`,
                  }}
                >
                  <span className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                    {formatDefectType(selectedDefect.type)} (
                    {(selectedDefect.confidence * 100).toFixed(0)}%)
                  </span>
                </div>

                <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur text-white text-[11px] px-2.5 py-1 rounded-md font-mono flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-red-400" />
                  <span>{selectedDefect.chainage}</span>
                  <span className="text-slate-400">·</span>
                  <span>{selectedDefect.location}</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] font-medium text-slate-400 uppercase">
                  Physical Dimensions
                </span>
                <p className="text-sm font-bold text-slate-800 mt-0.5">
                  {selectedDefect.dimensions || '1.2m × 0.6m · Surface Level'}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] font-medium text-slate-400 uppercase">
                  Estimated Repair Cost
                </span>
                <p className="text-sm font-bold text-slate-800 mt-0.5">
                  {selectedDefect.estimatedCost}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] font-medium text-slate-400 uppercase">
                  PCI Index Deterioration
                </span>
                <p className="text-sm font-bold text-red-600 mt-0.5">
                  -{selectedDefect.pavementIndexImpact} Points
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] font-medium text-slate-400 uppercase">
                  Statutory SLA Urgency
                </span>
                <p className="text-sm font-bold text-slate-800 mt-0.5">
                  {selectedDefect.urgency}
                </p>
              </div>
            </div>

            {/* Recommended Engineering Action */}
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200">
              <div className="flex items-center gap-2 text-blue-800 font-bold text-xs uppercase tracking-wider mb-1">
                <Wrench className="w-4 h-4 text-blue-600" />
                <span>AI Automated Engineering Recommendation</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {selectedDefect.recommendation}
              </p>
            </div>

            {/* Verification & Assignment Panel */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Defect Governance & Status
              </h4>

              {/* Status and Severity Selectors */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Severity Override
                  </label>
                  <select
                    value={selectedDefect.severity}
                    onChange={handleSeverityChange}
                    className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="critical">Critical (Immediate Hazard)</option>
                    <option value="high">High (Progressive Failure)</option>
                    <option value="medium">Medium (Routine Monitoring)</option>
                    <option value="low">Low (Aesthetic / Minor)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Assigned Agency
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedDefect.assignedTo}
                    onChange={(e) => setAssignedAgency(e.target.value)}
                    placeholder="e.g. NHAI Emergency Unit 4"
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Inspector Verification Metadata & Cross-Page Connectivity */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Detection Timestamp:</span>
                  <span className="font-mono text-slate-700">{selectedDefect.detectedAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Inspection Project:</span>
                  <span className="font-semibold text-blue-600 font-mono">{selectedDefect.inspectionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Human Verification:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedDefect.verifiedBy || 'Pending Engineer Sign-off'}
                  </span>
                </div>

                {/* Direct Cross-Page Actions */}
                <div className="pt-2 border-t border-slate-200/80 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      closeDefectDrawer();
                      router.push(`/inspections/${selectedDefect.inspectionId}`);
                    }}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 rounded-lg text-[11px] font-semibold text-slate-700 transition-colors shadow-2xs group"
                  >
                    <ScanEye className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform" />
                    <span>Open in Inspection</span>
                  </button>
                  <button
                    onClick={() => {
                      closeDefectDrawer();
                      router.push(`/analysis/${selectedDefect.inspectionId}`);
                    }}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 rounded-lg text-[11px] font-semibold text-slate-700 transition-colors shadow-2xs group"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform" />
                    <span>Open in AI HUD</span>
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Engineer Inspection Notes
                </label>
                <textarea
                  rows={2}
                  defaultValue={selectedDefect.notes || ''}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add site observation notes..."
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleVerify}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors ${
                  selectedDefect.status === 'verified'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{selectedDefect.status === 'verified' ? 'Verified ✓' : 'Verify Defect'}</span>
              </button>
              <button
                onClick={handleReject}
                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
              >
                <XCircle className="w-3.5 h-3.5 text-rose-500" />
                <span>Reject</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAssign}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors ${
                  selectedDefect.status === 'assigned'
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{selectedDefect.status === 'assigned' ? 'Assigned ✓' : 'Dispatch / Assign'}</span>
              </button>
              <button
                onClick={handleResolve}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors ${
                  selectedDefect.status === 'resolved'
                    ? 'bg-emerald-800 text-white'
                    : 'bg-slate-900 hover:bg-black text-white'
                }`}
              >
                <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{selectedDefect.status === 'resolved' ? 'Resolved ✓' : 'Mark Resolved'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
