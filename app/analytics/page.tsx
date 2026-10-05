'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Layers,
  Calendar,
  Filter,
  CheckCircle2,
  DollarSign,
  Activity,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useRoadVision } from '@/lib/context/RoadVisionContext';

// Chart datasets
const HEALTH_TREND_DATA = [
  { month: 'May 2026', nh48: 86, nh66: 92, weh: 74, avg: 84 },
  { month: 'Jun 2026', nh48: 84, nh66: 91, weh: 72, avg: 82 },
  { month: 'Jul 2026 (Monsoon)', nh48: 76, nh66: 88, weh: 67, avg: 77 },
  { month: 'Aug 2026', nh48: 72, nh66: 86, weh: 64, avg: 74 },
  { month: 'Sep 2026', nh48: 74, nh66: 87, weh: 66, avg: 76 },
  { month: 'Oct 2026 (Current)', nh48: 74, nh66: 88, weh: 68, avg: 77 },
];

const DEFECT_SEVERITY_PIE = [
  { name: 'Critical (Immediate)', value: 47, color: '#DC2626' },
  { name: 'High (7-Day)', value: 194, color: '#EA580C' },
  { name: 'Medium (14-Day)', value: 520, color: '#D97706' },
  { name: 'Low / Aesthetic', value: 523, color: '#2563EB' },
];

const ROAD_SEGMENT_DEFECTS = [
  { name: 'NH-48 Sec 1', critical: 2, high: 6, medium: 14 },
  { name: 'NH-48 Sec 2', critical: 3, high: 8, medium: 18 },
  { name: 'NH-48 Sec 3 (Expressway)', critical: 7, high: 18, medium: 24 },
  { name: 'NH-66 Coastal', critical: 2, high: 9, medium: 18 },
  { name: 'WEH Urban', critical: 12, high: 31, medium: 36 },
  { name: 'EEH Flyovers', critical: 3, high: 8, medium: 11 },
];

export default function AnalyticsPage() {
  const { stats, roadAssets } = useRoadVision();
  const [selectedHighway, setSelectedHighway] = useState('all');
  const [timeRange, setTimeRange] = useState('6m');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Network Analytics & Telemetry
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              Updated Live
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Infrastructure Intelligence & Degradation Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Corridor deterioration modeling, defect frequency trends, and automated maintenance expenditure forecasting.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 text-xs">
          <select
            value={selectedHighway}
            onChange={(e) => setSelectedHighway(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Corridors</option>
            <option value="nh48">NH-48 Mumbai–Pune</option>
            <option value="nh66">NH-66 Coastal</option>
            <option value="weh">Western Express Highway</option>
          </select>

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="1m">Last 30 Days</option>
            <option value="6m">Last 6 Months</option>
            <option value="1y">Last 1 Year</option>
          </select>
        </div>
      </div>

      {/* Top Metric Cards Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1: Network Health Score */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Network PCI Health Score
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-blue-600">82.4</span>
              <span className="text-xs text-slate-400">/ 100</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded ml-auto">
                Good State
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Weighted across 642 km audited pavement
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-500">Surface Smoothness:</span>
              <span className="font-bold text-slate-800">84%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Safety Index:</span>
              <span className="font-bold text-slate-800">79%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Lane Marking Quality:</span>
              <span className="font-bold text-slate-800">88%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Shoulder Stability:</span>
              <span className="font-bold text-slate-800">76%</span>
            </div>
          </div>
        </div>

        {/* Card 2: Critical Exposure */}
        <div className="bg-white p-5 rounded-2xl border border-red-200 bg-red-50/10 shadow-subtle flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-red-700 uppercase tracking-wider">
              Active Critical Hazards
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-red-600">47</span>
              <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded ml-auto">
                Action Req
              </span>
            </div>
            <p className="text-[11px] text-red-600 mt-1">
              Estimated 18% accident risk escalation
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-red-100 text-xs text-slate-600">
            Potholes &gt;5cm deep comprise 62% of critical hazard volume on high-speed corridors.
          </div>
        </div>

        {/* Card 3: Budget Forecast */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Forecasted Repair Budget
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-slate-900">₹82.6 L</span>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded ml-auto">
                FY 26-27
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Saves ₹4.2 Cr in delayed resurfacing
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
            Early micro-surfacing and crack routing delivers 5.1x return on maintenance capital.
          </div>
        </div>

        {/* Card 4: Inspection Efficiency */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Inspection Velocity
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-emerald-600">12.5x</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded ml-auto">
                Faster
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Vs traditional manual walking surveys
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
            Multi-camera rig operates at 65 km/h highway speeds with 42ms/frame inference.
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Road Health Trend over Months (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-subtle">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Pavement Condition Index (PCI) Degradation Trend
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Pre- and post-monsoon pavement durability trajectory
              </p>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              Monthly Avg
            </span>
          </div>

          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HEALTH_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="avg"
                  name="Network Mean PCI"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorAvg)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Defect Severity Distribution (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-subtle">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Severity Breakdown Distribution
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                1,284 total defects classified by urgency
              </p>
            </div>
          </div>

          <div className="h-72 mt-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DEFECT_SEVERITY_PIE}
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {DEFECT_SEVERITY_PIE.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value) => <span className="text-xs text-slate-600 font-medium">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Defects by Highway Segment (Full 12 cols) */}
        <div className="lg:col-span-12 bg-white rounded-2xl border border-slate-200 p-5 shadow-subtle">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Defect Volume by Highway Segment & Priority
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Stacked defect count comparison across surveyed arterial routes
              </p>
            </div>
          </div>

          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ROAD_SEGMENT_DEFECTS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  formatter={(value) => <span className="text-xs text-slate-600 font-medium">{value}</span>}
                />
                <Bar dataKey="critical" name="Critical" stackId="a" fill="#DC2626" />
                <Bar dataKey="high" name="High Priority" stackId="a" fill="#EA580C" />
                <Bar dataKey="medium" name="Medium / Routine" stackId="a" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
