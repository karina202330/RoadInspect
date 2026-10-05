'use client';

import React, { useState } from 'react';
import {
  Settings,
  User,
  Building,
  Cpu,
  Bell,
  Database,
  Save,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useRoadVision } from '@/lib/context/RoadVisionContext';

export default function SettingsPage() {
  const { showToast } = useRoadVision();

  const [activeTab, setActiveTab] = useState<'profile' | 'organization' | 'ai' | 'notifications'>('profile');

  // Profile state
  const [name, setName] = useState('Harsh Rathod');
  const [role, setRole] = useState('Chief Inspection Director & Pavement Specialist');
  const [email, setEmail] = useState('harsh.rathod@nhai-audit.gov.in');
  const [license, setLicense] = useState('IRC-CIVIL-ENG-2018-9941');

  // AI State
  const [model, setModel] = useState('YOLO-v11x-RoadDistress-f88a91c');
  const [defaultSensitivity, setDefaultSensitivity] = useState('high');
  const [telemetryOverlay, setTelemetryOverlay] = useState(true);

  const handleSave = () => {
    showToast('Settings Saved', 'System preferences and inspector credentials updated successfully.', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Administration
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              v4.2.0 Enterprise
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            System & Organization Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure highway authority credentials, computer vision inference parameters and audit standards.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm shadow-blue-500/25 transition-all self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs">
        {[
          { key: 'profile', label: 'Inspector Profile', icon: User },
          { key: 'organization', label: 'Agency & Jurisdiction', icon: Building },
          { key: 'ai', label: 'AI Vision Pipeline', icon: Cpu },
          { key: 'notifications', label: 'Alert Preferences', icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Settings Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-subtle space-y-6">
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Lead Certifying Engineer Credentials</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Printed on official inspection reports and digital certification signatures.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Official Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Official Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  IRC Certification License ID
                </label>
                <input
                  type="text"
                  value={license}
                  onChange={(e) => setLicense(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'organization' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Highway Authority & Jurisdiction</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Organizational entity issuing work orders and tenders.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Parent Agency</label>
                <input
                  type="text"
                  defaultValue="National Highways Authority of India (NHAI)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Regional Division</label>
                <input
                  type="text"
                  defaultValue="Maharashtra Corridor Regional Office (RO Mumbai)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Audit Standard</label>
                <input
                  type="text"
                  defaultValue="IRC:82-2015 & MoRTH Specifications for Road & Bridge Works"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Currency Format</label>
                <input
                  type="text"
                  defaultValue="INR (₹ Lakhs / Crores)"
                  disabled
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-lg font-medium text-slate-500"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Computer Vision Inference Architecture</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Model configurations for automated bounding box detection and classification.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">Inference Engine Model</span>
                <span className="font-mono text-blue-700 font-semibold">{model}</span>
                <p className="text-[11px] text-slate-500 mt-1">
                  11th Generation YOLO architecture pre-trained on 2.4 million labeled asphalt distress frames.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Default Sensitivity Setting
                </label>
                <select
                  value={defaultSensitivity}
                  onChange={(e) => setDefaultSensitivity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium focus:outline-none focus:border-blue-500"
                >
                  <option value="low">Low (Critical hazards only)</option>
                  <option value="standard">Standard (Balanced PCI rating)</option>
                  <option value="high">High (Deep structural audit)</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="font-bold text-slate-800 block">Render HUD Telemetry Overlay</span>
                  <span className="text-[11px] text-slate-500">
                    Display GPS, speed, and chainage overlay directly on inspection canvas
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={telemetryOverlay}
                  onChange={(e) => setTelemetryOverlay(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Automated Dispatch & SLA Alerts</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Control notification triggers for emergency road repairs.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              {[
                { label: 'Immediate SMS/Email for Critical Potholes (>5cm depth)', defaultChecked: true },
                { label: 'Weekly Consolidated Infrastructure Health Digest', defaultChecked: true },
                { label: 'Contractor Work Order Verification Reminders', defaultChecked: true },
                { label: 'AI Model Inference Calibration Diagnostics', defaultChecked: false },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200"
                >
                  <span className="font-medium text-slate-800">{item.label}</span>
                  <input
                    type="checkbox"
                    defaultChecked={item.defaultChecked}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
